import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth, MOCK_DATA, getSessionStore, saveSessionStore } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { FiUsers, FiCheckCircle, FiClock, FiBook, FiCalendar, FiSave, FiPlusCircle, FiCheck, FiX, FiDollarSign } from 'react-icons/fi'

export default function TeacherDashboard() {
  const { user, currentSession } = useAuth()
  const navigate = useNavigate()
  const { schoolId } = useParams()
  const [selectedClass, setSelectedClass] = useState('X-A')
  
  // Load live timetable data
  const liveTimetable = getSessionStore(currentSession).timetable || {}
  const primaryClass = user?.assignedClasses?.[0] || 'X-A'
  const classSchedule = (liveTimetable[primaryClass]?.data) || MOCK_DATA.timetable
  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todaySchedule = classSchedule[todayDay] || classSchedule['Monday'] || []

  const [attendanceMarked, setAttendanceMarked] = useState({})
  const [attendanceSaved, setAttendanceSaved] = useState(false)
  const [hwForm, setHwForm] = useState({ subject: 'Physics', title: '', dueDate: '', description: '' })
  const [hwSubmitted, setHwSubmitted] = useState(false)

  const { students } = useData()
  const classStudents = students.filter(s => s.class === selectedClass)
  const classes = user?.assignedClasses || ['X-A', 'X-B', 'IX-A', 'XI-Sci']
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const markAttendance = (studentId, status) => {
    setAttendanceMarked(prev => ({ ...prev, [studentId]: status }))
    setAttendanceSaved(false)
  }

  const saveAttendance = () => {
    const store = getSessionStore(currentSession)
    const newLog = {
      date: new Date().toISOString().split('T')[0],
      class: selectedClass.split('-')[0],
      section: selectedClass.split('-')[1] || 'A',
      data: attendanceMarked
    }
    const updated = [newLog, ...(store.attendance || [])]
    saveSessionStore(currentSession, { ...store, attendance: updated })
    setAttendanceSaved(true)
    setTimeout(() => setAttendanceSaved(false), 3000)
    window.location.reload() // Trigger re-sync across app
  }

  const submitHomework = (e) => {
    e.preventDefault()
    setHwSubmitted(true)
    setHwForm({ subject: 'Physics', title: '', dueDate: '', description: '' })
    setTimeout(() => setHwSubmitted(false), 3000)
  }

  const totalPresent = Object.values(attendanceMarked).filter(s => s === 'present').length
  const totalAbsent = Object.values(attendanceMarked).filter(s => s === 'absent').length
  const totalMarked = Object.keys(attendanceMarked).length

  const stats = [
    { icon: <FiUsers />, label: 'My Classes', value: classes.length, bg: 'var(--primary-50)', color: 'var(--primary-500)' },
    { icon: <FiCheckCircle />, label: 'Attendance Marked', value: totalMarked > 0 ? `${totalPresent}/${totalMarked}` : 'Not yet', bg: 'var(--accent-50)', color: 'var(--accent-500)' },
    { icon: <FiBook />, label: 'Active Homework', value: '4', bg: 'var(--gold-50)', color: 'var(--gold-600)' },
    { icon: <FiCalendar />, label: 'Periods Today', value: '6', bg: '#f3e8ff', color: '#8b5cf6' },
  ]

  return (
    <>
      <div className="dash-page-header">
        <div className="dash-page-title">Teacher Dashboard</div>
        <div className="dash-page-subtitle">{user?.name} | {user?.subject} | {today}</div>
      </div>

      {/* Stats */}
      <div className="dash-stat-grid">
        {stats.map((s, i) => (
          <div key={i} className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div>
              <div className="dash-stat-value">{s.value}</div>
              <div className="dash-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="dash-widget" style={{ marginBottom: 'var(--space-6)', padding: '20px' }}>
        <div className="dash-widget-title" style={{ marginBottom: '15px' }}>Quick Actions</div>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate(`/${schoolId}/erp/students?action=add`)}>
            <FiPlusCircle /> Add New Student
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(`/${schoolId}/erp/students`)}>
            <FiUsers /> Student Directory
          </button>
          <button className="btn btn-secondary" style={{ background: 'var(--accent-50)', color: 'var(--accent-700)', border: '1px solid var(--accent-200)' }} 
            onClick={() => navigate(`/${schoolId}/erp/fees`)}>
            <FiDollarSign /> Collect Fees
          </button>
        </div>
      </div>

      <div className="dash-widget-row">
        {/* ATTENDANCE MARKING */}
        <div className="dash-widget">
          <div className="dash-widget-header">
            <span className="dash-widget-title"><FiClock /> Mark Attendance</span>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {classes.map(cls => (
                <button key={cls} onClick={() => { setSelectedClass(cls); setAttendanceMarked({}); setAttendanceSaved(false) }}
                  className={`btn btn-sm ${selectedClass === cls ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 12px', fontSize: '11px' }}>
                  {cls}
                </button>
              ))}
            </div>
          </div>
          <div className="dash-widget-body" style={{ padding: 0 }}>
            {classStudents.length === 0 ? (
              <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--gray-400)' }}>
                No students found in {selectedClass}. Select another class.
              </div>
            ) : (
              <>
                <table className="table">
                  <thead>
                    <tr><th>Roll</th><th>Name</th><th>Status</th><th>Mark</th></tr>
                  </thead>
                  <tbody>
                    {classStudents.map((s, i) => {
                      const status = attendanceMarked[s.id]
                      return (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{s.rollNo}</td>
                          <td>{s.name}</td>
                          <td>
                            {status ? (
                              <span className={`badge ${status === 'present' ? 'badge-success' : status === 'absent' ? 'badge-error' : 'badge-warning'}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </span>
                            ) : (
                              <span className="badge" style={{ background: 'var(--gray-100)', color: 'var(--gray-500)' }}>Not Marked</span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button onClick={() => markAttendance(s.id, 'present')}
                                style={{ width: 30, height: 30, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, border: 'none', cursor: 'pointer', background: status === 'present' ? 'var(--accent-500)' : 'var(--accent-50)', color: status === 'present' ? 'white' : 'var(--accent-600)', transition: 'all 0.15s' }}>
                                <FiCheck />
                              </button>
                              <button onClick={() => markAttendance(s.id, 'absent')}
                                style={{ width: 30, height: 30, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, border: 'none', cursor: 'pointer', background: status === 'absent' ? 'var(--error)' : '#fef2f2', color: status === 'absent' ? 'white' : 'var(--error)', transition: 'all 0.15s' }}>
                                <FiX />
                              </button>
                              <button onClick={() => markAttendance(s.id, 'late')}
                                style={{ width: 30, height: 30, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer', background: status === 'late' ? 'var(--gold-500)' : 'var(--gold-50)', color: status === 'late' ? 'white' : 'var(--gold-600)', transition: 'all 0.15s' }}>
                                L
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--gray-100)' }}>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>
                    P: <strong style={{ color: 'var(--accent-600)' }}>{totalPresent}</strong> | A: <strong style={{ color: 'var(--error)' }}>{totalAbsent}</strong> | Total: <strong>{totalMarked}</strong>/{classStudents.length}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    {attendanceSaved && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--accent-600)', fontWeight: 600 }}><FiCheckCircle style={{ display: 'inline' }} /> Saved!</span>}
                    <button className="btn btn-primary btn-sm" onClick={saveAttendance} disabled={totalMarked === 0}>
                      <FiSave /> Save Attendance
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ASSIGN HOMEWORK */}
        <div className="dash-widget">
          <div className="dash-widget-header">
            <span className="dash-widget-title"><FiPlusCircle /> Assign Homework</span>
          </div>
          <div className="dash-widget-body">
            {hwSubmitted && (
              <div style={{ padding: 'var(--space-3)', background: 'var(--accent-50)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--accent-700)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <FiCheckCircle /> Homework assigned successfully!
              </div>
            )}
            <form onSubmit={submitHomework}>
              <div className="form-group">
                <label className="form-label">Class</label>
                <select className="form-select">
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input className="form-input" value={hwForm.subject} readOnly style={{ background: 'var(--gray-50)' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Assignment Title *</label>
                <input className="form-input" placeholder="e.g., Chapter 5 - NCERT Questions"
                  value={hwForm.title} onChange={e => setHwForm({...hwForm, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date *</label>
                <input className="form-input" type="date" value={hwForm.dueDate}
                  onChange={e => setHwForm({...hwForm, dueDate: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" style={{ minHeight: 80 }} placeholder="Instructions for students..."
                  value={hwForm.description} onChange={e => setHwForm({...hwForm, description: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary w-full"><FiPlusCircle /> Assign Homework</button>
            </form>
          </div>
        </div>
      </div>

      <div className="dash-widget" style={{ marginTop: 'var(--space-5)' }}>
        <div className="dash-widget-header">
          <span className="dash-widget-title"><FiCalendar /> Today's Schedule ({todayDay}) - {primaryClass}</span>
        </div>
        <div className="dash-widget-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 'var(--space-3)' }}>
            {todaySchedule.map((sub, i) => (
              <div key={i} style={{ padding: 'var(--space-3)', background: sub === user?.subject ? 'var(--primary-50)' : 'var(--gray-50)', border: sub === user?.subject ? '2px solid var(--primary-300)' : '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--gray-400)', marginBottom: 2 }}>Period {i + 1}</div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: sub === user?.subject ? 700 : 500, color: sub === user?.subject ? 'var(--primary-600)' : 'var(--gray-600)' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
