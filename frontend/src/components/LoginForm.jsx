import { useState, useContext } from 'react'
import { Modal, Button, Input, Label, Spinner, Alert } from '@heroui/react'
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
    <Modal>
      <Modal.Trigger>
        <button type="button" aria-hidden style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }} />
      </Modal.Trigger>
      <Modal.Backdrop
        isOpen
        onOpenChange={(isOpen) => { if (!isOpen) setShowLogin(false) }}
      >
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Connexion</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <form id="login-form" onSubmit={handleSubmit} className="login-form">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user1@example.com"
                  fullWidth
                  isRequired
                />
                <Label htmlFor="login-password">Mot de passe</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  fullWidth
                  isRequired
                />
                {error && (
                  <Alert status="danger">
                    <Alert.Content>
                      <Alert.Title>Erreur</Alert.Title>
                      <Alert.Description>{error}</Alert.Description>
                    </Alert.Content>
                  </Alert>
                )}
                <div className="login-form__actions">
                  <Button variant="outline" onPress={() => setShowLogin(false)}>
                    Annuler
                  </Button>
                  <Button variant="primary" type="submit" isPending={loading}>
                    {({ isPending }) => (
                      <>
                        {isPending ? <Spinner color="current" size="sm" /> : null}
                        {isPending ? 'Connexion…' : 'Se connecter'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}

export default LoginForm
