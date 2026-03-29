import { useState, useEffect } from 'react'

interface MemoryTileProps {
  url: string;
  index: number;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  onDragStart?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  draggable?: boolean;
}

const MemoryTile = ({ 
  url, 
  index, 
  onClick, 
  className = '', 
  children,
  onDragStart,
  onDragOver,
  onDragEnd,
  draggable
}: MemoryTileProps) => {
  const [spanClass, setSpanClass] = useState('')

  useEffect(() => {
    const img = new Image()
    img.src = url
    img.onload = () => {
      const ratio = img.width / img.height
      if (ratio > 1.6) setSpanClass('wide')
      else if (ratio < 0.7) setSpanClass('tall')
      else if (ratio > 1.2 && ratio < 1.6) setSpanClass('large')
    }
  }, [url])

  return (
    <div 
      className={`detail-image-item ${spanClass} ${className}`}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <img src={url} alt={`Memory ${index}`} />
      {children}
    </div>
  )
}

export default MemoryTile
