# IslandSurvivor

IslandSurvivor is a small browser-based WebGL survival game. Move around the island, chop trees, collect wood, build the required structures, and escape once the objectives are complete.

## Launch

1. Open the project folder in VS Code or any static file server.
2. Serve the repo root with a local web server. A simple option is the VS Code Live Server extension.
3. Open `index.html` in a WebGL-enabled browser.

## Controls

- `W`, `A`, `S`, `D` to move
- `E` to chop or build when standing in the correct area

## Project Layout

- `Game.js` bootstraps the application.
- `modules/engine` contains the rendering and loader code.
- `modules/game` contains gameplay controllers and game objects.
- `assets/scenes` contains the runtime glTF scene.
- `assets/fonts` contains the HUD font files.
- `assets/archive` contains the old scene exports and source asset dumps that are not part of the runtime path.
