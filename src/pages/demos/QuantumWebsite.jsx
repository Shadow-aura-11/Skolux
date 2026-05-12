import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiCpu, FiZap, FiGlobe, FiLayout, FiActivity, FiShield, 
  FiSmartphone, FiCode, FiTerminal, FiLayers, FiMessageSquare, FiCommand,
  FiMapPin, FiCpu as FiQuantum, FiMonitor, FiDatabase, FiAward, FiUsers, FiClock, FiDownload, FiCheckCircle
} from 'react-icons/fi'

export default function QuantumWebsite() {
  const accent = "#06b6d4" // Cyan
  const [activeTab, setActiveTab] = useState('Home')
  const [cbseSubTab, setCbseSubTab] = useState('General')

  const renderContent = () => {
    switch(activeTab) {
      case 'About':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 5%' }}>
            {/* 1. Vision: The Singularity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 100, marginBottom: 120 }}>
              <div>
                <span style={{ color: accent, fontWeight: 900, fontSize: 12, letterSpacing: 5 }}>_THE_ARCHITECTS_OF_2050</span>
                <h2 style={{ fontSize: 48, fontWeight: 900, marginTop: 20, marginBottom: 30 }}>Programming<br />Human Potential.</h2>
                <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.8 }}>
                  Quantum Academy is not just a school; it is a specialized node in the global intelligence network. 
                  We believe that the integration of biological intelligence with algorithmic logic is the next frontier of human evolution.
                </p>
              </div>
              <div style={{ height: 400, background: 'rgba(255,255,255,0.02)', borderRadius: 32, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                 <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) brightness(0.7)' }} />
              </div>
            </div>

            {/* 2. Management: The System Architects */}
            <div style={{ textAlign: 'center', marginBottom: 120 }}>
               <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 60 }}>System_Architects</h3>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
                 {[
                   { name: 'Dr. Orion Vance', role: 'Head of Neural Research', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300' },
                   { name: 'Elena Frost', role: 'Lead Interface Designer', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300' },
                   { name: 'Marcus Code', role: 'Operations Architect', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300' }
                 ].map((m, i) => (
                   <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: 40, borderRadius: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
                     <img src={m.img} style={{ width: 120, height: 120, borderRadius: '50%', marginBottom: 20, border: `2px solid ${accent}` }} />
                     <h4 style={{ margin: 0, fontSize: 20 }}>{m.name}</h4>
                     <p style={{ color: accent, fontSize: 12, fontWeight: 900, marginTop: 5 }}>{m.role}</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* 3. Core Values: Algorithmic Logic */}
            <div style={{ marginBottom: 120 }}>
               <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 50 }}>Core_Directives</h3>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                 {['Computational Thinking', 'Bio-Ethical Integrity', 'Decentralized Growth', 'Radical Innovation'].map(v => (
                   <div key={v} style={{ padding: 30, background: 'rgba(6, 182, 212, 0.05)', border: `1px solid ${accent}20`, borderRadius: 16 }}>
                     <h5 style={{ margin: 0, color: accent }}>{v.toUpperCase()}</h5>
                   </div>
                 ))}
               </div>
            </div>

            {/* 4. Tech Heritage (Timeline) */}
            <div style={{ marginBottom: 120, padding: 60, background: 'rgba(255,255,255,0.01)', borderRadius: 32 }}>
               <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 60 }}>System_Evolution</h3>
               <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                 <div style={{ position: 'absolute', top: 10, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.1)' }}></div>
                 {['2015: Alpha_Node', '2018: Global_Mesh', '2022: AI_Integrated', '2026: Quantum_Leap'].map(y => (
                   <div key={y} style={{ position: 'relative', textAlign: 'center' }}>
                     <div style={{ width: 20, height: 20, background: accent, borderRadius: '50%', margin: '0 auto 20px', boxShadow: `0 0 20px ${accent}` }}></div>
                     <h5 style={{ fontSize: 14 }}>{y}</h5>
                   </div>
                 ))}
               </div>
            </div>

            {/* 5. Neural Labs (Infrastructure) */}
            <div style={{ marginBottom: 120 }}>
               <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40 }}>_Campus_Hardware</h3>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: 30, borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <FiMonitor size={32} color={accent} style={{ marginBottom: 20 }} />
                    <h4 style={{ marginBottom: 10 }}>Holographic Classrooms</h4>
                    <p style={{ color: '#64748b', fontSize: 14 }}>Immersive 3D environments for spatial science and architectural modeling.</p>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: 30, borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <FiDatabase size={32} color={accent} style={{ marginBottom: 20 }} />
                    <h4 style={{ marginBottom: 10 }}>Bio-Neural Lab</h4>
                    <p style={{ color: '#64748b', fontSize: 14 }}>Specialized facilities for understanding biological computing and cellular logic.</p>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: 30, borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <FiQuantum size={32} color={accent} style={{ marginBottom: 20 }} />
                    <h4 style={{ marginBottom: 10 }}>Quantum Processor Hub</h4>
                    <p style={{ color: '#64748b', fontSize: 14 }}>Direct access to distributed quantum compute nodes for student research.</p>
                  </div>
               </div>
            </div>

            {/* 6. Why Choose us? (Advantage) */}
            <div style={{ textAlign: 'center' }}>
               <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>_The_Quantum_Advantage</h3>
               <p style={{ color: '#94a3b8', marginBottom: 50 }}>Why we are the primary node for futuristic education.</p>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
                 {['AI-Native Learning', 'Global Tech Partnerships', 'Industry Integrated Degree'].map(a => (
                   <div key={a} style={{ padding: 40, background: accent, color: '#020617', borderRadius: 20, fontWeight: 900 }}>{a.toUpperCase()}</div>
                 ))}
               </div>
            </div>
          </motion.div>
        )
      case 'Academics':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 5%' }}>
            {/* 1. Integrated Curriculum */}
            <div style={{ marginBottom: 120 }}>
               <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 60 }}>Neural_Curriculum_Pathways</h2>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
                 {[
                   { title: 'Foundation Node', level: 'Classes I - V', focus: 'Algorithmic thinking, basic biological logic, and sensory coding.' },
                   { title: 'Core Interface', level: 'Classes VI - VIII', focus: 'Complex data structures, robotics, and fundamental physics.' },
                   { title: 'Apex Specialization', level: 'Classes IX - XII', focus: 'Quantum computing, AI research, and senior board proficiency.' }
                 ].map((p, i) => (
                   <div key={i} style={{ padding: 40, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24 }}>
                     <h4 style={{ fontSize: 22, fontWeight: 900, color: accent }}>{p.title}</h4>
                     <p style={{ fontSize: 12, fontWeight: 800, marginTop: 5, marginBottom: 20 }}>{p.level}</p>
                     <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7 }}>{p.focus}</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* 2. Specialized Electives */}
            <div style={{ padding: '80px 5%', background: 'rgba(6, 182, 212, 0.03)', borderRadius: 40, marginBottom: 120 }}>
               <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40 }}>Specialized_Electives</h3>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                 {['Cybersecurity', 'Bio-Hacking', 'Blockchain', 'UAV Systems'].map(e => (
                   <div key={e} style={{ padding: 25, background: 'rgba(0,0,0,0.5)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontWeight: 700 }}>{e}</div>
                 ))}
               </div>
            </div>

            {/* 3. Research Faculty */}
            <div style={{ marginBottom: 120 }}>
               <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 30 }}>Faculty_Researchers</h3>
               <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 800 }}>
                 Our educators are active researchers in Silicon Valley and global tech hubs, bringing real-time industry breakthroughs to the classroom.
               </p>
            </div>

            {/* 4. Student Hub (Portal) */}
            <div style={{ padding: '80px 5%', background: 'rgba(255,255,255,0.01)', borderRadius: 32, marginBottom: 120 }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'center' }}>
                  <img src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=600" style={{ width: '100%', borderRadius: 24, filter: 'hue-rotate(180deg)' }} />
                  <div>
                    <h3 style={{ fontSize: 32, fontWeight: 900 }}>The_Neural_Nexus</h3>
                    <p style={{ color: '#64748b', marginTop: 20, fontSize: 16, lineHeight: 1.8 }}>
                      Every student is assigned a digital twin in the Neural Nexus portal, tracking their progress across cognitive, creative, and technical dimensions in real-time.
                    </p>
                  </div>
               </div>
            </div>

            {/* 5. Academic Accolades */}
            <div style={{ textAlign: 'center', marginBottom: 120 }}>
               <FiAward size={60} color={accent} style={{ marginBottom: 30 }} />
               <h3 style={{ fontSize: 32, fontWeight: 900 }}>System_Success_Logs</h3>
               <p style={{ color: '#94a3b8' }}>Consistent 100% placement in global technical universities.</p>
            </div>

            {/* 6. House System (Nodes) */}
            <div style={{ padding: '100px 5%', background: 'rgba(0,0,0,0.3)', borderRadius: 40 }}>
               <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 50, textAlign: 'center' }}>House_Nodes</h3>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 30 }}>
                 {[
                   { name: 'ALPHA', color: accent, motto: 'Pioneer' },
                   { name: 'BETA', color: '#8b5cf6', motto: 'Architect' },
                   { name: 'GAMMA', color: '#f43f5e', motto: 'Optimizer' },
                   { name: 'DELTA', color: '#10b981', motto: 'Synthesizer' }
                 ].map(h => (
                   <div key={h.name} style={{ padding: 40, textAlign: 'center', border: `1px solid ${h.color}30`, borderRadius: 24 }}>
                     <h2 style={{ color: h.color, margin: 0 }}>{h.name}</h2>
                     <p style={{ fontSize: 11, fontWeight: 900, opacity: 0.5 }}>MOTTO: {h.motto}</p>
                   </div>
                 ))}
               </div>
            </div>
          </motion.div>
        )
      case 'Admissions':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 5%' }}>
            {/* 1. Eligibility (Assessment) */}
            <div style={{ marginBottom: 100 }}>
               <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 40 }}>Protocol:_Selection</h2>
               <div style={{ background: 'rgba(255,255,255,0.02)', padding: 50, borderRadius: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
                 <h4 style={{ color: accent, marginBottom: 20 }}>Neuro-Cognitive Assessment</h4>
                 <p style={{ color: '#94a3b8', lineHeight: 1.8 }}>
                   Admission to Quantum Academy is based on a proprietary neuro-cognitive evaluation that measures logical reasoning, 
                   spatial intelligence, and creative adaptability. We do not look at past grades alone.
                 </p>
               </div>
            </div>

            {/* 2. Tokenized Fee (Structure) */}
            <div style={{ marginBottom: 120 }}>
               <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 50 }}>Resource_Allocation (Fees)</h3>
               <table style={{ width: '100%', borderCollapse: 'collapse', color: '#94a3b8' }}>
                 <thead>
                   <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                     <th style={{ padding: 20, color: 'white' }}>NODE_LEVEL</th>
                     <th style={{ padding: 20, color: 'white' }}>SEMESTER_CREDIT</th>
                   </tr>
                 </thead>
                 <tbody>
                   {['Foundation Node', 'Core Interface', 'Apex Node'].map(l => (
                     <tr key={l} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                       <td style={{ padding: 20, fontWeight: 800 }}>{l.toUpperCase()}</td>
                       <td style={{ padding: 20, color: accent }}>SCAN_TO_VIEW_CREDITS</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>

            {/* 3. Steps (Enrollment) */}
            <div style={{ marginBottom: 120 }}>
               <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 50, textAlign: 'center' }}>Initiation_Sequence</h3>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                 {['Data_Input', 'Neuro_Assessment', 'Architect_Review', 'Node_Activation'].map((s, i) => (
                   <div key={i} style={{ textAlign: 'center' }}>
                     <div style={{ width: 40, height: 40, background: accent, color: '#020617', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{i+1}</div>
                     <h5 style={{ fontSize: 13 }}>{s}</h5>
                   </div>
                 ))}
               </div>
            </div>

            {/* 4. Age Criteria */}
            <div style={{ padding: '60px', background: 'rgba(255,255,255,0.01)', borderRadius: 32, marginBottom: 120, textAlign: 'center' }}>
               <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>_Node_Compatibility (Age)</h3>
               <p style={{ color: accent, fontSize: 32, fontWeight: 900 }}>6+ TO 18+ SOLAR_YEARS</p>
            </div>

            {/* 5. Withdrawal Protocol */}
            <div style={{ marginBottom: 120 }}>
               <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 30 }}>Deactivation_Protocol</h3>
               <p style={{ color: '#64748b' }}>Withdrawal requires a 60-day synchronization period to ensure data integrity and transition of educational credits.</p>
            </div>

            {/* 6. FAQ Hub */}
            <div style={{ background: accent, color: '#020617', padding: 60, borderRadius: 32 }}>
               <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40 }}>Query_Hub (FAQ)</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                 {[
                   { q: 'Is physical attendance mandatory?', a: 'We follow a hybrid model with 3 days on-site in Neural Labs.' },
                   { q: 'What devices are required?', a: 'Proprietary Neural Interface kits are provided on enrollment.' },
                   { q: 'Is this affiliated with CBSE?', a: 'Yes, our core curriculum meets and exceeds CBSE standards.' },
                   { q: 'Do you offer coding?', a: 'Coding is our primary language of instruction from Grade I.' }
                 ].map((faq, i) => (
                   <div key={i}>
                      <h5 style={{ fontWeight: 900, marginBottom: 10 }}>{faq.q}</h5>
                      <p style={{ fontSize: 14, opacity: 0.8 }}>{faq.a}</p>
                   </div>
                 ))}
               </div>
            </div>
          </motion.div>
        )
      case 'Contact':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '80px 5%' }}>
            {/* 1. Node Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30, marginBottom: 80 }}>
              <div style={{ padding: 40, background: 'rgba(255,255,255,0.02)', borderRadius: 24, textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                <FiMapPin size={35} color={accent} style={{ marginBottom: 20 }} />
                <h4 style={{ fontWeight: 900 }}>Node_Location</h4>
                <p style={{ color: '#64748b', fontSize: 13 }}>Sector 24, Cyber Park, Bangalore, IN</p>
              </div>
              <div style={{ padding: 40, background: 'rgba(255,255,255,0.02)', borderRadius: 24, textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                <FiTerminal size={35} color={accent} style={{ marginBottom: 20 }} />
                <h4 style={{ fontWeight: 900 }}>Comm_Link</h4>
                <p style={{ color: '#64748b', fontSize: 13 }}>+91 00010 10101</p>
              </div>
              <div style={{ padding: 40, background: 'rgba(255,255,255,0.02)', borderRadius: 24, textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                <FiMessageSquare size={35} color={accent} style={{ marginBottom: 20 }} />
                <h4 style={{ fontWeight: 900 }}>Data_Stream</h4>
                <p style={{ color: '#64748b', fontSize: 13 }}>ping@quantum.academy</p>
              </div>
            </div>

            {/* 2. Lead Generation (Form) */}
            <div style={{ maxWidth: 800, margin: '0 auto 100px', background: 'rgba(255,255,255,0.01)', padding: 60, borderRadius: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
               <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40, textAlign: 'center' }}>INITIATE_PING</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                 <input type="text" placeholder="IDENTITY_NAME" style={{ padding: 18, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 8 }} />
                 <input type="text" placeholder="COMMS_EMAIL" style={{ padding: 18, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 8 }} />
               </div>
               <textarea placeholder="INPUT_QUERY_DATA..." rows={5} style={{ width: '100%', padding: 18, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: 8, marginBottom: 30 }}></textarea>
               <button style={{ width: '100%', padding: 20, background: accent, color: '#020617', border: 'none', borderRadius: 8, fontWeight: 900 }}>SEND_SIGNAL</button>
            </div>

            {/* 3. Node Locator (Map) */}
            <div style={{ height: 400, background: 'rgba(255,255,255,0.02)', borderRadius: 32, marginBottom: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <FiGlobe size={60} color={accent} opacity={0.2} />
               <span style={{ fontWeight: 900, color: accent, marginLeft: 20 }}>GLOBAL_NODE_V24_ Bangalore</span>
            </div>

            {/* 4. Support Hours */}
            <div style={{ textAlign: 'center', marginBottom: 120 }}>
               <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Uptime_Log (Support)</h3>
               <p style={{ color: '#94a3b8' }}>Neural Support Available 24/7 via Portal.<br />Physical Office: 0900 - 1700 HRS</p>
            </div>

            {/* 5. Neural Social */}
            <div style={{ textAlign: 'center', marginBottom: 120 }}>
               <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 40 }}>_Grid_Connectivity</h3>
               <div style={{ display: 'flex', justifyContent: 'center', gap: 40, color: accent }}>
                  <FiCpu /> <FiSmartphone /> <FiGlobe /> <FiLayers />
               </div>
            </div>

            {/* 6. Newsletter */}
            <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: 80, borderRadius: 40, textAlign: 'center' }}>
               <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>Join_The_Neural_Network</h3>
               <p style={{ color: '#94a3b8', marginBottom: 40 }}>Weekly updates on AI breakthroughs and campus research.</p>
               <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                  <input type="text" placeholder="NODE_ID@EMAIL.COM" style={{ padding: '18px 40px', background: '#000', border: `1px solid ${accent}`, color: 'white', borderRadius: 100, width: 400 }} />
                  <button style={{ padding: '18px 40px', background: accent, color: '#020617', border: 'none', borderRadius: 100, fontWeight: 900 }}>CONNECT</button>
               </div>
            </div>
          </motion.div>
        )
      case 'CBSE Corner':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: '#020617', minHeight: '100vh' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 0 }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', height: 'calc(100vh - 100px)', position: 'sticky', top: 100, borderRight: '1px solid rgba(255,255,255,0.05)', padding: '40px 0' }}>
                <div style={{ padding: '0 30px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: accent }}>CBSE_GATEWAY</h3>
                  <p style={{ fontSize: 10, color: '#475569', fontWeight: 800, letterSpacing: 2 }}>PROTOCOL_MANDATORY</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {[
                    { id: 'General', label: 'General_Info', icon: <FiInfo /> },
                    { id: 'Documents', label: 'Doc_Stream', icon: <FiFileText /> },
                    { id: 'Results', label: 'Success_Logs', icon: <FiTrendingUp /> },
                    { id: 'Staff', label: 'Node_Hardware', icon: <FiUsers /> }
                  ].map(tab => (
                    <div 
                      key={tab.id}
                      onClick={() => setCbseSubTab(tab.id)}
                      style={{ 
                        padding: '20px 30px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 15, 
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 700,
                        color: cbseSubTab === tab.id ? accent : '#64748b',
                        background: cbseSubTab === tab.id ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                        borderRight: cbseSubTab === tab.id ? `4px solid ${accent}` : 'none'
                      }}
                    >
                      {tab.icon} {tab.label.toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '60px 80px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: 60, borderRadius: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
                  {cbseSubTab === 'General' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 40 }}>_Institutional_Identity</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                        {[
                          ['NAME', 'QUANTUM ACADEMY'], ['AFFILIATION', '1234567'],
                          ['CODE', '90123'], ['NODE_LOCATION', 'Cyber Park, Bangalore'],
                          ['PRINCIPAL', 'DR. ORION VANCE'], ['EMAIL', 'ping@quantum.edu']
                        ].map(it => (
                          <div key={it[0]} style={{ paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <span style={{ fontSize: 10, color: accent }}>{it[0]}</span>
                            <p style={{ margin: '5px 0 0', fontWeight: 800 }}>{it[1]}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  {cbseSubTab === 'Documents' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                      {['AFFILIATION_CERT', 'SOCIETY_DATA', 'BUILDING_SAFETY', 'FIRE_SAFETY'].map(d => (
                        <div key={d} style={{ padding: 25, background: 'rgba(0,0,0,0.3)', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 800 }}>{d}</span>
                          <FiDownload color={accent} />
                        </div>
                      ))}
                    </div>
                  )}
                  {cbseSubTab === 'Results' && <p style={{ color: '#94a3b8' }}>Consistent 100% board clearance rate with AI-aided personalized learning tracks.</p>}
                  {cbseSubTab === 'Staff' && <p style={{ color: '#94a3b8' }}>Total Nodes (Staff): 82 | PhD Holders: 15 | AI-Researchers: 12</p>}
                </div>
              </div>
            </div>
          </motion.div>
        )
      default:
        return (
          <>
            {/* 1. OS Bar */}
            <div style={{ padding: '8px 5%', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
              <div style={{ display: 'flex', gap: 20, color: accent }}><span>SYS_STATUS: ONLINE</span><span>LATENCY: 12ms</span><span>LOCATION: GLOBAL_NODE_01</span></div>
              <div style={{ display: 'flex', gap: 20 }}><span>CBSE_PROTOCOL: VERIFIED</span><a href="#/quantum/erp" style={{ color: 'white', textDecoration: 'none' }}>INIT_ERP_LOGIN</a></div>
            </div>

            {/* 2. Neural Hero */}
            <section style={{ padding: '120px 5% 150px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '10%', right: '5%', width: 600, height: 600, background: `radial-gradient(circle, ${accent}15 0%, transparent 70%)` }}></div>
              <div style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 100, alignItems: 'center' }}>
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                  <span style={{ color: accent, fontWeight: 900, fontSize: 12, letterSpacing: 5 }}>NEXT_GEN_LEARNING_SYSTEM</span>
                  <h1 style={{ fontSize: 'clamp(40px, 6vw, 90px)', fontWeight: 900, lineHeight: 0.95, margin: '20px 0' }}>Programming<br />Human<br /><span style={{ color: accent }}>Intelligence.</span></h1>
                  <p style={{ fontSize: 20, color: '#94a3b8', lineHeight: 1.6, marginBottom: 40, maxWidth: 500 }}>We merge AI research, robotics, and fundamental sciences into a unified curriculum for the creators of 2050.</p>
                  <div style={{ display: 'flex', gap: 20 }}>
                    <button style={{ background: accent, color: '#020617', padding: '18px 45px', border: 'none', borderRadius: 4, fontWeight: 900, fontSize: 15 }} onClick={() => setActiveTab('Admissions')}>INIT_ENROLLMENT</button>
                    <button style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '18px 45px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, fontWeight: 700 }}>VIRTUAL_CAMPUS</button>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ position: 'relative' }}>
                   <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600" style={{ width: '100%', borderRadius: 32, border: '1px solid rgba(255,255,255,0.05)' }} />
                </motion.div>
              </div>
            </section>

            {/* 3. System Metrics */}
            <section style={{ padding: '0 5% 100px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 25 }}>
              {[
                { val: '4.0', label: 'NEURAL_LABS', icon: <FiTerminal /> },
                { val: '24/7', label: 'CODE_SUPPORT', icon: <FiCode /> },
                { val: '500+', label: 'GLOBAL_NODES', icon: <FiGlobe /> },
                { val: '128-bit', label: 'SECURE_DATA', icon: <FiShield /> }
              ].map((m, i) => (
                <div key={i} style={{ padding: '40px', background: 'rgba(255,255,255,0.01)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                  <div style={{ color: accent, fontSize: 32, marginBottom: 20 }}>{m.icon}</div>
                  <div style={{ fontSize: 36, fontWeight: 900 }}>{m.val}</div>
                  <div style={{ color: '#475569', fontSize: 11, fontWeight: 900, letterSpacing: 2, marginTop: 5 }}>{m.label}</div>
                </div>
              ))}
            </section>

            {/* 4. Core Modules */}
            <section style={{ padding: '100px 5%', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
                {[
                  { icon: <FiActivity />, title: "Bio-Engineering", desc: "Advanced labs for cellular research and genetic modeling." },
                  { icon: <FiQuantum />, title: "Quantum Computing", desc: "Understanding the foundations of next-gen processing architectures." },
                  { icon: <FiSmartphone />, title: "IoT Ecosystem", desc: "Building interconnected smart hardware solutions." }
                ].map((feat, i) => (
                  <div key={i} style={{ padding: 40, borderRadius: 24, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ color: accent, fontSize: 32, marginBottom: 24 }}>{feat.icon}</div>
                    <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 15 }}>{feat.title}</h3>
                    <p style={{ color: '#64748b', fontSize: 15 }}>{feat.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Research Initiatives */}
            <section style={{ padding: '100px 5%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 80, alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>_Research_Initiatives</h2>
                  <p style={{ color: '#94a3b8', lineHeight: 1.8 }}>Engaging in patent-pending research in decentralized systems and quantum encryption with global tech giants.</p>
                </div>
                <div style={{ padding: 40, background: 'rgba(255,255,255,0.02)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <FiZap size={40} color={accent} style={{ marginBottom: 20 }} />
                  <h3 style={{ fontSize: 20, fontWeight: 800 }}>Project_Alpha</h3>
                </div>
              </div>
            </section>

            {/* 6. Directive Center (Disclosure) */}
            <section style={{ padding: '80px 5%', background: accent }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#020617' }}>
                <div><h2 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>CBSE_DIRECTIVE_2026</h2><p style={{ fontWeight: 700 }}>Mandatory Public Disclosure & Performance Logs.</p></div>
                <button style={{ background: '#020617', color: accent, padding: '18px 40px', borderRadius: 4, fontWeight: 900, border: 'none' }} onClick={() => setActiveTab('CBSE Corner')}>ACCESS_DATA_STREAM</button>
              </div>
            </section>
          </>
        )
    }
  }

  return (
    <div style={{ background: '#020617', color: 'white', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Dynamic Nav Interface */}
      <nav style={{ padding: '25px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => setActiveTab('Home')}>
          <div style={{ width: 45, height: 45, background: accent, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#020617', fontWeight: 900, fontSize: 24, boxShadow: `0 0 30px ${accent}40` }}>Q</div>
          <span style={{ fontSize: 24, fontWeight: 900 }}>QUANTUM<span style={{ color: accent }}>_ACADEMY</span></span>
        </div>
        <div style={{ display: 'flex', gap: 40, fontWeight: 800, fontSize: 13, letterSpacing: 2 }}>
          {['Home', 'About', 'Academics', 'Admissions', 'CBSE Corner', 'Contact'].map(t => (
            <span key={t} style={{ cursor: 'pointer', color: activeTab === t ? accent : '#94a3b8' }} onClick={() => setActiveTab(t)}>{t.toUpperCase()}</span>
          ))}
        </div>
        <button style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${accent}`, color: accent, padding: '10px 30px', borderRadius: 4, fontWeight: 800, fontSize: 12 }}>CONNECT_NODE</button>
      </nav>

      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>

      <footer style={{ padding: '100px 5% 40px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 80 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 80, marginBottom: 80 }}>
          <div>
             <h2 style={{ fontSize: 24, fontWeight: 900 }}>QUANTUM_ACADEMY</h2>
             <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: 14, marginTop: 20 }}>The world's first instance-based academic operating system.</p>
          </div>
          <div><h4 style={{ color: accent }}>RESOURCES</h4><div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: '#94a3b8', fontSize: 13, marginTop: 20 }}><span>ENROLLMENT_LOG</span><span onClick={() => setActiveTab('Academics')} style={{ cursor: 'pointer' }}>CURRICULUM_JSON</span></div></div>
          <div><h4 style={{ color: accent }}>INTERFACE</h4><div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: '#94a3b8', fontSize: 13, marginTop: 20 }}><span onClick={() => setActiveTab('Admissions')} style={{ cursor: 'pointer' }}>USER_PORTAL</span><span onClick={() => setActiveTab('CBSE Corner')} style={{ cursor: 'pointer' }}>CBSE_GATEWAY</span></div></div>
          <div><h4 style={{ color: accent }}>CONNECT</h4><div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: '#94a3b8', fontSize: 13, marginTop: 20 }}><span>NODE_01, TECH_CITY</span><span>+91 00010 10101</span></div></div>
        </div>
        <div style={{ textAlign: 'center', color: '#475569', fontSize: 10, letterSpacing: 3 }}>© 2026 QUANTUM_ACADEMY // POWERED_BY_SKOLUX</div>
      </footer>
    </div>
  )
}
