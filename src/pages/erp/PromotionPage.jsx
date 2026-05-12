import { useState, useMemo } from 'react'
import { useAuth, MOCK_DATA } from '../../context/AuthContext'
import { useParams } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { FiArrowUp, FiFilter, FiUser, FiCheckCircle, FiXCircle, FiSave, FiAlertCircle, FiChevronRight, FiUsers } from 'react-icons/fi'
import { formatDate } from '../../utils/exportUtils'

export default function PromotionPage() {
  const { user, currentSession, sessions } = useAuth()
  const { schoolId } = useParams()
  const isAdmin = user?.role === 'admin'
  
  const { students, updateStudents, classes: erpClasses = [] } = useData()

  const [fromClass, setFromClass] = useState('9th')
  const [fromSection, setFromSection] = useState('A')
  const [toClass, setToClass] = useState('10th')
  const [toSection, setToSection] = useState('A')
  
  const [selectedStudents, setSelectedStudents] = useState([])
  const [promotionResults, setPromotionResults] = useState([]) // Array of {id, action: 'promote' | 'fail'}
  const [destSession, setDestSession] = useState('')

  const classes = erpClasses.length > 0 ? erpClasses.map(c => c.class) : ['UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']
  
  // Initialize destSession to next session if available
  useMemo(() => {
    const idx = sessions.indexOf(currentSession)
    if (idx >= 0 && idx < sessions.length - 1) setDestSession(sessions[idx+1])
    else setDestSession(currentSession)
  }, [currentSession, sessions])

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const [cls, sec] = (s.class || '').split('-')
      return (fromClass ? cls === fromClass : true) && (fromSection && fromSection !== '-' ? sec === fromSection : true)
    })
  }, [fromClass, fromSection, students])

  const toggleSelect = (id) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    )
  }

  const handleBulkAction = (action) => {
    const results = [...promotionResults]
    selectedStudents.forEach(sid => {
      const existing = results.findIndex(r => r.id === sid)
      if (existing >= 0) results[existing].action = action
      else results.push({ id: sid, action })
    })
    setPromotionResults(results)
  }

  const finalizePromotions = () => {
    if (promotionResults.length === 0) return
    if (!destSession) return alert('Please select a destination session.')

    const destStudentsKey = `erp_${schoolId}_students_${destSession}`
    const destFeesKey = `erp_${schoolId}_fees_${destSession}`
    
    const targetStudents = JSON.parse(localStorage.getItem(destStudentsKey) || '[]')
    const targetFees = JSON.parse(localStorage.getItem(destFeesKey) || '{}')
    const currentFees = JSON.parse(localStorage.getItem(`erp_${schoolId}_fees_${currentSession}`) || '{}')
    
    let promotedCount = 0

    promotionResults.forEach(res => {
      if (res.action === 'promote') {
        const student = students.find(s => s.id === res.id)
        if (student) {
          // 1. Prepare student for new session
          const promotedStudent = { 
            ...student, 
            class: toClass, 
            section: toSection,
            // Reset session-specific fields if any
          }
          
          // Add or Update in target session
          const existingIdx = targetStudents.findIndex(s => s.id === student.id)
          if (existingIdx >= 0) targetStudents[existingIdx] = promotedStudent
          else targetStudents.push(promotedStudent)

          // 2. Carry forward dues
          const studentFee = currentFees[student.id] || { remaining: 0 }
          const unpaid = Number(studentFee.remaining || 0)
          
          if (!targetFees[student.id]) {
            targetFees[student.id] = { total: 0, paid: 0, discount: 0, remaining: 0, history: [], prevSessionDues: unpaid }
          } else {
            targetFees[student.id].prevSessionDues = unpaid
          }
          // Recalculate remaining including prev dues
          targetFees[student.id].remaining = (Number(targetFees[student.id].total || 0) + unpaid) - Number(targetFees[student.id].paid || 0) - Number(targetFees[student.id].discount || 0)
          
          promotedCount++
        }
      }
    })

    localStorage.setItem(destStudentsKey, JSON.stringify(targetStudents))
    localStorage.setItem(destFeesKey, JSON.stringify(targetFees))
    
    setPromotionResults([])
    setSelectedStudents([])
    alert(`Successfully promoted ${promotedCount} students to session ${destSession}!`)
  }

  return (
    <div className="promotion-page">
      <div className="dash-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="dash-page-title"><FiArrowUp style={{ display: 'inline', marginRight: 8 }} />Student Promotion & Results</div>
            <div className="dash-page-subtitle">Bulk promote students to higher classes or finalize session results</div>
          </div>
          <button className="btn btn-primary" onClick={finalizePromotions} disabled={promotionResults.length === 0}>
            <FiSave /> Finalize & Apply Updates
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 30 }}>
        
        {/* Step 1: Selection & Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="dash-widget" style={{ padding: 25 }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary-600)', textTransform: 'uppercase', marginBottom: 20 }}>1. Source Class</h4>
            <div className="form-group">
              <label className="form-label">Current Class</label>
              <select className="form-select" value={fromClass} onChange={e => setFromClass(e.target.value)}>
                {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Current Section</label>
              <select className="form-select" value={fromSection} onChange={e => setFromSection(e.target.value)}>
                {['-', 'A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>{s === '-' ? 'No Section' : `Section ${s}`}</option>)}
              </select>
            </div>
          </div>

          <div className="dash-widget" style={{ padding: 25, background: 'var(--primary-50)', border: '1px solid var(--primary-100)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary-700)', textTransform: 'uppercase', marginBottom: 20 }}>2. Destination Class</h4>
            <div className="form-group">
              <label className="form-label">Promote To Class</label>
              <select className="form-select" value={toClass} onChange={e => setToClass(e.target.value)}>
                {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">To Section</label>
              <select className="form-select" value={toSection} onChange={e => setToSection(e.target.value)}>
                {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>Section {s}</option>)}
              </select>
            </div>
            <div style={{ marginTop: 20, padding: 12, background: 'white', borderRadius: 8, fontSize: 11, color: 'var(--primary-600)', display: 'flex', gap: 10, alignItems: 'center' }}>
              <FiAlertCircle size={16} />
              Students marked as "Promoted" will be moved to Class {toClass}-{toSection}.
            </div>
          </div>

          <div className="dash-widget" style={{ padding: 25, border: '1px solid var(--accent-200)', background: 'var(--accent-50)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-700)', textTransform: 'uppercase', marginBottom: 20 }}>3. Destination Session</h4>
            <div className="form-group">
              <label className="form-label">Promote to Session</label>
              <select className="form-select" value={destSession} onChange={e => setDestSession(e.target.value)}>
                {sessions.map(s => <option key={s} value={s}>{s} {s === currentSession ? '(Current)' : ''}</option>)}
              </select>
            </div>
            <p style={{ fontSize: 11, color: 'var(--accent-600)', marginTop: 10 }}>
              Unpaid dues from <strong>{currentSession}</strong> will be automatically carried forward to <strong>{destSession}</strong>.
            </p>
          </div>
        </div>

        {/* Step 2: Student List & Actions */}
        <div className="dash-widget" style={{ padding: 0 }}>
          <div className="dash-widget-header" style={{ justifyContent: 'space-between', padding: '20px 25px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
              <span className="dash-widget-title"><FiUsers /> Class Roster ({filteredStudents.length} Students)</span>
              <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{selectedStudents.length} Selected</div>
            </div>
            {selectedStudents.length > 0 && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-sm btn-primary" onClick={() => handleBulkAction('promote')}><FiCheckCircle /> Bulk Promote</button>
                <button className="btn btn-sm btn-secondary" style={{ color: 'var(--error)' }} onClick={() => handleBulkAction('fail')}><FiXCircle /> Bulk Fail</button>
              </div>
            )}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>
                    <input type="checkbox" onChange={e => setSelectedStudents(e.target.checked ? filteredStudents.map(s => s.id) : [])} 
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0} />
                  </th>
                  <th>Student Info</th>
                  <th>Academic Info</th>
                  <th>Current Result</th>
                  <th style={{ textAlign: 'right' }}>Action Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(s => {
                  const result = promotionResults.find(r => r.id === s.id)
                  return (
                    <tr key={s.id} style={{ background: result ? (result.action === 'promote' ? 'var(--primary-50)' : 'var(--error)-50') : 'transparent' }}>
                      <td>
                        <input type="checkbox" checked={selectedStudents.includes(s.id)} onChange={() => toggleSelect(s.id)} />
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{s.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>ID: {s.id} | DOB: {formatDate(s.dob)}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: 12 }}>Roll No: {s.rollNo}</div>
                        <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>Adm: {s.admissionNo || '---'}</div>
                      </td>
                      <td>
                        <span className="badge badge-success">Passed</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {result ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                            <span className={`badge ${result.action === 'promote' ? 'badge-success' : 'badge-error'}`} style={{ textTransform: 'uppercase' }}>
                              {result.action === 'promote' ? `Promote to ${toClass}` : 'Detained / Fail'}
                            </span>
                            <button className="btn btn-sm" style={{ padding: 4, background: 'none' }} onClick={() => setPromotionResults(promotionResults.filter(r => r.id !== s.id))}>
                              <FiXCircle color="var(--gray-300)" />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                            <button className="btn btn-sm btn-secondary" onClick={() => setPromotionResults([...promotionResults, { id: s.id, action: 'promote' }])}>Promote</button>
                            <button className="btn btn-sm btn-secondary" style={{ color: 'var(--error)' }} onClick={() => setPromotionResults([...promotionResults, { id: s.id, action: 'fail' }])}>Fail</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {filteredStudents.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: 60, color: 'var(--gray-400)' }}>No students found in Class {fromClass}-{fromSection}.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .promotion-page .table td { vertical-align: middle; }
        .promotion-page .form-select { width: 100%; border-radius: 12px; border: 1px solid var(--gray-200); padding: 10px; }
      `}</style>
    </div>
  )
}
