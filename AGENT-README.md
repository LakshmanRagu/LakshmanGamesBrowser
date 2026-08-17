# AI Agent Instructions for Retro Portfolio Hub (Lakshman Ragubathy | Game Hub)

## Project Overview
This project is a single-page HTML/CSS/JS application that serves as a retro-themed portfolio and game hub for Lakshman Ragubathy. It features a space/void aesthetic, an Enderman theme, dynamic visual effects, and a Gamer RGB mode.

## Architecture
- **HTML**: `index.html` contains the structure (Navbar, Sidebar, Main Content).
- **CSS**: `css/style.css` contains all the styling, including CSS variables for theme colors.
- **JavaScript**:
  - `js/app.js`: Main application logic, including routing, storage, and rendering.
  - `js/three-bg.js`: Three.js or similar canvas background effects.
  - Scripts: `split.js` and Python scripts (`fix_css.py`, `split.py`) exist as utilities.
- **Configuration**: The global `CONFIG` object is located at the top of `js/app.js` and controls the games list, VFX states, and RGB mode configurations.

## Features & Blueprint
1. **Game Management**:
   - Games are configured in the `CONFIG.games` array in `js/app.js`.
   - Supports two types: `webgl` (playable in-browser via itch.io iframe) and `download` (external link).
   - Features automatic thumbnail resolution if `thumbnail` is left empty.
2. **Visual Effects (VFX)**:
   - Configurable via `CONFIG.vfx`.
   - Includes starry background (`stars`, `drift`), floating embers (`particles`), mouse trail (`trail`), and click bursts (`burst`).
3. **Theming & RGB Mode**:
   - `CONFIG.rgbMode` controls the dynamic HSL phase offsets for a "Gamer RGB Mode".
   - The user can toggle this mode, and it adjusts hues across different UI zones (borders, icons, Enderman eyes, void background).
   - Default theme color is stored in localStorage.
4. **State Management**:
   - Custom `Storage` object provides a robust fallback (localStorage -> sessionStorage -> in-memory) for iframe sandboxing.
   - Saves `recents`, `favorites`, `vfxConfig`, `rgbMode`, and `themeColor`.
5. **Search & Filtering**:
   - Includes real-time search functionality.
   - Allows users to favorite games and tracks recently viewed games.

## Important Context for AI Agents
- **Token Efficiency Note**: This document is intentionally written in structured Markdown text rather than binary. Language models use subword tokenization (like Byte-Pair Encoding), meaning well-structured English text is significantly more token-efficient and understandable for AI agents than raw binary or base64-encoded data, which fragments into many meaningless tokens.
- **Editing Configuration**: When asked to add games or change global settings, always modify the `CONFIG` object at the top of `js/app.js`.
- **Modifying UI**: Main layout changes should be done in `index.html`. For styling, adjust `css/style.css` which heavily utilizes CSS custom properties (variables) for the dynamic theming.
