import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './Upload.css'
import { uploadMemories } from '../services/user/userUploadApiServices'
import Lightbox from '../components/Lightbox'

const Upload = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState('private')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...selectedFiles])

      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file))
      setPreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = [...files]
    updatedFiles.splice(index, 1)
    setFiles(updatedFiles)

    const updatedPreviews = [...previews]
    URL.revokeObjectURL(updatedPreviews[index])
    updatedPreviews.splice(index, 1)
    setPreviews(updatedPreviews)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) return toast.error('Please select at least one photo.')
    
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('visibility', visibility)
      
      files.forEach((file) => {
        formData.append('images', file)
      })

      await uploadMemories(formData)
      toast.success('Memories preserved successfully!')
      navigate('/gallery')
    } catch (error: any) {
      console.error("Upload error", error);
      toast.error(error.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <h1>New Memories</h1>
          <p>Preserve your story. Bulk upload and share instantly.</p>
        </div>

        <form onSubmit={handleUpload} className="upload-form">
          <div className="upload-layout">
            <div className="upload-details">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input 
                  type="text" 
                  id="title" 
                  placeholder="e.g. Summer in Interlaken"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <textarea 
                  id="description" 
                  placeholder="Tell the story behind these photos..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Visibility</label>
                <div className="visibility-options">
                  <button 
                    type="button" 
                    className={`vis-btn ${visibility === 'public' ? 'active' : ''}`}
                    onClick={() => setVisibility('public')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><circle cx="12" cy="12" r="3"/></svg>
                    Public
                  </button>
                  <button 
                    type="button" 
                    className={`vis-btn ${visibility === 'private' ? 'active' : ''}`}
                    onClick={() => setVisibility('private')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Private
                  </button>
                  <button 
                    type="button" 
                    className={`vis-btn ${visibility === 'unlisted' ? 'active' : ''}`}
                    onClick={() => setVisibility('unlisted')}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    Unlisted
                  </button>
                </div>
              </div>
            </div>

            <div className="upload-dropzone-section">
              <div 
                className="dropzone"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  if (e.dataTransfer.files) {
                    handleFileChange({ target: { files: e.dataTransfer.files } } as any)
                  }
                }}
              >
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  hidden 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                />
                <div className="dropzone-content">
                  <div className="drop-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <h3>Drop your photos here</h3>
                  <p>or click to browse from device</p>
                </div>
              </div>

              {previews.length > 0 && (
                <div className="preview-grid">
                  {previews.map((url, index) => (
                    <div 
                      key={index} 
                      className="preview-item"
                      onClick={() => setLightboxIndex(index)}
                    >
                      <img src={url} alt={`Preview ${index}`} />
                      <button 
                        type="button" 
                        className="remove-btn" 
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile(index)
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="add-more-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      fileInputRef.current?.click()
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="upload-footer">
            <button type="submit" className="btn-upload-submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Publish Memories'}
            </button>
          </div>
        </form>
      </div>

      {lightboxIndex !== null && (
        <Lightbox 
          images={previews} 
          initialIndex={lightboxIndex} 
          onClose={() => setLightboxIndex(null)} 
        />
      )}
    </div>
  )
}

export default Upload
