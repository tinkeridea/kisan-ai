# KisanAI — Farm Intelligence Platform (Hackathon Demo)

## Project Summary

A hackathon demo website for a voice-and-SMS agricultural intelligence platform targeting small & marginal Indian farmers. The website serves two purposes:

1. **Landing Page** — Explains the idea to hackathon judges in under 60 seconds of scrolling.
2. **Clickable Web App Demo** — Simulates what the farmer-facing experience produces (a visual stand-in for voice/SMS intelligence).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Routing | React Router v7 |
| Icons | Lucide React |
| Styling | Vanilla CSS (no Tailwind) |
| Typography | Plus Jakarta Sans + Inter (Google Fonts) |
| Assets | AI-generated crop disease image, satellite scan diagram, farmer keypad phone photo |
| Build | Single static site (`npm run build` → `dist/`) |

---

## Project Structure

```
New folder/
├── public/
│   ├── satellite_scan.png         ← AI-generated satellite field sweep diagram
│   ├── farmer_phone.png           ← Keypad phone SMS alert advisory photo
│   ├── diseased_cotton_leaf.png   ← Crop disease photo for Stage 3
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── CustomCursor.jsx       ← Sprout cursor with growing grass particle trail
│   │   └── CustomCursor.css       ← Particle growth animations and custom shapes
│   ├── data/
│   │   └── mockData.js            ← All mock data (districts, crops, alerts)
│   ├── pages/
│   │   ├── LandingPage.jsx        ← Marketing/pitch page with dynamic mouse parallax & 3D CSS shapes
│   │   ├── LandingPage.css        ← 3D light-green forest stylesheet with floating satellite styles
│   │   ├── DemoApp.jsx            ← Interactive demo app with phone number context
│   │   └── DemoApp.css            ← Polished light-green dashboard styling with 3D grid
│   ├── App.jsx                    ← Global routes + CustomCursor mount
│   ├── App.css                    ← Cleared (no stale styles)
│   ├── index.css                  ← Global design system
│   └── main.jsx                   ← React entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## Key UI/UX Implementations

### 1. Dynamic Embedded Google Satellite Map
- Integrated a **Live Google Satellite Map view** inside the dashboard page (`DemoApp.jsx`).
- Connected directly to the farmer context: when the farmer selects their District and Village (e.g. *Pedakakani, Guntur*), the map iframe automatically updates its source to target that specific regional coordinate.
- Configured satellite view (`t=k` parameters) to show the true agricultural lands and contour structures of the selected Indian village.

### 2. Interactive Sentinel Satellite GIS Map
- Features a **4x4 grid of farm plots** styled with color-coded vegetation health states (NDVI):
  - **Green (Healthy)**
  - **Orange (Warning)**
  - **Red (Critical Moisture/Plant Stress)**
- **Real-Time Telemetry**: Hovering or clicking on any plot cell displays live telemetry in a sidebar panel (exact coordinates, NDVI rating, local moisture %, and health status alerts).
- Easily switch between the **Scanner Grid** and the **Google Satellite View** using a custom tabbed navigation layout.

### 3. Live Sentinel API Simulator & Console
- Implemented a **Fetch Sentinel Data** action button that simulates a live satellite imagery API request.
- Clicking the button plays a scanner animation, slightly randomizes the agricultural plot moisture/NDVI indexes in real time, and logs the mock raw JSON response payload in an **integrated dark-mode Terminal Console** below the map.

### 4. Interactive Multi-Language Selector (Translation Engine)
- Integrated a **Language Selector dropdown** in the Navbar of the Landing Page (`LandingPage.jsx`).
- Supports translation into three languages:
  - **English** (Default)
  - **తెలుగు (Telugu)** (Highly relevant for regional Andhra Pradesh/Guntur soil profiles)
  - **हिन्दी (Hindi)** (General national representation)
- Selecting a language automatically translates all sections on the Landing Page, including the hero header, product values, 3-stage engine, inclusive channel layout, and limitation matrix tables.

### 5. Premium Organic Light-Green Background Theme
- Styled both the **Landing Page** and the **Demo App** with a beautiful, distinctly visible **Light Organic Green** background (`#d2f0e0`), maintaining the strong agricultural branding without looking gloomy.
- Card containers and form modules are styled as clean, white panels with thin emerald-green borders (`1px solid rgba(16, 185, 129, 0.22)`) and soft drop shadows.
- Text copy is styled in a deep forest-green shade (`#1e3a2f` / `#053e2d`) to guarantee high visual contrast and perfect readability.

### 6. Onboarding Phone Number Field
- Added a **Phone Number** input field (`+91 XXXXX XXXXX`) to the farmer registration context form in `DemoApp.jsx`.
- Displays the active simulated phone number in the top active profile banner.
- Automatically appends the target phone number to the Alerts Feed header (e.g. *"Stage 2: Alerts (Sent to +91 98480 22338)"*), illustrating SMS and IVR delivery routing.

### 7. Floating 3D CSS Models (Satellite & Sprout Cube)
- Built **real 3D objects** directly in the DOM using pure HTML/CSS 3D transforms (`transform-style: preserve-3d`):
  - **3D Satellite** (`.satellite-3d`): Consists of a central rotating data cube with 6 colored faces and extending teal solar panel wings.
  - **3D Sprout Cube** (`.cube-3d`): A rotating emerald-tinted block housing a floating green sprout seedling inside.
- Both 3D models translate in response to mouse coordinates, moving independently of the cursor to create a multi-layered parallax depth effect.

### 8. Growing Grass Trail Animation (Interactive Cursor Spawning)
- Connected an **animated grass particle generator** directly to the custom cursor.
- As the user moves their cursor over cards, text, or forms on desktop, the cursor spawns temporary **grass blades and sprouts** along its path.
- These particles bounce up using custom organic bezier scaling (`growSwayFade` animation), sway gently in the wind, and shrink/fade away after 1.2 seconds.

---

## How to Run

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build
```

---

## Status

- ✅ Project scaffolding (Vite + React)
- ✅ Global design system (index.css)
- ✅ Directional Sprout cursor with growing grass particle trail
- ✅ Farmer onboarding phone number registration input
- ✅ Interactive multi-language selector (English, Telugu, Hindi) on Landing Page
- ✅ Interactive 3D Satellite GIS Map + Hover Telemetry inside Demo Dashboard
- ✅ Live Sentinel API fetch simulator with integrated Terminal Console
- ✅ Dynamic dynamic location-based Google Satellite Map embed
- ✅ Floating 3D CSS Satellite and Data Sprout Cube (mouse-driven parallax)
- ✅ Premium Organic Light-Green background theme
- ✅ Interactive 3D background grids & topographic contours on all pages
- ✅ Interactive 3D layered hover cards
- ✅ Simple, intuitive copy with illustrative images
- ✅ Demo App (onboarding → recommendations → dashboard → alerts → diagnosis)
- ✅ Clean production build
