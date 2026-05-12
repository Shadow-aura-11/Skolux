import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiPhone, FiMail, FiMapPin, FiArrowRight, FiCheckCircle, 
  FiDownload, FiFileText, FiAward, FiUsers, FiClock, FiBookOpen,
  FiTarget, FiShield, FiHeart, FiCamera, FiExternalLink, FiStar, FiCalendar, FiTrendingUp,
  FiInfo, FiLayers, FiList, FiSearch, FiHelpCircle, FiClock as FiTime, FiSmile, FiSun, FiMoon
} from 'react-icons/fi'

export default function StarlightWebsite() {
  const pink = "#ec4899"
  const blue = "#3b82f6"
  const yellow = "#eab308"
  const [activeTab, setActiveTab] = useState('Home')
  const [cbseSubTab, setCbseSubTab] = useState('General')

  const PlayfulTitle = ({ subtitle, title, centered = false, color = pink }) => (
    <div style={{ textAlign: centered ? 'center' : 'left', marginBottom: 50 }}>
      <span style={{ color: color, fontWeight: 900, letterSpacing: 2, fontSize: 12, textTransform: 'uppercase', background: `${color}15`, padding: '4px 12px', borderRadius: 100 }}>{subtitle}</span>
      <h2 style={{ fontSize: 'clamp(30px, 4vw, 45px)', fontWeight: 900, color: '#1e293b', marginTop: 15, fontFamily: "'Lexend', sans-serif" }}>{title}</h2>
      {centered && <div style={{ width: 60, height: 6, background: yellow, borderRadius: 3, margin: '15px auto 0' }}></div>}
    </div>
  )

  const renderContent = () => {
    switch(activeTab) {
      case 'About':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 0' }}>
            {/* 1. Our Magical Vision */}
            <div style={{ padding: '0 8%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginBottom: 120, alignItems: 'center' }}>
               <div>
                  <PlayfulTitle subtitle="The Dream" title="Our Magical Vision" />
                  <p style={{ fontSize: 18, lineHeight: 1.8, color: '#64748b' }}>
                    At Starlight, we see the world through the eyes of a child—full of wonder, color, and endless possibilities. 
                    Our vision is to create a nurturing universe where every little star feels safe to shine, explore, and grow.
                  </p>
                  <div style={{ marginTop: 30, display: 'flex', gap: 15 }}>
                     <div style={{ padding: '15px 25px', background: `${pink}10`, color: pink, borderRadius: 20, fontWeight: 900 }}>LOVE</div>
                     <div style={{ padding: '15px 25px', background: `${blue}10`, color: blue, borderRadius: 20, fontWeight: 900 }}>CARE</div>
                     <div style={{ padding: '15px 25px', background: `${yellow}10`, color: yellow, borderRadius: 20, fontWeight: 900 }}>PLAY</div>
                  </div>
               </div>
               <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=600" style={{ width: '100%', height: 450, objectFit: 'cover', borderRadius: 40 }} />
            </div>

            {/* 2. Meet the Mentors */}
            <div style={{ padding: '0 8%', marginBottom: 120 }}>
               <PlayfulTitle subtitle="Happy Faces" title="Meet Our Dream Team" centered color={blue} />
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
                 {[
                   { name: 'Auntie Sarah', role: 'Head of Joy', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300' },
                   { name: 'Teacher Mike', role: 'Adventure Lead', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300' },
                   { name: 'Auntie Priya', role: 'Creative Director', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300' }
                 ].map((m, i) => (
                   <div key={i} style={{ textAlign: 'center' }}>
                      <img src={m.img} style={{ width: 160, height: 160, borderRadius: '50%', objectFit: 'cover', marginBottom: 20, border: `8px solid ${i === 1 ? blue : pink}20` }} />
                      <h4 style={{ fontSize: 22, fontWeight: 900 }}>{m.name}</h4>
                      <p style={{ color: pink, fontWeight: 800, fontSize: 13 }}>{m.role}</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* 3. Playful Pillars (Values) */}
            <div style={{ padding: '100px 8%', background: '#fef2f2', borderRadius: 60, marginBottom: 120 }}>
               <PlayfulTitle subtitle="The Rules of Joy" title="Our Playful Pillars" centered />
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 30 }}>
                  {[
                    { icon: <FiHeart />, t: 'Kindness First', d: 'Teaching empathy in every interaction.' },
                    { icon: <FiSun />, t: 'Outdoor Play', d: 'Growing strong through nature and movement.' },
                    { icon: <FiMoon />, t: 'Rest & Grow', d: 'Understanding the value of quiet time.' },
                    { icon: <FiSmile />, t: 'Unlimited Joy', d: 'Making every lesson a happy memory.' }
                  ].map((p, i) => (
                    <div key={i} style={{ background: 'white', padding: 35, borderRadius: 32, textAlign: 'center', boxShadow: '0 20px 40px rgba(236, 72, 153, 0.05)' }}>
                       <div style={{ fontSize: 32, color: pink, marginBottom: 15 }}>{p.icon}</div>
                       <h5 style={{ fontWeight: 900, marginBottom: 10 }}>{p.t}</h5>
                       <p style={{ fontSize: 13, color: '#64748b' }}>{p.d}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* 4. Growing Together (Timeline) */}
            <div style={{ padding: '0 8%', marginBottom: 120 }}>
               <PlayfulTitle subtitle="Our Journey" title="Growing Together" centered color={yellow} />
               <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: 80 }}>
                  <div style={{ position: 'absolute', top: 20, left: 0, right: 0, height: 4, background: '#f1f5f9' }}></div>
                  {['Born in 2010', 'First Garden', '100 Stars', 'Future Dreams'].map((y, i) => (
                    <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                       <div style={{ width: 40, height: 40, background: i % 2 ? blue : pink, borderRadius: '50%', margin: '0 auto 20px' }}></div>
                       <h5 style={{ fontWeight: 900 }}>{y}</h5>
                    </div>
                  ))}
               </div>
            </div>

            {/* 5. Colorful Campus (Infrastructure) */}
            <div style={{ padding: '0 8%', marginBottom: 120 }}>
               <PlayfulTitle subtitle="The Star Castle" title="Our Colorful Campus" />
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
                 {[
                   'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
                   'https://images.unsplash.com/photo-1516627145497-ae6968895b74',
                   'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368'
                 ].map((img, i) => (
                   <img key={i} src={`${img}?auto=format&fit=crop&q=80&w=400`} style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 32 }} />
                 ))}
               </div>
            </div>

            {/* 6. Why Starlight? */}
            <div style={{ padding: '100px 8%', background: blue, color: 'white', borderRadius: 50, textAlign: 'center' }}>
               <h3 style={{ fontSize: 36, fontWeight: 900, marginBottom: 20 }}>Why Starlight?</h3>
               <p style={{ opacity: 0.8, maxWidth: 600, margin: '0 auto 40px' }}>Because every child deserves a childhood full of color and a future full of light.</p>
               <button style={{ background: 'white', color: blue, padding: '15px 40px', borderRadius: 100, border: 'none', fontWeight: 900 }}>ENROLL YOUR STAR</button>
            </div>
          </motion.div>
        )
      case 'Academics':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 0' }}>
            {/* 1. Play-Based Curriculum */}
            <div style={{ padding: '0 8%', marginBottom: 120 }}>
               <PlayfulTitle subtitle="Learning is Fun" title="Play-Based Curriculum" centered />
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
                 {[
                   { t: 'Toddler Town', g: 'Ages 2-3', d: 'Sensory exploration and social initiation through guided group play.' },
                   { t: 'Junior Explorers', g: 'Ages 3-4', d: 'Early literacy, numeracy and foundational language building blocks.' },
                   { t: 'Pre-Primary Stars', g: 'Ages 4-5', d: 'Advanced social skills and preparation for the primary school journey.' }
                 ].map((p, i) => (
                   <div key={i} style={{ padding: 40, border: '4px solid #f1f5f9', borderRadius: 40, textAlign: 'center' }}>
                      <h4 style={{ fontWeight: 900, fontSize: 24, color: i === 1 ? blue : pink }}>{p.t}</h4>
                      <p style={{ fontWeight: 900, fontSize: 13, color: yellow, marginBottom: 20 }}>{p.g}</p>
                      <p style={{ color: '#64748b', fontSize: 15 }}>{p.d}</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* 2. Creative Arts & Music */}
            <div style={{ padding: '100px 8%', background: '#fffbeb', borderRadius: 60, marginBottom: 120 }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
                  <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600" style={{ width: '100%', borderRadius: 40 }} />
                  <div>
                    <PlayfulTitle subtitle="Creativity" title="Arts & Music Studio" color={yellow} />
                    <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.8 }}>We believe in the power of messy hands and happy songs. Our dedicated art and music studio is where imagination takes flight every single day.</p>
                  </div>
               </div>
            </div>

            {/* 3. Physical Development */}
            <div style={{ padding: '0 8%', marginBottom: 120 }}>
               <PlayfulTitle subtitle="Strong & Active" title="Physical Development" centered color={blue} />
               <p style={{ textAlign: 'center', color: '#64748b', fontSize: 18, maxWidth: 800, margin: '0 auto' }}>From yoga for toddlers to playground adventures, we ensure every child develops coordination, strength and team spirit.</p>
            </div>

            {/* 4. Sensory Playroom */}
            <div style={{ padding: '0 8% 120px' }}>
               <div style={{ background: '#f0f9ff', padding: 80, borderRadius: 60, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: 32, fontWeight: 900, color: blue }}>The Sensory Playroom</h3>
                    <p style={{ color: '#64748b', marginTop: 20 }}>A specialized environment for tactile learning, helping children understand textures, shapes and patterns through hands-on activity.</p>
                  </div>
                  <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600" style={{ width: '100%', borderRadius: 40 }} />
               </div>
            </div>

            {/* 5. Learning Awards */}
            <div style={{ textAlign: 'center', marginBottom: 120 }}>
               <FiAward size={60} color={yellow} style={{ marginBottom: 20 }} />
               <h3 style={{ fontSize: 32, fontWeight: 900 }}>Happy Certificates</h3>
               <p style={{ color: '#64748b' }}>Every milestone is celebrated with a smile and a "Star of the Week" award!</p>
            </div>

            {/* 6. Class Houses */}
            <div style={{ padding: '0 8%' }}>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 30 }}>
                  {['DOLPHINS', 'BUTTERFLIES', 'PANDAS', 'KOALAS'].map((h, i) => (
                    <div key={i} style={{ padding: 40, background: i % 2 ? '#fdf2f8' : '#f0f9ff', borderRadius: 32, textAlign: 'center' }}>
                       <h4 style={{ fontWeight: 900, color: i % 2 ? pink : blue }}>{h}</h4>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )
      case 'Admissions':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 0' }}>
            {/* 1. Parent Guide */}
            <div style={{ padding: '0 8%', marginBottom: 120 }}>
               <PlayfulTitle subtitle="Join Us" title="Little Star Guidelines" />
               <div style={{ background: '#f8fafc', padding: 60, borderRadius: 40, border: '4px dashed #e2e8f0' }}>
                  <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.8 }}>We understand that choosing a pre-school is a big step. We make it easy with a transparent process and a warm welcome for every family.</p>
               </div>
            </div>

            {/* 2. Little Fees */}
            <div style={{ padding: '100px 8%', background: '#fffbeb', borderRadius: 60, marginBottom: 120 }}>
               <PlayfulTitle subtitle="Investment" title="The Little Fee Table" centered color={yellow} />
               <div style={{ maxWidth: 800, margin: '0 auto', background: 'white', borderRadius: 32, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: yellow, color: 'white' }}>
                      <tr><th style={{ padding: 25 }}>GRADE</th><th style={{ padding: 25 }}>TERM FEE</th></tr>
                    </thead>
                    <tbody>
                      {['Toddler', 'Junior', 'Pre-Primary'].map(g => (
                        <tr key={g} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: 25, textAlign: 'center', fontWeight: 900 }}>{g}</td>
                          <td style={{ padding: 25, textAlign: 'center', color: pink, fontWeight: 900 }}>ENQUIRE AT OFFICE</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>

            {/* 3. Simple Steps (Timeline) */}
            <div style={{ padding: '0 8%', marginBottom: 120 }}>
               <PlayfulTitle subtitle="Steps" title="The Happy Journey" centered />
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 30, textAlign: 'center' }}>
                  {['Play Date', 'Talk Time', 'Paper Fun', 'First Day!'].map((s, i) => (
                    <div key={i}>
                       <div style={{ width: 60, height: 60, background: i % 2 ? blue : pink, color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontWeight: 900, fontSize: 24 }}>{i+1}</div>
                       <h5 style={{ fontWeight: 900 }}>{s}</h5>
                    </div>
                  ))}
               </div>
            </div>

            {/* 4. Age Groups */}
            <div style={{ padding: '80px 8%', background: '#fdf2f8', textAlign: 'center', marginBottom: 120 }}>
               <h3 style={{ fontWeight: 900, marginBottom: 20 }}>Who Can Join?</h3>
               <p style={{ color: pink, fontSize: 24, fontWeight: 900 }}>Little Stars aged 2 to 5 years old!</p>
            </div>

            {/* 5. Goodbye Policy (Withdrawal) */}
            <div style={{ padding: '0 8%', marginBottom: 120 }}>
               <PlayfulTitle subtitle="Policy" title="The Goodbye Norms" />
               <p style={{ color: '#64748b', fontSize: 18 }}>We hope you never have to leave, but if you do, we require a 30-day notice period to say our proper goodbyes and clear all happy accounts.</p>
            </div>

            {/* 6. Happy FAQ */}
            <div style={{ padding: '100px 8%', background: pink, color: 'white', borderRadius: 60 }}>
               <PlayfulTitle subtitle="Help" title="Happy FAQ" color="#fff" />
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                 {[
                   { q: 'Is there a nap time?', a: 'Yes! We have a cozy rest hour every afternoon for all our stars.' },
                   { q: 'Do you provide snacks?', a: 'We offer healthy fruit and milk breaks twice a day.' },
                   { q: 'Is the school CCTV monitored?', a: 'Absolutely, 24/7 security and parent-access cameras in common areas.' },
                   { q: 'What is the teacher ratio?', a: 'A warm 1:6 ratio to ensure every child gets plenty of cuddles and care.' }
                 ].map((faq, i) => (
                   <div key={i}>
                      <h5 style={{ fontWeight: 900, marginBottom: 10 }}>{faq.q}</h5>
                      <p style={{ opacity: 0.8, fontSize: 14 }}>{faq.a}</p>
                   </div>
                 ))}
               </div>
            </div>
          </motion.div>
        )
      case 'Contact':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 0' }}>
            {/* 1. Finding the Star (Address) */}
            <div style={{ padding: '0 8%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30, marginBottom: 100 }}>
               <div style={{ padding: 40, background: '#fdf2f8', borderRadius: 40, textAlign: 'center' }}>
                  <FiMapPin size={40} color={pink} style={{ marginBottom: 20 }} />
                  <h4 style={{ fontWeight: 900, marginBottom: 10 }}>The Star Castle</h4>
                  <p style={{ color: '#64748b', fontSize: 14 }}>123 Rainbow Lane, Sunshine Sector,<br />South Delhi, India</p>
               </div>
               <div style={{ padding: 40, background: '#f0f9ff', borderRadius: 40, textAlign: 'center' }}>
                  <FiPhone size={40} color={blue} style={{ marginBottom: 20 }} />
                  <h4 style={{ fontWeight: 900, marginBottom: 10 }}>Say Hello!</h4>
                  <p style={{ color: '#64748b', fontSize: 14 }}>+91 99999 88888<br />011-2223334</p>
               </div>
               <div style={{ padding: 40, background: '#fffbeb', borderRadius: 40, textAlign: 'center' }}>
                  <FiMail size={40} color={yellow} style={{ marginBottom: 20 }} />
                  <h4 style={{ fontWeight: 900, marginBottom: 10 }}>Sparkle Email</h4>
                  <p style={{ color: '#64748b', fontSize: 14 }}>hello@starlight.edu.in<br />star@starlight.edu.in</p>
               </div>
            </div>

            {/* 2. Say Hello (Form) */}
            <div style={{ padding: '0 8% 120px' }}>
               <div style={{ maxWidth: 900, margin: '0 auto', background: 'white', padding: 60, borderRadius: 60, boxShadow: '0 30px 60px rgba(0,0,0,0.05)', border: '4px solid #f1f5f9' }}>
                  <PlayfulTitle subtitle="Send a Smile" title="The Happy Inquiry Box" centered />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                     <input type="text" placeholder="PARENT NAME" style={{ padding: 20, borderRadius: 20, border: '2px solid #f1f5f9', fontWeight: 900, color: pink }} />
                     <input type="text" placeholder="LITTLE STAR NAME" style={{ padding: 20, borderRadius: 20, border: '2px solid #f1f5f9', fontWeight: 900, color: blue }} />
                  </div>
                  <input type="email" placeholder="EMAIL ADDRESS" style={{ width: '100%', padding: 20, borderRadius: 20, border: '2px solid #f1f5f9', fontWeight: 900, marginBottom: 20 }} />
                  <textarea placeholder="WHAT WOULD YOU LIKE TO ASK?" rows={4} style={{ width: '100%', padding: 20, borderRadius: 20, border: '2px solid #f1f5f9', fontWeight: 900, marginBottom: 40 }}></textarea>
                  <button style={{ width: '100%', background: pink, color: 'white', padding: '20px', borderRadius: 100, border: 'none', fontWeight: 900, fontSize: 18 }}>SEND TO THE STARS!</button>
               </div>
            </div>

            {/* 3. Map to Magic */}
            <div style={{ padding: '0 8% 120px' }}>
               <div style={{ height: 400, background: '#f1f5f9', borderRadius: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px dashed #e2e8f0' }}>
                  <span style={{ fontWeight: 900, color: '#94a3b8', fontSize: 20 }}>[ THE RAINBOW MAP TO OUR CASTLE ]</span>
               </div>
            </div>

            {/* 4. Visiting Hours */}
            <div style={{ padding: '80px 8%', background: '#fffbeb', borderRadius: 60, textAlign: 'center', marginBottom: 120 }}>
               <h3 style={{ fontWeight: 900, marginBottom: 10 }}>Happy Visiting Hours</h3>
               <p style={{ color: '#64748b' }}>Mon — Fri: 9:00 AM to 1:00 PM (With Happy Appointment!)</p>
            </div>

            {/* 5. Social Playground */}
            <div style={{ textAlign: 'center', marginBottom: 120 }}>
               <h3 style={{ fontWeight: 900, marginBottom: 40 }}>Our Social Playground</h3>
               <div style={{ display: 'flex', justifyContent: 'center', gap: 40, fontSize: 32 }}>
                  <FiCamera color={pink} /> <FiSmile color={blue} /> <FiSun color={yellow} /> <FiHeart color={pink} />
               </div>
            </div>

            {/* 6. Sparkle News (Newsletter) */}
            <div style={{ padding: '100px 8%', background: blue, color: 'white', borderRadius: 60, textAlign: 'center' }}>
               <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>Join the Sparkle List</h3>
               <p style={{ opacity: 0.8, marginBottom: 40 }}>Weekly tips for parents and campus news.</p>
               <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                  <input type="text" placeholder="YOUR EMAIL" style={{ padding: '18px 35px', borderRadius: 100, border: 'none', width: 400 }} />
                  <button style={{ background: yellow, color: 'white', padding: '18px 40px', borderRadius: 100, border: 'none', fontWeight: 900 }}>SIGN UP</button>
               </div>
            </div>
          </motion.div>
        )
      case 'CBSE Corner':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#fdf2f8', minHeight: '100vh' }}>
             <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 0 }}>
              <div style={{ background: 'white', height: 'calc(100vh - 100px)', position: 'sticky', top: 100, borderRight: '4px solid #fce7f3', padding: '40px 0' }}>
                <div style={{ padding: '0 30px 20px', borderBottom: '2px solid #fdf2f8', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: pink }}>STAR_PORTAL</h3>
                  <p style={{ fontSize: 10, color: blue, fontWeight: 800, letterSpacing: 2 }}>OFFICIAL_STUFF</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {[
                    { id: 'General', label: 'School_Info', icon: <FiInfo /> },
                    { id: 'Documents', label: 'Happy_Docs', icon: <FiFileText /> },
                    { id: 'Results', label: 'Star_Logs', icon: <FiTrendingUp /> },
                    { id: 'Staff', label: 'Care_Team', icon: <FiUsers /> }
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
                        fontWeight: 900,
                        color: cbseSubTab === tab.id ? pink : '#94a3b8',
                        background: cbseSubTab === tab.id ? '#fff1f2' : 'transparent',
                        borderRight: cbseSubTab === tab.id ? `6px solid ${pink}` : 'none'
                      }}
                    >
                      {tab.icon} {tab.label.toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '60px 80px' }}>
                <div style={{ background: 'white', padding: 60, borderRadius: 40, boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
                  {cbseSubTab === 'General' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                       <h2 style={{ fontSize: 28, fontWeight: 900, color: pink, marginBottom: 40 }}>Little_Star_Identity</h2>
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
                          {[
                            ['SCHOOL', 'STARLIGHT PRE-SCHOOL'], ['MANAGER', 'MRS. SARAH JANE'],
                            ['LEVEL', 'PRE-PRIMARY (CBSE)'], ['EMAIL', 'hello@starlight.edu']
                          ].map(it => (
                            <div key={it[0]} style={{ paddingBottom: 15, borderBottom: '2px solid #fdf2f8' }}>
                               <span style={{ fontSize: 10, fontWeight: 900, color: blue }}>{it[0]}</span>
                               <p style={{ margin: '5px 0 0', fontWeight: 900 }}>{it[1]}</p>
                            </div>
                          ))}
                       </div>
                    </motion.div>
                  )}
                  {cbseSubTab === 'Documents' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                       {['BUILDING_SAFETY', 'FIRE_SAFETY', 'SOCIETY_REG', 'NOC'].map(d => (
                         <div key={d} style={{ padding: 25, background: '#fdf2f8', borderRadius: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 900 }}>{d}</span>
                            <FiDownload color={pink} />
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
            {/* Playful Ticker */}
            <div style={{ background: '#f0f9ff', padding: '12px 5%', borderBottom: '4px solid #dbeafe' }}>
               <marquee style={{ fontSize: 14, fontWeight: 900, color: blue }}>✨ Admissions Open for the Session 2026-27 ✨ Join us for the Rainbow Summer Camp ✨ Star of the Month: Little Advik! ✨</marquee>
            </div>

            {/* Bubble Hero */}
            <section style={{ padding: '100px 5% 150px', background: 'white', position: 'relative', overflow: 'hidden' }}>
               <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: `${pink}10`, borderRadius: '50%' }}></div>
               <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, background: `${blue}10`, borderRadius: '50%' }}></div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 100, alignItems: 'center', position: 'relative', zIndex: 2 }}>
                  <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                     <span style={{ background: yellow, color: 'white', padding: '6px 15px', borderRadius: 100, fontWeight: 900, fontSize: 12 }}>HAPPY PLACE</span>
                     <h1 style={{ fontSize: 'clamp(40px, 6vw, 75px)', fontWeight: 900, lineHeight: 1.1, margin: '20px 0' }}>Where Every<br /><span style={{ color: pink }}>Star</span> Comes to<br /><span style={{ color: blue }}>Shine!</span></h1>
                     <p style={{ fontSize: 20, color: '#64748b', marginBottom: 40, lineHeight: 1.6 }}>The most vibrant and loving pre-school environment for your little ones to explore and grow.</p>
                     <div style={{ display: 'flex', gap: 20 }}>
                        <button style={{ background: pink, color: 'white', padding: '18px 45px', borderRadius: 100, border: 'none', fontWeight: 900, fontSize: 16 }} onClick={() => setActiveTab('Admissions')}>START JOURNEY</button>
                        <button style={{ background: 'white', color: blue, padding: '18px 45px', borderRadius: 100, border: `4px solid ${blue}`, fontWeight: 900 }}>WATCH VIDEO</button>
                     </div>
                  </motion.div>
                  <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=600" style={{ width: '100%', borderRadius: 60, boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }} />
               </div>
            </section>

            {/* Happy Stats */}
            <section style={{ padding: '0 5% 100px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 25 }}>
               {[
                 { val: '200+', label: 'HAPPY STARS', color: pink },
                 { val: '15+', label: 'CREATIVE CLUBS', color: blue },
                 { val: '100%', label: 'LOVE & CARE', color: yellow },
                 { val: '24/7', label: 'SAFETY WATCH', color: '#10b981' }
               ].map((s, i) => (
                 <div key={i} style={{ padding: 40, background: `${s.color}05`, borderRadius: 40, textAlign: 'center', border: `2px solid ${s.color}10` }}>
                    <h3 style={{ fontSize: 40, fontWeight: 900, color: s.color, margin: 0 }}>{s.val}</h3>
                    <p style={{ fontSize: 12, fontWeight: 900, color: '#94a3b8', letterSpacing: 2 }}>{s.label}</p>
                 </div>
               ))}
            </section>

            {/* Mini Programs */}
            <section style={{ padding: '100px 5%', background: '#f8fafc' }}>
               <PlayfulTitle subtitle="Mini Programs" title="Our Learning Worlds" centered />
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
                  {[
                    { t: 'Art Attack', d: 'Unleashing creativity through colors, clay and craft.', c: pink },
                    { t: 'Little Mozart', d: 'Discovering the joy of rhythm and melodies.', c: blue },
                    { t: 'Eco Explorers', d: 'Learning to love and protect our planet.', c: yellow }
                  ].map((p, i) => (
                    <div key={i} style={{ padding: 40, background: 'white', borderRadius: 40, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
                       <h4 style={{ color: p.c, fontWeight: 900, fontSize: 24, marginBottom: 15 }}>{p.t}</h4>
                       <p style={{ color: '#64748b', fontSize: 14 }}>{p.d}</p>
                    </div>
                  ))}
               </div>
            </section>

            {/* Photo Gallery */}
            <section style={{ padding: '100px 5%' }}>
               <PlayfulTitle subtitle="Moments" title="Starlight Memories" />
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                  {[
                    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
                    'https://images.unsplash.com/photo-1516627145497-ae6968895b74',
                    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368',
                    'https://images.unsplash.com/photo-1581092160562-40aa08e78837'
                  ].map((img, i) => (
                    <img key={i} src={`${img}?auto=format&fit=crop&q=80&w=300`} style={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: 24 }} />
                  ))}
               </div>
            </section>

            {/* Disclosure Banner */}
            <section style={{ padding: '80px 5%', background: pink, color: 'white', textAlign: 'center' }}>
               <h2 style={{ fontSize: 32, fontWeight: 900 }}>Institutional Portal</h2>
               <p style={{ opacity: 0.8, marginBottom: 30 }}>Mandatory Public Disclosure & Little Star success logs.</p>
               <button style={{ background: 'white', color: pink, padding: '15px 45px', borderRadius: 100, border: 'none', fontWeight: 900 }} onClick={() => setActiveTab('CBSE Corner')}>ACCESS PORTAL</button>
            </section>
          </>
        )
    }
  }

  return (
    <div style={{ background: 'white', color: '#1e293b', minHeight: '100vh', fontFamily: "'Lexend', sans-serif" }}>
      {/* Playful Navigation */}
      <nav style={{ padding: '25px 5%', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15, cursor: 'pointer' }} onClick={() => setActiveTab('Home')}>
          <div style={{ width: 50, height: 50, background: pink, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 28 }}><FiStar /></div>
          <span style={{ fontSize: 24, fontWeight: 900, color: pink, letterSpacing: -1 }}>STARLIGHT<span style={{ color: blue }}>_PRESCHOOL</span></span>
        </div>
        <div style={{ display: 'flex', gap: 30, fontWeight: 900, fontSize: 13 }}>
          {['Home', 'About', 'Academics', 'Admissions', 'CBSE Corner', 'Contact'].map(t => (
            <span key={t} style={{ cursor: 'pointer', color: activeTab === t ? pink : '#94a3b8' }} onClick={() => setActiveTab(t)}>{t.toUpperCase()}</span>
          ))}
        </div>
        <a href="#/starlight/erp" style={{ background: yellow, color: 'white', padding: '10px 25px', borderRadius: 100, fontWeight: 900, fontSize: 12, textDecoration: 'none' }}>ERP LOGIN</a>
      </nav>

      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>

      {/* Playful Footer */}
      <footer style={{ background: '#f8fafc', padding: '100px 5% 40px', borderTop: '8px solid #f1f5f9' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 80, marginBottom: 80 }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: pink }}>STARLIGHT</h2>
            <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: 14, marginTop: 20 }}>Where learning is a magical adventure and every child is a star. Since 2010.</p>
          </div>
          <div><h4 style={{ color: blue }}>DISCOVER</h4><div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, fontWeight: 900, color: '#94a3b8', marginTop: 20 }}><span onClick={() => setActiveTab('About')} style={{ cursor: 'pointer' }}>OUR MAGIC</span><span onClick={() => setActiveTab('Academics')} style={{ cursor: 'pointer' }}>OUR WORLDS</span></div></div>
          <div><h4 style={{ color: yellow }}>PORTAL</h4><div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, fontWeight: 900, color: '#94a3b8', marginTop: 20 }}><span onClick={() => setActiveTab('CBSE Corner')} style={{ cursor: 'pointer' }}>PUBLIC DATA</span><span>PARENT APP</span></div></div>
          <div><h4 style={{ color: pink }}>HELLO</h4><div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, fontWeight: 900, color: '#94a3b8', marginTop: 20 }}><span>RAINBOW LANE</span><span>+91 99999 88888</span></div></div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 900, color: '#cbd5e1', letterSpacing: 2 }}>© 2026 STARLIGHT PRE-SCHOOL // POWERED BY SKOLUX</div>
      </footer>
    </div>
  )
}
