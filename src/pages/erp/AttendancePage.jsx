import { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { FiClock, FiCalendar, FiUsers, FiTrendingUp, FiCheckCircle, FiXCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function AttendancePage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedSection, setSelectedSection] = useState('A')
  const [viewMonth, setViewMonth] = useState(new Date())
  
  const { students, attendance, holidays, updateHolidays, classes } = useData()
  const classList = classes.map(c => c.class)
  
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const startDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const calendarDays = useMemo(() => {
    const days = []
    const count = daysInMonth(viewMonth)
    const start = startDayOfMonth(viewMonth)
    for (let i = 0; i < start; i++) days.push(null)
    for (let i = 1; i <= count; i++) days.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i))
    return days
  }, [viewMonth])

  return (
    <div className="attendance-page">
      <div className="dash-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="dash-page-title"><FiCalendar style={{ display: 'inline', marginRight: 8 }} />Student Attendance Explorer</div>
            <div className="dash-page-subtitle">Track and analyze class-wise attendance with yearly history</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px 380px', gap: 'var(--space-6)', height: 'calc(100vh - 180px)', minHeight: 600 }}>
        
        {/* Pane 1: Calendar */}
        <div className="dash-widget" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="dash-widget-header" style={{ justifyContent: 'space-between' }}>
            <span className="dash-widget-title"><FiCalendar /> {monthNames[viewMonth.getMonth()]} {viewMonth.getFullYear()}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-sm btn-secondary" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1))}><FiChevronLeft /></button>
              <button className="btn btn-sm btn-secondary" onClick={() => setViewMonth(new Date())}>Today</button>
              <button className="btn btn-sm btn-secondary" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1))}><FiChevronRight /></button>
            </div>
          </div>
          <div className="dash-widget-body" style={{ flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', paddingBottom: 10 }}>{d}</div>
              ))}
              {calendarDays.map((date, idx) => {
                if (!date) return <div key={idx} />
                const isSelected = selectedDate.toDateString() === date.toDateString()
                const isToday = new Date().toDateString() === date.toDateString()
                const isFuture = date > new Date()
                const dateKey = formatDate(date)
                const isHoliday = holidays.includes(dateKey) || date.getDay() === 0

                return (
                  <button key={idx} 
                    onClick={() => { setSelectedDate(date); setSelectedClass(null); }}
                    style={{
                      height: 80, border: '1px solid var(--gray-100)', borderRadius: 'var(--radius-lg)', padding: 10, position: 'relative', textAlign: 'left',
                      background: isSelected ? 'var(--primary-50)' : isHoliday ? '#fff1f2' : 'white',
                      borderColor: isSelected ? 'var(--primary-300)' : isHoliday ? '#fecdd3' : 'var(--gray-100)',
                      opacity: isFuture && !isHoliday ? 0.7 : 1,
                      transition: 'all 0.2s', cursor: 'pointer'
                    }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: isSelected ? 'var(--primary-600)' : isHoliday ? 'var(--error)' : isToday ? 'var(--accent-600)' : 'var(--gray-700)' }}>{date.getDate()}</span>
                    {isToday && <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-500)', marginTop: 4 }} />}
                    <div style={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 2 }}>
                      {!isHoliday && !isFuture && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-400)' }} />}
                      {isHoliday && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--error)' }} />}
                    </div>
                    {isHoliday && <div style={{ fontSize: 8, color: 'var(--error)', fontWeight: 700, marginTop: 4 }}>{date.getDay() === 0 ? 'SUNDAY' : 'HOLIDAY'}</div>}
                  </button>
                )
              })}
            </div>
            <div style={{ marginTop: 30, padding: 20, background: 'var(--gray-50)', borderRadius: 'var(--radius-xl)', fontSize: 13, color: 'var(--gray-500)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-400)' }} /> Working Day</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--error)' }} /> Holiday / Sunday</div>
              </div>
              {isAdmin && (
                <button className="btn btn-sm btn-secondary" style={{ color: holidays.includes(formatDate(selectedDate)) ? 'var(--accent-600)' : 'var(--error)' }}
                  onClick={() => {
                    const key = formatDate(selectedDate)
                    const newHolidays = holidays.includes(key) ? holidays.filter(h => h !== key) : [...holidays, key]
                    updateHolidays(newHolidays)
                  }}>
                  {holidays.includes(formatDate(selectedDate)) ? 'Unmark Holiday' : 'Mark as Holiday'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Pane 2: Middle Pane (Classes List) */}
        <div className="dash-widget" style={{ overflowY: 'auto' }}>
          <div className="dash-widget-header">
            <span className="dash-widget-title">
              <FiUsers /> Classes ({selectedDate.toLocaleDateString()})
            </span>
          </div>
          <div className="dash-widget-body" style={{ padding: 0 }}>
            {selectedDate > new Date() ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-400)' }}>
                <FiClock size={48} style={{ opacity: 0.2, marginBottom: 15 }} />
                <div>Attendance restricted for future dates.</div>
              </div>
            ) : holidays.includes(formatDate(selectedDate)) || selectedDate.getDay() === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--error)' }}>
                <FiXCircle size={48} style={{ opacity: 0.2, marginBottom: 15 }} />
                <div>This date is a Holiday/Sunday.</div>
              </div>
            ) : (
              <div style={{ padding: '0 20px' }}>
                <div className="form-group" style={{ margin: '15px 0' }}>
                  <label className="form-label" style={{ fontSize: 10, color: 'var(--gray-400)' }}>SWITCH SECTION</label>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {['A', 'B', 'C', 'D'].map(sec => (
                      <button key={sec} onClick={() => setSelectedSection(sec)} 
                        style={{ flex: 1, padding: '5px', borderRadius: 8, border: '1px solid var(--gray-200)', fontSize: 11, fontWeight: 700, 
                          background: selectedSection === sec ? 'var(--primary-600)' : 'white',
                          color: selectedSection === sec ? 'white' : 'var(--gray-600)' }}>{sec}</button>
                    ))}
                  </div>
                </div>
                {classList.map(cls => {
                  const classStudents = students.filter(s => s.class === cls && (s.section || 'A') === selectedSection)
                  const todayKey = formatDate(selectedDate)
                  const todayLog = (attendance || []).find(l => l.date === todayKey && l.class === cls && l.section === selectedSection)
                  
                  let pct = 0
                  if (todayLog && classStudents.length > 0) {
                    const presentCount = classStudents.filter(s => todayLog.data?.[s.id] === 'Present' || todayLog.data?.[s.id] === 'Late').length
                    pct = Math.round((presentCount / classStudents.length) * 100)
                  }

                  return (
                    <button key={cls} 
                      onClick={() => { setSelectedClass(cls); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', border: 'none', borderBottom: '1px solid var(--gray-50)', cursor: 'pointer', textAlign: 'left',
                        background: selectedClass === cls ? 'var(--primary-50)' : 'transparent', transition: 'background 0.2s'
                      }}>
                      <div>
                        <div style={{ fontWeight: 700, color: selectedClass === cls ? 'var(--primary-600)' : 'var(--gray-700)' }}>Class {cls}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{classStudents.length} Students</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: pct > 80 ? 'var(--success)' : pct > 0 ? 'var(--warning)' : 'var(--gray-300)' }}>{pct > 0 || todayLog ? `${pct}%` : '--'}</div>
                        <div style={{ fontSize: 9, color: 'var(--gray-400)' }}>Attendance</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Pane 3: Right Pane (Student Analysis) */}
        <div className="dash-widget" style={{ overflowY: 'auto' }}>
          <div className="dash-widget-header">
            <span className="dash-widget-title">
              {selectedClass ? `${selectedClass} Analysis` : 'Analysis'}
            </span>
          </div>
          <div className="dash-widget-body" style={{ padding: 0 }}>
                {!selectedClass ? (
                  <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-400)' }}><FiTrendingUp size={48} style={{ opacity: 0.2, marginBottom: 15 }} /><div>Select a class to view analysis</div></div>
                ) : (
                  students.filter(s => s.class === selectedClass && (s.section || 'A') === selectedSection).map(s => {
                    const todayKey = formatDate(selectedDate)
                    const todayLog = (attendance || []).find(l => l.date === todayKey && l.class === selectedClass && l.section === selectedSection)
                    const status = todayLog?.data?.[s.id] || 'N/A'
                    
                    return (
                      <div key={s.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--gray-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                        <span className={`badge ${status === 'Present' ? 'badge-success' : status === 'Absent' ? 'badge-error' : status === 'Late' ? 'badge-warning' : 'badge-secondary'}`} style={{ fontSize: 9 }}>
                          {status}
                        </span>
                      </div>
                    )
                  })
                )}
          </div>
        </div>
      </div>

      <style>{`
        .attendance-page { overflow: hidden; }
        .dash-widget::-webkit-scrollbar { width: 6px; }
        .dash-widget::-webkit-scrollbar-thumb { background: var(--gray-200); border-radius: 10px; }
      `}</style>
    </div>
  )
}
