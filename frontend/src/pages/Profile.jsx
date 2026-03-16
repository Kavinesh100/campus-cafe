import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const COUPONS = {
  'WELCOME20': { discount: 20, type: 'percent', description: '20% off your order' },
  'CAMPUS50': { discount: 50, type: 'flat', description: '₹50 off your order' },
  'FACULTY10': { discount: 10, type: 'percent', description: '10% off for faculty' },
  'NEWUSER30': { discount: 30, type: 'flat', description: '₹30 off your order' },
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', flex: 1 }}>
      <div style={{ fontSize: '28px', fontWeight: '800', color: color || '#4f46e5', marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '13px', color: '#888' }}>{label}</div>
    </div>
  )
}

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {})
  const [orders, setOrders] = useState([])
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user.name || '')
  const [couponCode, setCouponCode] = useState('')
  const [couponMsg, setCouponMsg] = useState(null)
  const [savedCoupons, setSavedCoupons] = useState(() => {
    return JSON.parse(localStorage.getItem('savedCoupons')) || []
  })
  const [activeTab, setActiveTab] = useState('profile')
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetch('http://localhost:5000/api/orders/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const loyaltyPoints = Math.floor(totalSpent / 10)
  const pointsToNextReward = 100 - (loyaltyPoints % 100)
  const rewards = Math.floor(loyaltyPoints / 100)
  const progressPercent = ((loyaltyPoints % 100) / 100) * 100

  const handleSaveName = () => {
    const updatedUser = { ...user, name }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setEditing(false)
  }

  const handleCoupon = () => {
    const code = couponCode.trim().toUpperCase()
    if (!code) return
    if (savedCoupons.find(c => c.code === code)) {
      setCouponMsg({ type: 'error', text: 'Coupon already saved!' })
      return
    }
    const coupon = COUPONS[code]
    if (coupon) {
      const newCoupons = [...savedCoupons, { code, ...coupon }]
      setSavedCoupons(newCoupons)
      localStorage.setItem('savedCoupons', JSON.stringify(newCoupons))
      setCouponMsg({ type: 'success', text: `Coupon applied! ${coupon.description}` })
      setCouponCode('')
    } else {
      setCouponMsg({ type: 'error', text: 'Invalid coupon code' })
    }
    setTimeout(() => setCouponMsg(null), 3000)
  }

  const removeCoupon = (code) => {
    const updated = savedCoupons.filter(c => c.code !== code)
    setSavedCoupons(updated)
    localStorage.setItem('savedCoupons', JSON.stringify(updated))
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <button style={styles.backBtn} onClick={() => navigate('/menu')}>← Menu</button>
        <h1 style={styles.navTitle}>My Profile</h1>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.content}>

        {/* Profile hero card */}
        <div style={styles.heroCard}>
          <div style={styles.avatar}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div style={styles.heroInfo}>
            {editing ? (
              <div style={styles.editRow}>
                <input
                  style={styles.editInput}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                />
                <button style={styles.saveBtn} onClick={handleSaveName}>Save</button>
                <button style={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
              </div>
            ) : (
              <div style={styles.nameRow}>
                <h2 style={styles.heroName}>{user.name}</h2>
                <button style={styles.editBtn} onClick={() => setEditing(true)}>Edit</button>
              </div>
            )}
            <div style={styles.heroEmail}>{user.email}</div>
            <div style={styles.roleBadge}>
              {user.role === 'faculty' ? 'Faculty' : 'Student'}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          <StatCard label="Total Orders" value={orders.length} color="#4f46e5" />
          <StatCard label="Total Spent" value={`₹${totalSpent}`} color="#059669" />
          <StatCard label="Loyalty Points" value={loyaltyPoints} color="#d97706" />
          <StatCard label="Rewards Earned" value={rewards} color="#ec4899" />
        </div>

        {/* Loyalty points progress */}
        <div style={styles.loyaltyCard}>
          <div style={styles.loyaltyHeader}>
            <div>
              <div style={styles.loyaltyTitle}>Loyalty Rewards</div>
              <div style={styles.loyaltySubtitle}>Every ₹10 spent = 1 point · 100 points = ₹20 off</div>
            </div>
            <div style={styles.loyaltyPoints}>{loyaltyPoints} pts</div>
          </div>
          <div style={styles.progressBg}>
            <div style={{ ...styles.progressFill, width: `${progressPercent}%` }} />
          </div>
          <div style={styles.progressLabel}>
            <span style={{ color: '#888', fontSize: '12px' }}>{loyaltyPoints % 100} / 100 points</span>
            <span style={{ color: '#4f46e5', fontSize: '12px', fontWeight: '600' }}>
              {pointsToNextReward} points to next ₹20 reward!
            </span>
          </div>
          {rewards > 0 && (
            <div style={styles.rewardAlert}>
              🎉 You have {rewards} reward{rewards > 1 ? 's' : ''} worth ₹{rewards * 20} to use!
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={styles.tabRow}>
          {['profile', 'coupons', 'orders'].map(tab => (
            <button
              key={tab}
              style={activeTab === tab ? styles.tabActive : styles.tabInactive}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Account Details</h3>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Full Name</span>
              <span style={styles.detailValue}>{user.name}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Email</span>
              <span style={styles.detailValue}>{user.email}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Role</span>
              <span style={styles.detailValue}>{user.role}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Member since</span>
              <span style={styles.detailValue}>March 2026</span>
            </div>
          </div>
        )}

        {/* Coupons tab */}
        {activeTab === 'coupons' && (
          <div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Enter Coupon Code</h3>
              <div style={styles.couponRow}>
                <input
                  style={styles.couponInput}
                  placeholder="e.g. WELCOME20"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleCoupon()}
                />
                <button style={styles.applyBtn} onClick={handleCoupon}>Apply</button>
              </div>
              {couponMsg && (
                <div style={{
                  ...styles.couponMsg,
                  backgroundColor: couponMsg.type === 'success' ? '#d1fae5' : '#fee2e2',
                  color: couponMsg.type === 'success' ? '#059669' : '#dc2626',
                }}>
                  {couponMsg.text}
                </div>
              )}

              <div style={styles.hintText}>Try: WELCOME20 · CAMPUS50 · FACULTY10 · NEWUSER30</div>
            </div>

            {savedCoupons.length > 0 && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Your Saved Coupons</h3>
                {savedCoupons.map(c => (
                  <div key={c.code} style={styles.couponCard}>
                    <div style={styles.couponLeft}>
                      <div style={styles.couponCode}>{c.code}</div>
                      <div style={styles.couponDesc}>{c.description}</div>
                    </div>
                    <div style={styles.couponRight}>
                      <div style={styles.couponDiscount}>
                        {c.type === 'percent' ? `${c.discount}% OFF` : `₹${c.discount} OFF`}
                      </div>
                      <button style={styles.removeBtn} onClick={() => removeCoupon(c.code)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders tab */}
        {activeTab === 'orders' && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Recent Orders</h3>
            {orders.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No orders yet</p>
            ) : (
              orders.slice(0, 5).map((order, i) => (
                <div key={order._id} style={styles.orderRow}>
                  <div>
                    <div style={styles.orderTitle}>Order #{orders.length - i}</div>
                    <div style={styles.orderItems}>{order.items.map(item => item.name).join(', ')}</div>
                    <div style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                  <div style={styles.orderAmount}>₹{order.totalAmount}</div>
                </div>
              ))
            )}
            {orders.length > 5 && (
              <button style={styles.viewAllBtn} onClick={() => navigate('/orders')}>
                View All Orders →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f0f4f8', paddingBottom: '40px' },
  navbar: { background: 'rgba(79,70,229,0.9)', backdropFilter: 'blur(12px)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 },
  backBtn: { background: 'none', border: 'none', color: 'white', fontSize: '15px', cursor: 'pointer' },
  navTitle: { color: 'white', fontSize: '20px', fontWeight: 'bold' },
  logoutBtn: { backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px' },
  content: { padding: '24px', maxWidth: '700px', margin: '0 auto' },
  heroCard: { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '20px', padding: '28px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', boxShadow: '0 8px 32px rgba(79,70,229,0.3)' },
  avatar: { width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: 'white', flexShrink: 0, border: '3px solid rgba(255,255,255,0.4)' },
  heroInfo: { flex: 1 },
  nameRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' },
  heroName: { color: 'white', fontSize: '22px', fontWeight: '700', margin: 0 },
  editBtn: { backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '6px', padding: '4px 12px', cursor: 'pointer', fontSize: '12px' },
  editRow: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' },
  editInput: { padding: '8px 12px', borderRadius: '8px', border: 'none', fontSize: '14px', outline: 'none', flex: 1 },
  saveBtn: { backgroundColor: 'white', color: '#4f46e5', border: 'none', borderRadius: '6px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  cancelBtn: { backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '6px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px' },
  heroEmail: { color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px' },
  roleBadge: { display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  statsRow: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
  loyaltyCard: { backgroundColor: 'white', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  loyaltyHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' },
  loyaltyTitle: { fontWeight: '700', fontSize: '16px', color: '#1a1a2e', marginBottom: '4px' },
  loyaltySubtitle: { fontSize: '12px', color: '#888' },
  loyaltyPoints: { fontSize: '24px', fontWeight: '800', color: '#d97706' },
  progressBg: { backgroundColor: '#f3f4f6', borderRadius: '20px', height: '10px', marginBottom: '8px', overflow: 'hidden' },
  progressFill: { backgroundColor: '#4f46e5', height: '100%', borderRadius: '20px', transition: 'width 0.5s ease' },
  progressLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  rewardAlert: { backgroundColor: '#fef3c7', color: '#d97706', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '500' },
  tabRow: { display: 'flex', gap: '8px', marginBottom: '16px' },
  tabActive: { padding: '9px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  tabInactive: { padding: '9px 24px', backgroundColor: 'white', color: '#555', border: '1.5px solid #ddd', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' },
  card: { backgroundColor: 'white', borderRadius: '16px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', marginBottom: '16px', margin: '0 0 16px' },
  detailRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f3f4f6' },
  detailLabel: { color: '#888', fontSize: '14px' },
  detailValue: { color: '#1a1a2e', fontSize: '14px', fontWeight: '500' },
  couponRow: { display: 'flex', gap: '10px', marginBottom: '10px' },
  couponInput: { flex: 1, padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #ddd', fontSize: '15px', outline: 'none', letterSpacing: '1px', fontWeight: '600' },
  applyBtn: { backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 20px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  couponMsg: { padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', marginBottom: '10px' },
  hintText: { color: '#aaa', fontSize: '12px', marginTop: '8px' },
  couponCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: '#f8f7ff', borderRadius: '12px', marginBottom: '10px', border: '1.5px dashed #c7d2fe' },
  couponLeft: { flex: 1 },
  couponCode: { fontWeight: '700', fontSize: '15px', color: '#4f46e5', letterSpacing: '1px' },
  couponDesc: { fontSize: '12px', color: '#888', marginTop: '2px' },
  couponRight: { textAlign: 'right' },
  couponDiscount: { fontWeight: '800', fontSize: '16px', color: '#059669', marginBottom: '4px' },
  removeBtn: { backgroundColor: 'transparent', color: '#dc2626', border: 'none', cursor: 'pointer', fontSize: '12px' },
  orderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6' },
  orderTitle: { fontWeight: '600', fontSize: '14px', color: '#1a1a2e' },
  orderItems: { fontSize: '12px', color: '#888', marginTop: '2px', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  orderDate: { fontSize: '11px', color: '#aaa', marginTop: '2px' },
  orderAmount: { fontWeight: '700', color: '#4f46e5', fontSize: '15px' },
  viewAllBtn: { width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#4f46e5', border: '1.5px solid #4f46e5', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', marginTop: '12px' },
}

export default Profile