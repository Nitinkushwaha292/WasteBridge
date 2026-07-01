import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'ngo',
    organization: '', phone: '',
    location: { city: '', state: '', country: 'India' }
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => {
    const { name, value } = e.target;
    if (name === 'city' || name === 'state') {
      setForm(f => ({ ...f, location: { ...f.location, [name]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to WasteBridge, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px', background: '#f4faf6'
    }}>
      <div style={{
        width: '100%', maxWidth: 520,
        background: '#ffffff',
        border: '1.5px solid rgba(22,163,74,0.15)',
        borderRadius: 20, padding: 40,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', boxShadow: '0 4px 16px rgba(22,163,74,0.3)'
          }}>♻️</div>
          <h1 style={{ fontSize: '1.6rem', color: '#0f1f12', marginBottom: 8 }}>Create your account</h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Join the circular economy movement</p>
        </div>

        {/* Role Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {[
            { val: 'ngo', label: '🌊 NGO / Collector', desc: 'I collect waste from nature' },
            { val: 'recycler', label: '🏭 Recycling Company', desc: 'I buy & recycle waste' },
          ].map(r => (
            <div key={r.val} onClick={() => setForm(f => ({ ...f, role: r.val }))} style={{
              border: `2px solid ${form.role === r.val ? '#16a34a' : 'rgba(0,0,0,0.1)'}`,
              background: form.role === r.val ? 'rgba(22,163,74,0.06)' : '#fff',
              borderRadius: 10, padding: 14, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: form.role === r.val ? '#16a34a' : '#0f1f12', marginBottom: 4 }}>{r.label}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{r.desc}</div>
            </div>
          ))}
        </div>

        <form onSubmit={submit}>
          {[
            { label: 'Full Name', name: 'name', placeholder: 'Your full name', type: 'text' },
            { label: 'Organization Name', name: 'organization', placeholder: form.role === 'ngo' ? 'e.g. Clean Yamuna Foundation' : 'e.g. EcoPlast Industries', type: 'text' },
            { label: 'Email Address', name: 'email', placeholder: 'you@organization.com', type: 'email' },
            { label: 'Phone Number', name: 'phone', placeholder: '+91 98765 43210', type: 'text' },
          ].map(f => (
            <div key={f.name} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#374151', fontSize: '0.85rem', marginBottom: 6, fontWeight: 500 }}>{f.label}</label>
              <input type={f.type} name={f.name} value={form[f.name]} onChange={handle} placeholder={f.placeholder} required={f.name !== 'phone'} />
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', color: '#374151', fontSize: '0.85rem', marginBottom: 6, fontWeight: 500 }}>City</label>
              <input name="city" value={form.location.city} onChange={handle} placeholder="Delhi" required />
            </div>
            <div>
              <label style={{ display: 'block', color: '#374151', fontSize: '0.85rem', marginBottom: 6, fontWeight: 500 }}>State</label>
              <input name="state" value={form.location.state} onChange={handle} placeholder="Delhi" required />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: '#374151', fontSize: '0.85rem', marginBottom: 6, fontWeight: 500 }}>Password</label>
            <input type="password" name="password" value={form.password} onChange={handle} placeholder="Min 6 characters" required />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%',
            background: loading ? '#86efac' : '#16a34a',
            color: '#ffffff', border: 'none', borderRadius: 10,
            padding: '13px', fontWeight: 700, fontSize: '1rem',
            boxShadow: '0 2px 8px rgba(22,163,74,0.3)'
          }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#6b7280', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#16a34a', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}