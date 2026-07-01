import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '../context/AuthContext';

const WASTE_COLORS = {
  plastic: '#2563eb', metal: '#d97706', glass: '#7c3aed',
  paper: '#16a34a', electronic: '#dc2626', textile: '#ea580c',
  organic: '#15803d', mixed: '#6b7280'
};

const URGENCY = {
  low: { bg: '#dcfce7', text: '#15803d' },
  medium: { bg: '#fef9c3', text: '#a16207' },
  high: { bg: '#fee2e2', text: '#dc2626' }
};

function ListingCard({ listing }) {
  const color = WASTE_COLORS[listing.wasteType] || '#16a34a';
  const urg = URGENCY[listing.urgency] || URGENCY.medium;

  return (
    <Link to={`/listings/${listing._id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#ffffff', border: '1.5px solid rgba(0,0,0,0.08)',
        borderRadius: 16, padding: 22, transition: 'all 0.2s', cursor: 'pointer',
        borderTop: `3px solid ${color}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'none'; }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <span style={{
            background: `${color}15`, color,
            fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px',
            borderRadius: 20, textTransform: 'uppercase', border: `1px solid ${color}30`
          }}>{listing.wasteType}</span>
          <span style={{
            background: urg.bg, color: urg.text,
            fontSize: '0.7rem', fontWeight: 600, padding: '3px 8px', borderRadius: 20
          }}>{listing.urgency} urgency</span>
        </div>

        <h3 style={{ color: '#0f1f12', marginBottom: 8, fontSize: '1rem', lineHeight: 1.4 }}>{listing.title}</h3>
        <p style={{
          color: '#6b7280', fontSize: '0.85rem', marginBottom: 16, lineHeight: 1.6,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
        }}>{listing.description}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ background: '#f4faf6', borderRadius: 8, padding: '10px 12px', border: '1px solid #dcfce7' }}>
            <div style={{ color: '#9ca3af', fontSize: '0.68rem', textTransform: 'uppercase', marginBottom: 2 }}>Quantity</div>
            <div style={{ color: '#0f1f12', fontWeight: 700 }}>{listing.quantity.toLocaleString()} kg</div>
          </div>
          <div style={{ background: '#f4faf6', borderRadius: 8, padding: '10px 12px', border: '1px solid #dcfce7' }}>
            <div style={{ color: '#9ca3af', fontSize: '0.68rem', textTransform: 'uppercase', marginBottom: 2 }}>Price/kg</div>
            <div style={{ color: '#16a34a', fontWeight: 700 }}>₹{listing.pricePerKg}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>📍 {listing.location?.city}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {listing.postedBy?.verified && <span style={{ color: '#16a34a', fontSize: '0.75rem', fontWeight: 600 }}>✓ Verified</span>}
            <span style={{ color: '#0f1f12', fontWeight: 700 }}>₹{listing.totalPrice?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ wasteType: '', source: '', city: '', urgency: '', search: '' });

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    axios.get(`${API}/listings`, { params })
      .then(r => setListings(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div style={{ background: '#f4faf6', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '2rem', color: '#0f1f12', marginBottom: 8 }}>Waste Listings</h1>
          <p style={{ color: '#6b7280' }}>Browse available waste from NGOs and collectors across India</p>
        </div>

        {/* Filters */}
        <div style={{
          background: '#ffffff', border: '1.5px solid rgba(0,0,0,0.08)',
          borderRadius: 16, padding: 20, marginBottom: 28,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
            <input placeholder="Search listings..." value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
            <select value={filters.wasteType} onChange={e => setFilters(f => ({ ...f, wasteType: e.target.value }))}>
              <option value="">All Waste Types</option>
              {['plastic','metal','glass','paper','electronic','organic','textile','mixed'].map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
            <select value={filters.source} onChange={e => setFilters(f => ({ ...f, source: e.target.value }))}>
              <option value="">All Sources</option>
              {['river','ocean','landfill','household','industrial','other'].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <select value={filters.urgency} onChange={e => setFilters(f => ({ ...f, urgency: e.target.value }))}>
              <option value="">Any Urgency</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
            <input placeholder="Filter by city..." value={filters.city}
              onChange={e => setFilters(f => ({ ...f, city: e.target.value }))} />
            <button onClick={() => setFilters({ wasteType: '', source: '', city: '', urgency: '', search: '' })} style={{
              background: '#fff', border: '1.5px solid rgba(0,0,0,0.12)',
              color: '#6b7280', borderRadius: 8, padding: '10px',
              fontSize: '0.85rem', fontWeight: 500
            }}>Clear Filters</button>
          </div>
        </div>

        <div style={{ marginBottom: 20, color: '#6b7280', fontSize: '0.9rem' }}>
          {loading ? 'Loading...' : `${listings.length} listing${listings.length !== 1 ? 's' : ''} found`}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
            Loading listings...
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '1.5px solid rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
            <h3 style={{ color: '#0f1f12', marginBottom: 8 }}>No listings found</h3>
            <p style={{ color: '#6b7280' }}>Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {listings.map(l => <ListingCard key={l._id} listing={l} />)}
          </div>
        )}
      </div>
    </div>
  );
}