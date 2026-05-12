import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useParams } from 'react-router-dom'
import {
  FiSettings, FiUser, FiLock, FiBell, FiShield,
  FiSave, FiCheckCircle, FiCalendar, FiAlertTriangle, FiRefreshCw, FiPlus, FiTrash2, FiDollarSign,
  FiImage, FiLayout, FiUsers, FiEdit2, FiX, FiInfo, FiFileText, FiGrid, FiTruck, FiSmartphone
} from 'react-icons/fi'

export default function SettingsPage() {
  const { user, currentSession, updateSession, sessions, addSession, deleteSession, updateProfile } = useAuth()
  const { schoolId } = useParams()
  const { classes, updateClasses, transportRoutes, updateTransportRoutes } = useData() || { classes: [], transportRoutes: [] }

  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [newSessionInput, setNewSessionInput] = useState('')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  // Session management state (admin only)
  const allSessions = sessions
  const [selectedSession, setSelectedSession] = useState(currentSession)
  const [sessionSaved, setSessionSaved] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Global Fee Configuration state
  const [globalFeeConfig, setGlobalFeeConfig] = useState({ classFees: {}, transportFees: {} })
  const [feeConfigSaved, setFeeConfigSaved] = useState(false)

  // Branding & Media Config
  const [certConfig, setCertConfig] = useState(() => {
    const saved = localStorage.getItem(`erp_${schoolId}_cert_config`)
    return saved ? JSON.parse(saved) : {
      schoolName: 'New Morning Star Public School',
      address: 'Main Road, Sector 4, City - 123456',
      phone: '+91 98765 43210',
      email: 'info@morningstar.edu',
      borderColor: '#4f46e5',
      headerColor: '#1e1b4b',
      showLogo: true,
      showPhoto: true,
      showSign: true,
      watermark: 'OFFICIAL',
      theme: 'classic',
      idCardFormat: 'Modern',
      reportCardFormat: 'Detailed',
      tcFormat: 'Standard',
      bgImage: null,
      logoImage: null,
      signImage: null,
      qrImage: null,
      contentMarginTop: 0
    }
  })

  // Exam Configuration state
  const [examTypes, setExamTypes] = useState([])
  const [examConfig, setExamConfig] = useState({})
  const [newExamType, setNewExamType] = useState('')
  const [examSelectedClass, setExamSelectedClass] = useState('')
  
  // Transport State
  const [addRouteModal, setAddRouteModal] = useState(false)
  const [newRoute, setNewRoute] = useState({ route: '', vehicle: '', driver: '', phone: '' })

  // Classes & Sections State
  const [addClassModal, setAddClassModal] = useState(false)
  const [newClass, setNewClass] = useState({ name: '', sections: [{ name: 'A', teacher: '' }], subjects: [] })
  const [newSubjectInput, setNewSubjectInput] = useState({})
  const [editClassIdx, setEditClassIdx] = useState(null)
  const [editRouteIdx, setEditRouteIdx] = useState(null)

  useEffect(() => {
    const savedFee = localStorage.getItem(`erp_${schoolId}_global_fee_config_${currentSession}`) || localStorage.getItem(`erp_${schoolId}_global_fee_config`)
    if (savedFee) setGlobalFeeConfig(JSON.parse(savedFee))

    const savedExamTypes = localStorage.getItem(`erp_${schoolId}_exam_types_${currentSession}`)
    setExamTypes(savedExamTypes ? JSON.parse(savedExamTypes) : ['FA1', 'FA2', 'SA1', 'FA3', 'FA4', 'SA2'])
    
    const savedExamConfig = localStorage.getItem(`erp_${schoolId}_exam_config_${currentSession}`)
    setExamConfig(savedExamConfig ? JSON.parse(savedExamConfig) : {})

    if (classes && classes.length > 0) setExamSelectedClass(classes[0].class)
  }, [currentSession, classes, schoolId])

  const isAdmin = user?.role === 'admin'

  const handleSave = (e) => {
    e?.preventDefault()
    const initials = formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    updateProfile({
      ...formData,
      avatar: initials
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleProfilePhoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateProfile({ photo: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSessionChange = () => {
    updateSession(selectedSession)
    setSessionSaved(true)
    setShowConfirm(false)
    setTimeout(() => setSessionSaved(false), 3000)
  }

  const tabs = [
    { id: 'profile', label: 'General Profile', icon: <FiUser /> },
    { id: 'security', label: 'Security & Password', icon: <FiLock /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'privacy', label: 'Privacy Settings', icon: <FiShield /> },
    ...(isAdmin ? [
      { id: 'session', label: 'Academic Session', icon: <FiCalendar /> },
      { id: 'fee-config', label: 'Fee Configuration', icon: <FiDollarSign /> },
      { id: 'branding', label: 'Global Branding & Media', icon: <FiImage /> },
      { id: 'classes', label: 'Classes & Sections', icon: <FiLayout /> },
      { id: 'transport', label: 'Transport Routes', icon: <FiTruck /> },
      { id: 'exams', label: 'Exam Configuration', icon: <FiFileText /> }
    ] : []),
  ]

  const handleSaveBranding = () => {
    localStorage.setItem(`erp_${schoolId}_cert_config`, JSON.stringify(certConfig))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const updated = {...certConfig, [field]: reader.result}
        setCertConfig(updated)
        localStorage.setItem(`erp_${schoolId}_cert_config`, JSON.stringify(updated))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGlobalFeeSave = () => {
    localStorage.setItem(`erp_${schoolId}_global_fee_config`, JSON.stringify(globalFeeConfig))
    localStorage.setItem(`erp_${schoolId}_global_fee_config_${currentSession}`, JSON.stringify(globalFeeConfig))
    setFeeConfigSaved(true)
    setTimeout(() => setFeeConfigSaved(false), 3000)
  }

  const syncFeesToAllStudents = () => {
    if (!window.confirm('This will update the "Total Fees" for ALL students in the current session. Continue?')) return
    const studentsData = JSON.parse(localStorage.getItem(`erp_${schoolId}_students_${currentSession}`) || '[]')
    const feeKeyStr = `erp_${schoolId}_fees_${currentSession}`
    const currentFees = JSON.parse(localStorage.getItem(feeKeyStr) || '{}')
    studentsData.forEach(student => {
      const classFee = Number(globalFeeConfig.classFees[student.class] || 0)
      const transportFee = Number(globalFeeConfig.transportFees[student.transportRoute] || 0)
      const prevDues = Number(currentFees[student.id]?.prevSessionDues || 0)
      const newTotal = classFee + transportFee
      const record = currentFees[student.id] || { paid: 0, discount: 0, history: [] }
      currentFees[student.id] = {
        ...record,
        total: newTotal,
        prevSessionDues: prevDues,
        remaining: (newTotal + prevDues) - (record.paid || 0) - (record.discount || 0)
      }
    })
    localStorage.setItem(feeKeyStr, JSON.stringify(currentFees))
    alert('Fees recalculated for all students!')
  }

  const handleClassSave = () => {
    if (!newClass.name) return alert('Class name is required')
    const classData = { 
      class: newClass.name, 
      sections: newClass.sections, 
      subjects: newClass.subjects.length > 0 ? newClass.subjects : ['English', 'Hindi', 'Mathematics', 'Science', 'Social Sc.'] 
    }
    let updated = editClassIdx !== null ? classes.map((c, i) => i === editClassIdx ? classData : c) : [...classes, classData]
    updateClasses(updated)
    setAddClassModal(false)
    setEditClassIdx(null)
    setNewClass({ name: '', sections: [{ name: 'A', teacher: '' }], subjects: [] })
  }

  const openEditClass = (idx) => {
    const c = classes[idx]
    setNewClass({ name: c.class, sections: [...c.sections], subjects: [...(c.subjects || [])] })
    setEditClassIdx(idx)
    setAddClassModal(true)
  }

  const deleteClass = (idx) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      updateClasses(classes.filter((_, i) => i !== idx))
    }
  }

  const addSubjectToClass = (classIdx) => {
    const subject = newSubjectInput[classIdx]?.trim()
    if (!subject) return
    const updated = [...classes]
    if (!updated[classIdx].subjects) updated[classIdx].subjects = []
    if (!updated[classIdx].subjects.includes(subject)) {
      updated[classIdx].subjects.push(subject)
      updateClasses(updated)
    }
    setNewSubjectInput({ ...newSubjectInput, [classIdx]: '' })
  }

  const removeSubjectFromClass = (classIdx, subjectIdx) => {
    const updated = [...classes]
    updated[classIdx].subjects.splice(subjectIdx, 1)
    updateClasses(updated)
  }

  const handleRouteSave = () => {
    if (!newRoute.route) return alert('Route name is required')
    let updated = editRouteIdx !== null ? transportRoutes.map((r, i) => i === editRouteIdx ? newRoute : r) : [...transportRoutes, newRoute]
    updateTransportRoutes(updated)
    setAddRouteModal(false)
    setEditRouteIdx(null)
    setNewRoute({ route: '', vehicle: '', driver: '', phone: '' })
  }

  const openEditRoute = (idx) => {
    setNewRoute({ ...transportRoutes[idx] })
    setEditRouteIdx(idx)
    setAddRouteModal(true)
  }

  const deleteRoute = (idx) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      updateTransportRoutes(transportRoutes.filter((_, i) => i !== idx))
    }
  }

  const syncAcademic = () => {
    if (!window.confirm('Sync class configurations?')) return
    const globalCls = JSON.parse(localStorage.getItem(`erp_${schoolId}_classes`) || '[]')
    localStorage.setItem(`erp_${schoolId}_classes_${currentSession}`, JSON.stringify(globalCls))
    alert('Academic classes synchronized!'); window.location.reload()
  }

  const saveExamData = (types, config) => {
    localStorage.setItem(`erp_${schoolId}_exam_types_${currentSession}`, JSON.stringify(types))
    localStorage.setItem(`erp_${schoolId}_exam_config_${currentSession}`, JSON.stringify(config))
    setExamTypes(types)
    setExamConfig(config)
  }

  const handleAddExamType = () => {
    if (!newExamType.trim()) return
    const val = newExamType.trim().toUpperCase()
    if (examTypes.includes(val)) return
    saveExamData([...examTypes, val], examConfig)
    setNewExamType('')
  }

  const handleRemoveExamType = (type) => {
    if (window.confirm(`Delete "${type}"?`)) {
      saveExamData(examTypes.filter(t => t !== type), examConfig)
    }
  }

  const handleUpdateMarks = (type, cls, subject, val) => {
    const updated = { ...examConfig, [`${type}_${cls}_${subject}`]: val }
    saveExamData(examTypes, updated)
  }

  const renderTabContent = () => {
    const adminTabs = ['session', 'fee-config', 'branding', 'classes', 'transport', 'exams']
    if (adminTabs.includes(activeTab) && !isAdmin) {
      return (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-400)' }}>
          <FiShield size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
          <h3>Access Restricted</h3>
          <p>You do not have permission to view these settings.</p>
        </div>
      )
    }

    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleSave} style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: 'var(--primary-600)', overflow: 'hidden' }}>
                {user?.photo ? (
                  <img src={user.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" />
                ) : (
                  user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                  Change Photo
                  <input type="file" hidden accept="image/*" onChange={handleProfilePhoto} />
                </label>
                <div style={{ fontSize: 10, color: 'var(--gray-400)', marginTop: 8 }}>Recommended size: 400x400px</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Phone Number</label><input className="form-input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">User ID</label><input className="form-input" value={user?.id} readOnly style={{ background: 'var(--gray-50)' }} /></div>
            </div>
            <div style={{ marginTop: 30, paddingTop: 20, borderTop: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', gap: 15 }}>
              <button type="submit" className="btn btn-primary"><FiSave /> Save Changes</button>
              {saved && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--accent-600)', fontWeight: 600 }}><FiCheckCircle style={{ display: 'inline', marginRight: 4 }} />Saved!</span>}
            </div>
          </form>
        )

      case 'security':
        return (
          <form onSubmit={e => { e.preventDefault(); alert('Password update logic not implemented in demo.'); }} style={{ padding: 'var(--space-6)', maxWidth: 400 }}>
            <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
            <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
            <div className="form-group"><label className="form-label">Confirm New Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
            <div style={{ marginTop: 20 }}><button type="submit" className="btn btn-primary"><FiSave /> Update Password</button></div>
          </form>
        )

      case 'notifications':
        return (
          <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Email Notifications', desc: 'Receive updates on your registered email' },
              { label: 'SMS Alerts', desc: 'Attendance and fee alerts via SMS' },
              { label: 'Mobile App Push', desc: 'Instant notifications on your school app' },
              { label: 'Circulars & Notices', desc: 'Get notified when a new notice is posted' },
            ].map((n, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)' }}>{n.label}</div><div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{n.desc}</div></div>
                <label style={{ width: 44, height: 24, background: 'var(--primary-500)', borderRadius: 12, position: 'relative', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', right: 2, top: 2, width: 20, height: 20, background: 'white', borderRadius: '50%' }} />
                </label>
              </div>
            ))}
          </div>
        )

      case 'privacy':
        return (
          <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: 15 }}>
              <h3 style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>Privacy & Data Controls</h3>
              <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>Manage how your data is shared and who can see your profile.</p>
            </div>
            {[
              { label: 'Public Profile', desc: 'Allow other students/parents to see your name and photo', active: true },
              { label: 'Show Contact Info', desc: 'Display your phone and email to teachers and admin', active: true },
              { label: 'Activity Logs', desc: 'Keep a record of your logins and actions for security', active: true },
              { label: 'Third-party Analytics', desc: 'Share anonymous usage data to help improve the portal', active: false }
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-800)' }}>{p.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{p.desc}</div>
                </div>
                <label style={{ width: 44, height: 24, background: p.active ? 'var(--primary-500)' : 'var(--gray-200)', borderRadius: 12, position: 'relative', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', right: p.active ? 2 : 'auto', left: p.active ? 'auto' : 2, top: 2, width: 20, height: 20, background: 'white', borderRadius: '50%' }} />
                </label>
              </div>
            ))}
          </div>
        )

      case 'session':
        return (
          <div style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Academic Session Management</h3>
            <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)', borderRadius: 15, padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <FiCalendar size={22} color="var(--primary-500)" />
              <div><div style={{ fontSize: 11, color: 'var(--primary-500)', fontWeight: 600 }}>CURRENT SESSION</div><div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-700)' }}>{currentSession}</div></div>
              {sessionSaved && <div style={{ marginLeft: 'auto', color: 'var(--accent-600)', fontWeight: 600 }}><FiCheckCircle /> Updated!</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Change to Session</label>
              <select className="form-select" value={selectedSession} onChange={e => { setSelectedSession(e.target.value); setShowConfirm(false) }}>
                {allSessions.map(s => <option key={s} value={s}>{s}{s === currentSession ? ' (Active)' : ''}</option>)}
              </select>
            </div>
            {selectedSession !== currentSession && (
              <button className="btn btn-primary" onClick={() => setShowConfirm(true)}><FiRefreshCw /> Switch Session</button>
            )}
            {showConfirm && (
              <div style={{ background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 15, padding: 20, marginTop: 15 }}>
                <p style={{ fontSize: 13, color: '#92400e', marginBottom: 15 }}>Are you sure? This will switch the global context to {selectedSession}.</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" style={{ background: '#d97706' }} onClick={handleSessionChange}>Yes, Switch</button>
                  <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )

      case 'fee-config':
        return (
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontWeight: 700 }}>Fee Configuration</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-secondary" onClick={syncFeesToAllStudents}><FiRefreshCw /> Recalculate All</button>
                <button className="btn btn-primary" onClick={handleGlobalFeeSave}>{feeConfigSaved ? 'Saved!' : 'Save Structure'}</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: 15, color: 'var(--primary-600)' }}>Class Fees (₹)</h4>
                {classes.map(c => (
                  <div key={c.class} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <label style={{ fontSize: 13, fontWeight: 600 }}>Class {c.class}</label>
                    <input type="number" className="form-input" style={{ width: 120 }} value={globalFeeConfig.classFees[c.class] || ''} onChange={e => setGlobalFeeConfig(prev => ({...prev, classFees: {...prev.classFees, [c.class]: e.target.value}}))} />
                  </div>
                ))}
              </div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: 15, color: 'var(--primary-600)' }}>Transport Fees (₹)</h4>
                {transportRoutes.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <label style={{ fontSize: 13, fontWeight: 600 }}>{r.route}</label>
                    <input type="number" className="form-input" style={{ width: 120 }} value={globalFeeConfig.transportFees[r.route] || ''} onChange={e => setGlobalFeeConfig(prev => ({...prev, transportFees: {...prev.transportFees, [r.route]: e.target.value}}))} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'branding':
        return (
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
              <h3 style={{ fontWeight: 700 }}>Global Branding & Media</h3>
              <button className="btn btn-primary" onClick={handleSaveBranding}>
                {saved ? <><FiCheckCircle /> Saved</> : <><FiSave /> Save Branding</>}
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <h4 style={{ fontWeight: 700, color: 'var(--primary-600)', fontSize: 14 }}>SCHOOL INFORMATION</h4>
                <div className="form-group">
                  <label className="form-label">School Name</label>
                  <input className="form-input" value={certConfig.schoolName} onChange={e => setCertConfig({...certConfig, schoolName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea className="form-input" style={{ height: 80 }} value={certConfig.address} onChange={e => setCertConfig({...certConfig, address: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" value={certConfig.phone} onChange={e => setCertConfig({...certConfig, phone: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-input" value={certConfig.email} onChange={e => setCertConfig({...certConfig, email: e.target.value})} />
                  </div>
                </div>

                <h4 style={{ fontWeight: 700, color: 'var(--primary-600)', fontSize: 14, marginTop: 10 }}>DOCUMENT FORMATS</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <div className="form-group">
                    <label className="form-label">ID Card Style</label>
                    <select className="form-select" value={certConfig.idCardFormat} onChange={e => setCertConfig({...certConfig, idCardFormat: e.target.value})}>
                      <option value="Modern">Modern (Vertical)</option>
                      <option value="Classic">Classic (Horizontal)</option>
                      <option value="Compact">Compact</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Report Card Style</label>
                    <select className="form-select" value={certConfig.reportCardFormat} onChange={e => setCertConfig({...certConfig, reportCardFormat: e.target.value})}>
                      <option value="Detailed">Detailed</option>
                      <option value="Brief">Brief</option>
                      <option value="CBSE">CBSE Standard</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">TC Format</label>
                  <select className="form-select" value={certConfig.tcFormat} onChange={e => setCertConfig({...certConfig, tcFormat: e.target.value})}>
                    <option value="Standard">Standard Official</option>
                    <option value="Formal">Formal (With Background)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <h4 style={{ fontWeight: 700, color: 'var(--primary-600)', fontSize: 14 }}>ASSETS & MEDIA</h4>
                <div className="form-group">
                  <label className="form-label">Background Template (Report/TC)</label>
                  <input type="file" className="form-input" accept="image/*" onChange={e => handleFileUpload(e, 'bgImage')} />
                  {certConfig.bgImage && <img src={certConfig.bgImage} style={{ height: 80, marginTop: 10, borderRadius: 8, border: '1px solid var(--gray-200)' }} />}
                </div>
                <div className="form-group">
                  <label className="form-label">School Logo</label>
                  <div style={{ display: 'flex', gap: 15, alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <input type="file" className="form-input" accept="image/*" onChange={e => handleFileUpload(e, 'logoImage')} />
                    </div>
                    {certConfig.logoImage && <img src={certConfig.logoImage} style={{ height: 60, borderRadius: 4 }} />}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Principal Signature</label>
                  <div style={{ display: 'flex', gap: 15, alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <input type="file" className="form-input" accept="image/*" onChange={e => handleFileUpload(e, 'signImage')} />
                    </div>
                    {certConfig.signImage && <img src={certConfig.signImage} style={{ height: 40 }} />}
                  </div>
                </div>
                <div style={{ background: 'var(--gray-50)', padding: 15, borderRadius: 12, border: '1px solid var(--gray-100)', marginTop: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-600)', marginBottom: 5 }}>PRO TIP</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-500)', lineHeight: 1.4 }}>
                    Use high-resolution transparent PNGs for logos and signatures for the best printing results on ID cards and certificates.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'classes':
        return (
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontWeight: 700 }}>Class & Section Management</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-secondary" onClick={syncAcademic}><FiRefreshCw /> Sync</button>
                <button className="btn btn-primary" onClick={() => setAddClassModal(true)}><FiPlus /> New Class</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {classes.map((c, i) => (
                <div key={i} style={{ background: 'var(--primary-50)', padding: 15, borderRadius: 15, border: '1px solid var(--primary-100)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary-700)' }}>Class {c.class}</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-sm" onClick={() => openEditClass(i)}><FiEdit2 size={12} /></button>
                      <button className="btn btn-sm" style={{ color: 'var(--error)' }} onClick={() => deleteClass(i)}><FiTrash2 size={12} /></button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {c.sections.map((sec, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: 'white', borderRadius: 8, fontSize: 13 }}>
                        <span style={{ fontWeight: 700 }}>Sec {sec.name}</span>
                        <span style={{ color: 'var(--gray-500)' }}>{sec.teacher || 'No teacher'}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 15, borderTop: '1px solid var(--primary-100)', paddingTop: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary-600)', marginBottom: 8 }}>SUBJECTS</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                      {c.subjects?.map((sub, idx) => (
                        <span key={idx} style={{ background: 'white', padding: '2px 8px', borderRadius: 6, fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                          {sub} <FiX style={{ cursor: 'pointer', color: 'var(--error)' }} onClick={() => removeSubjectFromClass(i, idx)} />
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <input className="form-input" style={{ height: 28, fontSize: 11, padding: '0 8px' }} placeholder="Add sub..." value={newSubjectInput[i] || ''} onChange={e => setNewSubjectInput({...newSubjectInput, [i]: e.target.value})} onKeyDown={e => e.key === 'Enter' && addSubjectToClass(i)} />
                      <button className="btn btn-primary" style={{ height: 28, padding: '0 8px' }} onClick={() => addSubjectToClass(i)}><FiPlus size={12} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {addClassModal && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setAddClassModal(false)}>
                <div style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()}>
                  <h3 style={{ fontWeight: 700, marginBottom: 20 }}>{editClassIdx !== null ? 'Edit Class' : 'Add New Class'}</h3>
                  <div className="form-group"><label className="form-label">Class Name</label><input className="form-input" value={newClass.name} onChange={e => setNewClass({...newClass, name: e.target.value})} /></div>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>Sections <button className="btn btn-sm" onClick={() => setNewClass({...newClass, sections: [...newClass.sections, { name: '', teacher: '' }]})}><FiPlus size={10} /></button></label>
                    {newClass.sections.map((sec, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input className="form-input" style={{ width: 60 }} placeholder="Sec" value={sec.name} onChange={e => { const u = [...newClass.sections]; u[idx].name = e.target.value; setNewClass({...newClass, sections: u}) }} />
                        <input className="form-input" style={{ flex: 1 }} placeholder="Teacher" value={sec.teacher} onChange={e => { const u = [...newClass.sections]; u[idx].teacher = e.target.value; setNewClass({...newClass, sections: u}) }} />
                        <button className="btn btn-sm" onClick={() => setNewClass({...newClass, sections: newClass.sections.filter((_,si)=>si!==idx)})}><FiTrash2 size={12} color="var(--error)"/></button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleClassSave}>Save</button>
                    <button className="btn btn-secondary" onClick={() => setAddClassModal(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'transport':
        return (
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontWeight: 700 }}>Transport Routes</h3>
              <button className="btn btn-primary" onClick={() => setAddRouteModal(true)}><FiPlus /> New Route</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {transportRoutes.map((r, i) => (
                <div key={i} className="dash-widget" style={{ padding: 15, border: '1px solid var(--gray-100)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div><div style={{ fontWeight: 800, color: 'var(--primary-700)', fontSize: 16 }}>{r.route}</div><div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{r.vehicle} • {r.driver}</div></div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-sm" onClick={() => openEditRoute(i)}><FiEdit2 size={12} /></button>
                      <button className="btn btn-sm" style={{ color: 'var(--error)' }} onClick={() => deleteRoute(i)}><FiTrash2 size={12} /></button>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--gray-600)', display: 'flex', alignItems: 'center', gap: 6 }}><FiSmartphone size={14}/> {r.phone || 'No phone'}</div>
                </div>
              ))}
            </div>
            {addRouteModal && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setAddRouteModal(false)}>
                <div style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()}>
                  <h3 style={{ fontWeight: 700, marginBottom: 20 }}>{editRouteIdx !== null ? 'Edit Route' : 'Add Route'}</h3>
                  <div className="form-group"><label className="form-label">Route Name</label><input className="form-input" value={newRoute.route} onChange={e => setNewRoute({...newRoute, route: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Vehicle</label><input className="form-input" value={newRoute.vehicle} onChange={e => setNewRoute({...newRoute, vehicle: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Driver</label><input className="form-input" value={newRoute.driver} onChange={e => setNewRoute({...newRoute, driver: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={newRoute.phone} onChange={e => setNewRoute({...newRoute, phone: e.target.value})} /></div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleRouteSave}>Save</button>
                    <button className="btn btn-secondary" onClick={() => setAddRouteModal(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'exams':
        return (
          <div style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Exam Configuration</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 30 }}>
              {examTypes.map(type => (
                <span key={type} style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: '1px solid var(--primary-100)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {type} <FiX style={{ cursor: 'pointer', color: 'var(--error)' }} onClick={() => handleRemoveExamType(type)} />
                </span>
              ))}
              <div style={{ display: 'flex', gap: 5 }}>
                <input className="form-input" style={{ width: 100, height: 32 }} placeholder="Type..." value={newExamType} onChange={e => setNewExamType(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddExamType()} />
                <button className="btn btn-primary" style={{ height: 32, padding: '0 10px' }} onClick={handleAddExamType}><FiPlus/></button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <h4 style={{ fontWeight: 700, fontSize: 15 }}>Total Marks Matrix</h4>
              <select className="form-select" style={{ width: 150, height: 32, padding: '0 10px', fontSize: 13 }} value={examSelectedClass} onChange={e => setExamSelectedClass(e.target.value)}>
                {classes.map(c => <option key={c.class} value={c.class}>Class {c.class}</option>)}
              </select>
            </div>
            <div style={{ overflowX: 'auto', background: 'white', borderRadius: 15, border: '1px solid var(--gray-200)' }}>
              <table className="table" style={{ margin: 0 }}>
                <thead>
                  <tr style={{ background: 'var(--gray-50)' }}><th>Subject</th>{examTypes.map(t => <th key={t} style={{ textAlign: 'center' }}>{t}</th>)}</tr>
                </thead>
                <tbody>
                  {(classes.find(c => c.class === examSelectedClass)?.subjects || []).map(sub => (
                    <tr key={sub}>
                      <td style={{ fontWeight: 700 }}>{sub}</td>
                      {examTypes.map(t => (
                        <td key={t} style={{ padding: 4 }}>
                          <input type="number" className="form-input" style={{ textAlign: 'center', padding: '4px', border: 'none', background: 'transparent' }} placeholder="0" value={examConfig[`${t}_${examSelectedClass}_${sub}`] || ''} onChange={e => handleUpdateMarks(t, examSelectedClass, sub, e.target.value)} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      default:
        return <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-400)' }}>Select a tab to begin.</div>
    }
  }

  return (
    <div>
      <div className="dash-page-header">
        <div className="dash-page-title"><FiSettings style={{ display: 'inline', marginRight: 8 }} />Settings</div>
        <div className="dash-page-subtitle">Manage account preferences and school configurations</div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="dash-widget" style={{ width: 240, padding: 8 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', borderRadius: 'var(--radius-lg)',
                background: activeTab === tab.id ? 'var(--primary-50)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary-600)' : 'var(--gray-500)',
                border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)',
                fontWeight: activeTab === tab.id ? 600 : 500,
                transition: 'all 0.15s', textAlign: 'left', marginBottom: 4
              }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="dash-widget" style={{ flex: 1, minWidth: 320, minHeight: 500 }}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}
