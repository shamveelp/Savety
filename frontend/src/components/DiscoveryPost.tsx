import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { toggleLike } from '../services/user/userUploadApiServices'
import './DiscoveryPost.css'

interface DiscoveryPostProps {
  upload: any;
  currentUserId?: string;
}

const DiscoveryPost = ({ upload, currentUserId }: DiscoveryPostProps) => {
  const navigate = useNavigate()
  const [activeIdx, setActiveIdx] = useState(0)
  const [likes, setLikes] = useState(upload.likes?.length || 0)
  const [isLiked, setIsLiked] = useState(upload.likes?.some((id: string) => id.toString() === currentUserId?.toString()))
  const [isToggling, setIsToggling] = useState(false)
  const [showHeartAnim, setShowHeartAnim] = useState(false)

  const handleLike = async (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!currentUserId) {
      toast.error('Sign in to like this memory.')
      navigate('/login')
      return
    }
    if (isToggling) return
    setIsToggling(true)
    try {
      const data = await toggleLike(upload._id)
      setLikes(data.likesCount)
      setIsLiked(data.isLiked)
    } catch (error) {
      toast.error('Engagement failed.')
    } finally {
      setIsToggling(false)
    }
  }

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isLiked) handleLike()
    setShowHeartAnim(true)
    setTimeout(() => setShowHeartAnim(false), 800)
  }

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (activeIdx < upload.images.length - 1) setActiveIdx(prev => prev + 1)
  }

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (activeIdx > 0) setActiveIdx(prev => prev - 1)
  }

  return (
    <div className="discovery-post-card">
      {/* Header: Author & Location */}
      <div className="discovery-post-header">
        <Link to={`/profile/${upload.userId?._id}`} className="author-info">
          <div className="author-avatar">{upload.userId?.username?.charAt(0).toUpperCase()}</div>
          <div className="author-meta">
            <span className="username">@{upload.userId?.username || 'Member'}</span>
            <span className="post-timestamp">{new Date(upload.createdAt).toLocaleDateString()}</span>
          </div>
        </Link>
        <button className="post-more-btn">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>

      {/* Body: Carousel */}
      <div 
        className="discovery-post-body" 
        onClick={() => navigate(`/upload/${upload._id}`)}
        onDoubleClick={handleDoubleTap}
      >
        <div className="post-images-container">
          <img 
            src={upload.images[activeIdx]} 
            alt={upload.title} 
            className="post-main-image"
            loading="lazy"
          />
          
          {showHeartAnim && (
            <div className="heart-overlay-anim">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
          )}
          
          {upload.images.length > 1 && (
            <>
              {activeIdx > 0 && (
                <button className="post-nav-btn prev" onClick={prevImg}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
              )}
              {activeIdx < upload.images.length - 1 && (
                <button className="post-nav-btn next" onClick={nextImg}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              )}
              <div className="post-dots">
                {upload.images.map((_: any, i: number) => (
                  <span key={i} className={`dot ${i === activeIdx ? 'active' : ''}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer: Engagement & Meta */}
      <div className="discovery-post-footer">
        <div className="engagement-bar">
          <button 
            className={`action-btn like-btn ${isLiked ? 'active' : ''}`} 
            onClick={handleLike}
            disabled={isToggling}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
          <button className="action-btn" onClick={() => navigate(`/upload/${upload._id}`)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
          </button>
        </div>
        
        <div className="post-engagement-meta">
          <span className="likes-count">{likes.toLocaleString()} likes</span>
        </div>

        <div className="post-caption-section">
          <h3 className="post-title">{upload.title}</h3>
          {upload.description && <p className="post-description">{upload.description}</p>}
        </div>
      </div>
    </div>
  )
}

export default DiscoveryPost
