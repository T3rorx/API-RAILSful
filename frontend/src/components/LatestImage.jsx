import { useContext, useEffect } from 'react'
import { AppContext } from '../App'

const API_BASE = 'http://localhost:3000'

function LatestImage() {
  const { latestPost, setLatestPost } = useContext(AppContext)

  useEffect(() => {
    fetch(`${API_BASE}/latest`)
      .then((response) => response.json())
      .then((data) => setLatestPost(data.image_url || null))
      .catch((error) => console.error(error))
  }, [setLatestPost])

  return (
    <section className="section-latest">
      <h2>Dernière photo</h2>
      {latestPost ? (
        <img src={latestPost} alt="Dernière photo" className="latest-image" />
      ) : (
        <p>Aucune photo pour le moment. Connecte-toi et envoie la première.</p>
      )}
    </section>
  )
}

export default LatestImage
