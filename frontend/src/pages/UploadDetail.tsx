import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getUploadDetails, deleteUpload, updateUpload, getUploadBySlug, toggleShare } from '../services/user/userUploadApiServices'
import Lightbox from '../components/Lightbox'
import MemoryTile from '../components/MemoryTile'
import './Upload.css'

type EditItem = {
  id: string;
  type: 'existing' | 'new';
  content: string | File;
  preview: string;
  isRemoved?: boolean;
}

const UploadDetail = () => {
  const { id, username, slug } = useParams()
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
  const [showShareModal, setShowShareModal] = useState(false)
  const [generatingShare, setGeneratingShare] = useState(false)

  useEffect(() => {
    fetchDetails()
  }, [id, username, slug])

  const handleToggleShare = async () => {
    try {
      setGeneratingShare(true)
      const uploadId = upload?._id || id
      if (!uploadId) return
      const data = await toggleShare(uploadId)
      setUpload(data.upload)
      toast.success(data.message)
    } catch (error: any) {
      toast.error('Failed to update sharing permissions.')
    } finally {
      setGeneratingShare(false)
    }
  }

  const downloadTicket = async () => {
    const ticketEl = document.querySelector('.access-ticket') as HTMLElement
    if (!ticketEl) {
        toast.error('Target asset not identified.')
        return
    }
    
    const toastId = toast.loading('Generating high-fidelity ticket asset...')
    
    try {
      // Load html2canvas dynamically if not present
      if (!(window as any).html2canvas) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }

      const canvas = await (window as any).html2canvas(ticketEl, {
          backgroundColor: null, // Transparent/Theme handled by CSS
          scale: 3, // Premium print quality
          useCORS: true,
          logging: false
      })
      
      const imgData = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = imgData
      a.download = `Savety_Ticket_${upload.slug}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      toast.success('Access ticket preserved locally.', { id: toastId })
    } catch (e) {
      console.error(e)
      toast.error('Ticket generation failed.', { id: toastId })
    }
  }

  const fetchDetails = async () => {
    try {
      setLoading(true)
      const searchParams = new URLSearchParams(window.location.search)
      const token = searchParams.get('token')
      
      let data;
      if (username && slug) {
          data = await getUploadBySlug(username, slug, token || undefined)
      } else if (id) {
          data = await getUploadDetails(id)
      } else return

      setUpload(data.upload)
      
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      let currentUserId = user.id
      if (!currentUserId && user.token) {
        try {
          const payload = JSON.parse(window.atob(user.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
          currentUserId = payload.id
        } catch (e) {}
      }
      setIsAuthor(currentUserId === data.upload.userId._id || currentUserId === data.upload.userId)
      
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
      const uploadId = upload?._id || id
      if (!uploadId) return
      await deleteUpload(uploadId)
      toast.success('Memory removed from vault.')
      navigate('/gallery')
    } catch (error: any) {
      toast.error('Failed to remove memory.')
    }
  }

  const handleSave = async () => {
    const uploadId = upload?._id || id
    if (!uploadId) return
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
      const data = await updateUpload(uploadId as string, formData)
      setUpload(data.upload)
      
      // If title changed, the URL might change too!
      if (data.upload.slug && data.upload.userId.username && (data.upload.slug !== slug || data.upload.userId.username !== username)) {
          // Navigate to NEW SEO URL
          navigate(`/${data.upload.userId.username}/${data.upload.slug}`, { replace: true })
      }
      
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

  // --- Download Logic ---
  const downloadSingle = async (url: string, index: number) => {
    const toastId = toast.loading('Retrieving asset...')
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${upload.title.replace(/\s+/g, '_')}_${index}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(blobUrl)
      document.body.removeChild(a)
      toast.success('Asset preserved locally.', { id: toastId })
    } catch (e) {
      toast.error('Retrieval failed.', { id: toastId })
    }
  }

  const downloadBulk = async () => {
    if (!upload?.images.length) return
    const toastId = toast.loading('Preparing archive...')
    
    try {
      // Load JSZip dynamically
      if (!(window as any).JSZip) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }

      const zip = new (window as any).JSZip()
      const folder = zip.folder(upload.title.replace(/\s+/g, '_'))

      // Fetch all images
      const promises = upload.images.map(async (url: string, i: number) => {
        const response = await fetch(url)
        const blob = await response.blob()
        const extension = url.split('.').pop()?.split('?')[0] || 'jpg'
        folder.file(`image_${i + 1}.${extension}`, blob)
      })

      await Promise.all(promises)
      const content = await zip.generateAsync({ type: "blob" })
      
      // Trigger download
      const blobUrl = window.URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${upload.title.replace(/\s+/g, '_')}_collection.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(blobUrl)
      document.body.removeChild(a)
      
      toast.success('Archive preserved locally.', { id: toastId })
    } catch (e) {
      console.error(e)
      toast.error('Archival failed.', { id: toastId })
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
          <button onClick={() => navigate(-1)} className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
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
            {!isEditing && (
              <button 
                onClick={downloadBulk} 
                className="bulk-download-btn"
                title="Download Collection as ZIP"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                Archive
              </button>
            )}

            {!isEditing && (
              <button 
                onClick={() => setShowShareModal(true)} 
                className="share-trigger-btn"
                title="Share Access Ticket"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                Share
              </button>
            )}

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
                <MemoryTile 
                  key={item.id} 
                  url={item.preview} 
                  index={index}
                  className={`draggable ${item.isRemoved ? 'removing' : ''}`}
                  draggable={!item.isRemoved}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={() => setDraggedIdx(null)}
                >
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
                </MemoryTile>
              ))}
              <div className="detail-add-more" onClick={() => fileInputRef.current?.click()}>
                <input type="file" multiple hidden ref={fileInputRef} onChange={handleNewFiles} accept="image/*" />
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                <span>Add More</span>
              </div>
            </>
          ) : (
            upload?.images.map((url: string, index: number) => (
              <MemoryTile 
                key={index} 
                url={url} 
                index={index} 
                className="group" 
                onClick={() => setLightboxIndex(index)}
              >
                <button 
                  className="single-download-overlay"
                  onClick={(e) => { e.stopPropagation(); downloadSingle(url, index); }}
                  title="Download Photo"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                </button>
              </MemoryTile>
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

      {/* Share Modal & Ticket */}
      {showShareModal && (
        <div className="share-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-share" onClick={() => setShowShareModal(false)}>&times;</button>
            
            <div className="share-header">
              <h3>Secure Access Ticket</h3>
              <p>Generation of high-fidelity sharing credentials</p>
              <button 
                onClick={(e) => { e.stopPropagation(); downloadTicket(); }} 
                className="ticket-download-mini"
                title="Preserve as Image"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                Download Ticket
              </button>
            </div>

            {/* Movie Ticket Design */}
            <div className="access-ticket">
              <div className="ticket-main">
                <div className="ticket-logo">SAVETY</div>
                <div className="ticket-info">
                  <div className="info-group">
                    <span className="label">PRESERVER</span>
                    <span className="value">@{upload.userId?.username || 'Member'}</span>
                  </div>
                  <div className="info-group">
                    <span className="label">MEMORY SLUG</span>
                    <span className="value">{upload.slug}</span>
                  </div>
                  <div className="info-group">
                    <span className="label">VISIBILITY</span>
                    <span className="value status">{upload.visibility}</span>
                  </div>
                </div>
                <div className="ticket-perforations"></div>
              </div>
              <div className="ticket-stub">
                <div className="qr-container">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                      `${window.location.origin}/${upload.userId?.username}/${upload.slug}${upload.shareEnabled && upload.shareToken ? `?token=${upload.shareToken}` : ''}`
                    )}&color=000000&bgcolor=ffffff&margin=10`} 
                    alt="Access QR"
                  />
                </div>
                <span className="stub-id">#ID-{upload._id.substring(18).toUpperCase()}</span>
              </div>
            </div>

            <div className="share-controls">
              {isAuthor && upload.visibility === 'unlisted' && (
                <div className="auth-share-toggle">
                  <p>Unlisted memories require an active sharing token for external access.</p>
                  <button 
                    onClick={handleToggleShare} 
                    className={`toggle-token-btn ${upload.shareEnabled ? 'active' : ''}`}
                    disabled={generatingShare}
                  >
                    {generatingShare ? 'Processing...' : (upload.shareEnabled ? 'Destroy Private Link' : 'Generate Private Link')}
                  </button>
                </div>
              )}

              {isAuthor && upload.visibility === 'public' && (
                <div className="auth-share-toggle">
                  <p>Public memories are visible globally, but you can generate a direct access ticket.</p>
                  <button 
                    onClick={handleToggleShare} 
                    className={`toggle-token-btn ${upload.shareEnabled ? 'active' : ''}`}
                  >
                    {upload.shareEnabled ? 'Reset Ticket Link' : 'Activate Ticket Link'}
                  </button>
                </div>
              )}

              {(upload.visibility === 'public' || (upload.visibility === 'unlisted' && (isAuthor || upload.shareEnabled))) ? (
                <div className="share-link-box">
                  <input 
                    readOnly 
                    value={`${window.location.origin}/${upload.userId?.username}/${upload.slug}${upload.shareEnabled && upload.shareToken ? `?token=${upload.shareToken}` : ''}`} 
                  />
                  <button onClick={() => { 
                    navigator.clipboard.writeText(`${window.location.origin}/${upload.userId?.username}/${upload.slug}${upload.shareEnabled && upload.shareToken ? `?token=${upload.shareToken}` : ''}`); 
                    toast.success('Link preserved in clipboard.');
                  }}>Copy</button>
                </div>
              ) : (
                upload.visibility === 'private' ? (
                  <p className="private-note">Private memories are locked to your vault only. Link generation is restricted.</p>
                ) : (
                  <p className="private-note">Secure sharing is currently disabled for this discovery.</p>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadDetail
