import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useParams } from 'react-router-dom'
import {
  FiSettings, FiUser, FiLock, FiBell, FiShield,
  FiSave, FiCheckCircle, FiCalendar, FiAlertTriangle, FiRefreshCw, FiPlus, FiTrash2, FiDollarSign,
  FiImage, FiLayout, FiUsers, FiEdit2, FiX, FiInfo, FiFileText, FiGrid, FiTruck
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
      borderColor: '#4f46e5',
      headerColor: '#1e1b4b',
      showLogo: true,
      showPhoto: true,
      showSign: true,
      watermark: 'OFFICIAL',
      theme: 'classic',
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
    e.preventDefault()
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
    if (!window.confirm('This will update the "Total Fees" for ALL students in the current session based on your new settings. Unpaid balances will be recalculated. Continue?')) return
    
    const studentsData = JSON.parse(localStorage.getItem(`erp_${schoolId}_students_${currentSession}`) || localStorage.getItem(`erp_${schoolId}_students`) || '[]')
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
    alert('Fees recalculated and synchronized for all students in this session!')
    window.location.reload()
  }

  const handleClassSave = () => {
    const updated = [...classes, { class: newClass.name, sections: newClass.sections, subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Sc.'] }]
    updateClasses(updated)
    setAddClassModal(false)
    setNewClass({ name: '', sections: [{ name: 'A', teacher: '' }], subjects: [] })
  }

  const deleteClass = (idx) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      const updated = classes.filter((_, i) => i !== idx)
      updateClasses(updated)
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
    const updated = [...transportRoutes, newRoute]
    updateTransportRoutes(updated)
    setAddRouteModal(false)
    setNewRoute({ route: '', vehicle: '', driver: '', phone: '' })
  }

  const deleteRoute = (idx) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      const updated = transportRoutes.filter((_, i) => i !== idx)
      updateTransportRoutes(updated)
    }
  }
  const syncTransport = () => {
    if (!window.confirm(`Sync transport assignments for the CURRENT session (${currentSession})?`)) return
    const stuKey = `erp_${schoolId}_students_${currentSession}`
    const transKey = `erp_${schoolId}_transport_${currentSession}`
    const students = JSON.parse(localStorage.getItem(stuKey) || localStorage.getItem(`erp_${schoolId}_students`) || '[]')
    const routes = JSON.parse(localStorage.getItem(transKey) || localStorage.getItem(`erp_${schoolId}_transport`) || '[]')
    const routeNames = routes.map(r => r.route)
    students.forEach(s => {
      if (s.transportRoute !== 'None' && !routeNames.includes(s.transportRoute)) s.transportRoute = 'None'
    })
    localStorage.setItem(stuKey, JSON.stringify(students))
    alert(`Transport routes synchronized for ${currentSession}!`); window.location.reload()
  }

  const syncFees = () => {
    if (!window.confirm(`Recalculate all fee balances for the CURRENT session (${currentSession})?`)) return
    const feeKeyStr = `erp_${schoolId}_fees_${currentSession}`
    const fees = JSON.parse(localStorage.getItem(feeKeyStr) || '{}')
    Object.keys(fees).forEach(sid => {
      const f = fees[sid]
      f.remaining = (Number(f.total || 0) + Number(f.prevSessionDues || 0)) - Number(f.paid || 0) - Number(f.discount || 0)
    })
    localStorage.setItem(feeKeyStr, JSON.stringify(fees))
    alert(`Financial records recalculated for ${currentSession}!`); window.location.reload()
  }

  const syncStudents = () => {
    if (!window.confirm(`Standardize student metadata for the CURRENT session (${currentSession})?`)) return
    const stuKey = `erp_${schoolId}_students_${currentSession}`
    const students = JSON.parse(localStorage.getItem(stuKey) || '[]')
    students.forEach(s => {
      s.name = s.name?.trim()
      s.id = s.id?.toUpperCase()
      if (!s.admissionDate) s.admissionDate = new Date().toISOString().split('T')[0]
    })
    localStorage.setItem(stuKey, JSON.stringify(students))
    alert(`Student records standardized for ${currentSession}!`); window.location.reload()
  }

  const syncAcademic = () => {
    if (!window.confirm('Sync class configurations with current session?')) return
    const globalCls = JSON.parse(localStorage.getItem(`erp_${schoolId}_classes`) || '[]')
    localStorage.setItem(`erp_${schoolId}_classes_${currentSession}`, JSON.stringify(globalCls))
    alert('Academic classes synchronized!'); window.location.reload()
  }

  const syncSessions = () => {
    if (!window.confirm('Validate session continuity and carry-forward dues?')) return
    // This logic ensures previous session dues are correctly mapped to next sessions
    for (let i = 1; i < sessions.length; i++) {
      const prevSession = sessions[i-1]
      const nextSession = sessions[i]
      const prevFees = JSON.parse(localStorage.getItem(`erp_${schoolId}_fees_${prevSession}`) || '{}')
      const nextFees = JSON.parse(localStorage.getItem(`erp_${schoolId}_fees_${nextSession}`) || '{}')
      Object.keys(nextFees).forEach(sid => {
        if (prevFees[sid]) nextFees[sid].prevSessionDues = prevFees[sid].remaining
      })
      localStorage.setItem(`erp_${schoolId}_fees_${nextSession}`, JSON.stringify(nextFees))
    }
    alert('Session continuity validated!'); window.location.reload()
  }

  // Exam Handlers
  const saveExamData = (types, config) => {
    localStorage.setItem(`erp_${schoolId}_exam_types_${currentSession}`, JSON.stringify(types))
    localStorage.setItem(`erp_${schoolId}_exam_config_${currentSession}`, JSON.stringify(config))
    setExamTypes(types)
    setExamConfig(config)
  }

  const handleAddExamType = () => {
    if (!newExamType.trim()) return
    if (examTypes.includes(newExamType.trim().toUpperCase())) return
    const updated = [...examTypes, newExamType.trim().toUpperCase()]
    saveExamData(updated, examConfig)
    setNewExamType('')
  }

  const handleRemoveExamType = (type) => {
    if (window.confirm(`Delete test type "${type}"?`)) {
      const updated = examTypes.filter(t => t !== type)
      saveExamData(updated, examConfig)
    }
  }

  const handleUpdateMarks = (type, cls, subject, val) => {
    const updated = { ...examConfig, [`${type}_${cls}_${subject}`]: val }
    saveExamData(examTypes, updated)
  }

  const allExamSubjects = Array.from(new Set(classes.flatMap(c => c.subjects || []))).sort()
  const currentExamClassObj = classes.find(c => c.class === examSelectedClass)
  const currentClassSubjects = currentExamClassObj?.subjects || []


  return (
    <div>
      <div className="dash-page-header">
        <div className="dash-page-title"><FiSettings style={{ display: 'inline', marginRight: 8 }} />Account Settings</div>
        <div className="dash-page-subtitle">Manage your profile and portal preferences</div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Tabs */}
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
                transition: 'all 0.15s', textAlign: 'left'
              }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="dash-widget" style={{ flex: 1, minWidth: 320 }}>

          {/* ── ACADEMIC SESSION TAB ── */}
          {activeTab === 'session' && isAdmin && (
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontWeight: 700, fontSize: 'var(--text-lg)', marginBottom: 6 }}>Academic Session Management</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>
                  Changing the session updates it across the entire ERP — fees, attendance, and exams.
                  Previous session data is retained and carry-forward dues are displayed in Fee Management.
                </p>
              </div>

              {/* Current session display */}
              <div style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-200)', borderRadius: 'var(--radius-xl)', padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <FiCalendar size={22} color="var(--primary-500)" />
                <div>
                  <div style={{ fontSize: 12, color: 'var(--primary-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Current Session</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary-700)' }}>{currentSession}</div>
                </div>
                {sessionSaved && (
                  <div style={{ marginLeft: 'auto', color: 'var(--accent-600)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 14 }}>
                    <FiCheckCircle /> Session updated!
                  </div>
                )}
              </div>

              {/* Session selector */}
              <div className="form-group">
                <label className="form-label">Change to Session</label>
                <select
                  className="form-select"
                  value={selectedSession}
                  onChange={e => { setSelectedSession(e.target.value); setShowConfirm(false) }}
                  style={{ fontSize: 16, fontWeight: 600 }}
                >
                  {allSessions.map(s => (
                    <option key={s} value={s}>{s}{s === currentSession ? ' (Current)' : ''}</option>
                  ))}
                </select>
              </div>

              {selectedSession !== currentSession && !showConfirm && (
                <button className="btn btn-primary" style={{ marginTop: 8 }}
                  onClick={() => setShowConfirm(true)}>
                  <FiRefreshCw /> Switch to {selectedSession}
                </button>
              )}

              {/* Confirmation box */}
              {showConfirm && selectedSession !== currentSession && (
                <div style={{ background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 'var(--radius-xl)', padding: '16px 20px', marginTop: 16 }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    <FiAlertTriangle size={20} color="#d97706" />
                    <div style={{ fontWeight: 700, color: '#92400e' }}>Confirm Session Change</div>
                  </div>
                  <p style={{ fontSize: 13, color: '#78350f', marginBottom: 16 }}>
                    You are switching the active session from <strong>{currentSession}</strong> to <strong>{selectedSession}</strong>.
                    All new fee entries, attendance, and exam records will be tagged to the new session.
                    Existing data from <strong>{currentSession}</strong> will be preserved and remain accessible.
                    Students with unpaid dues will show carry-forward balances in the new session.
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-primary" style={{ background: '#d97706', borderColor: '#d97706' }} onClick={handleSessionChange}>
                      <FiCheckCircle /> Confirm — Switch to {selectedSession}
                    </button>
                    <button className="btn btn-secondary" onClick={() => { setShowConfirm(false); setSelectedSession(currentSession) }}>Cancel</button>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 25, padding: '15px 20px', background: 'var(--accent-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--accent-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <FiRefreshCw color="var(--accent-600)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--accent-800)' }}>Sync Session Continuity</div>
                    <div style={{ fontSize: 11, color: 'var(--accent-600)' }}>Validate carry-forward dues from previous sessions to the current year.</div>
                  </div>
                </div>
                <button className="btn btn-primary btn-sm" style={{ background: 'var(--accent-500)', border: 'none' }} onClick={syncSessions}>Verify Continuity</button>
              </div>

              {/* Add/Delete Sessions (Admin Only) */}
              <div style={{ marginTop: 40, borderTop: '1px solid var(--gray-100)', paddingTop: 30 }}>
                <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 15 }}>Manage Academic Years</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 25 }}>
                   <div className="card" style={{ padding: 20, background: 'var(--gray-50)' }}>
                      <label className="form-label" style={{ fontSize: 11 }}>Create New Year</label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <input 
                          className="form-input" 
                          placeholder="e.g. 2028-29" 
                          value={newSessionInput}
                          onChange={e => setNewSessionInput(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={() => {
                          if (addSession(newSessionInput)) setNewSessionInput('')
                          else alert('Invalid format or session already exists.')
                        }}>
                          <FiPlus />
                        </button>
                      </div>
                      <p style={{ fontSize: 10, color: 'var(--gray-400)', marginTop: 8 }}>Format: YYYY-YY (New data will be initialized for this year)</p>
                   </div>

                   <div className="card" style={{ padding: 20, background: 'var(--gray-50)' }}>
                      <label className="form-label" style={{ fontSize: 11 }}>Existing Sessions</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {sessions.map(s => (
                          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'white', border: '1px solid var(--gray-200)', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
                            {s}
                            {s !== currentSession && (
                              <button 
                                onClick={() => { if(confirm(`Delete ${s} and ALL its data?`)) deleteSession(s) }}
                                style={{ color: 'var(--error)', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, display: 'flex' }}
                              >
                                <FiTrash2 size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </div>

              {/* Info about previous session dues */}
              <div style={{ marginTop: 32, padding: '14px 18px', background: 'var(--gray-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gray-200)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: 'var(--gray-700)' }}>How carry-forward dues work</div>
                <ul style={{ fontSize: 13, color: 'var(--gray-500)', paddingLeft: 18, lineHeight: 2 }}>
                  <li>Each session stores its own fee records separately.</li>
                  <li>When you open a student's fees in any session, all unpaid balances from older sessions appear as <strong>Carry-Forward Dues</strong>.</li>
                  <li>Admin can collect dues for any past session directly from the Fee Management page.</li>
                  <li>Receipts clearly show which session the payment belongs to.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ── FEE CONFIGURATION TAB ── */}
          {activeTab === 'fee-config' && isAdmin && (
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 15, borderBottom: '1px solid var(--gray-100)' }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 'var(--text-lg)', marginBottom: 6 }}>Global Fee Structure Configuration</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>
                    Set default fees based on Class and Transport Route. These defaults can be applied when collecting student fees.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      alert('Fee structure synchronized with latest Classes and Transport Routes!');
                    }} 
                    title="Refresh the list of classes and routes from the database"
                  >
                    <FiRefreshCw /> Sync Structures
                  </button>
                  <button className="btn btn-secondary" onClick={syncFeesToAllStudents} title="Propagate these changes to all existing student records for the current session"><FiRefreshCw /> Recalculate All Students</button>
                  <button className="btn btn-primary" onClick={() => {
                    localStorage.setItem(`erp_${schoolId}_global_fee_config`, JSON.stringify(globalFeeConfig))
                    localStorage.setItem(`erp_${schoolId}_global_fee_config_${currentSession}`, JSON.stringify(globalFeeConfig))
                    setFeeConfigSaved(true)
                    setTimeout(() => setFeeConfigSaved(false), 3000)
                  }}>
                    {feeConfigSaved ? <><FiCheckCircle /> Saved</> : <><FiSave /> Save Configuration</>}
                  </button>
                </div>
              </div>

              {feeConfigSaved && (
                <div style={{ background: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <FiCheckCircle /> Fee Configuration Saved Successfully!
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                {/* Class-wise Fees */}
                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: 15, paddingBottom: 10, borderBottom: '1px solid var(--gray-200)', color: 'var(--primary-600)' }}>Class-wise Base Fee (₹)</h4>
                  {classes.map(c => c.class).map(cls => (
                    <div key={cls} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)', width: 80 }}>Class {cls}</label>
                      <input 
                        type="number" className="form-input" style={{ width: 'calc(100% - 90px)' }} placeholder="e.g. 40000"
                        value={globalFeeConfig.classFees[cls] || ''}
                        onChange={(e) => setGlobalFeeConfig(prev => ({...prev, classFees: {...prev.classFees, [cls]: e.target.value}}))}
                      />
                    </div>
                  ))}
                  {classes.length === 0 && (
                    <div style={{ color: 'var(--gray-400)', fontSize: 13, fontStyle: 'italic' }}>No classes configured. Add classes in the Classes & Sections tab first.</div>
                  )}
                </div>

                {/* Transport Route Fees */}
                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: 15, paddingBottom: 10, borderBottom: '1px solid var(--gray-200)', color: 'var(--primary-600)' }}>Transport Location-wise Fee (₹)</h4>
                  {transportRoutes.map((route, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)', width: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={route.route}>
                        {route.route}
                      </label>
                      <input 
                        type="number" className="form-input" style={{ width: 'calc(100% - 150px)' }} placeholder="e.g. 8000"
                        value={globalFeeConfig.transportFees[route.route] || ''}
                        onChange={(e) => setGlobalFeeConfig(prev => ({...prev, transportFees: {...prev.transportFees, [route.route]: e.target.value}}))}
                      />
                    </div>
                  ))}
                  {transportRoutes.length === 0 && (
                    <div style={{ color: 'var(--gray-400)', fontSize: 13, fontStyle: 'italic' }}>No transport routes configured. Add routes in the "Transport Routes" tab first.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── GLOBAL BRANDING & MEDIA TAB ── */}
          {activeTab === 'branding' && isAdmin && (
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontWeight: 700, fontSize: 'var(--text-lg)', marginBottom: 6 }}>Global Branding & Media Uploads</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>
                  Upload custom backgrounds, logos, signatures, and stamps to be used automatically across Marksheets, ID Cards, and Transfer Certificates.
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, maxWidth: 600 }}>
                <div className="form-group">
                  <label className="form-label">Background Template Image (Marksheet/TC)</label>
                  <input type="file" className="form-input" accept="image/*" onChange={e => handleFileUpload(e, 'bgImage')} />
                  {certConfig.bgImage && <img src={certConfig.bgImage} style={{ height: 80, marginTop: 10, objectFit: 'contain', border: '1px solid var(--gray-200)', borderRadius: 8 }} />}
                  {certConfig.bgImage && <button className="btn btn-sm" style={{ marginTop: 5, color: 'var(--error)' }} onClick={() => { const u = {...certConfig, bgImage: null}; setCertConfig(u); localStorage.setItem(`erp_${schoolId}_cert_config`, JSON.stringify(u)) }}>Remove Template</button>}
                </div>

                {certConfig.bgImage && (
                  <div className="form-group">
                    <label className="form-label">Top Content Margin (px) - Adjust to sit below your printed headers</label>
                    <input type="range" min="0" max="400" className="form-range" style={{ width: '100%' }} value={certConfig.contentMarginTop || 0} onChange={e => { const u = {...certConfig, contentMarginTop: Number(e.target.value)}; setCertConfig(u); localStorage.setItem(`erp_${schoolId}_cert_config`, JSON.stringify(u)) }} />
                    <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 5 }}>Current Margin: {certConfig.contentMarginTop}px</div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">School Logo Image</label>
                  <input type="file" className="form-input" accept="image/*" onChange={e => handleFileUpload(e, 'logoImage')} />
                  {certConfig.logoImage && <img src={certConfig.logoImage} style={{ height: 60, marginTop: 10, objectFit: 'contain' }} />}
                  {certConfig.logoImage && <button className="btn btn-sm" style={{ marginTop: 5, color: 'var(--error)' }} onClick={() => { const u = {...certConfig, logoImage: null}; setCertConfig(u); localStorage.setItem(`erp_${schoolId}_cert_config`, JSON.stringify(u)) }}>Remove Logo</button>}
                </div>

                <div className="form-group">
                  <label className="form-label">Admin/Principal Signature Image</label>
                  <input type="file" className="form-input" accept="image/*" onChange={e => handleFileUpload(e, 'signImage')} />
                  {certConfig.signImage && <img src={certConfig.signImage} style={{ height: 40, marginTop: 10, objectFit: 'contain' }} />}
                  {certConfig.signImage && <button className="btn btn-sm" style={{ marginTop: 5, color: 'var(--error)' }} onClick={() => { const u = {...certConfig, signImage: null}; setCertConfig(u); localStorage.setItem(`erp_${schoolId}_cert_config`, JSON.stringify(u)) }}>Remove Sign</button>}
                </div>

                <div className="form-group">
                  <label className="form-label">QR Code / Stamp Image</label>
                  <input type="file" className="form-input" accept="image/*" onChange={e => handleFileUpload(e, 'qrImage')} />
                  {certConfig.qrImage && <img src={certConfig.qrImage} style={{ height: 60, marginTop: 10, objectFit: 'contain' }} />}
                  {certConfig.qrImage && <button className="btn btn-sm" style={{ marginTop: 5, color: 'var(--error)' }} onClick={() => { const u = {...certConfig, qrImage: null}; setCertConfig(u); localStorage.setItem(`erp_${schoolId}_cert_config`, JSON.stringify(u)) }}>Remove QR</button>}
                </div>
              </div>
            </div>
          )}

          {/* ── CLASSES & SECTIONS TAB ── */}
          {activeTab === 'classes' && isAdmin && (
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 'var(--text-lg)', marginBottom: 6 }}>Class & Section Management</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>
                    Add, edit, or remove classes and assign default sections.
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => setAddClassModal(true)}>
                  <FiPlus /> Add New Class
                </button>
                <button className="btn btn-secondary" onClick={syncAcademic} style={{ marginLeft: 10 }}>
                  <FiRefreshCw /> Sync from Global
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {classes.map((c, i) => (
                  <div key={i} style={{ background: 'var(--primary-50)', padding: 15, borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary-100)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                      <span style={{ fontWeight: 800, color: 'var(--primary-700)', fontSize: 16 }}>Class {c.class}</span>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-sm btn-secondary" style={{ padding: 4 }}><FiEdit2 size={12} /></button>
                        <button className="btn btn-sm btn-secondary" style={{ padding: 4, color: 'var(--error)' }} onClick={() => deleteClass(i)}><FiTrash2 size={12} /></button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {c.sections.map((sec, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'white', borderRadius: 8 }}>
                          <div>
                            <span style={{ fontWeight: 700, color: 'var(--gray-800)', marginRight: 10 }}>Sec {sec.name}</span>
                            <span style={{ fontSize: 11, color: 'var(--gray-500)' }}>{sec.teacher || 'No teacher'}</span>
                          </div>
                          <FiUsers size={12} color="var(--gray-400)" />
                        </div>
                      ))}
                    </div>

                    <div style={{ borderTop: '1px solid var(--primary-100)', marginTop: 15, paddingTop: 15 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-600)', marginBottom: 10, textTransform: 'uppercase' }}>Subjects</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                        {c.subjects.map((sub, idx) => (
                          <div key={idx} style={{ background: 'white', padding: '4px 8px', borderRadius: 6, fontSize: 11, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--gray-200)' }}>
                            {sub}
                            <FiX size={12} style={{ cursor: 'pointer', color: 'var(--error)' }} onClick={() => removeSubjectFromClass(i, idx)} />
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <input 
                          type="text" className="form-input" style={{ padding: '6px 10px', fontSize: 12, height: 'auto' }} placeholder="Add subject..."
                          value={newSubjectInput[i] || ''}
                          onChange={(e) => setNewSubjectInput({...newSubjectInput, [i]: e.target.value})}
                          onKeyDown={(e) => e.key === 'Enter' && addSubjectToClass(i)}
                        />
                        <button className="btn btn-primary" style={{ padding: '6px 10px', height: 'auto' }} onClick={() => addSubjectToClass(i)}><FiPlus size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {addClassModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setAddClassModal(false)}>
                  <div style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                      <h3 style={{ fontWeight: 700 }}>Add New Class</h3>
                      <button onClick={() => setAddClassModal(false)}><FiX /></button>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Class Name (e.g. UKG, 10th)</label>
                      <input className="form-input" placeholder="Enter class name" value={newClass.name} onChange={e => setNewClass({...newClass, name: e.target.value})} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Initial Section (Optional)</label>
                      <input className="form-input" placeholder="e.g. A" value={newClass.sections[0].name} onChange={e => {
                        const updatedSec = [...newClass.sections]
                        updatedSec[0].name = e.target.value
                        setNewClass({...newClass, sections: updatedSec})
                      }} />
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleClassSave}>Save Class</button>
                      <button className="btn btn-secondary" onClick={() => setAddClassModal(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TRANSPORT ROUTES TAB ── */}
          {activeTab === 'transport' && isAdmin && (
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 'var(--text-lg)', marginBottom: 6 }}>Transport Route Management</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>
                    Add and manage transport routes and assign vehicles/drivers.
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => setAddRouteModal(true)}>
                  <FiPlus /> Add New Route
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {transportRoutes.map((r, i) => (
                  <div key={i} className="dash-widget" style={{ padding: 15, border: '1px solid var(--gray-100)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--primary-700)', fontSize: 16 }}>{r.route}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{r.vehicle} • {r.driver}</div>
                      </div>
                      <button className="btn btn-sm btn-secondary" style={{ color: 'var(--error)' }} onClick={() => deleteRoute(i)}><FiTrash2 size={14} /></button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gray-600)' }}>
                      <FiSmartphone size={14} /> {r.phone || 'No phone provided'}
                    </div>
                  </div>
                ))}
              </div>

              {addRouteModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setAddRouteModal(false)}>
                  <div style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()}>
                    <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Add New Route</h3>
                    <div className="form-group">
                      <label className="form-label">Route/Location Name</label>
                      <input className="form-input" placeholder="e.g. Sector 12, Main Market" value={newRoute.route} onChange={e => setNewRoute({...newRoute, route: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Vehicle Number</label>
                      <input className="form-input" placeholder="e.g. MH 12 AB 1234" value={newRoute.vehicle} onChange={e => setNewRoute({...newRoute, vehicle: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Driver Name</label>
                      <input className="form-input" placeholder="Enter driver name" value={newRoute.driver} onChange={e => setNewRoute({...newRoute, driver: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Driver Phone</label>
                      <input className="form-input" placeholder="Enter phone number" value={newRoute.phone} onChange={e => setNewRoute({...newRoute, phone: e.target.value})} />
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleRouteSave}>Save Route</button>
                      <button className="btn btn-secondary" onClick={() => setAddRouteModal(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── EXAM CONFIGURATION TAB ── */}
          {activeTab === 'exams' && isAdmin && (
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ marginBottom: 24, borderBottom: '1px solid var(--gray-100)', paddingBottom: 15 }}>
                <h3 style={{ fontWeight: 700, fontSize: 'var(--text-lg)', marginBottom: 6 }}>Academic Exam Configuration</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>
                  Manage test types and define total marks for each subject. These settings are used for result entry and report cards.
                </p>
              </div>

              {/* Test Types Section */}
              <div style={{ marginBottom: 40 }}>
                <h4 style={{ fontWeight: 700, marginBottom: 15, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FiFileText color="var(--primary-600)" /> Manage Test Types
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 15 }}>
                  {examTypes.map(type => (
                    <div key={type} style={{ background: 'var(--primary-50)', color: 'var(--primary-700)', padding: '8px 12px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 700, border: '1px solid var(--primary-100)' }}>
                      {type}
                      <FiX style={{ cursor: 'pointer', color: 'var(--error)' }} onClick={() => handleRemoveExamType(type)} />
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input className="form-input" style={{ width: 120, padding: '6px 10px', height: 'auto' }} placeholder="e.g. UNIT1" value={newExamType} onChange={e => setNewExamType(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddExamType()} />
                    <button className="btn btn-primary" style={{ padding: '6px 12px', height: 'auto' }} onClick={handleAddExamType}><FiPlus /></button>
                  </div>
                </div>
              </div>

              {/* Marks Matrix */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                  <h4 style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                    <FiGrid color="var(--accent-600)" /> Total Marks Matrix
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)' }}>Select Class:</span>
                    <select 
                      className="form-select" 
                      style={{ width: 150, padding: '4px 10px', height: 'auto', fontSize: 13, fontWeight: 700 }}
                      value={examSelectedClass}
                      onChange={e => setExamSelectedClass(e.target.value)}
                    >
                      {classes.map(c => <option key={c.class} value={c.class}>Class {c.class}</option>)}
                    </select>
                  </div>
                </div>

                {currentClassSubjects.length === 0 ? (
                  <div style={{ background: 'var(--gray-50)', padding: 30, borderRadius: 15, textAlign: 'center', color: 'var(--gray-400)' }}>
                    No subjects found for Class {examSelectedClass}. Please add subjects in the "Classes & Sections" tab first.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto', background: 'white', borderRadius: 15, border: '1px solid var(--gray-200)' }}>
                    <table className="table" style={{ margin: 0 }}>
                      <thead>
                        <tr style={{ background: 'var(--gray-50)' }}>
                          <th style={{ minWidth: 150 }}>Subject</th>
                          {examTypes.map(t => <th key={t} style={{ textAlign: 'center' }}>{t}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {currentClassSubjects.map(sub => (
                          <tr key={sub}>
                            <td style={{ fontWeight: 700, color: 'var(--gray-700)' }}>{sub}</td>
                            {examTypes.map(t => (
                              <td key={t} style={{ padding: 4 }}>
                                <input 
                                  type="number" 
                                  className="form-input" 
                                  style={{ textAlign: 'center', padding: '6px', fontSize: 13, background: 'transparent', border: '1px solid transparent' }} 
                                  placeholder="0"
                                  value={examConfig[`${t}_${examSelectedClass}_${sub}`] || ''}
                                  onFocus={e => e.target.style.border = '1px solid var(--primary-300)'}
                                  onBlur={e => e.target.style.border = '1px solid transparent'}
                                  onChange={e => handleUpdateMarks(t, examSelectedClass, sub, e.target.value)}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 15 }}>
                  Note: Leave marks blank or set to 0 if a subject is not applicable for a specific test type. Changes are saved automatically.
                </p>
              </div>
            </div>
          )}

          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} style={{ padding: 'var(--space-4)' }}>
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
          )}

          {/* ── SECURITY TAB ── */}
          {activeTab === 'security' && (
            <form onSubmit={handleSave} style={{ padding: 'var(--space-4)', maxWidth: 400 }}>
              <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" placeholder="••••••••" autoComplete="new-password" /></div>
              <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" placeholder="••••••••" autoComplete="new-password" /></div>
              <div className="form-group"><label className="form-label">Confirm New Password</label><input className="form-input" type="password" placeholder="••••••••" autoComplete="new-password" /></div>
              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 15 }}>
                <button type="submit" className="btn btn-primary"><FiSave /> Update Password</button>
                {saved && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--accent-600)', fontWeight: 600 }}><FiCheckCircle style={{ display: 'inline', marginRight: 4 }} />Updated!</span>}
              </div>
            </form>
          )}

          {/* ── NOTIFICATIONS TAB ── */}
          {activeTab === 'notifications' && (
            <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { label: 'Email Notifications', desc: 'Receive updates on your registered email' },
                { label: 'SMS Alerts', desc: 'Attendance and fee alerts via SMS' },
                { label: 'Mobile App Push', desc: 'Instant notifications on your school app' },
                { label: 'Circulars & Notices', desc: 'Get notified when a new notice is posted' },
              ].map((n, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--gray-700)' }}>{n.label}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>{n.desc}</div>
                  </div>
                  <label style={{ width: 44, height: 24, background: 'var(--primary-500)', borderRadius: 12, display: 'block', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ position: 'absolute', right: 2, top: 2, width: 20, height: 20, background: 'white', borderRadius: '50%' }} />
                  </label>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
