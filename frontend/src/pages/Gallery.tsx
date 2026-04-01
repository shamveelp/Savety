import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import type { Upload } from '../types/upload'
import { getUserUploads } from '../services/user/userUploadApiServices'
import toast from 'react-hot-toast'
import Lightbox from '../components/Lightbox'
import Loading from '../components/common/Loading'
import './Gallery.css'

const Gallery = () => {
  const [uploads, setUploads] = useState<Upload[]>([])
  const [filteredUploads, setFilteredUploads] = useState<Upload[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxData, setLightboxData] = useState<{ images: string[], index: number } | null>(null)
  
  // Search, Sort, Filter states
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterBy, setFilterBy] = useState('all')

  useEffect(() => {
    fetchUploads()
  }, [])

  const fetchUploads = async () => {
    try {
      const data = await getUserUploads()
      setUploads(data.uploads || [])
    } catch {
      toast.error('Failed to load your gallery.')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = useCallback(() => {
    let result = [...uploads]

    // 1. Search (Title)
    if (search) {
      result = result.filter(u => u.title.toLowerCase().includes(search.toLowerCase()))
    }

    // 2. Filter (Visibility)
    if (filterBy !== 'all') {
      result = result.filter(u => u.visibility === filterBy)
    }

    // 3. Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } else if (sortBy === 'title-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title))
    }

    setFilteredUploads(result)
  }, [uploads, search, sortBy, filterBy])

  useEffect(() => {
    applyFilters()
  }, [search, sortBy, filterBy, uploads, applyFilters])

  if (loading) return <Loading />

  return (
    <div className="gallery-container">
      <div className="gallery-header-section">
        <div className="title-area">
          <h1>My Gallery</h1>
          <p>{uploads.length} memories preserved officially</p>
        </div>
        
        <div className="gallery-controls">
          <div className="search-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2"/>
              <path d="M20 20L16.5 16.5" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search memories..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} className="gallery-select">
              <option value="all">All Visibility</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="unlisted">Unlisted</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="gallery-select">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {filteredUploads.length > 0 ? (
        <div className="gallery-main-grid">
          {filteredUploads.map((upload) => (
            <div key={upload._id} className="gallery-card-item">
              <Link to={`/${upload.userId?.username}/${upload.slug}`} className="card-link-wrapper">
                <div className="card-thumb">
                  <img src={upload.images[0]} alt={upload.title} loading="lazy" />
                  {upload.images.length > 1 && (
                    <div className="card-count">+{upload.images.length - 1}</div>
                  )}
                  <div className={`card-visibility ${upload.visibility}`}>{upload.visibility}</div>
                </div>
                <div className="card-meta">
                  <h3>{upload.title}</h3>
                  <p>{new Date(upload.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </Link>
              <button 
                className="quick-view-btn" 
                title="Quick View"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLightboxData({ images: upload.images, index: 0 });
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="gallery-empty-state">
          <h2>No matching memories found</h2>
          <p>Try adjusting your filters or search term</p>
          {uploads.length === 0 && (
            <Link to="/upload" className="btn btn-primary" style={{marginTop: '20px'}}>Preserve First Memory</Link>
          )}
        </div>
      )}

      {lightboxData && (
        <Lightbox 
          images={lightboxData.images} 
          initialIndex={lightboxData.index} 
          onClose={() => setLightboxData(null)} 
        />
      )}
    </div>
  )
}

export default Gallery
