import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiArrowRight, FiCheck, FiBook, FiUsers, FiCalendar, 
  FiSmartphone, FiShield, FiGlobe, FiMapPin, FiMail, FiPhone,
  FiCpu, FiAward, FiMusic, FiLayout, FiSmile, FiActivity, FiHeart, FiTruck
} from 'react-icons/fi'
import { getActiveSchool } from '../config/schools'
import './AgencyHome.css'

const IconMap = {
  FiBook: <FiBook />, FiShield: <FiShield />, FiTruck: <FiTruck />,
  FiCpu: <FiCpu />, FiGlobe: <FiGlobe />, FiSmartphone: <FiSmartphone />,
  FiAward: <FiAward />, FiMusic: <FiMusic />, FiLayout: <FiLayout />,
  FiSmile: <FiSmile />, FiActivity: <FiActivity />, FiHeart: <FiHeart />
}

export default function SchoolLandingPage() {
  const { schoolId } = useParams()
  const [school, setSchool] = useState(null)

  useEffect(() => {
    const config = getActiveSchool()
    setSchool(config)
    window.scrollTo(0, 0)
  }, [schoolId])

  if (!school) return null

  const primaryColor = school.themeColor || '#4f46e5'
  const isDark = school.layout === 'modern'

  return (
    <div className={`school-landing layout-${school.layout}`} style={{ 
      '--school-primary': primaryColor,
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#f8fafc' : '#1e293b',
      minHeight: '100vh',
      fontFamily: 'Outfit, sans-serif'
    }}>
      {/* Header */}
      <nav style={{
        position: 'fixed',
        top: 0, width: '100%',
        background: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0'}`,
        padding: '16px 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 40, height: 40, 
            background: primaryColor, 
            borderRadius: school.layout === 'playful' ? '50%' : 10, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'white', 
            fontWeight: 900 
          }}>
            {school.logo ? <img src={school.logo} alt="logo" style={{ width: '100%' }} /> : school.logoText}
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: isDark ? 'white' : '#0f172a' }}>{school.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#about" style={{ fontWeight: 600, fontSize: 14, color: isDark ? '#94a3b8' : '#64748b', textDecoration: 'none' }}>About</a>
          <a href="#academics" style={{ fontWeight: 600, fontSize: 14, color: isDark ? '#94a3b8' : '#64748b', textDecoration: 'none' }}>Academics</a>
          <Link to={`/${school.key}/erp`} className="btn-3d" style={{ 
            background: primaryColor, 
            color: 'white', 
            padding: '10px 24px', 
            fontSize: 13,
            borderRadius: school.layout === 'playful' ? 100 : 8,
            boxShadow: `0 10px 20px ${primaryColor}40`
          }}>
            ERP Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ 
        padding: '180px 5% 100px', 
        background: isDark 
          ? `radial-gradient(circle at top right, ${primaryColor}15, transparent)`
          : `linear-gradient(135deg, ${primaryColor}05 0%, #ffffff 100%)`,
        textAlign: school.layout === 'premium' ? 'left' : 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: school.layout === 'premium' ? 'flex-start' : 'center'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: school.layout === 'premium' ? 800 : '100%' }}
        >
          <span style={{ 
            color: primaryColor, 
            fontWeight: 800, 
            fontSize: 14, 
            textTransform: 'uppercase', 
            letterSpacing: 2,
            display: 'block',
            marginBottom: 20
          }}>{school.welcomeMessage}</span>
          <h1 style={{ 
            fontSize: 'clamp(40px, 8vw, 72px)', 
            fontWeight: 900, 
            color: isDark ? 'white' : '#0f172a',
            lineHeight: 1.1,
            marginBottom: 30
          }}>{school.tagline || 'Empowering the Next Generation'}</h1>
          <p style={{ 
            fontSize: 20, 
            color: isDark ? '#94a3b8' : '#64748b', 
            maxWidth: 700, 
            margin: school.layout === 'premium' ? '0 0 40px' : '0 auto 40px',
            lineHeight: 1.6
          }}>
            {school.about}
          </p>
          <div style={{ display: 'flex', gap: 20, justifyContent: school.layout === 'premium' ? 'flex-start' : 'center' }}>
            <button className="btn-3d" style={{ 
              background: primaryColor, 
              color: 'white', 
              padding: '16px 40px',
              borderRadius: school.layout === 'playful' ? 100 : 8
            }}>Apply Now</button>
            <button style={{ 
              background: isDark ? 'rgba(255,255,255,0.05)' : 'white', 
              color: isDark ? 'white' : '#0f172a', 
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`, 
              padding: '16px 40px', 
              borderRadius: school.layout === 'playful' || school.layout === 'modern' ? 100 : 8,
              fontWeight: 700,
              cursor: 'pointer'
            }}>Virtual Tour</button>
          </div>
        </motion.div>

        {school.heroImage && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ 
              marginTop: 80, 
              width: '100%', 
              maxWidth: 1100, 
              height: 500, 
              borderRadius: school.layout === 'playful' ? 40 : 24, 
              overflow: 'hidden',
              boxShadow: '0 50px 100px rgba(0,0,0,0.1)'
            }}
          >
            <img src={school.heroImage} alt="Campus" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        )}
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 5%', background: isDark ? '#0f172a' : 'white' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: 40,
          padding: '40px',
          background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
          borderRadius: 30,
          border: isDark ? '1px solid rgba(255,255,255,0.05)' : 'none'
        }}>
          {school.stats?.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: primaryColor }}>{stat.val}</div>
              <div style={{ fontSize: 14, color: isDark ? '#64748b' : '#64748b', fontWeight: 600, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="academics" style={{ padding: '100px 5%', background: isDark ? '#0f172a' : '#ffffff' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: isDark ? 'white' : '#0f172a' }}>Why Choose Us</h2>
          <p style={{ color: isDark ? '#94a3b8' : '#64748b', marginTop: 10 }}>Delivering excellence through specialized focus areas.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {school.features?.map((feat, i) => (
            <div key={i} style={{ 
              padding: 40, 
              borderRadius: 24, 
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}`, 
              background: isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
              transition: '0.3s' 
            }} className="feature-card">
              <div style={{ 
                width: 60, height: 60, 
                background: `${primaryColor}15`, 
                color: primaryColor, 
                borderRadius: school.layout === 'playful' ? '50%' : 16, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: 24, 
                marginBottom: 24 
              }}>
                {IconMap[feat.icon] || <FiCheck />}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: isDark ? 'white' : '#0f172a' }}>{feat.title}</h3>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: 15, lineHeight: 1.6 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Footer */}
      <footer style={{ padding: '100px 5% 40px', background: isDark ? '#020617' : '#0f172a', color: 'white' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 80, marginBottom: 80 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30 }}>
              <div style={{ 
                width: 40, height: 40, 
                background: primaryColor, 
                borderRadius: school.layout === 'playful' ? '50%' : 10, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                color: 'white', fontWeight: 900 
              }}>
                {school.logoText}
              </div>
              <span style={{ fontWeight: 800, fontSize: 20 }}>{school.name}</span>
            </div>
            <p style={{ color: '#94a3b8', lineHeight: 1.6, maxWidth: 400 }}>
              {school.about}
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 25 }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>Admissions</a>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>Academics</a>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>Gallery</a>
              <Link to="/demos" style={{ color: primaryColor, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>Back to Demos</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 25 }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15, color: '#94a3b8', fontSize: 14 }}>
              <div style={{ display: 'flex', gap: 10 }}><FiMapPin style={{ color: primaryColor }} /> 123 Education Lane, Global City</div>
              <div style={{ display: 'flex', gap: 10 }}><FiPhone style={{ color: primaryColor }} /> +91 98765 43210</div>
              <div style={{ display: 'flex', gap: 10 }}><FiMail style={{ color: primaryColor }} /> admissions@{school.key}.edu.in</div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 40, textAlign: 'center', color: '#64748b', fontSize: 12 }}>
          © 2026 {school.name.toUpperCase()}. POWERED BY SKOLUX DIGITAL SYSTEMS.
        </div>
      </footer>
    </div>
  )
}
