# PvZ Gardendless Deck Randomizer

Web app built with ReactJS + NodeJS to pick PvZ Gardendless decks in a more visual way.

## Features
- Click a plant to add it to the next empty slot.
- Click a slot to remove and auto-compact the deck.
- Filter by family, world, mint, aquatic, sun cost.
- The deck auto-removes invalid plants when settings change.
- Selected plants are dimmed.
- Blocked plants are tinted red.
- Randomize all and randomize the rest.

## UI layout
- **Section 1**: deck slots, about 1/10 width.
- **Section 2**: plant catalog with scrollbar, about 3/5 width.
- **Section 3**: settings.

## Settings
- Included families
- Included worlds
- Include mint / aquatic plants
- Minimum sun cost
- Maximum sun cost
- Require at least one sun producer in the deck
- Slot count

## Run project
1. Open a terminal in the project folder.
2. Run `npm start` or `node server.js`.
3. Open `http://localhost:3000`.

## Data
- `PlantProps.json`: plant metadata.
- `PlantFeatures.json`: display names and obtain-world metadata.
- `images/`: plant thumbnails.

## Notes
- Worlds are mapped from `PlantFeatures.json` (OBTAINWORLD) because `PlantProps.json` has no explicit world field.
- React is loaded via CDN to avoid installing extra packages.
