import { useState, useContext } from 'react'
import { Card, Button, Spinner, Label } from '@heroui/react'
import { AppContext } from '../App'

const API_BASE = 'http://localhost:3000'

function FileForm() {
  const { user, setLatestPost } = useContext(AppContext)
  const [uploading, setUploading] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const file = event.target.image?.files?.[0]
    if (!file) {
      window.alert('Choisis une image.')
      return
    }
    const data = new FormData()
    data.append('photo[image]', file)
    submitToAPI(data)
  }

  function submitToAPI(data) {
    const token = localStorage.getItem('jwt')
    if (!token) return
    setUploading(true)
    const headers = { Authorization: `Bearer ${token}` }

    fetch(`${API_BASE}/photos`, {
      method: 'POST',
      headers,
      body: data,
    })
      .then((response) => {
        const contentType = response.headers.get('content-type')
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Session expirée. Reconnecte-toi.')
          }
          return response.text().then((text) => { throw new Error(text || response.statusText) })
        }
        if (contentType && contentType.includes('application/json')) {
          return response.json()
        }
        return response.text().then(() => ({}))
      })
      .then((data) => {
        if (data && data.image_url) setLatestPost(data.image_url)
        else fetchLatest()
      })
      .catch((error) => {
        console.error(error)
        window.alert(error.message || 'Erreur lors de l’upload.')
      })
      .finally(() => setUploading(false))
  }

  function fetchLatest() {
    fetch(`${API_BASE}/latest`)
      .then((res) => res.json())
      .then((data) => setLatestPost(data.image_url || null))
      .catch((err) => console.error(err))
  }

  if (!user) {
    return (
      <Card className="card-block">
        <Card.Header>
          <Card.Title>Uploader une photo</Card.Title>
        </Card.Header>
        <Card.Content>
          <p className="latest-image-empty">
            Connecte-toi avec le bouton « Se connecter » dans la barre de navigation pour pouvoir uploader des photos.
          </p>
        </Card.Content>
      </Card>
    )
  }

  return (
    <Card className="card-block">
      <Card.Header>
        <Card.Title>Uploader une photo</Card.Title>
      </Card.Header>
      <Card.Content>
        <form onSubmit={(e) => handleSubmit(e)} className="upload-form">
          <Label htmlFor="image" className="upload-form__label">Image</Label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            required
            className="upload-form__input"
          />
          <div className="upload-form__submit">
            <Button variant="primary" type="submit" isPending={uploading}>
              {({ isPending }) => (
                <>
                  {isPending ? <Spinner color="current" size="sm" /> : null}
                  {isPending ? 'Envoi…' : 'Envoyer'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  )
}

export default FileForm
