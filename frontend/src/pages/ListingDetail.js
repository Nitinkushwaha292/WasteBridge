import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const WASTE_COLORS = {
  plastic: '#3b82f6', metal: '#f59e0b', glass: '#8b5cf6',
  paper: '#10b981', electronic: '#ef4444', textile: '#f97316',
  organic: '#00c896', mixed: '#6b7280'
};

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimForm, setClaimForm] = useState({ message: '', offeredPrice: '' });
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    axios.get(`${API}/listings/${id}`)
      .then(r => setListing(r.data))
      .catch(() => navigate('/listings'))
      .finally(() => setLoading(false));
  }, [id]);

  // Init mini map when listing loads
  useEffect(() => {
    if (!listing) return;
    const lat = listing.location?.coordinates?.lat;
    const lng = listing.location?.coordinates?.lng;
    if (!lat || !lng) return;

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (mapInstanceRef.current || !mapRef.current) return;
      const L = window.L;
      const color = WASTE_COLORS[listing.wasteType] || '#00c896';

      const map = L.map(mapRef.current, {
        center: [lat, lng], zoom: 13,
        zoomControl: true, scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO', maxZoom: 19
      }).addTo(map);

      // Pulse circle
      L.circle([lat, lng], {
        color: color, fillColor: color,
        fillOpacity: 0.1, weight: 2, opacity: 0.4, radius: 300
      }).addTo(map);

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:18px; height:18px; border-radius:50%;
          background:${color}; border:3px solid #fff;
          box-shadow:0 0 14px ${color}80;
        "></div>`,
        iconSize: [18, 18], iconAnchor: [9, 9]
      });

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(`<div style="background:#151d2e;color:#f0f4f8;padding:10px 14px;border-radius:10px;font-family:Inter,sans-serif;font-size:0.82rem;min-width:180px;">
          <div style="font-weight:700;margin-bottom:4px;color:#f0f4f8;">${listing.title}</div>
          <div style="color:#8fa3b8;">📍 ${listing.location?.address}</div>
          <div style="color:#00c896;margin-top:6px;font-weight:600;">Pickup Location ✓</div>
        </div>`, { className: 'custom-popup' })
        .openPopup();

      mapInstanceRef.current = map;
    };

    if (window.L) initMap();
    else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [listing]);

  const sendClaim = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setClaiming(true);
    try {
      await axios.post(`${API}/claims`, {
        listingId: listing._id,
        message: claimForm.message,
        offeredPrice: claimForm.offeredPrice || listing.pricePerKg
      });
      toast.success('Claim sent! The NGO will review your request.');
      setClaimForm({ message: '', offeredPrice: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send claim');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80, color: '#8fa3b8' }}>Loading...</div>;
  if (!listing) return null;

  const color = WASTE_COLORS[listing.wasteType] || '#00c896';
  const hasCoords = listing.location?.coordinates?.lat;

  return (
    <div style={{ padding: '40px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#8fa3b8', marginBottom: 24, fontSize: '0.9rem', cursor: 'pointer' }}>← Back to listings</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        {/* Main */}
        <div>
          <div style={{ background: '#151d2e', border: `1px solid ${color}30`, borderRadius: 20, padding: 32, marginBottom: 20, borderLeft: `4px solid ${color}` }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ background: `${color}20`, color, fontSize: '0.8rem', fontWeight: 700, padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase' }}>{listing.wasteType}</span>
              <span style={{ background: 'rgba(255,255,255,0.05)', color: '#8fa3b8', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem' }}>From: {listing.source}</span>
              <span style={{ background: listing.status === 'available' ? 'rgba(0,200,150,0.1)' : 'rgba(245,158,11,0.1)', color: listing.status === 'available' ? '#00c896' : '#f59e0b', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>{listing.status}</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', color: '#f0f4f8', marginBottom: 12 }}>{listing.title}</h1>
            <p style={{ color: '#8fa3b8', lineHeight: 1.8, marginBottom: 24 }}>{listing.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { label: 'Total Quantity', value: `${listing.quantity.toLocaleString()} kg` },
                { label: 'Price per kg', value: `₹${listing.pricePerKg}` },
                { label: 'Total Value', value: `₹${listing.totalPrice?.toLocaleString()}` },
              ].map(m => (
                <div key={m.label} style={{ background: '#0d1220', borderRadius: 12, padding: '16px 20px' }}>
                  <div style={{ color: '#4a5568', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
                  <div style={{ color: '#f0f4f8', fontWeight: 700, fontSize: '1.2rem' }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Location + Map */}
          <div style={{ background: '#151d2e', borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 style={{ color: '#f0f4f8', fontSize: '1.05rem', marginBottom: 6 }}>📍 Pickup Location</h3>
              <p style={{ color: '#8fa3b8', fontSize: '0.875rem' }}>{listing.location?.address}</p>
              <p style={{ color: '#f0f4f8', fontWeight: 500, marginTop: 4 }}>
                {listing.location?.city}, {listing.location?.state}
                {listing.location?.pincode && ` — ${listing.location.pincode}`}
              </p>
            </div>

            {hasCoords ? (
              <div ref={mapRef} style={{ height: 300, width: '100%' }} />
            ) : (
              <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d1220', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: '2rem' }}>🗺️</span>
                <span style={{ color: '#4a5568', fontSize: '0.85rem' }}>No map pin available for this listing</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {listing.tags?.length > 0 && (
            <div style={{ background: '#151d2e', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 style={{ color: '#f0f4f8', marginBottom: 12, fontSize: '1rem' }}>Tags</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {listing.tags.map(tag => (
                  <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', color: '#8fa3b8', padding: '4px 12px', borderRadius: 20, fontSize: '0.8rem' }}>#{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#151d2e', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 style={{ color: '#8fa3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Posted by</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #00c896, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{listing.postedBy?.name?.charAt(0)}</div>
              <div>
                <div style={{ color: '#f0f4f8', fontWeight: 600 }}>{listing.postedBy?.name}</div>
                <div style={{ color: '#8fa3b8', fontSize: '0.85rem' }}>{listing.postedBy?.organization}</div>
              </div>
            </div>
            {listing.postedBy?.verified && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
                <span style={{ color: '#00c896' }}>✓</span>
                <span style={{ color: '#00c896', fontSize: '0.85rem', fontWeight: 500 }}>Verified Organization</span>
              </div>
            )}
            <div style={{ color: '#8fa3b8', fontSize: '0.85rem' }}>📍 {listing.postedBy?.location?.city}</div>
          </div>

          {listing.status === 'available' && user?.role === 'recycler' && (
            <div style={{ background: '#151d2e', borderRadius: 20, padding: 24, border: '1px solid rgba(0,200,150,0.2)' }}>
              <h3 style={{ color: '#f0f4f8', marginBottom: 4, fontSize: '1.1rem' }}>Claim This Waste</h3>
              <p style={{ color: '#8fa3b8', fontSize: '0.85rem', marginBottom: 20 }}>Send a claim request to the NGO</p>
              <form onSubmit={sendClaim}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', color: '#8fa3b8', fontSize: '0.8rem', marginBottom: 6 }}>Offered price/kg (₹)</label>
                  <input type="number" value={claimForm.offeredPrice} onChange={e => setClaimForm(f => ({ ...f, offeredPrice: e.target.value }))} placeholder={`Default: ₹${listing.pricePerKg}`} min="0" />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', color: '#8fa3b8', fontSize: '0.8rem', marginBottom: 6 }}>Message to NGO</label>
                  <textarea value={claimForm.message} onChange={e => setClaimForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell them about your company and how you'll use this waste..." rows={4} style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" disabled={claiming} style={{ width: '100%', background: '#00c896', color: '#0a0f1e', border: 'none', borderRadius: 10, padding: '12px', fontWeight: 700, fontSize: '0.95rem' }}>
                  {claiming ? 'Sending...' : '🤝 Send Claim Request'}
                </button>
              </form>
            </div>
          )}

          {!user && listing.status === 'available' && (
            <div style={{ background: '#151d2e', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
              <p style={{ color: '#8fa3b8', marginBottom: 16, fontSize: '0.9rem' }}>Sign in as a recycling company to claim this waste</p>
              <a href="/login" style={{ display: 'block', background: '#00c896', color: '#0a0f1e', padding: '12px', borderRadius: 10, fontWeight: 700, textDecoration: 'none' }}>Sign In to Claim</a>
            </div>
          )}

          <div style={{ background: '#151d2e', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ color: '#8fa3b8', fontSize: '0.8rem', marginBottom: 8 }}>Listed on</div>
            <div style={{ color: '#f0f4f8', fontWeight: 500 }}>{new Date(listing.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            {listing.availableTill && (
              <>
                <div style={{ color: '#8fa3b8', fontSize: '0.8rem', marginTop: 12, marginBottom: 4 }}>Available till</div>
                <div style={{ color: '#f59e0b', fontWeight: 500 }}>{new Date(listing.availableTill).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .leaflet-popup-content-wrapper { background: transparent !important; border: none !important; box-shadow: 0 8px 32px rgba(0,0,0,0.5) !important; border-radius: 12px !important; padding: 0 !important; }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip-container { display: none; }
        .leaflet-container { background: #0a0f1e; }
      `}</style>
    </div>
  );
}