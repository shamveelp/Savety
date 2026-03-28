import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Auth.css'

const Login = () => {
  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Securely access your memories</p>
        </div>
        <form className="auth-form">
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
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              required 
            />
          </div>
          <button type="submit" className="btn-auth">Sign in</button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Create account</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
