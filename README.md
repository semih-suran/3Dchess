# Photorealistic 3D Chess - React & Three.js

This is a production-ready, web-based chess game featuring photorealistic 3D visuals, a robust chess engine, and a polished user experience. It's built with Vite, React, TypeScript, `react-three-fiber`, and `chess.js`.

![Chess Game Screenshot](https://placehold.co/800x450/262522/e8e6e3?text=Photorealistic+Chess+Game)

## Features

- **Photorealistic 3D Board & Pieces**: Rendered with `react-three-fiber` using PBR materials and HDRI lighting.
- **2D Fallback Mode**: Gracefully degrades to a 2D CSS-based board on devices without WebGL support.
- **Complete Chess Logic**: Powered by `chess.js` for move validation, check/checkmate detection, and PGN handling.
- **Interactive UI**: Click to select pieces, see legal moves highlighted with a soft glow, and animate piece movements.
- **Game Controls**: Includes timers with increment, move history, undo, resign, and new game functionality.
- **Performant & Modern**: Built with Vite, TypeScript, and functional React components with hooks.

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd your-project-folder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
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

This project uses placeholder assets to run out of the box. To achieve photorealistic visuals, you must replace them with high-quality PBR assets.

1.  **HDRI Environment Map**:
    -   Replace `/public/assets/env/studio.hdr` with a high-resolution HDRI file (e.g., from [Poly Haven](https://polyhaven.com/hdris)). A studio lighting environment works best for clean reflections.

2.  **Chess Piece Models**:
    -   Place your single-color `.glb` files for each piece type (e.g., `king.glb`, `pawn.glb`) in `/public/assets/models/`.
    -   The code in `src/components/Piece3D.tsx` will programmatically color them white or dark grey.

3.  **Board Textures (Optional)**:
    -   For an even more realistic board, you can apply PBR textures. You would modify the `Chessboard` component in `src/components/Board3D.tsx` to use `useTexture` from `@react-three/drei` and apply albedo, normal, and roughness maps to the `meshStandardMaterial`.
