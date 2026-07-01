import React, { useState } from 'react';
import axios from 'axios';
import { API, useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    organization: user?.organization || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    website: user?.website || '',
    location: { city: user?.location?.city || '', state: user?.location?.state || '', country: user?.location?.country || 'India' }
  });
  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    const { name, value } = e.target;
    if (name === 'city' || name === 'state') {
      setForm(f => ({ ...f, location: { ...f.location, [name]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(`${API}/users/profile/update`, form);
      const stored = JSON.parse(localStorage.getItem('wb_user'));
      const updated = { ...stored, ...data };
      localStorage.setItem('wb_user', JSON.stringify(updated));
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { display: 'block', color: '#8fa3b8', fontSize: '0.85rem', marginBottom: 6 };

  return (
    <div style={{ padding: '40px 24px', maxWidth: 760, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', color: '#f0f4f8', marginBottom: 32 }}>Your Profile</h1>

      <div style={{ background: '#151d2e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 32, marginBottom: 20 }}>
        {/* Avatar & Basic */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #00c896, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', fontWeight: 700, color: '#fff', flexShrink: 0
          }}>{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <h2 style={{ color: '#f0f4f8', marginBottom: 4 }}>{user?.name}</h2>
            <div style={{ color: '#8fa3b8', fontSize: '0.9rem', marginBottom: 6 }}>{user?.email}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                background: user?.role === 'ngo' ? 'rgba(0,200,150,0.1)' : 'rgba(59,130,246,0.1)',
                color: user?.role === 'ngo' ? '#00c896' : '#3b82f6',
                padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase'
              }}>{user?.role}</span>
              {user?.verified && (
                <span style={{ background: 'rgba(0,200,150,0.1)', color: '#00c896', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem' }}>✓ Verified</span>
              )}
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} style={{
            marginLeft: 'auto', background: editing ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${editing ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.12)'}`,
            color: editing ? '#ef4444' : '#8fa3b8', padding: '8px 16px', borderRadius: 8, fontSize: '0.85rem'
          }}>{editing ? 'Cancel' : 'Edit Profile'}</button>
        </div>

        {!editing ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { label: 'Organization', value: user?.organization },
              { label: 'Phone', value: user?.phone || '—' },
              { label: 'City', value: user?.location?.city || '—' },
              { label: 'State', value: user?.location?.state || '—' },
              { label: 'Website', value: user?.website || '—' },
              { label: 'Member since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) },
            ].map(f => (
              <div key={f.label}>
                <div style={{ color: '#4a5568', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{f.label}</div>
                <div style={{ color: '#f0f4f8', fontWeight: 500 }}>{f.value}</div>
              </div>
            ))}
            {user?.bio && (
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ color: '#4a5568', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Bio</div>
                <div style={{ color: '#8fa3b8', lineHeight: 1.7 }}>{user.bio}</div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={save}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div><label style={labelStyle}>Name</label><input name="name" value={form.name} onChange={handle} /></div>
              <div><label style={labelStyle}>Organization</label><input name="organization" value={form.organization} onChange={handle} /></div>
              <div><label style={labelStyle}>Phone</label><input name="phone" value={form.phone} onChange={handle} /></div>
              <div><label style={labelStyle}>Website</label><input name="website" value={form.website} onChange={handle} placeholder="https://" /></div>
              <div><label style={labelStyle}>City</label><input name="city" value={form.location.city} onChange={handle} /></div>
              <div><label style={labelStyle}>State</label><input name="state" value={form.location.state} onChange={handle} /></div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Bio</label>
              <textarea name="bio" value={form.bio} onChange={handle} rows={3} placeholder="Tell recyclers about your organization..." style={{ resize: 'vertical' }} />
            </div>
            <button type="submit" disabled={loading} style={{
              background: '#00c896', color: '#0a0f1e', border: 'none',
              borderRadius: 10, padding: '11px 24px', fontWeight: 700, fontSize: '0.95rem'
            }}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
