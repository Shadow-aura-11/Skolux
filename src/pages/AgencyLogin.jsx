import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock, FiUser, FiArrowRight, FiAlertCircle } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function AgencyLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { agencyLogin, agencyUser, error, setError } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (agencyUser) navigate('/agency/dashboard')
  }, [agencyUser, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    const success = agencyLogin(username, password)
    if (success) navigate('/agency/dashboard')
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#0f172a',
      fontFamily: 'Inter, sans-serif'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 400, padding: 20 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ 
            width: 60, height: 60, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', 
            borderRadius: 16, display: 'inline-flex', alignItems: 'center', 
            justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 24, marginBottom: 20
          }}>SX</div>
          <h1 style={{ color: 'white', fontSize: 24, fontWeight: 800 }}>Agency Portal</h1>
          <p style={{ color: '#94a3b8', marginTop: 8 }}>Manage your school ERP deployments</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', padding: 40, borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)' }}>
          {error && (
            <div style={{ background: 'rgba(ef, 44, 44, 0.1)', color: '#f87171', padding: 12, borderRadius: 12, marginBottom: 20, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiAlertCircle /> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: 'white', fontSize: 12, fontWeight: 700, marginBottom: 8, opacity: 0.7 }}>USERNAME</label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="text" 
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError('') }}
                  style={{ width: '100%', padding: '14px 16px 14px 44px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', outline: 'none' }}
                  placeholder="Agency username"
                />
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', color: 'white', fontSize: 12, fontWeight: 700, marginBottom: 8, opacity: 0.7 }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  style={{ width: '100%', padding: '14px 16px 14px 44px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: 'white', outline: 'none' }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" style={{ width: '100%', padding: 16, background: '#6366f1', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              Login to Console <FiArrowRight />
            </button>
          </form>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 14, cursor: 'pointer' }}>
            ← Back to Public Website
          </button>
        </div>
      </motion.div>
    </div>
  )
}
