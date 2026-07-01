import React, { useState, useEffect, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ── Isolated Map Component - wrapped in memo so it NEVER re-renders ──
const PickupMap = memo(({ onPin, onRemove }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const marker = useRef(null);

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const boot = () => {
      if (mapInstance.current || !mapRef.current || !window.L) return;
      const L = window.L;
      const map = L.map(mapRef.current, { center: [20.5937, 78.9629], zoom: 5 });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO', maxZoom: 19
      }).addTo(map);

      map.on('click', ({ latlng }) => {
        if (marker.current) map.removeLayer(marker.current);
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:18px;height:18px;border-radius:50%;background:#16a34a;border:3px solid #fff;box-shadow:0 0 10px rgba(22,163,74,0.6);"></div>`,
          iconSize: [18, 18], iconAnchor: [9, 9]
        });
        marker.current = L.marker([latlng.lat, latlng.lng], { icon }).addTo(map)
          .bindPopup(`<div style="background:#fff;padding:8px 12px;border-radius:8px;font-size:0.8rem;color:#0f1f12;font-family:Inter,sans-serif;">📍 Pickup pin set ✓</div>`)
          .openPopup();
        onPin({ lat: parseFloat(latlng.lat.toFixed(6)), lng: parseFloat(latlng.lng.toFixed(6)) });
      });

      mapInstance.current = map;

      // expose helpers on window so form can call them without re-render
      window._wbMap = {
        flyTo: (city) => {
          if (!city || city.length < 3) return;
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city + ', India')}&limit=1`)
            .then(r => r.json()).then(d => {
              if (d[0] && mapInstance.current) {
                mapInstance.current.flyTo([parseFloat(d[0].lat), parseFloat(d[0].lon)], 11, { duration: 1 });
              }
            }).catch(() => {});
        },
        removePin: () => {
          if (marker.current && mapInstance.current) {
            mapInstance.current.removeLayer(marker.current);
            marker.current = null;
          }
          onRemove();
        }
      };
    };

    if (window.L) { boot(); }
    else {
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload = boot;
      document.head.appendChild(s);
    }

    return () => {
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; }
      delete window._wbMap;
    };
  }, []); // EMPTY — never re-runs

  return (
    <>
      <div ref={mapRef} style={{ height: 380, width: '100%' }} />
      <style>{`
        .leaflet-popup-content-wrapper { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip-container { display: none !important; }
        .leaflet-container { background: #f4faf6; }
      `}</style>
    </>
  );
}, () => true); // () => true means NEVER re-render this component

// ── Main Form ──
export default function CreateListing() {
  const navigate = useNavigate();
  const cityTimer = useRef(null);
  const [loading, setLoading] = useState(false);
  const [pinCoords, setPinCoords] = useState(null);

  // Each field is its own state — no shared object
  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [wasteType, setWasteType]   = useState('plastic');
  const [source, setSource]         = useState('river');
  const [quantity, setQuantity]     = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [urgency, setUrgency]       = useState('medium');
  const [address, setAddress]       = useState('');
  const [city, setCity]             = useState('');
  const [stateVal, setStateVal]     = useState('');
  const [pincode, setPincode]       = useState('');
  const [availableTill, setAvailableTill] = useState('');
  const [tags, setTags]             = useState('');

  const handleCityChange = (e) => {
    const val = e.target.value;
    setCity(val);
    if (cityTimer.current) clearTimeout(cityTimer.current);
    cityTimer.current = setTimeout(() => {
      if (window._wbMap) window._wbMap.flyTo(val);
    }, 900);
  };

  const handlePin = (coords) => setPinCoords(coords);
  const handleRemove = () => setPinCoords(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!pinCoords) { toast.error('Please drop a pin on the map'); return; }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/listings`, {
        title, description, wasteType, source, urgency,
        quantity: Number(quantity),
        pricePerKg: Number(pricePerKg),
        location: { address, city, state: stateVal, pincode, coordinates: pinCoords },
        availableTill: availableTill || undefined,
        tags: tags ? tags.split(',').map(t => t.trim()) : []
      });
      toast.success('Listing posted!');
      navigate(`/listings/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post listing');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = quantity && pricePerKg
    ? (Number(quantity) * Number(pricePerKg)).toLocaleString() : null;

  const L = { display: 'block', color: '#374151', fontSize: '0.85rem', marginBottom: 6, fontWeight: 500 };
  const W = { marginBottom: 16 };
  const Box = ({ title: t, children }) => (
    <div style={{ background: '#fff', borderRadius: 14, padding: 22, border: '1.5px solid rgba(0,0,0,0.08)', marginBottom: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
      <h3 style={{ color: '#0f1f12', marginBottom: 16, fontSize: '0.95rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: 10 }}>{t}</h3>
      {children}
    </div>
  );

  return (
    <div style={{ background: '#f4faf6', minHeight: '100vh', padding: '40px 24px' }}>

      {/* Global styles for inputs */}
      <style>{`
        .wb-input {
          font-family: Inter, sans-serif;
          background: #ffffff;
          border: 1.5px solid rgba(0,0,0,0.12);
          border-radius: 8px;
          color: #0f1f12 !important;
          padding: 10px 14px;
          width: 100%;
          outline: none;
          font-size: 0.9rem;
          transition: border 0.2s, box-shadow 0.2s;
          cursor: text !important;
          caret-color: #0f1f12 !important;
        }
        .wb-input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
        }
        .wb-input:hover {
          border-color: rgba(0,0,0,0.25);
          cursor: text !important;
        }
        .wb-input::placeholder { color: #9ca3af; }
        .wb-select {
          font-family: Inter, sans-serif;
          background: #ffffff;
          border: 1.5px solid rgba(0,0,0,0.12);
          border-radius: 8px;
          color: #0f1f12 !important;
          padding: 10px 14px;
          width: 100%;
          outline: none;
          font-size: 0.9rem;
          cursor: pointer !important;
          transition: border 0.2s;
        }
        .wb-select:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
        .wb-select:hover { border-color: rgba(0,0,0,0.25); }
        .wb-textarea {
          font-family: Inter, sans-serif;
          background: #ffffff;
          border: 1.5px solid rgba(0,0,0,0.12);
          border-radius: 8px;
          color: #0f1f12 !important;
          padding: 10px 14px;
          width: 100%;
          outline: none;
          font-size: 0.9rem;
          resize: vertical;
          cursor: text !important;
          caret-color: #0f1f12 !important;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .wb-textarea:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
        .wb-textarea:hover { border-color: rgba(0,0,0,0.25); }
        .wb-textarea::placeholder { color: #9ca3af; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.9rem', cursor: 'pointer', marginBottom: 10 }}>← Back</button>
          <h1 style={{ fontSize: '1.9rem', color: '#0f1f12', marginBottom: 6 }}>Post Waste Listing</h1>
          <p style={{ color: '#6b7280' }}>Help recycling companies discover and claim your collected waste</p>
        </div>

        <form onSubmit={submit} autoComplete="off">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* LEFT — Form */}
            <div>
              <Box title="📋 Basic Information">
                <div style={W}>
                  <label style={L}>Listing Title *</label>
                  <input className="wb-input" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. 500kg PET Plastic from Yamuna River Cleanup" />
                </div>
                <div style={W}>
                  <label style={L}>Description *</label>
                  <textarea className="wb-textarea" value={description} onChange={e => setDescription(e.target.value)} required rows={3} placeholder="Describe the waste — condition, how it was collected..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={W}>
                    <label style={L}>Waste Type *</label>
                    <select className="wb-select" value={wasteType} onChange={e => setWasteType(e.target.value)}>
                      {['plastic','metal','glass','paper','electronic','organic','textile','mixed'].map(t => (
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div style={W}>
                    <label style={L}>Source *</label>
                    <select className="wb-select" value={source} onChange={e => setSource(e.target.value)}>
                      {['river','ocean','landfill','household','industrial','other'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Box>

              <Box title="⚖️ Quantity & Pricing">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div style={W}>
                    <label style={L}>Quantity (kg) *</label>
                    <input className="wb-input" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required min="1" placeholder="500" />
                  </div>
                  <div style={W}>
                    <label style={L}>Price/kg (₹) *</label>
                    <input className="wb-input" type="number" value={pricePerKg} onChange={e => setPricePerKg(e.target.value)} required min="0" step="0.5" placeholder="15" />
                  </div>
                  <div style={W}>
                    <label style={L}>Urgency</label>
                    <select className="wb-select" value={urgency} onChange={e => setUrgency(e.target.value)}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                {totalPrice && (
                  <div style={{ background: '#f4faf6', border: '1px solid #dcfce7', borderRadius: 10, padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span>💰</span>
                    <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Estimated total:</span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>₹{totalPrice}</span>
                  </div>
                )}
              </Box>

              <Box title="📍 Location Details">
                <div style={W}>
                  <label style={L}>Full Address *</label>
                  <input className="wb-input" value={address} onChange={e => setAddress(e.target.value)} required placeholder="Pickup address or nearest landmark" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div style={W}>
                    <label style={L}>City *</label>
                    <input className="wb-input" value={city} onChange={handleCityChange} required placeholder="Delhi" />
                  </div>
                  <div style={W}>
                    <label style={L}>State *</label>
                    <input className="wb-input" value={stateVal} onChange={e => setStateVal(e.target.value)} required placeholder="Delhi" />
                  </div>
                  <div style={W}>
                    <label style={L}>PIN Code</label>
                    <input className="wb-input" value={pincode} onChange={e => setPincode(e.target.value)} placeholder="110001" />
                  </div>
                </div>
              </Box>

              <Box title="🗓️ Additional Info">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={W}>
                    <label style={L}>Available Until</label>
                    <input className="wb-input" type="date" value={availableTill} onChange={e => setAvailableTill(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div style={W}>
                    <label style={L}>Tags (comma-separated)</label>
                    <input className="wb-input" value={tags} onChange={e => setTags(e.target.value)} placeholder="ocean, PET, sorted" />
                  </div>
                </div>
              </Box>
            </div>

            {/* RIGHT — Map (frozen, never re-renders) */}
            <div>
              <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid rgba(0,0,0,0.08)', overflow: 'hidden', position: 'sticky', top: 80, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                  <h3 style={{ color: '#0f1f12', fontSize: '0.95rem', marginBottom: 4 }}>🗺️ Pin Pickup Location</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                    {pinCoords
                      ? `✅ Pinned at ${pinCoords.lat.toFixed(4)}, ${pinCoords.lng.toFixed(4)}`
                      : 'Type city above to navigate, then click map to drop pin'}
                  </p>
                </div>

                <PickupMap onPin={handlePin} onRemove={handleRemove} />

                {pinCoords ? (
                  <div style={{ padding: '12px 18px', background: '#f4faf6', borderTop: '1px solid #dcfce7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: '#16a34a', fontSize: '0.8rem', fontWeight: 600 }}>📍 Pin dropped successfully</div>
                      <div style={{ color: '#9ca3af', fontSize: '0.72rem', marginTop: 2 }}>{pinCoords.lat}, {pinCoords.lng}</div>
                    </div>
                    <button type="button"
                      onClick={() => window._wbMap && window._wbMap.removePin()}
                      style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '6px 12px', borderRadius: 8, fontSize: '0.8rem', cursor: 'pointer' }}>
                      Remove Pin
                    </button>
                  </div>
                ) : (
                  <div style={{ padding: '12px 18px', background: '#fffbeb', borderTop: '1px solid #fde68a' }}>
                    <p style={{ color: '#92400e', fontSize: '0.78rem', margin: 0 }}>⚠️ Click anywhere on the map to drop a pickup pin</p>
                  </div>
                )}

                <div style={{ padding: '10px 18px' }}>
                  <p style={{ color: '#9ca3af', fontSize: '0.74rem', margin: 0 }}>ℹ️ This pin shows recyclers exactly where to collect the waste</p>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', background: loading ? '#86efac' : '#16a34a',
            color: '#fff', border: 'none', borderRadius: 12, padding: '15px',
            fontWeight: 700, fontSize: '1.05rem', marginTop: 8,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(22,163,74,0.3)'
          }}>
            {loading ? 'Posting...' : '🌱 Post Waste Listing'}
          </button>

          {!pinCoords && (
            <p style={{ textAlign: 'center', color: '#d97706', fontSize: '0.85rem', marginTop: 10 }}>
              ⚠️ Drop a pin on the map before submitting
            </p>
          )}
        </form>
      </div>
    </div>
  );
}