(function () {
  const e = React.createElement;
  const useEffect = React.useEffect;
  const useMemo = React.useMemo;
  const useState = React.useState;
  const MAX_SLOTS = 8;
  const MIN_CATALOG_COLUMNS = 5;
  const MAX_CATALOG_COLUMNS = 10;
  const DEFAULT_CATALOG_COLUMNS = 6;
  const ORIGINAL_ORDER = [
    'sunflower',
    'peashooter',
    'wallnut',
    'potatomine',
    'cabbagepult',
    'bloomerang',
    'iceburg',
    'gravebuster',
    'twinsunflower',
    'bonkchoy',
    'repeater',
    'iceweed',
    'snowdrop',
    'squash',
    'dandelion',
    'pvine',
    'kernelpult',
    'snapdragon',
    'spikeweed',
    'coconutcannon',
    'cherry_bomb',
    'springbean',
    'spikerock',
    'threepeater',
    'buttercup',
    'splitpea',
    'chilibean',
    'lightningreed',
    'tallnut',
    'jalapeno',
    'peapod',
    'melonpult',
    'wintermelon',
    'imitater',
    'electricpeashooter',
    'sapfling',
    'electriccurrant',
    'marigold',
    'marigold_red',
    'marigold_orange',
    'marigold_yellow',
    'marigold_green',
    'marigold_blue',
    'marigold_pink',
    'marigold_purple',
    'laser_bean',
    'blover',
    'citron',
    'empea',
    'starfruit',
    'pinkstarfruit',
    'shootingstarfruit',
    'holonut',
    'magnifyinggrass',
    'powerplant',
    'powerplant_alpha',
    'powerplant_beta',
    'powerplant_gamma',
    'powerplant_delta',
    'powerplant_epsilon',
    'applemortar',
    'solartomato',
    'pumpkin',
    'hollyknight',
    'hollybarrierleaf',
    'hollybarrierleafplantfood',
    'gumnut',
    'hypnoshroom',
    'sunshroom',
    'puffshroom',
    'fumeshroom',
    'sunbean',
    'peanut',
    'magnetshroom',
    'scaredyshroom',
    'plantern',
    'vamporcini',
    'glaciershroom',
    'doomshroom',
    'lilypad',
    'tanglekelp',
    'bowlingbulb',
    'tool_projectile_bowlingbulb1',
    'tool_projectile_bowlingbulb2',
    'tool_projectile_bowlingbulb3',
    'tool_projectile_bowlingbulb_explode',
    'tool_projectile_bowlingbulb_iceburg',
    'tool_projectile_bowling_wallnut',
    'tool_projectile_bowling_explodeonut',
    'tool_projectile_bowling_holonut',
    'tool_projectile_bowling_primalwallnut',
    'tool_projectile_bowling_tallnut',
    'homingthistle',
    'guacodile',
    'banana',
    'seashroom',
    'chomper',
    'missiletoe',
    'seashooter',
    'ghostpepper',
    'parsnip',
    'icebloom',
    'hurrikale',
    'hotpotato',
    'pepperpult',
    'chardguard',
    'firepeashooter',
    'stunion',
    'xshot',
    'pyrevine',
    'jackolantern',
    'sweetpotato',
    'hotdate',
    'gatling',
    'megagatling',
    'torchwood',
    'lavaguava',
    'redstinger',
    'akee',
    'endurian',
    'toadstool',
    'stallia',
    'goldleaf',
    'zoybeanpod',
    'aloe',
    'shinevine',
    'firegourd',
    'snowpea',
    'bambooshoot',
    'turnip',
    'peach',
    'powerlily',
    'lychee',
    'solarsage',
    'cantaloupe',
    'bamboozle',
    'bamboobusket',
    'atombomb_seedling',
    'atombomb',
    'seedling',
    'strawburst',
    'cactus',
    'phatbeet',
    'phatbeet_rhythm',
    'celerystalker',
    'thymewarp',
    'electricblueberry',
    'garlic',
    'sporeshroom',
    'intensivecarrot',
    'caulipower',
    'bloominghearts',
    'grapeshot',
    'primalpeashooter',
    'primalwallnut',
    'perfumeshroom',
    'coldsnapdragon',
    'primalsunflower',
    'primalpotatomine',
    'shrinkingviolet',
    'meteorflower',
    'explodeonut',
    'skyshooter',
    'pineapple',
    'moonbean',
    'anthurium',
    'asparagus',
    'floawerPot',
    'moonflower',
    'nightshade',
    'shadowshroom',
    'dusklobber',
    'grimrose',
    'goldbloom',
    'escaperoot',
    'murkadamia',
    'shadowpeashooter',
    'noctarine',
    'gloomvine',
    'gloomshroom',
    'umbrellaleaf',
    'snappea',
    'cranjelly',
    'dragonbruit',
    'appeasemint',
    'enlightenmint',
    'reinforcemint',
    'bombardmint',
    'armamint',
    'spearmint',
    'wintermint',
    'enforcemint',
    'peppermint',
    'ailmint',
    'filamint',
    'enchantmint',
    'concealmint',
    'containmint'
  ];
  const SORT_OPTIONS = [
    { value: 'original', label: 'Original order' },
    { value: 'name', label: 'A-Z' },
    { value: 'sun-asc', label: 'Sun cost (low to high)' },
    { value: 'sun-desc', label: 'Sun cost (high to low)' }
  ];
  const SORT_VALUES = new Set(SORT_OPTIONS.map((option) => option.value));
  const STORAGE_KEY = 'pvzge-randomizer-state-v1';
  const STATE_VERSION = 1;

  function App() {
    const [bootstrap, setBootstrap] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
      let active = true;
      fetch('/api/bootstrap')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to load data: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (active) setBootstrap(data);
        })
        .catch((err) => {
          if (active) setError(err.message || 'Failed to load data');
        });

      return () => {
        active = false;
      };
    }, []);

    if (error) {
      return e('div', { className: 'screen screen-error' },
        e('div', { className: 'panel error-panel' },
          e('h1', null, 'Unable to start the app'),
          e('p', null, error)
        )
      );
    }

    if (!bootstrap) {
      return e('div', { className: 'screen' },
        e('div', { className: 'panel loading-panel' },
          e('h1', null, 'Gardendless Seed Chooser But Better'),
          e('h2', null, 'Loading data...')
        )
      );
    }

    return e(RandomizerApp, { bootstrap });
  }

  function RandomizerApp({ bootstrap }) {
    const initial = useMemo(() => loadState(bootstrap), [bootstrap]);
    const [settings, setSettings] = useState(initial.settings);
    const [deck, setDeck] = useState(initial.deck);
    const [search, setSearch] = useState(initial.search);

    const plantById = useMemo(() => {
      const map = new Map();
      bootstrap.plants.forEach((plant) => map.set(plant.id, plant));
      return map;
    }, [bootstrap]);

    const systemOptions = bootstrap.families;
    const worldOptions = bootstrap.worlds;

    useEffect(() => {
      saveState({ settings, deck, search });
    }, [settings, deck, search]);

    useEffect(() => {
      setDeck((current) => compactDeck(current, settings.slotCount));
    }, [settings.slotCount]);

    useEffect(() => {
      setDeck((current) => {
        const next = sanitizeDeckForSettings(current, settings, plantById);
        return decksEqual(current, next) ? current : next;
      });
    }, [settings, plantById]);

    const activeDeckIds = useMemo(() => deck.slice(0, settings.slotCount).filter(Boolean), [deck, settings.slotCount]);
    const selectedSet = useMemo(() => new Set(activeDeckIds), [activeDeckIds]);

    const originalOrder = useMemo(() => buildOriginalOrderMap(ORIGINAL_ORDER), []);

    const filteredPlants = useMemo(() => {
      const query = normalize(search);
      return bootstrap.plants.filter((plant) => {
        if (!query) return true;
        return [plant.name, plant.slug, plant.family, plant.world, String(plant.sunCost)]
          .some((value) => normalize(value).includes(query));
      });
    }, [bootstrap.plants, search]);

    const sortedPlants = useMemo(() => {
      const mode = settings.sortMode || 'original';
      if (mode === 'original') {
        if (!originalOrder.size) return filteredPlants;
        const indexed = filteredPlants.map((plant, index) => {
          const key = String(plant.id || '').toLowerCase();
          const order = originalOrder.get(key);
          return { plant, order: order ?? Number.POSITIVE_INFINITY, index };
        });
        indexed.sort((a, b) => (a.order - b.order) || (a.index - b.index));
        return indexed.map((entry) => entry.plant);
      }

      const items = filteredPlants.slice();
      if (mode === 'name') {
        return items.sort((a, b) => a.name.localeCompare(b.name, 'en'));
      }
      if (mode === 'sun-asc') {
        return items.sort((a, b) => (a.sunCost - b.sunCost) || a.name.localeCompare(b.name, 'en'));
      }
      if (mode === 'sun-desc') {
        return items.sort((a, b) => (b.sunCost - a.sunCost) || a.name.localeCompare(b.name, 'en'));
      }
      return filteredPlants;
    }, [filteredPlants, originalOrder, settings.sortMode]);

    const visiblePlants = useMemo(() => {
      return sortedPlants.flatMap((plant) => {
        const status = getPlantStatus(plant, settings, activeDeckIds);
        if (settings.hideUnavailable && status.blocked && !status.selected) {
          return [];
        }
        return [{ plant, status }];
      });
    }, [sortedPlants, settings, activeDeckIds]);

    const eligibleForRandom = useMemo(() => {
      return bootstrap.plants.filter((plant) => isSelectableBySettings(plant, settings));
    }, [bootstrap.plants, settings]);

    const eligibleSunCount = useMemo(() => eligibleForRandom.filter((plant) => plant.isSunProducer && !selectedSet.has(plant.id)).length, [eligibleForRandom, selectedSet]);

    function updateSettings(patch) {
      setSettings((current) => {
        const next = typeof patch === 'function' ? patch(current) : { ...current, ...patch };
        return sanitizeSettings(next, bootstrap);
      });
    }

    function toggleSetItem(key, value) {
      updateSettings((current) => {
        const items = new Set(current[key]);
        if (items.has(value)) {
          items.delete(value);
        } else {
          items.add(value);
        }
        return { ...current, [key]: Array.from(items) };
      });
    }

    function setSlotCount(value) {
      const nextSlotCount = clamp(Number(value) || 1, 1, MAX_SLOTS);
      setSettings((current) => sanitizeSettings({ ...current, slotCount: nextSlotCount }, bootstrap));
      setDeck((current) => compactDeck(current, nextSlotCount));
    }

    function addPlant(plantId) {
      setDeck((current) => {
        const active = current.slice(0, settings.slotCount).filter(Boolean);
        if (active.includes(plantId) || active.length >= settings.slotCount) {
          return current;
        }
        return packDeck([...active, plantId], settings.slotCount);
      });
    }

    function removePlant(slotIndex) {
      setDeck((current) => {
        const active = current.slice(0, settings.slotCount).filter(Boolean);
        if (slotIndex < 0 || slotIndex >= active.length) {
          return current;
        }
        active.splice(slotIndex, 1);
        return packDeck(active, settings.slotCount);
      });
    }

    function removePlantById(plantId) {
      setDeck((current) => {
        const active = current.slice(0, settings.slotCount).filter(Boolean);
        const index = active.indexOf(plantId);
        if (index === -1) {
          return current;
        }
        active.splice(index, 1);
        return packDeck(active, settings.slotCount);
      });
    }

    function clearDeck() {
      setDeck(packDeck([], settings.slotCount));
    }

    function randomizeDeck(fillMode) {
      setDeck((current) => {
        const active = current.slice(0, settings.slotCount).filter(Boolean);
        const base = fillMode === 'rest' ? active.map((id) => plantById.get(id)).filter(Boolean) : [];
        const baseIds = base.map((plant) => plant.id);
        const already = new Set(baseIds);
        let pool = eligibleForRandom.filter((plant) => !already.has(plant.id));
        const needSun = settings.requireSunProducer && !base.some((plant) => plant.isSunProducer);

        const chosen = base.slice();
        if (needSun) {
          const sunPool = pool.filter((plant) => plant.isSunProducer);
          if (sunPool.length) {
            const sunPick = pickRandom(sunPool);
            chosen.push(sunPick);
            already.add(sunPick.id);
            pool = pool.filter((plant) => plant.id !== sunPick.id);
          }
        }

        shuffle(pool);
        while (chosen.length < settings.slotCount && pool.length) {
          chosen.push(pool.shift());
        }

        return packDeck(chosen.map((plant) => plant.id), settings.slotCount);
      });
    }

    function resetFilters() {
      setSettings(sanitizeSettings(createDefaultSettings(bootstrap), bootstrap));
    }

    const availableCount = eligibleForRandom.filter((plant) => !selectedSet.has(plant.id)).length;
    const blockedCount = visiblePlants.filter((item) => item.status.blocked).length;
    const activeCount = activeDeckIds.length;

    return e('div', { className: 'app-shell' },
      e('header', { className: 'topbar' },
        e('a', { className: 'brand', href: 'https://pvzge.com/en/', target: '_blank', rel: 'noopener noreferrer' },
          e('img', { className: 'brand-logo', src: '/images/pvzg_nav.webp', alt: 'PvZ Gardendless' }),
          e('div', { className: 'brand-text' },
            e('h1', null, 'Seed Chooser But Better')
          )
        ),
        e('div', { className: 'topbar-stats' },
          e(StatChip, { label: 'Plants', value: bootstrap.stats.totalPlants }),
          e(StatChip, { label: 'Selected', value: activeCount }),
          e(StatChip, { label: 'Available', value: availableCount }),
          e(StatChip, { label: 'Blocked', value: blockedCount })
        )
      ),

      e('main', { className: 'layout-grid' },
        e('section', { className: 'panel deck-panel' },
          e('div', { className: 'panel-header' },
            e('div', null,
              e('h2', null, 'Deck'),
              e('p', null, `${activeCount}/${settings.slotCount} slots used`)
            )
          ),

          e('div', { className: 'deck-grid' },
            Array.from({ length: MAX_SLOTS }).map((_, index) => {
              const plantId = deck[index];
              const plant = plantId ? plantById.get(plantId) : null;
              const isActiveSlot = index < settings.slotCount;
              return e(DeckSlot, {
                key: index,
                index: index + 1,
                plant,
                active: isActiveSlot,
                onRemove: () => removePlant(index),
                onClick: () => plant && removePlant(index)
              });
            })
          ),

          e('div', { className: 'panel-actions deck-actions' },
            e('button', { className: 'action-btn compact', onClick: () => randomizeDeck('all'), disabled: !eligibleForRandom.length }, 'Randomize all'),
            e('button', { className: 'action-btn compact small', onClick: () => randomizeDeck('rest'), disabled: !activeDeckIds.length && !eligibleForRandom.length }, 'Randomize the rest'),
            e('button', { className: 'action-btn ghost compact', onClick: clearDeck }, 'Clear')
          )
        ),

        e('section', { className: 'panel catalog-panel' },
          e('div', { className: 'panel-header catalog-header' },
            e('div', null,
              e('h2', null, 'Plant catalog'),
              e('p', null, `Showing ${visiblePlants.length} / ${bootstrap.plants.length} plants`)
            ),
            e('label', { className: 'search-box' },
              e('span', null, 'Search'),
              e('input', {
                value: search,
                onChange: (event) => setSearch(event.target.value),
                placeholder: 'Name, world, family, sun cost...'
              })
            )
          ),

          e('div', { className: 'catalog-scroll' },
            e('div', { className: 'catalog-grid', style: { '--catalog-columns': String(settings.catalogColumns) } },
              visiblePlants.map(({ plant, status }) =>
                e(PlantCard, {
                  key: plant.id,
                  plant,
                  status,
                  selected: selectedSet.has(plant.id),
                  onSelect: () => addPlant(plant.id),
                  onRemove: () => removePlantById(plant.id),
                  showInfo: settings.showPlantInfo
                })
              )
            )
          )
        ),

        e('aside', { className: 'panel settings-panel' },
          e('div', { className: 'panel-header' },
            e('div', null,
              e('h2', null, 'Settings'),
              e('p', null, 'Filters, limits, and random logic')
            ),
            e('button', { className: 'action-btn ghost', onClick: resetFilters }, 'Reset')
          ),

          e(SettingsSection, {
            title: 'Include families',
            helper: 'Choose families allowed in the deck',
            children: e(ChipGroup, {
              values: settings.systems,
              options: systemOptions,
              onToggle: (value) => toggleSetItem('systems', value),
              onSelectAll: () => updateSettings({ systems: systemOptions.slice() }),
              onClearAll: () => updateSettings({ systems: [] })
            })
          }),

          e(SettingsSection, {
            title: 'Include worlds',
            helper: 'Worlds are inferred from existing metadata',
            children: e(ChipGroup, {
              values: settings.worlds,
              options: worldOptions,
              onToggle: (value) => toggleSetItem('worlds', value),
              onSelectAll: () => updateSettings({ worlds: worldOptions.slice() }),
              onClearAll: () => updateSettings({ worlds: [] })
            })
          }),

          e(SettingsSection, {
            title: 'Sort catalog',
            helper: 'Choose one sort order',
            children: e(SingleSelectGroup, {
              value: settings.sortMode,
              options: SORT_OPTIONS,
              onChange: (value) => updateSettings({ sortMode: value })
            })
          }),

          e(SettingsSection, {
            title: 'Plant traits',
            helper: 'Filter mint, aquatic, and aerial plants',
            children: e('div', { className: 'switch-stack' },
              e(ToggleRow, {
                label: 'Include mint plants',
                checked: settings.includeMint,
                onChange: (checked) => updateSettings({ includeMint: checked })
              }),
              e(ToggleRow, {
                label: 'Include aquatic plants',
                checked: settings.includeAquatic,
                onChange: (checked) => updateSettings({ includeAquatic: checked })
              }),
              e(ToggleRow, {
                label: 'Include aerial plants',
                checked: settings.includeAerial,
                onChange: (checked) => updateSettings({ includeAerial: checked })
              })
            )
          }),

          e(SettingsSection, {
            title: 'Catalog layout',
            helper: 'Set columns and info display (5-10)',
            children: e('div', { className: 'switch-stack' },
              e(NumberField, {
                label: 'Plants per row',
                value: settings.catalogColumns,
                min: MIN_CATALOG_COLUMNS,
                max: MAX_CATALOG_COLUMNS,
                onChange: (value) => updateSettings({ catalogColumns: clamp(value, MIN_CATALOG_COLUMNS, MAX_CATALOG_COLUMNS) })
              }),
              e(ToggleRow, {
                label: 'Show plant info',
                checked: settings.showPlantInfo,
                onChange: (checked) => updateSettings({ showPlantInfo: checked })
              }),
              e(ToggleRow, {
                label: 'Hide unavailable plants',
                checked: settings.hideUnavailable,
                onChange: (checked) => updateSettings({ hideUnavailable: checked })
              })
            )
          }),

          e(SettingsSection, {
            title: 'Sun cost',
            helper: 'Limit minimum and maximum sun cost',
            children: e('div', { className: 'range-row' },
              e(NumberField, {
                label: 'Min',
                value: settings.sunMin,
                min: 0,
                max: settings.sunMax,
                onChange: (value) => updateSettings({ sunMin: clamp(value, 0, settings.sunMax) })
              }),
              e(NumberField, {
                label: 'Max',
                value: settings.sunMax,
                min: settings.sunMin,
                max: 1000,
                onChange: (value) => updateSettings({ sunMax: clamp(value, settings.sunMin, 1000) })
              })
            )
          }),

          e(SettingsSection, {
            title: 'Random rules',
            helper: 'Ensure the deck has at least one sun producer',
            children: e('div', { className: 'switch-stack' },
              e(ToggleRow, {
                label: 'Require a sun producer',
                checked: settings.requireSunProducer,
                onChange: (checked) => updateSettings({ requireSunProducer: checked })
              }),
              e('div', { className: 'inline-note' }, `Available sun producers: ${eligibleSunCount}`)
            )
          }),

          e(SettingsSection, {
            title: 'Slot count',
            helper: 'Deck supports up to 8 slots',
            children: e(NumberField, {
              label: 'Slots',
              value: settings.slotCount,
              min: 1,
              max: MAX_SLOTS,
              onChange: (value) => setSlotCount(value)
            })
          })
        )
      )
    );
  }

  function PlantCard({ plant, status, selected, onSelect, onRemove, showInfo }) {
    const [failed, setFailed] = useState(false);
    const className = [
      'plant-card',
      selected ? 'is-selected' : '',
      status.blocked ? 'is-blocked' : '',
      status.full ? 'is-full' : '',
      selected && status.blocked ? 'is-selected-blocked' : '',
      showInfo ? '' : 'info-hidden'
    ].filter(Boolean).join(' ');

    return e('button', {
      className,
      onClick: selected ? onRemove : status.blocked || status.full ? undefined : onSelect,
      title: selected ? 'Click to remove' : status.reasons.length ? status.reasons.join(' • ') : 'Selectable'
    },
      e('div', { className: 'plant-media' },
        plant.image && !failed
          ? e('img', { src: plant.image, alt: plant.name, onError: () => setFailed(true) })
          : e('div', { className: 'plant-fallback' }, initials(plant.name))
      ),
      showInfo
        ? e('div', { className: 'plant-meta' },
          e('div', { className: 'plant-title' }, plant.name),
          e('div', { className: 'plant-subtitle' }, `${plant.world} • ${plant.family}`),
          e('div', { className: 'plant-footer' },
            e('span', { className: 'badge cost' }, `${plant.sunCost} sun`),
            plant.isMint ? e('span', { className: 'badge mint' }, 'Mint') : null,
            plant.isAquatic ? e('span', { className: 'badge aquatic' }, 'Aquatic') : null,
            plant.isAerial ? e('span', { className: 'badge aerial' }, 'Aerial') : null,
            plant.isSunProducer ? e('span', { className: 'badge sun' }, 'Sun') : null
          ),
          status.reasons.length ? e('div', { className: 'plant-reason' }, status.reasons[0]) : null
        )
        : null
    );
  }

  function DeckSlot({ index, plant, active, onClick }) {
    const className = ['deck-slot', active ? 'active' : 'inactive', plant ? 'filled' : 'empty'].join(' ');
    return e('button', { className, onClick: active && plant ? onClick : undefined, title: plant ? 'Click to remove' : active ? 'Empty slot' : 'Locked slot' },
      e('div', { className: 'slot-index' }, index),
      plant
        ? e('div', { className: 'slot-card' },
          plant.image
            ? e('img', { src: plant.image, alt: plant.name })
            : e('div', { className: 'plant-fallback small' }, initials(plant.name))
        )
        : e('div', { className: 'slot-empty' }, active ? 'Empty' : 'Locked')
    );
  }

  function SettingsSection({ title, helper, children }) {
    return e('section', { className: 'settings-section' },
      e('div', { className: 'settings-title' }, title),
      e('div', { className: 'settings-helper' }, helper),
      children
    );
  }

  function ChipGroup({ values, options, onToggle, onSelectAll, onClearAll }) {
    return e('div', null,
      e('div', { className: 'chip-actions' },
        e('button', { className: 'tiny-btn', onClick: onSelectAll }, 'All'),
        e('button', { className: 'tiny-btn ghost', onClick: onClearAll }, 'None')
      ),
      e('div', { className: 'chip-grid' },
        options.map((option) => e('button', {
          key: option,
          className: values.includes(option) ? 'chip active' : 'chip',
          onClick: () => onToggle(option)
        }, option))
      )
    );
  }

  function SingleSelectGroup({ value, options, onChange }) {
    return e('div', { className: 'chip-grid' },
      options.map((option) => e('button', {
        key: option.value,
        className: value === option.value ? 'chip active' : 'chip',
        onClick: () => onChange(option.value)
      }, option.label))
    );
  }

  function ToggleRow({ label, checked, onChange }) {
    return e('label', { className: 'toggle-row' },
      e('span', null, label),
      e('input', {
        type: 'checkbox',
        checked,
        onChange: (event) => onChange(event.target.checked)
      })
    );
  }

  function NumberField({ label, value, min, max, onChange }) {
    return e('label', { className: 'number-field' },
      e('span', null, label),
      e('input', {
        type: 'number',
        value,
        min,
        max,
        onChange: (event) => onChange(Number(event.target.value))
      })
    );
  }

  function StatChip({ label, value }) {
    return e('div', { className: 'stat-chip' },
      e('span', { className: 'stat-label' }, label),
      e('strong', null, value)
    );
  }

  function loadState(bootstrap) {
    const defaults = createDefaultSettings(bootstrap);
    const empty = { settings: defaults, deck: packDeck([], defaults.slotCount), search: '' };
    if (!window.localStorage) return empty;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return empty;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== STATE_VERSION) return empty;

      const settings = sanitizeSettings(parsed.settings || defaults, bootstrap);
      const deck = compactDeck(Array.isArray(parsed.deck) ? parsed.deck : [], settings.slotCount);
      const search = typeof parsed.search === 'string' ? parsed.search : '';
      return { settings, deck, search };
    } catch (_error) {
      return empty;
    }
  }

  function saveState(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STATE_VERSION, ...state }));
    } catch (_error) {
      return;
    }
  }

  function createDefaultSettings(bootstrap) {
    return {
      systems: bootstrap.families.slice(),
      worlds: bootstrap.worlds.slice(),
      includeMint: true,
      includeAquatic: true,
      includeAerial: true,
      showPlantInfo: true,
      hideUnavailable: false,
      catalogColumns: DEFAULT_CATALOG_COLUMNS,
      sortMode: 'original',
      sunMin: 0,
      sunMax: 1000,
      requireSunProducer: false,
      slotCount: MAX_SLOTS
    };
  }

  function sanitizeSettings(settings, bootstrap) {
    const nextSystems = Array.isArray(settings.systems) ? settings.systems.filter((item) => bootstrap.families.includes(item)) : [];
    const nextWorlds = Array.isArray(settings.worlds) ? settings.worlds.filter((item) => bootstrap.worlds.includes(item)) : [];
    const slotCount = clamp(Number(settings.slotCount) || MAX_SLOTS, 1, MAX_SLOTS);
    const catalogColumns = clamp(Number(settings.catalogColumns) || DEFAULT_CATALOG_COLUMNS, MIN_CATALOG_COLUMNS, MAX_CATALOG_COLUMNS);
    let sunMin = clamp(Number(settings.sunMin) || 0, 0, 1000);
    let sunMax = clamp(Number(settings.sunMax) || 1000, 0, 1000);

    if (sunMin > sunMax) {
      const temp = sunMin;
      sunMin = sunMax;
      sunMax = temp;
    }

    const includeAerial = settings.includeAerial === undefined ? true : Boolean(settings.includeAerial);
    const showPlantInfo = settings.showPlantInfo === undefined ? true : Boolean(settings.showPlantInfo);
    const hideUnavailable = settings.hideUnavailable === undefined ? false : Boolean(settings.hideUnavailable);
    const sortMode = SORT_VALUES.has(settings.sortMode) ? settings.sortMode : 'original';

    return {
      systems: Array.isArray(settings.systems) ? nextSystems : bootstrap.families.slice(),
      worlds: Array.isArray(settings.worlds) ? nextWorlds : bootstrap.worlds.slice(),
      includeMint: Boolean(settings.includeMint),
      includeAquatic: Boolean(settings.includeAquatic),
      includeAerial,
      showPlantInfo,
      hideUnavailable,
      catalogColumns,
      sortMode,
      sunMin,
      sunMax,
      requireSunProducer: Boolean(settings.requireSunProducer),
      slotCount
    };
  }

  function isSelectableBySettings(plant, settings) {
    if (!settings.systems.includes(plant.family)) return false;
    if (!settings.worlds.includes(plant.world)) return false;
    if (!settings.includeMint && plant.isMint) return false;
    if (!settings.includeAquatic && plant.isAquatic) return false;
    if (!settings.includeAerial && plant.isAerial) return false;
    if (plant.sunCost < settings.sunMin) return false;
    if (plant.sunCost > settings.sunMax) return false;
    return true;
  }

  function getPlantStatus(plant, settings, activeDeckIds) {
    const reasons = [];
    const selected = activeDeckIds.includes(plant.id);
    if (!settings.systems.includes(plant.family)) reasons.push('Family not selected');
    if (!settings.worlds.includes(plant.world)) reasons.push('World not selected');
    if (!settings.includeMint && plant.isMint) reasons.push('Mint is disabled');
    if (!settings.includeAquatic && plant.isAquatic) reasons.push('Aquatic is disabled');
    if (!settings.includeAerial && plant.isAerial) reasons.push('Aerial is disabled');
    if (plant.sunCost < settings.sunMin) reasons.push(`Sun cost below ${settings.sunMin}`);
    if (plant.sunCost > settings.sunMax) reasons.push(`Sun cost above ${settings.sunMax}`);

    if (selected) {
      return { selected: true, blocked: reasons.length > 0, full: false, reasons };
    }

    if (reasons.length) {
      return { selected: false, blocked: true, full: false, reasons };
    }

    if (activeDeckIds.length >= settings.slotCount) {
      return { selected: false, blocked: false, full: true, reasons: ['Deck is full'] };
    }

    return { selected: false, blocked: false, full: false, reasons: [] };
  }

  function packDeck(plantIds, slotCount) {
    const active = plantIds.slice(0, slotCount);
    const next = Array.from({ length: MAX_SLOTS }, (_, index) => (index < slotCount ? (active[index] || null) : null));
    return next;
  }

  function compactDeck(deck, slotCount) {
    const active = Array.isArray(deck) ? deck.slice(0, slotCount).filter(Boolean) : [];
    return packDeck(active, slotCount);
  }

  function sanitizeDeckForSettings(deck, settings, plantById) {
    const active = [];
    const seen = new Set();
    const slice = Array.isArray(deck) ? deck.slice(0, settings.slotCount) : [];
    for (const plantId of slice) {
      if (!plantId || seen.has(plantId)) continue;
      const plant = plantById.get(plantId);
      if (!plant) continue;
      if (!isSelectableBySettings(plant, settings)) continue;
      seen.add(plantId);
      active.push(plantId);
    }
    return packDeck(active, settings.slotCount);
  }

  function decksEqual(a, b) {
    if (a === b) return true;
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(Number(value) || 0, min), max);
  }

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  }

  function initials(name) {
    return String(name || '?')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function buildOriginalOrderMap(order) {
    const map = new Map();
    if (!Array.isArray(order)) return map;
    order.forEach((id, index) => {
      const key = String(id || '').toLowerCase();
      if (key && !map.has(key)) {
        map.set(key, index);
      }
    });
    return map;
  }

  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = items[i];
      items[i] = items[j];
      items[j] = temp;
    }
    return items;
  }

  ReactDOM.createRoot(document.getElementById('root')).render(e(App));
})();
