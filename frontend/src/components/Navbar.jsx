import { useContext } from 'react'
import { AppContext } from '../App'

function Navbar() {
  const { user, setShowLogin, logout } = useContext(AppContext)

  return (
    <nav className="navbar">
      <div className="navbar-brand">Photos API</div>
      <div className="navbar-actions">
        {user ? (
          <>
            <span className="navbar-user">{user}</span>
            <button type="button" className="btn btn-outline" onClick={logout}>
              Déconnexion
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => setShowLogin(true)}>
            Se connecter
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
