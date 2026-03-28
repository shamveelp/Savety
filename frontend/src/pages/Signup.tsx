import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignupSchema, type SignupInput } from '../validations/auth.validation'
import { userAuthService } from '../services/user/userAuthApiServices'
import toast from 'react-hot-toast'
import './Auth.css'

const Signup = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema)
  })

  const onSubmit = async (data: SignupInput) => {
    setLoading(true)
    try {
      const response = await userAuthService.signup(data)
      toast.success(response.message || 'OTP sent to your email!')
      navigate('/verify-otp', { state: { email: data.email } })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create account</h1>
          <p>Join Savety and protect your photos</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              {...register('username')}
              type="text" 
              id="username" 
              placeholder="@username" 
              className={errors.username ? 'input-error' : ''}
            />
            {errors.username && <span className="error-text">{errors.username.message}</span>}
          </div>
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
            <label htmlFor="password">Create Password</label>
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
            {loading ? 'Sending OTP...' : 'Sign up'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
