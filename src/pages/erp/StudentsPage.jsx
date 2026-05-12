import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth, MOCK_DATA, feeKey, dataKey } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { FiUsers, FiPlus, FiSearch, FiEdit2, FiTrash2, FiX, FiCheck, FiFilter, FiUser, FiHome, FiSmartphone, FiCalendar, FiCreditCard, FiDollarSign, FiClock, FiPrinter, FiShield, FiBriefcase, FiHeart, FiMapPin, FiActivity, FiArrowRight, FiDownload, FiFileText, FiRefreshCw, FiPaperclip, FiFile } from 'react-icons/fi'
import { exportToCSV, formatDate } from '../../utils/exportUtils'
import { generatePDF } from '../../utils/pdfUtils'

export default function StudentsPage() {
  const { user, currentSession, sessions } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { schoolId } = useParams()
  const isAdmin = user?.role === 'admin'
  const isTeacher = user?.role === 'teacher'
  
  const { students = [], updateStudents, refreshData, classes: globalClasses = [] } = useData() || {}

  const syncStudents = () => {
    if (!window.confirm(`Standardize student metadata for the CURRENT session (${currentSession})?`)) return
    const updated = students.map(s => ({
      ...s,
      name: s.name?.trim(),
      id: s.id?.toUpperCase(),
      admissionDate: s.admissionDate || new Date().toISOString().split('T')[0]
    }))
    updateStudents(updated)
    alert(`Student records standardized for ${currentSession}!`)
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [detailModal, setDetailModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [printStudent, setPrintStudent] = useState(null)
  const [printTCStudent, setPrintTCStudent] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [promoteModal, setPromoteModal] = useState(false)
  const [targetSession, setTargetSession] = useState('')
  const [targetClass, setTargetClass] = useState('')
  const idConfig = JSON.parse(localStorage.getItem(`erp_${schoolId}_id_config`) || '{"schoolName":"NEW MORNING STAR PUBLIC SCHOOL","themeColor":"#4f46e5","textColor":"#ffffff","showQr":true,"showSign":true,"cardType":"vertical","borderRadius":12,"headerHeight":60}')
  
  const transportRoutes = JSON.parse(localStorage.getItem(`erp_${schoolId}_transport_${currentSession}`) || localStorage.getItem(`erp_${schoolId}_transport`) || '[]')
  const globalFeeConfig = JSON.parse(localStorage.getItem(`erp_${schoolId}_global_fee_config`) || '{"classFees":{},"transportFees":{}}')
  const certConfig = JSON.parse(localStorage.getItem(`erp_${schoolId}_cert_config`) || '{"bgImage":null, "logoImage":null, "signImage":null, "qrImage":null, "contentMarginTop": 0, "showLogo": true, "showSign": true}')

  const getStudentSubjects = (studentClass) => {
    const cls = globalClasses.find(c => c.class === studentClass)
    return cls?.subjects || ['English', 'Hindi', 'Mathematics', 'Science', 'Social Sc.']
  }

  // Check for student ID or action in URL (passed from Dashboard)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const sid = params.get('id')
    const action = params.get('action')
    
    if (sid) {
      const student = students.find(s => s.id === sid)
      if (student) {
        setSelectedStudent(student)
        setDetailModal(true)
      }
    } else if (action === 'add') {
      openAdd()
    }
  }, [location, students])
  
  const initialFormData = {
    // Basic
    name: '', class: 'PG', section: 'A', rollNo: '', admissionNo: '', admissionDate: '',
    // Personal
    dob: '', gender: 'Male', bloodGroup: '', religion: '', nationality: 'Indian', category: 'General', 
    photo: null,
    // Credentials
    username: '', password: '',
    // Health & Transport
    allergies: '', medicalConditions: '', height: '', weight: '', transportRoute: 'None', transportStop: '',
    // Previous School
    prevSchoolName: '', prevSchoolClass: '', prevSchoolTC: '', prevSchoolUniqueNo: '', prevSchoolCity: '',
    // Personal Details
    birthMark: '',
    // Documents
    documents: [] // Array of { name: '', file: base64 }
  }

  const [formData, setFormData] = useState(initialFormData)

  const filteredStudents = students.filter(s => 
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || (s.id || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterClass ? s.class === filterClass : true)
  )

  const handleExport = () => {
    // Remove complex nested objects like 'photo' for CSV export
    const exportData = filteredStudents.map(({ photo, ...rest }) => rest)
    exportToCSV(exportData, `Students_Export_${new Date().toLocaleDateString()}.csv`)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const finalData = { ...formData, phone: formData.phone || formData.fatherPhone }
    
    if (selectedStudent) {
      const updated = students.map(s => s.id === selectedStudent.id ? { ...s, ...finalData } : s)
      updateStudents(updated)
    } else {
      const counterKey = `erp_${schoolId}_stu_id_counter`
      const nextIdNum = parseInt(localStorage.getItem(counterKey) || '0') + 1
      const newId = `STU${String(nextIdNum).padStart(3, '0')}`
      localStorage.setItem(counterKey, nextIdNum.toString())
      
      const newStudent = { 
        ...finalData, 
        id: newId, 
        admissionNo: newId, 
        attendance: 100,
        // Use provided credentials or auto-generate
        username: formData.username || (formData.name.split(' ')[0] + newId).toLowerCase(),
        password: formData.password || Math.random().toString(36).slice(-8)
      }
      
      updateStudents([...students, newStudent])
      refreshData()
    }
    setModalOpen(false)
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setFormData({ ...formData, photo: reader.result })
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const docName = prompt("Enter document name (e.g. Birth Certificate, TC, Marksheet):", file.name)
      if (!docName) return

      const reader = new FileReader()
      reader.onloadend = () => {
        const newDoc = { name: docName, file: reader.result, fileName: file.name, date: new Date().toISOString().split('T')[0] }
        setFormData({ ...formData, documents: [...(formData.documents || []), newDoc] })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeDocument = (index) => {
    const updatedDocs = [...(formData.documents || [])]
    updatedDocs.splice(index, 1)
    setFormData({ ...formData, documents: updatedDocs })
  }

  const openEdit = (s) => {
    setSelectedStudent(s)
    setFormData({ ...initialFormData, ...s })
    setModalOpen(true)
  }

  const openAdd = () => {
    setSelectedStudent(null)
    const nextIdNum = parseInt(localStorage.getItem(`erp_${schoolId}_stu_id_counter`) || '0') + 1
    const nextId = `STU${String(nextIdNum).padStart(3, '0')}`
    setFormData({ ...initialFormData, admissionNo: nextId, admissionDate: new Date().toISOString().split('T')[0] })
    setModalOpen(true)
  }

  const getFeeRecordsForSession = () => {
    const stored = localStorage.getItem(`erp_${schoolId}_fees_${currentSession}`)
    return stored ? JSON.parse(stored) : {}
  }

  const getFees = (student) => {
    const fallback = { total: 0, paid: 0, discount: 0, remaining: 0, history: [], prevSessionDues: 0 }
    if (!student) return fallback
    const sessionRecs = getFeeRecordsForSession()
    const rec = sessionRecs[student.id]
    if (rec && (Number(rec.total) >= 0)) return { ...fallback, ...rec, history: rec.history || [] }
    const classFee = Number(globalFeeConfig.classFees?.[student.class] || 40000)
    const transportFee = Number(globalFeeConfig.transportFees?.[student.transportRoute] || 0)
    const defaultTotal = classFee + transportFee
    return { ...fallback, total: defaultTotal, remaining: defaultTotal }
  }

  const deleteStudent = (id) => {
    if (!window.confirm(`⚠️ PERMANENT DELETE: Are you sure you want to remove this student (ID: ${id})? All personal data and login access will be revoked.`)) return
    const updated = students.filter(s => s.id !== id)
    updateStudents(updated)
    refreshData()
    
    // Clean up login access is automatic now since it's stored in the student object
    
    // Clean up session-specific fees if needed
    const feeKey = `erp_${schoolId}_fees_${currentSession}`
    const currentFees = JSON.parse(localStorage.getItem(feeKey) || '{}')
    if (currentFees[id]) {
      delete currentFees[id]
      localStorage.setItem(feeKey, JSON.stringify(currentFees))
    }
  }

  return (
    <div className="students-page">
      <div className="dash-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="dash-page-title"><FiUsers style={{ display: 'inline', marginRight: 8 }} />Student Directory</div>
            <div className="dash-page-subtitle">Comprehensive management of student academic and personal records</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {isAdmin && selectedIds.length > 0 && <button className="btn btn-primary" style={{ background: 'var(--accent-600)' }} onClick={() => setPromoteModal(true)}><FiArrowRight /> Promote {selectedIds.length} Students</button>}
            {isAdmin && <button className="btn btn-secondary" onClick={() => navigate(`/${schoolId}/erp/id-card-design`)}><FiShield /> Design ID Cards</button>}
            {isAdmin && <button className="btn btn-secondary" onClick={syncStudents} title="Standardize names and IDs for current session"><FiRefreshCw /> Sync Data</button>}
            <button className="btn btn-secondary" onClick={handleExport}><FiDownload /> Export CSV</button>
            <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add New Student</button>
          </div>
        </div>
      </div>

      <div className="dash-widget" style={{ padding: '20px', marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div className="dash-search" style={{ flex: 1, minWidth: 250, marginBottom: 0 }}>
          <FiSearch />
          <input placeholder="Search name or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 150 }} value={filterClass} onChange={e => setFilterClass(e.target.value)}>
          <option value="">All Classes</option>
          {globalClasses.map(c => <option key={c.class} value={c.class}>Class {c.class}</option>)}
        </select>
      </div>

      <div className="dash-widget">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? filteredStudents.map(s => s.id) : [])} checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0} />
              </th>
              <th>ID</th>
              <th>Student Details</th>
              <th>Class/Sec</th>
              <th>Parents</th>
              <th>Phone</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(s => (
              <tr key={s.id}>
                <td><input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => setSelectedIds(prev => prev.includes(s.id) ? prev.filter(id => id !== s.id) : [...prev, s.id])} /></td>
                <td style={{ fontWeight: 700, color: 'var(--primary-600)', fontSize: 12 }}>{s.id}</td>
                <td>
                  <button onClick={() => { setSelectedStudent(s); setDetailModal(true); }} style={{ border: 'none', background: 'none', textAlign: 'left', padding: 0, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gray-100)', overflow: 'hidden' }}>
                        {s.photo ? <img src={s.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FiUser style={{ margin: 8 }} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--gray-800)', textDecoration: 'underline' }}>{s.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>ID: {s.id} | DOB: {formatDate(s.dob)}</div>
                      </div>
                    </div>
                  </button>
                </td>
                <td><span className="badge badge-info">{s.class}-{s.section}</span></td>
                <td>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.fatherName || s.parentName}</div>
                  <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>{s.motherName || 'Mother'}</div>
                </td>
                <td>{s.phone || s.fatherPhone || '---'}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary btn-sm" title="Edit" onClick={() => openEdit(s)}><FiEdit2 size={12} /></button>
                    <button className="btn btn-secondary btn-sm" title="Print ID Card" onClick={() => setPrintStudent(s)}><FiPrinter size={12} /></button>
                    {isAdmin && <button className="btn btn-secondary btn-sm" title="Generate TC" onClick={() => setPrintTCStudent(s)}><FiFileText size={12} /></button>}
                    {isAdmin && <button className="btn btn-secondary btn-sm" style={{ color: 'var(--error)' }} title="Delete" onClick={() => deleteStudent(s.id)}><FiTrash2 size={12} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* COMPREHENSIVE DETAIL MODAL */}
      {detailModal && selectedStudent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', padding: 35, borderRadius: 20, width: '100%', maxWidth: 1100, maxHeight: '95vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 35 }}>
              <div style={{ display: 'flex', gap: 25, alignItems: 'center' }}>
                <div style={{ width: 100, height: 100, borderRadius: 20, background: 'var(--primary-100)', overflow: 'hidden', border: '4px solid white', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                  {selectedStudent.photo ? <img src={selectedStudent.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--primary-600)', textAlign: 'center', marginTop: 25 }}>{selectedStudent.name?.[0] || '?'}</div>}
                </div>
                <div>
                  <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--gray-900)' }}>{selectedStudent.name}</h2>
                  <div style={{ display: 'flex', gap: 15, marginTop: 10 }}>
                    <span className="badge badge-info" style={{ padding: '6px 12px' }}>ID: {selectedStudent.id}</span>
                    <span className="badge badge-success" style={{ padding: '6px 12px' }}>CLASS {selectedStudent.class} ({selectedStudent.section})</span>
                    <span className="badge" style={{ background: 'var(--accent-100)', color: 'var(--accent-700)', padding: '6px 12px' }}>ROLL NO: {selectedStudent.rollNo}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {isAdmin && <button className="btn btn-secondary" onClick={() => setPrintTCStudent(selectedStudent)}><FiFileText /> Generate TC</button>}
                <button className="btn btn-secondary" onClick={() => setPrintStudent(selectedStudent)}><FiPrinter /> Print ID Card</button>
                <button className="btn btn-secondary" onClick={() => window.print()}><FiPrinter /> Print Profile</button>
                <button className="btn btn-secondary" style={{ background: 'var(--gray-100)' }} onClick={() => setDetailModal(false)}><FiX size={20} /></button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
              {/* Section 1: Personal & Government */}
              <div className="detail-section">
                <h4 className="section-title"><FiUser /> Personal & Identity</h4>
                <div className="detail-grid">
                  <div className="detail-item"><label>Gender</label><span>{selectedStudent.gender}</span></div>
                  <div className="detail-item"><label>Date of Birth</label><span>{formatDate(selectedStudent.dob)}</span></div>
                  <div className="detail-item"><label>Blood Group</label><span>{selectedStudent.bloodGroup || '---'}</span></div>
                  <div className="detail-item"><label>Birth Mark</label><span>{selectedStudent.birthMark || '---'}</span></div>
                  <div className="detail-item"><label>Aadhaar No</label><span>{selectedStudent.aadhaar || '---'}</span></div>
                  <div className="detail-item"><label>Samagra ID</label><span>{selectedStudent.samagra || '---'}</span></div>
                  <div className="detail-item"><label>Religion</label><span>{selectedStudent.religion || '---'}</span></div>
                </div>
              </div>

              {/* Section 2: Parent & Contact */}
              <div className="detail-section">
                <h4 className="section-title"><FiUsers /> Parent Information</h4>
                <div className="detail-grid">
                  <div className="detail-item" style={{ gridColumn: 'span 2' }}><label>Father's Name</label><span>{selectedStudent.fatherName || selectedStudent.parentName}</span></div>
                  <div className="detail-item"><label>Father's Occ.</label><span>{selectedStudent.fatherOcc || '---'}</span></div>
                  <div className="detail-item"><label>Father's Mob.</label><span>{selectedStudent.fatherPhone || selectedStudent.phone}</span></div>
                  <div className="detail-item" style={{ gridColumn: 'span 2' }}><label>Mother's Name</label><span>{selectedStudent.motherName || '---'}</span></div>
                  <div className="detail-item"><label>Mother's Occ.</label><span>{selectedStudent.motherOcc || '---'}</span></div>
                  <div className="detail-item"><label>Mother's Mob.</label><span>{selectedStudent.motherPhone || '---'}</span></div>
                  <div className="detail-item" style={{ gridColumn: 'span 2' }}><label>Primary Email</label><span>{selectedStudent.email || '---'}</span></div>
                </div>
              </div>

              {/* Section 3: Fees & Financials */}
              <div className="detail-section" style={{ background: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}>
                <h4 className="section-title" style={{ color: 'var(--primary-800)' }}><FiDollarSign /> Fees Summary</h4>
                <div style={{ background: 'white', padding: 20, borderRadius: 15, textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary-600)' }}>₹{getFees(selectedStudent).remaining}</div>
                  <div style={{ fontSize: 10, color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 800, marginTop: 5 }}>Pending Balance</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 20 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>₹{getFees(selectedStudent).total}</div>
                    <div style={{ fontSize: 9, color: 'var(--gray-400)' }}>Total</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent-600)' }}>₹{getFees(selectedStudent).paid}</div>
                    <div style={{ fontSize: 9, color: 'var(--gray-400)' }}>Paid</div>
                  </div>
                </div>
                <h5 style={{ fontSize: 11, fontWeight: 800, marginBottom: 10, color: 'var(--primary-800)' }}>LAST PAYMENTS</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {getFees(selectedStudent).history.slice(0, 3).map((h, i) => (
                    <div key={i} style={{ background: 'white', padding: '8px 12px', borderRadius: 10, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span>{h.date}</span>
                      <span style={{ fontWeight: 700 }}>₹{h.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Address (Full Width) */}
              <div className="detail-section" style={{ gridColumn: 'span 2' }}>
                <h4 className="section-title"><FiMapPin /> Address Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
                  <div>
                    <label style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 800 }}>RESIDENTIAL ADDRESS</label>
                    <p style={{ fontSize: 14, marginTop: 5 }}>{selectedStudent.address}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 800 }}>PERMANENT ADDRESS</label>
                    <p style={{ fontSize: 14, marginTop: 5 }}>{selectedStudent.permAddress || selectedStudent.address}</p>
                  </div>
                </div>
              </div>

              {/* Section 5: Health & Transport */}
              <div className="detail-section">
                <h4 className="section-title"><FiActivity /> Health & Body</h4>
                <div className="detail-grid">
                  <div className="detail-item"><label>Height</label><span>{selectedStudent.height || '---'}</span></div>
                  <div className="detail-item"><label>Weight</label><span>{selectedStudent.weight || '---'}</span></div>
                  <div className="detail-item"><label>Allergies</label><span>{selectedStudent.allergies || 'None'}</span></div>
                  <div className="detail-item"><label>Medical</label><span>{selectedStudent.medicalConditions || 'Normal'}</span></div>
                </div>
              </div>

              {/* Section 6: Previous School Details */}
              <div className="detail-section" style={{ gridColumn: 'span 2' }}>
                <h4 className="section-title"><FiHome /> Previous School Details</h4>
                <div className="detail-grid">
                  <div className="detail-item"><label>Previous School</label><span>{selectedStudent.prevSchoolName || '---'}</span></div>
                  <div className="detail-item"><label>Last Class</label><span>{selectedStudent.prevSchoolClass || '---'}</span></div>
                  <div className="detail-item"><label>TC Number</label><span>{selectedStudent.prevSchoolTC || '---'}</span></div>
                  <div className="detail-item"><label>Unique Number</label><span>{selectedStudent.prevSchoolUniqueNo || '---'}</span></div>
                  <div className="detail-item"><label>City/Location</label><span>{selectedStudent.prevSchoolCity || '---'}</span></div>
                </div>
              </div>

              {/* Section 7: Documents */}
              <div className="detail-section">
                <h4 className="section-title"><FiPaperclip /> Related Documents</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {selectedStudent.documents && selectedStudent.documents.length > 0 ? (
                    selectedStudent.documents.map((doc, idx) => (
                      <a key={idx} href={doc.file} download={doc.fileName || doc.name} style={{ textDecoration: 'none', background: 'white', padding: '10px 15px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--gray-100)', color: 'var(--primary-600)', fontWeight: 700, fontSize: 13 }}>
                        <FiFile />
                        <div style={{ flex: 1 }}>
                          <div>{doc.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 400 }}>{doc.date || '---'}</div>
                        </div>
                        <FiDownload />
                      </a>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: 20, color: 'var(--gray-400)', fontSize: 12 }}>No documents attached</div>
                  )}
                </div>
              </div>

              {/* Section 8: Portal Credentials (Admin Only) */}
              {isAdmin && (
                <div className="detail-section" style={{ background: 'var(--accent-50)', border: '1px solid var(--accent-100)' }}>
                  <h4 className="section-title" style={{ color: 'var(--accent-800)' }}><FiShield /> Portal Access</h4>
                  <div className="detail-grid">
                    <div className="detail-item"><label>Username</label><span style={{ fontWeight: 800, color: 'var(--accent-700)' }}>{selectedStudent.username || 'Not Set'}</span></div>
                    <div className="detail-item"><label>Password</label><span style={{ fontWeight: 800, color: 'var(--accent-700)' }}>{selectedStudent.password || 'Not Set'}</span></div>
                  </div>
                  <button className="btn btn-primary btn-sm w-full" style={{ marginTop: 15, background: 'var(--accent-600)', border: 'none' }} onClick={() => openEdit(selectedStudent)}>
                    Change Credentials
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MASSIVE ADD/EDIT FORM MODAL */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', padding: 40, borderRadius: 20, width: '100%', maxWidth: 1100, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
              <h2 style={{ fontWeight: 900 }}>{selectedStudent ? 'Modify Student Record' : 'Enroll New Student'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ border: 'none', background: 'none', color: 'var(--gray-400)' }}><FiX size={24} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 40 }}>
                {/* Photo Col */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 180, height: 220, borderRadius: 15, background: 'var(--gray-50)', border: '2px dashed var(--gray-200)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
                    {formData.photo ? <img src={formData.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FiUser size={60} color="var(--gray-200)" />}
                  </div>
                  <label className="btn btn-secondary w-full" style={{ cursor: 'pointer' }}>
                    Change Photo
                    <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                  </label>
                </div>

                {/* Form Col */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                  {/* Part 1: Basic & Academic */}
                  <div className="form-row-group">
                    <h5 className="form-sub-title">1. Academic Information</h5>
                    <div className="form-grid">
                      <div className="form-group"><label>Full Name *</label><input className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                      <div className="form-group"><label>Class *</label>
                        <select className="form-select" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})}>
                          {globalClasses.map(c => <option key={c.class} value={c.class}>{c.class}</option>)}
                        </select>
                      </div>
                      <div className="form-group"><label>Section</label>
                        <select className="form-select" value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})}>
                          {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="form-group"><label>Student ID {selectedStudent ? '' : '(Auto)'}</label><input className="form-input" value={formData.admissionNo} readOnly={!selectedStudent} style={selectedStudent ? {} : { background: 'var(--gray-50)', cursor: 'not-allowed' }} /></div>
                      <div className="form-group"><label>Roll No</label><input className="form-input" value={formData.rollNo} onChange={e => setFormData({...formData, rollNo: e.target.value})} /></div>
                      <div className="form-group"><label>Adm. Date</label><input type="date" className="form-input" value={formData.admissionDate} onChange={e => setFormData({...formData, admissionDate: e.target.value})} /></div>
                    </div>
                  </div>

                  {/* Part 1.5: Portal Credentials */}
                  <div className="form-row-group">
                    <h5 className="form-sub-title">1.5 Portal Access Credentials</h5>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Portal Username</label>
                        <input className="form-input" placeholder="e.g. john_stu001" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                        <div style={{fontSize: 10, color: 'var(--gray-400)', marginTop: 4}}>Leave blank for auto-generation</div>
                      </div>
                      <div className="form-group">
                        <label>Portal Password</label>
                        <input className="form-input" placeholder="Enter secure password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                        <div style={{fontSize: 10, color: 'var(--gray-400)', marginTop: 4}}>Leave blank for auto-generation</div>
                      </div>
                    </div>
                  </div>

                  {/* Part 2: Personal Details */}
                  <div className="form-row-group">
                    <h5 className="form-sub-title">2. Personal & Identity Details</h5>
                    <div className="form-grid">
                      <div className="form-group"><label>Date of Birth *</label><input type="date" className="form-input" required value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} /></div>
                      <div className="form-group"><label>Gender</label>
                        <select className="form-select" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                          <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="form-group"><label>Blood Group</label>
                        <select className="form-select" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div className="form-group"><label>Category</label>
                        <select className="form-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                          <option value="General">General</option><option value="OBC">OBC</option><option value="SC">SC</option><option value="ST">ST</option>
                        </select>
                      </div>
                      <div className="form-group"><label>Aadhaar No</label><input className="form-input" placeholder="12 Digit No" maxLength={12} pattern="[0-9]{12}" title="Must be exactly 12 digits" value={formData.aadhaar} onChange={e => setFormData({...formData, aadhaar: e.target.value.replace(/\D/g, '')})} /></div>
                      <div className="form-group"><label>Samagra ID</label><input className="form-input" placeholder="9 Digit No" maxLength={9} pattern="[0-9]{9}" title="Must be exactly 9 digits" value={formData.samagra} onChange={e => setFormData({...formData, samagra: e.target.value.replace(/\D/g, '')})} /></div>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Identification Mark (Birth Mark)</label><input className="form-input" placeholder="E.g. Mole on left cheek" value={formData.birthMark} onChange={e => setFormData({...formData, birthMark: e.target.value})} /></div>
                    </div>
                  </div>

                  {/* Part 3: Parental Details */}
                  <div className="form-row-group">
                    <h5 className="form-sub-title">3. Parental & Guardian Details</h5>
                    <div className="form-grid">
                      <div className="form-group"><label>Father's Name *</label><input className="form-input" required value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} /></div>
                      <div className="form-group"><label>Father's Phone *</label><input className="form-input" required maxLength={10} pattern="[0-9]{10}" title="Must be exactly 10 digits" value={formData.fatherPhone} onChange={e => setFormData({...formData, fatherPhone: e.target.value.replace(/\D/g, '')})} /></div>
                      <div className="form-group"><label>Father's Occ.</label><input className="form-input" value={formData.fatherOcc} onChange={e => setFormData({...formData, fatherOcc: e.target.value})} /></div>
                      <div className="form-group"><label>Mother's Name *</label><input className="form-input" required value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} /></div>
                      <div className="form-group"><label>Mother's Phone</label><input className="form-input" maxLength={10} pattern="[0-9]{10}" title="Must be exactly 10 digits" value={formData.motherPhone} onChange={e => setFormData({...formData, motherPhone: e.target.value.replace(/\D/g, '')})} /></div>
                      <div className="form-group"><label>Mother's Occ.</label><input className="form-input" value={formData.motherOcc} onChange={e => setFormData({...formData, motherOcc: e.target.value})} /></div>
                    </div>
                  </div>

                  {/* Part 4: Address & Transport */}
                  <div className="form-row-group">
                    <h5 className="form-sub-title">4. Address & Transport Information</h5>
                    <div className="form-grid">
                      <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Residential Address *</label><input className="form-input" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} /></div>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Permanent Address</label><input className="form-input" value={formData.permAddress} onChange={e => setFormData({...formData, permAddress: e.target.value})} /></div>
                      <div className="form-group"><label>Transport Route *</label>
                        <select className="form-select" required value={formData.transportRoute} onChange={e => setFormData({...formData, transportRoute: e.target.value})}>
                          <option value="">Select Route...</option>
                          <option value="None">None (Self)</option>
                          {transportRoutes.map(tr => (
                            <option key={tr.route} value={tr.route}>{tr.route} (Bus {tr.bus})</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group"><label>Bus Stop</label><input className="form-input" value={formData.transportStop} onChange={e => setFormData({...formData, transportStop: e.target.value})} /></div>
                    </div>
                  </div>

                  {/* Part 5: Health & Body */}
                  <div className="form-row-group">
                    <h5 className="form-sub-title">5. Health & Body Details</h5>
                    <div className="form-grid">
                      <div className="form-group"><label>Height (cm)</label><input className="form-input" type="number" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} /></div>
                      <div className="form-group"><label>Weight (kg)</label><input className="form-input" type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} /></div>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Health Conditions / Allergies</label><input className="form-input" value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} placeholder="Specify any chronic health conditions or allergies..." /></div>
                    </div>
                  </div>

                  {/* Part 6: Previous School Details */}
                  <div className="form-row-group">
                    <h5 className="form-sub-title">6. Previous School Information</h5>
                    <div className="form-grid">
                      <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Previous School Name</label><input className="form-input" value={formData.prevSchoolName} onChange={e => setFormData({...formData, prevSchoolName: e.target.value})} /></div>
                      <div className="form-group"><label>Last Class Studied</label><input className="form-input" value={formData.prevSchoolClass} onChange={e => setFormData({...formData, prevSchoolClass: e.target.value})} /></div>
                      <div className="form-group"><label>TC Number</label><input className="form-input" value={formData.prevSchoolTC} onChange={e => setFormData({...formData, prevSchoolTC: e.target.value})} /></div>
                      <div className="form-group"><label>Unique Number</label><input className="form-input" value={formData.prevSchoolUniqueNo} onChange={e => setFormData({...formData, prevSchoolUniqueNo: e.target.value})} /></div>
                      <div className="form-group"><label>Previous School City</label><input className="form-input" value={formData.prevSchoolCity} onChange={e => setFormData({...formData, prevSchoolCity: e.target.value})} /></div>
                    </div>
                  </div>

                  {/* Part 7: Document Uploads */}
                  <div className="form-row-group">
                    <h5 className="form-sub-title">7. Attach Documents</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 15 }}>
                      {(formData.documents || []).map((doc, idx) => (
                        <div key={idx} style={{ background: 'var(--gray-50)', padding: '12px 15px', borderRadius: 12, border: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', gap: 12 }}>
                          <FiFile color="var(--primary-600)" />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
                            <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>{doc.date}</div>
                          </div>
                          <button type="button" onClick={() => removeDocument(idx)} style={{ border: 'none', background: 'none', color: 'var(--error)', cursor: 'pointer' }}><FiTrash2 size={14} /></button>
                        </div>
                      ))}
                      <label style={{ background: 'var(--primary-50)', border: '2px dashed var(--primary-200)', padding: '15px', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', minHeight: 80 }}>
                        <FiPaperclip color="var(--primary-600)" />
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary-700)' }}>Upload Document</span>
                        <input type="file" hidden onChange={handleDocumentUpload} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 50, borderTop: '1px solid var(--gray-100)', paddingTop: 30 }}>
                <button type="button" className="btn btn-secondary btn-lg" onClick={() => setModalOpen(false)}>Discard Changes</button>
                <button type="submit" className="btn btn-primary btn-lg" style={{ minWidth: 200 }}>Save Student Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT ID CARD PREVIEW MODAL */}
      {printStudent && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center', padding:20}}>
          <div style={{background:'white', padding:30, borderRadius:20, maxWidth:500, width:'100%'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:25}}>
              <h3 style={{fontWeight:900, color:'var(--gray-800)'}}>Student ID Card Preview</h3>
              <div style={{display:'flex', gap:10}}>
                <button className="btn btn-primary" onClick={() => generatePDF('student-id-card', `ID_Card_${printStudent.id}.pdf`)}><FiPrinter /> Download PDF</button>
                <button className="btn btn-secondary" onClick={() => setPrintStudent(null)}><FiX /></button>
              </div>
            </div>
            
            <div id="student-id-card" style={{ 
              width: idConfig.cardType === 'vertical' ? 320 : 500, 
              height: idConfig.cardType === 'vertical' ? 500 : 320, 
              margin:'0 auto', border:`4px solid ${idConfig.themeColor}`, 
              borderRadius:idConfig.borderRadius, overflow:'hidden', background:'white', position:'relative', 
              textAlign:'center', boxShadow:'0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex', flexDirection: 'column'
            }}>
               <div style={{background:idConfig.themeColor, color:'white', padding:'20px 15px'}}>
                 <div style={{fontSize:14, fontWeight:900, letterSpacing:1}}>{idConfig.schoolName}</div>
                 <div style={{fontSize:9, marginTop:5, background:'white', color:idConfig.themeColor, display:'inline-block', padding:'2px 10px', borderRadius:100, fontWeight:800}}>STUDENT IDENTITY CARD</div>
               </div>
               
               <div style={{padding:25, display:'flex', flexDirection: idConfig.cardType === 'vertical' ? 'column' : 'row', alignItems:'center', gap:20, flex:1}}>
                 <div style={{width:110, height:130, margin: idConfig.cardType === 'vertical' ? '0 auto' : '0', borderRadius:12, border:`3px solid ${idConfig.themeColor}`, overflow:'hidden', background:'var(--gray-50)', flexShrink:0}}>
                   {printStudent.photo ? <img src={printStudent.photo} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <div style={{fontSize:50, fontWeight:900, color:'var(--primary-200)', marginTop:30}}>{printStudent.name[0]}</div>}
                 </div>
                 
                 <div style={{textAlign: idConfig.cardType === 'vertical' ? 'center' : 'left', flex:1}}>
                   <div style={{fontSize:20, fontWeight:900, textTransform:'uppercase', color:'var(--gray-800)', marginBottom:5}}>{printStudent.name}</div>
                   <div style={{fontSize:14, fontWeight:800, color:idConfig.themeColor}}>Class: {printStudent.class}-{printStudent.section || 'A'}</div>
                   
                   <div style={{marginTop:15, fontSize:11, textAlign:'left'}}>
                     <div style={{display:'flex', marginBottom:4}}><strong style={{width:60, color:'var(--gray-400)'}}>ROLL NO:</strong> <span style={{fontWeight:800}}>{printStudent.rollNo || '---'}</span></div>
                     <div style={{display:'flex', marginBottom:4}}><strong style={{width:60, color:'var(--gray-400)'}}>FATHER:</strong> <span style={{fontWeight:800}}>{printStudent.fatherName || printStudent.parentName}</span></div>
                     <div style={{display:'flex'}}><strong style={{width:60, color:'var(--gray-400)'}}>PHONE:</strong> <span style={{fontWeight:800}}>{printStudent.phone || printStudent.parentPhone}</span></div>
                   </div>
                 </div>
               </div>
               
               <div style={{padding:'0 25px 20px', width:'100%', display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                  <div style={{textAlign:'left'}}>
                    {idConfig.showQr && <div style={{width:45, height:45, background:'var(--gray-100)', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:'var(--gray-400)'}}>QR</div>}
                  </div>
                  {idConfig.showSign && (
                    <div style={{textAlign:'center'}}>
                      <div style={{fontSize:16, fontFamily:'cursive', color:idConfig.themeColor, opacity:0.6}}>Principal</div>
                      <div style={{borderTop:'1px solid var(--gray-300)', paddingTop:2, fontSize:8, fontWeight:800, color:'var(--gray-600)'}}>PRINCIPAL</div>
                    </div>
                  )}
               </div>
               <div style={{height:10, background:idConfig.themeColor}}></div>
            </div>
          </div>
        </div>
      )}

      {/* TRANSFER CERTIFICATE (TC) PREVIEW MODAL */}
      {printTCStudent && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center', padding:20}}>
          <div style={{background:'white', padding:30, borderRadius:20, maxWidth:850, width:'100%', maxHeight:'95vh', overflowY:'auto'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:25}}>
              <h3 style={{fontWeight:900, color:'var(--gray-800)'}}>Transfer Certificate Preview</h3>
              <div style={{display:'flex', gap:10}}>
                <button className="btn btn-primary" onClick={() => generatePDF('tc-print-area', `TC_${printTCStudent.id}.pdf`)}><FiPrinter /> Download PDF TC</button>
                <button className="btn btn-secondary" onClick={() => setPrintTCStudent(null)}><FiX /></button>
              </div>
            </div>
            
            <div id="tc-print-area" style={{ 
              margin:'0 auto', border: certConfig.bgImage ? 'none' : '10px solid var(--primary-800)', 
              padding: '40px', background: certConfig.bgImage ? `url(${certConfig.bgImage}) no-repeat center/100% 100%` : 'white', position:'relative', 
              boxShadow: certConfig.bgImage ? 'none' : 'inset 0 0 0 10px var(--primary-600)', minHeight: '900px'
            }}>
              <div style={{ paddingTop: certConfig.bgImage ? certConfig.contentMarginTop : 0 }}>
                {!certConfig.bgImage && (
                  <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    {certConfig.showLogo && certConfig.logoImage && <img src={certConfig.logoImage} style={{ width: 80, height: 80, objectFit: 'contain', margin: '0 auto 15px', display: 'block' }} />}
                    <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--primary-800)', textTransform: 'uppercase' }}>{certConfig.schoolName || 'NEW MORNING STAR PUBLIC SCHOOL'}</h1>
                    <p style={{ fontSize: 14, color: 'var(--gray-600)' }}>Affiliated to Central Board of Secondary Education (CBSE)</p>
                    <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>{certConfig.address || 'Subhash Nagar, New Delhi - 110027 | Email: info@nmsps.edu.in'}</p>
                    <div style={{ borderBottom: '2px solid var(--primary-600)', margin: '15px 0' }} />
                    <h2 style={{ fontSize: 24, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, display: 'inline-block', border: '2px solid var(--primary-800)', padding: '5px 20px', borderRadius: 4 }}>TRANSFER CERTIFICATE</h2>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30, fontSize: 14, fontWeight: 600 }}>
                  <div>TC No: <span style={{ textDecoration: 'underline' }}>{Math.floor(Math.random() * 10000)}/2026</span></div>
                  <div>Student ID: <span style={{ textDecoration: 'underline' }}>{printTCStudent.id}</span></div>
                  <div>Date: <span style={{ textDecoration: 'underline' }}>{new Date().toLocaleDateString()}</span></div>
                </div>

                <div style={{ fontSize: 16, lineHeight: '2.5' }}>
                  <ol style={{ paddingLeft: 20 }}>
                    <li>Name of Pupil: <strong>{printTCStudent.name}</strong></li>
                    <li>Mother's Name: <strong>{printTCStudent.motherName || '________________________'}</strong></li>
                    <li>Father's/Guardian's Name: <strong>{printTCStudent.fatherName || printTCStudent.parentName || '________________________'}</strong></li>
                    <li>Nationality: <strong>{printTCStudent.nationality || 'Indian'}</strong></li>
                    <li>Whether the candidate belongs to SC/ST/OBC: <strong>{printTCStudent.category || 'General'}</strong></li>
                    <li>Date of first admission in the School with class: <strong>{printTCStudent.admissionDate || '________________________'}</strong></li>
                    <li>Date of birth (in Christian Era) according to Admission Register: <strong>{printTCStudent.dob || '________________________'}</strong></li>
                    <li>Class in which the pupil last studied: <strong>{printTCStudent.class}</strong></li>
                    <li>School/Board Annual examination last taken with result: <strong>Passed</strong></li>
                    <li>Whether failed, if so once/twice in the same class: <strong>No</strong></li>
                    <li>Subjects Studied: <strong>{getStudentSubjects(printTCStudent.class).map((s, i) => `${i+1}. ${s}`).join(' ')}</strong></li>
                    <li>Whether qualified for promotion to the higher class: <strong>Yes</strong></li>
                    <li>Month upto which the (pupil has paid) school dues paid: <strong>March 2026</strong></li>
                    <li>Any fee concession availed of: <strong>No</strong></li>
                    <li>Total No. of working days: <strong>210</strong></li>
                    <li>Total No. of working days present: <strong>185</strong></li>
                    <li>General conduct: <strong>Good</strong></li>
                    <li>Date of application for certificate: <strong>{new Date().toLocaleDateString()}</strong></li>
                    <li>Date of issue of certificate: <strong>{new Date().toLocaleDateString()}</strong></li>
                    <li>Reasons for leaving the school: <strong>Parents Request</strong></li>
                  </ol>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 80, position: 'relative' }}>
                  <div style={{ textAlign: 'center', width: 200 }}>
                    {certConfig.qrImage && <img src={certConfig.qrImage} style={{ width: 60, height: 60, marginBottom: 10, display: 'block', margin: '0 auto' }} />}
                    <div style={{ borderTop: certConfig.qrImage ? 'none' : '1px solid black', paddingTop: 5, fontWeight: 600 }}>Signature of Class Teacher</div>
                  </div>
                  <div style={{ textAlign: 'center', width: 200 }}>
                    <div style={{ borderTop: '1px solid black', paddingTop: 5, fontWeight: 600, marginTop: certConfig.qrImage || certConfig.signImage ? 70 : 0 }}>Checked By</div>
                  </div>
                  <div style={{ textAlign: 'center', width: 200 }}>
                    {certConfig.showSign && certConfig.signImage && <img src={certConfig.signImage} style={{ height: 50, objectFit: 'contain', margin: '0 auto 10px', display: 'block' }} />}
                    <div style={{ borderTop: certConfig.signImage ? 'none' : '1px solid black', paddingTop: 5, fontWeight: 600 }}>Principal Seal & Signature</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .form-sub-title { font-size: 13px; font-weight: 800; color: var(--primary-600); text-transform: uppercase; margin-bottom: 15px; border-left: 4px solid var(--primary-600); padding-left: 10px; }
        .section-title { font-size: 14px; font-weight: 800; margin-bottom: 20px; display: flex; alignItems: center; gap: 10; color: var(--gray-800); text-transform: uppercase; }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .detail-item label { display: block; font-size: 9px; color: var(--gray-400); text-transform: uppercase; font-weight: 800; margin-bottom: 4px; }
        .detail-item span { font-size: 13px; font-weight: 700; color: var(--gray-700); }
        .detail-section { padding: 25px; background: var(--gray-50); borderRadius: 20px; }
        @media print {
          body * { visibility: hidden; }
          #student-id-card, #student-id-card *, #tc-print-area, #tc-print-area * { 
            visibility: visible; 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #student-id-card { 
            position: absolute; 
            left: 50%; 
            top: 50%; 
            transform: translate(-50%, -50%); 
            border: none !important; 
            box-shadow: none !important; 
          }
          #tc-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: 10px solid var(--primary-800) !important;
            box-shadow: inset 0 0 0 10px var(--primary-600) !important;
          }
        }
      `}</style>
      {/* PROMOTION MODAL */}
      {promoteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', padding: 30, borderRadius: 20, width: '100%', maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: 20 }}>Promote {selectedIds.length} Students</h3>
              <button className="btn-close" onClick={() => setPromoteModal(false)}><FiX /></button>
            </div>
            
            <div className="form-group">
              <label className="form-label">Target Session</label>
              <select className="form-select" value={targetSession} onChange={e => setTargetSession(e.target.value)}>
                <option value="">Select Next Session...</option>
                {sessions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Promote to Class (Next Stage)</label>
              <select className="form-select" value={targetClass} onChange={e => setTargetClass(e.target.value)}>
                <option value="">Auto (Next Class)</option>
                <option value="UKG">UKG</option>
                {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'].map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>

            <div style={{ padding: 15, background: 'var(--primary-50)', borderRadius: 10, marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: 'var(--primary-700)', fontWeight: 600 }}>
                💡 Action: This will copy selected students to Session {targetSession || '...'} and upgrade their classes. Original data in {currentSession} will remain unchanged.
              </div>
            </div>

            <button className="btn btn-primary w-full" onClick={() => {
              if (!targetSession) return alert('Please select target session')
              const nextClassMap = { 'UKG': '1st', '1st': '2nd', '2nd': '3rd', '3rd': '4th', '4th': '5th', '5th': '6th', '6th': '7th', '7th': '8th', '8th': '9th', '9th': '10th', '10th': 'ALUMNI' }
              const currentFees = JSON.parse(localStorage.getItem(feeKey(currentSession)) || '{}')
              const nextFees = JSON.parse(localStorage.getItem(feeKey(targetSession)) || '{}')
              
              const studentsToPromote = students.filter(s => selectedIds.includes(s.id))
              const promotedStudents = studentsToPromote.map(s => {
                const nextClass = targetClass || nextClassMap[s.class] || s.class
                
                // Calculate next year fees
                const baseFee = Number(globalFeeConfig.classFees[nextClass] || 0)
                const transFee = (s.transportRoute && s.transportRoute !== 'None') ? Number(globalFeeConfig.transportFees[s.transportRoute] || 0) : 0
                const studentDue = Number(currentFees[s.id]?.remaining || 0)
                
                // Create next year fee record
                nextFees[s.id] = {
                  total: baseFee + transFee,
                  paid: 0,
                  discount: 0,
                  remaining: (baseFee + transFee) + studentDue,
                  prevSessionDues: studentDue,
                  history: []
                }

                return {
                  ...s,
                  class: nextClass,
                  attendance: 100 // Reset for new year
                }
              })

              const existingNextSession = JSON.parse(localStorage.getItem(`erp_${schoolId}_students_${targetSession}`) || '[]')
              const updatedNextSession = [...existingNextSession, ...promotedStudents]
              
              // Remove duplicates by ID
              const uniqueUpdated = Array.from(new Map(updatedNextSession.map(item => [item.id, item])).values())
              
              localStorage.setItem(`erp_${schoolId}_students_${targetSession}`, JSON.stringify(uniqueUpdated))
              localStorage.setItem(feeKey(targetSession), JSON.stringify(nextFees))
              alert(`Successfully promoted ${selectedIds.length} students to Session ${targetSession}`)
              setPromoteModal(false)
              setSelectedIds([])
            }}>Promote Students Now</button>
          </div>
        </div>
      )}
    </div>
  )
}
