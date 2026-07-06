import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };
  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setMenuOpen(false);

  const linkStyle = (path) => ({
    color: isActive(path) ? '#16a34a' : '#374151',
    fontWeight: isActive(path) ? '600' : '400',
    fontSize: '0.9rem',
    padding: '4px 0',
    borderBottom: isActive(path) ? '2px solid #16a34a' : '2px solid transparent',
    textDecoration: 'none',
    transition: 'color 0.2s',
  });

  const mobileLinkStyle = (path) => ({
    color: isActive(path) ? '#16a34a' : '#374151',
    fontWeight: isActive(path) ? '600' : '400',
    fontSize: '1rem',
    padding: '12px 0',
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    display: 'block',
    textDecoration: 'none',
  });

  return (
    <>
      <nav style={{
        background: '#ffffff',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>

          {/* Logo */}
          <Link to="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', boxShadow: '0 2px 8px rgba(22,163,74,0.3)'
            }}>♻️</div>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem', color: '#0f1f12' }}>
              Waste<span style={{ color: '#16a34a' }}>Bridge</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="desktop-nav">
            <Link to="/listings" style={linkStyle('/listings')}>Browse Waste</Link>
            <Link to="/map" style={linkStyle('/map')}>🗺️ Map</Link>
            <Link to="/impact" style={linkStyle('/impact')}>Impact</Link>
            {user && <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>}
            {(user?.role === 'ngo' || user?.role === 'admin') && (
              <Link to="/create-listing" style={{
                background: 'rgba(22,163,74,0.08)', color: '#16a34a',
                padding: '6px 14px', borderRadius: 8,
                border: '1px solid rgba(22,163,74,0.25)',
                fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none'
              }}>+ Post Waste</Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="desktop-auth">
            {user ? (
              <>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700, color: '#fff'
                  }}>{user.name?.charAt(0).toUpperCase()}</div>
                  <span style={{ color: '#0f1f12', fontSize: '0.88rem', fontWeight: 500 }}>{user.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} style={{
                  background: 'transparent', border: '1.5px solid rgba(0,0,0,0.12)',
                  color: '#6b7280', padding: '5px 12px', borderRadius: 8, fontSize: '0.82rem'
                }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: '#374151', fontSize: '0.88rem', fontWeight: 500 }}>Login</Link>
                <Link to="/register" style={{
                  background: '#16a34a', color: '#ffffff',
                  padding: '7px 16px', borderRadius: 8,
                  fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(22,163,74,0.3)'
                }}>Join Now</Link>
              </>
            )}
          </div>

          {/* Hamburger Menu Button (Mobile) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: 'none', border: 'none',
              fontSize: '1.5rem', cursor: 'pointer',
              color: '#0f1f12', padding: '4px'
            }}
            className="hamburger"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            background: '#ffffff',
            borderTop: '1px solid rgba(0,0,0,0.08)',
            padding: '16px 20px',
            display: 'flex', flexDirection: 'column'
          }}>
            <Link to="/listings" style={mobileLinkStyle('/listings')} onClick={closeMenu}>Browse Waste</Link>
            <Link to="/map" style={mobileLinkStyle('/map')} onClick={closeMenu}>🗺️ Waste Map</Link>
            <Link to="/impact" style={mobileLinkStyle('/impact')} onClick={closeMenu}>Impact</Link>
            {user && <Link to="/dashboard" style={mobileLinkStyle('/dashboard')} onClick={closeMenu}>Dashboard</Link>}
            {(user?.role === 'ngo' || user?.role === 'admin') && (
              <Link to="/create-listing" style={{ ...mobileLinkStyle('/create-listing'), color: '#16a34a', fontWeight: 600 }} onClick={closeMenu}>+ Post Waste</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" style={mobileLinkStyle('/admin')} onClick={closeMenu}>Admin Panel</Link>
            )}

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Link to="/profile" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, color: '#fff'
                    }}>{user.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <div style={{ color: '#0f1f12', fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>{user.role}</div>
                    </div>
                  </Link>
                  <button onClick={handleLogout} style={{
                    background: '#fee2e2', color: '#dc2626',
                    border: '1px solid #fca5a5',
                    padding: '7px 16px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600
                  }}>Logout</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 12 }}>
                  <Link to="/login" onClick={closeMenu} style={{
                    flex: 1, textAlign: 'center',
                    border: '1.5px solid rgba(0,0,0,0.12)', color: '#374151',
                    padding: '10px', borderRadius: 8, fontWeight: 500, textDecoration: 'none'
                  }}>Login</Link>
                  <Link to="/register" onClick={closeMenu} style={{
                    flex: 1, textAlign: 'center',
                    background: '#16a34a', color: '#fff',
                    padding: '10px', borderRadius: 8, fontWeight: 600, textDecoration: 'none'
                  }}>Join Now</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-auth { display: none !important; }
          .hamburger { display: block !important; }
        }
        @media (min-width: 769px) {
          .hamburger { display: none !important; }
        }
      `}</style>
    </>
  );
}