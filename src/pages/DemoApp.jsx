import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockDistricts, mockVillages, mockSeasons, mockWaterSources, mockRecommendations, mockAlertMessages, mockSoilData } from '../data/mockData';
import { Map as MapIcon, Droplets, Thermometer, CloudRain, Camera, Send, CheckCircle2, ArrowLeft, Layers, ShieldCheck, Cpu, RefreshCw, Terminal, Check, Globe } from 'lucide-react';
import './DemoApp.css';

const initialMapCells = [
  { id: 1, row: 1, col: 1, ndvi: 0.81, moisture: 45, status: 'healthy', name: 'North Plot A' },
  { id: 2, row: 1, col: 2, ndvi: 0.78, moisture: 42, status: 'healthy', name: 'North Plot B' },
  { id: 3, row: 1, col: 3, ndvi: 0.82, moisture: 46, status: 'healthy', name: 'Main Orchard' },
  { id: 4, row: 1, col: 4, ndvi: 0.75, moisture: 40, status: 'healthy', name: 'West Border' },
  { id: 5, row: 2, col: 1, ndvi: 0.79, moisture: 43, status: 'healthy', name: 'North Plot C' },
  { id: 6, row: 2, col: 2, ndvi: 0.58, moisture: 30, status: 'warning', name: 'Central Slope A' },
  { id: 7, row: 2, col: 3, ndvi: 0.52, moisture: 28, status: 'warning', name: 'Central Slope B' },
  { id: 8, row: 2, col: 4, ndvi: 0.76, moisture: 41, status: 'healthy', name: 'West Plot A' },
  { id: 9, row: 3, col: 1, ndvi: 0.80, moisture: 44, status: 'healthy', name: 'East Plot A' },
  { id: 10, row: 3, col: 2, ndvi: 0.38, moisture: 19, status: 'stress', name: 'Dry Zone A' },
  { id: 11, row: 3, col: 3, ndvi: 0.34, moisture: 16, status: 'stress', name: 'Dry Zone B' },
  { id: 12, row: 3, col: 4, ndvi: 0.77, moisture: 42, status: 'healthy', name: 'West Plot B' },
  { id: 13, row: 4, col: 1, ndvi: 0.83, moisture: 47, status: 'healthy', name: 'East Plot B' },
  { id: 14, row: 4, col: 2, ndvi: 0.81, moisture: 45, status: 'healthy', name: 'South Slope A' },
  { id: 15, row: 4, col: 3, ndvi: 0.79, moisture: 44, status: 'healthy', name: 'South Slope B' },
  { id: 16, row: 4, col: 4, ndvi: 0.84, moisture: 48, status: 'healthy', name: 'South Border' }
];

const DemoApp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    district: 'Guntur',
    village: 'Pedakakani',
    season: 'Kharif (Monsoon)',
    waterSource: 'rainfed',
    phone: '+91 98765 43210'
  });
  
  const [tier, setTier] = useState(0); // 0 = Satellite, 1 = IoT Sensor
  const [diagnosisState, setDiagnosisState] = useState('idle'); // idle, uploading, complete
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Map States
  const [mapCells, setMapCells] = useState(initialMapCells);
  const [selectedCell, setSelectedCell] = useState(initialMapCells[9]); // Dry Zone A
  const [apiState, setApiState] = useState('idle'); // idle, fetching, success
  const [jsonResponse, setJsonResponse] = useState(null);
  const [mapTab, setMapTab] = useState('scanner'); // scanner, google

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMouseOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSimulate = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const soilData = mockSoilData[formData.district] || mockSoilData['Guntur'];
  const recommendations = mockRecommendations[formData.season]?.[formData.district] || mockRecommendations['Kharif (Monsoon)']['Guntur'];

  const simulateDiagnosis = () => {
    setDiagnosisState('uploading');
    setTimeout(() => {
      setDiagnosisState('complete');
    }, 2000);
  };

  // Simulate Live Sentinel API Request
  const fetchSentinelData = () => {
    setApiState('fetching');
    setTimeout(() => {
      // Slightly randomize values
      const updated = mapCells.map(c => {
        const delta = (Math.random() - 0.5) * 0.1;
        const newNdvi = Math.max(0.15, Math.min(0.95, c.ndvi + delta));
        const newMoisture = Math.round(newNdvi * 55);
        let status = 'healthy';
        if (newNdvi < 0.4) status = 'stress';
        else if (newNdvi < 0.6) status = 'warning';
        return { ...c, ndvi: parseFloat(newNdvi.toFixed(2)), moisture: newMoisture, status };
      });
      setMapCells(updated);
      setSelectedCell(updated.find(c => c.id === selectedCell.id) || updated[9]);
      setApiState('success');

      // Set mock response JSON payload
      setJsonResponse({
        status: 200,
        source: "Sentinel-2 L2A (ESA)",
        timestamp: new Date().toISOString(),
        coordinates: {
          lat: 16.3214,
          lon: 80.4357
        },
        cloudCover: "2.14%",
        indices: updated.map(c => ({
          plot: c.name,
          ndvi: c.ndvi,
          moisture: c.moisture,
          alert: c.status !== 'healthy'
        }))
      });
    }, 2200);
  };

  return (
    <div className="demo-app">
      {/* Interactive 3D Perspective Grid Background */}
      <div 
        className="demo-3d-grid" 
        style={{ 
          transform: `perspective(600px) rotateX(60deg) translateY(-140px) translateZ(-60px) translate(${mouseOffset.x * -30}px, ${mouseOffset.y * -30}px)` 
        }}
      ></div>

      <header className="demo-header">
        <div className="container flex justify-between items-center header-inner">
          <div className="logo">
            KisanAI <span className="badge">PITCH DEMO</span>
          </div>
          <Link to="/" className="btn-secondary text-sm" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', borderColor: 'rgba(16,185,129,0.3)' }}>
            <ArrowLeft size={16} /> Back to Pitch
          </Link>
        </div>
      </header>

      <main className="container main-content">
        {step === 1 ? (
          <div className="onboarding-container">
            {/* Info Side */}
            <div className="onboarding-info">
              <h1>Simulate the <br/><span className="highlight" style={{color: '#059669'}}>Farmer Journey</span></h1>
              <p>
                Behind our voice-and-SMS interface lies a powerful, automated data aggregation engine. Experience how KisanAI aggregates regional datasets and triggers target alerts.
              </p>
              
              <div className="onboarding-steps">
                <div className="onboarding-step">
                  <div className="step-num">1</div>
                  <div className="step-text">
                    <h4>Register a Profile</h4>
                    <p>Enter local geographical details and farmer's simulated phone number.</p>
                  </div>
                </div>
                <div className="onboarding-step">
                  <div className="step-num">2</div>
                  <div className="step-text">
                    <h4>Review Recommended Crops</h4>
                    <p>Observe crop lists filtered for risk and optimized for safety & profit.</p>
                  </div>
                </div>
                <div className="onboarding-step">
                  <div className="step-num">3</div>
                  <div className="step-text">
                    <h4>Monitor and Diagnose</h4>
                    <p>Simulate satellite & sensor updates and test the AI-photo disease diagnosis flow.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="onboarding-form card">
              <h2 className="mb-4" style={{fontSize: '1.75rem'}}>Farmer Context</h2>
              <p className="text-secondary mb-8 text-sm" style={{color: '#274b3d'}}>
                Provide district and village details to automatically look up soil cards, satellite imagery records, and local weather tables.
              </p>
              <form onSubmit={handleSimulate} className="flex flex-col gap-4">
                <div>
                  <label className="label">District (Andhra Pradesh)</label>
                  <select name="district" value={formData.district} onChange={handleInputChange} className="select-field">
                    {mockDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="label">Village</label>
                  <select name="village" value={formData.village} onChange={handleInputChange} className="select-field">
                    {mockVillages.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Phone Number (For IVR/SMS Delivery)</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    className="select-field"
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
                
                <div>
                  <label className="label">Season</label>
                  <select name="season" value={formData.season} onChange={handleInputChange} className="select-field">
                    {mockSeasons.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Water Source</label>
                  <select name="waterSource" value={formData.waterSource} onChange={handleInputChange} className="select-field">
                    {mockWaterSources.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                
                <button type="submit" className="btn-primary mt-4" style={{width: '100%'}}>
                  Generate Agricultural Intelligence
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="dashboard-view" style={{marginTop: '2rem'}}>
            
            {/* Context Banner */}
            <div className="context-banner mb-8">
              <div>
                <span className="badge badge-safe" style={{ marginRight: '10px' }}>Active Profile</span>
                <strong>{formData.village}, {formData.district}</strong> &bull; <span style={{ color: '#059669' }}>{formData.phone}</span> &bull; {formData.season} &bull; {mockWaterSources.find(w=>w.id===formData.waterSource)?.name}
              </div>
              <div style={{ color: '#274b3d', fontSize: '0.9rem' }}>
                Soil: <span style={{ fontWeight: 600 }}>{soilData.type}</span> | pH: <span style={{ fontWeight: 600 }}>{soilData.pH}</span> | NPK: <span style={{ fontWeight: 600 }}>{soilData.n}/{soilData.p}/{soilData.k}</span>
              </div>
            </div>

            <h2 className="section-title">Stage 1: Crop Recommendation</h2>
            <div className="grid grid-cols-2 gap-8 mb-8 recommendations-grid">
              {/* Track 1 */}
              <div className="card track-card border-safe">
                <div className="flex justify-between items-center mb-4">
                  <h3 style={{ fontSize: '1.2rem', color: '#053e2d' }}>Track 1: Safe & Familiar</h3>
                  <span className="badge badge-safe">Recommended</span>
                </div>
                <div className="crop-name">{recommendations.track1.name}</div>
                <div className="match-score">Match Score: {recommendations.track1.matchScore}%</div>
                <ul className="reasons-list">
                  {recommendations.track1.reasons.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
                <div className="stats flex justify-between mt-4 text-sm">
                  <span><strong>ROI:</strong> {recommendations.track1.roi}</span>
                  <span><strong>Duration:</strong> {recommendations.track1.duration}</span>
                </div>
              </div>
              
              {/* Track 2 */}
              <div className="card track-card border-profit">
                <div className="flex justify-between items-center mb-4">
                  <h3 style={{ fontSize: '1.2rem', color: '#053e2d' }}>Track 2: Profit-Optimized</h3>
                  <span className="badge badge-profit">High Reward</span>
                </div>
                <div className="crop-name">{recommendations.track2.name}</div>
                <div className="match-score">Match Score: {recommendations.track2.matchScore}%</div>
                <ul className="reasons-list">
                  {recommendations.track2.reasons.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
                <div className="stats flex justify-between mt-4 text-sm">
                  <span><strong>ROI:</strong> {recommendations.track2.roi}</span>
                  <span><strong>Duration:</strong> {recommendations.track2.duration}</span>
                </div>
              </div>
            </div>

            {/* Stage 2 Section */}
            <h2 className="section-title">Stage 2: Ongoing Monitoring</h2>
            <div className="grid grid-cols-2 gap-8 mb-8 monitoring-dashboard-grid">
              
              {/* Sensor & Water Balance Vitals */}
              <div className="card flex flex-col gap-6">
                <div className="tier-toggle">
                  <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#053e2d' }}>
                    <Layers size={18} className="text-primary" /> Data Source Precision
                  </div>
                  <div className="toggle-group">
                    <button className={`toggle-btn ${tier === 0 ? 'active' : ''}`} onClick={() => setTier(0)}>
                      Tier 0 (Satellite)
                    </button>
                    <button className={`toggle-btn ${tier === 1 ? 'active' : ''}`} onClick={() => setTier(1)}>
                      Tier 1 (IoT Sensor)
                    </button>
                  </div>
                </div>
                
                <div className="sensor-readings">
                  <div className="reading-box">
                    <div className="reading-icon moisture">
                      <Droplets size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-secondary" style={{ fontSize: '0.8rem' }}>Soil Moisture</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                        {tier === 0 ? soilData.moistureCurrent + '% (Est)' : (soilData.moistureCurrent - 2) + '.4% (Exact)'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="reading-box">
                    <div className="reading-icon rain">
                      <CloudRain size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-secondary" style={{ fontSize: '0.8rem' }}>Rain Forecast</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>None (5 Days)</div>
                    </div>
                  </div>
                </div>

                <div className="water-balance-proj">
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={18} /> Water Balance Projection
                  </h4>
                  <p>
                    Current Moisture + Expected Rain - Evapotranspiration = <strong>Deficit Warning</strong>
                  </p>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill h-full" style={{ width: '30%', height: '100%' }}></div>
                  </div>
                  <div className="text-xs text-right mt-2" style={{ color: '#b45309', fontSize: '0.75rem', fontWeight: 600 }}>
                    Critical moisture threshold reached in 2 days
                  </div>
                </div>
              </div>

              {/* Interactive Satellite GIS Map Card */}
              <div className="card gis-map-card">
                <div className="flex justify-between items-center mb-4">
                  {/* Tab Selector */}
                  <div className="map-tabs" style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className={`map-tab-btn ${mapTab === 'scanner' ? 'active' : ''}`}
                      onClick={() => setMapTab('scanner')}
                    >
                      <MapIcon size={16} /> Scanner Grid
                    </button>
                    <button 
                      className={`map-tab-btn ${mapTab === 'google' ? 'active' : ''}`}
                      onClick={() => setMapTab('google')}
                    >
                      <Globe size={16} /> Google Satellite View
                    </button>
                  </div>

                  {mapTab === 'scanner' && (
                    <button 
                      onClick={fetchSentinelData} 
                      disabled={apiState === 'fetching'}
                      className="btn-secondary fetch-api-btn"
                    >
                      <RefreshCw size={14} className={apiState === 'fetching' ? 'spin-animation' : ''} /> 
                      {apiState === 'fetching' ? 'Calling API...' : 'Fetch Sentinel Data'}
                    </button>
                  )}
                </div>

                {mapTab === 'scanner' ? (
                  <div className="gis-grid-wrapper">
                    {/* Grid Layout representing Farm Plots */}
                    <div className="gis-field-grid">
                      {mapCells.map(cell => (
                        <div 
                          key={cell.id} 
                          className={`gis-cell ${cell.status} ${selectedCell.id === cell.id ? 'active' : ''}`}
                          onClick={() => setSelectedCell(cell)}
                        >
                          <span className="cell-num">{cell.row}-{cell.col}</span>
                          <div className="cell-pulse"></div>
                        </div>
                      ))}
                    </div>

                    {/* Telemetry Panel */}
                    <div className="gis-telemetry-panel">
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#053e2d', borderBottom: '1px solid rgba(16,185,129,0.2)', paddingBottom: '6px', marginBottom: '8px' }}>
                        Telemetry: {selectedCell.name}
                      </h4>
                      <div className="telemetry-item">
                        <span>Coordinates:</span>
                        <strong>16.32{selectedCell.row}° N, 80.43{selectedCell.col}° E</strong>
                      </div>
                      <div className="telemetry-item">
                        <span>NDVI Vegetation:</span>
                        <strong className={`status-${selectedCell.status}`}>{selectedCell.ndvi}</strong>
                      </div>
                      <div className="telemetry-item">
                        <span>Est. Moisture:</span>
                        <strong>{selectedCell.moisture}%</strong>
                      </div>
                      <div className="telemetry-item">
                        <span>Status Alert:</span>
                        <span className={`cell-tag badge-${selectedCell.status}`}>{selectedCell.status.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="google-map-wrapper" style={{ marginTop: '10px' }}>
                    <iframe 
                      title="Google Satellite Map"
                      width="100%" 
                      height="250px" 
                      style={{ border: '1px solid rgba(16,185,129,0.25)', borderRadius: '8px', background: '#e6f7ee' }}
                      src={`https://maps.google.com/maps?q=${formData.village},%20${formData.district},%20Andhra%20Pradesh&t=k&z=14&output=embed`}
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                    <div className="map-footer-info" style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#274b3d' }}>
                      <span>Active Location: <strong>{formData.village}, {formData.district}</strong></span>
                      <span style={{ color: '#059669', fontWeight: 700 }}>● Live Satellite Link</span>
                    </div>
                  </div>
                )}

                {/* API Request Status Panel */}
                {mapTab === 'scanner' && apiState !== 'idle' && (
                  <div className="api-console-panel mt-4">
                    <div className="console-header">
                      <Terminal size={14} /> <span>Sentinel API Response Console</span>
                      <span className="console-status"><Check size={12} /> HTTP 200 OK</span>
                    </div>
                    <pre className="console-code">
                      {JSON.stringify(jsonResponse, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Stage 3 & Alert Section */}
            <div className="grid demo-main-grid">
              {/* Alert Feed */}
              <div>
                <h2 className="section-title">Stage 2 Alerts (Sent to {formData.phone})</h2>
                <div className="chat-ui">
                  {mockAlertMessages.filter(m => m.tier <= tier).map((msg, idx) => (
                    <div key={idx} className={`chat-bubble ${msg.type}`}>
                      <div className="chat-meta">{msg.time} &bull; {msg.type.toUpperCase()} &bull; Send Status: Sent</div>
                      <div className="chat-text" style={{ fontWeight: 500 }}>{msg.text}</div>
                      {msg.translation && <div className="chat-translation">{msg.translation}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo Diagnosis */}
              <div>
                <h2 className="section-title">Stage 3: Photo Diagnosis</h2>
                <div className="card">
                  {diagnosisState === 'idle' && (
                    <div className="diagnosis-flow">
                      <p className="text-sm text-secondary" style={{ color: '#274b3d' }}>
                        When a farmer notices plant stress, they send a photo via WhatsApp or MMS. Upload a sample crop photo to diagnose.
                      </p>
                      <button onClick={simulateDiagnosis} className="btn-secondary w-full" style={{ borderColor: 'rgba(16,185,129,0.3)', color: '#047857' }}>
                        <Camera size={18} /> Simulate Crop Photo Upload
                      </button>
                    </div>
                  )}
                  
                  {diagnosisState === 'uploading' && (
                    <div className="text-center p-4">
                      <div className="spinner mb-4"></div>
                      <div className="text-sm text-primary" style={{ fontWeight: 600, color: '#059669' }}>AI analyzing anomaly scan...</div>
                    </div>
                  )}
                  
                  {diagnosisState === 'complete' && (
                    <div className="diagnosis-flow">
                      <div className="diagnosis-preview-container">
                        <div className="disease-img-wrapper">
                          <img src="/diseased_cotton_leaf.png" alt="Crop Anomaly" className="disease-img" />
                        </div>
                        <div>
                          <span className="badge badge-profit" style={{ backgroundColor: 'rgba(220,38,38,0.15)', color: '#b91c1c', marginBottom: '8px' }}>Fungal Risk</span>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '4px 0', color: '#053e2d' }}>Blight Anomaly Found</h4>
                          <p className="text-xs text-secondary" style={{ color: '#274b3d' }}>
                            Matches satellite water stress anomalies from 2 days ago.
                          </p>
                        </div>
                      </div>

                      <div className="diagnosis-result">
                        <h4>High Probability: Fungal Blight</h4>
                        <p>
                          Apply Copper Oxychloride 3g/L or Mancozeb 2.5g/L. Keep fertilizer on hold until disease clears.
                        </p>
                        <button className="btn-primary w-full" style={{ backgroundColor: '#dc2626', boxShadow: 'none' }}>
                          <Send size={16} /> Escalate to Rythu Seva Kendra
                        </button>
                      </div>
                      
                      <div style={{ textAlign: 'center' }}>
                        <button onClick={() => setDiagnosisState('idle')} className="btn-secondary text-xs" style={{ border: 'none', padding: '4px 12px', color: '#274b3d' }}>
                          Reset Diagnosis
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center mt-12 pt-8 border-t" style={{ borderColor: 'rgba(16, 185, 129, 0.15)' }}>
              <button onClick={() => setStep(1)} className="btn-secondary" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#047857' }}>
                Simulate Different Farmer Profile
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DemoApp;
