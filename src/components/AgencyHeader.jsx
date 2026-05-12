import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiBox } from 'react-icons/fi'

export default function AgencyHeader() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <motion.nav 
      className="agency-nav"
      initial={{ y: -100, x: '-50%' }}
      animate={{ y: 0, x: '-50%' }}
      transition={{ delay: 0.2, type: 'spring' }}
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '1200px',
        background: 'rgba(2, 6, 23, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '12px 32px',
        borderRadius: '100px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'white' }}>
        <FiBox size={24} color="var(--primary)" />
        <span style={{ fontWeight: 900, fontSize: 20 }}>SKO<span style={{ color: 'var(--primary)' }}>LUX</span></span>
      </Link>
      
      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        <Link to="/" style={{ fontWeight: 400, fontSize: 14, color: location.pathname === '/' ? 'var(--primary)' : 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/services" style={{ fontWeight: 400, fontSize: 14, color: location.pathname === '/services' ? 'var(--primary)' : 'white', textDecoration: 'none' }}>Services</Link>
        <Link to="/demos" style={{ fontWeight: 400, fontSize: 14, color: location.pathname === '/demos' ? 'var(--primary)' : 'white', textDecoration: 'none' }}>Demos</Link>
        {isHome && <a href="#pricing" style={{ fontWeight: 400, fontSize: 14, color: 'white', textDecoration: 'none' }}>Pricing</a>}
        <Link to="/contact" style={{ fontWeight: 400, fontSize: 14, color: location.pathname === '/contact' ? 'var(--primary)' : 'white', textDecoration: 'none' }}>Contact</Link>
        <Link to="/agency/login" style={{ fontWeight: 400, fontSize: 14, color: 'white', textDecoration: 'none' }}>Console</Link>
        <a href="#/nms/erp" className="btn-3d" style={{ padding: '8px 20px', fontSize: 13, textDecoration: 'none' }}>
          Live Demo
        </a>
      </div>
    </motion.nav>
  )
}
