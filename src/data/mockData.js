export const mockDistricts = [
  "Anantapur",
  "Guntur",
  "Kurnool",
  "Prakasam",
  "Chittoor"
];

export const mockVillages = [
  "Ramatheertham",
  "Pedakakani",
  "Atmakur",
  "Darsi",
  "Kuppam"
];

export const mockSeasons = ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"];

export const mockWaterSources = [
  { id: "rainfed", name: "Rainfed (No Irrigation)" },
  { id: "borewell", name: "Borewell" },
  { id: "canal", name: "Canal" }
];

export const mockSoilData = {
  "Anantapur": { type: "Red/Sandy", pH: 6.5, n: "Low", p: "Medium", k: "High", moistureCurrent: 22 },
  "Guntur": { type: "Black Cotton", pH: 7.2, n: "Medium", p: "High", k: "High", moistureCurrent: 45 },
  "Kurnool": { type: "Red/Black", pH: 7.0, n: "Low", p: "Medium", k: "Medium", moistureCurrent: 30 },
};

// Track 1 (Safe) vs Track 2 (Profit)
export const mockRecommendations = {
  "Kharif (Monsoon)": {
    "Guntur": {
      track1: {
        name: "Paddy (Swarna)",
        matchScore: 92,
        reasons: ["Excellent soil fit (Black Cotton)", "Good rainfall forecast", "High local familiarity"],
        roi: "15-20%",
        duration: "130-140 days",
        risk: "Low"
      },
      track2: {
        name: "Cotton (Bt)",
        matchScore: 85,
        reasons: ["High market price (Agmarknet)", "Profit outranks water risk", "Time-adjusted ROI is peak"],
        roi: "35-40%",
        duration: "160-180 days",
        risk: "Medium-High"
      }
    },
    "Anantapur": {
      track1: {
        name: "Groundnut",
        matchScore: 95,
        reasons: ["Drought resistant", "Perfect for red sandy soil", "Low water requirement"],
        roi: "18-22%",
        duration: "105-115 days",
        risk: "Low"
      },
      track2: {
        name: "Castor",
        matchScore: 82,
        reasons: ["High commercial value", "Deep root system survives dry spells"],
        roi: "30-35%",
        duration: "150-160 days",
        risk: "Medium"
      }
    }
  }
};

export const mockAlertMessages = [
  {
    type: "sms",
    lang: "te",
    text: "⚠️ KisanAI WhatsApp Alert: రాబోయే 5 రోజుల్లో వర్షం లేదు. మీ పత్తి పంటకు నీరు అవసరం. దయచేసి రేపు నీటి పారుదల చేయండి.",
    translation: "(⚠️ No rain in next 5 days. Your cotton crop needs water. Please irrigate tomorrow.)",
    time: "Today, 08:30 AM",
    tier: 0
  },
  {
    type: "ivr",
    lang: "en",
    text: "📱 WhatsApp Message: 'Satellite scan shows soil moisture dropping to 19%. Hold fertilizer application to prevent runoff waste. Irrigate within 24 hours.'",
    translation: "",
    time: "Yesterday, 04:15 PM",
    tier: 0
  },
  {
    type: "sms",
    lang: "te",
    text: "✅ KisanAI Update: మీ పొలంలో తేమ శాతం 45%. ఇప్పుడే యూరియా వేయడానికి అనువైన సమయం.",
    translation: "(✅ Soil moisture at 45%. Perfect time to apply Urea now.)",
    time: "Today, 10:00 AM",
    tier: 1
  }
];

