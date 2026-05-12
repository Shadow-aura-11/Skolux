import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiPlus, FiTrash2, FiEdit2, FiGlobe, FiLogOut, 
  FiSearch, FiCheckCircle, FiAlertTriangle, FiArrowRight,
  FiLayout, FiActivity, FiSettings, FiExternalLink, FiUser,
  FiMail, FiPhone, FiCalendar, FiMessageSquare, FiShield, FiLock
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import { getAllSchools, saveSchoolConfig, deleteSchoolConfig } from '../config/schools'

export default function AgencyDashboard() {
  const { agencyUser, agencyLogout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('deployments')
  const [schools, setSchools] = useState(getAllSchools())
  const [leads, setLeads] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSubdomain, setEditingSubdomain] = useState(null)
  const [loading, setLoading] = useState(true)
  const [leadSearch, setLeadSearch] = useState('')
  const [leadStatusFilter, setLeadStatusFilter] = useState('all')

  const updateLeadStatus = async (id, newStatus) => {
    const updatedLeads = leads.map(l => l.id === id ? { ...l, status: newStatus } : l)
    setLeads(updatedLeads)
    await api.save('leads', updatedLeads, 'agency_global')
  }
  
  // Form State
  const initialForm = {
    subdomain: '',
    name: '',
    shortName: '',
    logoText: '',
    logo: null,
    logoColor: '#6366f1',
    themeColor: '#6366f1',
    welcomeMessage: 'Welcome to our Digital Campus',
    // ERP Credentials
    adminUsername: 'admin',
    adminPassword: 'admin123',
    teacherUsername: 'teacher',
    teacherPassword: 'teacher123'
  }

  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    if (!agencyUser) {
      navigate('/agency/login')
    } else {
      loadInitialData()
    }
  }, [agencyUser, navigate])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const serverLeads = await api.get('leads', 'agency_global')
      setLeads(Array.isArray(serverLeads) ? serverLeads : [])
    } catch (error) {
      console.error("Failed to load leads:", error)
    } finally {
      setLoading(false)
    }
  }

  const refreshSchools = () => setSchools(getAllSchools())

  const handleSave = (e) => {
    e.preventDefault()
    
    saveSchoolConfig(formData.subdomain, {
      name: formData.name,
      shortName: formData.shortName,
      logoText: formData.logoText,
      logo: formData.logo,
      logoColor: formData.logoColor,
      themeColor: formData.themeColor,
      welcomeMessage: formData.welcomeMessage,
      adminUsername: formData.adminUsername,
      adminPassword: formData.adminPassword,
      teacherUsername: formData.teacherUsername,
      teacherPassword: formData.teacherPassword
    })
    refreshSchools()
    setShowAddModal(false)
    resetForm()
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDelete = (sub) => {
    if (window.confirm(`Are you sure you want to delete ${sub}? This cannot be undone.`)) {
      deleteSchoolConfig(sub)
      refreshSchools()
    }
  }

  const deleteLead = async (id) => {
    if (window.confirm("Delete this inquiry?")) {
      const filtered = leads.filter(l => l.id !== id)
      await api.save('leads', filtered, 'agency_global')
      setLeads(filtered)
    }
  }

  const resetForm = () => {
    setFormData(initialForm)
    setEditingSubdomain(null)
  }

  const openEdit = (sub, config) => {
    setFormData({ 
      subdomain: sub, 
      ...initialForm, // default credentials if missing in config
      ...config 
    })
    setEditingSubdomain(sub)
    setShowAddModal(true)
  }

  if (!agencyUser) return null

  const filteredLeads = leads.filter(l => {
    const matchSearch = (l.name || '').toLowerCase().includes(leadSearch.toLowerCase()) || 
                        (l.schoolName || '').toLowerCase().includes(leadSearch.toLowerCase()) ||
                        (l.email || '').toLowerCase().includes(leadSearch.toLowerCase())
    const currentStatus = l.status || 'new'
    const matchStatus = leadStatusFilter === 'all' ? true : currentStatus === leadStatusFilter
    return matchSearch && matchStatus
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }}>SX</div>
          <span style={{ fontWeight: 800, fontSize: 18 }}>Agency Console</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <nav style={{ display: 'flex', gap: 24 }}>
            <button 
              onClick={() => setActiveTab('deployments')}
              style={{ background: 'none', border: 'none', fontWeight: 700, color: activeTab === 'deployments' ? '#6366f1' : '#64748b', cursor: 'pointer', fontSize: 14, position: 'relative' }}
            >
              Deployments
              {activeTab === 'deployments' && <div style={{ position: 'absolute', bottom: -20, left: 0, width: '100%', height: 3, background: '#6366f1', borderRadius: 3 }} />}
            </button>
            <button 
              onClick={() => setActiveTab('leads')}
              style={{ background: 'none', border: 'none', fontWeight: 700, color: activeTab === 'leads' ? '#6366f1' : '#64748b', cursor: 'pointer', fontSize: 14, position: 'relative' }}
            >
              Inquiries {leads.length > 0 && <span style={{ background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: 10, fontSize: 10, marginLeft: 4 }}>{leads.length}</span>}
              {activeTab === 'leads' && <div style={{ position: 'absolute', bottom: -20, left: 0, width: '100%', height: 3, background: '#6366f1', borderRadius: 3 }} />}
            </button>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ fontSize: 14, color: '#64748b' }}>Admin: <strong>{agencyUser.name}</strong></span>
            <button onClick={agencyLogout} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      <main style={{ padding: '40px 5%' }}>
        {activeTab === 'deployments' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 900 }}>Manage School Deployments</h1>
                <p style={{ color: '#64748b', marginTop: 8 }}>Add new schools or manage existing ERP subdomains.</p>
              </div>
              <button 
                onClick={() => { resetForm(); setShowAddModal(true) }}
                style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <FiPlus /> New Deployment
              </button>
            </div>

            {/* Schools Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24 }}>
              {Object.entries(schools).map(([sub, config]) => (
                <div key={sub} style={{ background: 'white', borderRadius: 20, padding: 32, border: '1px solid #e2e8f0', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div style={{ width: 48, height: 48, background: config.logoColor, color: 'white', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, overflow: 'hidden' }}>
                      {config.logo ? <img src={config.logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="logo" /> : config.logoText}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => openEdit(sub, config)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0', background: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiEdit2 size={14} />
                      </button>
                      {sub !== 'nms' && sub !== 'default' && (
                        <button onClick={() => handleDelete(sub)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #fee2e2', background: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FiTrash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{config.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6366f1', fontWeight: 700 }}>
                    <FiGlobe size={14} /> {sub === 'default' ? 'Global' : `${sub}.yourdomain.com`}
                  </div>
                  
                  <div style={{ marginTop: 24, padding: 16, background: '#f8fafc', borderRadius: 12, fontSize: 13 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ color: '#64748b' }}>Short Name:</span>
                      <span style={{ fontWeight: 700 }}>{config.shortName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ color: '#64748b' }}>Admin:</span>
                      <span style={{ fontWeight: 700 }}>{config.adminUsername || 'admin'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Theme Color:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: config.themeColor }} />
                        <span style={{ fontWeight: 700 }}>{config.themeColor}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                    <a 
                      href={`/${sub}/erp`} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ flex: 1, textAlign: 'center', padding: '10px', background: '#f1f5f9', color: '#1e293b', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                      <FiExternalLink size={14} /> View ERP
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '16px 24px', borderRadius: 16, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '40%' }}>
                <FiSearch color="#64748b" />
                <input 
                  placeholder="Search inquiries by name, email, or school..." 
                  style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: 14 }}
                  value={leadSearch}
                  onChange={e => setLeadSearch(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['all', 'new', 'contacted', 'resolved'].map(status => (
                  <button 
                    key={status}
                    onClick={() => setLeadStatusFilter(status)}
                    style={{ 
                      padding: '8px 16px', 
                      borderRadius: 100, 
                      fontSize: 12, 
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: leadStatusFilter === status ? '#6366f1' : '#f1f5f9',
                      color: leadStatusFilter === status ? 'white' : '#64748b',
                      textTransform: 'capitalize'
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead>
                 <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                   <th style={{ padding: '20px 32px', fontSize: 12, fontWeight: 700, color: '#64748b' }}>STATUS</th>
                   <th style={{ padding: '20px 32px', fontSize: 12, fontWeight: 700, color: '#64748b' }}>CONTACT</th>
                   <th style={{ padding: '20px 32px', fontSize: 12, fontWeight: 700, color: '#64748b' }}>SCHOOL INFO</th>
                   <th style={{ padding: '20px 32px', fontSize: 12, fontWeight: 700, color: '#64748b' }}>MESSAGE</th>
                   <th style={{ padding: '20px 32px', fontSize: 12, fontWeight: 700, color: '#64748b' }}>DATE</th>
                   <th style={{ padding: '20px 32px', fontSize: 12, fontWeight: 700, color: '#64748b' }}>ACTIONS</th>
                 </tr>
               </thead>
               <tbody>
                 {filteredLeads.map(lead => (
                   <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                     <td style={{ padding: '24px 32px' }}>
                       <select 
                         value={lead.status || 'new'} 
                         onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                         style={{ 
                           padding: '6px 12px', 
                           borderRadius: 8, 
                           border: '1px solid #e2e8f0', 
                           background: (lead.status || 'new') === 'new' ? '#fff1f2' : (lead.status === 'contacted' ? '#eff6ff' : '#f0fdf4'),
                           color: (lead.status || 'new') === 'new' ? '#e11d48' : (lead.status === 'contacted' ? '#2563eb' : '#16a34a'),
                           fontWeight: 700,
                           fontSize: 12,
                           outline: 'none',
                           cursor: 'pointer'
                         }}
                       >
                         <option value="new">New</option>
                         <option value="contacted">Contacted</option>
                         <option value="resolved">Resolved</option>
                       </select>
                     </td>
                     <td style={{ padding: '24px 32px' }}>
                       <div style={{ fontWeight: 800, marginBottom: 4 }}>{lead.name}</div>
                       <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}><FiMail size={12} /> {lead.email}</div>
                       <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}><FiPhone size={12} /> {lead.phone}</div>
                     </td>
                     <td style={{ padding: '24px 32px' }}>
                       <div style={{ fontWeight: 700, fontSize: 14 }}>{lead.schoolName}</div>
                     </td>
                     <td style={{ padding: '24px 32px' }}>
                       <div style={{ fontSize: 13, color: '#475569', maxWidth: 300, lineHeight: 1.5 }}>{lead.message}</div>
                     </td>
                     <td style={{ padding: '24px 32px', fontSize: 12, color: '#64748b' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiCalendar size={12} /> {new Date(lead.date).toLocaleDateString()}</div>
                     </td>
                     <td style={{ padding: '24px 32px' }}>
                       <button onClick={() => deleteLead(lead.id)} style={{ padding: 8, background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 8, cursor: 'pointer' }}><FiTrash2 size={16} /></button>
                     </td>
                   </tr>
                 ))}
                 {filteredLeads.length === 0 && (
                   <tr>
                     <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                       No inquiries match your filters.
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ background: 'white', width: '100%', maxWidth: 700, borderRadius: 24, padding: 40, maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>{editingSubdomain ? 'Edit Deployment' : 'New School Deployment'}</h2>
            <p style={{ color: '#64748b', marginBottom: 32 }}>Configure the branding and administrator credentials.</p>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
                {/* Left: Branding */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1 }}>1. Branding & URL</h4>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>SUBDOMAIN KEY (URL SLUG)</label>
                    <input 
                      disabled={!!editingSubdomain}
                      className="input-new" 
                      style={editingSubdomain ? { background: '#f1f5f9', cursor: 'not-allowed', color: '#94a3b8' } : {}}
                      value={formData.subdomain}
                      onChange={e => setFormData({...formData, subdomain: e.target.value.toLowerCase().replace(/\s/g, '')})}
                      placeholder="e.g. global-academy"
                      required
                    />
                    {editingSubdomain ? (
                      <div style={{ marginTop: 8, padding: '8px 12px', background: '#fff1f2', borderRadius: 8, border: '1px solid #fecdd3', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiAlertTriangle size={14} color="#e11d48" />
                        <span style={{ fontSize: 9, color: '#be123c', fontWeight: 600 }}>Critical: This key cannot be changed after deployment as it is linked to all school data.</span>
                      </div>
                    ) : (
                      <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>This will be the school's unique URL identifier.</p>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>SCHOOL NAME</label>
                    <input className="input-new" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>SHORT NAME</label>
                      <input className="input-new" value={formData.shortName} onChange={e => setFormData({...formData, shortName: e.target.value})} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>LOGO TEXT</label>
                      <input className="input-new" value={formData.logoText} onChange={e => setFormData({...formData, logoText: e.target.value.slice(0, 3).toUpperCase()})} maxLength={3} required />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>LOGO IMAGE</label>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 42, height: 42, background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        {formData.logo ? <img src={formData.logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FiPlus color="#94a3b8" />}
                      </div>
                      <label style={{ flex: 1, padding: '10px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 8, fontSize: 10, textAlign: 'center', cursor: 'pointer' }}>
                        Change
                        <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>THEME COLOR</label>
                    <input type="color" value={formData.themeColor} onChange={e => setFormData({...formData, themeColor: e.target.value, logoColor: e.target.value})} style={{ width: '100%', height: 38, border: 'none', background: 'none', cursor: 'pointer' }} />
                  </div>
                </div>

                {/* Right: Credentials */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingLeft: 30, borderLeft: '1px solid #f1f5f9' }}>
                  <h4 style={{ fontSize: 12, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: 1 }}>2. ERP Access Control</h4>
                  
                  <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 16, border: '1px solid #dcfce7' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#10b981', fontWeight: 800, fontSize: 12 }}>
                      <FiShield /> ADMIN CREDENTIALS
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 700, marginBottom: 4 }}>USERNAME</label>
                      <input className="input-new" value={formData.adminUsername} onChange={e => setFormData({...formData, adminUsername: e.target.value})} placeholder="admin" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 700, marginBottom: 4 }}>PASSWORD</label>
                      <input type="text" className="input-new" value={formData.adminPassword} onChange={e => setFormData({...formData, adminPassword: e.target.value})} placeholder="admin123" />
                    </div>
                  </div>

                  <div style={{ padding: 16, background: '#fffbeb', borderRadius: 16, border: '1px solid #fef3c7' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#d97706', fontWeight: 800, fontSize: 12 }}>
                      <FiUser /> TEACHER CREDENTIALS
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 700, marginBottom: 4 }}>USERNAME</label>
                      <input className="input-new" value={formData.teacherUsername} onChange={e => setFormData({...formData, teacherUsername: e.target.value})} placeholder="teacher" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 700, marginBottom: 4 }}>PASSWORD</label>
                      <input type="text" className="input-new" value={formData.teacherPassword} onChange={e => setFormData({...formData, teacherPassword: e.target.value})} placeholder="teacher123" />
                    </div>
                  </div>

                  <div style={{ marginTop: 10, fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>
                    * These credentials allow the school staff to access their respective panels.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 40, borderTop: '1px solid #f1f5f9', paddingTop: 30 }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: 14, background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 2, padding: 14, background: '#6366f1', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
                  {editingSubdomain ? 'Save Changes' : 'Deploy School ERP'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
