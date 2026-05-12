import { useState, useMemo, useEffect } from 'react'
import { useAuth, MOCK_DATA } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { 
  FiClock, FiCalendar, FiUsers, FiTrendingUp, FiCheckCircle, 
  FiXCircle, FiAlertCircle, FiRefreshCw, FiDownload, 
  FiSearch, FiFilter, FiUserCheck, FiUserX, FiActivity, FiChevronLeft, FiChevronRight, FiFileText, FiX
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

// Helper: Convert 24h string (13:30) to 12h string (01:30 PM)
const to12h = (t24) => {
  if (!t24 || t24 === '--') return '--'
  if (t24.includes('AM') || t24.includes('PM')) return t24 // Already 12h
  const [h, m] = t24.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12 = hour % 12 || 12
  return `${String(h12).padStart(2, '0')}:${m} ${ampm}`
}

// Helper: Convert 12h string (01:30 PM) to 24h string (13:30) for <input type="time">
const to24h = (t12) => {
  if (!t12 || t12 === '--') return ''
  const parts = t12.split(' ')
  if (parts.length < 2) return t12 // Already 24h or invalid
  const [time, ampm] = parts
  let [h, m] = time.split(':')
  let hour = parseInt(h)
  if (ampm === 'PM' && hour < 12) hour += 12
  if (ampm === 'AM' && hour === 12) hour = 0
  return `${String(hour).padStart(2, '0')}:${m}`
}

export default function StaffAttendancePage() {
  const { user } = useAuth()
  const { staff = MOCK_DATA.staff } = useData() || {}
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [search, setSearch] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [viewingReport, setViewingReport] = useState(null) // Staff object for monthly report
  const [reportMonth, setReportMonth] = useState(new Date())

  // Simulated Biometric Logs for the selected date
  const [biometricLogs, setBiometricLogs] = useState(() => {
    const saved = localStorage.getItem(`nms_biometric_${selectedDate}`)
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    const saved = localStorage.getItem(`nms_biometric_${selectedDate}`)
    setBiometricLogs(saved ? JSON.parse(saved) : {})
  }, [selectedDate])

  const filteredStaff = useMemo(() => {
    return staff.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
      return matchesSearch
    })
  }, [staff, search])

  const handleManualMark = (staffId, status) => {
    const newLogs = { ...biometricLogs }
    const current = newLogs[staffId] || { checkIn: '08:30 AM', checkOut: '03:30 PM' }
    
    newLogs[staffId] = {
      ...current,
      status: status,
      checkIn: status === 'Absent' ? '--' : (current.checkIn === '--' ? '08:30 AM' : current.checkIn),
      checkOut: status === 'Absent' ? '--' : (current.checkOut === '--' ? '03:30 PM' : current.checkOut)
    }
    
    setBiometricLogs(newLogs)
    localStorage.setItem(`nms_biometric_${selectedDate}`, JSON.stringify(newLogs))
  }

  const handleTimeChange = (staffId, field, value) => {
    const newLogs = { ...biometricLogs }
    const current = newLogs[staffId] || { status: 'Present', checkIn: '08:30 AM', checkOut: '03:30 PM' }
    
    newLogs[staffId] = { ...current, [field]: value }
    setBiometricLogs(newLogs)
    localStorage.setItem(`nms_biometric_${selectedDate}`, JSON.stringify(newLogs))
  }

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      const newLogs = { ...biometricLogs }
      staff.forEach(s => {
        const isAbsent = Math.random() < 0.05
        if (isAbsent) {
          newLogs[s.id] = { status: 'Absent', checkIn: '--', checkOut: '--' }
        } else {
          const checkInHour = 8 + Math.floor(Math.random() * 2)
          const checkInMin = Math.floor(Math.random() * 60)
          const checkOutHour = 15 + Math.floor(Math.random() * 3)
          const checkOutMin = Math.floor(Math.random() * 60)
          const isLate = checkInHour > 9 || (checkInHour === 9 && checkInMin > 15)
          
          newLogs[s.id] = {
            status: isLate ? 'Late' : 'Present',
            checkIn: `${String(checkInHour).padStart(2, '0')}:${String(checkInMin).padStart(2, '0')} AM`,
            checkOut: `${String(checkOutHour - 12).padStart(2, '0')}:${String(checkOutMin).padStart(2, '0')} PM`
          }
        }
      })
      setBiometricLogs(newLogs)
      localStorage.setItem(`nms_biometric_${selectedDate}`, JSON.stringify(newLogs))
      setIsSyncing(false)
    }, 1500)
  }

  const stats = useMemo(() => {
    const total = staff.length
    const present = Object.values(biometricLogs).filter(l => l.status === 'Present' || l.status === 'Late').length
    const absent = total - present
    const late = Object.values(biometricLogs).filter(l => l.status === 'Late').length
    return { total, present, absent, late }
  }, [staff, biometricLogs])

  // Monthly Report Logic (Real-time)
  const monthData = useMemo(() => {
    if (!viewingReport) return []
    const daysInMonth = new Date(reportMonth.getFullYear(), reportMonth.getMonth() + 1, 0).getDate()
    const data = []
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(reportMonth.getFullYear(), reportMonth.getMonth(), i)
      // Use local date string to match keys
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      const dateStr = `${y}-${m}-${d}`
      const isWeekend = date.getDay() === 0 // Sunday
      
      // 1. Try to load actual log from database/localStorage
      const saved = localStorage.getItem(`nms_biometric_${dateStr}`)
      const logs = saved ? JSON.parse(saved) : {}
      const log = logs[viewingReport.id]

      if (log) {
        data.push({ 
          date: dateStr, 
          day: i, 
          status: log.status, 
          checkIn: log.checkIn,
          checkOut: log.checkOut
        })
      } else {
        // 2. Fallback to mock data for dates that don't have records yet
        const seed = viewingReport.id.charCodeAt(0) + i + reportMonth.getMonth()
        const rand = (Math.sin(seed) * 10000) % 1
        
        let status = 'Pending'
        if (isWeekend) status = 'Holiday'
        // Only show mock "Past" data, not future
        else if (date <= new Date()) {
          if (rand < 0.1) status = 'Absent'
          else if (rand < 0.2) status = 'Late'
          else status = 'Present'
        }

        data.push({ 
          date: dateStr, 
          day: i, 
          status, 
          checkIn: status === 'Absent' || status === 'Holiday' || status === 'Pending' ? '--' : '08:15 AM',
          checkOut: status === 'Absent' || status === 'Holiday' || status === 'Pending' ? '--' : '03:30 PM'
        })
      }
    }
    return data
  }, [viewingReport, reportMonth, biometricLogs, selectedDate])

  const monthSummary = useMemo(() => {
    const counts = { Present: 0, Absent: 0, Late: 0, Holiday: 0 }
    monthData.forEach(d => counts[d.status]++)
    return counts
  }, [monthData])

  return (
    <div className="staff-attendance-page">
      <div className="dash-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 15 }}>
          <div>
            <div className="dash-page-title"><FiActivity style={{ display: 'inline', marginRight: 8 }} />Staff Attendance Management</div>
            <div className="dash-page-subtitle">Manage staff attendance logs and generate monthly reports</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className={`btn ${isSyncing ? 'btn-secondary' : 'btn-primary'}`} onClick={handleSync} disabled={isSyncing}>
              <FiRefreshCw className={isSyncing ? 'animate-spin' : ''} /> {isSyncing ? 'Syncing...' : 'Auto-Fill (Biometric)'}
            </button>
            <button className="btn btn-secondary">
              <FiDownload /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Today's KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 30 }}>
        {[
          { label: 'Total Staff', val: stats.total, color: 'var(--primary-500)' },
          { label: 'Present Today', val: stats.present, color: 'var(--success)' },
          { label: 'Late Entries', val: stats.late, color: 'var(--warning)' },
          { label: 'Absent Today', val: stats.absent, color: 'var(--error)' }
        ].map((s, i) => (
          <div key={i} className="dash-widget" style={{ padding: '20px', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ color: 'var(--gray-400)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--gray-800)', marginTop: 5 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div style={{ display: 'grid', gridTemplateColumns: viewingReport ? '1fr 400px' : '1fr', gap: 25 }}>
        
        {/* Left Side: Staff List */}
        <div className="dash-widget" style={{ padding: 0 }}>
          <div className="dash-widget-header" style={{ display: 'flex', justifyContent: 'space-between', gap: 15, flexWrap: 'wrap' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--gray-50)', padding: '8px 15px', borderRadius: 10, flex: 1 }}>
                <FiSearch color="var(--gray-400)" />
                <input type="text" placeholder="Search staff..." className="form-input" style={{ border: 'none', background: 'transparent', padding: 0 }} value={search} onChange={e => setSearch(e.target.value)} />
             </div>
             <div style={{ display: 'flex', gap: 8 }}>
                <input type="date" className="form-input" style={{ width: 140 }} value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
             </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Type / Dept</th>
                  <th style={{ textAlign: 'center' }}>Punch In</th>
                  <th style={{ textAlign: 'center' }}>Punch Out</th>
                  <th style={{ textAlign: 'center' }}>Manual Mark</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map(s => {
                  const log = biometricLogs[s.id] || { status: 'Pending', checkIn: '--', checkOut: '--' }
                  return (
                    <tr key={s.id} style={{ background: viewingReport?.id === s.id ? 'var(--primary-50)' : 'transparent' }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{s.name[0]}</div>
                          <div>
                            <div style={{ fontWeight: 700 }}>{s.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{s.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{s.type}</div>
                        <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>{s.dept}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input type="time" className="form-input" style={{ width: 100, fontSize: 11, textAlign: 'center', padding: '4px' }} 
                          value={to24h(log.checkIn)} 
                          onChange={e => handleTimeChange(s.id, 'checkIn', to12h(e.target.value))} 
                          disabled={log.status === 'Absent'} />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <input type="time" className="form-input" style={{ width: 100, fontSize: 11, textAlign: 'center', padding: '4px' }} 
                          value={to24h(log.checkOut)} 
                          onChange={e => handleTimeChange(s.id, 'checkOut', to12h(e.target.value))} 
                          disabled={log.status === 'Absent'} />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                           <button onClick={() => handleManualMark(s.id, 'Present')} title="Present"
                             style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', background: log.status === 'Present' ? 'var(--success)' : 'var(--gray-100)', color: log.status === 'Present' ? 'white' : 'var(--gray-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <FiUserCheck size={14} />
                           </button>
                           <button onClick={() => handleManualMark(s.id, 'Late')} title="Late"
                             style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', background: log.status === 'Late' ? 'var(--warning)' : 'var(--gray-100)', color: log.status === 'Late' ? 'white' : 'var(--gray-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <FiClock size={14} />
                           </button>
                           <button onClick={() => handleManualMark(s.id, 'Absent')} title="Absent"
                             style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', background: log.status === 'Absent' ? 'var(--error)' : 'var(--gray-100)', color: log.status === 'Absent' ? 'white' : 'var(--gray-400)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <FiUserX size={14} />
                           </button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="btn btn-sm btn-secondary" onClick={() => setViewingReport(s)}>
                          <FiFileText /> Report
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Monthly Report Side-Pane */}
        <AnimatePresence>
          {viewingReport && (
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="dash-widget" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}
            >
              <div className="dash-widget-header" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--gray-100)' }}>
                <span className="dash-widget-title"><FiCalendar /> Monthly View</span>
                <button className="dash-sidebar-close" onClick={() => setViewingReport(null)} style={{ position: 'static' }}><FiX /></button>
              </div>
              
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900 }}>{viewingReport.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{viewingReport.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{viewingReport.id} | {viewingReport.designation}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, background: 'var(--gray-50)', padding: 10, borderRadius: 12 }}>
                  <button className="btn btn-sm btn-secondary" onClick={() => setReportMonth(new Date(reportMonth.getFullYear(), reportMonth.getMonth() - 1))}><FiChevronLeft /></button>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{reportMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
                  <button className="btn btn-sm btn-secondary" onClick={() => setReportMonth(new Date(reportMonth.getFullYear(), reportMonth.getMonth() + 1))}><FiChevronRight /></button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 25 }}>
                   <div style={{ textAlign: 'center', padding: 12, background: 'var(--success-50)', borderRadius: 10 }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--success)' }}>{monthSummary.Present}</div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>Present</div>
                   </div>
                   <div style={{ textAlign: 'center', padding: 12, background: 'var(--error-50)', borderRadius: 10 }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--error)' }}>{monthSummary.Absent}</div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>Absent</div>
                   </div>
                    <div style={{ textAlign: 'center', padding: 12, background: 'var(--warning-50)', borderRadius: 10 }}>
                       <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--warning)' }}>{monthSummary.Late}</div>
                       <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>Late</div>
                    </div>
                 </div>
 
                 <div style={{ maxHeight: 400, overflowY: 'auto', paddingRight: 5, scrollbarWidth: 'thin' }}>
                  <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FiClock /> Detailed Attendance History
                  </h4>
                  {monthData.map((d, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', borderRadius: 10, background: 'white', border: '1px solid var(--gray-50)', marginBottom: 6 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{d.day} {reportMonth.toLocaleString('default', { month: 'short' })}</div>
                        <div style={{ fontSize: 10, color: 'var(--gray-400)', display: 'flex', gap: 10 }}>
                          <span>In: {d.checkIn}</span>
                          <span>Out: {d.checkOut}</span>
                        </div>
                      </div>
                      <span className={`badge ${
                        d.status === 'Present' ? 'badge-success' : 
                        d.status === 'Late' ? 'badge-warning' : 
                        d.status === 'Absent' ? 'badge-error' : 'badge-secondary'
                      }`} style={{ fontSize: 9 }}>{d.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <style>{`
        .staff-attendance-page .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .staff-attendance-page .table tr { height: 60px; }
        .staff-attendance-page .dash-widget { overflow: hidden; }
      `}</style>
    </div>
  )
}
