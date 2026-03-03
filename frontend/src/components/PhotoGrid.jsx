import { useState, useEffect, useContext } from 'react'
import { Card, Button } from '@heroui/react'
import { AppContext } from '../App'

const API_BASE = 'http://localhost:3000'
const PER_PAGE = 12

function PhotoGrid() {
  const { photosRefreshKey } = useContext(AppContext)
  const [photos, setPhotos] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const hasMore = photos.length < total

  function fetchPage(pageNum, append = false) {
    const isFirst = pageNum === 1
    if (isFirst) setLoading(true)
    else setLoadingMore(true)

    fetch(`${API_BASE}/photos?page=${pageNum}&per_page=${PER_PAGE}`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.photos || []
        const totalCount = data.total ?? 0
        setTotal(totalCount)
        if (append) {
          setPhotos((prev) => [...prev, ...list])
        } else {
          setPhotos(list)
        }
        setPage(pageNum)
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false)
        setLoadingMore(false)
      })
  }

  useEffect(() => {
    fetchPage(1, false)
  }, [photosRefreshKey])

  function loadMore() {
    fetchPage(page + 1, true)
  }

  return (
    <Card className="card-block photo-grid-card">
      <Card.Header>
        <Card.Title>Photos</Card.Title>
      </Card.Header>
      <Card.Content>
        {loading ? (
          <p className="latest-image-empty">Chargement…</p>
        ) : photos.length === 0 ? (
          <p className="latest-image-empty">Aucune photo pour le moment.</p>
        ) : (
          <>
            <div className="photo-grid">
              {photos.map((photo) => (
                <a
                  key={photo.id}
                  href={photo.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="photo-grid__item"
                  title="Ouvrir en pleine taille"
                >
                  <img src={photo.image_url} alt="" />
                </a>
              ))}
            </div>
            {hasMore && (
              <div className="photo-grid__load-more">
                <Button
                  variant="flat"
                  onPress={loadMore}
                  isDisabled={loadingMore}
                  isLoading={loadingMore}
                >
                  Charger plus
                </Button>
              </div>
            )}
          </>
        )}
      </Card.Content>
    </Card>
  )
}

export default PhotoGrid
