import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getUploadDetails, deleteUpload, updateUpload } from '../services/user/userUploadApiServices'
import Lightbox from '../components/Lightbox'
import './Upload.css'

type EditItem = {
  id: string;
  type: 'existing' | 'new';
  content: string | File;
  preview: string;
  isRemoved?: boolean;
}

const UploadDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [upload, setUpload] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthor, setIsAuthor] = useState(false)
  
  // Edit States
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editVisibility, setEditVisibility] = useState('private')
  const [editItems, setEditItems] = useState<EditItem[]>([])
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchDetails()
  }, [id])

  const fetchDetails = async () => {
    try {
      if (!id) return
      const data = await getUploadDetails(id)
      setUpload(data.upload)
      
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      let currentUserId = user.id
      if (!currentUserId && user.token) {
        try {
          const payload = JSON.parse(window.atob(user.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
          currentUserId = payload.id
        } catch (e) {}
      }
      setIsAuthor(currentUserId === data.upload.userId)
      
      // Default Edit States
      setEditTitle(data.upload.title)
      setEditDesc(data.upload.description || '')
      setEditVisibility(data.upload.visibility)
      setEditItems(data.upload.images.map((url: string) => ({
        id: Math.random().toString(36),
        type: 'existing',
        content: url,
        preview: url,
        isRemoved: false
      })))
    } catch (error: any) {
      if (error.response?.status === 403) toast.error('This memory is private.')
      else toast.error('Failed to load memory.')
      navigate('/gallery')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      if (!id) return
      await deleteUpload(id)
      toast.success('Memory removed from vault.')
      navigate('/gallery')
    } catch (error: any) {
      toast.error('Failed to remove memory.')
    }
  }

  const handleSave = async () => {
    if (!id) return
    if (!editTitle || editTitle.length < 3) {
      toast.error('Title must be at least 3 characters.')
      return
    }

    const activeItems = editItems.filter(item => !item.isRemoved)
    if (activeItems.length === 0) {
      toast.error('Memory must contain at least one image.')
      return
    }

    setSaving(true)
    const formData = new FormData()
    formData.append('title', editTitle)
    formData.append('description', editDesc)
    formData.append('visibility', editVisibility)
    
    // Process Arrangement
    activeItems.forEach(item => {
      if (item.type === 'existing') formData.append('existingImages', item.content as string)
      else formData.append('images', item.content as File)
    })

    const toastId = toast.loading('Sychronizing your arrangement...')
    try {
      const data = await updateUpload(id, formData)
      setUpload(data.upload)
      setEditItems(data.upload.images.map((url: string) => ({
        id: Math.random().toString(36),
        type: 'existing',
        content: url,
        preview: url,
        isRemoved: false
      })))
      setIsEditing(false)
      toast.success('Arrangement preserved!', { id: toastId })
    } catch (error: any) {
      toast.error('Sync failed.', { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  // DnD Handlers
  const handleDragStart = (idx: number) => setDraggedIdx(idx)
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === idx) return
    
    const items = [...editItems]
    const draggedItem = items[draggedIdx]
    items.splice(draggedIdx, 1)
    items.splice(idx, 0, draggedItem)
    setDraggedIdx(idx)
    setEditItems(items)
  }

  const handleNewFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const newItems: EditItem[] = files.map(file => ({
        id: Math.random().toString(36),
        type: 'new',
        content: file,
        preview: URL.createObjectURL(file),
        isRemoved: false
      }))
      setEditItems(prev => [...prev, ...newItems])
    }
  }

  const toggleItemRemoval = (targetId: string) => {
    setEditItems(prev => prev.map(item => 
      item.id === targetId ? { ...item, isRemoved: !item.isRemoved } : item
    ))
  }

  if (loading) return <div className="profile-loading">Exploring vault...</div>

  return (
    <div className="upload-detail-page">
      <div className="detail-container">
        
        {/* Header Section */}
        <div className="detail-header">
          <button onClick={() => navigate('/gallery')} className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Vault
          </button>
          
          <div className="header-meta">
            {isEditing ? (
              <input 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)} 
                className="edit-title-input"
                placeholder="Memory Title"
              />
            ) : (
              <h1>{upload?.title}</h1>
            )}
            {!isEditing && <span className={`badge ${upload?.visibility}`}>{upload?.visibility}</span>}
          </div>

          <div className="detail-actions">
            {isAuthor && !isEditing && (
              <>
                <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
                <button 
                  onClick={() => setShowDeleteConfirm(!showDeleteConfirm)} 
                  className={`delete-icon-btn ${showDeleteConfirm ? 'active' : ''}`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </>
            )}
            {isEditing && (
              <div className="editing-actions">
                <button onClick={() => { setIsEditing(false); fetchDetails(); }} className="cancel-btn">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="save-btn">
                  {saving ? 'Preserving...' : 'Save Sync'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="delete-confirm-bar">
            <span>Permanently remove this memory from Savety?</span>
            <div className="confirm-buttons">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-cancel-del">No, Keep It</button>
              <button onClick={handleDelete} className="btn-confirm-del">Yes, Remove</button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="detail-info-section">
          {isEditing ? (
            <div className="edit-form-extras">
              <textarea 
                value={editDesc} 
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Add a description... (optional)"
                className="edit-desc-input"
              />
              <div className="edit-visibility-picker">
                <button onClick={() => setEditVisibility('public')} className={`vis-min-btn ${editVisibility === 'public' ? 'active' : ''}`}>Public</button>
                <button onClick={() => setEditVisibility('private')} className={`vis-min-btn ${editVisibility === 'private' ? 'active' : ''}`}>Private</button>
                <button onClick={() => setEditVisibility('unlisted')} className={`vis-min-btn ${editVisibility === 'unlisted' ? 'active' : ''}`}>Unlisted</button>
              </div>
            </div>
          ) : (
            upload?.description && <p className="detail-description">{upload.description}</p>
          )}
        </div>

        {/* Dynamic Image Grid with DnD */}
        <div className="detail-grid">
          {isEditing ? (
            <>
              {editItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`detail-image-item draggable ${item.isRemoved ? 'removing' : ''}`}
                  draggable={!item.isRemoved}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={() => setDraggedIdx(null)}
                >
                  <img src={item.preview} alt={`Memory ${index}`} />
                  <button 
                    className={`img-action-btn ${item.isRemoved ? 'add' : 'rem'}`}
                    onClick={(e) => { e.stopPropagation(); toggleItemRemoval(item.id); }}
                  >
                    {item.isRemoved ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    )}
                  </button>
                  {item.type === 'new' && <div className="pending-badge">New Asset</div>}
                  <div className="drag-handle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 10h10M7 14h10"/></svg>
                  </div>
                </div>
              ))}
              <div className="detail-add-more" onClick={() => fileInputRef.current?.click()}>
                <input type="file" multiple hidden ref={fileInputRef} onChange={handleNewFiles} accept="image/*" />
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                <span>Add More</span>
              </div>
            </>
          ) : (
            upload?.images.map((url: string, index: number) => (
              <div key={index} className="detail-image-item" onClick={() => setLightboxIndex(index)}>
                <img src={url} alt={`Memory ${index}`} />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="detail-footer">
          <p>Preserved by {isAuthor ? 'You' : (upload?.username || 'Member')} on {new Date(upload?.createdAt).toLocaleDateString()}</p>
          {upload?.visibility === 'unlisted' && !isEditing && (
            <div className="share-section">
              <input readOnly value={window.location.href} className="share-link" />
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }} className="copy-btn">Copy Link</button>
            </div>
          )}
        </div>
      </div>

      {upload && lightboxIndex !== null && (
        <Lightbox images={upload.images} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  )
}

export default UploadDetail
