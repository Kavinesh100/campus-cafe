import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <video
        autoPlay
        muted
        loop
        playsInline
        style={styles.video}
      >
        <source src="/cafe.mp4" type="video/mp4" />
      </video>

      <div style={styles.overlay} />

      <div style={styles.content}>
        <div style={styles.logoRow}>
          <svg width="56" height="56" viewBox="0 0 100 100">
            <rect width="100" height="100" rx="20" fill="white" opacity="0.15"/>
            <path d="M30 45 L38 80 L62 80 L70 45 Z" fill="white"/>
            <rect x="26" y="40" width="48" height="8" rx="4" fill="white"/>
            <ellipse cx="50" cy="81" rx="26" ry="5" fill="white" opacity="0.8"/>
            <path d="M70 52 Q82 52 82 62 Q82 72 70 72" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"/>
            <path d="M38 35 Q40 28 38 21" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
            <path d="M50 32 Q52 24 50 16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
            <path d="M62 35 Q64 28 62 21" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
          </svg>
        </div>

        <div style={styles.tag}>Welcome to</div>
        <h1 style={styles.title}>Campus Cafe</h1>
        <p style={styles.subtitle}>
          Fresh food. Fast orders. Made for your campus.
        </p>

        <div style={styles.divider} />

        <div style={styles.btnGroup}>
          <button style={styles.primaryBtn} onClick={() => navigate('/login')}>
            Order Now
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate('/signup')}>
            Create Account
          </button>
        </div>

        <p style={styles.bottomText}>
          Trusted by students and faculty across campus
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center center',
    zIndex: 0,
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(10,8,30,0.55) 0%, rgba(30,20,60,0.45) 50%, rgba(10,8,30,0.55) 100%)',
    zIndex: 1,
  },
  content: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    padding: '40px 24px',
    maxWidth: '560px',
    width: '100%',
  },
  logoRow: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  tag: {
    color: '#a5b4fc',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  title: {
    fontSize: '64px',
    fontWeight: '800',
    color: 'white',
    margin: '0 0 16px',
    lineHeight: '1.1',
    letterSpacing: '-1px',
    textShadow: '0 2px 20px rgba(0,0,0,0.4)',
  },
  subtitle: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: '1.7',
    marginBottom: '0',
    fontWeight: '300',
    letterSpacing: '0.3px',
  },
  divider: {
    width: '48px',
    height: '2px',
    backgroundColor: '#4f46e5',
    margin: '32px auto',
    borderRadius: '2px',
  },
  btnGroup: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '32px',
  },
  primaryBtn: {
    padding: '16px 40px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    letterSpacing: '0.5px',
  },
  secondaryBtn: {
    padding: '16px 40px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '1.5px solid rgba(255,255,255,0.4)',
    borderRadius: '50px',
    fontSize: '16px',
    fontWeight: '400',
    cursor: 'pointer',
    letterSpacing: '0.5px',
  },
  bottomText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: '13px',
    letterSpacing: '0.5px',
  },
}

export default Landing