import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowRight, FiGlobe, FiBox, FiCpu, FiSmartphone, 
  FiShield, FiLayout, FiCheckCircle, FiExternalLink, FiSearch,
  FiActivity, FiLayers, FiDatabase, FiLock, FiAirplay, FiUsers, FiDollarSign, FiZap
} from 'react-icons/fi'
import AgencyHeader from '../components/AgencyHeader'
import './AgencyHome.css'

export default function DemosPage() {
  const [activeTab, setActiveTab] = useState('websites')

  const websiteDemos = [
    {
      title: "New Morning Star",
      type: "Public School",
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800",
      url: "/nms",
      features: ["3D Hero", "Dynamic Notices", "CBSE OASIS"]
    },
    {
      title: "Quantum Academy",
      type: "Modern Institute",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
      url: "/quantum",
      features: ["LMS Integration", "AI Proctoring", "Dark Theme"]
    },
    {
      title: "Heritage International",
      type: "Premium School",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
      url: "/heritage",
      features: ["Alumni Portal", "Fee Automation", "Multi-branch"]
    },
    {
      title: "Starlight Pre-School",
      type: "Kindergarten",
      image: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800",
      url: "/starlight",
      features: ["Parent App", "Live Tracking", "Activity Logs"]
    }
  ]

  const erpModules = [
    { icon: <FiUsers />, title: "Student Management", desc: "Complete 360° view of student academic and personal lifecycle.", color: "#8b5cf6" },
    { icon: <FiActivity />, title: "Live Attendance", desc: "Real-time biometric and app-based attendance tracking.", color: "#ec4899" },
    { icon: <FiDollarSign />, title: "Fee Engine", desc: "Automated billing, reminders, and multiple payment gateway integrations.", color: "#06b6d4" },
    { icon: <FiLayers />, title: "Exam & Results", desc: "Automated report card generation and grade analysis.", color: "#10b981" },
    { icon: <FiSmartphone />, title: "Mobile Apps", desc: "Dedicated apps for parents, teachers, and admins on iOS & Android.", color: "#f59e0b" },
    { icon: <FiShield />, title: "Data Fortress", desc: "Enterprise-grade security with role-based access control.", color: "#6366f1" }
  ]

  const serviceDemos = [
    { title: "Custom Web Dev", desc: "Bespoke web solutions tailored for specific institutional needs.", icon: <FiGlobe /> },
    { title: "Cloud ERP Setup", desc: "Instance-based private cloud deployment for data isolation.", icon: <FiDatabase /> },
    { title: "Mobile Ecosystem", desc: "Complete mobile infrastructure for the academic community.", icon: <FiSmartphone /> },
    { title: "Security Audit", desc: "Rigorous security testing and compliance certification.", icon: <FiLock /> }
  ]

  return (
    <div className="agency-home" style={{ minHeight: '100vh', background: '#020617' }}>
      <AgencyHeader />

      {/* Immersive Background */}
      <div className="immersive-bg">
        <div className="mesh-grid"></div>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 70%)' }}></div>
      </div>

      {/* Futuristic Hero Section */}
      <section style={{ padding: '180px 5% 120px', textAlign: 'center', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, background: 'var(--primary)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1, zIndex: -1 }}
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span style={{ 
            color: 'var(--primary)', 
            fontWeight: 800, 
            fontSize: 14, 
            textTransform: 'uppercase', 
            letterSpacing: 6,
            background: 'rgba(6, 182, 212, 0.1)',
            padding: '8px 24px',
            borderRadius: 100,
            display: 'inline-block',
            marginBottom: 30
          }}>The Demo Ecosystem</span>
          
          <h1 className="hero-glitch-title" style={{ fontSize: 'clamp(40px, 9vw, 110px)', lineHeight: 0.9, letterSpacing: -2 }}>
            Service<br />
            <span style={{ color: 'white', textShadow: '0 0 40px rgba(255,255,255,0.2)' }}>Showcase</span>
          </h1>
          
          <p className="hero-subtitle-3d" style={{ maxWidth: 800, margin: '40px auto', fontSize: 18, color: '#94a3b8' }}>
            Experience the synergy of high-fidelity institutional portals and robust management engines. 
            Deploy your school's future with a single click.
          </p>
        </motion.div>

        {/* Spatial Mockups */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          style={{ 
            marginTop: 80, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: 0, 
            perspective: 2000 
          }}
        >
          {/* Laptop Spatial */}
          <motion.div 
            whileHover={{ rotateY: -5, rotateX: 2, scale: 1.02 }}
            style={{ 
              width: 700, height: 420, background: '#1e293b', 
              borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative', 
              transform: 'rotateX(5deg) rotateY(10deg)', 
              boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 80px rgba(6, 182, 212, 0.1)',
              overflow: 'hidden',
              zIndex: 2
            }}
          >
             <div style={{ width: '100%', height: '100%', background: 'url(/skolux_website_demo_mockup_1778608718523.png) center/cover' }}>
               <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8), transparent)' }}></div>
             </div>
             <div style={{ position: 'absolute', bottom: 30, left: 30, textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                   <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }}></div>
                   <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }}></div>
                   <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }}></div>
                </div>
                <h4 style={{ fontWeight: 900, fontSize: 18 }}>Institutional Web Engine</h4>
                <p style={{ fontSize: 12, opacity: 0.6 }}>CBSE Compliant Portals</p>
             </div>
          </motion.div>

          {/* Phone Spatial */}
          <motion.div 
            whileHover={{ x: 20, rotateY: 5, scale: 1.05 }}
            style={{ 
              width: 200, height: 420, background: 'rgba(15, 23, 42, 0.8)', 
              borderRadius: 40, border: '4px solid #334155',
              padding: 12, marginLeft: -80, transform: 'rotateY(-20deg) translateZ(100px)',
              boxShadow: '0 50px 120px rgba(0,0,0,0.9), 0 0 60px rgba(236, 72, 153, 0.1)',
              zIndex: 3,
              backdropFilter: 'blur(20px)'
            }}
          >
            <div style={{ width: '100%', height: '100%', background: 'url(/skolux_erp_mobile_demo_mockup_1778608734400.png) center/cover', borderRadius: 32 }}></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Glass Tabs Section */}
      <section id="demo-tabs" style={{ padding: '0 5% 150px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 10, 
          background: 'rgba(255,255,255,0.02)',
          padding: 8,
          borderRadius: 100,
          width: 'fit-content',
          margin: '0 auto 80px',
          border: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)'
        }}>
          {[
            { id: 'websites', label: 'Websites', icon: <FiGlobe /> },
            { id: 'erp', label: 'ERP Engine', icon: <FiCpu /> },
            { id: 'services', label: 'Services', icon: <FiAirplay /> }
          ].map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-dim)',
                border: 'none',
                padding: '14px 35px',
                borderRadius: 100,
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: '0.3s all cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeTab === tab.id ? '0 10px 25px rgba(6, 182, 212, 0.4)' : 'none'
              }}
            >
              {tab.icon} {tab.label.toUpperCase()}
            </motion.button>
          ))}
        </div>

        <div className="demos-container" style={{ maxWidth: 1400, margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'websites' && (
              <motion.div 
                key="websites"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 80 }}
              >
                {websiteDemos.map((demo, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="glass-card-3d"
                    style={{ 
                      padding: 40, 
                      display: 'flex', 
                      flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                      gap: 60,
                      alignItems: 'center',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ flex: '1 1 400px', height: 400, borderRadius: 24, overflow: 'hidden', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}>
                      <img src={demo.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(2, 6, 23, 0.8)', padding: '8px 16px', borderRadius: 100, fontSize: 11, fontWeight: 900, color: 'var(--primary)', border: '1px solid var(--primary)', backdropFilter: 'blur(10px)' }}>
                        {demo.type.toUpperCase()}
                      </div>
                    </div>
                    
                    <div style={{ flex: '1 1 400px', padding: '20px 0' }}>
                      <h3 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, marginBottom: 20, lineHeight: 1.1 }}>{demo.title}</h3>
                      <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.8, marginBottom: 40 }}>
                        Experience a premium institutional platform tailored specifically for {demo.type.toLowerCase()} environments. Built with modern web architecture, featuring ultra-fast load times and complete CBSE compliance capabilities.
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 50 }}>
                        {demo.features.map(f => (
                          <span key={f} style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '10px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>{f}</span>
                        ))}
                      </div>
                      <a href={`#${demo.url}`} style={{ 
                        width: 'fit-content', 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: 'white',
                        color: '#0f172a',
                        padding: '18px 45px',
                        borderRadius: '100px',
                        fontWeight: 900,
                        fontSize: '15px',
                        textDecoration: 'none',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        boxShadow: '0 10px 30px rgba(255,255,255,0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)'
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(255,255,255,0.2)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,255,255,0.1)'
                      }}
                      >
                        LIVE PREVIEW <FiExternalLink size={20} />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'erp' && (
              <motion.div 
                key="erp"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24 }}
              >
                {erpModules.map((module, i) => (
                  <motion.div 
                    key={i}
                    className="glass-card-3d"
                    style={{ padding: 40, borderLeft: `4px solid ${module.color}` }}
                  >
                    <div style={{ fontSize: 32, color: module.color, marginBottom: 24 }}>{module.icon}</div>
                    <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>{module.title}</h3>
                    <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: 14, marginBottom: 24 }}>{module.desc}</p>
                    <a href="#/nms/erp" style={{ display: 'flex', alignItems: 'center', gap: 10, color: module.color, textDecoration: 'none', fontWeight: 800, fontSize: 12 }}>
                      LAUNCH MODULE <FiZap />
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div 
                key="services"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30 }}
              >
                {serviceDemos.map((s, i) => (
                  <div key={i} className="glass-card-3d" style={{ padding: 40, textAlign: 'center' }}>
                    <div className="card-icon-3d" style={{ margin: '0 auto 24px' }}>{s.icon}</div>
                    <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 12 }}>{s.title}</h3>
                    <p style={{ color: '#94a3b8', fontSize: 14 }}>{s.desc}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <footer style={{ padding: '100px 5% 40px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <div style={{ color: '#475569', fontSize: 11, letterSpacing: 4, fontWeight: 800 }}>
          © 2026 SKOLUX // ENGINEERED FOR EXCELLENCE
        </div>
      </footer>
    </div>
  )
}
