import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#0f1f12', padding: 'clamp(32px, 5vw, 48px) 20px 24px', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 28, marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #16a34a, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>♻️</div>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                Waste<span style={{ color: '#22c55e' }}>Bridge</span>
              </span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.82rem', lineHeight: 1.7 }}>
              Connecting waste collectors with recycling industries for a cleaner, circular economy.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 12, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['Browse Waste', '/listings'], ['Waste Map', '/map'], ['Impact', '/impact'], ['Join as NGO', '/register']].map(([label, path]) => (
                <Link key={path} to={path} style={{ color: '#9ca3af', fontSize: '0.82rem' }}>{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 12, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Waste Types</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Plastic', 'Metal', 'Glass', 'Paper', 'Electronic', 'Textile'].map(t => (
                <span key={t} style={{ color: '#9ca3af', fontSize: '0.82rem' }}>{t}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 12, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Impact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['🌊 Ocean Cleanup', '🏔️ Landfill Reduction', '🌱 CO₂ Savings', '💰 NGO Revenue'].map(t => (
                <span key={t} style={{ color: '#9ca3af', fontSize: '0.82rem' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ color: '#6b7280', fontSize: '0.78rem' }}>© 2024 WasteBridge. Built for a greener tomorrow.</span>
          <span style={{ color: '#6b7280', fontSize: '0.78rem' }}>Made with 🌱 for the planet</span>
        </div>
      </div>
    </footer>
  );
}