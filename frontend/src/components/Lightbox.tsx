import { useState, useEffect, useRef, useCallback } from 'react'
import './Lightbox.css'

interface LightboxProps {
  images: string[]
  initialIndex: number
  onClose: () => void
}

const Lightbox = ({ images, initialIndex, onClose }: LightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  
  const imgRef = useRef<HTMLImageElement>(null)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const touchStartX = useRef<number | null>(null)

  // Block body scroll
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = originalStyle }
  }, [])

  const resetTransform = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
        resetTransform()
        setIsAnimating(false)
      }, 250)
    }
  }, [currentIndex, images.length])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1)
        resetTransform()
        setIsAnimating(false)
      }, 250)
    }
  }, [currentIndex])

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.2 : 0.2
    const newScale = Math.min(Math.max(scale + delta, 1), 5)
    
    if (newScale !== scale) {
      const rect = imgRef.current?.getBoundingClientRect()
      if (rect) {
        const mouseX = e.clientX - rect.left - rect.width / 2
        const mouseY = e.clientY - rect.top - rect.height / 2
        
        // Adjust position so we zoom towards the mouse
        const ratio = 1 - newScale / scale
        setPosition({
          x: position.x + mouseX * ratio,
          y: position.y + mouseY * ratio
        })
      }
      setScale(newScale)
    }
  }

  // Dragging
  const startDragging = (e: React.MouseEvent | React.TouchEvent) => {
    if (scale <= 1) return
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    lastMousePos.current = { x: clientX, y: clientY }
  }

  const onDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    const dx = clientX - lastMousePos.current.x
    const dy = clientY - lastMousePos.current.y
    
    setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }))
    lastMousePos.current = { x: clientX, y: clientY }
  }

  const stopDragging = () => setIsDragging(false)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (scale === 1) {
        if (e.key === 'ArrowRight') handleNext()
        if (e.key === 'ArrowLeft') handlePrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev, onClose, scale])

  // Swipe for navigation (only if not zoomed)
  const onTouchStart = (e: React.TouchEvent) => {
    if (scale > 1) {
      startDragging(e)
    } else {
      touchStartX.current = e.touches[0].clientX
    }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (scale > 1) {
      stopDragging()
    } else if (touchStartX.current !== null) {
      const touchEndX = e.changedTouches[0].clientX
      const diff = touchStartX.current - touchEndX

      if (Math.abs(diff) > 50) {
        if (diff > 0) handleNext()
        else handlePrev()
      }
      touchStartX.current = null
    }
  }

  const handleDownload = async () => {
    const url = images[currentIndex]
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `savety_memory_${currentIndex + 1}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(blobUrl)
      document.body.removeChild(a)
    } catch (e) {
      console.error('Download failed', e)
    }
  }

  return (
    <div className="lightbox-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="lightbox-controls">
        <button className="lb-close" onClick={onClose} title="Close Lightbox">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <button className="lb-download" onClick={handleDownload} title="Download Photo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
        </button>
        <button className="lb-reset" onClick={resetTransform} title="Reset View">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
          </svg>
        </button>
      </div>

      <button className={`lb-nav prev ${currentIndex === 0 || scale > 1 ? 'hidden' : ''}`} onClick={handlePrev}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      <div 
        className={`lb-viewport ${isAnimating ? 'animating' : ''}`}
        onWheel={handleWheel}
        onMouseDown={startDragging}
        onMouseMove={onDrag}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onTouchStart={onTouchStart}
        onTouchMove={onDrag}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className="lb-transform-box"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.165, 0.84, 0.44, 1)'
          }}
        >
          <img 
            ref={imgRef}
            src={images[currentIndex]} 
            alt={`Memory ${currentIndex + 1}`}
            draggable={false}
          />
        </div>
      </div>

      <button className={`lb-nav next ${currentIndex === images.length - 1 || scale > 1 ? 'hidden' : ''}`} onClick={handleNext}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6"/></svg>
      </button>

      <div className="lb-counter">
        {currentIndex + 1} / {images.length}
        {scale > 1 && <span className="zoom-indicator">{(scale * 100).toFixed(0)}%</span>}
      </div>
    </div>
  )
}

export default Lightbox
