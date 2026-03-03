import { createContext, useState, useEffect, useCallback } from 'react'
import { Modal } from '@heroui/react'
import Navbar from './components/Navbar'
import LoginForm from './components/LoginForm'
import FileForm from './components/FileForm'
import LatestImage from './components/LatestImage'
import PhotoGrid from './components/PhotoGrid'
import './App.css'

export const AppContext = createContext(null)

function App() {
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [latestPost, setLatestPost] = useState(null)
  const [photosRefreshKey, setPhotosRefreshKey] = useState(0)

  const logout = useCallback(() => {
    const token = localStorage.getItem('jwt')
    if (token) {
      fetch('http://localhost:3000/users/sign_out', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
    localStorage.removeItem('jwt')
    localStorage.removeItem('user_email')
    setUser(null)
  }, [])

  useEffect(() => {
    const jwt = localStorage.getItem('jwt')
    const email = localStorage.getItem('user_email')
    if (jwt && email) setUser(email)
  }, [])

  const handleUploadSuccess = useCallback(() => {
    setShowUploadModal(false)
    setPhotosRefreshKey((k) => k + 1)
  }, [])

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        showLogin,
        setShowLogin,
        logout,
        latestPost,
        setLatestPost,
        showUploadModal,
        setShowUploadModal,
        photosRefreshKey,
        setPhotosRefreshKey,
      }}
    >
      <div className="App">
        <Navbar />
        {showLogin && <LoginForm />}
        {showUploadModal && (
          <Modal>
            <Modal.Backdrop
              isOpen
              onOpenChange={(isOpen) => {
                if (!isOpen) setShowUploadModal(false)
              }}
            >
              <Modal.Container size="sm">
                <Modal.Dialog>
                  <Modal.Header>
                    <Modal.Heading>Ajouter une photo</Modal.Heading>
                  </Modal.Header>
                  <Modal.Body>
                    <FileForm inModal onSuccess={handleUploadSuccess} />
                  </Modal.Body>
                </Modal.Dialog>
              </Modal.Container>
            </Modal.Backdrop>
          </Modal>
        )}
        <main className="main">
          <LatestImage />
          <PhotoGrid />
        </main>
      </div>
    </AppContext.Provider>
  )
}

export default App
