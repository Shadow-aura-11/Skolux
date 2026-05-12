import { useState, useMemo } from 'react'
import { useAuth, MOCK_DATA, feeKey, getPreviousSessionsDue } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { FiDollarSign, FiSearch, FiCheckCircle, FiClock, FiAlertCircle, FiPlus, FiPrinter, FiX, FiTag, FiAlertTriangle, FiDownload, FiRefreshCw, FiTruck, FiTrash2 } from 'react-icons/fi'
import { exportToCSV } from '../../utils/exportUtils'
import { generatePDF } from '../../utils/pdfUtils'

export default function FeesPage() {
  const { user, currentSession, sessions } = useAuth()
  const { students, refreshData } = useData()

  const syncFees = () => {
    if (!window.confirm(`Recalculate all fee balances for the CURRENT session (${currentSession})? This will fix any balance discrepancies across all students.`)) return
    const feeKeyStr = feeKey(currentSession)
    const fees = JSON.parse(localStorage.getItem(feeKeyStr) || '{}')
    Object.keys(fees).forEach(sid => {
      const f = fees[sid]
      f.remaining = (Number(f.total || 0) + Number(f.prevSessionDues || 0)) - Number(f.paid || 0) - Number(f.discount || 0)
    })
    localStorage.setItem(feeKeyStr, JSON.stringify(fees))
    setFeeRecords(fees)
    alert(`Financial records recalculated for ${currentSession}!`)
  }
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [search, setSearch] = useState('')
  const [collectModal, setCollectModal] = useState(false)
  const [printData, setPrintData] = useState(null)
  const [collectTarget, setCollectTarget] = useState('current') // 'current' | session string
  const [configModal, setConfigModal] = useState(false)
  const [feeConfig, setFeeConfig] = useState({ classFee: 0, transportFee: 0 })
  
  const [filterClass, setFilterClass] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterTransport, setFilterTransport] = useState('')
  const [filterPaidPct, setFilterPaidPct] = useState('')

  // Per-session fee records
  const [feeRecords, setFeeRecords] = useState(() => {
    const stored = localStorage.getItem(feeKey(currentSession))
    if (stored) return JSON.parse(stored)
    // Seed default data for current session on first load
    const seed = MOCK_DATA.studentFees
    localStorage.setItem(feeKey(currentSession), JSON.stringify(seed))
    return seed
  })

  // Reload fees when session changes
  const getRecordsForSession = (session) => {
    const stored = localStorage.getItem(feeKey(session))
    return stored ? JSON.parse(stored) : {}
  }

  const [collectForm, setCollectForm] = useState({
    type: 'Tuition', amount: '', discount: '0',
    mode: 'Cash', date: new Date().toISOString().split('T')[0], remarks: ''
  })

  const isAdmin = user?.role === 'admin'
  const isTeacher = user?.role === 'teacher'
  const isStudent = user?.role === 'student'
  const isParent = user?.role === 'parent'
  const globalFeeConfig = useMemo(() => JSON.parse(localStorage.getItem('nms_global_fee_config') || '{"classFees":{},"transportFees":{}}'), [currentSession])
  
  const getStudentTotalFee = (student) => {
    const classFee = Number(globalFeeConfig.classFees[student.class] || 40000)
    const transportFee = Number(globalFeeConfig.transportFees[student.transportRoute] || 0)
    return classFee + transportFee
  }

  const getStudentFees = (student) => {
    const rec = feeRecords[student.id]
    if (rec && rec.total > 0) return rec 
    const defaultTotal = getStudentTotalFee(student)
    return { total: defaultTotal, paid: 0, discount: 0, remaining: defaultTotal, history: [] }
  }

  const filteredStudents = useMemo(() => {
    return (students || []).filter(s => {
      if (!s) return false
      const searchMatch = (s.name || '').toLowerCase().includes(search.toLowerCase()) || (s.id || '').toLowerCase().includes(search.toLowerCase())
      const classMatch = !filterClass || s.class === filterClass
      const transportMatch = !filterTransport || s.transportRoute === filterTransport
      
      // Status Logic
      let statusMatch = true
      if (filterStatus) {
        const fees = getStudentFees(s)
        if (filterStatus === 'Paid') statusMatch = fees.remaining <= 0
        else if (filterStatus === 'Unpaid') statusMatch = fees.paid === 0 && fees.remaining > 0
        else if (filterStatus === 'Partial') statusMatch = fees.paid > 0 && fees.remaining > 0
        else if (filterStatus === 'Overdue') statusMatch = fees.remaining > 0 
      }

      // Percentage Filter Logic
      let pctMatch = true
      if (filterPaidPct) {
        const fees = getStudentFees(s)
        const totalDue = fees.total + (fees.prevSessionDues || 0)
        const paidPct = totalDue > 0 ? (fees.paid / totalDue) * 100 : 0
        
        if (filterPaidPct === '25') pctMatch = paidPct < 25
        else if (filterPaidPct === '50') pctMatch = paidPct < 50
        else if (filterPaidPct === '75') pctMatch = paidPct < 75
        else if (filterPaidPct === '100') pctMatch = paidPct < 100
        else if (filterPaidPct === 'full') pctMatch = paidPct >= 100
      }
      
      return searchMatch && classMatch && transportMatch && statusMatch && pctMatch
    })
  }, [students, search, filterClass, filterTransport, filterStatus, filterPaidPct, feeRecords, currentSession, globalFeeConfig])

  const handleBulkExport = () => {
    const exportData = filteredStudents.map(s => {
      const fees = getStudentFees(s)
      return {
        'ID': s.id,
        'Name': s.name,
        'Class': `${s.class}-${s.section}`,
        'Phone': s.phone || s.fatherPhone || s.motherPhone || 'N/A',
        'Route': s.transportRoute,
        'Location': s.transportStop || 'N/A',
        'Total Fee': fees.total,
        'Paid': fees.paid,
        'Discount': fees.discount,
        'Remaining': fees.remaining,
        'Status': fees.remaining <= 0 ? 'Paid' : 'Unpaid'
      }
    })
    exportToCSV(exportData, `Fees_Report_${currentSession}_${filterClass || 'All'}.csv`)
  }
  const handleConfigFeeSave = (e) => {
    e.preventDefault()
    if (!selectedStudent) return
    const studentId = selectedStudent.id
    const sessionRecs = getRecordsForSession(currentSession)
    const current = sessionRecs[studentId] || getStudentFees(selectedStudent)
    
    const newTotal = parseFloat(feeConfig.classFee) + parseFloat(feeConfig.transportFee)
    const newRemaining = Math.max(0, newTotal - current.paid - current.discount)
    
    const updatedRec = {
      ...current,
      total: newTotal,
      remaining: newRemaining
    }
    
    const updatedAll = { ...sessionRecs, [studentId]: updatedRec }
    localStorage.setItem(feeKey(currentSession), JSON.stringify(updatedAll))
    setFeeRecords(updatedAll)
    setConfigModal(false)
    refreshData()
  }

  const handleCollect = (e) => {
    e.preventDefault()
    if (!selectedStudent || !collectForm.amount) return

    const studentId = selectedStudent.id
    const targetSession = collectTarget === 'current' ? currentSession : collectTarget
    const sessionRecs = getRecordsForSession(targetSession)
    const current = sessionRecs[studentId] || getStudentFees(selectedStudent)

    const amount = parseFloat(collectForm.amount)
    const discount = parseFloat(collectForm.discount || 0)

    const newTxn = {
      id: `TXN${Date.now()}`,
      type: collectForm.type,
      amount: amount + discount,
      paid: amount,
      discount,
      date: collectForm.date,
      status: 'Paid',
      mode: collectForm.mode,
      remarks: collectForm.remarks,
      session: targetSession
    }

    const updatedRec = {
      ...current,
      paid: current.paid + amount,
      discount: current.discount + discount,
      remaining: Math.max(0, current.remaining - (amount + discount)),
      history: [newTxn, ...(current.history || [])]
    }

    const updatedAll = { ...sessionRecs, [studentId]: updatedRec }
    localStorage.setItem(feeKey(targetSession), JSON.stringify(updatedAll))

    // If paying current session, update state
    if (targetSession === currentSession) setFeeRecords(updatedAll)

    setCollectModal(false)
    setPrintData({ ...newTxn, studentName: selectedStudent.name, studentId, class: selectedStudent.class, rollNo: selectedStudent.rollNo })
    refreshData()
  }

  const handleDeleteTransaction = (txn) => {
    if (!window.confirm(`⚠️ Are you sure you want to delete this transaction (ID: ${txn.id})? This will reverse the payment and increase the student's balance.`)) return

    const studentId = selectedStudent.id
    const targetSession = txn.session || currentSession
    const sessionRecs = getRecordsForSession(targetSession)
    const current = sessionRecs[studentId]

    if (!current) return

    const amount = parseFloat(txn.paid || 0)
    const discount = parseFloat(txn.discount || 0)

    const updatedRec = {
      ...current,
      paid: Math.max(0, current.paid - amount),
      discount: Math.max(0, current.discount - discount),
      remaining: current.remaining + (amount + discount),
      history: (current.history || []).filter(h => h.id !== txn.id)
    }

    const updatedAll = { ...sessionRecs, [studentId]: updatedRec }
    localStorage.setItem(feeKey(targetSession), JSON.stringify(updatedAll))

    if (targetSession === currentSession) setFeeRecords(updatedAll)
    refreshData()
    alert('Transaction deleted and balance restored.')
  }

  // Auto-select for student/parent
  if ((isStudent || isParent) && !selectedStudent) {
    const sid = isStudent ? user.id : (user.children?.[0]?.id)
    const s = MOCK_DATA.students.find(x => x.id === sid)
    if (s) setSelectedStudent(s)
  }

  const allSessions = sessions
  const prevDues = selectedStudent ? getPreviousSessionsDue(selectedStudent.id, currentSession, sessions) : []
  const totalPrevDue = prevDues.reduce((sum, d) => sum + d.remaining, 0)

  return (
    <div className="fees-page">
      <div className="dash-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="dash-page-title"><FiDollarSign style={{ display: 'inline', marginRight: 8 }} />Fee Management</div>
          <div className="dash-page-subtitle">Session: <strong>{currentSession}</strong> — Student-wise fee tracking</div>
        </div>
        {(isAdmin || isTeacher) && (
          <div style={{ display: 'flex', gap: 10 }}>
            {isAdmin && (
              <button className="btn btn-secondary btn-sm" onClick={syncFees} title="Recalculate all unpaid balances for this session">
                <FiRefreshCw /> Recalculate All
              </button>
            )}
            <button className="btn btn-secondary btn-sm" onClick={handleBulkExport}>
              <FiDownload /> Export CSV
            </button>
          </div>
        )}
        {selectedStudent && (isAdmin || isTeacher) && (
          <div style={{ display: 'flex', gap: 10 }}>
            {isAdmin && (
              <button className="btn btn-secondary btn-sm" onClick={() => {
                const defaultClassFee = globalFeeConfig.classFees[selectedStudent.class] || 40000
                const defaultTransportFee = globalFeeConfig.transportFees[selectedStudent.transportRoute] || 0
                setFeeConfig({ classFee: defaultClassFee, transportFee: defaultTransportFee })
                setConfigModal(true)
              }}>
                <FiTag /> Setup Fee
              </button>
            )}
            <button className="btn btn-primary btn-sm" onClick={() => setCollectModal(true)}>
              <FiPlus /> Collect Fees
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: (isAdmin || isTeacher) ? '300px 1fr' : '1fr', gap: 'var(--space-6)', alignItems: 'flex-start' }}>

        {/* Student List */}
        {(isAdmin || isTeacher) && (
          <div className="dash-widget" style={{ maxHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            <div className="dash-widget-header" style={{ padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
              <div className="dash-search" style={{ width: '100%', minWidth: 'auto' }}>
                <FiSearch size={14} />
                <input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} style={{ fontSize: 13 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <select className="form-select form-select-sm" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                  <option value="">All Classes</option>
                  {['UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="form-select form-select-sm" value={filterTransport} onChange={e => setFilterTransport(e.target.value)}>
                  <option value="">All Routes</option>
                  <option value="None">Self (None)</option>
                  {Object.keys(globalFeeConfig.transportFees || {}).map(route => <option key={route} value={route}>{route}</option>)}
                </select>
              </div>
              <select className="form-select form-select-sm" value={filterPaidPct} onChange={e => setFilterPaidPct(e.target.value)} style={{ width: '100%' }}>
                <option value="">Show All (Fee %)</option>
                <option value="25">Under 25% Paid</option>
                <option value="50">Under 50% Paid</option>
                <option value="75">Under 75% Paid</option>
                <option value="100">Under 100% Paid (Dues Pending)</option>
                <option value="full">100% Paid (Fully Paid)</option>
              </select>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {filteredStudents.map(s => {
                const fees = getStudentFees(s)
                const prevD = getPreviousSessionsDue(s.id, currentSession, sessions)
                const hasPrevDue = prevD.some(d => d.remaining > 0)
                const totalDue = fees.total + (fees.prevSessionDues || 0)
                const paidPct = totalDue > 0 ? Math.round((fees.paid / totalDue) * 100) : 0

                return (
                  <div key={s.id} onClick={() => setSelectedStudent(s)}
                    style={{
                      padding: '12px 15px', borderBottom: '1px solid var(--gray-50)',
                      cursor: 'pointer',
                      background: selectedStudent?.id === s.id ? 'var(--primary-50)' : 'transparent',
                      transition: 'all 0.15s'
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: selectedStudent?.id === s.id ? 'var(--primary-700)' : 'var(--gray-800)' }}>{s.name}</div>
                      {hasPrevDue && <span title="Has previous session dues" style={{ color: '#f59e0b', fontSize: 13 }}><FiAlertTriangle /></span>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>{s.id} | {s.class}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {fees.paid > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-400)' }}>{paidPct}%</span>}
                        <span className={`badge ${fees.remaining <= 0 ? 'badge-success' : (fees.paid > 0 ? 'badge-warning' : 'badge-error')}`} style={{ fontSize: 9, padding: '2px 6px' }}>
                          {fees.remaining <= 0 ? 'PAID' : (fees.paid > 0 ? 'PARTIAL' : 'UNPAID')}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {!selectedStudent ? (
            <div className="dash-widget" style={{ padding: 60, textAlign: 'center', color: 'var(--gray-400)' }}>
              <FiDollarSign size={48} style={{ marginBottom: 15, opacity: 0.3 }} />
              <div>Select a student to view fee details</div>
            </div>
          ) : (
            <>
              {/* Header Card */}
              <div className="dash-widget" style={{ padding: '20px 25px', background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700 }}>{selectedStudent.name}</h2>
                    <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                      Class: <strong>{selectedStudent.class}</strong> | Roll: <strong>{selectedStudent.rollNo}</strong> | ID: <strong>{selectedStudent.id}</strong>
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Session: {currentSession}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8 }}>Current Session Balance</div>
                    <div style={{ fontSize: 28, fontWeight: 800 }}>₹{getStudentFees(selectedStudent).remaining.toLocaleString()}</div>
                    {totalPrevDue > 0 && (
                      <div style={{ fontSize: 12, marginTop: 4, background: 'rgba(239,68,68,0.3)', padding: '3px 10px', borderRadius: 8, fontWeight: 600 }}>
                        + ₹{totalPrevDue.toLocaleString()} prev. dues
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── PREVIOUS SESSION DUES ALERT ── */}
              {prevDues.length > 0 && (
                <div style={{ background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 'var(--radius-xl)', padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <FiAlertTriangle size={20} color="#d97706" />
                    <strong style={{ color: '#92400e', fontSize: 14 }}>Previous Session Carry-Forward Dues</strong>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {prevDues.map(d => (
                      <div key={d.session} style={{ background: 'white', border: '1px solid #fcd34d', borderRadius: 10, padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontSize: 11, color: '#92400e', fontWeight: 600 }}>{d.session}</span>
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#dc2626' }}>₹{d.remaining.toLocaleString()}</span>
                        {(isAdmin || isTeacher) && (
                          <button className="btn btn-sm" style={{ fontSize: 10, padding: '2px 8px', marginTop: 4, background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' }}
                            onClick={() => { setCollectTarget(d.session); setCollectModal(true) }}>
                            Collect ›
                          </button>
                        )}
                      </div>
                    ))}
                    <div style={{ background: '#dc2626', color: 'white', borderRadius: 10, padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 600 }}>Total Carry-Forward</span>
                      <span style={{ fontSize: 18, fontWeight: 800 }}>₹{totalPrevDue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats */}
              {(() => {
                const fees = getStudentFees(selectedStudent)
                const academicTotal = Number(globalFeeConfig.classFees[selectedStudent.class] || 40000)
                const transportTotal = Number(globalFeeConfig.transportFees[selectedStudent.transportRoute] || 0)
                
                const transportPaid = (fees.history || []).filter(h => h.type === 'Transport').reduce((sum, h) => sum + (Number(h.paid) || 0), 0)
                const transportDiscount = (fees.history || []).filter(h => h.type === 'Transport').reduce((sum, h) => sum + (Number(h.discount) || 0), 0)
                const transportRemaining = Math.max(0, transportTotal - transportPaid - transportDiscount)
                
                const academicRemaining = Math.max(0, fees.remaining - transportRemaining)

                const stats = [
                  { icon: <FiDollarSign />, label: 'Total Fee', value: fees.total, bg: 'var(--primary-50)', color: 'var(--primary-500)' },
                  { icon: <FiCheckCircle />, label: 'Paid', value: fees.paid, bg: 'var(--accent-50)', color: 'var(--accent-500)' },
                  { icon: <FiAlertCircle />, label: 'Rem. Academic', value: academicRemaining, bg: '#fef2f2', color: 'var(--error)' },
                  { icon: <FiTruck />, label: 'Rem. Transport', value: transportRemaining, bg: '#fff7ed', color: '#ea580c' },
                  { icon: <FiTag />, label: 'Discount', value: fees.discount, bg: 'var(--gold-50)', color: 'var(--gold-600)' },
                ]

                return (
                  <div className="dash-stat-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                    {stats.map((s, i) => (
                      <div key={i} className="dash-stat-card" style={{ padding: '15px 12px' }}>
                        <div className="dash-stat-icon" style={{ background: s.bg, color: s.color, width: 32, height: 32, fontSize: 16 }}>{s.icon}</div>
                        <div>
                          <div className="dash-stat-value" style={{ fontSize: 15 }}>₹{s.value.toLocaleString()}</div>
                          <div className="dash-stat-label" style={{ fontSize: 10 }}>{s.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}

              {/* Transaction History */}
              <div className="dash-widget">
                <div className="dash-widget-header">
                  <span className="dash-widget-title"><FiClock /> Transaction History — {currentSession}</span>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '4px 10px' }} onClick={() => exportToCSV(getStudentFees(selectedStudent).history, `Fees_${selectedStudent.name}_${currentSession}.csv`)}>
                    <FiDownload /> Export
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th><th>Type</th><th>Mode</th><th>Total</th><th>Discount</th><th>Paid</th><th>Remarks</th><th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getStudentFees(selectedStudent).history.length === 0 ? (
                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>No transactions in {currentSession}.</td></tr>
                      ) : (
                        getStudentFees(selectedStudent).history.map((h) => (
                          <tr key={h.id}>
                            <td style={{ fontSize: 13, fontWeight: 500 }}>{h.date}</td>
                            <td><span className="badge badge-info">{h.type}</span></td>
                            <td style={{ fontSize: 12 }}>{h.mode}</td>
                            <td style={{ fontWeight: 600 }}>₹{(Number(h.amount) || 0).toLocaleString()}</td>
                            <td style={{ color: 'var(--gold-600)', fontWeight: 600 }}>₹{h.discount || 0}</td>
                            <td style={{ color: 'var(--accent-600)', fontWeight: 700 }}>₹{(Number(h.paid) || 0).toLocaleString()}</td>
                            <td style={{ fontSize: 12, color: 'var(--gray-500)', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.remarks || '-'}</td>
                            <td>
                               <div style={{ display: 'flex', gap: 6 }}>
                                 <button className="btn btn-sm" style={{ padding: 4, background: 'var(--gray-50)' }}
                                   onClick={() => setPrintData({ ...h, studentName: selectedStudent.name, studentId: selectedStudent.id, class: selectedStudent.class, rollNo: selectedStudent.rollNo })}>
                                   <FiPrinter size={14} color="var(--gray-500)" />
                                 </button>
                                 {isAdmin && (
                                   <button className="btn btn-sm" style={{ padding: 4, background: 'var(--error-50)' }}
                                     onClick={() => handleDeleteTransaction(h)}>
                                     <FiTrash2 size={14} color="var(--error)" />
                                   </button>
                                 )}
                               </div>
                             </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Collect Modal */}
      {collectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setCollectModal(false)}>
          <form style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()} onSubmit={handleCollect}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 18 }}>Collect Fees</h3>
                <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>For: <strong>{selectedStudent?.name}</strong></p>
              </div>
              <button type="button" onClick={() => setCollectModal(false)}><FiX /></button>
            </div>

            {/* Session selector */}
            <div className="form-group">
              <label className="form-label">Apply to Session</label>
              <select className="form-select" value={collectTarget} onChange={e => setCollectTarget(e.target.value)}>
                <option value="current">Current — {currentSession}</option>
                {getPreviousSessionsDue(selectedStudent?.id || '', currentSession, sessions).map(d => (
                  <option key={d.session} value={d.session}>{d.session} (Due: ₹{d.remaining.toLocaleString()})</option>
                ))}
              </select>
            </div>

            {collectTarget !== 'current' && (
              <div style={{ background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 10, padding: '10px 14px', marginBottom: 15, fontSize: 13, color: '#92400e' }}>
                ⚠️ Collecting against previous session <strong>{collectTarget}</strong>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Fee Type</label>
              <select className="form-select" value={collectForm.type} onChange={e => setCollectForm({ ...collectForm, type: e.target.value })}>
                <option>Tuition</option><option>Transport</option><option>Registration</option>
                <option>Admission</option><option>Examination</option><option>Library</option><option>Activity</option>
                <option>Carry-Forward Dues</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
              <div className="form-group">
                <label className="form-label">Amount *</label>
                <input className="form-input" type="number" required placeholder="0.00" value={collectForm.amount} onChange={e => setCollectForm({ ...collectForm, amount: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Discount</label>
                <input className="form-input" type="number" placeholder="0.00" value={collectForm.discount} onChange={e => setCollectForm({ ...collectForm, discount: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <select className="form-select" value={collectForm.mode} onChange={e => setCollectForm({ ...collectForm, mode: e.target.value })}>
                  <option>Cash</option><option>Online</option><option>Cheque</option><option>Bank Transfer</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={collectForm.date} onChange={e => setCollectForm({ ...collectForm, date: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Remarks</label>
              <input className="form-input" placeholder="Optional remarks..." value={collectForm.remarks} onChange={e => setCollectForm({ ...collectForm, remarks: e.target.value })} />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Confirm Collection</button>
              <button type="button" className="btn btn-secondary" onClick={() => setCollectModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Print Receipt */}
      {printData && (
        <div className="no-print" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setPrintData(null)}>
          <div style={{ background: 'white', padding: 40, maxWidth: 600, width: '100%' }} onClick={e => e.stopPropagation()}>
            <div id="receipt-print-area" style={{ background: 'white !important', color: '#1e293b !important', boxShadow: 'inset 0 0 0 1000px white !important' }}>
              <div style={{ borderBottom: '2px solid #1e293b', paddingBottom: 20, marginBottom: 30, textAlign: 'center' }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1e40af !important' }}>NEW MORNING STAR PUBLIC SCHOOL</h1>
                <p style={{ fontSize: 12, color: '#64748b !important', marginTop: 4 }}>Subhash Nagar, New Delhi - 110027 | +91 11 2345 6789</p>
                <div style={{ display: 'inline-block', padding: '4px 15px', background: '#1e293b !important', boxShadow: 'inset 0 0 0 1000px #1e293b !important', color: 'white !important', fontSize: 11, fontWeight: 700, marginTop: 15, borderRadius: 4, WebkitPrintColorAdjust: 'exact' }}>FEE RECEIPT</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginBottom: 25 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8 !important', textTransform: 'uppercase' }}>Student Details</div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginTop: 5, color: '#0f172a !important' }}>{printData.studentName}</div>
                  <div style={{ fontSize: 13, color: '#475569 !important', marginTop: 2 }}>ID: {printData.studentId} | Class: {printData.class}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: '#94a3b8 !important', textTransform: 'uppercase' }}>Receipt Details</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 5, color: '#0f172a !important' }}>No: {printData.id}</div>
                  <div style={{ fontSize: 13, color: '#475569 !important', marginTop: 2 }}>Date: {printData.date} | Session: {printData.session || currentSession}</div>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 30 }}>
                <thead><tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc !important', boxShadow: 'inset 0 0 0 1000px #f8fafc !important' }}><th style={{ textAlign: 'left', padding: '10px 0', fontSize: 12, color: '#475569 !important' }}>Description</th><th style={{ textAlign: 'right', padding: '10px 0', fontSize: 12, color: '#475569 !important' }}>Amount</th></tr></thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}><td style={{ padding: '15px 0', fontSize: 14, color: '#1e293b !important' }}>{printData.type} Fees</td><td style={{ textAlign: 'right', padding: '15px 0', fontSize: 14, color: '#1e293b !important' }}>₹{printData.amount.toLocaleString()}</td></tr>
                  <tr><td style={{ padding: '10px 0', fontSize: 12, color: '#64748b !important' }}>Discount Applied</td><td style={{ textAlign: 'right', padding: '10px 0', fontSize: 12, color: '#64748b !important' }}>- ₹{(printData.discount || 0).toLocaleString()}</td></tr>
                </tbody>
                <tfoot><tr style={{ borderTop: '2px solid #1e293b', background: '#f8fafc !important', boxShadow: 'inset 0 0 0 1000px #f8fafc !important' }}><td style={{ padding: '15px 0', fontWeight: 800, fontSize: 16, color: '#0f172a !important' }}>TOTAL PAID</td><td style={{ textAlign: 'right', padding: '15px 0', fontWeight: 800, fontSize: 18, color: '#1e40af !important' }}>₹{printData.paid.toLocaleString()}</td></tr></tfoot>
              </table>
              {printData.remarks && (
                <div style={{ marginBottom: 30 }}>
                  <div style={{ fontSize: 10, color: '#94a3b8 !important', textTransform: 'uppercase' }}>Remarks</div>
                  <div style={{ fontSize: 13, color: '#0f172a !important', marginTop: 5 }}>{printData.remarks}</div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 40 }}>
                <div style={{ fontSize: 11, color: '#94a3b8 !important' }}>* Computer generated receipt.<br />* Fees once paid is non-refundable.</div>
                <div style={{ textAlign: 'center' }}><div style={{ height: 1, background: '#cbd5e1', marginBottom: 10 }} /><div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a !important' }}>Authorized Signatory</div></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 15, marginTop: 30 }} className="no-print">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => generatePDF('receipt-print-area', `Receipt_${printData.id}.pdf`)}>
                <FiPrinter /> Download PDF Receipt
              </button>
              <button className="btn btn-secondary" onClick={() => setPrintData(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Config Modal */}
      {configModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setConfigModal(false)}>
          <form style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()} onSubmit={handleConfigFeeSave}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 18 }}>Setup Student Fee Structure</h3>
                <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>For: <strong>{selectedStudent?.name}</strong> | Session: <strong>{currentSession}</strong></p>
              </div>
              <button type="button" onClick={() => setConfigModal(false)}><FiX /></button>
            </div>

            <div className="form-group">
              <label className="form-label">Base Class Fee (₹)</label>
              <input type="number" className="form-input" required min="0"
                value={feeConfig.classFee} onChange={e => setFeeConfig({...feeConfig, classFee: e.target.value})} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Transport Route Fee (₹) {selectedStudent?.transportRoute !== 'None' ? `(${selectedStudent?.transportRoute})` : ''}</label>
              <input type="number" className="form-input" required min="0"
                value={feeConfig.transportFee} onChange={e => setFeeConfig({...feeConfig, transportFee: e.target.value})} />
            </div>
            
            <div style={{ background: 'var(--primary-50)', padding: 15, borderRadius: 10, marginTop: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: 'var(--primary-800)' }}>
                <span>Total Computed Fee:</span>
                <span style={{ fontSize: 18 }}>₹{(parseFloat(feeConfig.classFee || 0) + parseFloat(feeConfig.transportFee || 0)).toLocaleString()}</span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">Save Fee Structure</button>
          </form>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-print-area, #receipt-print-area * { 
            visibility: visible; 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #receipt-print-area { 
            position: fixed; 
            left: 0; 
            top: 0; 
            width: 100%; 
            padding: 40px; 
            background: white !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  )
}
