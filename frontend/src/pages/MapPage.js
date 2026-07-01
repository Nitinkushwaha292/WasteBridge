import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { API } from '../context/AuthContext';

const WASTE_COLORS = {
  plastic: '#2563eb', metal: '#d97706', glass: '#7c3aed',
  paper: '#16a34a', electronic: '#dc2626', textile: '#ea580c',
  organic: '#15803d', mixed: '#6b7280'
};

const URGENCY_BORDER = { low: '#16a34a', medium: '#d97706', high: '#dc2626' };

const WASTE_ICONS = {
  plastic: '🧴', metal: '⚙️', glass: '🍶',
  paper: '📄', electronic: '💻', textile: '👕',
  organic: '🌿', mixed: '♻️'
};

export default function MapPage() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [listings, setListings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    axios.get(`${API}/listings?status=available`)
      .then(r => setListings(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const initMap = () => {
      if (mapInstanceRef.current || !mapRef.current) return;
      const L = window.L;
      if (!L) return;

      const map = L.map(mapRef.current, {
        center: [20.5937, 78.9629], zoom: 5, zoomControl: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO', maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);
    };

    if (window.L) initMap();
    else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || listings.length === 0) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    const filtered = filter ? listings.filter(l => l.wasteType === filter) : listings;

    filtered.forEach(listing => {
      const lat = listing.location?.coordinates?.lat;
      const lng = listing.location?.coordinates?.lng;
      if (!lat || !lng) return;

      const color = WASTE_COLORS[listing.wasteType] || '#16a34a';
      const urgencyColor = URGENCY_BORDER[listing.urgency] || '#d97706';
      const iconEmoji = WASTE_ICONS[listing.wasteType] || '♻️';

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;width:40px;height:40px;">
            <div style="
              width:40px;height:40px;border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);background:${color};
              border:3px solid ${urgencyColor};
              box-shadow:0 4px 12px ${color}50;
            "></div>
            <div style="
              position:absolute;top:50%;left:50%;
              transform:translate(-50%,-60%);
              font-size:15px;pointer-events:none;
            ">${iconEmoji}</div>
          </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      const marker = L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="
            background:#ffffff;border:1.5px solid ${color}30;
            border-radius:14px;padding:18px;min-width:230px;
            font-family:Inter,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,0.1);
          ">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <span style="background:${color}15;color:${color};font-size:0.7rem;font-weight:700;padding:3px 10px;border-radius:12px;text-transform:uppercase;">${listing.wasteType}</span>
              <span style="background:${urgencyColor}15;color:${urgencyColor};font-size:0.7rem;font-weight:600;padding:3px 8px;border-radius:12px;">${listing.urgency}</span>
            </div>
            <div style="color:#0f1f12;font-weight:600;font-size:0.92rem;margin-bottom:6px;line-height:1.4;">${listing.title}</div>
            <div style="color:#6b7280;font-size:0.8rem;margin-bottom:12px;">📍 ${listing.location?.city}, ${listing.location?.state}</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
              <div style="background:#f4faf6;border-radius:8px;padding:8px 10px;border:1px solid #dcfce7;">
                <div style="color:#9ca3af;font-size:0.65rem;text-transform:uppercase;margin-bottom:2px;">Quantity</div>
                <div style="color:#0f1f12;font-weight:700;">${listing.quantity} kg</div>
              </div>
              <div style="background:#f4faf6;border-radius:8px;padding:8px 10px;border:1px solid #dcfce7;">
                <div style="color:#9ca3af;font-size:0.65rem;text-transform:uppercase;margin-bottom:2px;">Price/kg</div>
                <div style="color:#16a34a;font-weight:700;">₹${listing.pricePerKg}</div>
              </div>
            </div>
            <div style="color:#6b7280;font-size:0.8rem;margin-bottom:12px;">
              By: <strong style="color:#0f1f12;">${listing.postedBy?.organization || 'NGO'}</strong>
            </div>
            <a href="/listings/${listing._id}" style="
              display:block;text-align:center;background:#16a34a;
              color:#fff;padding:9px;border-radius:8px;
              font-weight:700;font-size:0.85rem;text-decoration:none;
            ">View Full Listing →</a>
          </div>`,
          { maxWidth: 270 }
        );

      marker.on('click', () => setSelected(listing));
      markersRef.current.push(marker);
    });

    if (markersRef.current.length > 0) {
      try {
        const group = L.featureGroup(markersRef.current);
        const bounds = group.getBounds();
        if (bounds.isValid()) map.fitBounds(bounds.pad(0.1));
      } catch (e) {
        map.setView([20.5937, 78.9629], 5);
      }
    }
  }, [mapReady, listings, filter]);

  const flyTo = (listing) => {
    const lat = listing.location?.coordinates?.lat;
    const lng = listing.location?.coordinates?.lng;
    if (lat && lng && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 12, { duration: 1.2 });
      setSelected(listing);
    }
  };

  const filteredListings = filter ? listings.filter(l => l.wasteType === filter) : listings;
  const withCoords = listings.filter(l => l.location?.coordinates?.lat);

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', background: '#f4faf6' }}>

      {/* Top Bar */}
      <div style={{
        background: '#ffffff', borderBottom: '1.5px solid rgba(0,0,0,0.08)',
        padding: '12px 24px', display: 'flex', alignItems: 'center',
        gap: 16, flexWrap: 'wrap', flexShrink: 0,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.2rem' }}>🗺️</span>
          <h1 style={{ fontFamily: 'Space Grotesk', color: '#0f1f12', fontSize: '1.1rem', fontWeight: 700 }}>
            Waste Map
          </h1>
          <span style={{
            background: '#dcfce7', color: '#15803d',
            fontSize: '0.75rem', fontWeight: 600,
            padding: '3px 10px', borderRadius: 20, border: '1px solid #86efac'
          }}>{withCoords.length} locations</span>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => setFilter('')} style={{
            background: !filter ? '#16a34a' : '#ffffff',
            color: !filter ? '#fff' : '#6b7280',
            border: `1.5px solid ${!filter ? '#16a34a' : 'rgba(0,0,0,0.1)'}`,
            padding: '5px 14px', borderRadius: 20, fontSize: '0.8rem',
            fontWeight: 600, cursor: 'pointer'
          }}>All</button>
          {Object.entries(WASTE_COLORS).map(([type, color]) => (
            <button key={type} onClick={() => setFilter(type)} style={{
              background: filter === type ? color : '#ffffff',
              color: filter === type ? '#fff' : '#6b7280',
              border: `1.5px solid ${filter === type ? color : 'rgba(0,0,0,0.1)'}`,
              padding: '5px 14px', borderRadius: 20, fontSize: '0.8rem',
              fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize'
            }}>{WASTE_ICONS[type]} {type}</button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', color: '#6b7280', fontSize: '0.82rem' }}>
          {filteredListings.length} listings
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Sidebar */}
        <div style={{
          width: 320, background: '#ffffff',
          borderRight: '1.5px solid rgba(0,0,0,0.08)',
          overflowY: 'auto', flexShrink: 0
        }}>
          {loading ? (
            <div style={{ padding: 24, color: '#6b7280', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>⏳</div>
              Loading listings...
            </div>
          ) : filteredListings.length === 0 ? (
            <div style={{ padding: 24, color: '#6b7280', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>📭</div>
              No listings found
            </div>
          ) : (
            filteredListings.map(listing => {
              const hasCoords = listing.location?.coordinates?.lat;
              const color = WASTE_COLORS[listing.wasteType] || '#16a34a';
              const isSelected = selected?._id === listing._id;
              return (
                <div key={listing._id}
                  onClick={() => hasCoords ? flyTo(listing) : setSelected(listing)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    background: isSelected ? `${color}08` : '#ffffff',
                    borderLeft: `3px solid ${isSelected ? color : 'transparent'}`,
                    transition: 'all 0.15s'
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{
                      background: `${color}12`, color,
                      border: `1px solid ${color}25`,
                      fontSize: '0.7rem', fontWeight: 700,
                      padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase'
                    }}>{WASTE_ICONS[listing.wasteType]} {listing.wasteType}</span>
                    {!hasCoords && (
                      <span style={{ color: '#d97706', fontSize: '0.68rem', background: '#fef9c3', padding: '2px 6px', borderRadius: 6 }}>No pin</span>
                    )}
                  </div>
                  <div style={{ color: '#0f1f12', fontWeight: 600, fontSize: '0.88rem', marginBottom: 4, lineHeight: 1.3 }}>
                    {listing.title}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.78rem', marginBottom: 6 }}>
                    📍 {listing.location?.city}, {listing.location?.state}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontSize: '0.78rem' }}>{listing.quantity} kg</span>
                    <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.85rem' }}>₹{listing.pricePerKg}/kg</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

          {!loading && withCoords.length === 0 && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#ffffff', border: '1.5px solid rgba(0,0,0,0.1)',
              borderRadius: 16, padding: '32px 40px', textAlign: 'center', zIndex: 1000,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📍</div>
              <h3 style={{ color: '#0f1f12', marginBottom: 8 }}>No map pins yet</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: 260 }}>
                Listings need coordinates to appear on the map.
                Pin a location when creating a listing.
              </p>
            </div>
          )}

          {/* Legend */}
          <div style={{
            position: 'absolute', bottom: 24, right: 24, zIndex: 1000,
            background: '#ffffff', border: '1.5px solid rgba(0,0,0,0.08)',
            borderRadius: 14, padding: '14px 16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
          }}>
            <div style={{ color: '#9ca3af', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, fontWeight: 600 }}>Waste Type</div>
            {Object.entries(WASTE_COLORS).map(([type, color]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ color: '#374151', fontSize: '0.78rem', textTransform: 'capitalize' }}>{type}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: 10, paddingTop: 10 }}>
              <div style={{ color: '#9ca3af', fontSize: '0.7rem', marginBottom: 6, fontWeight: 600 }}>Urgency</div>
              {[['High', '#dc2626'], ['Medium', '#d97706'], ['Low', '#16a34a']].map(([u, c]) => (
                <div key={u} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', border: `2.5px solid ${c}`, flexShrink: 0 }} />
                  <span style={{ color: '#374151', fontSize: '0.78rem' }}>{u}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip-container { display: none !important; }
        .leaflet-container { background: #f4faf6; }
      `}</style>
    </div>
  );
}