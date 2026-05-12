import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { 
  FiArrowRight, FiZap, FiShield, FiCpu, FiGlobe, 
  FiSmartphone, FiActivity, FiLayers, FiCheck, FiMail, 
  FiPhone, FiMapPin, FiTwitter, FiLinkedin, FiGithub,
  FiChevronDown, FiPlus, FiBox, FiCheckCircle, FiClock, FiBook
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import AgencyHeader from '../components/AgencyHeader'
import './AgencyHome.css'

export default function AgencyHome() {
  const [activeFaq, setActiveFaq] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    schoolName: '',
    email: '',
    phone: '',
    message: ''
  })
  
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: targetRef })
  
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -100])
  
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  const simpleServices = [
    { title: "School Website", desc: "Professional, mobile-responsive websites tailored for modern institutions.", icon: <FiGlobe /> },
    { title: "CBSE School Website", desc: "Compliant with CBSE mandatory disclosure norms and OASIS integration.", icon: <FiCheckCircle /> },
    { title: "School ERP System", desc: "Complete management engine for students, staff, and administration.", icon: <FiBox /> },
    { title: "Mobile Apps", desc: "Dedicated Android & iOS apps for parents, teachers, and students.", icon: <FiSmartphone /> },
    { title: "Fee Management", desc: "Automated billing, online payments, and instant receipt generation.", icon: <FiActivity /> },
    { title: "Exam & Results", desc: "Digital marks entry and automatic report card generation.", icon: <FiLayers /> },
    { title: "Attendance & Biometric", desc: "Smart student and staff attendance tracking with biometric support.", icon: <FiClock /> },
    { title: "Library Management", desc: "Digital cataloging, book issuing, and automated fine calculation.", icon: <FiBook /> }
  ]

  const services = [
    { icon: <FiGlobe />, title: "Quantum Web", desc: "Next-gen school websites with sub-second load times and 3D interfaces." },
    { icon: <FiCpu />, title: "Core ERP v2", desc: "Our flagship management engine. Multi-tenant, secure, and incredibly fast." },
    { icon: <FiSmartphone />, title: "Mobile Ecosystem", desc: "Native iOS & Android apps for the entire academic community." },
    { icon: <FiShield />, title: "Fortress Security", desc: "Enterprise-grade encryption for sensitive student and financial data." },
    { icon: <FiLayers />, title: "CBSE OASIS", desc: "Full automation for board mandatory disclosures and OASIS data." },
    { icon: <FiActivity />, title: "Live Analytics", desc: "Deep insights into school performance and fee collection trends." }
  ]

  const plans = [
    { name: "Starter", price: "1.5k", features: ["Basic Website", "CBSE Mandatory Pages", "Email Support"] },
    { name: "Enterprise", price: "5.0k", features: ["Full ERP Engine", "Mobile Apps", "Parent Portal", "24/7 Priority Support"], premium: true },
    { name: "Sovereign", price: "Custom", features: ["Unlimited Subdomains", "Biometric Integration", "Dedicated Success Manager"] }
  ]

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Fetch existing leads first to append
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
    <div className="agency-home" ref={targetRef}>
      {/* Background Layer */}
      <div className="immersive-bg">
        <div className="mesh-grid"></div>
        <motion.div 
          className="floating-object" 
          style={{ width: 600, height: 600, top: '10%', left: '-10%', x: useTransform(smoothProgress, [0, 1], [0, 200]) }}
        ></motion.div>
        <motion.div 
          className="floating-object" 
          style={{ width: 400, height: 400, bottom: '10%', right: '-5%', x: useTransform(smoothProgress, [0, 1], [0, -200]) }}
        ></motion.div>
      </div>

      <AgencyHeader />

      {/* Hero Section */}
      <section className="hero-3d-container">
        <motion.div className="hero-content-wrap" style={{ scale, opacity, y }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span style={{ 
              color: 'var(--primary)', 
              fontWeight: 800, 
              fontSize: 14, 
              textTransform: 'uppercase', 
              letterSpacing: 4,
              display: 'block',
              marginBottom: 20
            }}>The Future of Academic Management</span>
            <h1 className="hero-glitch-title">Digital<br />Excellence</h1>
            <p className="hero-subtitle-3d">
              We engineer the digital backbone of the world's most innovative schools. 
              Deploy your school's future in seconds with our automated cloud infrastructure.
            </p>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
              <Link to="/demos" className="btn-3d">
                Explore Demos <FiArrowRight />
              </Link>
              <a href="#solutions" style={{ 
                color: 'white', 
                fontWeight: 700, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                textDecoration: 'none' 
              }}>
                Our Ecosystem <FiPlus />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* 3D Visual Element */}
        <motion.div 
          className="animate-float"
          style={{ 
            position: 'absolute', 
            bottom: '10%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            color: 'rgba(255,255,255,0.2)'
          }}
        >
          <span style={{ fontSize: 10, letterSpacing: 4, marginBottom: 10 }}>SCROLL TO DISCOVER</span>
          <FiChevronDown />
        </motion.div>
      </section>

      {/* Trusted By Section (Social Proof) */}
      <section style={{ padding: '40px 5%', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-dim)', letterSpacing: 4, textTransform: 'uppercase' }}>Trusted by Leading Institutions</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '60px', opacity: 0.6 }}>
            {[
              "New Morning Star Public School",
              "Delhi Public School (DPS)",
              "Kinder Garden International",
              "St. Xavier's Academy",
              "Global Vision School"
            ].map((brand, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5, display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
                {brand}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Primary Services Section */}
      <section id="services" style={{ padding: '80px 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Our Services</h2>
          <h3 style={{ fontSize: 40, fontWeight: 800 }}>Digital Foundation for your School</h3>
        </div>
        
        <div className="card-3d-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', padding: '0 0 100px 0' }}>
          {simpleServices.map((s, i) => (
            <motion.div 
              key={i} 
              className="glass-card-3d"
              style={{ padding: '40px', borderRadius: '30px' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="card-icon-3d" style={{ width: 60, height: 60, fontSize: 24, marginBottom: 24 }}>{s.icon}</div>
              <h4 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>{s.title}</h4>
              <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Integrated Services Grid */}
      <section id="integrated-services" style={{ padding: '100px 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <h2 className="section-title-huge">Integrated Services</h2>
          <p style={{ color: 'var(--text-dim)', maxWidth: 600, margin: '0 auto' }}>
            A unified suite of tools designed to replace legacy systems and propel your school into the digital age.
          </p>
        </div>

        <div className="card-3d-grid">
          {services.map((s, i) => (
            <motion.div 
              key={i} 
              className="glass-card-3d"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="card-icon-3d">{s.icon}</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>{s.title}</h3>
              <p style={{ color: 'var(--text-dim)', lineHeight: 1.6, fontSize: 15 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section style={{ padding: '120px 5%', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Our Tech Stack</h2>
          <h3 style={{ fontSize: 40, fontWeight: 800 }}>Powering the Future of Education</h3>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
          {[
            { name: "React 18", icon: <FiCpu />, color: "#61dafb", desc: "For ultra-fast, reactive user interfaces." },
            { name: "PHP 8.3", icon: <FiActivity />, color: "#777bb4", desc: "Robust and secure backend processing." },
            { name: "MySQL 8", icon: <FiLayers />, color: "#4479a1", desc: "High-performance data persistence." },
            { name: "Cloud Infrastructure", icon: <FiGlobe />, color: "#0070f3", desc: "99.9% uptime with global edge delivery." },
            { name: "Framer Motion", icon: <FiZap />, color: "#ff0055", desc: "Silky smooth 60FPS web animations." },
            { name: "AES-256", icon: <FiShield />, color: "#10b981", desc: "Military-grade data encryption." }
          ].map((tech, i) => (
            <motion.div 
              key={i}
              className="glass-card-3d"
              style={{ width: 'calc(33% - 24px)', minWidth: 280, padding: 40, textAlign: 'center' }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{ fontSize: 40, color: tech.color, marginBottom: 20, display: 'flex', justifyContent: 'center' }}>{tech.icon}</div>
              <h4 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>{tech.name}</h4>
              <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6 }}>{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured ERP Showcase (Informative Section) */}
      <section style={{ padding: '120px 5%', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 80, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 48, fontWeight: 900, marginBottom: 24 }}>Automation at Scale</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: 18, lineHeight: 1.8, marginBottom: 32 }}>
              Our "1-Step Deployment" technology allows you to launch custom-branded school portals in under 60 seconds. 
              Every deployment comes with its own secure data silo, unique subdomain, and school-specific assets.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                "Instant subdomain provisioning",
                "Dynamic white-labeling engine",
                "Isolated multi-tenant databases",
                "Automated CBSE compliance checks"
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 700 }}>
                  <FiCheck color="var(--primary)" size={20} /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ perspective: 1000 }}>
            <motion.div 
              style={{ 
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                height: 500, 
                borderRadius: 40,
                border: '1px solid rgba(255,255,255,0.1)',
                padding: 40,
                rotateY: -20,
                rotateX: 10
              }}
              whileHover={{ rotateY: 0, rotateX: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div style={{ display: 'flex', gap: 8, marginBottom: 30 }}>
                {[1,2,3].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />)}
              </div>
              <div style={{ width: '40%', height: 10, background: 'var(--primary)', borderRadius: 5, marginBottom: 20 }}></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[1,2,3,4].map(i => <div key={i} style={{ height: 100, background: 'rgba(255,255,255,0.03)', borderRadius: 16 }} />)}
              </div>
              <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 15 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--secondary)', opacity: 0.2 }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ width: '80%', height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 8 }}></div>
                  <div style={{ width: '50%', height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4 }}></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '120px 5%' }}>
        <h2 className="section-title-huge">Simple Economics</h2>
        <div className="pricing-wrap-3d">
          {plans.map((p, i) => (
            <motion.div 
              key={i} 
              className={`price-card-3d ${p.premium ? 'premium' : ''}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: p.premium ? 1.1 : 1 }}
              viewport={{ once: true }}
            >
              <h4 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>{p.name}</h4>
              <div style={{ fontSize: 48, fontWeight: 900, margin: '20px 0' }}>
                {p.price}<span style={{ fontSize: 16, fontWeight: 400, opacity: 0.6 }}>/mo</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '40px 0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 15 }}>
                {p.features.map((f, idx) => (
                  <li key={idx} style={{ fontSize: 14, opacity: 0.8, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FiCheck size={16} /> {f}
                  </li>
                ))}
              </ul>
              <button className="btn-3d" style={{ width: '100%', background: p.premium ? 'white' : 'transparent', color: p.premium ? 'black' : 'white', border: p.premium ? 'none' : '1px solid rgba(255,255,255,0.2)' }}>
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 10%' }}>
        <h2 style={{ textAlign: 'center', fontSize: 40, fontWeight: 900, marginBottom: 60 }}>Common Questions</h2>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {[
            { q: "Can we use our own custom domain?", a: "Yes. While we provide instant subdomains, you can map your own school domains (e.g., portal.your-school.com) easily in the console." },
            { q: "How secure is student data?", a: "We use AES-256 encryption for all data at rest and TLS 1.3 for data in transit. Your records are isolated in private database schemas." },
            { q: "Is training included?", a: "Every enterprise deployment includes a 3-day staff training program and 24/7 technical assistance." }
          ].map((faq, i) => (
            <div key={i} style={{ marginBottom: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 20, overflow: 'hidden' }}>
              <button 
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                style={{ width: '100%', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 800, fontSize: 18 }}
              >
                {faq.q}
                {activeFaq === i ? <FiZap color="var(--primary)" /> : <FiPlus />}
              </button>
              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ padding: '0 32px 24px', color: 'var(--text-dim)', lineHeight: 1.6 }}
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-3d-wrap">
        <div>
          <h2 style={{ fontSize: 64, fontWeight: 900, lineHeight: 1, marginBottom: 24 }}>Let's Build the Future.</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 18, marginBottom: 48 }}>
            Ready to transform your institution? Our team of educational technology experts is ready to assist you.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 50, height: 50, background: 'rgba(255,255,255,0.05)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiMail /></div>
              <span style={{ fontWeight: 700 }}>hello@skolux.io</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 50, height: 50, background: 'rgba(255,255,255,0.05)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiPhone /></div>
              <span style={{ fontWeight: 700 }}>+91 999 888 7777</span>
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

      {/* Footer */}
      <footer style={{ padding: '80px 5%', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 40 }}>
          {[<FiTwitter />, <FiLinkedin />, <FiGithub />].map((icon, i) => (
            <a key={i} href="#" style={{ color: 'var(--text-dim)', fontSize: 20 }}>{icon}</a>
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, letterSpacing: 1 }}>
          © 2026 SKOLUX DIGITAL SYSTEMS. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  )
}
