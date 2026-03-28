import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Auth.css'

const Signup = () => {
  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create account</h1>
          <p>Join Savety and protect your photos</p>
        </div>
        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              placeholder="John Doe" 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="name@example.com" 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Create Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              required 
            />
          </div>
          <button type="submit" className="btn-auth">Sign up</button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
