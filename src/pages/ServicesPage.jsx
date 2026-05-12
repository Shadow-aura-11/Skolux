import React from 'react'
import { motion } from 'framer-motion'
import { 
  FiGlobe, FiCpu, FiSmartphone, FiShield, 
  FiLayers, FiActivity, FiArrowRight, FiCheckCircle,
  FiBox, FiBook, FiClock, FiDatabase
} from 'react-icons/fi'
import AgencyHeader from '../components/AgencyHeader'
import './AgencyHome.css'

export default function ServicesPage() {
  const services = [
    { 
      icon: <FiGlobe />, 
      title: "School Website Development", 
      desc: "High-performance, CBSE-compliant websites designed to showcase your institution's excellence and manage mandatory public disclosures seamlessly.",
      features: ["3D Hero Sections", "OASIS Integration", "Dynamic News Tickers", "Document Repository"]
    },
    { 
      icon: <FiCpu />, 
      title: "Enterprise School ERP", 
      desc: "A multi-tenant cloud engine that automates everything from student admissions to staff payroll and exam management.",
      features: ["Student Lifecycle", "Staff Management", "Fee Automation", "Result Generation"]
    },
    { 
      icon: <FiSmartphone />, 
      title: "Mobile Ecosystem", 
      desc: "Native Android and iOS applications that keep parents, teachers, and administrators connected in real-time.",
      features: ["Live Attendance", "Instant Notices", "Online Fee Payment", "Homework Tracking"]
    },
    { 
      icon: <FiShield />, 
      title: "Digital Security Audit", 
      desc: "Comprehensive security protocols to protect sensitive student data and financial records with enterprise-grade encryption.",
      features: ["Role-Based Access", "Data Backups", "SSL Certification", "Encrypted Transactions"]
    },
    { 
      icon: <FiLayers />, 
      title: "CBSE Compliance Tech", 
      desc: "Specialized tools to ensure your school meets all board mandates, from Saral/OASIS data to infrastructure disclosure.",
      features: ["Auto-Disclosure Tabs", "Mandatory Portals", "Affiliation Automation", "Safety Cert Logs"]
    },
    { 
      icon: <FiActivity />, 
      title: "Data Analytics & BI", 
      desc: "Visual dashboards that help school leaders make data-driven decisions regarding enrollment and academic performance.",
      features: ["Performance Logs", "Fee Trends", "Inventory Tracking", "Staff Analytics"]
    }
  ]

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
          <span style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: 4, textTransform: 'uppercase', fontSize: 13 }}>Core Competencies</span>
          <h1 className="hero-glitch-title" style={{ fontSize: 'clamp(40px, 8vw, 90px)', margin: '20px 0' }}>Our Services</h1>
          <p className="hero-subtitle-3d" style={{ maxWidth: 800, margin: '0 auto' }}>
            We provide the end-to-end digital infrastructure required to run a world-class educational institution. 
            From public-facing web experiences to internal management engines.
          </p>
        </motion.div>
      </section>

      <section style={{ padding: '100px 8%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 40 }}>
          {services.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="feature-card-3d"
              style={{ background: 'rgba(255,255,255,0.02)', padding: 50, borderRadius: 32, border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ color: 'var(--primary)', fontSize: 40, marginBottom: 30 }}>{s.icon}</div>
              <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 20 }}>{s.title}</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: 30 }}>{s.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {s.features.map((f, j) => (
                  <span key={j} style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--primary)', padding: '6px 15px', borderRadius: 100, fontSize: 11, fontWeight: 800 }}>{f}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ padding: '100px 8%', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 30 }}>Ready to Digitally Transform?</h2>
        <p style={{ color: '#94a3b8', marginBottom: 50 }}>Join 100+ institutions that have redefined their administrative workflow with Skolux.</p>
        <button className="btn-3d" style={{ padding: '20px 60px', fontSize: 16 }}>Request a Consultation</button>
      </section>

      <footer style={{ padding: '100px 8% 40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ textAlign: 'center', color: '#475569', fontSize: 12, letterSpacing: 4, fontWeight: 800 }}>
          © 2026 SKOLUX // DIGITAL SOVEREIGNTY FOR SCHOOLS
        </div>
      </footer>
    </div>
  )
}
