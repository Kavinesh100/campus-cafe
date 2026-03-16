import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const menuItems = [
  { id: 1, name: 'Masala Dosa', price: 40, category: 'Breakfast', prepTime: '10 mins', popular: true, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&q=80' },
  { id: 2, name: 'Idli Sambar', price: 30, category: 'Breakfast', prepTime: '8 mins', popular: false, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&q=80' },
  { id: 3, name: 'Veg Fried Rice', price: 60, category: 'Lunch', prepTime: '15 mins', popular: true, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&q=80' },
  { id: 4, name: 'Chapati + Curry', price: 50, category: 'Lunch', prepTime: '12 mins', popular: false, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&q=80' },
  { id: 5, name: 'Chicken Biryani', price: 90, category: 'Lunch', prepTime: '20 mins', popular: true, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80' },
  { id: 6, name: 'Veg Noodles', price: 55, category: 'Lunch', prepTime: '12 mins', popular: false, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&q=80' },
  { id: 7, name: 'Samosa', price: 15, category: 'Snacks', prepTime: '5 mins', popular: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&q=80' },
  { id: 8, name: 'Tea', price: 10, category: 'Drinks', prepTime: '3 mins', popular: false, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80' },
  { id: 9, name: 'Coffee', price: 15, category: 'Drinks', prepTime: '4 mins', popular: true, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=80' },
  { id: 10, name: 'Fresh Lime Soda', price: 25, category: 'Drinks', prepTime: '3 mins', popular: false, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&q=80' },
]

const CafeLogo = () => (
  <svg width="36" height="36" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="20" fill="white" opacity="0.2"/>
    <path d="M30 45 L38 80 L62 80 L70 45 Z" fill="white"/>
    <rect x="26" y="40" width="48" height="8" rx="4" fill="white"/>
    <ellipse cx="50" cy="81" rx="26" ry="5" fill="white" opacity="0.8"/>
    <path d="M70 52 Q82 52 82 62 Q82 72 70 72" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"/>
    <path d="M38 35 Q40 28 38 21" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
    <path d="M50 32 Q52 24 50 16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
    <path d="M62 35 Q64 28 62 21" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
  </svg>
)

function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    color: ['#4f46e5', '#a5b4fc', '#f59e0b', '#10b981', '#ef4444', '#ec4899'][Math.floor(Math.random() * 6)],
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

function Toast({ message, visible }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '90px',
      right: '24px',
      backgroundColor: '#1a1a2e',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: 998,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.3s ease',
      pointerEvents: 'none',
    }}>
      <span style={{ fontSize: '16px' }}>🛒</span>
      {message}
    </div>
  )
}

function FoodCard({ item, cartItem, onAdd, onRemove, index, darkMode }) {
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 80)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <div
      style={{
        backgroundColor: darkMode ? '#1e1b4b' : 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transform: visible
          ? hovered ? 'scale(1.04) translateY(-4px)' : 'scale(1) translateY(0)'
          : 'scale(0.9) translateY(20px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.4s ease',
        boxShadow: hovered
          ? '0 12px 32px rgba(79,70,229,0.25)'
          : darkMode ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.08)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'relative' }}>
        <img src={item.image} alt={item.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
        {item.popular && (
          <div style={{
            position: 'absolute', top: '10px', left: '10px',
            backgroundColor: '#4f46e5', color: 'white',
            fontSize: '11px', fontWeight: '700',
            padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.5px'
          }}>Popular</div>
        )}
      </div>
      <div style={{ padding: '14px' }}>
        <div style={{ fontWeight: '600', fontSize: '15px', color: darkMode ? 'white' : '#1a1a2e', marginBottom: '4px' }}>
          {item.name}
        </div>
        <div style={{ fontSize: '12px', color: darkMode ? '#a5b4fc' : '#888', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ⏱ Ready in {item.prepTime}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4f46e5' }}>₹{item.price}</div>
          {cartItem ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button style={styles.qtyBtn} onClick={() => onRemove(item)}>−</button>
              <span style={{ fontWeight: 'bold', fontSize: '15px', minWidth: '20px', textAlign: 'center', color: darkMode ? 'white' : '#1a1a2e' }}>{cartItem.qty}</span>
              <button style={styles.qtyBtn} onClick={() => onAdd(item)}>+</button>
            </div>
          ) : (
            <button style={styles.addBtn} onClick={() => onAdd(item)}>Add</button>
          )}
        </div>
      </div>
    </div>
  )
}

function Menu() {
  const [cart, setCart] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [darkMode, setDarkMode] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '' })
  const [showConfetti, setShowConfetti] = useState(false)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))
  const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Drinks']

  const filtered = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory)

  const showToast = (message) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 2500)
  }

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id)
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
    } else {
      setCart([...cart, { ...item, qty: 1 }])
    }
    showToast(`${item.name} added to cart!`)
  }

  const removeFromCart = (item) => {
    const existing = cart.find(c => c.id === item.id)
    if (existing.qty === 1) {
      setCart(cart.filter(c => c.id !== item.id))
    } else {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty - 1 } : c))
    }
  }

  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0)
  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.qty, 0)

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div style={{ ...styles.page, backgroundColor: darkMode ? '#0f0e2a' : '#f0f4f8' }}>

      {showConfetti && <Confetti />}
      <Toast message={toast.message} visible={toast.visible} />

      {/* Glassmorphism Navbar */}
      <div style={{
        ...styles.navbar,
        background: darkMode
          ? 'rgba(30, 27, 75, 0.85)'
          : 'rgba(79, 70, 229, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={styles.navLeft}>
          <CafeLogo />
          <h1 style={styles.navTitle}>Campus Cafe</h1>
        </div>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Hi, {user?.name || 'Guest'}</span>
          <button
            style={{
              ...styles.darkToggle,
              backgroundColor: darkMode ? '#4f46e5' : 'transparent',
            }}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button style={styles.ordersBtn} onClick={() => navigate('/orders')}>My Orders</button>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Video Banner */}
      <div style={styles.videoBanner}>
        <video autoPlay muted loop playsInline style={styles.bannerVideo}>
          <source src="/cafe.mp4" type="video/mp4" />
        </video>
        <div style={styles.bannerOverlay}>
          <h2 style={styles.bannerTitle}>Today's Fresh Menu</h2>
          <p style={styles.bannerSubtitle}>Made fresh every morning just for you</p>
        </div>
      </div>

      <div style={styles.content}>
        {/* Category filter */}
        <div style={styles.categories}>
          {categories.map(cat => (
            <button
              key={cat}
              style={activeCategory === cat ? styles.catActive : {
                ...styles.catInactive,
                backgroundColor: darkMode ? '#1e1b4b' : 'white',
                color: darkMode ? '#a5b4fc' : '#555',
                border: darkMode ? '1.5px solid #3730a3' : '1.5px solid #ddd',
              }}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <div style={styles.grid}>
          {filtered.map((item, index) => {
            const cartItem = cart.find(c => c.id === item.id)
            return (
              <FoodCard
                key={item.id}
                item={item}
                cartItem={cartItem}
                onAdd={addToCart}
                onRemove={removeFromCart}
                index={index}
                darkMode={darkMode}
              />
            )
          })}
        </div>
      </div>

      {/* Floating cart button */}
      {totalItems > 0 && (
        <div
          style={{
            ...styles.floatingCart,
            animation: 'slideUp 0.3s ease',
          }}
          onClick={() => navigate('/cart', { state: { cart } })}
        >
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            .floatingCartBtn:hover {
              transform: scale(1.03);
            }
          `}</style>
          <div style={styles.floatingCartInner}>
            <div style={styles.floatingCartLeft}>
              <span style={styles.floatingCartBadge}>{totalItems}</span>
              <span style={styles.floatingCartText}>View Cart</span>
            </div>
            <span style={styles.floatingCartPrice}>₹{totalPrice} →</span>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', paddingBottom: '100px' },
  navbar: { padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 },
  navLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  navTitle: { color: 'white', fontSize: '22px', fontWeight: 'bold', margin: 0 },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  welcome: { color: '#c7d2fe', fontSize: '14px' },
  darkToggle: { border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '16px', color: 'white', transition: 'all 0.2s' },
  ordersBtn: { backgroundColor: 'transparent', color: 'white', border: '1px solid #818cf8', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px' },
  logoutBtn: { backgroundColor: 'transparent', color: 'white', border: '1px solid #818cf8', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px' },
  videoBanner: { position: 'relative', width: '100%', height: '200px', overflow: 'hidden' },
  bannerVideo: { position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' },
  bannerOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,8,30,0.75) 0%, rgba(30,20,60,0.55) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '32px' },
  bannerTitle: { color: 'white', fontSize: '28px', fontWeight: '800', margin: '0 0 8px', letterSpacing: '-0.5px' },
  bannerSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: '15px', margin: 0 },
  content: { padding: '24px' },
  categories: { display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' },
  catActive: { padding: '8px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  catInactive: { padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
  addBtn: { backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '7px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  qtyBtn: { backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  floatingCart: { position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 200, cursor: 'pointer', width: '90%', maxWidth: '480px' },
  floatingCartInner: { backgroundColor: '#4f46e5', borderRadius: '16px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 32px rgba(79,70,229,0.5)' },
  floatingCartLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  floatingCartBadge: { backgroundColor: 'white', color: '#4f46e5', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' },
  floatingCartText: { color: 'white', fontWeight: '600', fontSize: '16px' },
  floatingCartPrice: { color: 'white', fontWeight: '700', fontSize: '16px' },
}

export default Menu