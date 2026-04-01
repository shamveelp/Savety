import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { User } from '../types/user'
import type { ApiError } from '../types/api'
import { userProfileService } from '../services/user/userProfileApiServices'
import toast from 'react-hot-toast'
import './Profile.css'

const Profile = () => {
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      const profileData = await userProfileService.getProfile()
      setProfile(profileData)
      setUsername(profileData.username)
      setEmail(profileData.email)
    } catch {
      toast.error('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    try {
      const updated = await userProfileService.updateProfile({ username, email })
      setProfile(updated)
      
      const stored = JSON.parse(localStorage.getItem('user') || '{}')
      localStorage.setItem('user', JSON.stringify({ ...stored, username, email }))
      
      toast.success('Profile updated successfully!')
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.response?.data?.message || 'Update failed.')
    } finally {
      setUpdating(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('avatar', file)

    const toastId = toast.loading('Uploading avatar...')
    try {
      const updated = await userProfileService.updateAvatar(formData)
      setProfile(updated)
      toast.success('Avatar updated!', { id: toastId })
    } catch {
      toast.error('Avatar upload failed.', { id: toastId })
    }
  }

  if (loading) return <div className="profile-loading">Loading...</div>

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        <div className="profile-card">
          <h1 className="profile-title">Account Settings</h1>
          
          <div className="avatar-section">
            <div className="avatar-wrapper">
              <img 
                src={profile?.profilePicture || 'https://via.placeholder.com/150'} 
                alt="Avatar" 
                className="profile-avatar"
              />
              <label className="avatar-upload-btn">
                <input type="file" hidden onChange={handleAvatarUpload} accept="image/*" />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4V20M4 12H20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </label>
            </div>
            <div className="avatar-info">
              <h3>{profile?.username}</h3>
              <p>{profile?.email}</p>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="profile-input"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="profile-input"
              />
            </div>
            
            <div className="profile-actions">
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
              <Link to="/change-password" title="change-password" className="btn btn-secondary">
                Change Password
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
