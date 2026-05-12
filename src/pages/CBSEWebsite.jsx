import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, 
  FiYoutube, FiChevronDown, FiArrowRight, FiCheckCircle, FiClock,
  FiBookOpen, FiUsers, FiAward, FiInfo, FiFileText, FiCamera, FiExternalLink
} from 'react-icons/fi'
import { getActiveSchool } from '../config/schools'
import './AgencyHome.css'

export default function CBSEWebsite() {
  const { schoolId } = useParams()
  const [school, setSchool] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState('Home')

  useEffect(() => {
    const config = getActiveSchool()
    setSchool(config)
    
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [schoolId])

  if (!school) return null

  const primaryColor = school.themeColor || '#4f46e5'

  const NavItem = ({ label, children }) => (
    <div className="nav-item-dropdown" style={{ position: 'relative', cursor: 'pointer' }}>
      <div 
        onClick={() => setActiveTab(label)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 6, 
          fontSize: 14, 
          fontWeight: 700, 
          color: activeTab === label ? primaryColor : '#1e293b',
          padding: '10px 0'
        }}
      >
        {label} {children && <FiChevronDown size={12} />}
      </div>
      {children && (
        <div className="dropdown-content">
          {children.map((item, i) => (
            <div key={i} className="dropdown-link">{item}</div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="cbse-site" style={{ '--school-primary': primaryColor, background: '#fff' }}>
      {/* Top Bar */}
      <div style={{ background: primaryColor, color: 'white', padding: '8px 5%', display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600 }}>
        <div style={{ display: 'flex', gap: 20 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiPhone size={14} /> +91 98765 43210</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiMail size={14} /> info@{schoolId}.edu.in</span>
        </div>
        <div style={{ display: 'flex', gap: 15 }}>
          <FiFacebook /> <FiTwitter /> <FiInstagram /> <FiYoutube />
        </div>
      </div>

      {/* Main Header */}
      <header style={{ 
        position: scrolled ? 'fixed' : 'relative', 
        top: 0, width: '100%', 
        background: 'white', 
        boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.1)' : 'none',
        zIndex: 1000,
        transition: '0.3s'
      }}>
        <div style={{ padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <div style={{ width: 60, height: 60, background: primaryColor, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 24 }}>
              {school.logoText}
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: 0 }}>{school.name.toUpperCase()}</h1>
              <p style={{ fontSize: 12, color: '#64748b', fontWeight: 700, letterSpacing: 1 }}>AFFILIATED TO CBSE, NEW DELHI | CODE: 123456</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 25, alignItems: 'center' }}>
            <NavItem label="Home" />
            <NavItem label="About Us" children={['Vision & Mission', 'Principal\'s Desk', 'Management', 'Mandatory Disclosure']} />
            <NavItem label="Academics" children={['Curriculum', 'Faculty', 'Academic Calendar', 'Book List']} />
            <NavItem label="Admissions" children={['Process', 'Fee Structure', 'Registration Form']} />
            <NavItem label="Facilities" children={['Smart Classes', 'Laboratories', 'Library', 'Sports']} />
            <Link to={`/${schoolId}/erp`} className="btn-3d" style={{ background: primaryColor, color: 'white', padding: '10px 25px', fontSize: 13 }}>ERP LOGIN</Link>
          </div>
        </div>
      </header>

      {/* News Ticker */}
      <div style={{ background: '#f1f5f9', padding: '10px 5%', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 20, alignItems: 'center' }}>
        <span style={{ background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 800 }}>LATEST NEWS</span>
        <marquee style={{ fontSize: 13, color: '#1e293b', fontWeight: 600 }}>
          • Admissions open for Academic Session 2026-27 • Annual Day "Aarohan" to be held on 25th Dec • Board Exam practicals starting from Jan 15th • Congratulations to our toppers!
        </marquee>
      </div>

      {/* Hero Slider Area */}
      <section style={{ position: 'relative', height: 600, overflow: 'hidden' }}>
        <div style={{ width: '100%', height: '100%', background: 'url(https://images.unsplash.com/photo-1523050335392-9bef867a0578?auto=format&fit=crop&q=80&w=1200) center/cover' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7), transparent)' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: '5%', transform: 'translateY(-50%)', color: 'white', maxWidth: 600 }}>
            <motion.h2 initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>Nurturing Minds,<br /><span style={{ color: primaryColor }}>Shaping Futures.</span></motion.h2>
            <p style={{ fontSize: 18, color: '#cbd5e1', marginBottom: 40, lineHeight: 1.6 }}>Empowering every student to reach their full potential through personalized learning and global exposure.</p>
            <div style={{ display: 'flex', gap: 20 }}>
              <button className="btn-3d" style={{ background: primaryColor, color: 'white', padding: '16px 40px' }}>ADMISSION OPEN</button>
              <button style={{ border: '2px solid white', background: 'transparent', color: 'white', padding: '16px 40px', borderRadius: 100, fontWeight: 700 }}>VIRTUAL TOUR</button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section style={{ padding: '0 5%', marginTop: -60, position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[
            { label: 'Online Fee Payment', icon: <FiCheckCircle />, color: '#0ea5e9' },
            { label: 'Academic Calendar', icon: <FiClock />, color: '#8b5cf6' },
            { label: 'CBSE Disclosure', icon: <FiFileText />, color: '#10b981' },
            { label: 'Mandatory Public Disclosure', icon: <FiAward />, color: '#f59e0b' }
          ].map((item, i) => (
            <div key={i} style={{ 
              background: 'white', padding: '30px', borderRadius: 16, 
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center',
              borderBottom: `4px solid ${item.color}`, cursor: 'pointer', transition: '0.3s'
            }} className="quick-access-card">
              <div style={{ color: item.color, fontSize: 32, marginBottom: 15 }}>{item.icon}</div>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{item.label}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Principal's Message */}
      <section style={{ padding: '100px 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 80, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600" alt="Principal" style={{ width: '100%', borderRadius: 24, boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }} />
            <div style={{ position: 'absolute', bottom: -30, right: -30, background: primaryColor, color: 'white', padding: '30px', borderRadius: 20 }}>
              <h4 style={{ margin: 0, fontSize: 20 }}>Dr. Sarah Johnson</h4>
              <p style={{ margin: 0, opacity: 0.8, fontSize: 13 }}>Principal, {school.name}</p>
            </div>
          </div>
          <div>
            <span style={{ color: primaryColor, fontWeight: 800, letterSpacing: 2 }}>MESSAGE FROM THE DESK</span>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', marginTop: 10, marginBottom: 25 }}>Principal's Address</h2>
            <p style={{ fontSize: 17, color: '#64748b', lineHeight: 1.8, fontStyle: 'italic' }}>
              "Welcome to {school.name}. We believe that education is not just about books but about character, 
              creativity, and compassion. Our mission is to provide an environment where students can discover 
              their unique talents and grow into responsible global citizens."
            </p>
            <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.8, marginTop: 20 }}>
              Our institution follows the CBSE curriculum with a focus on holistic development. We integrate 
              technology with traditional pedagogy to ensure our students are well-equipped for the challenges 
               of the 21st century.
            </p>
            <button style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: 10, color: primaryColor, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
              READ FULL MESSAGE <FiArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Infrastructure Showcase */}
      <section style={{ padding: '100px 5%', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#0f172a' }}>World-Class Facilities</h2>
          <p style={{ color: '#64748b', marginTop: 10 }}>Providing a safe and stimulating environment for learning.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
          {[
            { title: 'Smart Classrooms', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800', desc: 'Digitally enabled classrooms for interactive learning.' },
            { title: 'Science Laboratories', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800', desc: 'Well-equipped Physics, Chemistry, and Biology labs.' },
            { title: 'Library & Reading Room', img: 'https://images.unsplash.com/photo-1507738911719-21763d470407?auto=format&fit=crop&q=80&w=800', desc: 'A vast collection of books and digital journals.' }
          ].map((item, i) => (
            <div key={i} className="facility-card" style={{ background: 'white', borderRadius: 24, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <div style={{ height: 250, overflow: 'hidden' }}>
                <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: 30 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mandatory Public Disclosure (CBSE Section) */}
      <section style={{ padding: '80px 5%', background: primaryColor }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 900, margin: 0 }}>CBSE Mandatory Public Disclosure</h2>
            <p style={{ opacity: 0.8, marginTop: 5 }}>All documents and information are up-to-date as per CBSE norms.</p>
          </div>
          <button style={{ background: 'white', color: primaryColor, padding: '16px 40px', borderRadius: 100, fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            VIEW DOCUMENTS <FiExternalLink />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: 'white', padding: '100px 5% 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 60, marginBottom: 80 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 30 }}>
              <div style={{ width: 45, height: 45, background: primaryColor, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }}>{school.logoText}</div>
              <h2 style={{ fontSize: 24, fontWeight: 900 }}>{school.name}</h2>
            </div>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: 14 }}>
              Providing world-class education with a focus on value-based learning and technological integration. 
              Join us in our journey of academic excellence.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 25 }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: '#94a3b8', fontSize: 14 }}>
              <span>Home</span> <span>About Us</span> <span>CBSE Disclosure</span> <span>ERP Portal</span>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 25 }}>Academics</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: '#94a3b8', fontSize: 14 }}>
              <span>Curriculum</span> <span>Faculty</span> <span>Book List</span> <span>Holiday List</span>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 25 }}>Contact Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15, color: '#94a3b8', fontSize: 13 }}>
              <div style={{ display: 'flex', gap: 10 }}><FiMapPin style={{ color: primaryColor }} /> Education Street, Sector 12, New Delhi</div>
              <div style={{ display: 'flex', gap: 10 }}><FiPhone style={{ color: primaryColor }} /> +91 98765 43210</div>
              <div style={{ display: 'flex', gap: 10 }}><FiMail style={{ color: primaryColor }} /> admissions@{schoolId}.edu.in</div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.05)', color: '#64748b', fontSize: 12 }}>
          © 2026 {school.name.toUpperCase()}. ALL RIGHTS RESERVED. POWERED BY SKOLUX.
        </div>
      </footer>

      <style>{`
        .nav-item-dropdown:hover .dropdown-content { display: block; }
        .dropdown-content {
          display: none; position: absolute; top: 100%; left: 0; 
          background: white; min-width: 200px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          padding: 10px 0; border-radius: 8px; border-top: 3px solid var(--school-primary);
        }
        .dropdown-link { padding: 10px 20px; font-size: 13px; color: #64748b; font-weight: 600; }
        .dropdown-link:hover { background: #f8fafc; color: var(--school-primary); }
        .quick-access-card:hover { transform: translateY(-10px); }
        .facility-card:hover img { transform: scale(1.1); }
        marquee { font-family: 'Outfit', sans-serif; }
      `}</style>
    </div>
  )
}
