import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
        width: '100%', maxWidth: 420,
        background: '#ffffff',
        border: '1.5px solid rgba(22,163,74,0.15)',
        borderRadius: 20, padding: 40,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', boxShadow: '0 4px 16px rgba(22,163,74,0.3)'
          }}>♻️</div>
          <h1 style={{ fontSize: '1.6rem', color: '#0f1f12', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Sign in to your WasteBridge account</p>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', color: '#374151', fontSize: '0.85rem', marginBottom: 6, fontWeight: 500 }}>Email address</label>
            <input type="email" name="email" value={form.email} onChange={handle} placeholder="you@organization.com" required />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', color: '#374151', fontSize: '0.85rem', marginBottom: 6, fontWeight: 500 }}>Password</label>
            <input type="password" name="password" value={form.password} onChange={handle} placeholder="••••••••" required />   
            
            </div>
          <button type="submit" disabled={loading} style={{
            width: '100%',
            background: loading ? '#86efac' : '#16a34a',
            color: '#ffffff', border: 'none', borderRadius: 10,
            padding: '13px', fontWeight: 700, fontSize: '1rem',
            boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
            transition: 'all 0.2s'
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: '#6b7280', fontSize: '0.875rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#16a34a', fontWeight: 600 }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}