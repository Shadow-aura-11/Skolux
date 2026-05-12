import { useState, useEffect } from 'react'
import { useAuth, MOCK_DATA } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { FiCheckSquare, FiSave, FiFilter, FiUser, FiCheck, FiX, FiAlertCircle, FiClock } from 'react-icons/fi'

export default function MarkAttendancePage() {
  const { user } = useAuth()
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('A')
  
  const { students, attendance, updateAttendance, classes: erpClasses = [] } = useData()

  const [localAttendance, setLocalAttendance] = useState({}) // { studentId: 'Present' | 'Absent' | 'Late' }
  const [savedStatus, setSavedStatus] = useState(false)

  const classes = erpClasses.length > 0 ? erpClasses.map(c => c.class) : ['UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']
  
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const filteredStudents = students.filter(s => 
    (selectedClass ? s.class === selectedClass : true) && 
    (selectedSection ? (s.section || 'A') === selectedSection : true)
  )

  useEffect(() => {
    // Initialize all as present
    const initial = {}
    filteredStudents.forEach(s => {
      initial[s.id] = 'Present'
    })
    setLocalAttendance(initial)
    setSavedStatus(false)
  }, [selectedClass, selectedSection])

  const handleStatusChange = (sid, status) => {
    setLocalAttendance(prev => ({ ...prev, [sid]: status }))
    setSavedStatus(false)
  }

  const handleSave = () => {
    const today = formatDate(new Date())
    const record = {
      date: today,
      class: selectedClass,
      section: selectedSection,
      data: localAttendance
    }

    const filteredLogs = attendance.filter(l => l.date !== today || l.class !== selectedClass || l.section !== selectedSection)
    const newLogs = [...filteredLogs, record]
    
    updateAttendance(newLogs)
    setSavedStatus(true)
    alert(`Attendance for Class ${selectedClass}-${selectedSection} saved successfully for ${today}!`)
  }

  return (
    <div className="mark-attendance-page">
      <div className="dash-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="dash-page-title"><FiCheckSquare style={{ display: 'inline', marginRight: 8 }} />Daily Attendance Entry</div>
            <div className="dash-page-subtitle">Mark and finalize today's attendance for your assigned classes</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <div style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 600 }}>
              <FiClock style={{ verticalAlign: 'middle', marginRight: 4 }} /> 
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <button className="btn btn-primary" onClick={handleSave} disabled={!selectedClass || savedStatus}>
              <FiSave /> {savedStatus ? 'Attendance Saved' : 'Save Attendance'}
            </button>
          </div>
        </div>
      </div>

      <div className="dash-widget" style={{ padding: 25, marginBottom: 25, display: 'flex', gap: 20, alignItems: 'flex-end' }}>
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label className="form-label">Select Class</label>
          <select className="form-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
            <option value="">Choose Class...</option>
            {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label className="form-label">Select Section</label>
          <select className="form-select" value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>
            {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>Section {s}</option>)}
          </select>
        </div>
        <div style={{ padding: '10px 20px', background: 'var(--gray-50)', borderRadius: 12, fontSize: 13, fontWeight: 700, color: 'var(--gray-500)' }}>
          Total Students: {filteredStudents.length}
        </div>
      </div>

      {!selectedClass ? (
        <div className="dash-widget" style={{ textAlign: 'center', padding: 80, color: 'var(--gray-400)' }}>
          <FiFilter size={60} style={{ opacity: 0.2, marginBottom: 20 }} />
          <h3>Please select a class and section to start marking attendance</h3>
          <p>You can only mark attendance for the current date.</p>
        </div>
      ) : (
        <div className="dash-widget" style={{ padding: 0 }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 100 }}>Roll No</th>
                <th>Student Name</th>
                <th>Admission ID</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 800, color: 'var(--primary-600)' }}>{s.rollNo}</td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{s.name}</div>
                  </td>
                  <td>{s.id}</td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                      <button 
                        onClick={() => handleStatusChange(s.id, 'Present')}
                        style={{
                          padding: '6px 20px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
                          background: localAttendance[s.id] === 'Present' ? 'var(--success)' : 'var(--gray-100)',
                          color: localAttendance[s.id] === 'Present' ? 'white' : 'var(--gray-500)',
                          transition: 'all 0.2s'
                        }}>
                        Present
                      </button>
                      <button 
                        onClick={() => handleStatusChange(s.id, 'Absent')}
                        style={{
                          padding: '6px 20px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
                          background: localAttendance[s.id] === 'Absent' ? 'var(--error)' : 'var(--gray-100)',
                          color: localAttendance[s.id] === 'Absent' ? 'white' : 'var(--gray-500)',
                          transition: 'all 0.2s'
                        }}>
                        Absent
                      </button>
                      <button 
                        onClick={() => handleStatusChange(s.id, 'Late')}
                        style={{
                          padding: '6px 20px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
                          background: localAttendance[s.id] === 'Late' ? 'var(--accent-500)' : 'var(--gray-100)',
                          color: localAttendance[s.id] === 'Late' ? 'white' : 'var(--gray-500)',
                          transition: 'all 0.2s'
                        }}>
                        Late
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: 25, background: 'var(--gray-50)', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--gray-100)' }}>
             <button className="btn btn-primary btn-lg" onClick={handleSave} style={{ minWidth: 200 }}>
               Confirm & Submit Attendance
             </button>
          </div>
        </div>
      )}

      <style>{`
        .mark-attendance-page table tr { height: 60px; transition: background 0.2s; }
        .mark-attendance-page table tr:hover { background: var(--gray-50); }
      `}</style>
    </div>
  )
}
