import { useContext } from 'react'
import { AppContext } from '../App'

const API_BASE = 'http://localhost:3000'

function FileForm() {
  const { user, setLatestPost } = useContext(AppContext)

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
  }

  function fetchLatest() {
    fetch(`${API_BASE}/latest`)
      .then((res) => res.json())
      .then((data) => setLatestPost(data.image_url || null))
      .catch((err) => console.error(err))
  }

  if (!user) {
    return (
      <section className="section-upload">
        <h2>Uploader une photo</h2>
        <p className="upload-cta">Connecte-toi avec le bouton « Se connecter » dans la barre de navigation pour pouvoir uploader des photos.</p>
      </section>
    )
  }

  return (
    <section className="section-upload">
      <h2>Uploader une photo</h2>
      <form onSubmit={(e) => handleSubmit(e)} className="upload-form">
        <label htmlFor="image">Image</label>
        <input type="file" name="image" id="image" accept="image/*" required />
        <button type="submit" className="btn btn-primary">Envoyer la photo</button>
      </form>
    </section>
  )
}

export default FileForm
