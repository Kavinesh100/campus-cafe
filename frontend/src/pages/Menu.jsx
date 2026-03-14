import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const menuItems = [
  { id: 1, name: 'Masala Dosa', price: 40, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&q=80' },
  { id: 2, name: 'Idli Sambar', price: 30, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&q=80' },
  { id: 3, name: 'Veg Fried Rice', price: 60, category: 'Lunch', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&q=80' },
  { id: 4, name: 'Chapati + Curry', price: 50, category: 'Lunch', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&q=80' },
  { id: 5, name: 'Chicken Biryani', price: 90, category: 'Lunch', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80' },
  { id: 6, name: 'Veg Noodles', price: 55, category: 'Lunch', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&q=80' },
  { id: 7, name: 'Samosa', price: 15, category: 'Snacks', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&q=80' },
  { id: 8, name: 'Tea', price: 10, category: 'Drinks', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80' },
  { id: 9, name: 'Coffee', price: 15, category: 'Drinks', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=80' },
  { id: 10, name: 'Fresh Lime Soda', price: 25, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&q=80' },
]

function Menu() {
  const [cart, setCart] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))
  const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Drinks']

  const filtered = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory)

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id)
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
    } else {
      setCart([...cart, { ...item, qty: 1 }])
    }
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
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>Campus Cafe</h1>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Hi, {user?.name || 'Guest'}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.categories}>
          {categories.map(cat => (
            <button
              key={cat}
              style={activeCategory === cat ? styles.catActive : styles.catInactive}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={styles.grid}>
          {filtered.map(item => {
            const cartItem = cart.find(c => c.id === item.id)
            return (
              <div key={item.id} style={styles.card}>
                <img src={item.image} alt={item.name} style={styles.cardImage} />
                <div style={styles.cardBody}>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemCategory}>{item.category}</div>
                  <div style={styles.cardFooter}>
                    <div style={styles.itemPrice}>₹{item.price}</div>
                    {cartItem ? (
                      <div style={styles.qtyRow}>
                        <button style={styles.qtyBtn} onClick={() => removeFromCart(item)}>−</button>
                        <span style={styles.qtyNum}>{cartItem.qty}</span>
                        <button style={styles.qtyBtn} onClick={() => addToCart(item)}>+</button>
                      </div>
                    ) : (
                      <button style={styles.addBtn} onClick={() => addToCart(item)}>Add</button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {totalItems > 0 && (
        <div style={styles.cartBar}>
          <span style={styles.cartText}>{totalItems} item{totalItems > 1 ? 's' : ''} in cart</span>
          <span style={styles.cartPrice}>₹{totalPrice}</span>
          <button style={styles.cartBtn} onClick={() => navigate('/cart', { state: { cart } })}>
            View Cart →
          </button>
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f0f4f8', paddingBottom: '80px' },
  navbar: { backgroundColor: '#4f46e5', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navTitle: { color: 'white', fontSize: '22px', fontWeight: 'bold' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  welcome: { color: '#c7d2fe', fontSize: '14px' },
  logoutBtn: { backgroundColor: 'transparent', color: 'white', border: '1px solid #818cf8', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px' },
  content: { padding: '24px' },
  categories: { display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' },
  catActive: { padding: '8px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  catInactive: { padding: '8px 20px', backgroundColor: 'white', color: '#555', border: '1.5px solid #ddd', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
  card: { backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  cardImage: { width: '100%', height: '140px', objectFit: 'cover' },
  cardBody: { padding: '14px' },
  itemName: { fontWeight: '600', fontSize: '15px', color: '#1a1a2e', marginBottom: '4px' },
  itemCategory: { fontSize: '12px', color: '#888', marginBottom: '8px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  itemPrice: { fontSize: '16px', fontWeight: 'bold', color: '#4f46e5' },
  addBtn: { backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '7px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  qtyBtn: { backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  qtyNum: { fontWeight: 'bold', fontSize: '15px', minWidth: '20px', textAlign: 'center' },
  cartBar: { position: 'fixed', bottom: '0', left: '0', right: '0', backgroundColor: '#1a1a2e', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  cartText: { color: 'white', fontSize: '14px' },
  cartPrice: { color: '#a5b4fc', fontWeight: 'bold', fontSize: '16px' },
  cartBtn: { backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
}

export default Menu