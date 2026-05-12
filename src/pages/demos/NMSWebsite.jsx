import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FiPhone, FiMail, FiMapPin, FiArrowRight, FiCheckCircle, 
  FiDownload, FiFileText, FiAward, FiUsers, FiClock, FiBookOpen,
  FiTarget, FiShield, FiHeart, FiCamera, FiExternalLink, FiStar, FiCalendar, FiTrendingUp,
  FiInfo, FiLayers, FiList, FiSearch, FiHelpCircle, FiClock as FiTime, FiSmile
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function NMSWebsite() {
  const primary = "#1e3a8a" // Navy Blue
  const accent = "#f59e0b" // Amber
  const [activeTab, setActiveTab] = useState('Home')
  const [cbseSubTab, setCbseSubTab] = useState('General')

  const SectionTitle = ({ subtitle, title, centered = false }) => (
    <div style={{ textAlign: centered ? 'center' : 'left', marginBottom: 50 }}>
      <span style={{ color: accent, fontWeight: 800, letterSpacing: 2, fontSize: 13, textTransform: 'uppercase' }}>{subtitle}</span>
      <h2 style={{ fontSize: 36, fontWeight: 900, color: primary, marginTop: 10 }}>{title}</h2>
      {centered && <div style={{ width: 80, height: 4, background: accent, margin: '20px auto 0' }}></div>}
    </div>
  )

  const renderContent = () => {
    switch(activeTab) {
      case 'About':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 0' }}>
            {/* 1. Vision & Mission */}
            <div style={{ padding: '0 5%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginBottom: 120 }}>
              <div>
                <SectionTitle subtitle="Our Identity" title="Vision & Mission" />
                <p style={{ color: '#64748b', fontSize: 17, lineHeight: 1.8, marginBottom: 40 }}>
                  New Morning Star Public School was founded on the belief that every child is unique and possesses the potential to change the world. 
                  Our vision is to provide a transformative educational experience that empowers students to lead with courage, empathy, and intellectual rigor.
                </p>
                <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
                  <div style={{ minWidth: 60, height: 60, background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: primary }}><FiTarget size={30} /></div>
                  <div>
                    <h4 style={{ fontSize: 20, fontWeight: 800 }}>Global Leadership</h4>
                    <p style={{ color: '#64748b', fontSize: 15 }}>To be a benchmark institution in 21st-century education, integrating Indian values with global best practices.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 20 }}>
                  <div style={{ minWidth: 60, height: 60, background: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}><FiShield size={30} /></div>
                  <div>
                    <h4 style={{ fontSize: 20, fontWeight: 800 }}>Holistic Excellence</h4>
                    <p style={{ color: '#64748b', fontSize: 15 }}>To nurture students in a balanced environment where academics, sports, and ethics receive equal importance.</p>
                  </div>
                </div>
              </div>
              <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600" style={{ width: '100%', borderRadius: 24, boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }} />
            </div>

            {/* 2. Management Team */}
            <div style={{ padding: '0 5%', marginBottom: 120 }}>
              <SectionTitle subtitle="The Pillars" title="Our Leadership" centered />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
                {[
                  { name: 'Mr. S.K. Khanna', role: 'Chairman', bio: 'With 40 years of experience in educational management, Mr. Khanna has been the driving force behind our institutional growth.', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300' },
                  { name: 'Dr. Anita Desai', role: 'Director', bio: 'A PhD in Education from Delhi University, Dr. Desai focuses on curriculum innovation and teacher training programs.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300' },
                  { name: 'Mrs. Rekha Singh', role: 'Principal', bio: 'An expert in school psychology and pedagogy, Mrs. Singh ensures a safe and stimulating learning environment for all students.', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300' }
                ].map((m, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <img src={m.img} style={{ width: 180, height: 180, borderRadius: '50%', objectFit: 'cover', marginBottom: 20, border: `4px solid ${primary}10` }} />
                    <h4 style={{ fontSize: 22, fontWeight: 900, marginBottom: 5 }}>{m.name}</h4>
                    <p style={{ color: accent, fontWeight: 800, fontSize: 13, marginBottom: 15 }}>{m.role}</p>
                    <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, padding: '0 20px' }}>{m.bio}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Core Values */}
            <div style={{ padding: '100px 5%', background: '#f8fafc' }}>
              <SectionTitle subtitle="Our Philosophy" title="The Core Values" centered />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 25 }}>
                {[
                  { icon: <FiAward />, label: 'Excellence', desc: 'Striving for highest standards in everything we do.' },
                  { icon: <FiHeart />, label: 'Compassion', desc: 'Fostering a culture of kindness and mutual respect.' },
                  { icon: <FiShield />, label: 'Integrity', desc: 'Maintaining honesty and transparency in all actions.' },
                  { icon: <FiUsers />, label: 'Inclusion', desc: 'Celebrating diversity and providing equal opportunity.' }
                ].map((v, i) => (
                  <div key={i} style={{ background: 'white', padding: 40, borderRadius: 24, textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                    <div style={{ color: primary, fontSize: 32, marginBottom: 20 }}>{v.icon}</div>
                    <h4 style={{ fontWeight: 900, marginBottom: 10 }}>{v.label}</h4>
                    <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.5 }}>{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. History/Timeline */}
            <div style={{ padding: '100px 5%' }}>
              <SectionTitle subtitle="Our Legacy" title="Timeline of Excellence" centered />
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: 80 }}>
                <div style={{ position: 'absolute', top: 15, left: 0, right: 0, height: 2, background: '#e2e8f0', zIndex: 0 }}></div>
                {[
                  { year: '1995', event: 'Inception of NMS', desc: 'Started with 50 students in a small campus.' },
                  { year: '2005', event: 'CBSE Affiliation', desc: 'Became a Senior Secondary school.' },
                  { year: '2015', event: 'Tech-Campus', desc: 'Introduced smart boards and digital labs.' },
                  { year: '2025', event: 'Golden Award', desc: 'Ranked among top 10 schools in the region.' }
                ].map((t, i) => (
                  <div key={i} style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: 220 }}>
                    <div style={{ width: 30, height: 30, background: primary, borderRadius: '50%', border: '6px solid white', margin: '0 auto 20px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}></div>
                    <h4 style={{ fontSize: 24, fontWeight: 900, color: primary, marginBottom: 5 }}>{t.year}</h4>
                    <h5 style={{ fontWeight: 800, fontSize: 14, margin: '0 0 10px' }}>{t.event}</h5>
                    <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.5 }}>{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Infrastructure Highlights */}
            <div style={{ padding: '100px 5%', background: '#0f172a', color: 'white', borderRadius: 40, margin: '0 2% 100px' }}>
              <SectionTitle subtitle="World-Class Facilities" title="The NMS Campus" centered />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
                {[
                  { title: 'Auditorium', img: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3', desc: 'A 500-seater sound-proof hall for cultural activities.' },
                  { title: 'Sports Complex', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7', desc: 'Professional tracks and courts for basketball, football and cricket.' },
                  { title: 'Innovation Lab', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d', desc: 'State-of-the-art robotic and STEM experimentation center.' }
                ].map((f, i) => (
                  <div key={i}>
                    <img src={`${f.img}?auto=format&fit=crop&q=80&w=400`} style={{ width: '100%', height: 280, objectFit: 'cover', borderRadius: 20, marginBottom: 20 }} />
                    <h4 style={{ fontWeight: 800, color: accent }}>{f.title}</h4>
                    <p style={{ opacity: 0.7, fontSize: 14 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Why Choose Us? */}
            <div style={{ padding: '100px 5%', textAlign: 'center' }}>
              <SectionTitle subtitle="Value Proposition" title="The NMS Advantage" centered />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
                {[
                  { title: 'Safe Environment', desc: 'CCTV monitored campus with 24/7 security and strict visitor protocols.' },
                  { title: 'Expert Faculty', desc: 'Staff with average 10+ years of teaching experience in leading schools.' },
                  { title: 'Modern Pedagogy', desc: 'Focus on experiential learning rather than rote memorization.' }
                ].map((item, i) => (
                  <div key={i} style={{ padding: 40, border: '1px solid #e2e8f0', borderRadius: 24, background: '#fff' }}>
                    <FiCheckCircle size={32} color={primary} style={{ marginBottom: 20 }} />
                    <h4 style={{ fontWeight: 900, marginBottom: 15 }}>{item.title}</h4>
                    <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )
      case 'Academics':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 0' }}>
            {/* 1. Curriculum Wings */}
            <div style={{ padding: '0 5%', marginBottom: 120 }}>
              <SectionTitle subtitle="Educational Pathway" title="Curriculum & Pedagogy" centered />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
                {[
                  { title: 'Primary Wing', range: 'Classes I - V', icon: <FiBookOpen />, desc: 'Emphasizing curiosity and wonder through theme-based learning and activity-oriented subjects.' },
                  { title: 'Middle School', range: 'Classes VI - VIII', icon: <FiTarget />, desc: 'Transitioning to structured conceptual understanding in Sciences, Mathematics, and Languages.' },
                  { title: 'Senior Secondary', range: 'Classes IX - XII', icon: <FiAward />, desc: 'Rigorous preparation for board exams with specialized streams in Science, Commerce, and Humanities.' }
                ].map((w, i) => (
                  <div key={i} style={{ padding: 50, border: '1px solid #e2e8f0', borderRadius: 30, textAlign: 'center', background: i === 1 ? '#f8fafc' : 'white' }}>
                    <div style={{ color: primary, fontSize: 45, marginBottom: 25 }}>{w.icon}</div>
                    <h4 style={{ fontSize: 24, fontWeight: 900, marginBottom: 10 }}>{w.title}</h4>
                    <p style={{ color: accent, fontWeight: 800, fontSize: 13, marginBottom: 20 }}>{w.range}</p>
                    <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7 }}>{w.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Co-Curricular Excellence */}
            <div style={{ padding: '100px 5%', background: '#f8fafc' }}>
               <SectionTitle subtitle="The Whole Child" title="Co-Curricular Excellence" />
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 25 }}>
                 {[
                   { title: 'Sports Academy', desc: 'Coaching in Cricket, Football, and Yoga.' },
                   { title: 'Music & Arts', desc: 'Vocal, Instrumental, and Visual Art studios.' },
                   { title: 'STEM Club', desc: 'Coding, Robotics, and Electronic workshops.' },
                   { title: 'Literary Club', desc: 'Debate, Dramatics, and Creative Writing.' }
                 ].map((act, i) => (
                   <div key={i} style={{ background: 'white', padding: 30, borderRadius: 20, textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                     <h5 style={{ fontWeight: 900, color: primary, marginBottom: 10 }}>{act.title}</h5>
                     <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>{act.desc}</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* 3. Faculty Highlights */}
            <div style={{ padding: '100px 5%' }}>
              <SectionTitle subtitle="The Educators" title="Our Faculty Expertise" centered />
              <div style={{ textAlign: 'center', maxWidth: 850, margin: '0 auto' }}>
                <p style={{ color: '#64748b', fontSize: 18, lineHeight: 1.8 }}>
                  Our staff consists of 80+ certified professionals, many of whom hold Master's and Doctoral degrees in their respective fields. 
                  Regular workshops from CBSE and international experts ensure our teachers stay at the forefront of educational innovation.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 60, marginTop: 50 }}>
                   <div><h3 style={{ fontSize: 40, color: primary, margin: 0 }}>10:1</h3><p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>STUDENT-TEACHER RATIO</p></div>
                   <div><h3 style={{ fontSize: 40, color: primary, margin: 0 }}>12+</h3><p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>AVG YEARS EXP</p></div>
                   <div><h3 style={{ fontSize: 40, color: primary, margin: 0 }}>100%</h3><p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>CERTIFIED STAFF</p></div>
                </div>
              </div>
            </div>

            {/* 4. Library & Labs */}
            <div style={{ padding: '100px 5%', background: '#0f172a', color: 'white', borderRadius: 40, margin: '0 2%' }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
                 <img src="https://images.unsplash.com/photo-1507738911719-21763d470407?auto=format&fit=crop&q=80&w=800" style={{ width: '100%', borderRadius: 24, boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }} />
                 <div>
                    <h3 style={{ fontSize: 36, fontWeight: 900 }}>Advanced Learning Resources</h3>
                    <p style={{ opacity: 0.8, marginTop: 25, fontSize: 17, lineHeight: 1.8 }}>
                      Our library houses over 15,000 volumes across diverse genres, along with a digital archive for research. 
                      The Physics, Chemistry, and Biology labs are fully equipped for senior secondary experiments as per CBSE norms.
                    </p>
                    <div style={{ marginTop: 30, display: 'flex', flexWrap: 'wrap', gap: 15 }}>
                       {['Digital Library', 'Fiber Internet', 'Smart Classes', 'Robotics Lab'].map(t => (
                         <span key={t} style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 20px', borderRadius: 100, fontSize: 13, fontWeight: 700 }}>{t}</span>
                       ))}
                    </div>
                 </div>
               </div>
            </div>

            {/* 5. Academic Awards */}
            <div style={{ padding: '100px 5%', textAlign: 'center' }}>
               <SectionTitle subtitle="Consistent Winners" title="Academic Brilliance" centered />
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
                  {[
                    { year: '2025', award: 'State Level Science Exhibition', rank: 'Gold Medal' },
                    { year: '2024', award: 'National Math Olympiad', rank: 'Top 50 Rank' },
                    { year: '2023', award: 'Inter-School Debate', rank: 'First Prize' }
                  ].map((aw, i) => (
                    <div key={i} style={{ padding: 40, border: '1px solid #e2e8f0', borderRadius: 20 }}>
                       <FiAward size={40} color={accent} style={{ marginBottom: 15 }} />
                       <h5 style={{ fontSize: 18, fontWeight: 900, marginBottom: 5 }}>{aw.award}</h5>
                       <p style={{ color: primary, fontWeight: 800 }}>{aw.rank} ({aw.year})</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* 6. House System */}
            <div style={{ padding: '100px 5%', background: '#f8fafc' }}>
               <SectionTitle subtitle="Community Spirit" title="House & Council System" centered />
               <p style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px', color: '#64748b' }}>
                 Students are divided into four houses to promote healthy competition and team spirit. Each house is led by a Captain and Vice-Captain elected by the student body.
               </p>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 30 }}>
                 {[
                   { name: 'AGNI', color: '#ef4444', value: 'Strength' },
                   { name: 'PRITHVI', color: '#10b981', value: 'Stability' },
                   { name: 'VAYU', color: '#f59e0b', value: 'Speed' },
                   { name: 'AKASH', color: '#3b82f6', value: 'Vastness' }
                 ].map((h, i) => (
                   <div key={i} style={{ padding: 30, background: 'white', borderRadius: 20, textAlign: 'center', borderBottom: `8px solid ${h.color}` }}>
                     <h4 style={{ fontWeight: 900, color: h.color }}>{h.name}</h4>
                     <p style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8' }}>Motto: {h.value}</p>
                   </div>
                 ))}
               </div>
            </div>
          </motion.div>
        )
      case 'Admissions':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 0' }}>
            {/* 1. Guidelines */}
            <div style={{ padding: '0 5%', marginBottom: 100 }}>
              <SectionTitle subtitle="Application Guide" title="Admission Rules" />
              <div style={{ background: '#f8fafc', padding: 50, borderRadius: 30, border: '1px solid #e2e8f0' }}>
                <p style={{ color: '#1e293b', fontSize: 18, lineHeight: 1.8, marginBottom: 30 }}>
                  We welcome inquiries from parents who are looking for a rigorous and nurturing education for their children. 
                  Registration is currently open for the academic session starting April 2026.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                   <div>
                     <h4 style={{ fontWeight: 900, marginBottom: 15 }}>Mandatory Documents</h4>
                     <ul style={{ padding: 0, listStyle: 'none', color: '#64748b', fontSize: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <li>• Birth Certificate (issued by Municipal Corp.)</li>
                        <li>• Previous 2 years Report Cards</li>
                        <li>• Transfer Certificate (Original)</li>
                        <li>• 5 Passport size photographs</li>
                     </ul>
                   </div>
                   <div>
                     <h4 style={{ fontWeight: 900, marginBottom: 15 }}>Evaluation Criteria</h4>
                     <p style={{ color: '#64748b', fontSize: 14 }}>Primary admissions are based on child-parent interactions. Grade VI onwards, a written entrance assessment in English and Math is mandatory.</p>
                   </div>
                </div>
              </div>
            </div>

            {/* 2. Fee Structure */}
            <div style={{ padding: '100px 5%', background: '#f1f5f9' }}>
               <SectionTitle subtitle="Cost of Education" title="Comprehensive Fee Table" centered />
               <div style={{ maxWidth: 900, margin: '0 auto', background: 'white', borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: primary, color: 'white' }}>
                      <tr><th style={{ padding: 25, textAlign: 'left' }}>LEVEL / GRADE</th><th style={{ padding: 25 }}>ADM. FEE (ONE TIME)</th><th style={{ padding: 25 }}>ANNUAL TUITION</th></tr>
                    </thead>
                    <tbody>
                      {[
                        ['PRE-PRIMARY (NUR-KG)', '₹ 15,000', '₹ 45,000'],
                        ['PRIMARY (I-V)', '₹ 20,000', '₹ 65,000'],
                        ['MIDDLE (VI-VIII)', '₹ 20,000', '₹ 75,000'],
                        ['SENIOR (IX-XII)', '₹ 25,000', '₹ 95,000']
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: 25, fontWeight: 800 }}>{row[0]}</td>
                          <td style={{ padding: 25, textAlign: 'center', color: '#64748b' }}>{row[1]}</td>
                          <td style={{ padding: 25, textAlign: 'center', fontWeight: 700, color: primary }}>{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p style={{ padding: 25, fontSize: 12, background: '#fffbeb', color: '#92400e', margin: 0, textAlign: 'center' }}>* Transportation and uniform charges are calculated extra based on usage.</p>
               </div>
            </div>

            {/* 3. Steps (Timeline) */}
            <div style={{ padding: '100px 5%' }}>
               <SectionTitle subtitle="Step-by-Step" title="Admissions Process" centered />
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                 {[
                   { t: 'Register', d: 'Obtain form from office or website.' },
                   { t: 'Interaction', d: 'Visit for campus tour & interview.' },
                   { t: 'Verification', d: 'Submit documents for validation.' },
                   { t: 'Confirmation', d: 'Deposit fee to secure the seat.' }
                 ].map((s, i) => (
                   <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ width: 50, height: 50, background: primary, color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 20, fontWeight: 900 }}>{i+1}</div>
                      <h4 style={{ fontWeight: 900 }}>{s.t}</h4>
                      <p style={{ fontSize: 13, color: '#64748b' }}>{s.d}</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* 4. Age Criteria */}
            <div style={{ padding: '80px 5%', background: '#f8fafc' }}>
               <SectionTitle subtitle="Eligibility Norms" title="Class-Wise Age Requirements" centered />
               <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', padding: 40, borderRadius: 20, textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '15px 0' }}><span>NURSERY</span> <strong>3+ Years</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '15px 0' }}><span>K.G.</span> <strong>4+ Years</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0' }}><span>CLASS I</span> <strong>5+ Years</strong></div>
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 20 }}>Age as of 31st March of the year of admission.</p>
               </div>
            </div>

            {/* 5. Withdrawal Policy */}
            <div style={{ padding: '100px 5%' }}>
               <SectionTitle subtitle="Official Policy" title="Withdrawal & TC Rules" />
               <div style={{ background: '#f8fafc', padding: 40, borderRadius: 24, lineHeight: 1.8, color: '#64748b' }}>
                  <p>• One month's clear notice in writing or one month's fee in lieu of notice must be given for withdrawal.</p>
                  <p>• Transfer Certificate (TC) will be issued only after all school dues have been cleared.</p>
                  <p>• Refund of security deposit must be claimed within 3 months of leaving the school.</p>
               </div>
            </div>

            {/* 6. FAQ Section */}
            <div style={{ padding: '100px 5%', background: primary, color: 'white', borderRadius: 40, margin: '0 2%' }}>
               <SectionTitle subtitle="General Help" title="Frequently Asked Questions" />
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                 {[
                   { q: 'Is there a school transport facility?', a: 'Yes, we have a fleet of GPS-tracked buses covering a 15km radius.' },
                   { q: 'What is the teacher-student ratio?', a: 'We maintain a healthy 1:10 ratio for primary and 1:15 for senior classes.' },
                   { q: 'Does the school provide mid-day meals?', a: 'No, but we have a supervised canteen providing healthy snacks.' },
                   { q: 'Are there scholarship programs?', a: 'Merit-based scholarships are available for Class XI based on Board results.' }
                 ].map((faq, i) => (
                   <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 25 }}>
                      <h4 style={{ fontWeight: 900, marginBottom: 10, display: 'flex', gap: 10 }}><FiHelpCircle color={accent} /> {faq.q}</h4>
                      <p style={{ opacity: 0.7, fontSize: 14 }}>{faq.a}</p>
                   </div>
                 ))}
               </div>
            </div>
          </motion.div>
        )
      case 'Contact':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 0' }}>
            {/* 1. Contact Details */}
            <div style={{ padding: '0 5%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30, marginBottom: 80 }}>
              <div style={{ padding: 40, background: '#f8fafc', borderRadius: 24, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <FiMapPin size={35} color={primary} style={{ marginBottom: 20 }} />
                <h4 style={{ fontWeight: 900, fontSize: 20, marginBottom: 10 }}>Our Address</h4>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>Plot 45-B, Sector 12, Education Hub,<br />Opposite Central Park, New Delhi - 110075</p>
              </div>
              <div style={{ padding: 40, background: '#f8fafc', borderRadius: 24, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <FiPhone size={35} color={primary} style={{ marginBottom: 20 }} />
                <h4 style={{ fontWeight: 900, fontSize: 20, marginBottom: 10 }}>Help Desk</h4>
                <p style={{ fontSize: 14, color: '#64748b' }}>+91 98765 43210 (Admissions)<br />011-2345678 (General Office)</p>
              </div>
              <div style={{ padding: 40, background: '#f8fafc', borderRadius: 24, textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <FiMail size={35} color={primary} style={{ marginBottom: 20 }} />
                <h4 style={{ fontWeight: 900, fontSize: 20, marginBottom: 10 }}>Email Inquiries</h4>
                <p style={{ fontSize: 14, color: '#64748b' }}>admissions@nms.edu.in<br />principal@nms.edu.in</p>
              </div>
            </div>

            {/* 2. Direct Inquiry Form */}
            <div style={{ padding: '0 5% 100px' }}>
              <div style={{ maxWidth: 950, margin: '0 auto', background: 'white', padding: 60, borderRadius: 32, boxShadow: '0 40px 80px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                <SectionTitle subtitle="Write To Us" title="Direct Communication Portal" centered />
                <p style={{ textAlign: 'center', color: '#64748b', marginTop: -30, marginBottom: 40 }}>Please fill out the form below and our administrative team will get back to you within 24 business hours.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 25, marginBottom: 25 }}>
                  <div><label style={{ fontSize: 12, fontWeight: 800, color: primary }}>FULL NAME</label><input type="text" placeholder="Enter your name" style={{ width: '100%', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', marginTop: 8 }} /></div>
                  <div><label style={{ fontSize: 12, fontWeight: 800, color: primary }}>EMAIL ADDRESS</label><input type="email" placeholder="Enter your email" style={{ width: '100%', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', marginTop: 8 }} /></div>
                </div>
                <div><label style={{ fontSize: 12, fontWeight: 800, color: primary }}>YOUR MESSAGE</label><textarea placeholder="How can we assist you today?" rows={5} style={{ width: '100%', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', marginTop: 8, marginBottom: 40 }}></textarea></div>
                <button style={{ width: '100%', background: primary, color: 'white', padding: '20px', borderRadius: 12, border: 'none', fontWeight: 900, fontSize: 16, cursor: 'pointer', boxShadow: `0 20px 40px ${primary}30` }}>SEND SECURE MESSAGE</button>
              </div>
            </div>

            {/* 3. Location Map Placeholder */}
            <div style={{ padding: '0 5% 100px' }}>
               <div style={{ height: 450, background: '#f1f5f9', borderRadius: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '1px dashed #cbd5e1' }}>
                  <FiMapPin size={50} style={{ marginBottom: 15 }} />
                  <span style={{ fontSize: 20, fontWeight: 900 }}>INTERACTIVE CAMPUS LOCATOR</span>
                  <p style={{ fontSize: 14 }}>Plot 45-B, Sector 12, Education Hub, New Delhi</p>
               </div>
            </div>

            {/* 4. Office Hours */}
            <div style={{ padding: '100px 5%', background: '#f8fafc', borderRadius: 40, margin: '0 2% 100px' }}>
              <SectionTitle subtitle="Campus Access" title="Visit & Office Timings" centered />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 50, maxWidth: 1000, margin: '0 auto' }}>
                 <div style={{ textAlign: 'center' }}><FiClock size={30} color={accent} style={{ marginBottom: 15 }} /><h4 style={{ margin: '0 0 10px' }}>Working Days</h4><p style={{ color: '#64748b' }}>Monday to Saturday<br />8:00 AM to 4:00 PM</p></div>
                 <div style={{ textAlign: 'center' }}><FiTime size={30} color={accent} style={{ marginBottom: 15 }} /><h4 style={{ margin: '0 0 10px' }}>Visitor Hours</h4><p style={{ color: '#64748b' }}>With Prior Appointment<br />9:00 AM to 1:00 PM</p></div>
                 <div style={{ textAlign: 'center' }}><FiInfo size={30} color={accent} style={{ marginBottom: 15 }} /><h4 style={{ margin: '0 0 10px' }}>Lunch Break</h4><p style={{ color: '#64748b' }}>Administrative Staff<br />1:30 PM to 2:00 PM</p></div>
              </div>
            </div>

            {/* 5. Social Media */}
            <div style={{ padding: '80px 5%', textAlign: 'center' }}>
               <SectionTitle subtitle="Digital Community" title="Join Our Social Journey" centered />
               <p style={{ color: '#64748b', marginBottom: 40 }}>Stay connected with our daily campus activities, student achievements, and live event updates.</p>
               <div style={{ display: 'flex', justifyContent: 'center', gap: 40 }}>
                  {['Facebook', 'Instagram', 'Twitter', 'YouTube'].map(s => (
                    <div key={s} style={{ width: 120, padding: '20px', background: '#f8fafc', borderRadius: 16, cursor: 'pointer', transition: '0.3s' }}>
                       <h5 style={{ margin: 0, fontWeight: 900, color: primary }}>{s.toUpperCase()}</h5>
                    </div>
                  ))}
               </div>
            </div>

            {/* 6. Newsletter */}
            <div style={{ padding: '120px 5%', background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`, color: 'white', textAlign: 'center', borderRadius: 40, margin: '0 2% 100px' }}>
               <h3 style={{ fontSize: 36, fontWeight: 900, marginBottom: 20 }}>Subscribe to NMS Weekly</h3>
               <p style={{ opacity: 0.9, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>Get the latest institutional news, academic calendars, and holiday schedules delivered straight to your inbox.</p>
               <div style={{ display: 'flex', justifyContent: 'center', gap: 15 }}>
                  <input type="text" placeholder="Enter your email address" style={{ padding: '18px 35px', borderRadius: 100, border: 'none', width: 450, fontSize: 15 }} />
                  <button style={{ background: 'white', color: primary, padding: '18px 45px', borderRadius: 100, border: 'none', fontWeight: 900, fontSize: 15, cursor: 'pointer' }}>SUBSCRIBE NOW</button>
               </div>
            </div>
          </motion.div>
        )
      case 'CBSE Corner':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#f1f5f9', minHeight: '100vh' }}>
            {/* CBSE Corner stays the same */}
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 0 }}>
              <div style={{ background: 'white', height: 'calc(100vh - 100px)', position: 'sticky', top: 100, borderRight: '1px solid #e2e8f0', padding: '40px 0' }}>
                <div style={{ padding: '0 30px 20px', borderBottom: '1px solid #f1f5f9', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: primary }}>CBSE CORNER</h3>
                  <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, letterSpacing: 1 }}>MANDATORY DISCLOSURE</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {[
                    { id: 'General', label: 'General Information', icon: <FiInfo /> },
                    { id: 'Documents', label: 'Documents & Info', icon: <FiFileText /> },
                    { id: 'Results', label: 'Results & Academics', icon: <FiTrendingUp /> },
                    { id: 'Staff', label: 'Staff & Infrastructure', icon: <FiUsers /> }
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
                        fontSize: 14,
                        fontWeight: 700,
                        color: cbseSubTab === tab.id ? primary : '#64748b',
                        background: cbseSubTab === tab.id ? '#eff6ff' : 'transparent',
                        borderRight: cbseSubTab === tab.id ? `4px solid ${primary}` : 'none'
                      }}
                    >
                      {tab.icon} {tab.label}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '60px 80px' }}>
                <div style={{ background: 'white', padding: 60, borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                  {cbseSubTab === 'General' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 40 }}><FiInfo color={primary} /> General Information</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 30 }}>
                        {[
                          ['NAME OF SCHOOL', 'NEW MORNING STAR PUBLIC SCHOOL'],
                          ['AFFILIATION NO.', '1234567'],
                          ['SCHOOL CODE', '90123'],
                          ['COMPLETE ADDRESS', '123 Education Lane, Sector 12, New Delhi'],
                          ['PRINCIPAL NAME', 'DR. R.K. SHARMA'],
                          ['PRINCIPAL QUALIFICATION', 'PHD, M.A, B.ED'],
                          ['SCHOOL EMAIL', 'info@nms.edu.in'],
                          ['CONTACT DETAILS', '+91 98765 43210']
                        ].map((item, i) => (
                          <div key={i} style={{ paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: 1 }}>{item[0]}</span>
                            <p style={{ margin: '5px 0 0', fontWeight: 700, color: '#1e293b' }}>{item[1]}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {cbseSubTab === 'Documents' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 40 }}><FiFileText color={primary} /> Documents & Information</h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                        {[
                          'COPIES OF AFFILIATION/UPGRADATION LETTER',
                          'SOCIETY REGISTRATION CERTIFICATE',
                          'NO OBJECTION CERTIFICATE (NOC)',
                          'BUILDING SAFETY CERTIFICATE',
                          'FIRE SAFETY CERTIFICATE'
                        ].map((doc, i) => (
                          <div key={i} style={{ padding: '25px', background: '#f8fafc', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                            <span style={{ fontWeight: 700, fontSize: 14 }}>{doc}</span>
                            <button style={{ background: primary, color: 'white', padding: '8px 20px', borderRadius: 100, border: 'none', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>DOWNLOAD <FiDownload /></button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {cbseSubTab === 'Results' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 40 }}><FiTrendingUp color={primary} /> Results & Academics</h2>
                      <div style={{ padding: 40, background: '#f8fafc', borderRadius: 20 }}>
                         <h4 style={{ fontWeight: 800, marginBottom: 15 }}>CLASS X RESULT (LAST 3 YEARS)</h4>
                         <p>Consistent 100% result with 60% students scoring above 90% distinction in board examinations.</p>
                      </div>
                    </motion.div>
                  )}
                  {cbseSubTab === 'Staff' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 40 }}><FiUsers color={primary} /> Staff & Infrastructure</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 30 }}>
                         <div style={{ background: '#f8fafc', padding: 30, borderRadius: 20 }}>
                            <h4 style={{ fontWeight: 800, marginBottom: 10 }}>STAFF COUNT</h4>
                            <p>Total: 82 | PGT: 12 | TGT: 35 | PRT: 30</p>
                         </div>
                         <div style={{ background: '#f8fafc', padding: 30, borderRadius: 20 }}>
                            <h4 style={{ fontWeight: 800, marginBottom: 10 }}>INFRASTRUCTURE</h4>
                            <p>Classrooms: 45 | Labs: 6 | Library: 1</p>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )
      default:
        return (
          <>
            {/* News Ticker */}
            <div style={{ background: '#fef3c7', padding: '12px 5%', display: 'flex', alignItems: 'center', gap: 20, borderBottom: '1px solid #fde68a' }}>
              <span style={{ background: '#ef4444', color: 'white', padding: '4px 10px', borderRadius: 4, fontSize: 10, fontWeight: 900 }}>LATEST</span>
              <marquee style={{ fontSize: 13, fontWeight: 600, color: '#92400e' }}>
                • Admissions open for Academic Session 2026-27 • Annual Prize Distribution Ceremony on 25th Dec • Mandatory Public Disclosure Updated • Winter vacations from 1st Jan.
              </marquee>
            </div>

            {/* Hero Section */}
            <section style={{ height: 600, background: 'url(https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200) center/cover', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(30,58,138,0.8) 0%, transparent 100%)' }}></div>
              <div style={{ position: 'absolute', top: '50%', left: '5%', transform: 'translateY(-50%)', color: 'white', maxWidth: 650 }}>
                <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                  <h2 style={{ fontSize: 60, fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>Empowering <span style={{ color: accent }}>Young Minds</span> to Conquer the World.</h2>
                  <p style={{ fontSize: 18, color: '#e2e8f0', marginBottom: 40, lineHeight: 1.6 }}>An English Medium Co-educational Senior Secondary School following CBSE Curriculum with state-of-the-art facilities.</p>
                  <div style={{ display: 'flex', gap: 20 }}>
                    <button style={{ background: accent, color: 'white', padding: '16px 40px', border: 'none', borderRadius: 4, fontWeight: 800, fontSize: 16, cursor: 'pointer' }} onClick={() => setActiveTab('Admissions')}>APPLY ONLINE</button>
                    <button style={{ border: '2px solid white', background: 'transparent', color: 'white', padding: '16px 40px', borderRadius: 4, fontWeight: 700 }}>DOWNLOAD PROSPECTUS</button>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Quick Access Info Grid */}
            <section style={{ padding: '0 5%', marginTop: -50, position: 'relative', zIndex: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                {[
                  { title: 'Public Disclosure', icon: <FiFileText />, color: '#10b981' },
                  { title: 'Exam Results', icon: <FiAward />, color: '#3b82f6' },
                  { title: 'School Almanac', icon: <FiClock />, color: '#8b5cf6' },
                  { title: 'Holiday List', icon: <FiDownload />, color: '#f43f5e' }
                ].map((item, i) => (
                  <div key={i} style={{ background: 'white', padding: 30, borderRadius: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center', borderBottom: `4px solid ${item.color}`, cursor: 'pointer' }} onClick={() => setActiveTab('CBSE Corner')}>
                    <div style={{ color: item.color, fontSize: 32, marginBottom: 15 }}>{item.icon}</div>
                    <h4 style={{ fontSize: 16, fontWeight: 800 }}>{item.title}</h4>
                  </div>
                ))}
              </div>
            </section>

            {/* Principal Message Section */}
            <section style={{ padding: '100px 5%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 80, alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600" alt="Principal" style={{ width: '100%', borderRadius: 12, boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }} />
                  <div style={{ position: 'absolute', bottom: -20, left: 20, right: 20, background: primary, color: 'white', padding: '20px', borderRadius: 8, textAlign: 'center' }}>
                    <h4 style={{ margin: 0 }}>Dr. R.K. Sharma</h4>
                    <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>Principal, M.A, B.Ed, PhD</p>
                  </div>
                </div>
                <div>
                  <SectionTitle subtitle="Leader's Perspective" title="Principal's Message" />
                  <p style={{ fontSize: 17, color: '#475569', lineHeight: 1.8, fontStyle: 'italic' }}>
                    "Education is the most powerful weapon which you can use to change the world. At NMS, we provide a nurturing 
                    environment where every student can discover their unique potential and cultivate a life-long love for learning."
                  </p>
                  <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.8, marginTop: 20 }}>
                    Our school is committed to excellence in academics, sports, and co-curricular activities. We believe in 
                    holistic growth and prepare our students to face the global challenges of tomorrow with confidence and character.
                  </p>
                  <button style={{ marginTop: 30, background: 'none', border: `1px solid ${primary}`, color: primary, padding: '12px 30px', borderRadius: 4, fontWeight: 700 }} onClick={() => setActiveTab('About')}>READ MORE ABOUT OUR LEGACY</button>
                </div>
              </div>
            </section>

            {/* Toppers Corner */}
            <section style={{ padding: '100px 5%', background: '#f8fafc' }}>
              <SectionTitle subtitle="Academic Brilliance" title="Our Wall of Fame" centered />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 30 }}>
                {[
                  { name: 'Aryan Mehta', score: '98.6%', class: 'Class XII (PCM)', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200' },
                  { name: 'Sneha Gupta', score: '97.4%', class: 'Class XII (Comm)', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
                  { name: 'Rahul Verma', score: '99.2%', class: 'Class X', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
                  { name: 'Isha Khan', score: '96.8%', class: 'Class XII (Hum)', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' }
                ].map((t, i) => (
                  <div key={i} style={{ background: 'white', padding: 30, borderRadius: 24, textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <img src={t.img} style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', marginBottom: 15 }} />
                    <h4 style={{ margin: '0 0 5px', fontSize: 18, fontWeight: 900 }}>{t.name}</h4>
                    <p style={{ color: accent, fontWeight: 900, fontSize: 24, margin: '5px 0' }}>{t.score}</p>
                    <p style={{ color: '#64748b', fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>{t.class}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Upcoming Events */}
            <section style={{ padding: '100px 5%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 80 }}>
                <div>
                  <SectionTitle subtitle="School Life" title="Upcoming Calendar" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {[
                      { date: '15 Dec', title: 'Science Exhibition 2026', desc: 'A showcase of innovative robotics and environmental projects by middle and senior wing students.' },
                      { date: '25 Dec', title: 'Annual Day Celebration', desc: 'Our flagship cultural event featuring drama, dance, and the annual academic prize distribution.' },
                      { date: '10 Jan', title: 'Inter-House Sports Meet', desc: 'Three days of competitive athletics, basketball, and football matches at the NMS stadium.' }
                    ].map((e, i) => (
                      <div key={i} style={{ display: 'flex', gap: 30, alignItems: 'center', padding: '25px 0', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ minWidth: 80, textAlign: 'center', color: primary }}>
                          <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>{e.date.split(' ')[0]}</div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: accent }}>{e.date.split(' ')[1]}</div>
                        </div>
                        <div>
                          <h4 style={{ margin: '0 0 5px', fontWeight: 900 }}>{e.title}</h4>
                          <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{e.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: primary, borderRadius: 32, padding: 50, color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <FiAward size={50} color={accent} style={{ marginBottom: 25 }} />
                  <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 25 }}>Recent Accolades</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {[
                      'National Science Olympiad: 12 Gold Medals',
                      'District Basketball Championship: Winner',
                      'Swachh School Award: Ranked #1 in Zone',
                      'State Level Debate: Best Speaker Award'
                    ].map((ach, i) => (
                      <div key={i} style={{ display: 'flex', gap: 15, fontSize: 15, fontWeight: 600 }}>
                        <FiCheckCircle color={accent} style={{ marginTop: 4 }} /> <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )
    }
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b', background: '#fff' }}>
      {/* Top Utility Bar */}
      <div style={{ background: primary, color: 'white', padding: '12px 5%', display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700 }}>
        <div style={{ display: 'flex', gap: 25 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiPhone color={accent} /> +91 98765 43210</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiMail color={accent} /> info@nms.edu.in</span>
        </div>
        <div style={{ display: 'flex', gap: 25 }}>
          <a href="#/nms/erp" style={{ color: 'white', textDecoration: 'none' }}>ERP PORTAL LOGIN</a>
          <span style={{ color: accent }}>CBSE AFFILIATION NO: 1234567</span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '25px 5%', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15, cursor: 'pointer' }} onClick={() => setActiveTab('Home')}>
          <div style={{ width: 65, height: 65, background: primary, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 26, boxShadow: `0 10px 20px ${primary}20` }}>NMS</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: primary, margin: 0, letterSpacing: -1 }}>NEW MORNING STAR</h1>
            <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, fontWeight: 800, letterSpacing: 2 }}>ESTD: 1995 | RECOGNIZED BY CBSE</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 30, fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>
          {['Home', 'About', 'Academics', 'Admissions', 'CBSE Corner', 'Contact'].map(t => (
            <span key={t} style={{ color: activeTab === t ? primary : '#64748b', cursor: 'pointer', borderBottom: activeTab === t ? `3px solid ${accent}` : 'none', paddingBottom: 8, transition: '0.2s' }} onClick={() => setActiveTab(t)}>{t.toUpperCase()}</span>
          ))}
        </div>
      </nav>

      {/* Dynamic Content */}
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>

      {/* Mandatory Public Disclosure Banner (Sticky Home Bottom) */}
      {activeTab === 'Home' && (
        <section style={{ background: accent, padding: '70px 5%', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#1e3a8a', marginBottom: 15 }}>Mandatory Public Disclosure</h2>
          <p style={{ color: '#1e3a8a', opacity: 0.8, marginBottom: 35, maxWidth: 850, margin: '0 auto 35px', lineHeight: 1.6, fontSize: 17 }}>
            As per CBSE guidelines, all critical institutional information including financial statements, safety certificates, 
            and academic performance data are available for public scrutiny.
          </p>
          <button style={{ background: '#1e3a8a', color: 'white', padding: '18px 60px', border: 'none', borderRadius: 100, fontWeight: 900, fontSize: 15, cursor: 'pointer', boxShadow: '0 10px 20px rgba(30,58,138,0.2)' }} onClick={() => setActiveTab('CBSE Corner')}>ACCESS DISCLOSURE PORTAL</button>
        </section>
      )}

      {/* Comprehensive Footer */}
      <footer style={{ background: '#0f172a', color: 'white', padding: '100px 5% 40px', marginTop: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 80, marginBottom: 80 }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 25, color: accent }}>NEW MORNING STAR</h2>
            <p style={{ color: '#94a3b8', lineHeight: 2, fontSize: 14 }}>
              Providing a nurturing environment for holistic development since 1995. Our commitment to excellence 
              ensures every student becomes a confident, knowledgeable, and ethical leader of tomorrow.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 18, fontWeight: 900, marginBottom: 25 }}>ACADEMICS</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15, color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>
              <span onClick={() => setActiveTab('Admissions')} style={{ cursor: 'pointer' }}>Admission Policy</span> 
              <span onClick={() => setActiveTab('Academics')} style={{ cursor: 'pointer' }}>Our Curriculum</span> 
              <span>Student Council</span> 
              <span>Library Archive</span>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 18, fontWeight: 900, marginBottom: 25 }}>QUICK LINKS</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15, color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>
              <span onClick={() => setActiveTab('About')} style={{ cursor: 'pointer' }}>About NMS</span> 
              <span onClick={() => setActiveTab('CBSE Corner')} style={{ cursor: 'pointer' }}>CBSE Disclosure</span> 
              <span>Photo Gallery</span> 
              <span>Job Opportunities</span>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 18, fontWeight: 900, marginBottom: 25 }}>CONTACT</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, color: '#94a3b8', fontSize: 14 }}>
              <div style={{ display: 'flex', gap: 12 }}><FiMapPin color={accent} /> Sector 12, New Delhi</div>
              <div style={{ display: 'flex', gap: 12 }}><FiPhone color={accent} /> +91 98765 43210</div>
              <div style={{ display: 'flex', gap: 12 }}><FiMail color={accent} /> info@nms.edu.in</div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 50, textAlign: 'center', color: '#475569', fontSize: 12, fontWeight: 800, letterSpacing: 2 }}>
          © 2026 NEW MORNING STAR PUBLIC SCHOOL. AFFILIATED TO CBSE, NEW DELHI. POWERED BY SKOLUX.
        </div>
      </footer>
    </div>
  )
}
