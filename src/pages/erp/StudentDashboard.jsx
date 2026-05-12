import { useAuth, MOCK_DATA, feeKey, getSessionStore } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import {
  FiClock, FiAward, FiBook, FiCalendar, FiDollarSign,
  FiCheckCircle, FiAlertCircle, FiTrendingUp, FiBell, FiMessageCircle, FiUser, FiHome, FiSmartphone, FiCreditCard, FiShield
} from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function StudentDashboard() {
  const { user, currentSession } = useAuth()
  const { students, attendance: globalAttendance, homework: globalHomework } = useData()
  const sessionStore = getSessionStore(currentSession)
  
  // Sync profile from global students list
  const profile = students.find(s => s.id === user?.id) || user || {}
  
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  // Calculate real stats from global sync engine
  const studentLogs = globalAttendance.filter(l => l.data && l.data[profile.id])
  const presentDays = studentLogs.filter(l => l.data[profile.id] === 'Present' || l.data[profile.id] === 'Late').length
  const absentDays = studentLogs.filter(l => l.data[profile.id] === 'Absent').length
  const lateDays = studentLogs.filter(l => l.data[profile.id] === 'Late').length
  const totalDays = studentLogs.length || 1
  const attPct = Math.round((presentDays / totalDays) * 100)

  const feeData = JSON.parse(localStorage.getItem(feeKey(currentSession)) || '{}')
  const studentFees = feeData[profile.id] || { total: 40000, paid: 0, discount: 0, remaining: 40000, history: [] }
  const totalFeesPaid = studentFees.paid
  const pendingHW = globalHomework.filter(h => (h.class === profile.class || h.class === `${profile.class}-${profile.section}`) && (h.status === 'Pending' || h.status === 'Overdue')).length

  const stats = [
    { icon: <FiClock />, label: 'Attendance', value: `${attPct}%`, sub: `${presentDays}/${totalDays} days`, bg: attPct >= 90 ? 'var(--accent-50)' : 'var(--gold-50)', color: attPct >= 90 ? 'var(--accent-500)' : 'var(--gold-600)' },
    { icon: <FiAward />, label: 'Last Exam Score', value: '82%', sub: 'Half Yearly', bg: 'var(--primary-50)', color: 'var(--primary-500)' },
    { icon: <FiBook />, label: 'Pending Homework', value: pendingHW, sub: 'Assignments due', bg: pendingHW > 0 ? 'var(--gold-50)' : 'var(--accent-50)', color: pendingHW > 0 ? 'var(--gold-600)' : 'var(--accent-500)' },
    { icon: <FiDollarSign />, label: 'Fees Paid', value: `₹${(totalFeesPaid / 1000).toFixed(0)}K`, sub: 'This session', bg: '#f3e8ff', color: '#8b5cf6' },
  ]

  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const timetable = sessionStore.timetable || MOCK_DATA.timetable
  const todayTT = timetable[dayName] || timetable['Monday'] || []

  return (
    <>
      <div className="dash-page-header">
        <div className="dash-page-title">Hello, {profile?.name?.split(' ')[0]}! 👋</div>
        <div className="dash-page-subtitle">{profile?.class}-{profile?.section || 'A'} | Roll No. {profile?.rollNo || 'N/A'} | {today}</div>
      </div>

      <div className="dash-stat-grid">
        {stats.map((s, i) => (
          <div key={i} className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div>
              <div className="dash-stat-value">{s.value}</div>
              <div className="dash-stat-label">{s.label}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)', marginTop: 2 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-widget-row">
        {/* Today's Timetable */}
        <div className="dash-widget">
          <div className="dash-widget-header">
            <span className="dash-widget-title"><FiCalendar /> Today's Timetable ({dayName})</span>
          </div>
          <div className="dash-widget-body" style={{ padding: 0 }}>
            {todayTT.map((sub, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--gray-50)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--primary-600)' }}>
                  P{i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--gray-700)' }}>{sub}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>{MOCK_DATA.periods[i]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Calendar */}
        <div className="dash-widget">
          <div className="dash-widget-header">
            <span className="dash-widget-title"><FiClock /> Attendance - April 2026</span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: attPct >= 90 ? 'var(--accent-600)' : 'var(--gold-600)' }}>{attPct}%</span>
          </div>
          <div className="dash-widget-body">
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              {[
                { label: 'Present', count: presentDays, color: 'var(--accent-500)' },
                { label: 'Absent', count: absentDays, color: 'var(--error)' },
                { label: 'Late', count: lateDays, color: 'var(--gold-500)' },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center', padding: 'var(--space-2)', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: s.color }}>{s.count}</div>
                  <div style={{ fontSize: '10px', color: 'var(--gray-500)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="att-grid">
              {MOCK_DATA.attendanceLog.map((a, i) => {
                const day = new Date(a.date).getDate()
                return (
                  <div key={i} className={`att-cell ${a.status.toLowerCase()}`} title={`${a.date}: ${a.status}`}>
                    {day}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="dash-widget-row">
        {/* Homework */}
        <div className="dash-widget">
          <div className="dash-widget-header">
            <span className="dash-widget-title"><FiBook /> My Homework</span>
          </div>
          <div className="dash-widget-body" style={{ padding: 0 }}>
            {MOCK_DATA.homework.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--gray-50)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: h.status === 'Graded' ? 'var(--accent-50)' : h.status === 'Submitted' ? 'var(--primary-50)' : h.status === 'Overdue' ? '#fef2f2' : 'var(--gold-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: h.status === 'Graded' ? 'var(--accent-600)' : h.status === 'Submitted' ? 'var(--primary-600)' : h.status === 'Overdue' ? 'var(--error)' : 'var(--gold-600)' }}>
                  {h.status === 'Graded' ? <FiCheckCircle /> : h.status === 'Overdue' ? <FiAlertCircle /> : <FiBook />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--gray-700)' }}>{h.title}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>{h.subject} | Due: {h.due}</div>
                </div>
                <span className={`badge ${h.status === 'Graded' ? 'badge-success' : h.status === 'Submitted' ? 'badge-info' : h.status === 'Overdue' ? 'badge-error' : 'badge-warning'}`}>
                  {h.status}{h.grade ? ` (${h.grade})` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="dash-widget">
          <div className="dash-widget-header">
            <span className="dash-widget-title"><FiAward /> Recent Exam Results</span>
            <Link to="/erp/exams" className="btn btn-sm btn-secondary" style={{ padding: '2px 8px', fontSize: 11 }}>View All</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr><th>Subject</th><th>Marks</th><th>Grade</th></tr>
              </thead>
              <tbody>
                {(sessionStore.results?.[user?.id]?.['SA1 (Half Yearly)'] || MOCK_DATA.studentResults[user?.id]?.['SA1 (Half Yearly)'] || []).map((r, i) => {
                  const pct = Math.round((r.marks / r.max) * 100)
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{r.subject}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontWeight: 700, color: pct >= 40 ? 'var(--accent-600)' : 'var(--error)' }}>{r.marks}/{r.max}</span>
                          <div style={{ width: 40, height: 4, background: 'var(--gray-100)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: pct >= 80 ? 'var(--accent-500)' : 'var(--gold-500)' }} />
                          </div>
                        </div>
                      </td>
                      <td><span className={`badge ${pct >= 40 ? 'badge-success' : 'badge-error'}`}>{pct >= 90 ? 'A1' : pct >= 80 ? 'A2' : pct >= 70 ? 'B1' : 'B2'}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="dash-widget" style={{ marginTop: 'var(--space-5)' }}>
        <div className="dash-widget-header">
          <span className="dash-widget-title"><FiMessageCircle /> Recent Messages</span>
        </div>
        <div className="dash-widget-body" style={{ padding: 0 }}>
          {MOCK_DATA.messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--gray-50)', cursor: 'pointer', background: m.read ? 'transparent' : 'var(--primary-50)', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
              onMouseLeave={e => e.currentTarget.style.background = m.read ? 'transparent' : 'var(--primary-50)'}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--primary-600)', flexShrink: 0 }}>
                {m.from.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-800)' }}>{m.from}</strong>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>{m.time}</span>
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--gray-700)', marginTop: 1 }}>{m.subject}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.preview}</div>
              </div>
              {!m.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary-500)', flexShrink: 0, marginTop: 6 }} />}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
