import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Upload } from '../types/upload'
import type { User } from '../types/user'
import toast from 'react-hot-toast'
import { getPublicProfile } from '../services/user/userUploadApiServices'
import './PublicProfile.css'

const PublicProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [uploads, setUploads] = useState<Upload[]>([])
  const [loading, setLoading] = useState(true)
  const [author, setAuthor] = useState<User | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!userId) return
    try {
      const data = await getPublicProfile(userId)
      setUploads(data.uploads)
      if (data.uploads.length > 0) {
        setAuthor(data.uploads[0].userId as User)
      }
    } catch {
      toast.error('Failed to resolve this profile.')
      navigate('/explore')
    } finally {
      setLoading(false)
    }
  }, [userId, navigate])

  useEffect(() => {
    fetchProfile()
  }, [userId, fetchProfile])

  if (loading) return <div className="profile-loading">Decoding portfolio...</div>

  return (
    <div className="public-profile-page">
      <div className="profile-hero">
        <div className="profile-avatar-large">
          {author?.username?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="profile-identity">
          <h1>@{author?.username || 'Member'}</h1>
          <div className="profile-stats">
            <span><strong>{uploads.length}</strong> discoveries</span>
            <span><strong>0</strong> following</span>
            <span><strong>0</strong> followers</span>
          </div>
          <p className="profile-bio">Preserving memories in the Savety ecosystem since 2024.</p>
        </div>
      </div>

      <div className="profile-tabs">
        <button className="tab-btn active">Discoveries</button>
        <button className="tab-btn">Saved</button>
        <button className="tab-btn">Tagged</button>
      </div>

      <div className="profile-discovery-grid">
        {uploads.map((upload) => (
          <div 
            key={upload._id} 
            className="grid-item"
            onClick={() => navigate(`/upload/${upload._id}`)}
          >
            <img src={upload.images[0]} alt={upload.title} loading="lazy" />
            <div className="grid-overlay">
              <div className="grid-stats">
                <span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  {upload.likes?.length || 0}
                </span>
                <span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                  {upload.images.length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {uploads.length === 0 && (
        <div className="profile-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          <p>No discoveries preserved publicly yet.</p>
        </div>
      )}
    </div>
  )
}

export default PublicProfile
