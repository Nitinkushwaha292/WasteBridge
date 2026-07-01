import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? '#16a34a' : '#374151',
    fontWeight: isActive(path) ? '600' : '400',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
    padding: '4px 0',
    borderBottom: isActive(path) ? '2px solid #16a34a' : '2px solid transparent',
  });

  return (
    <nav style={{
      background: '#ffffff',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
      position: 'sticky', top: 0, zIndex: 100,
      padding: '0 24px',
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(22,163,74,0.3)'
          }}>♻️</div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.2rem', color: '#0f1f12' }}>
            Waste<span style={{ color: '#16a34a' }}>Bridge</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <Link to="/listings" style={linkStyle('/listings')}>Browse Waste</Link>
          <Link to="/map" style={linkStyle('/map')}>🗺️ Waste Map</Link>
          <Link to="/impact" style={linkStyle('/impact')}>Impact</Link>
          {user && <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>}
          {user?.role === 'ngo' && (
            <Link to="/create-listing" style={{
              ...linkStyle('/create-listing'),
              background: 'rgba(22,163,74,0.08)',
              padding: '6px 14px', borderRadius: 8,
              border: '1px solid rgba(22,163,74,0.25)',
              color: '#16a34a', fontWeight: 600
            }}>+ Post Waste</Link>
          )}
          {user?.role === 'admin' && <Link to="/admin" style={linkStyle('/admin')}>Admin</Link>}
        </div>

        {/* Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: 700, color: '#fff',
                  boxShadow: '0 2px 8px rgba(22,163,74,0.3)'
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: '#0f1f12', fontSize: '0.9rem', fontWeight: 500 }}>{user.name?.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} style={{
                background: 'transparent',
                border: '1.5px solid rgba(0,0,0,0.12)',
                color: '#6b7280', padding: '6px 14px', borderRadius: 8,
                fontSize: '0.85rem', transition: 'all 0.2s'
              }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#374151', fontSize: '0.9rem', fontWeight: 500 }}>Login</Link>
              <Link to="/register" style={{
                background: '#16a34a', color: '#ffffff',
                padding: '8px 20px', borderRadius: 8,
                fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(22,163,74,0.3)'
              }}>Join Now</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}