import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { OTPVerifySchema, type OTPVerifyInput } from '../validations/auth.validation'
import { userAuthService } from '../services/user/userAuthApiServices'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import './Auth.css'

const OTPVerification = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const email = location.state?.email

  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please signup again.')
      navigate('/signup')
    }
  }, [email, navigate])

  const { register, handleSubmit, formState: { errors } } = useForm<OTPVerifyInput>({
    resolver: zodResolver(OTPVerifySchema)
  })

  const onSubmit = async (data: OTPVerifyInput) => {
    setLoading(true)
    try {
      const response = await userAuthService.verifyOTP(email, data.otp)
      toast.success('Account verified successfully!')
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify({
        token: response.token,
        id: response.id,
        username: response.username,
        email: response.email
      }))

      // Redirect to home after 1.5s
      setTimeout(() => {
        navigate('/')
        window.location.reload() // Refresh to update navbar
      }, 1500)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.')
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
          <h1>Verify Email</h1>
          <p>Enter the 6-digit code sent to <br/><strong>{email}</strong></p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="otp">One-Time Password</label>
            <input 
              {...register('otp')}
              type="text" 
              id="otp" 
              placeholder="000000" 
              maxLength={6}
              className={errors.otp ? 'input-error' : ''}
              autoFocus
            />
            {errors.otp && <span className="error-text">{errors.otp.message}</span>}
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>
        <div className="auth-footer">
          Didn't receive the code? <button onClick={() => toast('Feature coming soon!')} style={{ background: 'none', border: 'none', color: 'var(--primary-green)', cursor: 'pointer', fontWeight: 600 }}>Resend code</button>
        </div>
      </div>
    </div>
  )
}

export default OTPVerification
