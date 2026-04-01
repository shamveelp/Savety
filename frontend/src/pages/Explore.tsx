import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Upload } from '../types/upload'
import toast from 'react-hot-toast'
import { getExploreUploads } from '../services/user/userUploadApiServices'
import MemoryTile from '../components/MemoryTile'
import Footer from '../components/Footer'
import Loading from '../components/common/Loading'
import './Explore.css'

const Explore = () => {
  const navigate = useNavigate()
  const [uploads, setUploads] = useState<Upload[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)

  const fetchUploads = useCallback(async (pageNum: number) => {
    if (loading) return
    setLoading(true)
    try {
      const data = await getExploreUploads(pageNum, 12)
      if (data.uploads.length < 12) setHasMore(false)
      
      setUploads(prev => {
        const combined = [...prev, ...data.uploads]
        return Array.from(new Map(combined.map(u => [u._id, u])).values())
      })
    } catch {
      toast.error('Failed to resolve global discoveries.')
    } finally {
      setLoading(false)
    }
  }, [loading])

  useEffect(() => {
    fetchUploads(page)
  }, [page, fetchUploads])

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1)
      }
    })
    
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  return (
    <>
      <div className="explore-page">
        <div className="explore-header">
          <h1>Public Memories</h1>
          <p>Discover visual preservations from our global community</p>
        </div>

        {uploads.length === 0 && !loading && (
          <div className="explore-empty-state">
            <div className="empty-globe">🌍</div>
            <h2>The horizon is clear</h2>
            <p>Be the first to share a public memory with the world.</p>
            <button className="share-btn" onClick={() => navigate('/upload')}>Start Preserving</button>
          </div>
        )}

        <div className="explore-grid masonry">
          {uploads.map((upload, index) => {
            const isLast = uploads.length === index + 1
            return (
              <div key={upload._id} ref={isLast ? lastElementRef : null} className="explore-tile-wrapper">
                <MemoryTile 
                  url={upload.images[0]} 
                  index={index}
                  onClick={() => navigate(`/${upload.userId?.username}/${upload.slug}`)}
                  className="explore-item-card"
                >
                  <div className="explore-tile-overlay">
                    <div className="overlay-meta">
                      <h3 className="overlay-title">{upload.title}</h3>
                      <span className="overlay-author">@{upload.userId?.username || 'Member'}</span>
                    </div>
                    {upload.images.length > 1 && (
                      <div className="bulky-badge">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                        {upload.images.length}
                      </div>
                    )}
                  </div>
                </MemoryTile>
              </div>
            )
          })}
        </div>

        {loading && uploads.length === 0 ? (
          <Loading />
        ) : loading && (
          <div className="explore-loading-hub">
            <div className="social-spinner"></div>
            <span>Retrieving discoveries...</span>
          </div>
        )}

        {!hasMore && uploads.length > 0 && (
          <div className="explore-footer-wrapper">
            <hr className="explore-separator" />
            <div className="explore-end-gate">
              <p>You've reached the horizon of global discoveries.</p>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  )
}

export default Explore
