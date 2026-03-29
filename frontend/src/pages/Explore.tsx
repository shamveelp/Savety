import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getExploreUploads } from '../services/user/userUploadApiServices'
import DiscoveryPost from '../components/DiscoveryPost'
import './Explore.css'

const Explore = () => {
  const navigate = useNavigate()
  const [uploads, setUploads] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)
  
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const currentUserId = user.id

  const fetchUploads = async (pageNum: number) => {
    if (loading) return
    setLoading(true)
    try {
      const data = await getExploreUploads(pageNum, 12)
      if (data.uploads.length < 12) setHasMore(false)
      
      setUploads(prev => {
        const combined = [...prev, ...data.uploads]
        return Array.from(new Map(combined.map(u => [u._id, u])).values())
      })
    } catch (error) {
      toast.error('Failed to resolve global discoveries.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUploads(page)
  }, [page])

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
    <div className="explore-page vertical-feed">
      <div className="explore-header">
        <h1>Global Discovery</h1>
        <p>Exploring public memories from across the Savety ecosystem</p>
      </div>

      <div className="discovery-feed-container">
        {uploads.map((upload, index) => {
          const isLast = index === uploads.length - 1
          return (
            <div key={upload._id} ref={isLast ? lastElementRef : null}>
              <DiscoveryPost upload={upload} currentUserId={currentUserId} />
            </div>
          )
        })}
      </div>

      {loading && (
        <div className="explore-loading-hub">
          <div className="social-spinner"></div>
          <span>Retrieving discoveries...</span>
        </div>
      )}

      {!hasMore && uploads.length > 0 && (
        <div className="explore-end-gate">
          <p>You've reached the horizon of global discoveries.</p>
        </div>
      )}
      
      {uploads.length === 0 && !loading && (
        <div className="explore-empty-state">
          <div className="empty-globe">🌍</div>
          <h3>The world is still preserving...</h3>
          <p>Be the first to share your discovery with the world.</p>
          <button onClick={() => navigate('/upload')} className="share-btn">Share Memory</button>
        </div>
      )}
    </div>
  )
}

export default Explore
