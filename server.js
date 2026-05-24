const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const IMAGES_DIR = path.join(ROOT, 'images');
const PLANT_FILE = path.join(ROOT, 'PlantProps.json');
const PLANT_FEATURES_FILE = path.join(ROOT, 'PlantFeatures.json');
const PORT = Number(process.env.PORT || 3000);
const MAX_SLOTS = 8;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const SUN_PRODUCERS = new Set([
  'sunflower',
  'twinsunflower',
  'primalsunflower',
  'sunshroom',
  'sunbean',
  'solarsage',
  'goldbloom',
  'enlightenmint',
  'plantern',
  'shinevine',
  'solartomato',
  'moonflower'
]);

const AERIAL_PLANTS = new Set([
  'asparagus',
  'caulipower',
  'floawerpot',
  'ghostpepper',
  'moonbean',
  'enlightenmint',
  'pineapple',
  'rotobaga',
  'skyshooter',
  'solarsage'
]);

const WORLD_RULES = {
  frontyard: 'Front Yard',
  egypt: 'Ancient Egypt',
  pirate: 'Pirate Seas',
  cowboy: 'Wild West',
  future: 'Far Future',
  dark: 'Dark Ages',
  beach: 'Big Wave Beach',
  ice: 'Frostbite Caves',
  lostcity: 'Lost City',
  eighties: 'Neon Mixtape Tour',
  dino: 'Jurassic Marsh',
  modern: 'Modern Day',
  kongfu: 'Kongfu Temple',
  sky: 'Aerial Fortress',
  water: 'Big Wave Beach',
  market: 'Shop',
  epic: 'Epic',
  mint: 'Mint'
};

const plantSource = JSON.parse(fs.readFileSync(PLANT_FILE, 'utf8'));
const featureSource = fs.existsSync(PLANT_FEATURES_FILE)
  ? JSON.parse(fs.readFileSync(PLANT_FEATURES_FILE, 'utf8'))
  : { PLANTS: [] };
const featureLookup = buildFeatureLookup(Array.isArray(featureSource.PLANTS) ? featureSource.PLANTS : []);
const imageLookup = buildImageLookup(fs.existsSync(IMAGES_DIR) ? fs.readdirSync(IMAGES_DIR) : []);
const catalog = buildCatalog(Array.isArray(plantSource.objects) ? plantSource.objects : [], imageLookup, featureLookup);
const families = uniqueSorted(catalog.map((plant) => plant.family));
const worlds = uniqueSorted(catalog.map((plant) => plant.world));

const bootstrap = {
  version: plantSource.version || 1,
  stats: {
    totalPlants: catalog.length,
    sunPlants: catalog.filter((plant) => plant.isSunProducer).length,
    mintPlants: catalog.filter((plant) => plant.isMint).length,
    aquaticPlants: catalog.filter((plant) => plant.isAquatic).length
  },
  families,
  worlds,
  plants: catalog
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === '/api/bootstrap') {
    return sendJson(res, bootstrap);
  }

  if (pathname === '/api/health') {
    return sendJson(res, { ok: true });
  }

  if (pathname.startsWith('/images/')) {
    return serveFile(res, path.join(IMAGES_DIR, pathname.slice('/images/'.length)));
  }

  if (pathname === '/' || pathname === '/index.html') {
    return serveFile(res, path.join(PUBLIC_DIR, 'index.html'));
  }

  if (pathname === '/app.js' || pathname === '/styles.css') {
    return serveFile(res, path.join(PUBLIC_DIR, pathname.slice(1)));
  }

  const publicCandidate = path.join(PUBLIC_DIR, pathname);
  if (publicCandidate.startsWith(PUBLIC_DIR) && fs.existsSync(publicCandidate) && fs.statSync(publicCandidate).isFile()) {
    return serveFile(res, publicCandidate);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`GE Seed Chooser But Better running at http://localhost:${PORT}`);
});

function buildCatalog(objects, lookup, featureLookup) {
  return objects
    .filter((entry) => entry && Array.isArray(entry.aliases) && entry.aliases.length > 0 && entry.objdata)
    .map((entry) => {
      const slug = String(entry.aliases[0]);
      const data = entry.objdata || {};
      const feature = resolveFeature(slug, featureLookup);
      const name = resolveFeatureName(feature, slug);
      const world = resolveWorld(slug, feature);
      const family = String(data.Family || 'Unknown');
      const sunCost = Number(data.SunCost || 0);
      const imageFile = resolveImageFile(slug, lookup);
      const normalizedSlug = slug.toLowerCase();
      const isMint = /mint$/i.test(slug) || String(feature?.OBTAINWORLD || '').toLowerCase() === 'mint';
      const isAquatic = inferAquatic(slug, world);
      const isAerial = AERIAL_PLANTS.has(normalizedSlug);
      const isSunProducer = SUN_PRODUCERS.has(normalizedSlug);

      return {
        id: slug,
        slug,
        name,
        family,
        world,
        sunCost,
        cooldown: Number(data.Cooldown || data.CooldownFrom || 0),
        toughness: Number(data.Toughness || 0),
        isMint,
        isAquatic,
        isAerial,
        isSunProducer,
        image: imageFile ? `/images/${encodeURIComponent(imageFile)}` : null,
        tags: buildTags({ isMint, isAquatic, isAerial, isSunProducer, family, world })
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'en'));
}

function buildTags(plant) {
  const tags = [plant.family, plant.world];
  if (plant.isMint) tags.push('Mint');
  if (plant.isAquatic) tags.push('Aquatic');
  if (plant.isAerial) tags.push('Aerial');
  if (plant.isSunProducer) tags.push('Sun');
  return tags;
}

function resolveWorld(slug, feature) {
  const obtainWorld = typeof feature?.OBTAINWORLD === 'string' ? feature.OBTAINWORLD.trim().toLowerCase() : '';
  if (obtainWorld) {
    return WORLD_RULES[obtainWorld] || prettyWorld(obtainWorld);
  }
  if (feature) {
    return 'Unknown';
  }
  return inferWorldFromSlug(slug);
}

function inferWorldFromSlug(slug) {
  const normalized = slug.toLowerCase();
  if (/sea|lilypad|tanglekelp|guacodile|coconut|beach|aquatic|surf/.test(normalized)) return 'Big Wave Beach';
  if (/ice|snow|winter|cold|hurri|glacier|frost/.test(normalized)) return 'Frostbite Caves';
  if (/future|laser|electric|lightning|magnet|missile|xshot|starfruit|powerplant|sky/.test(normalized)) return 'Far Future';
  if (/shadow|ghost|night|moon|doom|gloom|grave|hypno|perfume|spore|vamp|conceal|noct/.test(normalized)) return 'Dark Ages';
  if (/primal|dino|jurassic|prehistoric|bone/.test(normalized)) return 'Jurassic Marsh';
  if (/gold|banana|pineapple|peach|dandelion|artifact|treasure|gem/.test(normalized)) return 'Lost City';
  if (/music|stunion|beat|dance|party|jam/.test(normalized)) return 'Neon Mixtape Tour';
  if (/cactus|pepper|jalapeno|torch|fire|lava|hot|cowboy|corn|pult/.test(normalized)) return 'Wild West';
  return 'Modern Day';
}

function inferAquatic(slug, world) {
  return /sea|lilypad|tanglekelp|guacodile|tallnut/.test(slug.toLowerCase());
}

function prettyName(slug) {
  const special = {
    atombomb: 'Atom Bomb',
    atombombseedling: 'Atom Bomb Seedling',
    laserbean: 'Laser Bean',
    celerystalker: 'Celery Stalker',
    coconutcannon: 'Coconut Cannon',
    pvin: 'Pvine',
    floawerpot: 'Flower Pot'
  };
  const normalized = slug.toLowerCase().replace(/_/g, '');
  if (special[normalized]) {
    return special[normalized];
  }

  return slug
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/[^a-zA-Z0-9 ]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function buildFeatureLookup(features) {
  const lookup = new Map();
  for (const feature of features) {
    if (!feature) continue;
    const keys = [];
    if (feature.CODENAME) keys.push(feature.CODENAME);
    if (feature._CARDSPRITENAME) keys.push(feature._CARDSPRITENAME);
    if (feature.RES?.Plant) keys.push(feature.RES.Plant);
    if (feature.RES?.Disabled) keys.push(feature.RES.Disabled);
    if (feature.PROPS) {
      const match = String(feature.PROPS).match(/\(([^@)]+)@/);
      if (match) keys.push(match[1]);
    }
    for (const key of keys) {
      const normalized = normalizeKey(key);
      if (normalized && !lookup.has(normalized)) {
        lookup.set(normalized, feature);
      }
    }
  }
  return lookup;
}

function resolveFeature(slug, featureLookup) {
  return featureLookup.get(normalizeKey(slug)) || null;
}

function resolveFeatureName(feature, slug) {
  const name = feature?.NAME?.en;
  if (name) return name;
  return prettyName(slug);
}

function prettyWorld(code) {
  return String(code || 'Unknown')
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function buildImageLookup(files) {
  const lookup = new Map();
  for (const file of files) {
    const normalized = normalizeKey(file
      .replace(/^plants_/i, '')
      .replace(/_c\.webp$/i, '')
      .replace(/\.webp$/i, ''));
    if (!lookup.has(normalized)) {
      lookup.set(normalized, file);
    }
  }
  return lookup;
}

function resolveImageFile(slug, lookup) {
  const normalized = normalizeKey(slug);
  if (lookup.has(normalized)) {
    return lookup.get(normalized);
  }

  let bestFile = null;
  let bestScore = Infinity;
  for (const [key, file] of lookup.entries()) {
    if (key.includes(normalized) || normalized.includes(key)) {
      const score = Math.abs(key.length - normalized.length);
      if (score < bestScore) {
        bestScore = score;
        bestFile = file;
      }
    }
  }

  return bestFile;
}

function normalizeKey(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function uniqueSorted(values) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'en'));
}

function sendJson(res, data) {
  const body = JSON.stringify(data);
  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function serveFile(res, filePath) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' || ext === '.js' || ext === '.css' ? 'no-store' : 'public, max-age=86400'
  });
  fs.createReadStream(filePath).pipe(res);
}
