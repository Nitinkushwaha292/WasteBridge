import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#16a34a', '#2563eb', '#d97706', '#dc2626', '#7c3aed', '#ea580c', '#15803d', '#6b7280'];

export default function Impact() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/stats`).then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80, color: '#6b7280', background: '#f4faf6', minHeight: '100vh' }}>
      Loading impact data...
    </div>
  );

  const byType = (stats?.wasteByType || []).map(w => ({ name: w._id, value: w.total }));
  const bySource = (stats?.wasteBySource || []).map(w => ({ name: w._id, value: w.total }));

  const cardStyle = { background: '#ffffff', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' };

  return (
    <div style={{ background: '#f4faf6', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
          borderRadius: 24, padding: '56px 40px', textAlign: 'center', marginBottom: 48,
          boxShadow: '0 8px 32px rgba(22,163,74,0.25)'
        }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#ffffff', marginBottom: 16, fontFamily: 'Space Grotesk' }}>
            🌍 Platform Impact
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
            Real numbers. Real change. Here's what WasteBridge has achieved together.
          </p>
        </div>

        {/* Key Stats */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 36 }}>
            {[
              { icon: '♻️', value: `${(stats.totalWasteKg / 1000).toFixed(1)}T`, label: 'Waste Recycled', color: '#16a34a' },
              { icon: '🌿', value: `${stats.co2Saved?.toLocaleString()} kg`, label: 'CO₂ Saved', color: '#15803d' },
              { icon: '🌊', value: stats.totalNGOs, label: 'NGOs Active', color: '#2563eb' },
              { icon: '🏭', value: stats.totalRecyclers, label: 'Recyclers', color: '#7c3aed' },
              { icon: '📋', value: stats.totalListings, label: 'Total Listings', color: '#d97706' },
              { icon: '🤝', value: stats.totalClaims, label: 'Deals Made', color: '#ea580c' },
            ].map(s => (
              <div key={s.label} style={{ ...cardStyle, textAlign: 'center', borderTop: `3px solid ${s.color}` }}>
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.8rem', color: s.color, marginBottom: 6 }}>{s.value}</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 36 }}>
          <div style={cardStyle}>
            <h3 style={{ color: '#0f1f12', marginBottom: 24, fontSize: '1.05rem' }}>Waste by Type (kg)</h3>
            {byType.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={byType}>
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8 }} />
                  <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>No data yet</div>}
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: '#0f1f12', marginBottom: 24, fontSize: '1.05rem' }}>Waste by Source</h3>
            {bySource.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={bySource} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {bySource.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {bySource.map((s, i) => (
                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      <span style={{ color: '#6b7280', fontSize: '0.85rem', textTransform: 'capitalize' }}>{s.name}</span>
                      <span style={{ color: '#0f1f12', fontWeight: 600, marginLeft: 'auto', fontSize: '0.85rem' }}>{s.value} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>No data yet</div>}
          </div>
        </div>

        {/* Recent Activity */}
        {stats?.recentActivity?.length > 0 && (
          <div style={cardStyle}>
            <h3 style={{ color: '#0f1f12', marginBottom: 20, fontSize: '1.05rem' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.recentActivity.map(a => (
                <div key={a._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f4faf6', borderRadius: 10, border: '1px solid #dcfce7' }}>
                  <div>
                    <div style={{ color: '#0f1f12', fontWeight: 500 }}>{a.title}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: 2 }}>{a.postedBy?.organization} · {a.location?.city} · {a.quantity} kg</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize' }}>{a.wasteType}</div>
                    <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{new Date(a.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mission */}
        <div style={{ marginTop: 36, background: 'linear-gradient(135deg, #16a34a, #15803d)', borderRadius: 20, padding: 40, textAlign: 'center' }}>
          <h2 style={{ color: '#ffffff', marginBottom: 12, fontSize: '1.6rem' }}>Every kilogram counts</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
            WasteBridge was built on one belief — waste is not the end, it's the beginning of something new.
            Every deal made here is a river saved, a landfill reduced, and an NGO, volunteers empowered.
          </p>
        </div>
      </div>
    </div>
  );
}