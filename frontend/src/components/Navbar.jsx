import { useContext } from 'react'
import { Button, Chip } from '@heroui/react'
import { AppContext } from '../App'

function Navbar() {
  const { user, setShowLogin, setShowUploadModal, logout } = useContext(AppContext)

  return (
    <nav className="navbar">
      <span className="navbar__brand">Photos API</span>
      <div className="navbar__actions">
        {user ? (
          <>
            <Button variant="primary" onPress={() => setShowUploadModal(true)}>
              Ajouter une photo
            </Button>
            <Chip variant="flat" size="sm">{user}</Chip>
            <Button variant="outline" onPress={logout}>
              Déconnexion
            </Button>
          </>
        ) : (
          <Button variant="primary" onPress={() => setShowLogin(true)}>
            Se connecter
          </Button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
