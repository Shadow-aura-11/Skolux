import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { api } from '../utils/api'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { currentSession, school } = useAuth()

  // 1. Centralized State
  const [students, setStudents] = useState([])
  const [staff, setStaff] = useState([])
  const [generalExpenses, setGeneralExpenses] = useState([])
  const [fleetLogs, setFleetLogs] = useState([])
  const [transportRoutes, setTransportRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  // Session specific states
  const [attendance, setAttendance] = useState([])
  const [marks, setMarks] = useState({})
  const [homework, setHomework] = useState([])
  const [notices, setNotices] = useState([])
  const [feeStats, setFeeStats] = useState({ collected: 0, pending: 0, overdue: 0, total: 2500000 })
  const [holidays, setHolidays] = useState(['2026-01-26', '2026-08-15', '2026-10-02'])
  
  const [vehicles, setVehicles] = useState([])
  const [classes, setClasses] = useState([])
  const [refreshTick, setRefreshTick] = useState(0)

  // Tenant-aware storage keys
  const getPrefix = useCallback(() => school.key || 'default', [school.key])
  const getStoreKey = useCallback((type, session) => `erp_${getPrefix()}_${type}${session ? '_' + session : ''}`, [getPrefix])

  // Load data when session or school changes
  useEffect(() => {
    const loadData = async () => {
      if (!school?.key) return
      setLoading(true)
      
      try {
        // Fetch Students
        const serverStudents = await api.get('students', currentSession)
        setStudents(Array.isArray(serverStudents) ? serverStudents : [])

        // Fetch Staff
        const serverStaff = await api.get('staff')
        setStaff(Array.isArray(serverStaff) ? serverStaff : [])

        // Fetch Session specific data
        const serverSessionData = await api.get('session_data', currentSession)
        if (serverSessionData && !Array.isArray(serverSessionData)) {
          setAttendance(serverSessionData.attendance || [])
          setMarks(serverSessionData.results || {})
          setHomework(serverSessionData.homework || [])
          setNotices(serverSessionData.notices || [])
          setFeeStats(serverSessionData.feeStats || { collected: 0, pending: 0, overdue: 0, total: 2500000 })
        } else {
          // Fallback to local store logic
          const localData = JSON.parse(localStorage.getItem(getStoreKey('session_data', currentSession)) || '{}')
          setAttendance(localData.attendance || [])
          setMarks(localData.results || {})
          setHomework(localData.homework || [])
          setNotices(localData.notices || [])
          setFeeStats(localData.feeStats || { collected: 0, pending: 0, overdue: 0, total: 2500000 })
        }

        // Fetch Transport
        const serverRoutes = await api.get('transport', currentSession)
        setTransportRoutes(Array.isArray(serverRoutes) ? serverRoutes : [])

        // Fetch Expenses & Fleet
        const serverExpenses = await api.get('expenses', currentSession)
        setGeneralExpenses(Array.isArray(serverExpenses) ? serverExpenses : [])
        
        const serverFleet = await api.get('fleet_logs', currentSession)
        setFleetLogs(Array.isArray(serverFleet) ? serverFleet : [])

        const serverVehicles = await api.get('vehicles')
        setVehicles(Array.isArray(serverVehicles) ? serverVehicles : [])

        // Fetch Classes
        const serverClasses = await api.get('classes', currentSession)
        if (Array.isArray(serverClasses)) {
          setClasses(serverClasses)
        } else {
          const localClasses = JSON.parse(localStorage.getItem(getStoreKey('classes', currentSession)) || localStorage.getItem(getStoreKey('classes')) || '[]')
          setClasses(localClasses)
        }
      } catch (error) {
        console.error("Data loading failed:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentSession, school.key, getStoreKey])

  // 1.5. Dynamic Fee Statistics Calculation
  useEffect(() => {
    if (!school?.key) return
    const prefix = school.key;
    const feeKeyStr = `erp_${prefix}_fees_${currentSession}`
    const currentFees = JSON.parse(localStorage.getItem(feeKeyStr) || '{}')
    const globalFeeConfig = JSON.parse(localStorage.getItem(`erp_${prefix}_global_fee_config`) || '{"classFees":{},"transportFees":{}}')
    
    let totalCollected = 0
    let totalPending = 0
    let totalExpected = 0
    
    students.forEach(student => {
      const feeRecord = currentFees[student.id]
      
      if (feeRecord) {
        totalCollected += Number(feeRecord.paid || 0)
        totalPending += Number(feeRecord.remaining || 0)
        totalExpected += (Number(feeRecord.total || 0) + Number(feeRecord.prevSessionDues || 0))
      } else {
        const classFee = Number(globalFeeConfig.classFees?.[student.class] || 40000)
        const transportFee = Number(globalFeeConfig.transportFees?.[student.transportRoute] || 0)
        const estimatedTotal = classFee + transportFee
        totalExpected += estimatedTotal
        totalPending += estimatedTotal
      }
    })
    
    setFeeStats({
      collected: totalCollected,
      pending: totalPending,
      total: totalExpected,
      overdue: totalPending
    })
  }, [students, currentSession, refreshTick, school.key])

  const refreshData = useCallback(async () => {
    if (!school?.key) return
    setLoading(true)
    const serverStudents = await api.get('students', currentSession)
    setStudents(Array.isArray(serverStudents) ? serverStudents : [])
    
    const serverStaff = await api.get('staff')
    setStaff(Array.isArray(serverStaff) ? serverStaff : [])
    
    setRefreshTick(t => t + 1)
    setLoading(false)
  }, [currentSession, school.key])

  // Cross-Tab Support
  useEffect(() => {
    if (!school?.key) return
    const handleStorageChange = (e) => {
      if (e.key === getStoreKey('students', currentSession)) setStudents(JSON.parse(e.newValue))
      if (e.key === getStoreKey('staff')) setStaff(JSON.parse(e.newValue))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [currentSession, school.key, getStoreKey])

  // Update Helpers
  const updateStudents = useCallback((newData) => {
    setStudents(newData)
    api.save('students', newData, currentSession)
  }, [currentSession])

  const updateStaff = useCallback((newData) => {
    setStaff(newData)
    api.save('staff', newData)
  }, [])

  const updateAttendance = useCallback((newData) => {
    setAttendance(newData)
    const currentData = { attendance: newData, results: marks, homework, notices, feeStats }
    api.save('session_data', currentData, currentSession)
    localStorage.setItem(getStoreKey('session_data', currentSession), JSON.stringify(currentData))
  }, [currentSession, marks, homework, notices, feeStats, getStoreKey])

  const updateMarks = useCallback((newData) => {
    setMarks(newData)
    const currentData = { attendance, results: newData, homework, notices, feeStats }
    api.save('session_data', currentData, currentSession)
    localStorage.setItem(getStoreKey('session_data', currentSession), JSON.stringify(currentData))
  }, [currentSession, attendance, homework, notices, feeStats, getStoreKey])

  const updateHomework = useCallback((newData) => {
    setHomework(newData)
    const currentData = { attendance, results: marks, homework: newData, notices, feeStats }
    api.save('session_data', currentData, currentSession)
    localStorage.setItem(getStoreKey('session_data', currentSession), JSON.stringify(currentData))
  }, [currentSession, attendance, marks, notices, feeStats, getStoreKey])

  const updateNotices = useCallback((newData) => {
    setNotices(newData)
    const currentData = { attendance, results: marks, homework, notices: newData, feeStats }
    api.save('session_data', currentData, currentSession)
    localStorage.setItem(getStoreKey('session_data', currentSession), JSON.stringify(currentData))
  }, [currentSession, attendance, marks, homework, feeStats, getStoreKey])

  const updateFeeStats = useCallback((newData) => {
    setFeeStats(newData)
    const currentData = { attendance, results: marks, homework, notices, feeStats: newData }
    api.save('session_data', currentData, currentSession)
    localStorage.setItem(getStoreKey('session_data', currentSession), JSON.stringify(currentData))
  }, [currentSession, attendance, marks, homework, notices, getStoreKey])

  const updateHolidays = useCallback((newData) => {
    setHolidays(newData)
    api.save('holidays', newData)
  }, [])

  const updateExpenses = useCallback((newData) => {
    setGeneralExpenses(newData)
    api.save('expenses', newData, currentSession)
  }, [currentSession])

  const updateFleetLogs = useCallback((newData) => {
    setFleetLogs(newData)
    api.save('fleet_logs', newData, currentSession)
  }, [currentSession])

  const updateVehicles = useCallback((newData) => {
    setVehicles(newData)
    api.save('vehicles', newData)
  }, [])

  const value = {
    students, updateStudents,
    staff, updateStaff,
    attendance, updateAttendance,
    marks, updateMarks,
    homework, updateHomework,
    notices, updateNotices,
    feeStats, updateFeeStats,
    holidays, updateHolidays,
    generalExpenses, updateExpenses,
    fleetLogs, updateFleetLogs,
    vehicles, updateVehicles,
    classes, updateClasses: (d) => { 
      setClasses(d); 
      api.save('classes', d, currentSession);
      localStorage.setItem(getStoreKey('classes', currentSession), JSON.stringify(d));
    },
    transportRoutes, updateTransportRoutes: (d) => { 
      setTransportRoutes(d);
      api.save('transport', d, currentSession); 
      localStorage.setItem(getStoreKey('transport', currentSession), JSON.stringify(d));
    },
    refreshData,
    loading
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within DataProvider')
  return context
}
