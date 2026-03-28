import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignupSchema, type SignupInput } from '../validations/auth.validation'
import { userAuthService } from '../services/user/userAuthApiServices'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import './Auth.css'

const Signup = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema)
  })

  const onSubmit = async (data: SignupInput) => {
    setLoading(true)
    try {
      const response = await userAuthService.signup(data)
      toast.success(response.message || 'OTP sent to your email!')
      // Redirect to OTP Verification, passing email in state
      navigate('/verify-otp', { state: { email: data.email } })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
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
