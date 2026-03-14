import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    fetch('http://localhost:5000/api/orders/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const statusColor = {
    pending: '#f59e0b',
    preparing: '#3b82f6',
    ready: '#10b981',
    delivered: '#6b7280'
  }

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <button style={styles.backBtn} onClick={() => navigate('/menu')}>← Menu</button>
        <h1 style={styles.navTitle}>My Orders</h1>
        <span style={styles.navRight}>Hi, {user?.name}</span>
      </div>

      <div style={styles.content}>
        {loading ? (
          <p style={styles.loadingText}>Loading your orders...</p>
        ) : orders.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyEmoji}>🍽️</div>
            <p style={styles.emptyText}>No orders yet</p>
            <button style={styles.orderBtn} onClick={() => navigate('/menu')}>
              Order Food Now
            </button>
          </div>
        ) : (
          orders.map((order, index) => (
            <div key={order._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.orderNum}>Order #{orders.length - index}</div>
                  <div style={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
                <div style={{
                  ...styles.statusBadge,
                  backgroundColor: statusColor[order.status] + '20',
                  color: statusColor[order.status]
                }}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              <div style={styles.itemsList}>
                {order.items.map((item, i) => (
                  <div key={i} style={styles.itemRow}>
                    <span style={styles.itemName}>{item.name} × {item.qty}</span>
                    <span style={styles.itemPrice}>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div style={styles.cardFooter}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalAmount}>₹{order.totalAmount}</span>
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
  navbar: { backgroundColor: '#4f46e5', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { background: 'none', border: 'none', color: 'white', fontSize: '15px', cursor: 'pointer' },
  navTitle: { color: 'white', fontSize: '20px', fontWeight: 'bold' },
  navRight: { color: '#c7d2fe', fontSize: '14px' },
  content: { padding: '24px', maxWidth: '600px', margin: '0 auto' },
  loadingText: { textAlign: 'center', color: '#888', marginTop: '60px' },
  empty: { textAlign: 'center', padding: '60px 0' },
  emptyEmoji: { fontSize: '64px', marginBottom: '16px' },
  emptyText: { color: '#888', fontSize: '16px', marginBottom: '20px' },
  orderBtn: { backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 28px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  orderNum: { fontWeight: '700', fontSize: '16px', color: '#1a1a2e' },
  orderDate: { fontSize: '12px', color: '#888', marginTop: '4px' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  itemsList: { borderTop: '1px solid #f3f4f6', paddingTop: '12px', marginBottom: '12px' },
  itemRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  itemName: { fontSize: '14px', color: '#444' },
  itemPrice: { fontSize: '14px', color: '#444', fontWeight: '500' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f3f4f6', paddingTop: '12px' },
  totalLabel: { fontWeight: '700', color: '#1a1a2e' },
  totalAmount: { fontWeight: '700', color: '#4f46e5', fontSize: '17px' },
}

export default Orders