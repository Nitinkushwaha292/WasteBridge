import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '../context/AuthContext';

const WASTE_CATEGORIES = [
  { type: 'Plastic', icon: '🧴', color: '#2563eb', img: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&q=70', desc: 'PET bottles, HDPE containers, packaging films collected from rivers and landfills.' },
  { type: 'Metal', icon: '⚙️', color: '#d97706', img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=70', desc: 'Aluminium cans, iron scrap, copper wire — high value recyclables.' },
  { type: 'Electronic', icon: '💻', color: '#dc2626', img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=70', desc: 'Circuit boards, batteries, cables from industrial and household e-waste.' },
  { type: 'Paper', icon: '📄', color: '#16a34a', img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=70', desc: 'Cardboard, newspapers, office paper — easily recyclable and in high demand.' },
  { type: 'Glass', icon: '🍶', color: '#7c3aed', img: 'https://images.unsplash.com/photo-1558618047-3c8e6a0cfac2?w=400&q=70', desc: 'Bottles, jars, flat glass — 100% recyclable without quality loss.' },
  { type: 'Textile', icon: '👕', color: '#ea580c', img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=70', desc: 'Old clothes, fabric scraps turned into industrial rags or new yarn.' },
];

const HOW_STEPS = [
  { step: '01', role: 'NGO/Organizations/Volunteers', color: '#16a34a', icon: '🌊', title: 'Collect Waste', desc: 'NGOs and volunteers remove plastic and waste from rivers, oceans, and landfills across India.', img: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=500&q=70' },
  { step: '02', role: 'NGO/Organizations/Volunteers', color: '#16a34a', icon: '📋', title: 'Post a Listing', desc: 'Create a listing with waste type, weight, location, photos and your asking price per kg.', img: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&q=70' },
  { step: '03', role: 'Recycler', color: '#2563eb', icon: '🔍', title: 'Discover & Claim', desc: 'Recycling companies browse listings, filter by type and location, and send claim requests.', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=70' },
  { step: '04', role: 'Both', color: '#d97706', icon: '🤝', title: 'Connect & Earn', desc: 'NGO accepts the claim, arranges pickup, gets paid — and waste gets a new life as a product.', img: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=500&q=70' },
];

const TESTIMONIALS = [
  { name: 'Ravi Sharma', org: 'Clean Yamuna Foundation', role: 'NGO Director', text: 'WasteBridge helped us turn our river cleanup into a revenue source. We collected 2 tonnes last month and found a buyer within 3 days.', avatar: 'R', color: '#16a34a' },
  { name: 'Priya Mehta', org: 'EcoPlast Industries', role: 'Procurement Head', text: 'We source 40% of our raw plastic through WasteBridge now. The quality is verified, pricing is fair, and NGOs are reliable partners.', avatar: 'P', color: '#2563eb' },
  { name: 'Arjun Das', org: 'Mumbai Beach Warriors', role: 'Volunteer Lead', text: 'We used to not know what to do with the waste we collected. Now we earn from it and fund our next cleanup automatically.', avatar: 'A', color: '#d97706' },
];

export default function Home() {
  const [stats, setStats] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    axios.get(`${API}/stats`).then(r => setStats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveStep(s => (s + 1) % 4), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ background: '#ffffff' }}>

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1400&q=80)`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.3)'
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(22,163,74,0.5) 0%, rgba(255,255,255,0.05) 60%, rgba(21,128,61,0.3) 100%)'
        }} />

        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%' }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: 30, padding: '8px 18px', marginBottom: 32,
              backdropFilter: 'blur(8px)'
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 600 }}>India's Waste Marketplace — Live Now</span>
            </div>

            <h1 style={{
              fontFamily: 'Space Grotesk', fontWeight: 800,
              fontSize: 'clamp(2.8rem, 7vw, 5rem)',
              color: '#ffffff', marginBottom: 24, lineHeight: 1.05,
              textShadow: '0 2px 20px rgba(0,0,0,0.3)'
            }}>
              Waste Collected.<br />
              <span style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Value Created.
              </span>
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', lineHeight: 1.8, marginBottom: 40, maxWidth: 580 }}>
              WasteBridge connects the NGOs, Organizations and volunteers removing plastic from rivers and oceans with recycling factories or companies who make thier product using wastes — turning environmental work into financial sustainability.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 56 }}>
              <Link to="/register" style={{
                background: '#16a34a', color: '#ffffff',
                padding: '16px 36px', borderRadius: 12, fontWeight: 700,
                fontSize: '1.05rem', textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(22,163,74,0.5)'
              }}>Join as NGO →</Link>
              <Link to="/listings" style={{
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                border: '2px solid rgba(255,255,255,0.5)',
                color: '#ffffff', padding: '16px 36px', borderRadius: 12,
                fontWeight: 600, fontSize: '1.05rem', textDecoration: 'none'
              }}>Browse Waste</Link>
            </div>

            {stats && (
              <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 32 }}>
                {[
                  { v: stats.totalNGOs, l: 'NGOs Active' },
                  { v: stats.totalRecyclers, l: 'Recyclers' },
                  { v: stats.totalListings, l: 'Listings Posted' },
                  { v: `${(stats.totalWasteKg / 1000).toFixed(1)}T`, l: 'Waste Recycled' },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.8rem', color: '#4ade80' }}>{s.v}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ PROBLEM ═══ */}
      <section style={{ padding: '96px 24px', background: '#f4faf6' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <div style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>⚠️ The Problem</div>
              <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#0f1f12', lineHeight: 1.2, marginBottom: 24 }}>
                India generates <span style={{ color: '#dc2626' }}>9.4 million tonnes</span> of plastic waste every year
              </h2>
              <p style={{ color: '#374151', lineHeight: 1.9, fontSize: '1.05rem', marginBottom: 20 }}>
                NGOs work tirelessly to remove waste from rivers and oceans — but face one critical problem: <strong style={{ color: '#0f1f12' }}>they don't know what to do with the waste afterwards.</strong>
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  '🌊 75% of India\'s waste is openly dumped in rivers and landfills',
                  '♻️ Only 30% of plastic waste gets recycled in India',
                  '💸 NGOs lose potential revenue worth crores every year',
                  '🏭 Factories pay 40% more for virgin plastic vs recycled'
                ].map(point => (
                  <div key={point} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', background: '#fff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <span style={{ color: '#374151', fontSize: '0.92rem', lineHeight: 1.6 }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=600&q=80" alt="River pollution"
                style={{ width: '100%', borderRadius: 20, objectFit: 'cover', height: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }} />
              <div style={{
                position: 'absolute', bottom: 20, left: 20, right: 20,
                background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
                borderRadius: 14, padding: '16px 20px',
                border: '1px solid rgba(220,38,38,0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
              }}>
                <div style={{ color: '#dc2626', fontWeight: 700, fontSize: '1.4rem', fontFamily: 'Space Grotesk' }}>9.4M Tonnes</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>plastic waste generated in India annually</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SOLUTION ═══ */}
      <section style={{ padding: '96px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=600&q=80" alt="Recycling factory"
                style={{ width: '100%', borderRadius: 20, objectFit: 'cover', height: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }} />
              <div style={{
                position: 'absolute', top: 20, left: 20,
                background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(22,163,74,0.3)', borderRadius: 14,
                padding: '14px 18px', boxShadow: '0 4px 16px rgba(22,163,74,0.15)'
              }}>
                <div style={{ color: '#16a34a', fontWeight: 700, fontSize: '1rem' }}>✓ Verified Deal</div>
                <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>500kg PET Plastic</div>
                <div style={{ color: '#0f1f12', fontSize: '0.9rem', fontWeight: 700 }}>₹7,500 earned</div>
              </div>
            </div>
            <div>
              <div style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>✅ The Solution</div>
              <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#0f1f12', lineHeight: 1.2, marginBottom: 24 }}>
                A marketplace that turns <span style={{ color: '#16a34a' }}>waste into income</span>
              </h2>
              <p style={{ color: '#374151', lineHeight: 1.9, fontSize: '1.05rem', marginBottom: 28 }}>
                WasteBridge connects waste collectors, NGOs, and recycling factories into one seamless digital ecosystem — creating financial sustainability for environmental work.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: '📋', title: 'List your waste', desc: 'Post collected waste with price, type, weight and location' },
                  { icon: '🤝', title: 'Get matched', desc: 'Verified recyclers discover and claim your waste listings' },
                  { icon: '💰', title: 'Get paid', desc: 'Earn revenue to fund your next cleanup operation' },
                ].map(f => (
                  <div key={f.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '16px', background: '#f4faf6', borderRadius: 12, border: '1px solid #dcfce7' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: '#dcfce7', border: '1px solid #86efac', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{f.icon}</div>
                    <div>
                      <div style={{ color: '#0f1f12', fontWeight: 600, marginBottom: 4 }}>{f.title}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding: '96px 24px', background: '#f4faf6' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>Process</div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#0f1f12', marginBottom: 12 }}>How WasteBridge Works</h2>
            <p style={{ color: '#6b7280', maxWidth: 500, margin: '0 auto' }}>Four simple steps from waste collection to recycling factory</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {HOW_STEPS.map((step, i) => (
              <div key={step.step} onClick={() => setActiveStep(i)} style={{
                borderRadius: 20, overflow: 'hidden',
                border: `2px solid ${activeStep === i ? step.color : 'rgba(0,0,0,0.08)'}`,
                background: '#ffffff', cursor: 'pointer', transition: 'all 0.3s',
                transform: activeStep === i ? 'translateY(-4px)' : 'none',
                boxShadow: activeStep === i ? `0 12px 32px ${step.color}25` : '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                  <img src={step.img} alt={step.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: activeStep === i ? 'brightness(0.75)' : 'brightness(0.5)', transition: 'all 0.3s' }} />
                  <div style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(255,255,255,0.9)', borderRadius: 8, padding: '3px 10px', color: step.color, fontSize: '0.72rem', fontWeight: 700 }}>{step.role}</div>
                  <div style={{ position: 'absolute', top: 14, right: 14, fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '2rem', color: 'rgba(255,255,255,0.3)' }}>{step.step}</div>
                  <div style={{ position: 'absolute', bottom: 12, left: 14, fontSize: '1.6rem' }}>{step.icon}</div>
                </div>
                <div style={{ padding: '20px 22px' }}>
                  <h3 style={{ color: '#0f1f12', marginBottom: 8, fontSize: '1.05rem' }}>{step.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WASTE CATEGORIES ═══ */}
      <section style={{ padding: '96px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>Categories</div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#0f1f12', marginBottom: 12 }}>What We Recycle</h2>
            <p style={{ color: '#6b7280', maxWidth: 500, margin: '0 auto' }}>All categories of environmental and industrial waste, matched to the right recycler</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {WASTE_CATEGORIES.map(cat => (
              <div key={cat.type} style={{
                borderRadius: 20, overflow: 'hidden',
                border: '1.5px solid rgba(0,0,0,0.08)',
                background: '#ffffff', transition: 'all 0.25s', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${cat.color}20`; e.currentTarget.style.borderColor = cat.color + '40'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; }}
              >
                <div style={{ position: 'relative', height: 160 }}>
                  <img src={cat.img} alt={cat.type} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }} />
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${cat.color}50, transparent)` }} />
                  <div style={{ position: 'absolute', bottom: 12, left: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1.4rem' }}>{cat.icon}</span>
                    <span style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.05rem', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{cat.type}</span>
                  </div>
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.7 }}>{cat.desc}</p>
                  <Link to={`/listings?wasteType=${cat.type.toLowerCase()}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10, color: cat.color, fontSize: '0.85rem', fontWeight: 600 }}>View listings →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ IMPACT NUMBERS ═══ */}
      <section style={{ padding: '96px 24px', background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ color: '#bbf7d0', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>Our Impact</div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#ffffff' }}>Every Number Tells a Story</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { icon: '🌊', value: '700K+', label: 'Tonnes Channelized', sub: 'waste diverted from nature' },
              { icon: '🏭', value: '325+', label: 'Recyclers Network', sub: 'verified processing partners' },
              { icon: '🌿', value: '2.5x', label: 'CO₂ Offset', sub: 'kg saved per kg recycled' },
              { icon: '💰', value: '₹100Cr+', label: 'NGO Revenue', sub: 'generated through platform' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '36px 28px', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>{s.icon}</div>
                <div style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '2.2rem', color: '#ffffff', marginBottom: 6 }}>{s.value}</div>
                <div style={{ color: '#bbf7d0', fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOR BOTH SIDES ═══ */}
      <section style={{ padding: '96px 24px', background: '#f4faf6' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#0f1f12', marginBottom: 12 }}>Built For Both Sides</h2>
            <p style={{ color: '#6b7280', maxWidth: 500, margin: '0 auto' }}>Whether you collect waste or process it — WasteBridge is your platform</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* NGO Card */}
            <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative', minHeight: 420 }}>
              <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=700&q=80" alt="NGO volunteers"
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, filter: 'brightness(0.35)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,31,18,0.97) 0%, rgba(15,31,18,0.4) 60%, transparent 100%)' }} />
              <div style={{ position: 'relative', padding: 36, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <span style={{ display: 'inline-block', marginBottom: 16, background: 'rgba(22,163,74,0.2)', border: '1px solid rgba(22,163,74,0.5)', color: '#4ade80', padding: '5px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, width: 'fit-content' }}>FOR NGOs & COLLECTORS</span>
                <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1.8rem', color: '#fff', marginBottom: 16 }}>Turn cleanup into income</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {['Post waste listings in minutes', 'Get paid for what you collect', 'Connect with 325+ verified recyclers', 'Track your environmental impact'].map(p => (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: '#4ade80', fontWeight: 700 }}>✓</span>
                      <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{p}</span>
                    </div>
                  ))}
                </div>
                <Link to="/register" style={{ display: 'inline-block', background: '#16a34a', color: '#fff', padding: '13px 28px', borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', width: 'fit-content', boxShadow: '0 4px 16px rgba(22,163,74,0.4)' }}>Join as NGO →</Link>
              </div>
            </div>

            {/* Recycler Card */}
            <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative', minHeight: 420 }}>
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80" alt="Recycling factory"
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, filter: 'brightness(0.35)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,18,40,0.97) 0%, rgba(15,18,40,0.4) 60%, transparent 100%)' }} />
              <div style={{ position: 'relative', padding: 36, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <span style={{ display: 'inline-block', marginBottom: 16, background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.5)', color: '#93c5fd', padding: '5px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, width: 'fit-content' }}>FOR RECYCLING COMPANIES</span>
                <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1.8rem', color: '#fff', marginBottom: 16 }}>Source raw material at scale</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {['Access pan-India waste supply', 'Filter by type, city and quantity', 'Save 40% vs virgin material', 'Meet your EPR compliance targets'].map(p => (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: '#93c5fd', fontWeight: 700 }}>✓</span>
                      <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{p}</span>
                    </div>
                  ))}
                </div>
                <Link to="/register" style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '13px 28px', borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', width: 'fit-content', boxShadow: '0 4px 16px rgba(37,99,235,0.4)' }}>Join as Recycler →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section style={{ padding: '96px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>Testimonials</div>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#0f1f12' }}>What Our Users Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: '#ffffff', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderTop: `3px solid ${t.color}` }}>
                <div style={{ fontSize: '1.8rem', color: t.color, marginBottom: 14, fontFamily: 'Georgia' }}>"</div>
                <p style={{ color: '#374151', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: 24 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 18 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg, ${t.color}, ${t.color}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>{t.avatar}</div>
                  <div>
                    <div style={{ color: '#0f1f12', fontWeight: 600, fontSize: '0.95rem' }}>{t.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{t.role}, {t.org}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=1400&q=70" alt="Clean ocean"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.25)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(22,163,74,0.6), rgba(15,31,18,0.7))' }} />
        <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: '#fff', marginBottom: 20, textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            Ready to make the planet cleaner?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', marginBottom: 40, lineHeight: 1.8 }}>
            Join thousands of NGOs and recyclers already using WasteBridge to build a circular economy — one listing at a time.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ background: '#16a34a', color: '#fff', padding: '16px 40px', borderRadius: 12, fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(22,163,74,0.5)' }}>Get Started Free</Link>
            <Link to="/impact" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', padding: '16px 40px', borderRadius: 12, fontWeight: 600, fontSize: '1.05rem', textDecoration: 'none' }}>See Live Impact</Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.2); } }
        @media (max-width: 768px) {
          section > div > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}