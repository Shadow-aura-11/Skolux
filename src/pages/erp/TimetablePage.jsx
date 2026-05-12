import { useState, useEffect } from 'react'
import { useAuth, MOCK_DATA, getSessionStore, saveSessionStore } from '../../context/AuthContext'
import { FiCalendar, FiEdit3, FiSave, FiX, FiPlus, FiFilter, FiDownload, FiInfo } from 'react-icons/fi'
import { useData } from '../../context/DataContext'

const subColors = { 
  Physics:'#3b82f6', Mathematics:'#8b5cf6', English:'#ec4899', Hindi:'#f97316', 
  Chemistry:'#10b981', 'Social Sc.':'#eab308', Computer:'#06b6d4', PT:'#ef4444', 
  Library:'#6366f1', Art:'#f472b6', Music:'#a855f7', Science: '#10b981', 
  Social: '#eab308', EVS: '#22c55e', Games: '#ef4444', Break: '#94a3b8' 
}

const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Hindi', 'Social Sc.', 'Computer', 'Science', 'EVS', 'PT', 'Games', 'Library', 'Art', 'Music', 'General Knowledge', 'Break']

export default function TimetablePage() {
  const { user, currentSession } = useAuth()
  const isAdmin = user?.role === 'admin'
  const isTeacher = user?.role === 'teacher'
  const canEdit = isAdmin || isTeacher
  const { classes: erpClasses = [] } = useData() || {}
  const classes = erpClasses.length > 0 ? erpClasses.map(c => c.class) : ['UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']

  const [selectedClass, setSelectedClass] = useState('10th')
  const [selectedSection, setSelectedSection] = useState('-')
  const [isEditing, setIsEditing] = useState(false)
  
  const [timetable, setTimetable] = useState(() => {
    const store = getSessionStore(currentSession)
    return store.timetable && Object.keys(store.timetable).length > 0 
      ? store.timetable 
      : { 'X-A': { data: MOCK_DATA.timetable, periodCount: MOCK_DATA.periods.length } }
  })

  const [periodCount, setPeriodCount] = useState(7)
  const [editForm, setEditForm] = useState({})

  // If teacher, restrict to their class
  useEffect(() => {
    if (isTeacher && user?.assignedClasses?.length > 0) {
      setSelectedClass(user.assignedClasses[0])
    }
  }, [user])

  useEffect(() => {
    const classId = `${selectedClass}-${selectedSection}`
    const classData = timetable[classId] || { data: MOCK_DATA.timetable, periodCount: MOCK_DATA.periods.length }
    setPeriodCount(classData.periodCount || MOCK_DATA.periods.length)
  }, [selectedClass, selectedSection, timetable])

  const classId = `${selectedClass}-${selectedSection}`
  const currentData = (timetable[classId]?.data) || MOCK_DATA.timetable
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const timeSlots = ['8:00', '8:40', '9:30', '10:10', '11:00', '11:40', '12:20', '1:00', '1:40']

  const handleStartEdit = () => {
    setEditForm(JSON.parse(JSON.stringify(currentData)))
    setIsEditing(true)
  }

  const handleSave = () => {
    const classId = `${selectedClass}-${selectedSection}`
    const updated = { ...timetable, [classId]: { data: editForm, periodCount: periodCount } }
    setTimetable(updated)
    const store = getSessionStore(currentSession)
    saveSessionStore(currentSession, { ...store, timetable: updated })
    setIsEditing(false)
  }

  const updatePeriod = (day, idx, value) => {
    const updated = { ...editForm }
    if (!updated[day]) updated[day] = Array(9).fill('Break')
    updated[day][idx] = value
    setEditForm(updated)
  }

  return (
    <div className="timetable-page">
      <div className="dash-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 15 }}>
          <div>
            <div className="dash-page-title"><FiCalendar style={{ display: 'inline', marginRight: 8 }} />Class Timetable</div>
            <div className="dash-page-subtitle">Schedule management for Class {selectedClass}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary btn-sm"><FiDownload /> Export PDF</button>
            {canEdit && !isEditing && (
              <button className="btn btn-primary btn-sm" onClick={handleStartEdit}>
                <FiEdit3 /> Edit Timetable
              </button>
            )}
            {isEditing && (
              <>
                <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}><FiX /> Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handleSave}><FiSave /> Save Changes</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Configuration Bar (Admin Only) */}
      {isAdmin && (
        <div className="dash-widget" style={{ padding: '15px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 25, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FiFilter size={14} color="var(--gray-400)" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>Config:</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>Class:</span>
            <select className="form-select" style={{ width: 100 }} value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setIsEditing(false); }}>
              {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>Section:</span>
            <select className="form-select" style={{ width: 100 }} value={selectedSection} onChange={e => { setSelectedSection(e.target.value); setIsEditing(false); }}>
              <option value="-">None</option>
              {['A', 'B', 'C', 'D'].map(sec => <option key={sec} value={sec}>{sec}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>No. of Periods:</span>
            <select className="form-select" style={{ width: 80 }} value={periodCount} onChange={e => { setPeriodCount(Number(e.target.value)); setIsEditing(false); }} disabled={isEditing}>
              {[5, 6, 7, 8, 9].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      )}

      <div className="dash-widget">
        <div className="dash-widget-header" style={{ justifyContent: 'space-between' }}>
          <span className="dash-widget-title"><FiCalendar /> Academic Weekly Schedule</span>
          {isEditing && <span className="badge badge-warning">Editing Mode Active</span>}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ borderCollapse: 'separate', borderSpacing: '4px' }}>
            <thead>
              <tr>
                <th style={{ width: 120, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>Day</th>
                {Array.from({ length: periodCount }).map((_, i) => (
                  <th key={i} style={{ textAlign: 'center', fontSize: 10, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', padding: '10px 5px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary-600)' }}>PERIOD {i + 1}</div>
                    <div style={{ fontWeight: 400, color: 'var(--gray-400)', marginTop: 2 }}>{timeSlots[i] || '--:--'}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map(day => (
                <tr key={day}>
                  <td style={{ fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--gray-700)', padding: '15px 10px' }}>{day}</td>
                  {Array.from({ length: periodCount }).map((_, idx) => {
                    const sub = isEditing ? (editForm[day]?.[idx] || 'Break') : (currentData[day]?.[idx] || 'Break')
                    return (
                      <td key={idx} style={{ textAlign: 'center', minWidth: 110 }}>
                        {isEditing ? (
                          <input className="form-input" 
                            style={{ fontSize: 11, padding: '8px 6px', textAlign: 'center', borderColor: 'var(--primary-200)' }} 
                            placeholder="Subject..." 
                            value={sub} 
                            onChange={e => updatePeriod(day, idx, e.target.value)} />
                        ) : (
                          <div style={{ 
                            padding: '10px 4px', borderRadius: 'var(--radius-md)', 
                            background: `${subColors[sub] || '#6b7280'}12`, 
                            color: subColors[sub] || '#6b7280', 
                            fontWeight: 700, fontSize: 11,
                            border: `1px solid ${subColors[sub] || '#6b7280'}30`,
                            transition: 'all 0.2s'
                          }}>
                            {sub}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isEditing && (
        <div style={{ marginTop: 20, padding: 15, background: 'var(--primary-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary-100)', display: 'flex', gap: 12, alignItems: 'center' }}>
          <FiInfo size={20} color="var(--primary-600)" />
          <div style={{ fontSize: 13, color: 'var(--primary-800)' }}>
            <strong>Editing Tip:</strong> Select the subject for each period from the dropdown. Don't forget to click <strong>"Save Changes"</strong> to apply the new schedule for Class {selectedClass}.
          </div>
        </div>
      )}

      <style>{`
        .timetable-page td {
          vertical-align: middle;
        }
        .form-select {
          border-radius: var(--radius-md);
          border: 1px solid var(--gray-200);
          outline: none;
        }
        .form-select:focus {
          border-color: var(--primary-400);
        }
      `}</style>
    </div>
  )
}
