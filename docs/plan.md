# OPTCG Cards CSS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone React + Vite project that recreates realistic holographic card effects for One Piece TCG cards, with an interactive demo site and publishable npm component.

**Architecture:** Core `Card` component with 3D spring-physics tilt and layered CSS foil effects (shine, glare, texture). Six effect CSS files cover all OPTCG rarity types. Demo site shows curated gallery + API search. Component is extractable for use in OPBindr.

**Tech Stack:** React 18, Vite, pure CSS effects, OPTCG API

**Spec:** `docs/design.md`

---

## File Structure

### Project Root
- **Create:** `package.json` — project config + dependencies
- **Create:** `vite.config.js` — Vite config
- **Create:** `index.html` — entry HTML
- **Create:** `.gitignore`

### Source
- **Create:** `src/main.jsx` — React entry point
- **Create:** `src/App.jsx` — demo gallery + search
- **Create:** `src/App.css` — demo site styles
- **Create:** `src/components/Card.jsx` — core interactive card component
- **Create:** `src/components/Card.css` — card base styles + layer structure
- **Create:** `src/components/CardGallery.jsx` — curated showcase sections
- **Create:** `src/components/CardSearch.jsx` — API search bar
- **Create:** `src/hooks/useSpringTilt.js` — 3D tilt spring physics hook
- **Create:** `src/effects/holo.css` — SR, Leader, SP, Promo
- **Create:** `src/effects/textured-holo.css` — Alt Art, Manga
- **Create:** `src/effects/gold-textured.css` — SEC, TR
- **Create:** `src/effects/border-foil.css` — Rare
- **Create:** `src/effects/gold-foil.css` — Don Gold
- **Create:** `src/effects/sparkle.css` — PRB reprints
- **Create:** `src/data/sample-cards.js` — curated card data for gallery
- **Create:** `src/textures/grain.webp` — noise texture (asset)

---

## Task 1: Scaffold React + Vite project

**Files:**
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\package.json`
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\vite.config.js`
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\index.html`
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\.gitignore`
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\src\main.jsx`
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\src\App.jsx`
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\src\App.css`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "optcg-cards-css",
  "version": "0.1.0",
  "private": false,
  "type": "module",
  "description": "Interactive holographic card effects for One Piece TCG cards",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 3: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OPTCG Cards CSS — Holographic Card Effects</title>
  <style>
    body { margin: 0; background: #0d0d0d; color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

- [ ] **Step 4: Create .gitignore**

```
node_modules
dist
.DS_Store
```

- [ ] **Step 5: Create src/main.jsx**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 6: Create src/App.jsx (placeholder)**

```jsx
export default function App() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>OPTCG Cards CSS</h1>
      <p style={{ color: '#6b7280', marginTop: 8 }}>Interactive holographic card effects for One Piece TCG</p>
    </div>
  );
}
```

- [ ] **Step 7: Create src/App.css (base reset)**

```css
* { box-sizing: border-box; }
body { margin: 0; background: #0d0d0d; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
a { color: #3b82f6; text-decoration: none; }
a:hover { text-decoration: underline; }
```

- [ ] **Step 8: Install dependencies and verify**

```bash
cd c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css
npm install
npm run dev
```

Expected: Vite dev server starts, browser shows "OPTCG Cards CSS" heading.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold React + Vite project"
```

---

## Task 2: Spring tilt hook

**Files:**
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\src\hooks\useSpringTilt.js`

- [ ] **Step 1: Create useSpringTilt.js**

```javascript
import { useRef, useState, useCallback, useEffect } from 'react';

export function useSpringTilt({ damping = 0.12, maxTilt = 14 } = {}) {
  const wrapperRef = useRef(null);
  const target = useRef({ x: 0, y: 0, sheenX: 50, sheenY: 50 });
  const current = useRef({ x: 0, y: 0, sheenX: 50, sheenY: 50 });
  const animFrame = useRef(null);
  const leaveTimer = useRef(null);
  const isAnimating = useRef(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, sheenX: 50, sheenY: 50 });
  const [isInteracting, setIsInteracting] = useState(false);

  const animate = useCallback(() => {
    const c = current.current;
    const t = target.current;

    c.x += (t.x - c.x) * damping;
    c.y += (t.y - c.y) * damping;
    c.sheenX += (t.sheenX - c.sheenX) * damping;
    c.sheenY += (t.sheenY - c.sheenY) * damping;

    const delta = Math.abs(t.x - c.x) + Math.abs(t.y - c.y);
    if (delta < 0.05 && !isInteracting) {
      isAnimating.current = false;
      setTilt({ x: t.x, y: t.y, sheenX: t.sheenX, sheenY: t.sheenY });
      return;
    }

    setTilt({ x: c.x, y: c.y, sheenX: c.sheenX, sheenY: c.sheenY });
    animFrame.current = requestAnimationFrame(animate);
  }, [damping, isInteracting]);

  const startAnimating = useCallback(() => {
    if (!isAnimating.current) {
      isAnimating.current = true;
      animFrame.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  // Entrance tilt
  useEffect(() => {
    current.current = { x: -6, y: 4, sheenX: 38, sheenY: 42 };
    setTilt({ x: -6, y: 4, sheenX: 38, sheenY: 42 });
    const timer = setTimeout(() => {
      target.current = { x: 0, y: 0, sheenX: 50, sheenY: 50 };
      startAnimating();
    }, 500);
    return () => { clearTimeout(timer); cancelAnimationFrame(animFrame.current); };
  }, []);

  const onPointerMove = useCallback((e) => {
    e.stopPropagation();
    setIsInteracting(true);
    clearTimeout(leaveTimer.current);
    const el = wrapperRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const cx = px - 0.5;
    const cy = py - 0.5;

    target.current = {
      x: -(cy * maxTilt * 2),
      y: cx * maxTilt * 2,
      sheenX: 30 + px * 40,
      sheenY: 30 + py * 40,
    };
    startAnimating();
  }, [maxTilt, startAnimating]);

  const onPointerLeave = useCallback(() => {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      target.current = { x: 0, y: 0, sheenX: 50, sheenY: 50 };
      setIsInteracting(false);
      startAnimating();
    }, 300);
  }, [startAnimating]);

  const onTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    onPointerMove({ clientX: touch.clientX, clientY: touch.clientY, stopPropagation: () => {} });
  }, [onPointerMove]);

  const tiltStyle = {
    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
    transformStyle: 'preserve-3d',
    willChange: 'transform',
  };

  return {
    wrapperRef,
    tiltStyle,
    sheenPosition: { x: tilt.sheenX, y: tilt.sheenY },
    handlers: { onPointerMove, onPointerLeave, onTouchMove },
    isInteracting,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useSpringTilt.js
git commit -m "feat: add spring physics tilt hook"
```

---

## Task 3: Card component with layer structure

**Files:**
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\src\components\Card.jsx`
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\src\components\Card.css`

- [ ] **Step 1: Create Card.css**

```css
.optcg-card-wrapper {
  perspective: 800px;
  cursor: grab;
  aspect-ratio: 2.5 / 3.5;
}

.optcg-card-wrapper:active {
  cursor: grabbing;
}

.optcg-card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.optcg-card__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  user-select: none;
  pointer-events: none;
}

.optcg-card__shine {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  border-radius: inherit;
  mix-blend-mode: color-dodge;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.optcg-card__glare {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  border-radius: inherit;
  mix-blend-mode: overlay;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.optcg-card__texture {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  border-radius: inherit;
  mix-blend-mode: multiply;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* When interacting, show the layers */
.optcg-card-wrapper.active .optcg-card__shine {
  opacity: 1;
}

.optcg-card-wrapper.active .optcg-card__glare {
  opacity: 0.6;
}

.optcg-card-wrapper.active .optcg-card__texture {
  opacity: 0.3;
}
```

- [ ] **Step 2: Create Card.jsx**

```jsx
import { useSpringTilt } from '../hooks/useSpringTilt';
import './Card.css';

// Import all effect CSS
import '../effects/holo.css';
import '../effects/textured-holo.css';
import '../effects/gold-textured.css';
import '../effects/border-foil.css';
import '../effects/gold-foil.css';
import '../effects/sparkle.css';

const VALID_EFFECTS = ['holo', 'textured-holo', 'gold-textured', 'border-foil', 'gold-foil', 'sparkle', 'none'];

export default function Card({ image, effect = 'none', name = '', className = '' }) {
  const { wrapperRef, tiltStyle, sheenPosition, handlers, isInteracting } = useSpringTilt();

  const hasEffect = effect !== 'none' && VALID_EFFECTS.includes(effect);

  return (
    <div
      ref={wrapperRef}
      className={`optcg-card-wrapper ${isInteracting ? 'active' : ''} ${className}`}
      onPointerMove={handlers.onPointerMove}
      onPointerLeave={handlers.onPointerLeave}
      onTouchMove={handlers.onTouchMove}
    >
      <div
        className={`optcg-card ${hasEffect ? `effect-${effect}` : ''}`}
        style={{
          ...tiltStyle,
          '--pointer-x': `${sheenPosition.x}%`,
          '--pointer-y': `${sheenPosition.y}%`,
        }}
      >
        <img
          src={image}
          alt={name}
          className="optcg-card__image"
          draggable={false}
        />

        {hasEffect && (
          <>
            <div className="optcg-card__shine" />
            <div className="optcg-card__glare" />
            <div className="optcg-card__texture" />
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Card.jsx src/components/Card.css
git commit -m "feat: add Card component with shine/glare/texture layers"
```

---

## Task 4: Holo effect CSS (SR, Leader, SP, Promo)

**Files:**
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\src\effects\holo.css`

- [ ] **Step 1: Create holo.css**

```css
/* Holo effect: Super Rare, Leader, Special, Promo
   Smooth rainbow shimmer across entire card face. */

.effect-holo .optcg-card__shine {
  background: repeating-linear-gradient(
    110deg,
    #ff6b6b00 0%, #ff6b6b22 3%,
    #ffd93d00 6%, #ffd93d22 9%,
    #6bff6b00 12%, #6bff6b22 15%,
    #6bd4ff00 18%, #6bd4ff22 21%,
    #d46bff00 24%, #d46bff22 27%,
    #ff6b6b00 30%
  );
  background-size: 200% 200%;
  background-position: var(--pointer-x, 50%) var(--pointer-y, 50%);
  filter: brightness(0.8) saturate(1.4);
}

.effect-holo .optcg-card__glare {
  background: radial-gradient(
    farthest-corner circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
    rgba(255, 255, 255, 0.7) 5%,
    rgba(255, 255, 255, 0.25) 25%,
    transparent 55%
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/effects/holo.css
git commit -m "feat: add holo effect CSS (SR, Leader, SP, Promo)"
```

---

## Task 5: Textured holo effect CSS (Alt Art, Manga)

**Files:**
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\src\effects\textured-holo.css`

- [ ] **Step 1: Create textured-holo.css**

```css
/* Textured Holo: Alternate Art, Manga Art
   Stronger rainbow holofoil + embossed texture overlay. */

.effect-textured-holo .optcg-card__shine {
  background: repeating-linear-gradient(
    110deg,
    #ff6b6b00 0%, #ff6b6b33 3%,
    #ffd93d00 6%, #ffd93d33 9%,
    #6bff6b00 12%, #6bff6b33 15%,
    #6bd4ff00 18%, #6bd4ff33 21%,
    #d46bff00 24%, #d46bff33 27%,
    #ff6b6b00 30%
  );
  background-size: 200% 200%;
  background-position: var(--pointer-x, 50%) var(--pointer-y, 50%);
  filter: brightness(0.9) saturate(1.6);
}

.effect-textured-holo .optcg-card__glare {
  background: radial-gradient(
    farthest-corner circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
    rgba(255, 255, 255, 0.8) 5%,
    rgba(255, 255, 255, 0.3) 25%,
    transparent 55%
  );
}

.effect-textured-holo .optcg-card__texture {
  background-image: url('../textures/grain.webp');
  background-size: 200px;
  background-repeat: repeat;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/effects/textured-holo.css
git commit -m "feat: add textured holo effect CSS (Alt Art, Manga)"
```

---

## Task 6: Gold textured effect CSS (SEC, TR)

**Files:**
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\src\effects\gold-textured.css`

- [ ] **Step 1: Create gold-textured.css**

```css
/* Gold Textured: Secret Rare, Treasure Rare
   Gold-tinted rainbow + textured surface. */

.effect-gold-textured .optcg-card__shine {
  background: repeating-linear-gradient(
    110deg,
    #c9a84c00 0%, #c9a84c33 4%,
    #ff6b6b00 8%, #ff6b6b22 11%,
    #ffd93d00 14%, #ffd93d33 18%,
    #6bff6b00 22%, #6bff6b22 25%,
    #6bd4ff00 28%, #6bd4ff22 31%,
    #c9a84c00 35%
  );
  background-size: 200% 200%;
  background-position: var(--pointer-x, 50%) var(--pointer-y, 50%);
  filter: brightness(0.85) saturate(1.5);
}

.effect-gold-textured .optcg-card__glare {
  background: radial-gradient(
    farthest-corner circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
    rgba(255, 240, 200, 0.8) 5%,
    rgba(230, 210, 170, 0.3) 25%,
    transparent 55%
  );
}

.effect-gold-textured .optcg-card__texture {
  background-image: url('../textures/grain.webp');
  background-size: 200px;
  background-repeat: repeat;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/effects/gold-textured.css
git commit -m "feat: add gold textured effect CSS (SEC, Treasure Rare)"
```

---

## Task 7: Border foil, gold foil, and sparkle effect CSS

**Files:**
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\src\effects\border-foil.css`
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\src\effects\gold-foil.css`
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\src\effects\sparkle.css`

- [ ] **Step 1: Create border-foil.css**

```css
/* Border Foil: Rare
   Very subtle metallic shimmer. Intentionally muted. */

.effect-border-foil .optcg-card__shine {
  background: linear-gradient(
    110deg,
    transparent 30%,
    rgba(255, 255, 255, 0.08) 45%,
    rgba(220, 230, 245, 0.06) 55%,
    transparent 70%
  );
  background-size: 200% 200%;
  background-position: var(--pointer-x, 50%) var(--pointer-y, 50%);
  filter: brightness(0.7);
}

.effect-border-foil .optcg-card__glare {
  background: radial-gradient(
    farthest-corner circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
    rgba(255, 255, 255, 0.3) 5%,
    rgba(255, 255, 255, 0.1) 25%,
    transparent 50%
  );
}
```

- [ ] **Step 2: Create gold-foil.css**

```css
/* Gold Foil: Don Gold cards
   Warm gold shimmer, no rainbow. */

.effect-gold-foil .optcg-card__shine {
  background: linear-gradient(
    110deg,
    #8a702000 0%, #c9a84c33 20%, #e8d48b33 40%,
    #c9a84c33 60%, #8a702000 80%
  );
  background-size: 200% 200%;
  background-position: var(--pointer-x, 50%) var(--pointer-y, 50%);
  mix-blend-mode: color-dodge;
  filter: brightness(0.9) saturate(1.2);
}

.effect-gold-foil .optcg-card__glare {
  background: radial-gradient(
    farthest-corner circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
    rgba(255, 230, 150, 0.7) 5%,
    rgba(201, 168, 76, 0.25) 30%,
    transparent 55%
  );
}
```

- [ ] **Step 3: Create sparkle.css**

```css
/* Sparkle: PRB Reprints
   Standard holo + straw hat pirate logo pattern overlay. */

.effect-sparkle .optcg-card__shine {
  background: repeating-linear-gradient(
    110deg,
    #ff6b6b00 0%, #ff6b6b22 3%,
    #ffd93d00 6%, #ffd93d22 9%,
    #6bff6b00 12%, #6bff6b22 15%,
    #6bd4ff00 18%, #6bd4ff22 21%,
    #d46bff00 24%, #d46bff22 27%,
    #ff6b6b00 30%
  );
  background-size: 200% 200%;
  background-position: var(--pointer-x, 50%) var(--pointer-y, 50%);
  filter: brightness(0.8) saturate(1.4);
}

.effect-sparkle .optcg-card__glare {
  background: radial-gradient(
    farthest-corner circle at var(--pointer-x, 50%) var(--pointer-y, 50%),
    rgba(255, 255, 255, 0.6) 5%,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 55%
  );
}

/* Sparkle pattern - uses a generated CSS pattern as placeholder
   until a proper straw hat logo PNG is created */
.effect-sparkle .optcg-card__texture {
  background-image: radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px);
  background-size: 12px 12px;
  mix-blend-mode: soft-light;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/effects/border-foil.css src/effects/gold-foil.css src/effects/sparkle.css
git commit -m "feat: add border-foil, gold-foil, and sparkle effect CSS"
```

---

## Task 8: Grain texture asset

**Files:**
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\src\textures\grain.webp`

- [ ] **Step 1: Generate a grain texture**

Create a small noise/grain texture. Use a canvas-based generator script:

```bash
cd c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css
node -e "
const { createCanvas } = require('canvas');
const fs = require('fs');
const size = 200;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(size, size);
for (let i = 0; i < imageData.data.length; i += 4) {
  const v = Math.random() * 40 + 108;
  imageData.data[i] = v;
  imageData.data[i + 1] = v;
  imageData.data[i + 2] = v;
  imageData.data[i + 3] = 30;
}
ctx.putImageData(imageData, 0, 0);
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('src/textures/grain.png', buffer);
console.log('Created grain.png');
"
```

If the `canvas` npm package isn't available, create a simple 200x200 noise PNG manually or download one. The texture just needs to be a subtle gray noise pattern with low opacity.

Alternatively, use a CSS-generated fallback in the textured effects (radial-gradient dots) if the image asset is hard to create:

```css
/* Fallback if grain.webp is unavailable */
.optcg-card__texture {
  background-image: url('../textures/grain.webp'),
    radial-gradient(circle, rgba(128,128,128,0.15) 1px, transparent 1px);
  background-size: 200px, 4px 4px;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/textures/
git commit -m "feat: add grain texture asset"
```

---

## Task 9: Sample card data

**Files:**
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\src\data\sample-cards.js`

- [ ] **Step 1: Create sample-cards.js**

Curated cards that best showcase each effect. Image URLs use the OPTCG API image proxy.

```javascript
const API = 'https://optcg-api.arjunbansal-ai.workers.dev/images';

export const SAMPLE_CARDS = [
  {
    section: 'Super Rare',
    effect: 'holo',
    cards: [
      { id: 'OP01-120', name: 'Shanks', image: `${API}/OP01-120` },
      { id: 'OP05-119', name: 'Monkey.D.Luffy', image: `${API}/OP05-119` },
      { id: 'OP03-122', name: 'Charlotte Katakuri', image: `${API}/OP03-122` },
    ],
  },
  {
    section: 'Leader',
    effect: 'holo',
    cards: [
      { id: 'EB01-001', name: 'Kouzuki Oden', image: `${API}/EB01-001` },
      { id: 'OP01-001', name: 'Roronoa Zoro', image: `${API}/OP01-001` },
    ],
  },
  {
    section: 'Secret Rare',
    effect: 'gold-textured',
    cards: [
      { id: 'OP02-121', name: 'Shanks', image: `${API}/OP02-121` },
      { id: 'OP01-121', name: 'Nami', image: `${API}/OP01-121` },
    ],
  },
  {
    section: 'Alternate Art',
    effect: 'textured-holo',
    cards: [
      { id: 'OP05-074_p1', name: 'Monkey.D.Luffy', image: `${API}/OP05-074_p1` },
      { id: 'OP02-120_p1', name: 'Portgas.D.Ace', image: `${API}/OP02-120_p1` },
      { id: 'OP03-099_p1', name: 'Kid & Killer', image: `${API}/OP03-099_p1` },
    ],
  },
  {
    section: 'Manga Art',
    effect: 'textured-holo',
    cards: [
      { id: 'OP01-120_p2', name: 'Shanks', image: `${API}/OP01-120_p2` },
      { id: 'OP02-120_p2', name: 'Portgas.D.Ace', image: `${API}/OP02-120_p2` },
    ],
  },
  {
    section: 'Rare',
    effect: 'border-foil',
    cards: [
      { id: 'OP03-079', name: 'Vergo', image: `${API}/OP03-079` },
      { id: 'OP01-025', name: 'Nami', image: `${API}/OP01-025` },
    ],
  },
];

// Map API finish field to effect name
export function finishToEffect(finish) {
  const map = {
    holo: 'holo',
    textured: 'textured-holo',
    'textured-gold': 'gold-textured',
    foil: 'border-foil',
    gold: 'gold-foil',
    standard: 'none',
  };
  return map[finish] || 'none';
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/sample-cards.js
git commit -m "feat: add curated sample card data for gallery"
```

---

## Task 10: Card Gallery component

**Files:**
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\src\components\CardGallery.jsx`

- [ ] **Step 1: Create CardGallery.jsx**

```jsx
import Card from './Card';
import { SAMPLE_CARDS } from '../data/sample-cards';

export default function CardGallery() {
  return (
    <div style={{ padding: '0 24px' }}>
      {SAMPLE_CARDS.map((section) => (
        <div key={section.section} style={{ marginBottom: 40 }}>
          <h3 style={{
            color: '#6b7280',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: 16,
            fontWeight: 600,
          }}>
            {section.section} — {section.effect.replace('-', ' ')}
          </h3>
          <div style={{
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
          }}>
            {section.cards.map((card) => (
              <div key={card.id} style={{ width: 220 }}>
                <Card
                  image={card.image}
                  effect={section.effect}
                  name={card.name}
                />
                <p style={{
                  color: '#9ca3af',
                  fontSize: 12,
                  marginTop: 8,
                  textAlign: 'center',
                }}>
                  {card.name}
                  <span style={{ color: '#6b7280', marginLeft: 6 }}>{card.id}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CardGallery.jsx
git commit -m "feat: add CardGallery component with curated sections"
```

---

## Task 11: Card Search component

**Files:**
- Create: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\src\components\CardSearch.jsx`

- [ ] **Step 1: Create CardSearch.jsx**

```jsx
import { useState, useRef } from 'react';
import Card from './Card';
import { finishToEffect } from '../data/sample-cards';

const API_BASE = 'https://optcg-api.arjunbansal-ai.workers.dev';

export default function CardSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  function handleSearch(value) {
    setQuery(value);
    clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/cards?name=${encodeURIComponent(value)}&page_size=12`);
        const data = await res.json();
        setResults(data.data || []);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 400);
  }

  return (
    <div style={{ padding: '0 24px', marginBottom: 40 }}>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search any card..."
        style={{
          width: '100%',
          maxWidth: 480,
          padding: '10px 16px',
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: 8,
          color: 'white',
          fontSize: 14,
          outline: 'none',
        }}
      />
      {loading && (
        <p style={{ color: '#6b7280', fontSize: 12, marginTop: 8 }}>Searching...</p>
      )}
      {results.length > 0 && (
        <div style={{
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          marginTop: 20,
        }}>
          {results.map((card) => (
            <div key={card.id} style={{ width: 180 }}>
              <Card
                image={`${API_BASE}/images/${card.id}`}
                effect={finishToEffect(card.finish)}
                name={card.name}
              />
              <p style={{
                color: '#9ca3af',
                fontSize: 11,
                marginTop: 6,
                textAlign: 'center',
              }}>
                {card.name}
                <span style={{ display: 'block', color: '#6b7280', fontSize: 10 }}>
                  {card.id} · {card.rarity} {card.variant_type ? `· ${card.variant_type}` : ''}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CardSearch.jsx
git commit -m "feat: add CardSearch component with API integration"
```

---

## Task 12: Wire up App.jsx with gallery + search

**Files:**
- Modify: `c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css\src\App.jsx`

- [ ] **Step 1: Update App.jsx**

Replace the placeholder with the full demo layout:

```jsx
import CardGallery from './components/CardGallery';
import CardSearch from './components/CardSearch';

export default function App() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        padding: '48px 24px 32px',
        borderBottom: '1px solid #2a2a2a',
        marginBottom: 32,
      }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>
          OPTCG Cards CSS
        </h1>
        <p style={{ color: '#6b7280', marginTop: 8, fontSize: 14 }}>
          Interactive holographic card effects for One Piece TCG
        </p>
        <p style={{ color: '#4b5563', marginTop: 4, fontSize: 12 }}>
          Hover over a card to see the effect. Touch and drag on mobile.
        </p>
      </header>

      {/* Search */}
      <CardSearch />

      {/* Gallery */}
      <CardGallery />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px',
        borderTop: '1px solid #2a2a2a',
        marginTop: 40,
      }}>
        <p style={{ color: '#6b7280', fontSize: 12 }}>
          Open source · <a href="https://github.com/arjunkai/optcg-cards-css">GitHub</a> · Powered by <a href="https://optcg-api.arjunbansal-ai.workers.dev">OPTCG API</a>
        </p>
        <p style={{ color: '#4b5563', fontSize: 11, marginTop: 4 }}>
          CardPipeline LLC · Not affiliated with Bandai or Toei Animation
        </p>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

```bash
cd c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css
npm run dev
```

Expected: Demo site loads with header, search bar, gallery sections with interactive cards showing holographic effects.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire up demo site with gallery and search"
```

---

## Task 13: Build verification + GitHub repo

- [ ] **Step 1: Build**

```bash
cd c:\Users\arjun\OneDrive\Documents\projects\optcg-cards-css
npm run build
```

Expected: Build succeeds, output in `dist/`.

- [ ] **Step 2: Create GitHub repo and push**

```bash
gh repo create arjunkai/optcg-cards-css --public --source=. --remote=origin --push
```

- [ ] **Step 3: Verify the demo site works**

Open the dev server, hover over cards in each section. Verify:
1. SR/Leader cards show rainbow holo shimmer on hover
2. SEC cards show gold-tinted holo
3. Alt Art / Manga show textured holo (stronger than SR)
4. Rare cards show subtle border shimmer
5. Search works — type a card name, results appear with correct effects
6. 3D tilt springs smoothly, no edge jitter
7. Touch works on mobile (if testable)
