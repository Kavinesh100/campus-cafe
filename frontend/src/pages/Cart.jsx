import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Confetti() {
  const pieces = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    color: ['#4f46e5', '#a5b4fc', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#ffffff'][Math.floor(Math.random() * 7)],
    size: Math.random() * 8 + 6,
  }))

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999 }}>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.left}%`,
          top: '-20px',
          width: `${p.size}px`,
          height: `${p.size}px`,
          backgroundColor: p.color,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          animation: `confettiFall 2.5s ease-in ${p.delay}s forwards`,
        }} />
      ))}
    </div>
  )
}

function Cart() {
  const location = useLocation()
  const navigate = useNavigate()
  const [cart, setCart] = useState(location.state?.cart || [])
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')

  const addOne = (item) => {
    setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
  }

  const removeOne = (item) => {
    if (item.qty === 1) {
      setCart(cart.filter(c => c.id !== item.id))
    } else {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty - 1 } : c))
    }
  }

  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.qty, 0)
  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0)

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map(c => ({
            name: c.name,
            price: c.price,
            qty: c.qty
          })),
          totalAmount: totalPrice
        })
      })

      if (response.ok) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 4000)
        setOrderPlaced(true)
      } else {
        alert('Failed to place order. Try again.')
      }
    } catch (err) {
      alert('Something went wrong.')
    }
    setLoading(false)
  }

  if (orderPlaced) {
    return (
      <div style={styles.successPage}>
        {showConfetti && <Confetti />}
        <div style={styles.successCard}>
          <div style={styles.checkmark}>✓</div>
          <h2 style={styles.successTitle}>Order Placed!</h2>
          <p style={styles.successText}>
            Your order of ₹{totalPrice} has been placed successfully.
            It will be ready soon!
          </p>
          <button style={styles.backBtn} onClick={() => navigate('/menu')}>
            Order More Food
          </button>
          <button style={styles.historyBtn} onClick={() => navigate('/orders')}>
            View My Orders
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      {showConfetti && <Confetti />}

      {/* Navbar */}
      <div style={styles.navbar}>
        <button style={styles.backArrow} onClick={() => navigate('/menu')}>← Menu</button>
        <h1 style={styles.navTitle}>Your Cart</h1>
        <span style={styles.navRight}>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
      </div>

      <div style={styles.content}>
        {cart.length === 0 ? (
          <div style={styles.emptyCart}>
            <div style={styles.emptyEmoji}>🛒</div>
            <p style={styles.emptyText}>Your cart is empty</p>
            <button style={styles.browseBtn} onClick={() => navigate('/menu')}>
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div style={styles.itemsList}>
              {cart.map(item => (
                <div key={item.id} style={styles.cartItem}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={styles.cartImage}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                  <div style={styles.itemInfo}>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={styles.itemPrice}>₹{item.price} each</div>
                  </div>
                  <div style={styles.qtyRow}>
                    <button style={styles.qtyBtn} onClick={() => removeOne(item)}>−</button>
                    <span style={styles.qtyNum}>{item.qty}</span>
                    <button style={styles.qtyBtn} onClick={() => addOne(item)}>+</button>
                  </div>
                  <div style={styles.itemTotal}>₹{item.price * item.qty}</div>
                </div>
              ))}
            </div>

            <div style={styles.bill}>
              <h3 style={styles.billTitle}>Bill Summary</h3>
              {cart.map(item => (
                <div key={item.id} style={styles.billRow}>
                  <span>{item.name} × {item.qty}</span>
                  <span>₹{item.price * item.qty}</span>
                </div>
              ))}
              <div style={styles.billDivider} />
              <div style={styles.billTotal}>
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <button
              style={loading ? styles.orderBtnDisabled : styles.orderBtn}
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : `Place Order · ₹${totalPrice}`}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f0f4f8' },
  navbar: { backgroundColor: '#4f46e5', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  backArrow: { background: 'none', border: 'none', color: 'white', fontSize: '15px', cursor: 'pointer' },
  navTitle: { color: 'white', fontSize: '20px', fontWeight: 'bold' },
  navRight: { color: '#c7d2fe', fontSize: '14px' },
  content: { padding: '24px', maxWidth: '600px', margin: '0 auto' },
  emptyCart: { textAlign: 'center', padding: '60px 0' },
  emptyEmoji: { fontSize: '64px', marginBottom: '16px' },
  emptyText: { color: '#888', fontSize: '16px', marginBottom: '20px' },
  browseBtn: { backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 28px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' },
  itemsList: { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  cartItem: { display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #f3f4f6', gap: '12px' },
  cartImage: { width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover' },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: '600', fontSize: '15px', color: '#1a1a2e' },
  itemPrice: { fontSize: '12px', color: '#888', marginTop: '2px' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  qtyBtn: { backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  qtyNum: { fontWeight: 'bold', fontSize: '15px', minWidth: '20px', textAlign: 'center' },
  itemTotal: { fontWeight: 'bold', color: '#4f46e5', fontSize: '15px', minWidth: '50px', textAlign: 'right' },
  bill: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  billTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '14px', color: '#1a1a2e' },
  billRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#555', marginBottom: '8px' },
  billDivider: { borderTop: '1px solid #eee', margin: '12px 0' },
  billTotal: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '17px', color: '#1a1a2e' },
  orderBtn: { width: '100%', padding: '16px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '12px', fontSize: '17px', fontWeight: '700', cursor: 'pointer' },
  orderBtnDisabled: { width: '100%', padding: '16px', backgroundColor: '#a5b4fc', color: 'white', border: 'none', borderRadius: '12px', fontSize: '17px', fontWeight: '700', cursor: 'not-allowed' },
  successPage: { minHeight: '100vh', backgroundColor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  successCard: { backgroundColor: 'white', borderRadius: '16px', padding: '48px 40px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '380px', width: '100%' },
  checkmark: { width: '64px', height: '64px', backgroundColor: '#4f46e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: 'white', margin: '0 auto 20px' },
  successTitle: { fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '12px' },
  successText: { color: '#666', fontSize: '15px', lineHeight: '1.6', marginBottom: '28px' },
  backBtn: { width: '100%', padding: '13px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginBottom: '12px' },
  historyBtn: { width: '100%', padding: '13px', backgroundColor: 'white', color: '#4f46e5', border: '1.5px solid #4f46e5', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
}

export default Cart