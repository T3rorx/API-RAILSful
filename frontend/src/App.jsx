import { createContext, useState, useEffect, useCallback } from 'react'
import Navbar from './components/Navbar'
import LoginForm from './components/LoginForm'
import FileForm from './components/FileForm'
import LatestImage from './components/LatestImage'
import './App.css'

export const AppContext = createContext(null)

function App() {
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [latestPost, setLatestPost] = useState(null)

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
      }}
    >
      <div className="App">
        <Navbar />
        {showLogin && <LoginForm />}
        <main className="main">
          <LatestImage />
          <FileForm />
        </main>
      </div>
    </AppContext.Provider>
  )
}

export default App
