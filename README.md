# Vishvajeet Dhawale — Personal Editorial Archive & Curiosity Notebooks

A personal editorial website, living archive, and collection of curiosity rooms built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Motion**, and **Express + Vite**.

> *"Still looking. Still questioning."*

---

## Overview & Rooms

- **Main Desk (`HomeSection`)**: Editorial broadsheet front page featuring rotating cinema & reading dispatches, quick entries into the five curiosity rooms, and recent writing.
- **My Story (`AboutSection`)**: Personal narrative, roots, timeline, and interactive *"How Well Do You Know Vishvajeet?"* quiz.
- **01 · Cinema (`CinemaSection`)**: Curated archive of **557 films** watched across world cinema, Marathi classics, Malayalam new wave, Korean thrillers, and personal favourites, connected to Letterboxd (`@mivishvajeet`).
- **02 · Football (`FootballSection`)**: FC Barcelona matchday notebook, tactical reflections, Lionel Messi & Pep Guardiola era notes, and football writing.
- **03 · Books (`BooksSection`)**: Personal library of **117 books** across Marathi Sahitya (*Mrutyunjay*, *Kosala*, *Shriman Yogi*, *Yayati*), Hindi literature (*Godaan*, *Gunahon Ka Devta*), history, and philosophy, linked to Goodreads.
- **04 · Philosophy (`BlogSection`)**: Long-form Stoicism manifesto (*"A way of seeing things"*), reflections on Marcus Aurelius, Seneca, and Epictetus, and bilingual Marathi/English essays.
- **05 · The Listening Room (`MusicSection`)**:
  - **Music Sanctuary Theme Toggle**: Scoped acoustic atmosphere (*Acoustic Slate & Brass*, *ECM Archival Linen*, and *Tokyo Jazz Kissa*) with liner-note typography and subtle acoustic baffle & vinyl micro-groove textures.
  - **Analog Hi-Fi Stereo Preamplifier Console**: Dual illuminated L/R analog VU needle meters, tactile needle drop/lift switch, 3-position analog tone contour, and interactive sliding 33⅓ / 45 RPM vinyl sleeve stack.
  - **Four Sides of My Music Taste**: *Side A (The Rap Shelf)*, *Side B (The Old Hindi Shelf)*, *Side C (मराठी गाणी)*, and *Side D (The Wild Card)*.
  - **The Record Wall**: 25 essential albums across 5 crates with live high-resolution artwork and archival vinyl jacket fallbacks.
- **Contact (`ContactSection`)**: Direct note dispatch and social archive links.

---

## Global & Room-Scoped Themes

1. **Kyoto Monograph (`kyoto`)**: Warm Japanese Washi paper (`#F3EFE6`), sunlit cream (`#FAF8F3`), and International Vermilion (`#C83E2B`).
2. **Marcus Aurelius · Stoic Sanctuary (`stoic` / `stoic-obsidian`)**: Classical Roman marble or night-watch obsidian with antique gold (`#D4AF37`), featuring an architectural Marcus Aurelius bust and the Four Cardinal Virtues (*Wisdom*, *Courage*, *Justice*, *Temperance*).
3. **Himalayan Stone (`stone`)**: Warm sandstone & mountain terracotta.
4. **Budapest Ochre (`budapest`)**: Editorial parchment & deep bordeaux.
5. **Pangong Fjord (`fjord`)**: Crisp alpine mist & sapphire cobalt.
6. **Midnight Noir (`noir`)**: Deep carbon & warm tungsten amber.
7. **Music Sanctuary (Scoped to `/music`)**: Toggleable acoustic listening sanctuary inside the Music room.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), Motion (`motion/react`), Lucide Icons
- **Backend / API Server**: Node.js, Express (`server.ts` with Vite middleware in development and static asset serving in production)
- **Typography**: `Fraunces` (Editorial Display Serif), `Tiro Devanagari Marathi` & `Noto Serif Devanagari` (Marathi Literary Serif), `Outfit` (Body Sans), `IBM Plex Mono` (Archival Monospace)

---

## Getting Started Locally

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

### 4. Typecheck & Production Build

```bash
npm run lint
npm run build
npm start
```

---

## Live GitHub Pages Link (`/docs` Deployment)

This repository includes a pre-built production static site in the **`/docs`** folder (`docs/index.html`, `docs/404.html`, `docs/.nojekyll`, and relative asset bundles) so it works immediately on **GitHub Pages** without requiring any CI/CD setup.

### How to Enable Your GitHub Pages Link (30 Seconds):
1. Push this repository to GitHub using the **GitHub** button in the top toolbar.
2. Open your repository on GitHub and click **Settings** → **Pages** (in the left sidebar).
3. Under **Build and deployment** → **Source**, select **Deploy from a branch**.
4. Under **Branch**, choose **`main`**, select the **`/docs`** folder (instead of `/ (root)`), and click **Save**.
5. Within 30–60 seconds, your live website will be published at:
   ```text
   https://<your-github-username>.github.io/<your-repo-name>/
   ```

---

## Pushing to Your GitHub Repository

To push or update from a local terminal:

```bash
# Rebuild the /docs GitHub Pages bundle after making code changes
npm run build:pages

# Push to GitHub
git add .
git commit -m "chore: update archive and rebuild GitHub Pages bundle"
git push origin main
```

---

## License

MIT © Vishvajeet Dhawale
