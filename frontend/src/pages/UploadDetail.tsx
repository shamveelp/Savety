import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getUploadDetails, deleteUpload } from '../services/user/userUploadApiServices'
import './Upload.css'

const UploadDetail = () => {
  const { id } = useParams()
  const [upload, setUpload] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDetails()
  }, [id])

  const fetchDetails = async () => {
    try {
      if (!id) return
      const data = await getUploadDetails(id)
      setUpload(data.upload)
    } catch (error: any) {
      toast.error('Failed to load memory details.')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove this memory?')) return
    
    try {
      if (!id) return
      await deleteUpload(id)
      toast.success('Memory removed.')
      navigate('/profile')
    } catch (error: any) {
      toast.error('Failed to remove memory.')
    }
  }

  if (loading) return <div className="profile-loading">Loading...</div>

  return (
    <div className="upload-detail-page">
      <div className="detail-container">
        <div className="detail-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </button>
          <div className="header-meta">
            <h1>{upload?.title}</h1>
            <span className={`badge ${upload?.visibility}`}>{upload?.visibility}</span>
          </div>
          <button onClick={handleDelete} className="delete-icon-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>

        {upload?.description && (
          <p className="detail-description">{upload.description}</p>
        )}

        <div className="detail-grid">
          {upload?.images.map((url: string, index: number) => (
            <div key={index} className="detail-image-item">
              <img src={url} alt={`Memory ${index}`} />
            </div>
          ))}
        </div>

        <div className="detail-footer">
          <p>Preserved on {new Date(upload?.createdAt).toLocaleDateString()}</p>
          {upload?.visibility === 'unlisted' && (
            <div className="share-section">
              <input readOnly value={window.location.href} className="share-link" />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success('Link copied!')
                }}
                className="copy-btn"
              >
                Copy Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UploadDetail
