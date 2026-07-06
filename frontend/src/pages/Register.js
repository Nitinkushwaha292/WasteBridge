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

  const labelStyle = { display: 'block', color: '#374151', fontSize: '0.85rem', marginBottom: 6, fontWeight: 500 };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', background: '#f4faf6'
    }}>
      <div style={{
        width: '100%', maxWidth: 520,
        background: '#ffffff',
        border: '1.5px solid rgba(22,163,74,0.15)',
        borderRadius: 20, padding: 'clamp(20px, 5vw, 40px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, margin: '0 auto 14px',
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', boxShadow: '0 4px 16px rgba(22,163,74,0.3)'
          }}>♻️</div>
          <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.6rem)', color: '#0f1f12', marginBottom: 6 }}>Create your account</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Join the circular economy movement</p>
        </div>

        {/* Role Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { val: 'ngo', label: '🌊 NGO / Collector', desc: 'I collect waste from nature' },
            { val: 'recycler', label: '🏭 Recycling Co.', desc: 'I buy & recycle waste' },
          ].map(r => (
            <div key={r.val} onClick={() => setForm(f => ({ ...f, role: r.val }))} style={{
              border: `2px solid ${form.role === r.val ? '#16a34a' : 'rgba(0,0,0,0.1)'}`,
              background: form.role === r.val ? 'rgba(22,163,74,0.06)' : '#fff',
              borderRadius: 10, padding: '12px 10px', cursor: 'pointer', textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: form.role === r.val ? '#16a34a' : '#0f1f12', marginBottom: 3 }}>{r.label}</div>
              <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{r.desc}</div>
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
            <div key={f.name} style={{ marginBottom: 14 }}>
              <label style={labelStyle}>{f.label}</label>
              <input
                type={f.type} name={f.name}
                value={form[f.name]} onChange={handle}
                placeholder={f.placeholder}
                required={f.name !== 'phone'}
                style={{ fontSize: '16px' }}
              />
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>City</label>
              <input name="city" value={form.location.city} onChange={handle} placeholder="Delhi" required style={{ fontSize: '16px' }} />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <input name="state" value={form.location.state} onChange={handle} placeholder="Delhi" required style={{ fontSize: '16px' }} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Password</label>
            <input type="password" name="password" value={form.password} onChange={handle} placeholder="Min 6 characters" required style={{ fontSize: '16px' }} />
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

        <p style={{ textAlign: 'center', marginTop: 18, color: '#6b7280', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#16a34a', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}