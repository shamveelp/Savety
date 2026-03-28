import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, type LoginInput } from '../validations/auth.validation'
import { userAuthService } from '../services/user/userAuthApiServices'
import toast from 'react-hot-toast'
import './Auth.css'

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema)
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    try {
      const response = await userAuthService.login(data)
      toast.success(response.message || 'Welcome back!')
      
      localStorage.setItem('user', JSON.stringify({
        token: response.token,
        username: response.username,
        email: response.email
      }))

      setTimeout(() => {
        navigate('/')
        window.location.reload()
      }, 1500)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Securely access your memories</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input 
              {...register('email')}
              type="email" 
              id="email" 
              placeholder="name@example.com" 
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input 
                {...register('password')}
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                placeholder="••••••••" 
                className={errors.password ? 'input-error' : ''}
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Create account</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
