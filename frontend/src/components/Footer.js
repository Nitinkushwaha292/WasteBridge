import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: '#ffffff',
      padding: '48px 24px 24px',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 36, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #16a34a, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>♻️</div>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem', color: '#000000' }}>
                Waste<span style={{ color: '#22c55e' }}>Bridge</span>
              </span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.7 }}>
              Connecting waste collectors with recycling industries to build a cleaner, circular economy.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 14, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Home Page', '/home'], ['Browse Waste', '/listings'], ['Waste Map', '/map'], ['Impact Tracker', '/impact'], ['Join as NGO', '/register']].map(([label, path]) => (
                <Link key={path} to={path} style={{ color: '#9ca3af', fontSize: '0.875rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#22c55e'}
                  onMouseLeave={e => e.target.style.color = '#9ca3af'}
                >{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 14, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Waste Types</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Plastic', 'Metal', 'Glass', 'Paper', 'Electronic', 'Textile'].map(t => (
                <span key={t} style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{t}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', marginBottom: 14, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Impact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['🌊 Ocean Cleanup', '🏔️ Landfill Reduction', '🌱 CO₂ Savings', '💰 NGO Revenue'].map(t => (
                <span key={t} style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>© 2026 WasteBridge by  Nitin kushwaha. Built for a greener tomorrow.</span>
          <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>Made with 🌱 for the planet</span>
          
        </div>
      </div>
    </footer>
  );
}