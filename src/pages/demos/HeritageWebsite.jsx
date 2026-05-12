import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiPhone, FiMail, FiMapPin, FiArrowRight, FiCheckCircle, 
  FiDownload, FiFileText, FiAward, FiUsers, FiClock, FiBookOpen,
  FiTarget, FiShield, FiHeart, FiCamera, FiExternalLink, FiStar, FiCalendar, FiTrendingUp,
  FiInfo, FiLayers, FiList, FiSearch, FiHelpCircle, FiClock as FiTime, FiSmile, FiCompass
} from 'react-icons/fi'

export default function HeritageWebsite() {
  const gold = "#b45309" // Amber/Gold
  const dark = "#0f172a" // Slate
  const [activeTab, setActiveTab] = useState('Home')
  const [cbseSubTab, setCbseSubTab] = useState('General')

  const EditorialTitle = ({ subtitle, title, centered = false }) => (
    <div style={{ textAlign: centered ? 'center' : 'left', marginBottom: 60 }}>
      <span style={{ color: gold, fontWeight: 700, letterSpacing: 4, fontSize: 12, textTransform: 'uppercase' }}>{subtitle}</span>
      <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, fontFamily: "'Playfair Display', serif", color: dark, marginTop: 10, fontStyle: 'italic' }}>{title}</h2>
      <div style={{ width: 50, height: 1, background: gold, margin: centered ? '20px auto 0' : '20px 0 0' }}></div>
    </div>
  )

  const renderContent = () => {
    switch(activeTab) {
      case 'About':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '100px 0' }}>
            {/* 1. The Heritage Legacy */}
            <div style={{ padding: '0 8%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 100, marginBottom: 150 }}>
               <div>
                  <EditorialTitle subtitle="Our Narrative" title="A Legacy of Excellence" />
                  <p style={{ fontSize: 18, lineHeight: 2, color: '#475569', fontFamily: "'Libre Baskerville', serif" }}>
                    Heritage International was founded with a singular purpose: to preserve the classical values of education while preparing students for the complexities of the modern world. 
                    Our legacy is defined by the leaders, thinkers, and artists who have walked our halls.
                  </p>
               </div>
               <img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800" style={{ width: '100%', height: 500, objectFit: 'cover', borderRadius: 4 }} />
            </div>

            {/* 2. Governance: Board of Governors */}
            <div style={{ padding: '0 8%', marginBottom: 150 }}>
               <EditorialTitle subtitle="Leadership" title="The Board of Governors" centered />
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 50 }}>
                 {[
                   { name: 'Lord Julian Sterling', role: 'Chairman', bio: 'Former advisor to the Educational Council with 30 years of governance experience.' },
                   { name: 'Dr. Elizabeth Moore', role: 'Director', bio: 'Oxford alumna specializing in institutional development and classical curricula.' },
                   { name: 'Sir Robert Vance', role: 'Principal', bio: 'Recipient of the National Excellence Award for Pedagogy and Student Care.' }
                 ].map((m, i) => (
                   <div key={i} style={{ textAlign: 'center' }}>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: '0 0 5px' }}>{m.name}</h4>
                      <p style={{ color: gold, fontWeight: 700, fontSize: 11, letterSpacing: 2, marginBottom: 20 }}>{m.role.toUpperCase()}</p>
                      <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8 }}>{m.bio}</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* 3. Philosophical Pillars */}
            <div style={{ padding: '120px 8%', background: '#f8fafc', marginBottom: 150 }}>
               <EditorialTitle subtitle="The Ethos" title="Philosophical Pillars" centered />
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40 }}>
                 {['Classical Wisdom', 'Moral Integrity', 'Global Outlook', 'Artistic Pursuit'].map(v => (
                   <div key={v} style={{ textAlign: 'center' }}>
                      <div style={{ width: 60, height: 60, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: gold, boxShadow: '0 10px 20px rgba(0,0,0,0.03)' }}>
                         <FiShield />
                      </div>
                      <h5 style={{ fontWeight: 800, fontSize: 15 }}>{v}</h5>
                   </div>
                 ))}
               </div>
            </div>

            {/* 4. Historical Archive (Timeline) */}
            <div style={{ padding: '0 8%', marginBottom: 150 }}>
               <EditorialTitle subtitle="Chronicle" title="Historical Archive" centered />
               <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: 80 }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: '#e2e8f0' }}></div>
                  {['1980: Foundation', '1995: Expansion', '2010: Gold Merit', '2025: Golden Jubilee'].map(y => (
                    <div key={y} style={{ textAlign: 'center', width: 200, paddingTop: 30 }}>
                       <div style={{ width: 12, height: 12, background: gold, borderRadius: '50%', margin: '-36px auto 25px' }}></div>
                       <h5 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18 }}>{y}</h5>
                    </div>
                  ))}
               </div>
            </div>

            {/* 5. Architectural Elegance (Infrastructure) */}
            <div style={{ padding: '0 8%', marginBottom: 150 }}>
               <EditorialTitle subtitle="The Estate" title="Architectural Elegance" />
               <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 30 }}>
                  <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800" style={{ width: '100%', height: 600, objectFit: 'cover' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 30 }}>
                     <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400" style={{ width: '100%', height: 285, objectFit: 'cover' }} />
                     <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400" style={{ width: '100%', height: 285, objectFit: 'cover' }} />
                  </div>
               </div>
            </div>

            {/* 6. The Heritage Experience */}
            <div style={{ padding: '120px 8%', background: dark, color: 'white', textAlign: 'center' }}>
               <h3 style={{ fontSize: 40, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', marginBottom: 20 }}>Experience the Extraordinary.</h3>
               <p style={{ opacity: 0.6, maxWidth: 600, margin: '0 auto 40px' }}>Join a community dedicated to the pursuit of knowledge and the refinement of character.</p>
               <button style={{ background: 'white', color: dark, padding: '15px 40px', border: 'none', fontWeight: 800, fontSize: 13, letterSpacing: 2 }}>REQUEST A PRIVATE TOUR</button>
            </div>
          </motion.div>
        )
      case 'Academics':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '100px 0' }}>
            {/* 1. Classical Curriculum */}
            <div style={{ padding: '0 8%', marginBottom: 150 }}>
               <EditorialTitle subtitle="Scholarship" title="Classical & Modern Curriculum" centered />
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
                 {[
                   { title: 'The Preparatory', d: 'Foundational years focusing on language, logic and social harmony.' },
                   { title: 'The Scholastic', d: 'Middle years integrating advanced sciences with classical literature.' },
                   { title: 'The Baccalaureate', d: 'Final years focused on global examinations and university readiness.' }
                 ].map((w, i) => (
                   <div key={i} style={{ padding: 50, border: '1px solid #f1f5f9', textAlign: 'center' }}>
                      <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 15 }}>{w.title}</h4>
                      <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8 }}>{w.d}</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* 2. Global Citizenship */}
            <div style={{ padding: '120px 8%', background: '#f8fafc', marginBottom: 150 }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 100, alignItems: 'center' }}>
                  <img src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800" style={{ width: '100%', borderRadius: 4 }} />
                  <div>
                    <EditorialTitle subtitle="Perspective" title="Global Citizenship" />
                    <p style={{ color: '#475569', lineHeight: 2, fontSize: 16 }}>Our curriculum extends beyond borders, encouraging students to engage with global issues and diverse cultures through international exchange programs.</p>
                  </div>
               </div>
            </div>

            {/* 3. The Scholars (Faculty) */}
            <div style={{ padding: '0 8%', marginBottom: 150 }}>
               <EditorialTitle subtitle="The Mentors" title="Distinguished Faculty" centered />
               <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
                  <p style={{ color: '#64748b', fontSize: 18, lineHeight: 2 }}>Every educator at Heritage is a specialist in their field, with 90% holding advanced postgraduate credentials from world-renowned institutions.</p>
               </div>
            </div>

            {/* 4. Library & Studios */}
            <div style={{ padding: '120px 8%', background: dark, color: 'white', marginBottom: 150 }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: 32, fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>Centers of Creativity</h3>
                    <p style={{ opacity: 0.6, marginTop: 25, lineHeight: 2 }}>From our rare-manuscript library to the professional-grade art and music studios, we provide the tools for true creative expression.</p>
                  </div>
                  <img src="https://images.unsplash.com/photo-1507738911719-21763d470407?auto=format&fit=crop&q=80&w=800" style={{ width: '100%', borderRadius: 4 }} />
               </div>
            </div>

            {/* 5. Merit Scholarships */}
            <div style={{ padding: '0 8%', textAlign: 'center', marginBottom: 150 }}>
               <EditorialTitle subtitle="Recognition" title="Scholarly Merits" centered />
               <FiAward size={50} color={gold} style={{ marginBottom: 30 }} />
               <p style={{ color: '#64748b' }}>We offer prestigious scholarships to students who demonstrate exceptional academic and artistic prowess.</p>
            </div>

            {/* 6. House Traditions */}
            <div style={{ padding: '100px 8%', background: '#f8fafc' }}>
               <h3 style={{ textAlign: 'center', fontFamily: "'Playfair Display', serif", fontSize: 32, marginBottom: 50 }}>House Traditions</h3>
               <div style={{ display: 'flex', justifyContent: 'center', gap: 60, fontWeight: 700, letterSpacing: 3, color: gold }}>
                  <span>WINDSOR</span> <span>SOMERSET</span> <span>KENSINGTON</span> <span>RICHMOND</span>
               </div>
            </div>
          </motion.div>
        )
      case 'Admissions':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '100px 0' }}>
            {/* 1. Selective Admissions */}
            <div style={{ padding: '0 8%', marginBottom: 150 }}>
               <EditorialTitle subtitle="The Portal" title="Selective Admissions" />
               <div style={{ background: '#f8fafc', padding: 60, border: '1px solid #f1f5f9' }}>
                  <p style={{ color: '#475569', fontSize: 18, lineHeight: 2 }}>Entry to Heritage is based on an evaluation of the candidate's academic readiness, creative potential, and alignment with our institutional values.</p>
               </div>
            </div>

            {/* 2. Investment (Fees) */}
            <div style={{ padding: '120px 8%', background: '#f1f5f9', marginBottom: 150 }}>
               <EditorialTitle subtitle="Institutional Support" title="Educational Investment" centered />
               <div style={{ maxWidth: 900, margin: '0 auto', background: 'white', padding: 50, boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                        <th style={{ padding: 20, textAlign: 'left', fontWeight: 800 }}>PROGRAMME</th>
                        <th style={{ padding: 20, textAlign: 'right', fontWeight: 800 }}>ANNUAL FEE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Preparatory', 'Scholastic', 'Baccalaureate'].map(p => (
                        <tr key={p} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: 20 }}>{p}</td>
                          <td style={{ padding: 20, textAlign: 'right', color: gold, fontWeight: 800 }}>ENQUIRE FOR DETAILS</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>

            {/* 3. Admission Journey (Steps) */}
            <div style={{ padding: '0 8%', marginBottom: 150 }}>
               <EditorialTitle subtitle="Process" title="The Admission Journey" centered />
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 30, textAlign: 'center' }}>
                  {['Inquiry', 'Evaluation', 'Interview', 'Matriculation'].map((s, i) => (
                    <div key={i}>
                       <div style={{ fontSize: 40, fontFamily: "'Playfair Display', serif", color: '#e2e8f0', marginBottom: 10 }}>{i+1}</div>
                       <h5 style={{ fontWeight: 800, fontSize: 13, letterSpacing: 2 }}>{s.toUpperCase()}</h5>
                    </div>
                  ))}
               </div>
            </div>

            {/* 4. Eligibility (Age) */}
            <div style={{ padding: '100px 8%', background: '#f8fafc', marginBottom: 150, textAlign: 'center' }}>
               <h4 style={{ fontWeight: 800, marginBottom: 10 }}>Eligibility Requirements</h4>
               <p style={{ color: '#64748b' }}>Ages 5+ to 18+. Candidates must meet the requisite grade-level assessments.</p>
            </div>

            {/* 5. Policy of Excellence (Withdrawal) */}
            <div style={{ padding: '0 8%', marginBottom: 150 }}>
               <EditorialTitle subtitle="Governance" title="Policy of Excellence" />
               <p style={{ color: '#64748b', lineHeight: 2 }}>Our policies regarding withdrawals and transfers are designed to ensure minimal disruption to the student's academic progress. A term's notice is standard protocol.</p>
            </div>

            {/* 6. FAQ Suite */}
            <div style={{ padding: '120px 8%', background: dark, color: 'white' }}>
               <EditorialTitle subtitle="Inquiries" title="Common Clarifications" />
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
                  {[
                    { q: 'What is the medium of instruction?', a: 'English is the primary medium, with optional classical languages.' },
                    { q: 'Does the school provide boarding?', a: 'Yes, we offer premium residential facilities for senior students.' },
                    { q: 'Is the campus digitally integrated?', a: 'We utilize state-of-the-art tech while maintaining classical roots.' },
                    { q: 'What is the teacher-student ratio?', a: 'A boutique ratio of 1:12 ensures personalized mentorship.' }
                  ].map((faq, i) => (
                    <div key={i}>
                       <h5 style={{ fontWeight: 900, marginBottom: 10, color: gold }}>{faq.q}</h5>
                       <p style={{ opacity: 0.6, fontSize: 14 }}>{faq.a}</p>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )
      case 'Contact':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '100px 0' }}>
            {/* 1. The Estate Address */}
            <div style={{ padding: '0 8%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, marginBottom: 100 }}>
               <div style={{ padding: 50, border: '1px solid #f1f5f9', textAlign: 'center' }}>
                  <FiMapPin size={30} color={gold} style={{ marginBottom: 20 }} />
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 10 }}>The Estate</h4>
                  <p style={{ fontSize: 14, color: '#64748b' }}>Heritage Manor, Crescent Heights,<br />Shimla, Himachal Pradesh</p>
               </div>
               <div style={{ padding: 50, border: '1px solid #f1f5f9', textAlign: 'center' }}>
                  <FiPhone size={30} color={gold} style={{ marginBottom: 20 }} />
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 10 }}>Concierge</h4>
                  <p style={{ fontSize: 14, color: '#64748b' }}>+91 177 2345678<br />+91 98888 77777</p>
               </div>
               <div style={{ padding: 50, border: '1px solid #f1f5f9', textAlign: 'center' }}>
                  <FiMail size={30} color={gold} style={{ marginBottom: 20 }} />
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 10 }}>Correspondence</h4>
                  <p style={{ fontSize: 14, color: '#64748b' }}>concierge@heritage.edu.in<br />office@heritage.edu.in</p>
               </div>
            </div>

            {/* 2. Inquiry Suite (Form) */}
            <div style={{ padding: '0 8% 150px' }}>
               <div style={{ maxWidth: 900, margin: '0 auto', border: '1px solid #f1f5f9', padding: 80 }}>
                  <EditorialTitle subtitle="Direct Message" title="The Inquiry Suite" centered />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginBottom: 30 }}>
                     <input type="text" placeholder="GIVEN NAME" style={{ border: 'none', borderBottom: '1px solid #e2e8f0', padding: '15px 0', fontSize: 12, letterSpacing: 2, fontWeight: 700 }} />
                     <input type="text" placeholder="SURNAME" style={{ border: 'none', borderBottom: '1px solid #e2e8f0', padding: '15px 0', fontSize: 12, letterSpacing: 2, fontWeight: 700 }} />
                  </div>
                  <input type="email" placeholder="EMAIL ADDRESS" style={{ width: '100%', border: 'none', borderBottom: '1px solid #e2e8f0', padding: '15px 0', fontSize: 12, letterSpacing: 2, fontWeight: 700, marginBottom: 30 }} />
                  <textarea placeholder="HOW MAY WE ASSIST YOU?" rows={5} style={{ width: '100%', border: 'none', borderBottom: '1px solid #e2e8f0', padding: '15px 0', fontSize: 12, letterSpacing: 2, fontWeight: 700, marginBottom: 60 }}></textarea>
                  <button style={{ width: '100%', background: dark, color: 'white', padding: '20px', border: 'none', fontWeight: 800, fontSize: 13, letterSpacing: 3 }}>SUBMIT TO CONCIERGE</button>
               </div>
            </div>

            {/* 3. Estate Map Placeholder */}
            <div style={{ padding: '0 8% 150px' }}>
               <div style={{ height: 500, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontStyle: 'italic', opacity: 0.3 }}>[ THE ESTATE CARTOGRAPHY ]</span>
               </div>
            </div>

            {/* 4. Concierge Hours */}
            <div style={{ padding: '100px 8%', background: '#f8fafc', textAlign: 'center', marginBottom: 150 }}>
               <EditorialTitle subtitle="Access" title="Concierge Hours" centered />
               <p style={{ color: '#64748b' }}>Available Monday to Saturday: 09:00 AM — 05:00 PM</p>
            </div>

            {/* 5. Social Atelier */}
            <div style={{ textAlign: 'center', marginBottom: 150 }}>
               <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 50 }}>The Social Atelier</h3>
               <div style={{ display: 'flex', justifyContent: 'center', gap: 50, color: gold }}>
                  <FiCamera /> <FiStar /> <FiHeart /> <FiCompass />
               </div>
            </div>

            {/* 6. The Ledger (Newsletter) */}
            <div style={{ padding: '120px 8%', background: dark, color: 'white', textAlign: 'center' }}>
               <h3 style={{ fontSize: 32, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', marginBottom: 20 }}>The Heritage Ledger</h3>
               <p style={{ opacity: 0.6, marginBottom: 40 }}>Receive our seasonal publication on institutional news and classical arts.</p>
               <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                  <input type="text" placeholder="EMAIL ADDRESS" style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '15px', width: 350 }} />
                  <button style={{ color: gold, fontWeight: 900, border: 'none', background: 'none', letterSpacing: 2 }}>SUBSCRIBE</button>
               </div>
            </div>
          </motion.div>
        )
      case 'CBSE Corner':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 0 }}>
              <div style={{ background: 'white', height: 'calc(100vh - 100px)', position: 'sticky', top: 100, borderRight: '1px solid #f1f5f9', padding: '40px 0' }}>
                <div style={{ padding: '0 30px 20px', borderBottom: '1px solid #f1f5f9', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: dark }}>CBSE_CORNER</h3>
                  <p style={{ fontSize: 10, color: gold, fontWeight: 800, letterSpacing: 2 }}>OFFICIAL_LEDGER</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {[
                    { id: 'General', label: 'Mandatory_Info', icon: <FiInfo /> },
                    { id: 'Documents', label: 'Document_Store', icon: <FiFileText /> },
                    { id: 'Results', label: 'Academic_Success', icon: <FiTrendingUp /> },
                    { id: 'Staff', label: 'Faculty_Ledger', icon: <FiUsers /> }
                  ].map(tab => (
                    <div 
                      key={tab.id}
                      onClick={() => setCbseSubTab(tab.id)}
                      style={{ 
                        padding: '18px 30px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 15, 
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 700,
                        color: cbseSubTab === tab.id ? gold : '#64748b',
                        background: cbseSubTab === tab.id ? '#fcfaf7' : 'transparent',
                        borderRight: cbseSubTab === tab.id ? `4px solid ${gold}` : 'none'
                      }}
                    >
                      {tab.icon} {tab.label.toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '60px 80px' }}>
                <div style={{ background: 'white', padding: 60, borderRadius: 4, border: '1px solid #f1f5f9' }}>
                   {cbseSubTab === 'General' && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 40 }}>General_Information</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
                          {[
                            ['INSTITUTION', 'HERITAGE INTERNATIONAL'], ['AFFILIATION', '1234567'],
                            ['PRINCIPAL', 'SIR ROBERT VANCE'], ['CONTACT', 'concierge@heritage.edu.in']
                          ].map(it => (
                            <div key={it[0]} style={{ paddingBottom: 15, borderBottom: '1px solid #f8fafc' }}>
                              <span style={{ fontSize: 10, color: gold }}>{it[0]}</span>
                              <p style={{ margin: '5px 0 0', fontWeight: 800 }}>{it[1]}</p>
                            </div>
                          ))}
                        </div>
                     </motion.div>
                   )}
                   {cbseSubTab === 'Documents' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                         {['AFFILIATION_CERT', 'NOC_CERTIFICATE', 'SOCIETY_DOCS', 'SAFETY_CERT'].map(d => (
                            <div key={d} style={{ padding: 25, border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                               <span style={{ fontWeight: 800 }}>{d}</span>
                               <FiDownload color={gold} />
                            </div>
                         ))}
                      </div>
                   )}
                </div>
              </div>
            </div>
          </motion.div>
        )
      default:
        return (
          <>
            {/* 1. Editorial Top Bar */}
            <div style={{ background: '#fcfaf7', color: gold, padding: '12px 5%', textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: 3, borderBottom: '1px solid #f1f5f9' }}>
              THE ADMISSIONS PORTAL FOR THE ACADEMIC YEAR 2026-27 IS NOW OPEN FOR SCHOLARS.
            </div>

            {/* 2. Elegant Nav already handled */}

            {/* 3. Artistic Hero */}
            <section style={{ height: '85vh', background: 'url(https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200) center/cover', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)' }}></div>
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', maxWidth: 800 }}>
                <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                  <span style={{ letterSpacing: 6, fontSize: 13, fontWeight: 700 }}>SINCE 1980</span>
                  <h1 style={{ fontSize: 'clamp(40px, 8vw, 85px)', fontFamily: "'Playfair Display', serif", fontWeight: 400, marginTop: 20, fontStyle: 'italic' }}>The Pursuit of Wisdom.</h1>
                  <p style={{ fontSize: 18, opacity: 0.8, marginTop: 20, fontFamily: "'Libre Baskerville', serif" }}>Cultivating global leaders through classical educational values and modern excellence.</p>
                </motion.div>
              </div>
            </section>

            {/* 4. Core Philosophy */}
            <section style={{ padding: '120px 8%', background: 'white' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 100, alignItems: 'center' }}>
                <div>
                  <EditorialTitle subtitle="The Ethos" title="Philosophical Pillars" />
                  <p style={{ color: '#475569', lineHeight: 2, fontSize: 16 }}>Heritage International is more than an institution; it is a community dedicated to the holistic growth of every individual scholar.</p>
                  <button style={{ marginTop: 30, background: gold, color: 'white', padding: '15px 35px', border: 'none', fontWeight: 800, fontSize: 12, letterSpacing: 2 }}>READ OUR CHARTER</button>
                </div>
                <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800" style={{ width: '100%', borderRadius: 4 }} />
              </div>
            </section>

            {/* 5. Campus Living */}
            <section style={{ padding: '100px 8%', background: '#f8fafc' }}>
              <EditorialTitle subtitle="The Estate" title="Campus Living" centered />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                {[
                  { title: "Residential Houses", img: "https://images.unsplash.com/photo-1516116216624-53e697fedbea" },
                  { title: "Art Studios", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97" },
                  { title: "Sports Pavilion", img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837" },
                  { title: "The Great Hall", img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d" }
                ].map((item, i) => (
                  <div key={i}>
                    <img src={`${item.img}?auto=format&fit=crop&q=80&w=400`} style={{ width: '100%', height: 350, objectFit: 'cover', borderRadius: 4 }} />
                    <h4 style={{ fontSize: 16, fontFamily: "'Playfair Display', serif", marginTop: 20, textAlign: 'center' }}>{item.title}</h4>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Disclosure Banner (Disclosure) */}
            <section style={{ padding: '80px 8%', background: dark, color: 'white', textAlign: 'center' }}>
              <span style={{ color: gold, letterSpacing: 3, fontSize: 11, fontWeight: 900 }}>TRANSPARENCY</span>
              <h2 style={{ fontSize: 32, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', margin: '20px 0' }}>Institutional Public Disclosure</h2>
              <p style={{ opacity: 0.6, maxWidth: 600, margin: '0 auto 40px' }}>Access the official ledger of our institution's compliance, results, and staff credentials.</p>
              <button style={{ border: `1px solid ${gold}`, background: 'transparent', color: gold, padding: '15px 45px', fontWeight: 800, fontSize: 12, letterSpacing: 2 }} onClick={() => setActiveTab('CBSE Corner')}>VIEW OFFICIAL DISCLOSURES</button>
            </section>
          </>
        )
    }
  }

  return (
    <div style={{ background: 'white', color: dark, minHeight: '100vh', fontFamily: "'Libre Baskerville', serif" }}>
      {/* Editorial Navigation */}
      <nav style={{ padding: '30px 8%', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15, cursor: 'pointer' }} onClick={() => setActiveTab('Home')}>
          <div style={{ width: 40, height: 40, background: dark, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: gold, fontSize: 24, fontFamily: "'Playfair Display', serif" }}>H</div>
          <span style={{ fontSize: 24, fontFamily: "'Playfair Display', serif", fontWeight: 400, letterSpacing: 2 }}>HERITAGE<span style={{ color: gold }}>_INTERNATIONAL</span></span>
        </div>
        <div style={{ display: 'flex', gap: 40, fontWeight: 700, fontSize: 11, letterSpacing: 3 }}>
          {['Home', 'About', 'Academics', 'Admissions', 'CBSE Corner', 'Contact'].map(t => (
            <span key={t} style={{ cursor: 'pointer', color: activeTab === t ? gold : dark, borderBottom: activeTab === t ? `1px solid ${gold}` : 'none', paddingBottom: 10 }} onClick={() => setActiveTab(t)}>{t.toUpperCase()}</span>
          ))}
        </div>
      </nav>

      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>

      <footer style={{ background: '#fcfaf7', padding: '100px 8% 40px', borderTop: '1px solid #f1f5f9', marginTop: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 100, marginBottom: 80 }}>
          <div>
            <h2 style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", marginBottom: 30 }}>HERITAGE</h2>
            <p style={{ opacity: 0.6, fontSize: 14, lineHeight: 2 }}>The pursuit of wisdom through the marriage of classical tradition and modern excellence. Since 1980.</p>
          </div>
          <div><h4 style={{ fontSize: 14, letterSpacing: 3, marginBottom: 30 }}>ACADEMICS</h4><div style={{ display: 'flex', flexDirection: 'column', gap: 15, fontSize: 12, fontWeight: 700, color: '#64748b' }}><span onClick={() => setActiveTab('Academics')} style={{ cursor: 'pointer' }}>CURRICULUM</span><span>SCHOLARSHIPS</span></div></div>
          <div><h4 style={{ fontSize: 14, letterSpacing: 3, marginBottom: 30 }}>INSTITUTION</h4><div style={{ display: 'flex', flexDirection: 'column', gap: 15, fontSize: 12, fontWeight: 700, color: '#64748b' }}><span onClick={() => setActiveTab('About')} style={{ cursor: 'pointer' }}>THE LEGACY</span><span onClick={() => setActiveTab('CBSE Corner')} style={{ cursor: 'pointer' }}>DISCLOSURE</span></div></div>
          <div><h4 style={{ fontSize: 14, letterSpacing: 3, marginBottom: 30 }}>ADDRESS</h4><div style={{ display: 'flex', flexDirection: 'column', gap: 15, fontSize: 12, fontWeight: 700, color: '#64748b' }}><span>SHIMLA, HP</span><span>+91 177 2345678</span></div></div>
        </div>
        <div style={{ textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 40, fontSize: 10, letterSpacing: 4, fontWeight: 700 }}>© 2026 HERITAGE INTERNATIONAL // POWERED BY SKOLUX</div>
      </footer>
    </div>
  )
}
