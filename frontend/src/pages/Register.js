import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API } from '../context/AuthContext';

const COLLECTOR_TYPES = [
  {
    val: 'ngo',
    label: '🏢 NGO / Organization',
    desc: 'Registered non-profit or trust working on environmental cleanup',
    badge: 'NGO',
    color: '#16a34a'
  },
  {
    val: 'volunteer',
    label: '👥 Volunteer / Group',
    desc: 'Unregistered group, community or volunteer team doing cleanups',
    badge: 'Volunteer',
    color: '#2563eb'
  },
  {
    val: 'individual',
    label: '👤 Individual Collector',
    desc: 'Single person collecting waste independently from local areas',
    badge: 'Collector',
    color: '#d97706'
  }
];

export default function Register() {
  const [step, setStep] = useState(1); // 1=role, 2=collector type, 3=details, 4=verify OTP
  const [mainRole, setMainRole] = useState('');
  const [collectorType, setCollectorType] = useState('');
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    organization: '', phone: '',
    location: { city: '', state: '', country: 'India' }
  });
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => {
    const { name, value } = e.target;
    if (name === 'city' || name === 'state') {
      setForm(f => ({ ...f, location: { ...f.location, [name]: value } }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleRoleSelect = (role) => {
    setMainRole(role);
    if (role === 'recycler') setStep(3);
    else setStep(2);
  };

  const handleCollectorTypeSelect = (type) => {
    setCollectorType(type);
    setStep(3);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register({
        ...form,
        role: mainRole,
        collectorType: mainRole === 'collector' ? collectorType : null
      });
      toast.success('Account created! Please verify your email.');
      setStep(4);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

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
      toast.success('New OTP sent to your email!');
    } catch (err) {
      toast.error('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const selectedCollector = COLLECTOR_TYPES.find(t => t.val === collectorType);
  const labelStyle = { display: 'block', color: '#374151', fontSize: '0.85rem', marginBottom: 6, fontWeight: 500 };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: '#f4faf6' }}>
      <div style={{ width: '100%', maxWidth: step === 2 ? 580 : 480, background: '#ffffff', border: '1.5px solid rgba(22,163,74,0.15)', borderRadius: 20, padding: 'clamp(24px, 5vw, 40px)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, margin: '0 auto 14px', background: 'linear-gradient(135deg, #16a34a, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 4px 16px rgba(22,163,74,0.3)' }}>♻️</div>
          <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', color: '#0f1f12', marginBottom: 6 }}>
            {step === 1 && 'Join WasteBridge'}
            {step === 2 && 'Select Your Collector Type'}
            {step === 3 && 'Complete Your Profile'}
            {step === 4 && 'Verify Your Email'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>
            {step === 1 && 'Choose how you want to use WasteBridge'}
            {step === 2 && 'Tell us more about your role'}
            {step === 3 && 'Fill in your details to get started'}
            {step === 4 && `OTP sent to ${form.email}`}
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {[1, 2, 3, 4].filter(s => mainRole === 'recycler' ? s !== 2 : true).map(s => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: s <= step ? '#16a34a' : '#e5e7eb',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        {/* ── STEP 1: Choose Main Role ── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { val: 'collector', icon: '🌊', label: 'Collector', desc: 'I collect waste from rivers, oceans, landfills or local areas', color: '#16a34a' },
              { val: 'recycler', icon: '🏭', label: 'Recycling Company', desc: 'I buy waste and recycle it into new products', color: '#2563eb' }
            ].map(r => (
              <div key={r.val} onClick={() => handleRoleSelect(r.val)} style={{
                border: `2px solid ${mainRole === r.val ? r.color : 'rgba(0,0,0,0.1)'}`,
                background: mainRole === r.val ? `${r.color}08` : '#fff',
                borderRadius: 14, padding: '18px 20px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 16,
                transition: 'all 0.2s',
                boxShadow: mainRole === r.val ? `0 4px 16px ${r.color}20` : 'none'
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${r.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{r.icon}</div>
                <div>
                  <div style={{ color: '#0f1f12', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{r.label}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.82rem', lineHeight: 1.5 }}>{r.desc}</div>
                </div>
                <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', border: `2px solid ${mainRole === r.val ? r.color : '#d1d5db'}`, background: mainRole === r.val ? r.color : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {mainRole === r.val && <span style={{ color: '#fff', fontSize: '0.7rem' }}>✓</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 2: Collector Sub-Type ── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {COLLECTOR_TYPES.map(t => (
              <div key={t.val} onClick={() => handleCollectorTypeSelect(t.val)} style={{
                border: `2px solid ${collectorType === t.val ? t.color : 'rgba(0,0,0,0.1)'}`,
                background: collectorType === t.val ? `${t.color}08` : '#fff',
                borderRadius: 14, padding: '16px 18px', cursor: 'pointer',
                display: 'flex', alignItems: 'flex-start', gap: 14,
                transition: 'all 0.2s'
              }}>
                <div style={{ fontSize: '1.6rem', marginTop: 2, flexShrink: 0 }}>{t.label.split(' ')[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: '#0f1f12', fontWeight: 700, fontSize: '0.95rem' }}>{t.label.substring(t.label.indexOf(' ') + 1)}</span>
                    <span style={{ background: `${t.color}15`, color: t.color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: `1px solid ${t.color}30` }}>{t.badge}</span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.82rem', lineHeight: 1.5 }}>{t.desc}</div>
                </div>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${collectorType === t.val ? t.color : '#d1d5db'}`, background: collectorType === t.val ? t.color : 'transparent', flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {collectorType === t.val && <span style={{ color: '#fff', fontSize: '0.7rem' }}>✓</span>}
                </div>
              </div>
            ))}
            <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.85rem', cursor: 'pointer', marginTop: 4 }}>← Back</button>
          </div>
        )}

        {/* ── STEP 3: Fill Details ── */}
        {step === 3 && (
          <>
            {/* Selected role badge */}
            <div style={{ background: '#f4faf6', border: '1px solid #dcfce7', borderRadius: 10, padding: '10px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.2rem' }}>{mainRole === 'recycler' ? '🏭' : selectedCollector?.label.split(' ')[0] || '🌊'}</span>
              <div>
                <div style={{ color: '#0f1f12', fontWeight: 600, fontSize: '0.88rem' }}>
                  {mainRole === 'recycler' ? 'Recycling Company' : selectedCollector?.label.substring(selectedCollector?.label.indexOf(' ') + 1)}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Your profile badge</div>
              </div>
              <button onClick={() => setStep(mainRole === 'recycler' ? 1 : 2)} style={{ marginLeft: 'auto', background: 'none', border: '1px solid rgba(0,0,0,0.1)', color: '#6b7280', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer' }}>Change</button>
            </div>

            <form onSubmit={submit}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Full Name *</label>
                <input name="name" value={form.name} onChange={handle} required placeholder="Your full name" style={{ fontSize: '16px' }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>
                  {mainRole === 'recycler' ? 'Company Name *' : collectorType === 'ngo' ? 'Organization Name *' : collectorType === 'volunteer' ? 'Group / Team Name *' : 'Your Name or Alias *'}
                </label>
                <input name="organization" value={form.organization} onChange={handle} required
                  placeholder={mainRole === 'recycler' ? 'e.g. EcoPlast Industries' : collectorType === 'ngo' ? 'e.g. Clean Yamuna Foundation' : collectorType === 'volunteer' ? 'e.g. Delhi Green Warriors' : 'e.g. Rahul Kumar'}
                  style={{ fontSize: '16px' }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handle} required placeholder="you@example.com" style={{ fontSize: '16px' }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Phone Number</label>
                <input name="phone" value={form.phone} onChange={handle} placeholder="+91 98765 43210" style={{ fontSize: '16px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>City *</label>
                  <input name="city" value={form.location.city} onChange={handle} required placeholder="Delhi" style={{ fontSize: '16px' }} />
                </div>
                <div>
                  <label style={labelStyle}>State *</label>
                  <input name="state" value={form.location.state} onChange={handle} required placeholder="Delhi" style={{ fontSize: '16px' }} />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Password *</label>
                <input type="password" name="password" value={form.password} onChange={handle} required placeholder="Min 6 characters" style={{ fontSize: '16px' }} />
              </div>

              {/* NGO notice */}
              {collectorType === 'ngo' && (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
                  <div style={{ color: '#92400e', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>⚠️ NGO Verification Required</div>
                  <div style={{ color: '#78350f', fontSize: '0.78rem', lineHeight: 1.6 }}>
                    After email verification, your NGO account will be reviewed by our admin team before receiving the Verified badge. You can still post listings while pending.
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%', background: loading ? '#86efac' : '#16a34a',
                color: '#ffffff', border: 'none', borderRadius: 10,
                padding: '13px', fontWeight: 700, fontSize: '1rem',
                boxShadow: '0 2px 8px rgba(22,163,74,0.3)'
              }}>
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>
          </>
        )}

        {/* ── STEP 4: OTP Verification ── */}
        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📧</div>
            <p style={{ color: '#374151', marginBottom: 8, fontSize: '0.9rem' }}>
              We sent a 6-digit OTP to:
            </p>
            <p style={{ color: '#16a34a', fontWeight: 700, marginBottom: 24, fontSize: '1rem' }}>{form.email}</p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ ...labelStyle, textAlign: 'left' }}>Enter OTP *</label>
              <input
                value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                style={{ fontSize: '1.5rem', letterSpacing: '0.3em', textAlign: 'center', fontWeight: 700 }}
              />
            </div>

            <button onClick={verifyOTP} disabled={verifying || otp.length !== 6} style={{
              width: '100%', background: otp.length === 6 ? '#16a34a' : '#86efac',
              color: '#fff', border: 'none', borderRadius: 10,
              padding: '13px', fontWeight: 700, fontSize: '1rem',
              marginBottom: 14, cursor: otp.length === 6 ? 'pointer' : 'not-allowed'
            }}>
              {verifying ? 'Verifying...' : '✓ Verify Email'}
            </button>

            <button onClick={resendOTP} disabled={resending} style={{
              background: 'none', border: 'none', color: '#16a34a',
              fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600
            }}>
              {resending ? 'Sending...' : "Didn't receive OTP? Resend"}
            </button>

            <div style={{ marginTop: 16, padding: '10px 14px', background: '#f4faf6', borderRadius: 8, border: '1px solid #dcfce7' }}>
              <p style={{ color: '#6b7280', fontSize: '0.78rem', margin: 0 }}>
                OTP is valid for 10 minutes. Check your spam folder if not received.
              </p>
            </div>

            <button onClick={() => navigate('/dashboard')} style={{
              background: 'none', border: 'none', color: '#9ca3af',
              fontSize: '0.8rem', cursor: 'pointer', marginTop: 16, display: 'block', width: '100%'
            }}>
              Skip for now → verify later from dashboard
            </button>
          </div>
        )}

        {step !== 4 && (
          <p style={{ textAlign: 'center', marginTop: 20, color: '#6b7280', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#16a34a', fontWeight: 600 }}>Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}