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
        borderRadius: 16, padding: 20, transition: 'all 0.2s', cursor: 'pointer',
        borderTop: `3px solid ${color}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
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

        <h3 style={{ color: '#0f1f12', marginBottom: 6, fontSize: '0.95rem', lineHeight: 1.4 }}>{listing.title}</h3>
        <p style={{
          color: '#6b7280', fontSize: '0.82rem', marginBottom: 14, lineHeight: 1.6,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
        }}>{listing.description}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          <div style={{ background: '#f4faf6', borderRadius: 8, padding: '8px 10px', border: '1px solid #dcfce7' }}>
            <div style={{ color: '#9ca3af', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: 2 }}>Quantity</div>
            <div style={{ color: '#0f1f12', fontWeight: 700, fontSize: '0.9rem' }}>{listing.quantity.toLocaleString()} kg</div>
          </div>
          <div style={{ background: '#f4faf6', borderRadius: 8, padding: '8px 10px', border: '1px solid #dcfce7' }}>
            <div style={{ color: '#9ca3af', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: 2 }}>Price/kg</div>
            <div style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.9rem' }}>₹{listing.pricePerKg}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          <span style={{ color: '#6b7280', fontSize: '0.78rem' }}>📍 {listing.location?.city}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {listing.postedBy?.verified && <span style={{ color: '#16a34a', fontSize: '0.72rem', fontWeight: 600 }}>✓ Verified</span>}
            <span style={{ color: '#0f1f12', fontWeight: 700, fontSize: '0.9rem' }}>₹{listing.totalPrice?.toLocaleString()}</span>
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
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    axios.get(`${API}/listings`, { params })
      .then(r => setListings(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div style={{ background: '#f4faf6', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#0f1f12', marginBottom: 6 }}>Waste Listings</h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Browse available waste from NGOs across India</p>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'none',
            width: '100%', background: '#fff',
            border: '1.5px solid rgba(0,0,0,0.1)',
            borderRadius: 10, padding: '10px 16px',
            color: '#374151', fontWeight: 600,
            fontSize: '0.9rem', marginBottom: 12,
            textAlign: 'left'
          }}
          className="filter-toggle"
        >
          🔍 {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filters */}
        <div style={{
          background: '#ffffff', border: '1.5px solid rgba(0,0,0,0.08)',
          borderRadius: 16, padding: 16, marginBottom: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }} className={showFilters ? 'filters-show' : 'filters-desktop'}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
            <input placeholder="Search..." value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
            <select value={filters.wasteType} onChange={e => setFilters(f => ({ ...f, wasteType: e.target.value }))}>
              <option value="">All Types</option>
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
            <input placeholder="City..." value={filters.city}
              onChange={e => setFilters(f => ({ ...f, city: e.target.value }))} />
            <button onClick={() => setFilters({ wasteType: '', source: '', city: '', urgency: '', search: '' })} style={{
              background: '#fff', border: '1.5px solid rgba(0,0,0,0.12)',
              color: '#6b7280', borderRadius: 8, padding: '10px', fontSize: '0.85rem'
            }}>Clear</button>
          </div>
        </div>

        <div style={{ marginBottom: 16, color: '#6b7280', fontSize: '0.88rem' }}>
          {loading ? 'Loading...' : `${listings.length} listing${listings.length !== 1 ? 's' : ''} found`}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
            Loading listings...
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, background: '#fff', borderRadius: 16, border: '1.5px solid rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
            <h3 style={{ color: '#0f1f12', marginBottom: 8 }}>No listings found</h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {listings.map(l => <ListingCard key={l._id} listing={l} />)}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .filter-toggle { display: block !important; }
          .filters-desktop { display: none; }
          .filters-show { display: block !important; }
        }
        @media (min-width: 769px) {
          .filters-desktop { display: block !important; }
          .filter-toggle { display: none !important; }
        }
      `}</style>
    </div>
  );
}