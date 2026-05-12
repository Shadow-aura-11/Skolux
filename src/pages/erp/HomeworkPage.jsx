import { useState } from 'react'
import { useAuth, MOCK_DATA, getSessionStore, saveSessionStore } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { FiBook, FiPlus, FiCheckCircle, FiAlertCircle, FiClock, FiFileText, FiSave, FiX } from 'react-icons/fi'

export default function HomeworkPage() {
  const { user, currentSession } = useAuth()
  const { homework, updateHomework, classes: erpClasses = [] } = useData()
  
  const [modal, setModal] = useState(false)
  const [newHw, setNewHw] = useState({ title: '', subject: 'Mathematics', class: '10th-A', due: '', desc: '' })
  
  const allAvailableClasses = erpClasses.length > 0 ? erpClasses.map(c => c.class) : ['UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']
  const allSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Sc.', 'Computer', 'Sanskrit', 'Drawing']
  const isTeacher = user?.role === 'teacher'
  const isAdmin = user?.role === 'admin'
  const isStudent = user?.role === 'student'
  const isParent = user?.role === 'parent'

  const handleSave = (e) => {
    e.preventDefault()
    const entry = {
      id: Date.now(),
      title: newHw.title,
      subject: newHw.subject,
      assignedBy: user?.name || 'Admin',
      date: new Date().toISOString().split('T')[0],
      due: newHw.due,
      status: 'Pending'
    }
    updateHomework([entry, ...homework])
    setModal(false)
    setNewHw({ title: '', subject: 'Mathematics', class: '10th-A', due: '', desc: '' })
  }

  const toggleStatus = (id) => {
    if (!isStudent && !isParent) return
    updateHomework(homework.map(h => h.id === id ? { ...h, status: h.status === 'Submitted' ? 'Pending' : 'Submitted' } : h))
  }

  return (
    <div>
      <div className="dash-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="dash-page-title"><FiBook style={{ display: 'inline', marginRight: 8 }} />Homework Management</div>
          <div className="dash-page-subtitle">{isTeacher ? 'Manage assignments for your classes' : 'Track your pending and submitted assignments'}</div>
        </div>
        {(isTeacher || isAdmin) && <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}><FiPlus /> Assign Homework</button>}
      </div>

      <div className="dash-stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
        <div className="dash-stat-card"><div className="dash-stat-icon" style={{ background: 'var(--gold-50)', color: 'var(--gold-600)' }}><FiClock /></div><div><div className="dash-stat-value">{homework.filter(h => h.status === 'Pending').length}</div><div className="dash-stat-label">Pending</div></div></div>
        <div className="dash-stat-card"><div className="dash-stat-icon" style={{ background: 'var(--accent-50)', color: 'var(--accent-500)' }}><FiCheckCircle /></div><div><div className="dash-stat-value">{homework.filter(h => h.status === 'Submitted' || h.status === 'Graded').length}</div><div className="dash-stat-label">Completed</div></div></div>
        <div className="dash-stat-card"><div className="dash-stat-icon" style={{ background: '#fef2f2', color: 'var(--error)' }}><FiAlertCircle /></div><div><div className="dash-stat-value">{homework.filter(h => h.status === 'Overdue').length}</div><div className="dash-stat-label">Overdue</div></div></div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {homework.map(h => (
          <div key={h.id} className="dash-widget" style={{ padding: '16px 20px', cursor: (isStudent || isParent) ? 'pointer' : 'default' }} onClick={() => toggleStatus(h.id)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: h.status === 'Submitted' ? 'var(--accent-50)' : h.status === 'Overdue' ? '#fef2f2' : 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: h.status === 'Submitted' ? 'var(--accent-500)' : h.status === 'Overdue' ? 'var(--error)' : 'var(--primary-500)', flexShrink: 0 }}>
                {h.status === 'Submitted' ? <FiCheckCircle /> : <FiFileText />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{h.title}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)', marginTop: 2 }}>{h.subject} | Assigned: {h.date} | <strong>Due: {h.due}</strong></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${h.status === 'Submitted' ? 'badge-success' : h.status === 'Overdue' ? 'badge-error' : h.status === 'Graded' ? 'badge-info' : 'badge-warning'}`}>
                  {h.status}
                </span>
                <div style={{ fontSize: 10, color: 'var(--gray-400)', marginTop: 4 }}>By {h.assignedBy}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setModal(false)}>
          <form style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 480, width: '100%' }} onClick={e => e.stopPropagation()} onSubmit={handleSave}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><h3 style={{ fontWeight: 700, fontSize: 'var(--text-xl)' }}>Assign New Homework</h3><button type="button" onClick={() => setModal(false)}><FiX /></button></div>
            <div className="form-group"><label className="form-label">Title *</label><input className="form-input" required value={newHw.title} onChange={e => setNewHw({ ...newHw, title: e.target.value })} placeholder="Assignment title" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select className="form-select" value={newHw.subject} onChange={e => setNewHw({ ...newHw, subject: e.target.value })}>
                  {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Due Date *</label><input className="form-input" type="date" required value={newHw.due} onChange={e => setNewHw({ ...newHw, due: e.target.value })} /></div>
            </div>
            <div className="form-group">
              <label className="form-label">Target Class & Section</label>
              <select className="form-select" value={newHw.class} onChange={e => setNewHw({ ...newHw, class: e.target.value })}>
                {erpClasses.map(c => (
                  <optgroup key={c.class} label={`Class ${c.class}`}>
                    {c.sections.map(s => (
                      <option key={`${c.class}-${s.name}`} value={`${c.class}-${s.name}`}>{c.class}-{s.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Description / Instructions</label><textarea className="form-input" style={{ minHeight: 80 }} value={newHw.desc} onChange={e => setNewHw({ ...newHw, desc: e.target.value })} placeholder="Optional instructions..." /></div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}><button type="submit" className="btn btn-primary" style={{ flex: 1 }}><FiSave /> Assign Homework</button><button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button></div>
          </form>
        </div>
      )}
    </div>
  )
}
