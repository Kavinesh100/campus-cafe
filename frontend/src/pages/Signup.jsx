import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message)
        setLoading(false)
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/menu')

    } catch (err) {
      setError('Something went wrong. Is the backend running?')
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <svg width="64" height="64" viewBox="0 0 100 100">
            <rect width="100" height="100" rx="20" fill="#4f46e5"/>
            <path d="M30 45 L38 80 L62 80 L70 45 Z" fill="white"/>
            <rect x="26" y="40" width="48" height="8" rx="4" fill="white"/>
            <ellipse cx="50" cy="81" rx="26" ry="5" fill="white" opacity="0.8"/>
            <path d="M70 52 Q82 52 82 62 Q82 72 70 72" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <path d="M38 35 Q40 28 38 21" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
            <path d="M50 32 Q52 24 50 16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
            <path d="M62 35 Q64 28 62 21" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
          </svg>
        </div>

        <h1 style={styles.title}>Campus Cafe</h1>
        <p style={styles.subtitle}>Create your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSignup}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} type="text" placeholder="Your full name"
              value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="you@college.edu"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" placeholder="Create a password"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>I am a</label>
            <div style={styles.roleContainer}>
              <button type="button"
                style={role === 'student' ? styles.roleActive : styles.roleInactive}
                onClick={() => setRole('student')}>Student</button>
              <button type="button"
                style={role === 'faculty' ? styles.roleActive : styles.roleInactive}
                onClick={() => setRole('faculty')}>Faculty</button>
            </div>
          </div>
          <button style={loading ? styles.buttonDisabled : styles.button}
            type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <span style={styles.link} onClick={() => navigate('/login')}>Sign in</span>
        </p>
        <p style={styles.switchText}>
          <span style={styles.link} onClick={() => navigate('/')}>← Back to home</span>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f4f8' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', textAlign: 'center', marginBottom: '6px' },
  subtitle: { color: '#666', textAlign: 'center', marginBottom: '28px', fontSize: '14px' },
  error: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' },
  inputGroup: { marginBottom: '18px' },
  label: { display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px', fontWeight: '500' },
  input: { width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '15px', outline: 'none' },
  roleContainer: { display: 'flex', gap: '12px' },
  roleActive: { flex: 1, padding: '10px', backgroundColor: '#4f46e5', color: 'white', border: '1.5px solid #4f46e5', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  roleInactive: { flex: 1, padding: '10px', backgroundColor: 'white', color: '#555', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  button: { width: '100%', padding: '13px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' },
  buttonDisabled: { width: '100%', padding: '13px', backgroundColor: '#a5b4fc', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'not-allowed', marginTop: '8px' },
  switchText: { textAlign: 'center', marginTop: '12px', color: '#666', fontSize: '14px' },
  link: { color: '#4f46e5', cursor: 'pointer', fontWeight: '500' },
}

export default Signup