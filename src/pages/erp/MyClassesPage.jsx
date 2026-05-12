import { useState, useMemo } from 'react'
import { useAuth, MOCK_DATA } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { FiUsers, FiSearch, FiEdit2, FiX, FiCheck, FiUser, FiHome, FiSmartphone, FiCalendar, FiCreditCard, FiFilter, FiSave, FiInfo } from 'react-icons/fi'
import { formatDate } from '../../utils/exportUtils'

export default function MyClassesPage() {
  const { user } = useAuth()
  
  // Allow selecting from all classes as requested
  const allAvailableClasses = ['UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']
  
  const [selectedClassRaw, setSelectedClassRaw] = useState('10th-A')
  const [searchTerm, setSearchTerm] = useState('')
  const [editModal, setEditModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const { students, updateStudents } = useData()

  // Split Class and Section from the raw string (e.g. "X-A" -> class: "X", section: "A")
  const [currentClass, currentSection] = selectedClassRaw.split('-')

  const classStudents = useMemo(() => {
    return students.filter(s => {
      // Handle different data formats for class (some might have class="10th" section="A")
      const matchesClass = s.class === currentClass || s.class === `${currentClass}th`
      const matchesSection = (s.section || 'A') === currentSection
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || (s.id || '').toLowerCase().includes(searchTerm.toLowerCase())
      return matchesClass && matchesSection && matchesSearch
    })
  }, [students, currentClass, currentSection, searchTerm])

  const [formData, setFormData] = useState({})

  const handleEdit = (student) => {
    setSelectedStudent(student)
    setFormData(student)
    setEditModal(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const updated = students.map(s => s.id === selectedStudent.id ? { ...s, ...formData } : s)
    updateStudents(updated)
    setEditModal(false)
    alert('Student records updated successfully!')
  }

  return (
    <div className="my-classes-page">
      <div className="dash-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="dash-page-title"><FiUsers style={{ display: 'inline', marginRight: 8 }} />Class Management</div>
            <div className="dash-page-subtitle">View and update academic records for students in your assigned sections</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <select className="form-select" value={selectedClassRaw} onChange={e => setSelectedClassRaw(e.target.value)} style={{ minWidth: 150, fontWeight: 700, borderColor: 'var(--primary-200)' }}>
              {allAvailableClasses.map(c => (
                <optgroup key={c} label={`Class ${c}`}>
                   {['A', 'B', 'C', 'D'].map(s => <option key={`${c}-${s}`} value={`${c}-${s}`}>{c}-{s}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="dash-widget" style={{ padding: 20, marginBottom: 25, display: 'flex', gap: 15, alignItems: 'center' }}>
        <div className="dash-search" style={{ flex: 1, marginBottom: 0 }}>
          <FiSearch />
          <input placeholder="Search by student name or Admission ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-600)', background: 'var(--primary-50)', padding: '10px 20px', borderRadius: 12 }}>
          {classStudents.length} Students found
        </div>
      </div>

      <div className="dash-widget">
        <table className="table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Info</th>
              <th>Parents</th>
              <th>Phone</th>
              <th>Documents</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classStudents.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 800, color: 'var(--primary-600)' }}>{s.rollNo}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 35, height: 35, borderRadius: '50%', background: 'var(--gray-100)', overflow: 'hidden' }}>
                      {s.photo ? <img src={s.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FiUser style={{ margin: 10 }} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>ID: {s.id} | DOB: {formatDate(s.dob)}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.fatherName || s.parentName}</div>
                  <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>{s.motherName || '---'}</div>
                </td>
                <td style={{ fontSize: 13 }}>{s.phone}</td>
                <td>
                  <span className="badge" style={{ background: s.aadhaar ? 'var(--success-100)' : 'var(--error-100)', color: s.aadhaar ? 'var(--success-700)' : 'var(--error-700)' }}>
                    {s.aadhaar ? 'KYC Done' : 'Pending'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(s)}>
                    <FiEdit2 size={12} /> Edit Details
                  </button>
                </td>
              </tr>
            ))}
            {classStudents.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: 60, color: 'var(--gray-400)' }}>No students found in Class {selectedClassRaw}.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModal && selectedStudent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', padding: 40, borderRadius: 20, width: '100%', maxWidth: 1000, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
              <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: 'var(--primary-600)' }}>
                  {selectedStudent.name[0]}
                </div>
                <div>
                  <h2 style={{ fontWeight: 900 }}>Edit Record: {selectedStudent.name}</h2>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>Student ID: {selectedStudent.id} | Class: {selectedClassRaw}</div>
                </div>
              </div>
              <button onClick={() => setEditModal(false)} style={{ border: 'none', background: 'none', color: 'var(--gray-400)' }}><FiX size={24} /></button>
            </div>

            <form onSubmit={handleSave}>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
                  {/* Part 1: Basic */}
                  <div style={{ gridColumn: 'span 3', borderBottom: '1px solid var(--gray-100)', paddingBottom: 10, marginBottom: 10 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase' }}>1. Basic & Personal Information</h4>
                  </div>
                  <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Date of Birth</label><input type="date" className="form-input" value={formData.dob} onChange={e=>setFormData({...formData, dob: e.target.value})} /></div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-select" value={formData.gender} onChange={e=>setFormData({...formData, gender: e.target.value})}>
                      <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Roll Number</label><input className="form-input" value={formData.rollNo} onChange={e=>setFormData({...formData, rollNo: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Admission No (Auto)</label><input className="form-input" value={formData.admissionNo} readOnly style={{ background: 'var(--gray-50)', cursor: 'not-allowed' }} /></div>
                  <div className="form-group"><label className="form-label">Blood Group</label><input className="form-input" value={formData.bloodGroup} onChange={e=>setFormData({...formData, bloodGroup: e.target.value})} /></div>

                  {/* Part 2: IDs */}
                  <div style={{ gridColumn: 'span 3', borderBottom: '1px solid var(--gray-100)', paddingBottom: 10, marginTop: 10, marginBottom: 10 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase' }}>2. Government IDs & Transport</h4>
                  </div>
                  <div className="form-group"><label className="form-label">Aadhaar No</label><input className="form-input" value={formData.aadhaar} onChange={e=>setFormData({...formData, aadhaar: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Samagra ID</label><input className="form-input" value={formData.samagra} onChange={e=>setFormData({...formData, samagra: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Transport Route</label><input className="form-input" value={formData.transport} onChange={e=>setFormData({...formData, transport: e.target.value})} /></div>

                  {/* Part 3: Family */}
                  <div style={{ gridColumn: 'span 3', borderBottom: '1px solid var(--gray-100)', paddingBottom: 10, marginTop: 10, marginBottom: 10 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase' }}>3. Family & Contact Information</h4>
                  </div>
                  <div className="form-group"><label className="form-label">Father's Name</label><input className="form-input" value={formData.fatherName} onChange={e=>setFormData({...formData, fatherName: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Mother's Name</label><input className="form-input" value={formData.motherName} onChange={e=>setFormData({...formData, motherName: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Contact Phone</label><input className="form-input" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} /></div>
                  <div className="form-group" style={{ gridColumn: 'span 3' }}>
                    <label className="form-label">Residential Address</label>
                    <textarea className="form-textarea" value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} style={{ minHeight: 60 }} />
                  </div>

                  {/* Part 4: Bank */}
                  <div style={{ gridColumn: 'span 3', borderBottom: '1px solid var(--gray-100)', paddingBottom: 10, marginTop: 10, marginBottom: 10 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase' }}>4. Bank Details (Scholarship/DBT)</h4>
                  </div>
                  <div className="form-group"><label className="form-label">Account Number</label><input className="form-input" value={formData.accNo} onChange={e=>setFormData({...formData, accNo: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Bank IFSC</label><input className="form-input" value={formData.ifsc} onChange={e=>setFormData({...formData, ifsc: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Account Holder</label><input className="form-input" value={formData.bankName} onChange={e=>setFormData({...formData, bankName: e.target.value})} placeholder="As per bank passbook" /></div>
               </div>

               <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 40, borderTop: '1px solid var(--gray-100)', paddingTop: 30 }}>
                <button type="button" className="btn btn-secondary btn-lg" onClick={() => setEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-lg" style={{ minWidth: 200 }}><FiSave /> Update Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .my-classes-page tr:hover { background: var(--gray-50); }
        .form-textarea { width: 100%; border: 1px solid var(--gray-200); border-radius: 12px; padding: 12px; font-family: inherit; resize: vertical; }
      `}</style>
    </div>
  )
}
