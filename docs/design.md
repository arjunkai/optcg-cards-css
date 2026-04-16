# OPTCG Cards CSS — Design Spec

## Overview

A standalone React + Vite project that recreates realistic holographic card effects for One Piece TCG cards using CSS transforms, gradients, blend modes, and spring physics. Inspired by [simeydotme/pokemon-cards-css](https://github.com/simeydotme/pokemon-cards-css).

**Repo:** `optcg-cards-css` (new standalone repo under CardPipeline)
**Demo site:** static, deployable to Cloudflare Pages or GitHub Pages
**npm package:** publishable as a React component for OPBindr integration

## Tech Stack

- React 18+
- Vite
- Pure CSS (no preprocessor) for effect files
- OPTCG API (`https://optcg-api.arjunbansal-ai.workers.dev`) for card data + search

## 1. Card Component (`Card.jsx`)

The core interactive component. Renders a card image with 3D tilt and holographic overlay.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `image` | string | required | Card image URL |
| `effect` | string | `'none'` | Foil type: `holo`, `textured-holo`, `gold-textured`, `border-foil`, `gold-foil`, `sparkle`, `none` |
| `name` | string | `''` | Card name (accessibility + tooltip) |
| `className` | string | `''` | Additional CSS classes |

### Visual Layers (bottom to top)

1. **Card image** — `<img>` with `object-contain`, full card art including its printed border
2. **Shine layer** — holographic gradient overlay. Uses `mix-blend-mode: color-dodge`. Gradient position responds to `--pointer-x` and `--pointer-y` CSS variables.
3. **Glare layer** — radial gradient spotlight that follows cursor. Uses `mix-blend-mode: overlay`. Creates the "light hitting foil" look.
4. **Texture layer** — (textured effects only) grain/pattern overlay with `mix-blend-mode: multiply` for embossed surface simulation.

### Interaction

- **Spring physics tilt** via `useSpringTilt` hook — lerp-based animation loop (damping ~0.12)
- **Pointer tracking** on a static wrapper div (card tilts visually inside it to prevent edge jitter)
- **Auto-showcase mode** — when not interacting, card slowly oscillates to show off the effect
- **Entrance animation** — starts slightly tilted, springs to flat
- **Touch support** — `onTouchMove` mapped to same tilt logic

### CSS Variables (set by JS, consumed by CSS)

```
--pointer-x        /* 0-100, horizontal position */
--pointer-y        /* 0-100, vertical position */
--pointer-from-center  /* 0-1, distance from card center */
--rotate-x         /* degrees of X-axis rotation */
--rotate-y         /* degrees of Y-axis rotation */
--card-opacity     /* 0-1, glare visibility */
```

## 2. Spring Tilt Hook (`useSpringTilt.js`)

Extracted from the current OPBindr CardEnlargeModal tilt logic.

```
useSpringTilt({ damping, maxTilt }) → { 
  wrapperRef, tiltStyle, sheenPosition, 
  handlers: { onPointerMove, onPointerLeave, onTouchMove },
  isInteracting 
}
```

- `damping` — spring damping factor (default 0.12)
- `maxTilt` — max rotation degrees (default 14)
- `wrapperRef` — attach to the static wrapper div
- `tiltStyle` — object with `transform`, `willChange`, `transformStyle`
- `sheenPosition` — `{ x, y }` for gradient positioning (30-70% range)
- `isInteracting` — boolean, true while pointer is over card

Debounced pointer leave (100ms) to prevent edge bounce. Lerp animation via `requestAnimationFrame`.

## 3. CSS Effect Files

Six CSS files in `src/effects/`, each following the same layered structure:

### `holo.css` — SR, Leader, Special, Promo

**Shine:** Repeating rainbow linear-gradient at 110deg
```css
background: repeating-linear-gradient(
  110deg,
  #ff6b6b00 0%, #ff6b6b22 3%,
  #ffd93d00 6%, #ffd93d22 9%,
  #6bff6b00 12%, #6bff6b22 15%,
  #6bd4ff00 18%, #6bd4ff22 21%,
  #d46bff00 24%, #d46bff22 27%,
  #ff6b6b00 30%
);
mix-blend-mode: color-dodge;
```
Positioned via `background-position` linked to `--pointer-x/y`.

**Glare:** Radial gradient spotlight
```css
background: radial-gradient(
  farthest-corner circle at var(--pointer-x) var(--pointer-y),
  rgba(255,255,255,0.8) 10%, 
  rgba(255,255,255,0.3) 30%, 
  transparent 60%
);
mix-blend-mode: overlay;
opacity: var(--card-opacity, 0);
```

### `textured-holo.css` — Alt Art, Manga Art

Same as holo but with:
- Stronger shine opacity (colors at 33% instead of 22%)
- Texture layer: `grain.webp` background with `mix-blend-mode: multiply; opacity: 0.3`

### `gold-textured.css` — Secret Rare, Treasure Rare

- Shine: warm-shifted gradient (more gold/amber in the rainbow cycle)
- Glare: gold-tinted (`rgba(255, 240, 200, 0.8)` center)
- Texture: same grain overlay

### `border-foil.css` — Rare

- Shine: very subtle silver gradient, low opacity (~10%)
- Glare: faint spotlight, low opacity (~30%)
- No texture
- Intentionally muted — Rares barely shimmer

### `gold-foil.css` — Don Gold

- Shine: gold gradient only (no rainbow), `color-dodge`
```css
background: linear-gradient(
  110deg,
  #8a702000 0%, #c9a84c33 20%, #e8d48b33 40%, 
  #c9a84c33 60%, #8a702000 80%
);
```
- Glare: warm gold spotlight

### `sparkle.css` — PRB Reprints

- Shine: standard holo gradient
- Glare: standard spotlight
- Texture: custom `sparkle-pattern.png` (repeating straw hat pirate logos) with `mix-blend-mode: soft-light; opacity: 0.4`

## 4. Texture Assets

Stored in `src/textures/`:

- `grain.webp` — subtle noise texture for textured effects (~50KB)
- `sparkle-pattern.png` — repeating straw hat pirate logo pattern for PRB sparkle effect. Needs to be created (tileable, transparent background, ~100x100px repeat unit)

## 5. Demo Site (`App.jsx`)

### Gallery Sections

Grouped by effect type, each section shows 2-4 curated cards:

| Section | Effect | Sample Cards |
|---------|--------|-------------|
| Super Rare | holo | Shanks SR, Luffy SR, Yamato SR |
| Leader | holo | Kouzuki Oden L, Monkey D. Luffy L |
| Secret Rare | gold-textured | Shanks SEC, Nami SEC |
| Alternate Art | textured-holo | Kid & Killer Alt Art, Chopper Alt Art |
| Manga Art | textured-holo | Shanks Manga, Chopper Manga |
| Rare | border-foil | Vergo R, any common Rare |
| Don Gold | gold-foil | Luffy Don Gold (placeholder until Don cards exist) |

### Search

- Input field at the top
- Calls `GET /cards?name={query}&page_size=12` from the OPTCG API
- Results displayed as interactive cards
- Effect auto-detected from card's `finish` field:
  - `holo` → `holo`
  - `textured` → `textured-holo`
  - `textured-gold` → `gold-textured`
  - `foil` → `border-foil`
  - `gold` → `gold-foil`
  - `standard` → `none`

### Layout

- Dark background (#0d0d0d)
- Header with project name + description
- Search bar below header
- Gallery sections with section labels
- Cards in a responsive flex grid (auto-sizing)
- Footer with links (GitHub, OPBindr, OPTCG API)

## 6. npm Package

The `Card` component and `useSpringTilt` hook are the publishable pieces:

```jsx
import { Card } from 'optcg-cards-css';

<Card image={card.image_url} effect="holo" name="Shanks" />
```

The effect CSS files are bundled with the component. Consumers import the component, effects come along.

Package name: `optcg-cards-css` on npm.

## 7. Integration with OPBindr

After this project is built, OPBindr's `CardEnlargeModal` replaces its hand-rolled tilt/sheen with the published component:

```jsx
import { Card } from 'optcg-cards-css';

// In CardEnlargeModal:
<Card image={displayImage} effect={finishToEffect(card.finish)} name={card.card_name} />
```

The binder grid view (CardSlot) keeps its current lightweight hover sheen — the full Card component with 3D tilt is too heavy for a grid of 9-20 cards.

## Non-goals (v1)

- Animated showcase loop (auto-rotation when not interacting) — add later
- Card back rendering
- Graded card effects (PSA 10 slab, etc.)
- WebGL/canvas effects — pure CSS only
- Card comparison mode (side-by-side)
