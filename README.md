# Photorealistic 3D Chess - React & Three.js

A production-ready, web-based chess game featuring photorealistic 3D visuals, a robust chess engine, and a polished user experience. This project was built with Vite, React, TypeScript, `react-three-fiber`, and `chess.js`.

![In-game screenshot of the 3D chess board](https://s3.ap-southeast-1.amazonaws.com/prod.pronto.ubersnap/event/689e1baeae58ae7865297433/media/dde42feb-71ac-4264-b2c9-45f24d4dd2ad/original.jpeg)

## Features

- **Photorealistic 3D Board & Pieces**: Rendered with `react-three-fiber` using PBR materials and HDRI lighting.
- **Customizable Environments**: Switch between multiple HDR backgrounds to change the game's lighting and mood.
- **2D Fallback Mode**: Gracefully degrades to a 2D CSS-based board on devices without WebGL support.
- **Complete Chess Logic**: Powered by `chess.js` for move validation, check/checkmate detection, and PGN handling.
- **Polished UI**: Clear visual feedback for piece selection, legal moves, and game status.
- **Game Controls**: Includes timers with increment, full move history, undo, resign, and new game functionality.
- **Performant & Modern**: Built with Vite, TypeScript, and functional React components with hooks.

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/semih-suran/3Dchess.git](https://github.com/semih-suran/3Dchess.git)
    cd 3Dchess
    ```

2.  **Install dependencies:**
    This project has some specific peer dependency requirements. The recommended way to install is with the `--legacy-peer-deps` flag.
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Available Scripts

-   `npm run dev`: Starts the development server with Hot Module Replacement.
-   `npm run build`: Compiles and bundles the application for production.
-   `npm run preview`: Serves the production build locally for testing.
-   `npm test`: Runs the unit and integration tests with Vitest.
-   `npm run lint`: Analyzes code for potential errors and style issues.

---

## Developer Checklist: Production Assets

This project is set up to be easily customized with your own 3D assets.

1.  **HDRI Environment Maps**:
    -   Place your `.hdr` files in the `/public/assets/env/` directory.
    -   Update the `environmentOptions` array in `src/components/Scoreboard.tsx` to match your file names (without the `.hdr` extension).

2.  **Chess Piece Models**:
    -   The project uses a single set of textureless models and colors them programmatically.
    -   Place your `.glb` files for each piece type (e.g., `king.glb`, `pawn.glb`) in `/public/assets/models/`.
    -   Ensure the file names match the `pieceFileMap` in `src/components/Piece3D.tsx`.
