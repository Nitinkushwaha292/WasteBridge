import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('users');

  useEffect(() => {
    axios.get(`${API}/users`)
      .then(r => setUsers(r.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const verify = async (id) => {
    try {
      await axios.put(`${API}/users/${id}/verify`);
      setUsers(users.map(u => u._id === id ? { ...u, verified: true } : u));
      toast.success('User verified!');
    } catch {
      toast.error('Failed to verify');
    }
  };

  const stats = {
    total: users.length,
    ngos: users.filter(u => u.role === 'ngo').length,
    recyclers: users.filter(u => u.role === 'recycler').length,
    unverified: users.filter(u => !u.verified).length,
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', color: '#f0f4f8', marginBottom: 8 }}>Admin Panel</h1>
      <p style={{ color: '#8fa3b8', marginBottom: 32 }}>Manage users, verify organizations, oversee platform activity</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Users', value: stats.total, color: '#f0f4f8' },
          { label: 'NGOs', value: stats.ngos, color: '#00c896' },
          { label: 'Recyclers', value: stats.recyclers, color: '#3b82f6' },
          { label: 'Unverified', value: stats.unverified, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ background: '#151d2e', borderRadius: 14, padding: 20, border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontFamily: 'Space Grotesk', fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ color: '#8fa3b8', fontSize: '0.85rem', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#151d2e', borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ color: '#f0f4f8' }}>All Users</h3>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#8fa3b8' }}>Loading...</div>
        ) : (
          <div>
            {users.map((u, i) => (
              <div key={u._id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 24px', flexWrap: 'wrap', gap: 12,
                borderBottom: i < users.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                background: u.verified ? 'transparent' : 'rgba(245,158,11,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00c896, #3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: '#fff', flexShrink: 0
                  }}>{u.name?.charAt(0)}</div>
                  <div>
                    <div style={{ color: '#f0f4f8', fontWeight: 600, fontSize: '0.95rem' }}>{u.name}</div>
                    <div style={{ color: '#8fa3b8', fontSize: '0.8rem' }}>{u.email} · {u.organization}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    background: u.role === 'ngo' ? 'rgba(0,200,150,0.1)' : 'rgba(59,130,246,0.1)',
                    color: u.role === 'ngo' ? '#00c896' : '#3b82f6',
                    padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700
                  }}>{u.role.toUpperCase()}</span>
                  <span style={{ color: '#8fa3b8', fontSize: '0.8rem' }}>{u.location?.city}</span>
                  {u.verified ? (
                    <span style={{ color: '#00c896', fontSize: '0.8rem' }}>✓ Verified</span>
                  ) : (
                    <button onClick={() => verify(u._id)} style={{
                      background: 'rgba(0,200,150,0.1)', color: '#00c896',
                      border: '1px solid rgba(0,200,150,0.2)', padding: '5px 12px',
                      borderRadius: 8, fontSize: '0.8rem', fontWeight: 600
                    }}>Verify</button>
                  )}
                  <span style={{ color: '#4a5568', fontSize: '0.75rem' }}>{new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
