import { useState, useContext } from 'react'
import { AppContext } from '../App'

const API_BASE = 'http://localhost:3000'

function LoginForm() {
  const { setUser, setShowLogin } = useContext(AppContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    fetch(`${API_BASE}/users/sign_in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { email, password } }),
    })
      .then((res) => {
        const token = res.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text || 'Email ou mot de passe incorrect.')
          })
        }
        if (token) {
          localStorage.setItem('jwt', token)
          localStorage.setItem('user_email', email)
          setUser(email)
          setShowLogin(false)
        } else {
          throw new Error('Token non reçu.')
        }
      })
      .catch((err) => setError(err.message || 'Erreur de connexion'))
      .finally(() => setLoading(false))
  }

  return (
    <div className="login-overlay" onClick={() => setShowLogin(false)}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user1@example.com"
            required
          />
          <label htmlFor="login-password">Mot de passe</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          {error && <p className="login-error">{error}</p>}
          <div className="login-buttons">
            <button type="button" className="btn btn-outline" onClick={() => setShowLogin(false)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
