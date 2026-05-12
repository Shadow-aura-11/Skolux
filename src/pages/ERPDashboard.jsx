import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  FiLogIn, FiLock, FiUser, FiShield, FiBookOpen, FiUsers,
  FiCheckCircle, FiAlertCircle, FiEye, FiEyeOff, FiArrowRight
} from 'react-icons/fi'
import './ERP.css'

const ROLE_INFO = {
  admin: { icon: <FiShield />, color: '#4f46e5', bg: '#eef2ff', label: 'Administrator', hint: 'admin / admin123' },
  teacher: { icon: <FiUser />, color: '#10b981', bg: '#ecfdf5', label: 'Teacher', hint: 'teacher / teacher123' },
}

export default function ERPLogin() {
  const [activeRole, setActiveRole] = useState('admin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, error, setError, user, school } = useAuth()
  const navigate = useNavigate()

  // if already logged in, redirect to dashboard
  useEffect(() => {
    if (user) navigate(`/${school.key}/erp/dashboard`)
  }, [user, navigate, school.key])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // simulate small delay for realism
    setTimeout(() => {
      const success = login(username, password)
      setLoading(false)
      if (success) navigate(`/${school.key}/erp/dashboard`)
    }, 600)
  }

  const fillCredentials = (role) => {
    setActiveRole(role)
    setUsername('')
    setPassword('')
    setError('')
  }

  const info = ROLE_INFO[activeRole]

  return (
    <>
      <Helmet>
        <title>{school.name} - ERP Login</title>
        <meta name="description" content={`Login to the ${school.name} ERP portal.`} />
      </Helmet>

      <div className="erp-login-page">
        {/* Left Panel */}
        <div className="erp-login-left" style={{ background: `linear-gradient(135deg, ${school.themeColor}, ${school.themeColor}dd)` }}>
          <div className="erp-login-left-content">
            <div className="erp-login-brand">
              <div className="dash-logo-icon" style={{ width: 56, height: 56, fontSize: '18px', background: 'white', color: school.themeColor, overflow: 'hidden' }}>
                {school.logo ? <img src={school.logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="logo" /> : school.logoText}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700 }}>{school.name}</div>
                <div style={{ fontSize: 'var(--text-sm)', opacity: 0.7 }}>School ERP Portal</div>
              </div>
            </div>

            <h1 className="erp-login-heading">
              {school.welcomeMessage}<br />Management System
            </h1>
            <p className="erp-login-subtext">
              Access attendance, fees, exams, timetable, homework, and more through our integrated digital platform for {school.shortName}.
            </p>

            <div className="erp-login-features">
              {[
                'Real-time attendance tracking',
                'Online fee payment',
                'Exam results & report cards',
                'Teacher-parent messaging',
                'Homework management',
                'Transport tracking',
              ].map((f, i) => (
                <div key={i} className="erp-login-feature">
                  <FiCheckCircle /> {f}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 40, padding: 25, background: 'rgba(255,255,255,0.1)', borderRadius: 20, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>System Security Note:</div>
              <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.6 }}>
                This is a secure academic portal. All login attempts are logged for security auditing.
                Please contact the IT administrator if you encounter any issues accessing your account.
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="erp-login-right">
          <motion.div
            className="erp-login-form-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Role Tabs */}
            <div className="erp-role-tabs">
              {Object.entries(ROLE_INFO).map(([role, ri]) => (
                <button
                  key={role}
                  onClick={() => fillCredentials(role)}
                  className={`erp-role-tab ${activeRole === role ? 'active' : ''}`}
                  style={{ '--tab-color': ri.color, '--tab-bg': ri.bg }}
                >
                  {ri.icon}
                  <span>{ri.label}</span>
                </button>
              ))}
            </div>

            <div className="erp-login-card-new">
              <div className="erp-login-card-header">
                <div className="erp-login-icon" style={{ background: info.bg, color: info.color }}>
                  {info.icon}
                </div>
                <h2>{info.label} Login</h2>
                <p>Enter your credentials to access the portal</p>
              </div>

              {error && (
                <div className="erp-login-error">
                  <FiAlertCircle /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Username / ID</label>
                  <div className="erp-input-wrapper">
                    <FiUser className="erp-input-icon" />
                    <input
                      className="form-input erp-input"
                      placeholder={`Enter ${activeRole} username`}
                      required
                      value={username}
                      onChange={e => { setUsername(e.target.value); setError('') }}
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="erp-input-wrapper">
                    <FiLock className="erp-input-icon" />
                    <input
                      className="form-input erp-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      required
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError('') }}
                      autoComplete="new-password"
                    />
                    <button type="button" className="erp-pass-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                  <a href="#" style={{ fontSize: 'var(--text-sm)', color: info.color, fontWeight: 600 }}>
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full erp-submit-btn"
                  style={{ background: `linear-gradient(135deg, ${info.color}, ${info.color}dd)` }}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="erp-spinner" />
                  ) : (
                    <><FiLogIn /> Login to {info.label} Portal</>
                  )}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--gray-400)' }}>
                © 2026 Skolux Digital Systems. All rights reserved.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
