import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
  const colors = {
    available: { bg: '#dcfce7', text: '#15803d' },
    claimed: { bg: '#fef9c3', text: '#a16207' },
    completed: { bg: '#dbeafe', text: '#1d4ed8' },
    cancelled: { bg: '#fee2e2', text: '#dc2626' },
    pending: { bg: '#fef9c3', text: '#a16207' },
    accepted: { bg: '#dcfce7', text: '#15803d' },
    rejected: { bg: '#fee2e2', text: '#dc2626' },
  };
  const c = colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
  return (
    <span style={{ background: c.bg, color: c.text, padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
      {status}
    </span>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myListings, setMyListings] = useState([]);
  const [receivedClaims, setReceivedClaims] = useState([]);
  const [sentClaims, setSentClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        if (user.role === 'ngo' || user.role === 'admin') {
          const [listRes, claimRes] = await Promise.all([
            axios.get(`${API}/listings/user/mine`),
            axios.get(`${API}/claims/received`)
          ]);
          setMyListings(listRes.data);
          setReceivedClaims(claimRes.data);
        }
        if (user.role === 'recycler') {
          const claimRes = await axios.get(`${API}/claims/sent`);
          setSentClaims(claimRes.data);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [user]);

  const handleClaimAction = async (claimId, status) => {
    try {
      await axios.put(`${API}/claims/${claimId}`, { status });
      toast.success(`Claim ${status}`);
      const res = await axios.get(`${API}/claims/received`);
      setReceivedClaims(res.data);
    } catch { toast.error('Action failed'); }
  };

  const deleteListing = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await axios.delete(`${API}/listings/${id}`);
      toast.success('Listing deleted');
      setMyListings(myListings.filter(l => l._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80, color: '#6b7280', background: '#f4faf6', minHeight: '100vh' }}>
      Loading dashboard...
    </div>
  );

  const tabs = user.role === 'recycler'
    ? [{ id: 'overview', label: 'Overview' }, { id: 'claims', label: `My Claims (${sentClaims.length})` }]
    : [{ id: 'overview', label: 'Overview' }, { id: 'listings', label: `My Listings (${myListings.length})` }, { id: 'claims', label: `Incoming Claims (${receivedClaims.filter(c => c.status === 'pending').length})` }];

  const cardStyle = {
    background: '#ffffff', border: '1.5px solid rgba(0,0,0,0.08)',
    borderRadius: 16, padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  };

  return (
    <div style={{ background: '#f4faf6', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#0f1f12', marginBottom: 4 }}>
              Welcome back, {user.name.split(' ')[0]} 👋
            </h1>
            <p style={{ color: '#6b7280' }}>
              {user.organization} ·
              <span style={{
                color: user.role === 'ngo' ? '#16a34a' : '#2563eb',
                fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem', marginLeft: 6
              }}>{user.role}</span>
              {user.verified && <span style={{ color: '#16a34a', marginLeft: 8, fontSize: '0.8rem', fontWeight: 600 }}>✓ Verified</span>}
            </p>
          </div>
          {(user.role === 'ngo' || user.role === 'admin') && (
            <Link to="/create-listing" style={{
              background: '#16a34a', color: '#ffffff',
              padding: '10px 22px', borderRadius: 10, fontWeight: 700,
              fontSize: '0.9rem', textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(22,163,74,0.3)'
            }}>+ Post Waste</Link>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#fff', borderRadius: 12, padding: 4, marginBottom: 28, width: 'fit-content', border: '1.5px solid rgba(0,0,0,0.08)' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? '#16a34a' : 'transparent',
              border: 'none', color: tab === t.id ? '#fff' : '#6b7280',
              padding: '8px 18px', borderRadius: 8, fontSize: '0.9rem',
              fontWeight: tab === t.id ? 600 : 400, cursor: 'pointer', transition: 'all 0.2s'
            }}>{t.label}</button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
              {(user.role !== 'recycler' ? [
                { label: 'Total Listings', value: myListings.length, icon: '📋', color: '#16a34a' },
                { label: 'Active Listings', value: myListings.filter(l => l.status === 'available').length, icon: '🟢', color: '#15803d' },
                { label: 'Pending Claims', value: receivedClaims.filter(c => c.status === 'pending').length, icon: '⏳', color: '#d97706' },
                { label: 'Completed Deals', value: myListings.filter(l => l.status === 'completed').length, icon: '✅', color: '#2563eb' },
              ] : [
                { label: 'Claims Sent', value: sentClaims.length, icon: '📤', color: '#16a34a' },
                { label: 'Accepted', value: sentClaims.filter(c => c.status === 'accepted').length, icon: '✅', color: '#15803d' },
                { label: 'Pending', value: sentClaims.filter(c => c.status === 'pending').length, icon: '⏳', color: '#d97706' },
              ]).map(s => (
                <div key={s.label} style={{ ...cardStyle, borderTop: `3px solid ${s.color}` }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: '2rem', fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={cardStyle}>
              <h3 style={{ color: '#0f1f12', marginBottom: 16 }}>Quick Actions</h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {user.role !== 'recycler' && (
                  <Link to="/create-listing" style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '10px 18px', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem' }}>Post New Waste</Link>
                )}
                <Link to="/listings" style={{ background: '#dbeafe', color: '#1d4ed8', border: '1px solid #93c5fd', padding: '10px 18px', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem' }}>Browse Listings</Link>
                <Link to="/map" style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '10px 18px', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem' }}>🗺️ Waste Map</Link>
                <Link to="/impact" style={{ background: '#f3e8ff', color: '#7c3aed', border: '1px solid #c4b5fd', padding: '10px 18px', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem' }}>Platform Impact</Link>
                <Link to="/profile" style={{ background: '#fef9c3', color: '#a16207', border: '1px solid #fde047', padding: '10px 18px', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem' }}>Edit Profile</Link>
              </div>
            </div>
          </div>
        )}

        {/* My Listings Tab */}
        {tab === 'listings' && (
          <div>
            {myListings.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>📋</div>
                <h3 style={{ color: '#0f1f12', marginBottom: 8 }}>No listings yet</h3>
                <Link to="/create-listing" style={{ color: '#16a34a', fontWeight: 600 }}>Post your first waste listing →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {myListings.map(l => (
                  <div key={l._id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <Link to={`/listings/${l._id}`} style={{ color: '#0f1f12', fontWeight: 600, fontSize: '1rem' }}>{l.title}</Link>
                        <StatusBadge status={l.status} />
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                        {l.quantity} kg · {l.wasteType} · ₹{l.pricePerKg}/kg · {l.location?.city}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <Link to={`/listings/${l._id}`} style={{ background: '#dbeafe', color: '#1d4ed8', border: '1px solid #93c5fd', padding: '7px 14px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 500 }}>View</Link>
                      <button onClick={() => deleteListing(l._id)} style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '7px 14px', borderRadius: 8, fontSize: '0.85rem' }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Claims Tab - NGO */}
        {tab === 'claims' && user.role !== 'recycler' && (
          <div>
            {receivedClaims.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>📭</div>
                <h3 style={{ color: '#0f1f12', marginBottom: 8 }}>No claims received yet</h3>
                <p style={{ color: '#6b7280' }}>Post listings to start receiving claims from recyclers</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {receivedClaims.map(c => (
                  <div key={c._id} style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ color: '#0f1f12', fontWeight: 600 }}>{c.claimedBy?.name}</span>
                          <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>from {c.claimedBy?.organization}</span>
                          <StatusBadge status={c.status} />
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: c.message ? 8 : 0 }}>
                          For: <Link to={`/listings/${c.listing?._id}`} style={{ color: '#16a34a', fontWeight: 500 }}>{c.listing?.title}</Link>
                        </div>
                        {c.message && (
                          <div style={{ color: '#374151', fontSize: '0.85rem', background: '#f4faf6', borderRadius: 8, padding: '8px 12px', marginTop: 8, border: '1px solid #dcfce7' }}>
                            "{c.message}"
                          </div>
                        )}
                      </div>
                      {c.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button onClick={() => handleClaimAction(c._id, 'accepted')} style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '8px 16px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600 }}>✓ Accept</button>
                          <button onClick={() => handleClaimAction(c._id, 'rejected')} style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '8px 16px', borderRadius: 8, fontSize: '0.85rem' }}>✕ Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Claims Tab - Recycler */}
        {tab === 'claims' && user.role === 'recycler' && (
          <div>
            {sentClaims.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
                <h3 style={{ color: '#0f1f12', marginBottom: 8 }}>No claims sent yet</h3>
                <Link to="/listings" style={{ color: '#16a34a', fontWeight: 600 }}>Browse listings to send your first claim →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sentClaims.map(c => (
                  <div key={c._id} style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                          <Link to={`/listings/${c.listing?._id}`} style={{ color: '#0f1f12', fontWeight: 600 }}>{c.listing?.title}</Link>
                          <StatusBadge status={c.status} />
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                          {c.listing?.quantity} kg · ₹{c.listing?.pricePerKg}/kg · {c.listing?.location?.city}
                        </div>
                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: 4 }}>From: {c.postedBy?.organization}</div>
                      </div>
                      <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{new Date(c.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}