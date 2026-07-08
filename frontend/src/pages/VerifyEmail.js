import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function VerifyEmail() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  if (!user) { navigate('/login'); return null; }
  if (user.isEmailVerified) { navigate('/dashboard'); return null; }

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) return toast.error('Enter a valid 6-digit OTP');
    setVerifying(true);
    try {
      await axios.post(`${API}/auth/verify-email`, { otp });
      toast.success('Email verified! Welcome to WasteBridge 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setVerifying(false);
    }
  };

  const resendOTP = async () => {
    setResending(true);
    try {
      await axios.post(`${API}/auth/resend-otp`);
      toast.success('New OTP sent!');
    } catch (err) {
      toast.error('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: '#f4faf6' }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#ffffff', border: '1.5px solid rgba(22,163,74,0.15)', borderRadius: 20, padding: 40, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', textAlign: 'center' }}>

        <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>📧</div>
        <h1 style={{ fontSize: '1.5rem', color: '#0f1f12', marginBottom: 8 }}>Verify Your Email</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: 6 }}>We sent a 6-digit OTP to:</p>
        <p style={{ color: '#16a34a', fontWeight: 700, marginBottom: 28, fontSize: '1rem' }}>{user.email}</p>

        <div style={{ marginBottom: 20, textAlign: 'left' }}>
          <label style={{ display: 'block', color: '#374151', fontSize: '0.85rem', marginBottom: 6, fontWeight: 500 }}>Enter OTP *</label>
          <input
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            style={{
              fontSize: '1.8rem', letterSpacing: '0.4em',
              textAlign: 'center', fontWeight: 700,
              border: '1.5px solid rgba(0,0,0,0.12)',
              borderRadius: 10, padding: '12px',
              width: '100%', outline: 'none',
              color: '#0f1f12'
            }}
          />
        </div>

        <button onClick={verifyOTP} disabled={verifying || otp.length !== 6} style={{
          width: '100%', background: otp.length === 6 ? '#16a34a' : '#86efac',
          color: '#fff', border: 'none', borderRadius: 10,
          padding: '13px', fontWeight: 700, fontSize: '1rem',
          marginBottom: 14, cursor: otp.length === 6 ? 'pointer' : 'not-allowed',
          boxShadow: otp.length === 6 ? '0 2px 8px rgba(22,163,74,0.3)' : 'none'
        }}>
          {verifying ? 'Verifying...' : '✓ Verify Email'}
        </button>

        <button onClick={resendOTP} disabled={resending} style={{
          background: 'none', border: 'none', color: '#16a34a',
          fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600,
          marginBottom: 20
        }}>
          {resending ? 'Sending...' : "Didn't receive OTP? Resend"}
        </button>

        <div style={{ background: '#f4faf6', borderRadius: 10, padding: '12px 16px', border: '1px solid #dcfce7', marginBottom: 16 }}>
          <p style={{ color: '#6b7280', fontSize: '0.78rem', margin: 0, lineHeight: 1.6 }}>
            OTP is valid for 10 minutes. Check your spam folder if not received in inbox.
          </p>
        </div>

        <button onClick={() => navigate('/dashboard')} style={{
          background: 'none', border: 'none', color: '#9ca3af',
          fontSize: '0.8rem', cursor: 'pointer'
        }}>
          Skip for now → verify later
        </button>
      </div>
    </div>
  );
}