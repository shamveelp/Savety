import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, type LoginInput } from '../validations/auth.validation'
import { userAuthService } from '../services/user/userAuthApiServices'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import './Auth.css'

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema)
  })

  const onSubmit = async (data: LoginInput) => {
    setLoading(true)
    try {
      const response = await userAuthService.login(data)
      toast.success(response.message || 'Welcome back!')
      
      // Save to localStorage
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
      <Toaster position="top-center" />
      <Navbar />
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
            <input 
              {...register('password')}
              type="password" 
              id="password" 
              placeholder="••••••••" 
              className={errors.password ? 'input-error' : ''}
            />
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
