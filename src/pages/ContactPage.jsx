import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiCheckCircle, FiZap, FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi'
import { api } from '../utils/api'
import AgencyHeader from '../components/AgencyHeader'
import './AgencyHome.css'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    schoolName: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const existingLeads = await api.get('leads', 'agency_global')
      const leads = Array.isArray(existingLeads) ? existingLeads : []
      
      const newLead = {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString(),
        status: 'new'
      }
      
      await api.save('leads', [newLead, ...leads], 'agency_global')
      setSubmitted(true)
      setFormData({ name: '', schoolName: '', email: '', phone: '', message: '' })
    } catch (error) {
      console.error("Lead submission failed:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="agency-home" style={{ minHeight: '100vh' }}>
      <div className="immersive-bg">
        <div className="mesh-grid"></div>
      </div>

      <AgencyHeader />

      <section style={{ padding: '180px 8% 100px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: 4, textTransform: 'uppercase', fontSize: 13 }}>Get in Touch</span>
          <h1 className="hero-glitch-title" style={{ fontSize: 'clamp(40px, 8vw, 90px)', margin: '20px 0' }}>Contact Us</h1>
          <p className="hero-subtitle-3d" style={{ maxWidth: 800, margin: '0 auto' }}>
            Ready to transform your institution? Our team of educational technology experts is ready to assist you. Let's build the future together.
          </p>
        </motion.div>
      </section>

      <section className="contact-3d-wrap" style={{ paddingTop: 0 }}>
        <div>
          <h2 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>Reach out to Skolux.</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 18, marginBottom: 48 }}>
            Whether you need a custom web portal, a full ERP suite, or just have a question about our pricing, we're here to help.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 50, height: 50, background: 'rgba(255,255,255,0.05)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiMail size={20} color="var(--primary)" /></div>
              <span style={{ fontWeight: 700, fontSize: 16 }}>hello@skolux.io</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 50, height: 50, background: 'rgba(255,255,255,0.05)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiPhone size={20} color="var(--primary)" /></div>
              <span style={{ fontWeight: 700, fontSize: 16 }}>+91 999 888 7777</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 50, height: 50, background: 'rgba(255,255,255,0.05)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiMapPin size={20} color="var(--primary)" /></div>
              <span style={{ fontWeight: 700, fontSize: 16 }}>100 Cyber Hub, New Delhi</span>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: 60, borderRadius: 40, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence>
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '40px 0' }}
              >
                <div style={{ width: 80, height: 80, background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 40 }}>
                  <FiCheckCircle />
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Transmission Complete</h3>
                <p style={{ color: 'var(--text-dim)', marginBottom: 32 }}>Our deployment team will reach out to you within 12 cycles.</p>
                <button onClick={() => setSubmitted(false)} className="btn-3d" style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}>Send Another</button>
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <input 
                  className="input-3d" 
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required 
                />
                <input 
                  className="input-3d" 
                  placeholder="School Name" 
                  value={formData.schoolName}
                  onChange={e => setFormData({...formData, schoolName: e.target.value})}
                  required 
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <input 
                    className="input-3d" 
                    type="email" 
                    placeholder="Work Email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                  <input 
                    className="input-3d" 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    required 
                  />
                </div>
                <textarea 
                  className="input-3d" 
                  placeholder="Tell us about your school needs" 
                  rows={4} 
                  style={{ resize: 'none' }}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  required
                ></textarea>
                <button 
                  type="submit" 
                  className="btn-3d" 
                  style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
                  disabled={loading}
                >
                  {loading ? 'Transmitting...' : 'Initiate Deployment'} <FiZap />
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </section>

      <footer style={{ padding: '80px 5% 40px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 40 }}>
          {[<FiTwitter />, <FiLinkedin />, <FiGithub />].map((icon, i) => (
            <a key={i} href="#" style={{ color: 'var(--text-dim)', fontSize: 20 }}>{icon}</a>
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, letterSpacing: 1, fontWeight: 800 }}>
          © 2026 SKOLUX DIGITAL SYSTEMS. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  )
}
