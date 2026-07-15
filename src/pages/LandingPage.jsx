import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Smartphone, Activity, CheckCircle2, XCircle, ArrowRight, Satellite, MessageSquare, Phone, ShieldCheck, HeartPulse, Globe } from 'lucide-react';
import './LandingPage.css';

const translations = {
  en: {
    logo: "KisanAI",
    tag: "Made for Small & Marginal Farmers",
    title1: "Protect Your Crops.",
    title2: "No Internet Needed.",
    subtitle: "KisanAI combines satellite radar, government soil records, and weather forecasts to send personalized farming advisories directly to basic keypad phones via automated voice calls and SMS.",
    demoBtn: "Try Interactive Demo",
    howBtn: "How it works",
    stat1Val: "100%",
    stat1Lbl: "Offline Accessible",
    stat2Val: "6-Day",
    stat2Lbl: "Satellite Revisit",
    stat3Val: "Indic",
    stat3Lbl: "Local Languages",
    whatTag: "WHAT WE DO",
    whatTitle: "Farming Guided by Space Technology & Ground Intelligence",
    whatDesc: "We monitor agricultural plots remotely using European Space Agency (ESA) satellites. By analyzing radar and optical waves, we calculate exact soil moisture and vegetation health without requiring expensive sensors on your farm.",
    benefit1Title: "Prevent Crop Losses:",
    benefit1Desc: " Get early warnings about upcoming dry spells.",
    benefit2Title: "Optimize Resources:",
    benefit2Desc: " Know exactly when and how much fertilizer or water to apply.",
    benefit3Title: "Disease Prevention:",
    benefit3Desc: " Spot early vegetation stress before it becomes visible to the eye.",
    engineTag: "THE 3 STAGES",
    engineTitle: "How the KisanAI Engine Works",
    engineDesc: "Our platform provides step-by-step guidance from seed selection to harvest diagnostics.",
    stage1Num: "01",
    stage1Title: "1. Pre-Planting Advice",
    stage1Desc: "We check your village's soil cards, groundwater depth, and seasonal rain forecast. We filter out crops that are likely to fail, recommending safe options and profit-optimized options.",
    stage1Sources: ["Soil Card", "Groundwater", "Rain Forecast"],
    stage2Num: "02",
    stage2Title: "2. Growth Monitoring",
    stage2Desc: "Once planted, satellites track your crop's water stress. If moisture drops below safety levels, you receive an automated alert to irrigate before damage occurs.",
    stage2Sources: ["Radar Moisture", "Plant Stress", "Evaporation"],
    stage3Num: "03",
    stage3Title: "3. Problem Diagnosis",
    stage3Desc: "Spotted yellow leaves or pests? Send a photo or voice note. Our system analyzes it against satellite stress history, sends diagnostic advice, or connects you to experts.",
    stage3Sources: ["AI Photo Scan", "Voice Notes", "Government Expert"],
    phoneTag: "INCLUSIVE CHANNELS",
    phoneTitle: "Built for Keypad Phones",
    phoneDesc1: "Over 50% of small farmers in rural India do not use smartphones. Those who do often face slow, unreliable internet connections. Apps are not the solution.",
    phoneDesc2: "KisanAI bypasses apps entirely. We convert complex satellite maps and agronomic algorithms into simple:",
    ivrTitle: "Automated Voice Calls (IVR)",
    ivrDesc: "In local Indic languages, detailing clear watering actions.",
    smsTitle: "SMS Advisories",
    smsDesc: "Concise text summaries sent directly to any basic phone.",
    limitsTag: "LIMITATIONS",
    limitsTitle: "Honest System Limits",
    limitsDesc: "What our satellite models can and cannot do. We value absolute agronomic honesty.",
    limitTh1: "Farming Indicator",
    limitTh2: "Can KisanAI Detect It?",
    limitTh3: "How It Works",
    limitRow1Name: "Water Deficits",
    limitRow1Val: "✓ YES",
    limitRow1Desc: "Calculated via Sentinel-1 (soil radar) and Sentinel-2 (leaf water content).",
    limitRow2Name: "Early Plant Stress",
    limitRow2Val: "✓ YES",
    limitRow2Desc: "Spotted using NDRE and PRI light indices before yellowing is visible.",
    limitRow3Name: "Pest Infestations",
    limitRow3Val: "✗ NO",
    limitRow3Desc: "Satellites cannot see insects. We only infer pest risks using temperature and humidity.",
    limitRow4Name: "Exact Plant Disease",
    limitRow4Val: "✗ NO",
    limitRow4Desc: "Satellites only flag that 'something is wrong.' The farmer's photo provides the exact ID.",
    limitRow5Name: "Microbial Soil Health",
    limitRow5Val: "✗ NO",
    limitRow5Desc: "Requires physical laboratory testing (linked to your Soil Health Card profile).",
    ctaTitle: "Ready to test the system?",
    ctaDesc: "Explore the developer simulation. Walk through onboarding, recommendations, and diagnosis alerts.",
    ctaBtn: "Open Interactive Demo",
    footerText: "KisanAI — Hackathon Demo • Built for the Google Solution Challenge"
  },
  te: {
    logo: "కిసాన్AI",
    tag: "చిన్న & సన్నకారు రైతుల కోసం రూపొందించబడింది",
    title1: "మీ పంటలను రక్షించండి.",
    title2: "ఇంటర్నెట్ అవసరం లేదు.",
    subtitle: "కిసాన్ఐఐ శాటిలైట్ రాడార్, ప్రభుత్వ నేల రికార్డులు మరియు వాతావరణ సూచనలను అనుసంధానించి రైతులకు స్వయంచాలక వాయిస్ కాల్స్ మరియు SMS ద్వారా నేరుగా సాధారణ కీప్యాడ్ ఫోన్‌లకు వ్యక్తిగతీకరించిన సలహాలను పంపుతుంది.",
    demoBtn: "ఇంటరాక్టివ్ డెమోను ప్రయత్నించండి",
    howBtn: "ఇది ఎలా పనిచేస్తుంది",
    stat1Val: "100%",
    stat1Lbl: "ఆఫ్లైన్ యాక్సెస్",
    stat2Val: "6-రోజుల",
    stat2Lbl: "శాటిలైట్ రివిజిట్",
    stat3Val: "భారతీయ",
    stat3Lbl: "స్థానిక భాషలు",
    whatTag: "మేము ఏమి చేస్తాము",
    whatTitle: "అంతరిక్ష సాంకేతికత & భూమి నిఘా ద్వారా వ్యవసాయ మార్గదర్శకత్వం",
    whatDesc: "మేము యూరోపియన్ స్పేస్ ఏజెన్సీ (ESA) ఉపగ్రహాలను ఉపయోగించి వ్యవసాయ భూములను రిమోట్‌గా పర్యవేక్షిస్తాము. రాడార్ మరియు ఆప్టికల్ తరంగాలను విశ్లేషించడం ద్వారా, మేము మీ పొలంలో ఖరీదైన సెన్సార్ల అవసరం లేకుండా ఖచ్చితమైన నేల తేమ మరియు వృక్ష ఆరోగ్యాన్ని లెక్కిస్తాము.",
    benefit1Title: "పంట నష్టాలను నివారించండి:",
    benefit1Desc: " రాబోయే పొడి వాతావరణం గురించి ముందస్తు హెచ్చరికలను పొందండి.",
    benefit2Title: "వనరులను ఆప్టిమైజ్ చేయండి:",
    benefit2Desc: " ఎప్పుడు మరియు ఎంత ఎరువులు లేదా నీరు వేయాలో ఖచ్చితంగా తెలుసుకోండి.",
    benefit3Title: "వ్యాధి నివారణ:",
    benefit3Desc: " కంటికి కనిపించక ముందే వృక్షాల ఒత్తిడిని గుర్తించండి.",
    engineTag: "3 దశలు",
    engineTitle: "కిసాన్AI ఇంజిన్ ఎలా పనిచేస్తుంది",
    engineDesc: "మా ప్లాట్‌ఫారమ్ విత్తన ఎంపిక నుండి పంట నిర్ధారణల వరకు దశల వారీ మార్గదర్శకత్వాన్ని అందిస్తుంది.",
    stage1Num: "01",
    stage1Title: "1. నాటడానికి ముందు సలహా",
    stage1Desc: "మేము మీ గ్రామం యొక్క నేల కార్డులు, భూగర్భ జలాల లోతు మరియు కాలానుగుణ వర్షాల సూచనలను తనిఖీ చేస్తాము. మేము విఫలమయ్యే పంటలను ఫిల్టర్ చేసి, సురక్షితమైన మరియు లాభదాయకమైన పంటలను సిఫార్సు చేస్తాము.",
    stage1Sources: ["సాయిల్ కార్డ్", "భూగర్భ జలాలు", "వర్షపాత సూచన"],
    stage2Num: "02",
    stage2Title: "2. పంట పెరుగుదల పర్యవేక్షణ",
    stage2Desc: "నాటిన తర్వాత, ఉపగ్రహాలు మీ పంట నీటి ఒత్తిడిని ట్రాక్ చేస్తాయి. తేమ భద్రతా స్థాయిల కంటే తగ్గితే, నష్టం జరగక ముందే నీరు పెట్టడానికి మీకు హెచ్చరిక వస్తుంది.",
    stage2Sources: ["రాడార్ తేమ", "పంట ఒత్తిడి", "బాష్పీభవనం"],
    stage3Num: "03",
    stage3Title: "3. సమస్య నిర్ధారణ",
    stage3Desc: "పసుపు ఆకులు లేదా తెగుళ్లను గమనించారా? ఫోటో లేదా వాయిస్ నోట్ పంపండి. మా సిస్టమ్ దానిని విశ్లేషించి, నివారణ సలహాలను పంపుతుంది లేదా నిపుణులను కనెక్ట్ చేస్తుంది.",
    stage3Sources: ["AI ఫోటో స్కాన్", "వాయిస్ నోట్స్", "ప్రభుత్వ నిపుణుడు"],
    phoneTag: "సమ్మిళిత ఛానెల్‌లు",
    phoneTitle: "కీప్యాడ్ ఫోన్‌ల కోసం నిర్మించబడింది",
    phoneDesc1: "గ్రామీణ భారతదేశంలో 50% కంటే ఎక్కువ మంది చిన్న రైతులు స్మార్ట్‌ఫోన్‌లను ఉపయోగించరు. ఉపయోగించే వారు కూడా నెమ్మదిగా ఉండే ఇంటర్నెట్‌ను ఎదుర్కొంటారు. యాప్‌లు పరిష్కారం కాదు.",
    phoneDesc2: "కిసాన్AI యాప్‌లను పూర్తిగా దాటవేస్తుంది. మేము సంక్లిష్ట ఉపగ్రహ పటాలను సాధారణ మార్గాలుగా మారుస్తాము:",
    ivrTitle: "స్వయంచాలక వాయిస్ కాల్స్ (IVR)",
    ivrDesc: "స్థానిక భారతీయ భాషలలో, స్పష్టమైన నీటి సేద్య చర్యలను వివరిస్తుంది.",
    smsTitle: "SMS సలహాలు",
    smsDesc: "ఏదైనా ప్రాథమిక ఫోన్‌కు నేరుగా పంపబడే సంక్షిప్త వచన సారాంశాలు.",
    limitsTag: "పరిమితులు",
    limitsTitle: "నిజాయితీ గల సిస్టమ్ పరిమితులు",
    limitsDesc: "మా శాటిలైట్ నమూనాలు ఏమి చేయగలవు మరియు ఏమి చేయలేవు. మేము పరిమితులను నిజాయితీగా అంగీకరిస్తాము.",
    limitTh1: "వ్యవసాయ సూచిక",
    limitTh2: "కిసాన్AI గుర్తించగలదా?",
    limitTh3: "ఇది ఎలా పనిచేస్తుంది",
    limitRow1Name: "నీటి కొరత",
    limitRow1Val: "✓ అవును",
    limitRow1Desc: "సెంటినెల్-1 (నేల రాడార్) మరియు సెంటినెల్-2 (ఆకు నీటి పరిమాణం) ద్వారా లెక్కిస్తారు.",
    limitRow2Name: "ముందస్తు పంట ఒత్తిడి",
    limitRow2Val: "✓ అవును",
    limitRow2Desc: "ఆకులు పసుపు రంగులోకి మారక ముందే NDRE మరియు PRI కాంతి సూచికలను ఉపయోగించి గుర్తిస్తారు.",
    limitRow3Name: "తెగుళ్ల దాడి",
    limitRow3Val: "✗ కాదు",
    limitRow3Desc: "ఉపగ్రహాలు కీటకాలను చూడలేవు. ఉష్ణోగ్రత మరియు తేమను ఉపయోగించి మాత్రమే తెగుళ్ల ప్రమాదాన్ని అంచనా వేస్తాము.",
    limitRow4Name: "ఖచ్చితమైన పంట వ్యాధి",
    limitRow4Val: "✗ కాదు",
    limitRow4Desc: "ఉపగ్రహాలు 'సమస్య ఉంది' అని మాత్రమే గుర్తిస్తాయి. ఖచ్చితమైన గుర్తింపు కోసం రైతు పంపే ఫోటో అవసరం.",
    limitRow5Name: "నేల సూక్ష్మజీవుల ఆరోగ్యం",
    limitRow5Val: "✗ కాదు",
    limitRow5Desc: "భౌతిక ప్రయోగశాల పరీక్ష అవసరం (మీ సాయిల్ హెల్త్ కార్డ్ ప్రొఫైల్‌కు లింక్ చేయబడింది).",
    ctaTitle: "సిస్టమ్‌ను పరీక్షించడానికి సిద్ధంగా ఉన్నారా?",
    ctaDesc: "రైతు ప్రయాణ డెమోను అన్వేషించండి. ఆన్‌బోర్డింగ్, సిఫార్సులు మరియు వ్యాధి నిర్ధారణ హెచ్చరికలను చూడండి.",
    ctaBtn: "ఇంటరాక్టివ్ డెమోను తెరవండి",
    footerText: "కిసాన్AI — హ్యాకథాన్ డెమో • గూగుల్ సొల్యూషన్ ఛాలెంజ్ కోసం నిర్మించబడింది"
  },
  hi: {
    logo: "किसानएआई",
    tag: "छोटे और सीमांत किसानों के लिए निर्मित",
    title1: "अपनी फसलों की रक्षा करें।",
    title2: "इंटरनेट की आवश्यकता नहीं।",
    subtitle: "किसानएआई सैटेलाइट रडार, सरकारी मिट्टी के रिकॉर्ड और मौसम के पूर्वानुमान को जोड़कर स्वचालित वॉयस कॉल और एसएमएस के माध्यम से सीधे बुनियादी कीपैड फोन पर व्यक्तिगत कृषि सलाह भेजता है।",
    demoBtn: "इंटरैक्टिव डेमो आजमाएं",
    howBtn: "यह कैसे काम करता है",
    stat1Val: "100%",
    stat1Lbl: "ऑफ़लाइन सुलभ",
    stat2Val: "6-दिवसीय",
    stat2Lbl: "उपग्रह पुनरावलोकन",
    stat3Val: "भारतीय",
    stat3Lbl: "स्थानीय भाषाएं",
    whatTag: "हम क्या करते हैं",
    whatTitle: "अंतरिक्ष प्रौद्योगिकी और जमीनी खुफिया जानकारी द्वारा कृषि मार्गदर्शन",
    whatDesc: "हम यूरोपीय अंतरिक्ष एजेंसी (ESA) के उपग्रहों का उपयोग करके कृषि भूखंडों की दूरस्थ निगरानी करते हैं। रडार और ऑप्टिकल तरंगों का विश्लेषण करके, हम आपके खेत पर महंगे सेंसर की आवश्यकता के बिना सटीक मिट्टी की नमी और वनस्पति स्वास्थ्य की गणना करते हैं।",
    benefit1Title: "फसल नुकसान को रोकें:",
    benefit1Desc: " आने वाले सूखे मौसम के बारे में चेतावनी प्राप्त करें।",
    benefit2Title: "संसाधनों का अनुकूलन करें:",
    benefit2Desc: " ठीक से जानें कि कब और कितनी खाद या पानी डालना है।",
    benefit3Title: "रोग की रोकथाम:",
    benefit3Desc: " आंखों को दिखने से पहले ही वनस्पतियों के तनाव को पहचानें।",
    engineTag: "3 चरण",
    engineTitle: "किसानएआई इंजन कैसे काम करता है",
    engineDesc: "हमारा प्लेटफॉर्म बीज चयन से लेकर फसल निदान तक चरण-दर-चरण मार्गदर्शन प्रदान करता है।",
    stage1Num: "01",
    stage1Title: "1. बुवाई-पूर्व सलाह",
    stage1Desc: "हम आपके गांव के मिट्टी के कार्ड, भूजल गहराई और मौसमी बारिश के पूर्वानुमान की जांच करते हैं। हम विफल होने वाली फसलों को हटाकर सुरक्षित और लाभदायक विकल्प सुझाते हैं।",
    stage1Sources: ["सॉइल कार्ड", "भूजल स्तर", "वर्षा पूर्वानुमान"],
    stage2Num: "02",
    stage2Title: "2. फसल विकास की निगरानी",
    stage2Desc: "बुवाई के बाद, उपग्रह आपकी फसल के पानी के तनाव को ट्रैक करते हैं। यदि नमी सुरक्षा स्तर से कम होती है, तो नुकसान से पहले आपको सिंचाई की चेतावनी मिलती है।",
    stage2Sources: ["रडार नमी", "फसल तनाव", "वाष्पीकरण"],
    stage3Num: "03",
    stage3Title: "3. समस्या निदान",
    stage3Desc: "पीली पत्तियां या कीड़े दिखाई दिए? फोटो या वॉयस नोट भेजें। हमारा सिस्टम इसका विश्लेषण करता है, उपचार की सलाह भेजता है या विशेषज्ञों से जोड़ता है।",
    stage3Sources: ["AI फोटो स्कैन", "वॉयस नोट्स", "सरकारी विशेषज्ञ"],
    phoneTag: "समावेशी माध्यम",
    phoneTitle: "कीपैड फोन के लिए निर्मित",
    phoneDesc1: "ग्रामीण भारत में 50% से अधिक छोटे किसान स्मार्टफोन का उपयोग नहीं करते हैं। जो करते हैं, वे भी धीमे इंटरनेट का सामना करते हैं। ऐप्स समाधान नहीं हैं।",
    phoneDesc2: "किसानएआई ऐप्स को पूरी तरह से बायपास करता है। हम जटिल उपग्रह मानचित्रों को सरल तरीकों में बदलते हैं:",
    ivrTitle: "स्वचालित वॉयस कॉल (IVR)",
    ivrDesc: "स्थानीय भारतीय भाषाओं में, सिंचाई के स्पष्ट कार्यों का विवरण देती है।",
    smsTitle: "एसएमएस सलाह",
    smsDesc: "संक्षिप्त पाठ सारांश जो सीधे किसी भी बुनियादी फोन पर भेजे जाते हैं।",
    limitsTag: "सीमाएं",
    limitsTitle: "ईमानदार प्रणाली सीमाएं",
    limitsDesc: "हमारे उपग्रह मॉडल क्या कर सकते हैं और क्या नहीं कर सकते हैं। हम सीमाओं को ईमानदारी से स्वीकार करते हैं।",
    limitTh1: "कृषि संकेतक",
    limitTh2: "क्या किसानएआई इसका पता लगा सकता है?",
    limitTh3: "यह कैसे काम करता है",
    limitRow1Name: "पानी की कमी",
    limitRow1Val: "✓ हाँ",
    limitRow1Desc: "सेंटिनल-1 (मिट्टी रडार) और सेंटिनल-2 (पत्ती पानी की मात्रा) के माध्यम से गणना की जाती है।",
    limitRow2Name: "प्रारंभिक फसल तनाव",
    limitRow2Val: "✓ हाँ",
    limitRow2Desc: "पत्तियों के पीले होने से पहले ही NDRE और PRI प्रकाश सूचकांकों का उपयोग करके पहचाना जाता है।",
    limitRow3Name: "कीटों का प्रकोप",
    limitRow3Val: "✗ नहीं",
    limitRow3Desc: "उपग्रह कीड़ों को नहीं देख सकते। हम केवल तापमान और आर्द्रता का उपयोग करके कीट जोखिम का अनुमान लगाते हैं।",
    limitRow4Name: "सटीक फसल रोग",
    limitRow4Val: "✗ नहीं",
    limitRow4Desc: "उपग्रह केवल यह संकेत देते हैं कि 'कुछ गलत है।' सटीक पहचान के लिए किसान की भेजी फोटो आवश्यक है।",
    limitRow5Name: "मिट्टी का सूक्ष्मजीव स्वास्थ्य",
    limitRow5Val: "✗ नहीं",
    limitRow5Desc: "शारीरिक प्रयोगशाला परीक्षण की आवश्यकता होती है (जो आपके सॉइल हेल्थ कार्ड से जुड़ा है)।",
    ctaTitle: "प्रणाली का परीक्षण करने के लिए तैयार हैं?",
    ctaDesc: "किसान यात्रा डेमो का अन्वेषण करें। ऑनबोर्डिंग, सिफारिशों और रोग निदान चेतावनी को देखें।",
    ctaBtn: "इंटरैक्टिव डेमो खोलें",
    footerText: "किसानएआई — हैकाथॉन डेमो • गूगल सॉल्यूशन चैलेंज के लिए निर्मित"
  }
};

const LandingPage = () => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMouseOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const t = translations[lang];

  return (
    <div className="landing-page">

      {/* Navbar */}
      <nav className="navbar">
        <div className="container nav-inner">
          <div className="nav-logo">
            <Sprout size={24} className="nav-logo-icon" />
            <span>{t.logo}</span>
          </div>
          
          <div className="nav-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Language Selector Dropdown */}
            <div className="lang-selector-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={18} className="lang-globe-icon" style={{ color: '#059669' }} />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)} 
                className="lang-select-dropdown"
              >
                <option value="en">English</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>

            <Link to="/demo" className="btn-primary nav-cta">
              {t.demoBtn} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        {/* Interactive 3D Perspective Grid Background */}
        <div 
          className="hero-3d-grid" 
          style={{ 
            transform: `perspective(600px) rotateX(60deg) translateY(-140px) translateZ(-60px) translate(${mouseOffset.x * -40}px, ${mouseOffset.y * -40}px)` 
          }}
        ></div>
        
        {/* Topographic Contour lines in background */}
        <div 
          className="topographic-contours"
          style={{
            transform: `translate(${mouseOffset.x * 20}px, ${mouseOffset.y * 20}px)`
          }}
        ></div>

        {/* Floating 3D CSS Satellite Model */}
        <div 
          className="floating-3d-wrapper sat-wrapper"
          style={{
            transform: `translate3d(${mouseOffset.x * -60}px, ${mouseOffset.y * -40}px, 0)`
          }}
        >
          <div className="satellite-3d">
            <div className="sat-core">
              <div className="face front"><Satellite size={16} className="sat-icon" /></div>
              <div className="face back"></div>
              <div className="face left"></div>
              <div className="face right"></div>
              <div className="face top"></div>
              <div className="face bottom"></div>
            </div>
            <div className="solar-panel left-panel"></div>
            <div className="solar-panel right-panel"></div>
          </div>
        </div>

        {/* Floating 3D CSS Data Sprout Cube */}
        <div 
          className="floating-3d-wrapper cube-wrapper"
          style={{
            transform: `translate3d(${mouseOffset.x * 40}px, ${mouseOffset.y * 60}px, 0)`
          }}
        >
          <div className="cube-3d">
            <div className="face front"><Sprout size={20} className="sprout-icon" /></div>
            <div className="face back"></div>
            <div className="face left"></div>
            <div className="face right"></div>
            <div className="face top"></div>
            <div className="face bottom"></div>
          </div>
        </div>

        <div className="container hero-content">
          <div className="hero-tag">
            <Satellite size={14} /> {t.tag}
          </div>
          <h1>{t.title1}<br/><span className="highlight">{t.title2}</span></h1>
          <p className="hero-subtitle">{t.subtitle}</p>
          <div className="hero-actions">
            <Link to="/demo" className="btn-primary hero-btn">
              {t.demoBtn} <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="btn-secondary hero-btn-alt">
              {t.howBtn}
            </a>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">{t.stat1Val}</span>
              <span className="stat-label">{t.stat1Lbl}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">{t.stat2Val}</span>
              <span className="stat-label">{t.stat2Lbl}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">{t.stat3Val}</span>
              <span className="stat-label">{t.stat3Lbl}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Concept Explanation with Image */}
      <section className="concept-section container" id="how-it-works">
        <div className="concept-grid">
          <div className="concept-image-box">
            <img 
              src="/satellite_scan.png" 
              alt="Satellite scanning agricultural field" 
              className="concept-image" 
            />
            <div className="image-caption">
              Our system checks Sentinel satellite data to track soil moisture and plant stress levels remotely from space.
            </div>
          </div>
          <div className="concept-text-box">
            <div className="section-tag">{t.whatTag}</div>
            <h2>{t.whatTitle}</h2>
            <p className="mb-4">{t.whatDesc}</p>
            <ul className="benefits-list">
              <li>
                <ShieldCheck size={20} className="benefit-icon" />
                <div>
                  <strong>{t.benefit1Title}</strong>{t.benefit1Desc}
                </div>
              </li>
              <li>
                <Activity size={20} className="benefit-icon" />
                <div>
                  <strong>{t.benefit2Title}</strong>{t.benefit2Desc}
                </div>
              </li>
              <li>
                <HeartPulse size={20} className="benefit-icon" />
                <div>
                  <strong>{t.benefit3Title}</strong>{t.benefit3Desc}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Three-Stage Engine */}
      <section className="engine-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">{t.engineTag}</div>
            <h2>{t.engineTitle}</h2>
            <p className="section-desc">{t.engineDesc}</p>
          </div>

          <div className="pipeline">
            <div className="stage-card">
              <div className="stage-number">{t.stage1Num}</div>
              <div className="icon-wrapper">
                <Sprout size={28} />
              </div>
              <h3>{t.stage1Title}</h3>
              <p>{t.stage1Desc}</p>
              <div className="stage-sources">
                {t.stage1Sources.map((src, i) => <span key={i}>{src}</span>)}
              </div>
            </div>

            <div className="stage-card">
              <div className="stage-number">{t.stage2Num}</div>
              <div className="icon-wrapper accent">
                <Activity size={28} />
              </div>
              <h3>{t.stage2Title}</h3>
              <p>{t.stage2Desc}</p>
              <div className="stage-sources">
                {t.stage2Sources.map((src, i) => <span key={i}>{src}</span>)}
              </div>
            </div>

            <div className="stage-card">
              <div className="stage-number">{t.stage3Num}</div>
              <div className="icon-wrapper danger">
                <Smartphone size={28} />
              </div>
              <h3>{t.stage3Title}</h3>
              <p>{t.stage3Desc}</p>
              <div className="stage-sources">
                {t.stage3Sources.map((src, i) => <span key={i}>{src}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Voice/SMS Section with Keypad Phone Image */}
      <section className="accessibility-section container">
        <div className="access-grid">
          <div className="access-text">
            <div className="section-tag">{t.phoneTag}</div>
            <h2>{t.phoneTitle}</h2>
            <p>{t.phoneDesc1}</p>
            <p>{t.phoneDesc2}</p>
            <div className="channel-box">
              <div className="channel-item">
                <Phone className="channel-icon" size={24} />
                <div>
                  <h4>{t.ivrTitle}</h4>
                  <p>{t.ivrDesc}</p>
                </div>
              </div>
              <div className="channel-item">
                <MessageSquare className="channel-icon" size={24} />
                <div>
                  <h4>{t.smsTitle}</h4>
                  <p>{t.smsDesc}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="access-visual-box">
            <img 
              src="/farmer_phone.png" 
              alt="Hand holding basic keypad mobile phone in agriculture field" 
              className="access-image"
            />
          </div>
        </div>
      </section>

      {/* Honest Limits Table (Redesigned to be Light and Clean) */}
      <section className="limits-section-light container">
        <div className="section-header">
          <div className="section-tag">{t.limitsTag}</div>
          <h2>{t.limitsTitle}</h2>
          <p className="section-desc">{t.limitsDesc}</p>
        </div>
        <div className="table-container-light">
          <table className="limits-table-light">
            <thead>
              <tr>
                <th>{t.limitTh1}</th>
                <th>{t.limitTh2}</th>
                <th>{t.limitTh3}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{t.limitRow1Name}</strong></td>
                <td className="status-yes">{t.limitRow1Val}</td>
                <td>{t.limitRow1Desc}</td>
              </tr>
              <tr>
                <td><strong>{t.limitRow2Name}</strong></td>
                <td className="status-yes">{t.limitRow2Val}</td>
                <td>{t.limitRow2Desc}</td>
              </tr>
              <tr>
                <td><strong>{t.limitRow3Name}</strong></td>
                <td className="status-no">{t.limitRow3Val}</td>
                <td>{t.limitRow3Desc}</td>
              </tr>
              <tr>
                <td><strong>{t.limitRow4Name}</strong></td>
                <td className="status-no">{t.limitRow4Val}</td>
                <td>{t.limitRow4Desc}</td>
              </tr>
              <tr>
                <td><strong>{t.limitRow5Name}</strong></td>
                <td className="status-no">{t.limitRow5Val}</td>
                <td>{t.limitRow5Desc}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="container text-center">
          <h2>{t.ctaTitle}</h2>
          <p className="cta-desc">{t.ctaDesc}</p>
          <Link to="/demo" className="btn-primary hero-btn">
            {t.ctaBtn} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container text-center">
          <p>{t.footerText}</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
