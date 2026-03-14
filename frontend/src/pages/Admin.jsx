import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const STATUS_ORDER = ['pending', 'preparing', 'ready', 'delivered']

const statusColor = {
  pending: { bg: '#fef3c7', text: '#d97706' },
  preparing: { bg: '#dbeafe', text: '#2563eb' },
  ready: { bg: '#d1fae5', text: '#059669' },
  delivered: { bg: '#f3f4f6', text: '#6b7280' },
}

function Admin() {
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    fetchOrders()
    fetchStats()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setOrders(data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setStats(data)
    } catch (err) {}
  }

  const updateStatus = async (orderId, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      setOrders(orders.map(o =>
        o._id === orderId ? { ...o, status: newStatus } : o
      ))
      fetchStats()
    } catch (err) {}
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>Admin Dashboard</h1>
        <div style={styles.navRight}>
          <span style={styles.navName}>Cafe Admin</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Stats cards */}
        {stats && (
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{stats.totalOrders}</div>
              <div style={styles.statLabel}>Total Orders</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statNumber, color: '#d97706' }}>{stats.pendingOrders}</div>
              <div style={styles.statLabel}>Pending</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statNumber, color: '#059669' }}>₹{stats.totalRevenue}</div>
              <div style={styles.statLabel}>Total Revenue</div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statNumber, color: '#7c3aed' }}>{stats.totalUsers}</div>
              <div style={styles.statLabel}>Total Users</div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div style={styles.filterRow}>
          {['all', 'pending', 'preparing', 'ready', 'delivered'].map(f => (
            <button
              key={f}
              style={filter === f ? styles.filterActive : styles.filterInactive}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {loading ? (
          <p style={styles.loadingText}>Loading orders...</p>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>No {filter === 'all' ? '' : filter} orders</p>
          </div>
        ) : (
          filtered.map((order, index) => (
            <div key={order._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.orderNum}>Order #{orders.length - orders.indexOf(order)}</div>
                  <div style={styles.customerName}>
                    {order.user?.name || 'Unknown'} — {order.user?.email}
                  </div>
                  <div style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
                <div style={{
                  ...styles.statusBadge,
                  backgroundColor: statusColor[order.status].bg,
                  color: statusColor[order.status].text
                }}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              {/* Items */}
              <div style={styles.itemsList}>
                {order.items.map((item, i) => (
                  <div key={i} style={styles.itemRow}>
                    <span>{item.name} × {item.qty}</span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div style={styles.cardFooter}>
                <span style={styles.totalAmount}>Total: ₹{order.totalAmount}</span>

                {/* Status update buttons */}
                <div style={styles.statusBtns}>
                  {STATUS_ORDER.map(s => (
                    <button
                      key={s}
                      style={order.status === s ? styles.statusBtnActive : styles.statusBtnInactive}
                      onClick={() => updateStatus(order._id, s)}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f0f4f8' },
  navbar: { backgroundColor: '#1a1a2e', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navTitle: { color: 'white', fontSize: '20px', fontWeight: 'bold' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  navName: { color: '#a5b4fc', fontSize: '14px' },
  logoutBtn: { backgroundColor: 'transparent', color: 'white', border: '1px solid #444', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px' },
  content: { padding: '24px', maxWidth: '800px', margin: '0 auto' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  statNumber: { fontSize: '28px', fontWeight: 'bold', color: '#4f46e5', marginBottom: '4px' },
  statLabel: { fontSize: '13px', color: '#888' },
  filterRow: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  filterActive: { padding: '7px 16px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  filterInactive: { padding: '7px 16px', backgroundColor: 'white', color: '#555', border: '1.5px solid #ddd', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' },
  loadingText: { textAlign: 'center', color: '#888', marginTop: '40px' },
  empty: { textAlign: 'center', padding: '40px' },
  emptyText: { color: '#888', fontSize: '16px' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  orderNum: { fontWeight: '700', fontSize: '16px', color: '#1a1a2e' },
  customerName: { fontSize: '13px', color: '#4f46e5', marginTop: '3px', fontWeight: '500' },
  orderDate: { fontSize: '12px', color: '#888', marginTop: '2px' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  itemsList: { borderTop: '1px solid #f3f4f6', paddingTop: '12px', marginBottom: '12px' },
  itemRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#444', marginBottom: '6px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '12px', flexWrap: 'wrap', gap: '12px' },
  totalAmount: { fontWeight: '700', color: '#1a1a2e', fontSize: '15px' },
  statusBtns: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  statusBtnActive: { padding: '5px 12px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
  statusBtnInactive: { padding: '5px 12px', backgroundColor: '#f3f4f6', color: '#555', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
}

export default Admin