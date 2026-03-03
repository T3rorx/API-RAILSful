import { useContext, useEffect } from 'react'
import { Card } from '@heroui/react'
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
    <Card className="card-block">
      <Card.Header>
        <Card.Title>Dernière photo</Card.Title>
      </Card.Header>
      <Card.Content>
        {latestPost ? (
          <img
            src={latestPost}
            alt="Dernière photo"
            className="latest-image-wrap"
          />
        ) : (
          <p className="latest-image-empty">
            Aucune photo pour le moment. Connecte-toi et envoie la première.
          </p>
        )}
      </Card.Content>
    </Card>
  )
}

export default LatestImage
