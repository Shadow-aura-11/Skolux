import { useState, useEffect } from 'react'
import { useAuth, MOCK_DATA } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { FiTruck, FiMapPin, FiUser, FiInfo, FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiDownload, FiRefreshCw } from 'react-icons/fi'
import { exportToCSV } from '../../utils/exportUtils'

export default function TransportPage() {
  const { user, currentSession } = useAuth()
  const { 
    fleetLogs = [], updateFleetLogs, 
    transportRoutes: routes = [], updateTransportRoutes, 
    vehicles = [], updateVehicles, 
    generalExpenses = [], updateExpenses,
    refreshData 
  } = useData() || {}
  const [activeTab, setActiveTab] = useState('logs')
  
  const [modal, setModal] = useState(null)
  const [logModal, setLogModal] = useState(false)
  const [vehicleModal, setVehicleModal] = useState(null)
  
  const [filterVeh, setFilterVeh] = useState('')
  const [filterType, setFilterType] = useState('')
  
  const [editData, setEditData] = useState({ route: '', vehicleNo: '', driver: '', stops: '', students: 0 })
  const [logData, setLogData] = useState({ date: new Date().toISOString().split('T')[0], vehicleNo: '', driver: '', startKm: '', endKm: '', fuelLiters: '', fuelCost: '', maintCost: '', remarks: '', logType: 'Both' })
  const [vehData, setVehData] = useState({ vehicleNo: '', name: '', model: '', documents: [] })
  
  const isAdmin = user?.role === 'admin'

  const save = d => { updateTransportRoutes(d); refreshData() }
  const saveLogs = d => { updateFleetLogs(d); refreshData() }

  const handleSave = () => {
    if (!editData.route.trim()) return
    const updated = modal === 'add' ? [...routes, editData] : routes.map(r => r.route === editData.route ? editData : r)
    save(updated)
    setModal(null)
  }

  const handleLogSave = (e) => {
    e.preventDefault()
    const logId = Date.now()
    const dist = (logData.logType === 'Fuel' || logData.logType === 'Both') ? Number(logData.endKm) - Number(logData.startKm) : 0
    const fuelVal = Number(logData.fuelCost || 0)
    const maintVal = Number(logData.maintCost || 0)
    
    const newLog = {
      ...logData,
      id: logId,
      distance: dist,
      mileage: (logData.fuelLiters && dist > 0) ? (dist / Number(logData.fuelLiters)).toFixed(2) : 0
    }
    
    // Update Fleet Logs
    updateFleetLogs([newLog, ...fleetLogs])

    // Create Finance Expense entries
    const newExpenses = [...generalExpenses]
    if (fuelVal > 0) {
      newExpenses.push({
        id: `EXP-FUEL-${logId}`,
        date: logData.date,
        category: 'Transport/Fuel',
        title: `Fuel: ${logData.vehicleNo}`,
        amount: fuelVal,
        status: 'Paid',
        mode: 'Cash',
        remarks: `Refill ${logData.fuelLiters}L for ${logData.vehicleNo}`
      })
    }
    if (maintVal > 0) {
      newExpenses.push({
        id: `EXP-MAINT-${logId}`,
        date: logData.date,
        category: 'Vehicle Maintenance',
        title: `Maint: ${logData.vehicleNo}`,
        amount: maintVal,
        status: 'Paid',
        mode: 'Cash',
        remarks: logData.remarks || `Maintenance/Service for ${logData.vehicleNo}`
      })
    }
    
    if (fuelVal > 0 || maintVal > 0) {
      updateExpenses(newExpenses)
    }

    setLogModal(false)
  }

  const handleDeleteLog = (log) => {
    if (!window.confirm(`Are you sure you want to delete the log for ${log.vehicleNo} on ${log.date}? This will also remove associated financial expense entries.`)) return
    
    // 1. Remove the log
    const updatedLogs = fleetLogs.filter(l => l.id !== log.id)
    updateFleetLogs(updatedLogs)
    
    // 2. Remove associated expenses (using the shared log.id)
    const fuelExpId = `EXP-FUEL-${log.id}`
    const maintExpId = `EXP-MAINT-${log.id}`
    const updatedExpenses = generalExpenses.filter(e => e.id !== fuelExpId && e.id !== maintExpId)
    
    if (updatedExpenses.length !== generalExpenses.length) {
      updateExpenses(updatedExpenses)
    }
    
    refreshData()
  }

  // Auto-fetch last odometer reading
  useEffect(() => {
    if (logData.vehicleNo && (logData.logType === 'Fuel' || logData.logType === 'Both')) {
      const vehicleLogs = fleetLogs.filter(l => l.vehicleNo === logData.vehicleNo).sort((a, b) => b.id - a.id)
      if (vehicleLogs.length > 0) {
        const lastEnd = vehicleLogs[0].endKm
        if (lastEnd && !logData.startKm) {
          setLogData(prev => ({ ...prev, startKm: lastEnd }))
        }
      }
    }
  }, [logData.vehicleNo, logData.logType, fleetLogs])

  const handleVehicleSave = () => {
    if (!vehData.vehicleNo.trim()) return
    let updated
    if (vehicleModal === 'add') {
      updated = [...vehicles, { ...vehData, id: `V${Date.now()}` }]
    } else {
      updated = vehicles.map(v => v.id === vehData.id ? vehData : v)
    }
    updateVehicles(updated)
    setVehicleModal(null)
  }

  const handleDocUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const docName = prompt("Enter document name (e.g. RC, Insurance):", file.name)
      if (!docName) return
      setVehData({
        ...vehData,
        documents: [...(vehData.documents || []), { name: docName, file: event.target.result, date: new Date().toLocaleDateString() }]
      })
    }
    reader.readAsDataURL(file)
  }

  const filteredLogs = fleetLogs.filter(log => {
    const vehMatch = !filterVeh || log.vehicleNo === filterVeh
    const typeMatch = !filterType || log.logType === filterType || (filterType === 'Both' && log.logType === 'Both')
    return vehMatch && typeMatch
  })

  const logStats = {
    fuel: filteredLogs.reduce((a, b) => a + Number(b.fuelCost || 0), 0),
    maint: filteredLogs.reduce((a, b) => a + Number(b.maintCost || 0), 0),
    dist: filteredLogs.reduce((a, b) => a + Number(b.distance || 0), 0),
    liters: filteredLogs.reduce((a, b) => a + Number(b.fuelLiters || 0), 0),
  }
  logStats.avgMileage = logStats.liters > 0 ? (logStats.dist / logStats.liters).toFixed(2) : 0

  return (
    <div>
      <div className="dash-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="dash-page-title"><FiTruck style={{ display: 'inline', marginRight: 8 }} />Transport & Fleet Management</div>
          <div className="dash-page-subtitle">{routes.length} active routes | Serving {routes.reduce((a, b) => a + b.students, 0)} students</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {isAdmin && (
            <div style={{ display: 'flex', background: 'var(--gray-100)', padding: 4, borderRadius: 8, marginRight: 10 }}>
              <button className={`btn btn-sm ${activeTab === 'routes' ? 'btn-primary' : ''}`} style={{ background: activeTab === 'routes' ? 'white' : 'transparent', color: activeTab === 'routes' ? 'var(--gray-800)' : 'var(--gray-500)', boxShadow: activeTab === 'routes' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }} onClick={() => setActiveTab('routes')}>Routes</button>
              <button className={`btn btn-sm ${activeTab === 'vehicles' ? 'btn-primary' : ''}`} style={{ background: activeTab === 'vehicles' ? 'white' : 'transparent', color: activeTab === 'vehicles' ? 'var(--gray-800)' : 'var(--gray-500)', boxShadow: activeTab === 'vehicles' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }} onClick={() => setActiveTab('vehicles')}>Vehicles</button>
              <button className={`btn btn-sm ${activeTab === 'logs' ? 'btn-primary' : ''}`} style={{ background: activeTab === 'logs' ? 'white' : 'transparent', color: activeTab === 'logs' ? 'var(--gray-800)' : 'var(--gray-500)', boxShadow: activeTab === 'logs' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }} onClick={() => setActiveTab('logs')}>Fleet Logs & Fuel</button>
            </div>
          )}
          {activeTab === 'routes' ? (
            <button className="btn btn-secondary btn-sm" onClick={() => exportToCSV(routes, `Transport_Routes_${currentSession}.csv`)}><FiDownload /> Export Routes</button>
          ) : (
            <button className="btn btn-secondary btn-sm" onClick={() => exportToCSV(fleetLogs, `Fleet_Logs_${currentSession}.csv`)}><FiDownload /> Export Logs</button>
          )}
          {isAdmin && activeTab === 'routes' && (
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => {
                if (!window.confirm(`Sync student-to-route assignments for the CURRENT session (${currentSession})?`)) return
                const stuKey = `nms_students_${currentSession}`
                const students = JSON.parse(localStorage.getItem(stuKey) || localStorage.getItem('nms_students') || '[]')
                const routeNames = routes.map(r => r.route)
                students.forEach(s => {
                  if (s.transportRoute !== 'None' && !routeNames.includes(s.transportRoute)) s.transportRoute = 'None'
                })
                localStorage.setItem(stuKey, JSON.stringify(students))
                alert(`Transport routes synchronized for students in ${currentSession}!`)
                window.location.reload()
              }}
              title="Fixes student assignments if routes were changed"
            >
              <FiRefreshCw /> Sync Students
            </button>
          )}
          {isAdmin && activeTab === 'routes' && <button className="btn btn-primary btn-sm" onClick={() => { setEditData({ route: '', vehicleNo: '', driver: '', stops: '', students: 0 }); setModal('add') }}><FiPlus /> Add Route</button>}
          {isAdmin && activeTab === 'vehicles' && <button className="btn btn-primary btn-sm" onClick={() => { setVehData({ vehicleNo: '', name: '', model: '', documents: [] }); setVehicleModal('add') }}><FiPlus /> Add Vehicle</button>}
          {isAdmin && activeTab === 'logs' && (
            <button className="btn btn-primary btn-sm" onClick={() => { 
              setLogData({ 
                date: new Date().toISOString().split('T')[0], 
                vehicleNo: vehicles[0]?.vehicleNo || '', 
                driver: '', 
                startKm: '', 
                endKm: '', 
                fuelLiters: '', 
                fuelCost: '', 
                maintCost: '',
                remarks: '',
                logType: 'Fuel'
              })
              setLogModal(true) 
            }}>
              <FiPlus /> Add Log
            </button>
          )}
        </div>
      </div>

      {activeTab === 'routes' ? (
        <>
          <div className="dash-stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
            <div className="dash-stat-card"><div className="dash-stat-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-500)' }}><FiTruck /></div><div><div className="dash-stat-value">{vehicles.length}</div><div className="dash-stat-label">Vehicles</div></div></div>
            <div className="dash-stat-card"><div className="dash-stat-icon" style={{ background: 'var(--accent-50)', color: 'var(--accent-500)' }}><FiMapPin /></div><div><div className="dash-stat-value">{routes.length}</div><div className="dash-stat-label">Routes</div></div></div>
            <div className="dash-stat-card"><div className="dash-stat-icon" style={{ background: 'var(--gold-50)', color: 'var(--gold-600)' }}><FiUser /></div><div><div className="dash-stat-value">{Array.from(new Set(routes.map(r => r.driver))).length}</div><div className="dash-stat-label">Drivers</div></div></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
            {routes.map((r, i) => (
              <div key={i} className="dash-widget">
                <div className="dash-widget-header" style={{ borderBottom: 'none' }}>
                  <span className="dash-widget-title" style={{ color: 'var(--primary-600)' }}><FiTruck /> {r.route}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {isAdmin && <button className="btn btn-sm btn-secondary" style={{ padding: '4px' }} onClick={() => { setEditData(r); setModal('edit') }}><FiEdit2 size={12} /></button>}
                    <span className="badge badge-info">{r.vehicleNo}</span>
                  </div>
                </div>
                <div className="dash-widget-body" style={{ paddingTop: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiUser size={14} color="var(--gray-500)" /></div>
                      <div style={{ fontSize: 'var(--text-sm)' }}><strong>Driver:</strong> {r.driver}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FiMapPin size={14} color="var(--gray-500)" /></div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-600)', lineHeight: 1.5 }}>
                        <strong>Stops:</strong><br />
                        {r.stops}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--gray-50)' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>Students Assigned</span>
                      <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{r.students}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : activeTab === 'vehicles' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-6)' }}>
          {vehicles.map((v, i) => (
            <div key={i} className="dash-widget">
              <div className="dash-widget-header">
                <span className="dash-widget-title" style={{ color: 'var(--accent-600)' }}><FiTruck /> {v.name}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {isAdmin && <button className="btn btn-sm btn-secondary" style={{ padding: '4px' }} onClick={() => { setVehData(v); setVehicleModal('edit') }}><FiEdit2 size={12} /></button>}
                  <span className="badge badge-success">{v.vehicleNo}</span>
                </div>
              </div>
              <div className="dash-widget-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 13, color: 'var(--gray-600)' }}><strong>Model:</strong> {v.model}</div>
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 8 }}>Documents ({v.documents?.length || 0})</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {v.documents?.map((doc, idx) => (
                        <a key={idx} href={doc.file} download={doc.name} style={{ background: 'var(--gray-50)', padding: '6px 12px', borderRadius: 8, fontSize: 11, color: 'var(--primary-600)', textDecoration: 'none', border: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <FiInfo size={10} /> {doc.name}
                        </a>
                      ))}
                      {v.documents?.length === 0 && <span style={{ fontSize: 11, color: 'var(--gray-400)', fontStyle: 'italic' }}>No documents uploaded</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="dash-widget">
          <div className="dash-widget-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 15 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="dash-widget-title"><FiInfo /> Fleet Odometer & Fuel Logs</span>
            </div>
            
            <div style={{ display: 'flex', gap: 10 }}>
              <select className="form-select form-select-sm" value={filterVeh} onChange={e => setFilterVeh(e.target.value)} style={{ flex: 1 }}>
                <option value="">All Vehicles</option>
                {vehicles.map(v => <option key={v.id} value={v.vehicleNo}>{v.vehicleNo}</option>)}
              </select>
              <select className="form-select form-select-sm" value={filterType} onChange={e => setFilterType(e.target.value)} style={{ flex: 1 }}>
                <option value="">All Cost Types</option>
                <option value="Fuel">Fuel Only</option>
                <option value="Maintenance">Maintenance Only</option>
                <option value="Both">Both (Fuel & Maint)</option>
              </select>
              <button className="btn btn-secondary btn-sm" onClick={() => { setFilterVeh(''); setFilterType('') }}>Reset</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 5 }}>
              <div style={{ background: 'var(--gray-50)', padding: '10px 15px', borderRadius: 12, border: '1px solid var(--gray-100)' }}>
                <div style={{ fontSize: 10, color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 700 }}>Total Fuel</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--error)' }}>₹{logStats.fuel.toLocaleString()}</div>
              </div>
              <div style={{ background: 'var(--gray-50)', padding: '10px 15px', borderRadius: 12, border: '1px solid var(--gray-100)' }}>
                <div style={{ fontSize: 10, color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 700 }}>Total Maint.</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-600)' }}>₹{logStats.maint.toLocaleString()}</div>
              </div>
              <div style={{ background: 'var(--gray-50)', padding: '10px 15px', borderRadius: 12, border: '1px solid var(--gray-100)' }}>
                <div style={{ fontSize: 10, color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 700 }}>Distance</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary-600)' }}>{logStats.dist.toLocaleString()} km</div>
              </div>
              <div style={{ background: 'var(--gray-50)', padding: '10px 15px', borderRadius: 12, border: '1px solid var(--gray-100)' }}>
                <div style={{ fontSize: 10, color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 700 }}>Avg. Mileage</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--success)' }}>{logStats.avgMileage} <small style={{ fontSize: 10 }}>km/L</small></div>
              </div>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th><th>Vehicle No.</th><th>Driver</th><th>Distance (km)</th><th>Fuel Cost (₹)</th><th>Maint. Cost (₹)</th><th>Mileage (km/L)</th><th>Remarks</th>
                  {isAdmin && <th style={{ textAlign: 'right' }}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: 30, color: 'var(--gray-400)' }}>No logs found matching filters.</td></tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id}>
                      <td>{log.date}</td>
                      <td><span className="badge badge-info">{log.vehicleNo}</span></td>
                      <td style={{ fontSize: 13, fontWeight: 500 }}>{log.driver || '---'}</td>
                      <td>{log.distance} km <span style={{ fontSize: 10, color: 'var(--gray-400)', display: 'block' }}>{log.startKm} - {log.endKm}</span></td>
                      <td style={{ color: 'var(--error)', fontWeight: 600 }}>₹{log.fuelCost || 0} <span style={{ fontSize: 10, color: 'var(--gray-400)', display: 'block' }}>{log.fuelLiters || 0} L</span></td>
                      <td style={{ color: 'var(--accent-600)', fontWeight: 600 }}>₹{log.maintCost || 0}</td>
                      <td>
                        <span className="badge" style={{ background: log.mileage < 3 ? 'var(--error)' : 'var(--success)', color: 'white' }}>
                          {log.mileage}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>{log.remarks || '---'}</td>
                      {isAdmin && (
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn btn-sm" style={{ padding: 4, background: 'none', border: 'none', color: 'var(--error)' }} onClick={() => handleDeleteLog(log)} title="Delete Log">
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setModal(null)}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 480, width: '100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><h3 style={{ fontWeight: 700, fontSize: 'var(--text-xl)' }}>{modal === 'add' ? 'Add Transport Route' : 'Edit Route'}</h3><button onClick={() => setModal(null)}><FiX /></button></div>
            <div className="form-group"><label className="form-label">Route Name *</label><input className="form-input" value={editData.route} onChange={e => setEditData({ ...editData, route: e.target.value })} placeholder="e.g. Route 1" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label className="form-label">Vehicle No</label>
                <select className="form-select" value={editData.vehicleNo} onChange={e => setEditData({ ...editData, vehicleNo: e.target.value })}>
                  <option value="">Select Vehicle...</option>
                  {vehicles.map(v => <option key={v.id} value={v.vehicleNo}>{v.vehicleNo} ({v.name})</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Driver Name</label><input className="form-input" value={editData.driver} onChange={e => setEditData({ ...editData, driver: e.target.value })} /></div>
            </div>
            <div className="form-group"><label className="form-label">Stops (Separated by arrows)</label><textarea className="form-input" value={editData.stops} onChange={e => setEditData({ ...editData, stops: e.target.value })} placeholder="A -> B -> School" /></div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}><button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}><FiSave /> Save Route</button><button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button></div>
          </div>
        </div>
      )}

      {logModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setLogModal(false)}>
          <form style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()} onSubmit={handleLogSave}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><h3 style={{ fontWeight: 700, fontSize: 'var(--text-xl)' }}>Add Fleet Odometer & Fuel Log</h3><button type="button" onClick={() => setLogModal(false)}><FiX /></button></div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" required value={logData.date} onChange={e => setLogData({ ...logData, date: e.target.value })} /></div>
              <div className="form-group">
                <label className="form-label">Vehicle No.</label>
                <select className="form-select" required value={logData.vehicleNo} onChange={e => setLogData({ ...logData, vehicleNo: e.target.value })}>
                  <option value="">Select Vehicle...</option>
                  {vehicles.map(v => <option key={v.id} value={v.vehicleNo}>{v.vehicleNo}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Log Type</label>
              <div style={{ display: 'flex', gap: 10, background: 'var(--gray-50)', padding: 4, borderRadius: 10 }}>
                {['Fuel', 'Maintenance', 'Both'].map(t => (
                  <button key={t} type="button" className={`btn btn-sm ${logData.logType === t ? 'btn-primary' : ''}`} 
                    style={{ flex: 1, background: logData.logType === t ? 'var(--primary-600)' : 'transparent', color: logData.logType === t ? 'white' : 'var(--gray-500)', border: 'none' }}
                    onClick={() => setLogData({ ...logData, logType: t })}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Driver Name</label>
              <input list="driver-options" className="form-input" required placeholder="Type driver name" value={logData.driver} onChange={e => setLogData({ ...logData, driver: e.target.value })} />
              <datalist id="driver-options">
                {Array.from(new Set(fleetLogs.map(l => l.driver).concat(routes.map(r => r.driver)))).filter(Boolean).map(d => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>
            
            {(logData.logType === 'Fuel' || logData.logType === 'Both') && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group"><label className="form-label">Start Reading (km)</label><input type="number" required className="form-input" value={logData.startKm} onChange={e => setLogData({ ...logData, startKm: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">End Reading (km)</label><input type="number" required className="form-input" value={logData.endKm} onChange={e => setLogData({ ...logData, endKm: e.target.value })} /></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group"><label className="form-label">Fuel Added (Liters)</label><input type="number" step="0.1" className="form-input" value={logData.fuelLiters} onChange={e => setLogData({ ...logData, fuelLiters: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Total Fuel Cost (₹)</label><input type="number" className="form-input" value={logData.fuelCost} onChange={e => setLogData({ ...logData, fuelCost: e.target.value })} /></div>
                </div>
              </>
            )}

            {(logData.logType === 'Maintenance' || logData.logType === 'Both') && (
              <div className="form-group">
                <label className="form-label">Maintenance / Service Cost (₹)</label>
                <input type="number" className="form-input" placeholder="0.00" value={logData.maintCost} onChange={e => setLogData({ ...logData, maintCost: e.target.value })} />
              </div>
            )}

            <div className="form-group"><label className="form-label">Remarks (Optional)</label><input className="form-input" value={logData.remarks} onChange={e => setLogData({ ...logData, remarks: e.target.value })} placeholder="Maintenance notes..." /></div>
            
            <div style={{ display: 'flex', gap: 12, marginTop: 15 }}><button type="submit" className="btn btn-primary w-full"><FiSave /> Save Log</button></div>
          </form>
        </div>
      )}

      {vehicleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setVehicleModal(null)}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 'var(--text-xl)' }}>{vehicleModal === 'add' ? 'Add New Vehicle' : 'Edit Vehicle'}</h3>
              <button onClick={() => setVehicleModal(null)}><FiX /></button>
            </div>
            
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
              <div className="form-group"><label className="form-label">Vehicle No *</label><input className="form-input" required value={vehData.vehicleNo} onChange={e => setVehData({ ...vehData, vehicleNo: e.target.value })} placeholder="e.g. DL-1PB-1234" /></div>
              <div className="form-group"><label className="form-label">Vehicle Name</label><input className="form-input" value={vehData.name} onChange={e => setVehData({ ...vehData, name: e.target.value })} placeholder="e.g. Bus 1" /></div>
            </div>
            
            <div className="form-group"><label className="form-label">Model / Specs</label><input className="form-input" value={vehData.model} onChange={e => setVehData({ ...vehData, model: e.target.value })} placeholder="e.g. Tata Starbus 2022" /></div>
            
            <div style={{ marginTop: 15 }}>
              <label className="form-label">Vehicle Documents</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                {vehData.documents?.map((doc, idx) => (
                  <div key={idx} style={{ background: 'var(--gray-50)', padding: '6px 12px', borderRadius: 8, fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, border: '1px solid var(--gray-100)' }}>
                    {doc.name}
                    <button onClick={() => setVehData({ ...vehData, documents: vehData.documents.filter((_, i) => i !== idx) })} style={{ color: 'var(--error)', marginLeft: 5 }}><FiX size={12} /></button>
                  </div>
                ))}
              </div>
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-block' }}>
                <FiPlus /> Upload Document
                <input type="file" hidden onChange={handleDocUpload} />
              </label>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 25 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleVehicleSave}><FiSave /> Save Vehicle</button>
              <button className="btn btn-secondary" onClick={() => setVehicleModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
