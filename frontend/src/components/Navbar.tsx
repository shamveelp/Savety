import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const [user, setUser] = useState<any>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Parse error", e)
      }
    }

    // Click outside listener
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setIsDropdownOpen(false)
    navigate('/login')
  }

  return (
    <nav className="floating-navbar">
      <div className="nav-left">
        <Link to="/" className="logo">savety</Link>
      </div>
      <div className="nav-center">
        <Link to="/pricing">Pricing</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/about">About</Link>
        <Link to="/download">Download</Link>
        <Link to="/help">Help</Link>
      </div>
      <div className="nav-right">
        <a href="https://github.com/savety" target="_blank" rel="noopener noreferrer" className="github-link">
          <svg height="20" viewBox="0 0 16 16" width="20" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          <span>25k</span>
        </a>
        {user ? (
          <div className="nav-user-dropdown" ref={dropdownRef}>
            <button 
              className={`user-btn ${isDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>@{user.username}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`chevron ${isDropdownOpen ? 'rotate' : ''}`}>
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Profile</Link>
                <Link to="/settings" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Settings</Link>
                <button onClick={handleLogout} className="dropdown-item logout">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signup" className="btn btn-primary small">Sign up</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
