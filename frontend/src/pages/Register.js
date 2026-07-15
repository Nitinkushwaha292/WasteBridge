import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const COLLECTOR_TYPES = [
  {
    val: 'ngo',
    icon: '🏢',
    label: 'NGO / Organization',
    desc: 'Registered non-profit or trust working on environmental cleanup',
    badge: 'NGO',
    color: '#16a34a',
    note: 'Requires admin verification before posting listings'
  },
  {
    val: 'volunteer',
    icon: '👥',
    label: 'Volunteer / Group',
    desc: 'Community group, volunteer team or unregistered collective doing cleanups',
    badge: 'Volunteer',
    color: '#2563eb',
    note: 'Can post listings immediately after email verification'
  },
  {
    val: 'individual',
    icon: '👤',
    label: 'Individual Collector',
    desc: 'Single person collecting waste independently from local areas',
    badge: 'Collector',
    color: '#d97706',
    note: 'Can post listings immediately after email verification'
  }
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [mainRole, setMainRole] = useState('');
  const [collectorType, setCollectorType] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', password: '',
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
      navigate('/verify-email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedCollector = COLLECTOR_TYPES.find(t => t.val === collectorType);
  const labelStyle = { display: 'block', color: '#374151', fontSize: '0.85rem', marginBottom: 6, fontWeight: 500 };

  const totalSteps = mainRole === 'recycler' ? 2 : 3;
  const currentStep = mainRole === 'recycler' ? (step === 1 ? 1 : 2) : step;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: '#f4faf6' }}>
      <div style={{
        width: '100%',
        maxWidth: step === 2 ? 560 : 480,
        background: '#ffffff',
        border: '1.5px solid rgba(22,163,74,0.15)',
        borderRadius: 20,
        padding: 'clamp(24px, 5vw, 40px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: '0 auto 12px',
            background: 'linear-gradient(135deg, #16a34a, #22c55e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', boxShadow: '0 4px 16px rgba(22,163,74,0.3)'
          }}>♻️</div>
          <h1 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', color: '#0f1f12', marginBottom: 4 }}>
            {step === 1 && 'Join WasteBridge'}
            {step === 2 && 'Select Your Type'}
            {step === 3 && 'Complete Your Profile'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.83rem' }}>
            {step === 1 && 'How do you want to use WasteBridge?'}
            {step === 2 && 'Tell us more about your collector role'}
            {step === 3 && 'Almost done! Fill in your details'}
          </p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i < currentStep ? '#16a34a' : '#e5e7eb',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        {/* ── STEP 1: Main Role ── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { val: 'collector', icon: '🌊', label: 'Collector', desc: 'I collect waste from rivers, oceans, landfills or local areas and want to sell it to recyclers', color: '#16a34a' },
              { val: 'recycler', icon: '🏭', label: 'Recycling Company', desc: 'I buy waste materials and recycle them into new products', color: '#2563eb' }
            ].map(r => (
              <div key={r.val} onClick={() => handleRoleSelect(r.val)} style={{
                border: `2px solid ${mainRole === r.val ? r.color : 'rgba(0,0,0,0.1)'}`,
                background: mainRole === r.val ? `${r.color}06` : '#fff',
                borderRadius: 14, padding: '18px 20px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 16,
                transition: 'all 0.2s',
                boxShadow: mainRole === r.val ? `0 4px 16px ${r.color}20` : 'none'
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${r.color}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', flexShrink: 0
                }}>{r.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#0f1f12', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{r.label}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.8rem', lineHeight: 1.5 }}>{r.desc}</div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${mainRole === r.val ? r.color : '#d1d5db'}`,
                  background: mainRole === r.val ? r.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {mainRole === r.val && <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>✓</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 2: Collector Sub-Type ── */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {COLLECTOR_TYPES.map(t => (
                <div key={t.val} onClick={() => handleCollectorTypeSelect(t.val)} style={{
                  border: `2px solid ${collectorType === t.val ? t.color : 'rgba(0,0,0,0.1)'}`,
                  background: collectorType === t.val ? `${t.color}06` : '#fff',
                  borderRadius: 14, padding: '16px 18px', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ fontSize: '1.6rem', flexShrink: 0, marginTop: 2 }}>{t.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ color: '#0f1f12', fontWeight: 700, fontSize: '0.95rem' }}>{t.label}</span>
                        <span style={{
                          background: `${t.color}12`, color: t.color,
                          fontSize: '0.68rem', fontWeight: 700,
                          padding: '2px 8px', borderRadius: 20,
                          border: `1px solid ${t.color}25`
                        }}>{t.badge}</span>
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: 6 }}>{t.desc}</div>
                      <div style={{ color: t.val === 'ngo' ? '#d97706' : '#16a34a', fontSize: '0.75rem', fontWeight: 500 }}>
                        {t.val === 'ngo' ? '⚠️' : '✓'} {t.note}
                      </div>
                    </div>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 4,
                      border: `2px solid ${collectorType === t.val ? t.color : '#d1d5db'}`,
                      background: collectorType === t.val ? t.color : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {collectorType === t.val && <span style={{ color: '#fff', fontSize: '0.65rem', fontWeight: 700 }}>✓</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => { setStep(1); setMainRole(''); }} style={{
              background: 'none', border: 'none', color: '#6b7280',
              fontSize: '0.85rem', cursor: 'pointer', marginTop: 16
            }}>← Back</button>
          </div>
        )}

        {/* ── STEP 3: Fill Details ── */}
        {step === 3 && (
          <>
            {/* Selected role summary */}
            <div style={{
              background: '#f4faf6', border: '1px solid #dcfce7',
              borderRadius: 10, padding: '10px 14px', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 10
            }}>
              <span style={{ fontSize: '1.2rem' }}>
                {mainRole === 'recycler' ? '🏭' : selectedCollector?.icon || '🌊'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#0f1f12', fontWeight: 600, fontSize: '0.88rem' }}>
                  {mainRole === 'recycler' ? 'Recycling Company' : selectedCollector?.label}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.72rem' }}>Your selected role</div>
              </div>
              <button
                onClick={() => { setStep(mainRole === 'recycler' ? 1 : 2); }}
                style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', color: '#6b7280', padding: '3px 10px', borderRadius: 6, fontSize: '0.72rem', cursor: 'pointer' }}
              >Change</button>
            </div>

            <form onSubmit={submit}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Full Name *</label>
                <input name="name" value={form.name} onChange={handle} required placeholder="Your full name" style={{ fontSize: '16px' }} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>
                  {mainRole === 'recycler' ? 'Company Name *'
                    : collectorType === 'ngo' ? 'Organization Name *'
                    : collectorType === 'volunteer' ? 'Group / Team Name *'
                    : 'Your Name or Alias *'}
                </label>
                <input
                  name="organization"
                  value={form.organization}
                  onChange={handle}
                  required
                  placeholder={
                    mainRole === 'recycler' ? 'e.g. EcoPlast Industries'
                    : collectorType === 'ngo' ? 'e.g. Clean Yamuna Foundation'
                    : collectorType === 'volunteer' ? 'e.g. Delhi Green Warriors'
                    : 'e.g. Rahul Kumar'
                  }
                  style={{ fontSize: '16px' }}
                />
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

              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Password *</label>
                <input type="password" name="password" value={form.password} onChange={handle} required placeholder="Min 6 characters" style={{ fontSize: '16px' }} />
              </div>

              {/* NGO notice */}
              {collectorType === 'ngo' && (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
                  <div style={{ color: '#92400e', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>⚠️ NGO Verification Required</div>
                  <div style={{ color: '#78350f', fontSize: '0.78rem', lineHeight: 1.6 }}>
                    After email verification, your NGO account will be reviewed by our admin team.
                    You <strong>cannot post listings</strong> until your NGO is verified by admin.
                    Volunteers and Individual collectors can post immediately.
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%',
                background: loading ? '#86efac' : '#16a34a',
                color: '#ffffff', border: 'none', borderRadius: 10,
                padding: '13px', fontWeight: 700, fontSize: '1rem',
                boxShadow: '0 2px 8px rgba(22,163,74,0.3)'
              }}>
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>

            <button onClick={() => setStep(mainRole === 'recycler' ? 1 : 2)} style={{
              background: 'none', border: 'none', color: '#6b7280',
              fontSize: '0.85rem', cursor: 'pointer', marginTop: 14, display: 'block'
            }}>← Back</button>
          </>
        )}

        <p style={{ textAlign: 'center', marginTop: 20, color: '#6b7280', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#16a34a', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}