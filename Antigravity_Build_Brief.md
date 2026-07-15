# Build Brief: Farm Intelligence Platform — Hackathon Demo Website

Paste this whole document into Antigravity as your first prompt. It contains full project context, what to build, and design direction — everything needed to avoid back-and-forth.

---

## 1. What this project is

A voice-and-SMS agricultural intelligence platform for small and marginal Indian farmers, in Indic languages. Farmers currently choose crops based on habit or hearsay, not data — leading to crop failure from unpredictable monsoons, wasted water, and wasted fertilizer.

The real product is delivered via **IVR calls and SMS** (most target farmers do not have smartphones). This website is **not** the real product — it is a **hackathon demo/pitch artifact** with two jobs:

1. A **landing page** that explains the idea clearly to judges/mentors in under 60 seconds of scrolling.
2. A **clickable web app demo** that simulates what the farmer-facing experience produces — a visual stand-in for what would otherwise arrive as a voice call or SMS, so judges can *see* the intelligence, not just read about it.

Do not build real backend integrations. All data should be realistic mock/sample data. No live satellite/weather API calls are needed for the demo — simulate the outputs.

---

## 2. The core idea — one engine, three stages

All three stages read/write to one shared record per farmer, per field. Explain and demo them in this order:

### Stage 1 — Crop Recommendation (once, per season)
**Farmer gives (via IVR/SMS):** district, village, season (Kharif/Rabi/Zaid), water source type (rainfed/borewell/canal), last crop grown.

**System auto-fetches (no farmer effort):**
- Soil Health Card data (pH, NPK, organic carbon, texture) — district level
- CGWB groundwater depth — district level
- IMD seasonal rainfall forecast — district level
- Agmarknet mandi price trends — nearby markets
- **Satellite check (Sentinel-1 radar + Sentinel-2 optical)** — sharpens district-level numbers to the farmer's exact field using real soil moisture and past NDVI crop-health history

**Scoring logic:**
- Hard filters first: any crop failing soil fit, water fit, or rainfall fit is eliminated immediately — even if highly profitable. Safety always comes before profit.
- Surviving crops are ranked two ways:
  - **Track 1 (Safe & Familiar):** soil fit 30%, water fit 30%, rainfall fit 25%, local familiarity/input availability 15%
  - **Track 2 (Profit-Optimised):** soil fit 30%, water fit 30%, rainfall fit 20%, time-adjusted ROI 20%
- Time-adjusted ROI means a crop earning less money but paying out sooner can outrank a crop earning more but paying out in 3 years — farmers need income this season.

**Output:** voice message or SMS in the farmer's language — e.g. "Safe options: Crop A, Crop B. For higher profit, Crop C is also worth considering."

### Stage 2 — Ongoing Monitoring (continuous, after planting)
Combines four data sources at different update speeds:
- **Sentinel-1 (SAR/radar):** real soil moisture, works through monsoon clouds, ~6-day revisit
- **Sentinel-2 (optical):** NDVI/NDWI/NDRE — vegetation health and water stress, can catch problems before visible to the eye, ~5-day revisit
- **Weather forecast API:** rainfall, temperature, evapotranspiration — what's *coming*, updated daily
- **IoT ground sensors (optional/tiered — not every farmer has these):** real-time soil moisture, temperature, rain gauge, leaf wetness. Sharpens the satellite estimate wherever installed.

**Core logic — Water Balance Projection:**
`Soil moisture (now) + Rainfall (forecast) − Evapotranspiration (weather-based) → will moisture cross the crop's critical threshold before rain arrives?`
- If YES → dry-spell alert: "Irrigate within X days"
- If NO → hold action, or "rain coming, don't fertilize now" (prevents runoff waste)

IoT sensors are tiered, since most small farmers can't afford individual hardware:
- **Tier 0 (everyone, free):** satellite + weather only
- **Tier 1 (shared/village/FPO level):** one sensor cluster per village, calibrates the surrounding area
- **Tier 2 (individual, optional):** farmer/cooperative installs their own sensor for max precision
- **Camera tier (premium/cooperative):** fixed field camera + edge AI can visually flag disease/pest symptoms automatically — this is the one IoT component that does real diagnosis, not just risk-inference. Basic sensors (moisture/temp/rain) cannot diagnose disease — only detect the conditions that favor it (e.g. leaf wetness + humidity + temperature → fungal disease risk score).

**Output:** irrigation timing, fertilization timing, dry-spell early warnings via voice/SMS.

### Stage 3 — Crop Health Logging & Diagnosis (on-demand)
Farmer sends a photo or voice note whenever they notice something wrong.
- If Stage 2 already flagged an anomaly at that spot, the farmer's photo confirms and identifies it — satellite/IoT can say "something's wrong here," only the photo can say *which* disease or pest.
- AI diagnosis runs on the photo/voice note.
- If unresolved/serious, connects directly to a **Rythu Seva Kendra** (a real government farmer-service center network) for expert human follow-up.
- Feedback loop: a confirmed diagnosis recalibrates what future anomalies at that spot likely mean.

---

## 3. Honest limits — must appear somewhere in the pitch (builds credibility with judges)

| Can it do this? | Answer |
|---|---|
| Detect water stress | YES — Sentinel-1 (soil) + Sentinel-2 (plant) |
| Detect early plant stress before visible symptoms | YES — NDRE, PRI indices |
| Detect pests directly | NO — only risk-inference from weather + crop stage + regional outbreak data |
| Identify the exact disease | NO — only flags "something's wrong here"; farmer's photo does the ID (or the camera tier) |
| Check soil microbial health | NO — needs real Soil Health Card lab data |

Do not let the design oversell this as "AI predicts everything." Judges with agri-tech knowledge will probe this; showing the limits builds trust.

---

## 4. What to build — pages/screens

### A. Landing page (single scroll page)
1. Hero — the problem, stated sharply (crop failure from guesswork, not data)
2. The three-stage engine, explained visually (not just a numbered list — show it as one continuous pipeline, since the stages genuinely feed into each other)
3. Why voice/SMS, not an app (accessibility for non-smartphone, low-literacy farmers)
4. The honest-limits table (short, credibility-building section)
5. CTA into the clickable demo

### B. Clickable app demo (the "what the farmer's experience produces" visualization)
This is a **judge-facing visualization tool**, not literally the farmer's IVR/SMS interface. Frame it as: "Here's what's happening behind every voice call and SMS."

Suggested screens:
1. **Farmer onboarding simulation** — a simple form (district, village, season, water source, last crop) that feeds into...
2. **Crop recommendation results** — Track 1 vs Track 2 side by side, showing which crops were eliminated by hard filters and why (this is a great visual — show the filtering happening, not just the final answer)
3. **Field dashboard** — a mock map/plot view showing current soil moisture, NDVI health trend over recent weeks, and the water balance projection with a dry-spell countdown if relevant
4. **Alert feed** — sample SMS/voice alert messages as they'd appear to the farmer, in a chat-bubble style UI, in both English and one sample Indic language (e.g., Telugu, since Rythu Seva Kendras are an Andhra Pradesh/Telangana institution — confirm which state you're targeting)
5. **Photo diagnosis flow** — farmer uploads/simulates a crop photo, gets a mock AI diagnosis result, with an escalation path shown to "Connect to Rythu Seva Kendra"

Include a way to toggle between "Tier 0 (satellite+weather only)" and "Tier 1/2 (with IoT sensor)" on the field dashboard, to visually demonstrate why IoT sharpens the estimate — this was a specific design decision worth showing, not just telling.

---

## 5. Design direction

- Audience for the **landing page**: hackathon judges/mentors — should read as credible, technically grounded, not a generic startup template.
- Audience for the **demo**: same judges, but experiencing it as a proxy for a farmer's actual interaction — should feel grounded in the real Indian agricultural context (real institution names: Soil Health Card, CGWB, IMD, Agmarknet, Rythu Seva Kendra — use them, don't genericize them).
- Avoid generic AI-startup visual clichés (cream background + terracotta accent; near-black + neon-green accent; stock-photo hero of a farmer smiling at a tablet). Ground the visual identity in the real subject: soil, monsoon, satellite imagery, mandi price boards, IVR/SMS as an interface — not "generic agri-tech SaaS."
- Design should be fully responsive — many reviewers may check it on a phone.
- Include a language toggle if feasible (even just English/Telugu or English/Hindi labels) to reinforce the Indic-language premise without needing full localization.

---

## 6. Technical constraints for the demo build

- Frontend only — no real backend, no real satellite/weather API calls needed.
- Use realistic mock data (sample district names, sample soil/water values, sample crop lists) — hardcode or use a local JSON file, whichever is faster to build reliably.
- Prioritize a working, polished demo over real functionality — this is for a hackathon pitch, not production.
- Keep it deployable as a single static site if possible, for easy submission/hosting.

---

## 7. Things I need to decide before/while building (flag these back to me if unanswered)

- **Which state/region** is this targeting for the demo? (Determines which Rythu-Seva-Kendra-equivalent institution name, which language to show, which sample district/crop data to use — Rythu Seva Kendra specifically is Andhra Pradesh/Telangana; if targeting a different state, the institution name and local language should change accordingly)
- **Which specific crops** should appear as sample recommendation output? (Pick 4-6 real crops relevant to the target region/season for realistic demo data)
- **Team/project name** for the platform, if you have one, to use as the site title/branding
- **Any existing branding** (logo, colors) already decided, or is Antigravity free to propose an identity from scratch per the design direction above?
