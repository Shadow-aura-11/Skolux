import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, MOCK_DATA, getTotalPastDues } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import {
  FiUsers, FiDollarSign, FiCheckCircle, FiClock, FiTruck,
  FiBookOpen, FiBarChart2, FiTrendingUp, FiTrendingDown,
  FiAlertCircle, FiCalendar, FiArrowRight, FiEye,
  FiUserPlus, FiFileText, FiBell, FiPlusCircle, FiMonitor, FiAlertTriangle, FiDownload, FiRefreshCw
} from 'react-icons/fi'
import { exportToCSV } from '../../utils/exportUtils'

export default function AdminDashboard() {
  const { user, currentSession, updateSession, sessions, school } = useAuth()
  const prefix = `/${school?.key || 'nms'}/erp`
  const { 
    students = [], attendance = [], notices = [], feeStats = { collected: 0, pending: 0, overdue: 0 }, 
    generalExpenses = [], updateExpenses,
    fleetLogs = [], updateFleetLogs,
    refreshData 
  } = useData() || {}
  
  const [refreshing, setRefreshing] = useState(false)
  const [expenseModal, setExpenseModal] = useState(false)
  const [transportModal, setTransportModal] = useState(false)
  const [newExpense, setNewExpense] = useState({ date: new Date().toISOString().split('T')[0], category: 'Other Activities', amount: '', description: '' })
  const [newTransportLog, setNewTransportLog] = useState({ date: new Date().toISOString().split('T')[0], vehicleNo: '', driver: '', startKm: '', endKm: '', fuelLiters: '', fuelCost: '', maintCost: '', remarks: '', logType: 'Fuel' })

  const pastDues = getTotalPastDues(currentSession, sessions, students)
  const todayDate = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const todayKey = new Date().getFullYear() + "-" + String(new Date().getMonth() + 1).padStart(2, '0') + "-" + String(new Date().getDate()).padStart(2, '0')

  // Calculate Today's Attendance Pct
  const todayLogs = (attendance || []).filter(l => l.date === todayKey)
  let attendancePct = 0
  if (todayLogs.length > 0) {
    let totalPresent = 0
    let totalChecked = 0
    todayLogs.forEach(l => {
      const vals = Object.values(l.data || {})
      totalChecked += vals.length
      totalPresent += vals.filter(v => v === 'Present' || v === 'Late').length
    })
    if (totalChecked > 0) attendancePct = Math.round((totalPresent / totalChecked) * 100)
  }

  // Financial Calculations
  const totalFuelCost = (generalExpenses || []).filter(e => e.category === 'Transport/Fuel').reduce((sum, exp) => sum + Number(exp?.amount || 0), 0)
  const totalMaintCost = (generalExpenses || []).filter(e => e.category === 'Vehicle Maintenance').reduce((sum, exp) => sum + Number(exp?.amount || 0), 0)
  const totalOtherExpenses = (generalExpenses || []).filter(e => e.category !== 'Transport/Fuel' && e.category !== 'Vehicle Maintenance').reduce((sum, exp) => sum + Number(exp?.amount || 0), 0)
  
  const totalExpenses = totalFuelCost + totalMaintCost + totalOtherExpenses
  const netBalance = (feeStats?.collected || 0) - totalExpenses

  const handleAddExpense = (e) => {
    e.preventDefault()
    const exp = { ...newExpense, id: Date.now(), amount: Number(newExpense.amount) }
    const updated = [exp, ...generalExpenses]
    updateExpenses(updated)
    setExpenseModal(false)
    setNewExpense({ date: new Date().toISOString().split('T')[0], category: 'Other Activities', amount: '', description: '' })
    refreshData()
  }

  const handleAddTransportLog = (e) => {
    e.preventDefault()
    const dist = (newTransportLog.logType === 'Fuel' || newTransportLog.logType === 'Both') ? Number(newTransportLog.endKm) - Number(newTransportLog.startKm) : 0
    const fuelVal = Number(newTransportLog.fuelCost || 0)
    const maintVal = Number(newTransportLog.maintCost || 0)

    const log = { 
      ...newTransportLog, 
      id: Date.now(), 
      distance: dist,
      mileage: (newTransportLog.fuelLiters && dist > 0) ? (dist / Number(newTransportLog.fuelLiters)).toFixed(2) : 0
    }
    
    // Update Fleet Logs
    updateFleetLogs([log, ...fleetLogs])

    // Update Expenses
    const newExpenses = [...generalExpenses]
    if (fuelVal > 0) {
      newExpenses.push({
        id: `EXP-FUEL-${Date.now()}`,
        date: newTransportLog.date,
        category: 'Transport/Fuel',
        title: `Fuel: ${newTransportLog.vehicleNo}`,
        amount: fuelVal,
        status: 'Paid',
        mode: 'Cash',
        remarks: `Refill ${newTransportLog.fuelLiters}L for ${newTransportLog.vehicleNo}`
      })
    }
    if (maintVal > 0) {
      newExpenses.push({
        id: `EXP-MAINT-${Date.now()}`,
        date: newTransportLog.date,
        category: 'Vehicle Maintenance',
        title: `Maint: ${newTransportLog.vehicleNo}`,
        amount: maintVal,
        status: 'Paid',
        mode: 'Cash',
        remarks: newTransportLog.remarks || `Maintenance/Service for ${newTransportLog.vehicleNo}`
      })
    }
    
    if (fuelVal > 0 || maintVal > 0) {
      updateExpenses(newExpenses)
    }

    setTransportModal(false)
    setNewTransportLog({ date: new Date().toISOString().split('T')[0], vehicleNo: '', driver: '', startKm: '', endKm: '', fuelLiters: '', fuelCost: '', maintCost: '', remarks: '', logType: 'Fuel' })
    refreshData()
  }

  const handleManualRefresh = () => {
    setRefreshing(true)
    refreshData()
    // Simulated delay for UX
    setTimeout(() => setRefreshing(false), 800)
  }

  const stats = [
    { icon: <FiUsers />, label: 'Total Students', value: (students?.length || 0).toLocaleString(), change: '+12 this month', up: true, bg: 'var(--primary-50)', color: 'var(--primary-500)' },
    { icon: <FiCheckCircle />, label: 'Today Attendance', value: attendancePct > 0 ? `${attendancePct}%` : 'N/A', change: attendancePct > 90 ? 'Excellent' : 'Pending', up: attendancePct > 90, bg: 'var(--accent-50)', color: 'var(--accent-500)' },
    { icon: <FiDollarSign />, label: `Fee Collected (${new Date().toLocaleString('default', { month: 'short' })})`, value: `₹${((feeStats?.collected || 0) / 100000).toFixed(1)}L`, change: `₹${((feeStats?.pending || 0) / 100000).toFixed(1)}L pending`, up: (feeStats?.collected || 0) > (feeStats?.pending || 0), bg: 'var(--gold-50)', color: 'var(--gold-600)' },
    { icon: <FiAlertTriangle />, label: 'Prev. Session Dues', value: `₹${((pastDues || 0) / 100000).toFixed(2)}L`, change: 'Carry forward', up: false, bg: '#fff1f2', color: 'var(--error)' },
  ]

  // Filter notices for current session if they have metadata, or just show all if generic
  const displayNotices = notices && notices.length > 0 ? notices : MOCK_DATA.notices

  return (
    <>
      <div className="dash-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="dash-page-title">Welcome back, {user?.name?.split(' ')[0]}!</div>
          <div className="dash-page-subtitle">{todayDate}</div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <div style={{ marginRight: 15, display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '6px 12px', borderRadius: 10, border: '1px solid var(--gray-200)' }}>
            <FiCalendar style={{ color: 'var(--primary-500)' }} />
            <select 
              value={currentSession} 
              onChange={(e) => updateSession(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', cursor: 'pointer', outline: 'none' }}
            >
              {sessions.map(s => (
                <option key={s} value={s}>Session {s}</option>
              ))}
            </select>
          </div>
          <button onClick={handleManualRefresh} className={`btn btn-secondary btn-sm ${refreshing ? 'spinning' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiRefreshCw style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} /> 
            {refreshing ? 'Refreshing...' : 'Refresh Dashboard'}
          </button>
          <Link to={`${prefix}/students`} className="btn btn-primary btn-sm"><FiUserPlus /> Add Student</Link>
          <Link to={`${prefix}/notices`} className="btn btn-secondary btn-sm"><FiBell /> New Notice</Link>
        </div>
      </div>
      
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Stat Cards */}
      <div className="dash-stat-grid">
        {stats.map((s, i) => (
          <div key={i} className="dash-stat-card">
            <div className="dash-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div>
              <div className="dash-stat-value">{s.value}</div>
              <div className="dash-stat-label">{s.label}</div>
              <div className={`dash-stat-change ${s.up ? 'up' : 'down'}`}>
                {s.up ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />} {s.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dash-quick-actions">
        <Link to={`${prefix}/attendance`} className="dash-quick-btn"><FiClock /> View Attendance</Link>
        <Link to={`${prefix}/fees`} className="dash-quick-btn"><FiDollarSign /> Fee Reports</Link>
        <Link to={`${prefix}/exams`} className="dash-quick-btn"><FiFileText /> Exam Results</Link>
        <Link to={`${prefix}/transport`} className="dash-quick-btn"><FiTruck /> Transport</Link>
        <Link to={`${prefix}/students`} className="dash-quick-btn"><FiUsers /> All Students</Link>
        <Link to={`/${school?.key}`} className="dash-quick-btn" style={{ background: 'var(--primary-50)', color: 'var(--primary-600)', borderColor: 'var(--primary-200)' }}><FiMonitor /> Website CMS</Link>
      </div>

      <div className="dash-widget-row">
        {/* Recent Transport Logs */}
        <div className="dash-widget">
          <div className="dash-widget-header">
            <span className="dash-widget-title"><FiTruck /> Recent Transport Logs</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-sm btn-secondary" onClick={() => setTransportModal(true)}><FiPlusCircle /> Add Log</button>
              <button className="btn btn-sm btn-secondary" style={{ width: 32, padding: 0 }} onClick={() => exportToCSV(fleetLogs, `Transport_Logs_${currentSession}.csv`)} title="Download Logs"><FiDownload /></button>
              <Link to={`${prefix}/transport`} style={{ marginLeft: 8, fontSize: 'var(--text-sm)', color: 'var(--primary-500)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                View All <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div className="dash-widget-body" style={{ padding: 0 }}>
            {fleetLogs.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--gray-400)', fontSize: 13 }}>No transport logs recorded for this session.</div>
            ) : (
              fleetLogs.slice(0, 5).map((log, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--gray-50)', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary-500)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--gray-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.vehicleNo || log.bus} ({log.driver})</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>
                      {log.date} | {log.distance} km | 
                      {log.fuelCost > 0 && <span style={{ color: 'var(--error)' }}> ₹{log.fuelCost} Fuel</span>}
                      {log.maintCost > 0 && <span style={{ color: '#ea580c' }}> ₹{log.maintCost} Maint</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="dash-widget">
          <div className="dash-widget-header">
            <span className="dash-widget-title"><FiDollarSign /> Financial Summary</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-sm btn-secondary" onClick={() => setExpenseModal(true)}><FiPlusCircle /> Add Expense</button>
              <button className="btn btn-sm btn-secondary" style={{ width: 32, padding: 0 }} onClick={() => exportToCSV(generalExpenses, `Expenses_${currentSession}.csv`)} title="Download Expenses"><FiDownload /></button>
            </div>
          </div>
          <div className="dash-widget-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: 1 }}>Net Balance</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: netBalance >= 0 ? 'var(--accent-600)' : 'var(--error)' }}>₹{netBalance.toLocaleString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: 1 }}>Total Collected</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary-600)' }}>₹{feeStats.collected.toLocaleString()}</div>
              </div>
            </div>
            
            <div style={{ borderTop: '1px dashed var(--gray-200)', margin: '15px 0' }}></div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
              <div style={{ padding: 'var(--space-2)', background: '#fff1f2', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--error)' }}>₹{totalFuelCost.toLocaleString()}</div>
                <div style={{ fontSize: '10px', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 4 }}><FiTruck /> Fuel</div>
              </div>
              <div style={{ padding: 'var(--space-2)', background: '#fff7ed', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: '#ea580c' }}>₹{totalMaintCost.toLocaleString()}</div>
                <div style={{ fontSize: '10px', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 4 }}><FiPlusCircle /> Maint</div>
              </div>
              <div style={{ padding: 'var(--space-2)', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--gray-700)' }}>₹{totalOtherExpenses.toLocaleString()}</div>
                <div style={{ fontSize: '10px', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 4 }}><FiDollarSign /> Other</div>
              </div>
            </div>

            <div style={{ marginTop: 15, fontSize: 11, color: 'var(--gray-400)', textAlign: 'center' }}>
              Pending Fees: ₹{feeStats.pending.toLocaleString()} | Overdue: ₹{feeStats.overdue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="dash-widget-row">
        {/* Today's Attendance Summary */}
        <div className="dash-widget">
          <div className="dash-widget-header">
            <span className="dash-widget-title"><FiClock /> Attendance Summary (Today)</span>
          </div>
          <div className="dash-widget-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-3)' }}>
              {/* Dynamic attendance summary would go here based on real data */}
              {(attendance || []).length === 0 ? (
                <div style={{ gridColumn: 'span 5', padding: '20px', textAlign: 'center', color: 'var(--gray-400)', fontSize: 12 }}>
                  No attendance data for today.
                </div>
              ) : (
                // Logic to group attendance by class and show percentages
                <div style={{ gridColumn: 'span 5', padding: '20px', textAlign: 'center', color: 'var(--gray-400)', fontSize: 12 }}>
                  Attendance tracking active. View details in reports.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Staff Today */}
        <div className="dash-widget">
          <div className="dash-widget-header">
            <span className="dash-widget-title"><FiUsers /> Staff Status</span>
            <Link to={`${prefix}/staff`} style={{ fontSize: 'var(--text-sm)', color: 'var(--primary-500)', fontWeight: 600 }}>View All</Link>
          </div>
          <div className="dash-widget-body" style={{ padding: 0 }}>
            {MOCK_DATA.staff.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-5)', borderBottom: '1px solid var(--gray-50)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: s.status === 'Present' ? 'var(--accent-100)' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: s.status === 'Present' ? 'var(--accent-700)' : 'var(--error)' }}>
                  {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--gray-700)' }}>{s.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>{s.dept} | {s.designation}</div>
                </div>
                <span className={`badge ${s.status === 'Present' ? 'badge-success' : 'badge-error'}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="dash-widget" style={{ marginTop: 'var(--space-5)' }}>
        <div className="dash-widget-header">
          <span className="dash-widget-title"><FiUsers /> Recent Students</span>
          <Link to={`${prefix}/students`} style={{ fontSize: 'var(--text-sm)', color: 'var(--primary-500)', fontWeight: 600 }}>View All Students</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Class</th><th>Roll No</th><th>Attendance</th><th>Fee Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {students.slice(0, 5).map((s, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, fontSize: 'var(--text-xs)' }}>{s.id}</td>
                  <td><strong>{s.name}</strong></td>
                  <td><span className="badge badge-info">{s.class}-{s.section || 'A'}</span></td>
                  <td>{s.rollNo}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 60, height: 6, background: 'var(--gray-100)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${s.attendance}%`, height: '100%', background: s.attendance >= 90 ? 'var(--accent-500)' : s.attendance >= 80 ? 'var(--gold-500)' : 'var(--error)', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: s.attendance >= 90 ? 'var(--accent-600)' : s.attendance >= 80 ? 'var(--gold-600)' : 'var(--error)' }}>{s.attendance}%</span>
                    </div>
                  </td>
                  <td><span className={`badge ${s.feeStatus === 'Paid' ? 'badge-success' : s.feeStatus === 'Partial' ? 'badge-warning' : 'badge-error'}`}>{s.feeStatus}</span></td>
                  <td>
                    <Link to={`${prefix}/students?id=${s.id}`} className="btn btn-sm btn-secondary" style={{ padding: '4px 10px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <FiEye size={12} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Add Expense Modal */}
      {expenseModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setExpenseModal(false)}>
          <form style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()} onSubmit={handleAddExpense}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 'var(--text-xl)' }}>Record New Expense</h3>
              <button type="button" onClick={() => setExpenseModal(false)}>x</button>
            </div>
            
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" required value={newExpense.date} onChange={e => setNewExpense({ ...newExpense, date: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" required value={newExpense.category} onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}>
                <option value="Other Activities">Other Activities</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Events">School Events</option>
                <option value="Staff Refreshments">Staff Refreshments</option>
                <option value="Misc">Miscellaneous</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input type="number" required min="1" className="form-input" value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Description / Remarks</label>
              <input type="text" required className="form-input" placeholder="e.g. Science Fair Setup..." value={newExpense.description} onChange={e => setNewExpense({ ...newExpense, description: e.target.value })} />
            </div>
            
            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: 15 }}>Save Expense</button>
          </form>
        </div>
      )}
      {/* Add Transport Log Modal */}
      {transportModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setTransportModal(false)}>
          <form style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()} onSubmit={handleAddTransportLog}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 'var(--text-xl)' }}>Record Transport Log</h3>
              <button type="button" onClick={() => setTransportModal(false)}><FiX /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" required value={newTransportLog.date} onChange={e => setNewTransportLog({ ...newTransportLog, date: e.target.value })} /></div>
              <div className="form-group">
                <label className="form-label">Vehicle No.</label>
                <input type="text" className="form-input" required placeholder="DL-01..." value={newTransportLog.vehicleNo} onChange={e => setNewTransportLog({ ...newTransportLog, vehicleNo: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Log Type</label>
              <div style={{ display: 'flex', gap: 10, background: 'var(--gray-50)', padding: 4, borderRadius: 10 }}>
                {['Fuel', 'Maintenance', 'Both'].map(t => (
                  <button key={t} type="button" className={`btn btn-sm ${newTransportLog.logType === t ? 'btn-primary' : ''}`} 
                    style={{ flex: 1, background: newTransportLog.logType === t ? 'var(--primary-600)' : 'transparent', color: newTransportLog.logType === t ? 'white' : 'var(--gray-500)', border: 'none' }}
                    onClick={() => setNewTransportLog({ ...newTransportLog, logType: t })}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Driver Name</label>
              <input className="form-input" required placeholder="Type driver name" value={newTransportLog.driver} onChange={e => setNewTransportLog({ ...newTransportLog, driver: e.target.value })} />
            </div>
            
            {(newTransportLog.logType === 'Fuel' || newTransportLog.logType === 'Both') && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group"><label className="form-label">Start Reading (km)</label><input type="number" required className="form-input" value={newTransportLog.startKm} onChange={e => setNewTransportLog({ ...newTransportLog, startKm: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">End Reading (km)</label><input type="number" required className="form-input" value={newTransportLog.endKm} onChange={e => setNewTransportLog({ ...newTransportLog, endKm: e.target.value })} /></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group"><label className="form-label">Fuel Added (Liters)</label><input type="number" step="0.1" className="form-input" value={newTransportLog.fuelLiters} onChange={e => setNewTransportLog({ ...newTransportLog, fuelLiters: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Fuel Cost (₹)</label><input type="number" className="form-input" value={newTransportLog.fuelCost} onChange={e => setNewTransportLog({ ...newTransportLog, fuelCost: e.target.value })} /></div>
                </div>
              </>
            )}

            {(newTransportLog.logType === 'Maintenance' || newTransportLog.logType === 'Both') && (
              <div className="form-group">
                <label className="form-label">Maintenance Cost (₹)</label>
                <input type="number" className="form-input" placeholder="0.00" value={newTransportLog.maintCost} onChange={e => setNewTransportLog({ ...newTransportLog, maintCost: e.target.value })} />
              </div>
            )}

            <div className="form-group"><label className="form-label">Remarks (Optional)</label><input className="form-input" value={newTransportLog.remarks} onChange={e => setNewTransportLog({ ...newTransportLog, remarks: e.target.value })} placeholder="Maintenance notes..." /></div>
            
            <div style={{ display: 'flex', gap: 12, marginTop: 15 }}><button type="submit" className="btn btn-primary w-full"><FiSave /> Save Log</button></div>
          </form>
        </div>
      )}
    </>
  )
}
