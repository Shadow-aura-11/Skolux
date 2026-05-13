import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'
import { getActiveSchool } from '../config/schools'

const AuthContext = createContext(null)

/* ──────────────────────────────────────────────
   MOCK USERS  (role → credentials → profile)
   ────────────────────────────────────────────── */
const USERS = [
  {
    id: 'ADM001',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Dr. Rajesh Kumar',
    designation: 'System Administrator',
    email: 'admin@newmorningstar.edu.in',
    avatar: 'RK',
  },
]

/* ──────────────────────────────────────────────
   MOCK DATA  — shared across dashboards
   ────────────────────────────────────────────── */
export const MOCK_DATA = {
  /* ── students ── */
  students: [],

  /* ── attendance ── */
  attendanceLog: [],

  /* ── timetable ── */
  timetable: {
    'Monday':    [],
    'Tuesday':   [],
    'Wednesday': [],
    'Thursday':  [],
    'Friday':    [],
    'Saturday':  [],
  },
  periods: ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM'],

  /* ── exam types ── */
  examTypes: ['FA1', 'FA2', 'SA1', 'FA3', 'FA4', 'SA2'],

  /* ── student detailed results ── */
  studentResults: {},

  /* ── homework (Educational) ── */
  homework: [],

  /* ── fees (Educational) ── */
  studentFees: {},

  /* ── notices (Feature Explanations) ── */
  notices: [],

  /* ── messages ── */
  messages: [],

  /* ── staff ── */
  staff: [],

  /* ── transport ── */
  transport: [],

  /* ── classes & sections ── */
  classesAndSections: [],
  availableClasses: ['UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'],
}

/* ──────────────────────────────────────────────
   SESSION UTILITIES
   ────────────────────────────────────────────── */

/** Dynamic prefix for storage based on subdomain/hash path */
const getStoragePrefix = () => {
  const school = getActiveSchool();
  return `erp_${school.key || 'nms'}`;
};

/** Dynamic list of academic sessions */
export function getStoredSessions() {
  const prefix = getStoragePrefix();
  const saved = localStorage.getItem(`${prefix}_sessions_list`)
  return saved ? JSON.parse(saved) : ["2023-24", "2024-25", "2025-26"]
}

/** Fee localStorage key per session */
export const feeKey = (session) => {
  const prefix = getStoragePrefix();
  return `${prefix}_fees_${session}`;
}

/** General data localStorage key per session (homework, attendance, etc.) */
export const dataKey = (session) => {
  const prefix = getStoragePrefix();
  return `${prefix}_data_${session}`;
}

/** Get fees for a student in a specific session */
export function getSessionFees(studentId, session) {
  const stored = localStorage.getItem(feeKey(session))
  const data = stored ? JSON.parse(stored) : {}
  return data[studentId] || null
}

/** Get all data for a specific session */
export function getSessionStore(session) {
  const stored = localStorage.getItem(dataKey(session))
  if (stored) return JSON.parse(stored)

  return { 
    homework: [], 
    attendance: [], 
    results: {}, 
    notices: [],
    feeStats: { collected: 0, pending: 0, overdue: 0, total: 0 } 
  }
}

/** Save data for a specific session */
export function saveSessionStore(session, data) {
  localStorage.setItem(dataKey(session), JSON.stringify(data))
}

/** Save fees for a student in a specific session */
export function saveSessionFees(studentId, session, record, allRecords) {
  const key = feeKey(session)
  const updated = { ...allRecords, [studentId]: record }
  localStorage.setItem(key, JSON.stringify(updated))
  return updated
}


/* ──────────────────────────────────────────────
   AUTH PROVIDER
   ────────────────────────────────────────────── */
export const AuthProvider = ({ children }) => {
  const prefix = getStoragePrefix();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(`${prefix}_user`)
    return saved ? JSON.parse(saved) : null
  })
  const [agencyUser, setAgencyUser] = useState(() => {
    const saved = localStorage.getItem('agency_admin_user')
    return saved ? JSON.parse(saved) : null
  })
  const [school, setSchool] = useState(getActiveSchool())
  const [sessions, setSessions] = useState(getStoredSessions)
  const [currentSession, setCurrentSession] = useState(() => {
    return localStorage.getItem(`${prefix}_session`) || '2026-27'
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSessions = async () => {
      const serverSessions = await api.get('sessions_list')
      if (serverSessions && Array.isArray(serverSessions) && serverSessions.length > 0) {
        setSessions(serverSessions)
      }
    }
    loadSessions()
  }, [])

  useEffect(() => {
    const prefix = getStoragePrefix();
    if (user) localStorage.setItem(`${prefix}_user`, JSON.stringify(user))
    else localStorage.removeItem(`${prefix}_user`)
  }, [user])

  useEffect(() => {
    const prefix = getStoragePrefix();
    localStorage.setItem(`${prefix}_sessions_list`, JSON.stringify(sessions))
    api.save('sessions_list', sessions)
  }, [sessions])

  useEffect(() => {
    const prefix = getStoragePrefix();
    localStorage.setItem(`${prefix}_session`, currentSession)
  }, [currentSession])

  useEffect(() => {
    if (agencyUser) localStorage.setItem('agency_admin_user', JSON.stringify(agencyUser))
    else localStorage.removeItem('agency_admin_user')
  }, [agencyUser])

  const login = (username, password) => {
    setError('')
    
    // 1. Check School-Specific Credentials (Admin/Teacher)
    if (school) {
      const u = username.toLowerCase()
      // Admin Check (Now pulled directly from school config)
      const schoolAdminUser = school.adminUsername
      const schoolAdminPass = school.adminPassword
      
      if (schoolAdminUser && u === schoolAdminUser.toLowerCase() && password === schoolAdminPass) {
        setUser({
          id: `ADM_${school.key.toUpperCase()}`,
          username: schoolAdminUser,
          role: 'admin',
          name: `${school.shortName} Admin`,
          designation: 'Principal / Director',
          avatar: school.logoText || 'AD'
        })
        return true
      }

      // Teacher Check (Now pulled directly from school config)
      const schoolTeacherUser = school.teacherUsername
      const schoolTeacherPass = school.teacherPassword
      
      if (schoolTeacherUser && u === schoolTeacherUser.toLowerCase() && password === schoolTeacherPass) {
        setUser({
          id: `TEA_${school.key.toUpperCase()}`,
          username: schoolTeacherUser,
          role: 'teacher',
          name: `${school.shortName} Teacher`,
          designation: 'Faculty Member',
          avatar: 'TE'
        })
        return true
      }

      // Staff Check (Dynamic via Staff Module)
      const staffKey = `erp_${school.key}_staff_global`
      const staffList = JSON.parse(localStorage.getItem(staffKey) || '[]')
      const staffFound = staffList.find(
        s => s.username?.toLowerCase() === username.toLowerCase() && s.password === password
      )

      if (staffFound) {
        setUser({
          id: staffFound.id,
          username: staffFound.username,
          role: 'teacher',
          name: staffFound.name,
          designation: staffFound.designation,
          avatar: staffFound.name?.[0] || 'T',
          ...staffFound
        })
        return true
      }
    }

    // 2. Check Dynamic Users (Students)
    const stuKey = `erp_${school.key}_students_${currentSession}`
    const studentsList = JSON.parse(localStorage.getItem(stuKey) || localStorage.getItem(`erp_${school.key}_students`) || '[]')
    const found = studentsList.find(
      u => u.username?.toLowerCase() === username.toLowerCase() && u.password === password
    )
    if (found) {
      setUser({
        id: found.id,
        username: found.username,
        role: 'student',
        name: found.name,
        class: found.class,
        avatar: found.name?.[0] || 'S',
        ...found
      })
      return true
    }

    setError('Invalid username or password for this school.')
    return false
  }

  const logout = () => {
    setUser(null)
    setError('')
  }

  const agencyLogin = (username, password) => {
    setError('')
    // Hardcoded Skolux Agency Admin
    if (username === 'admin' && password === 'skolux123') {
      const admin = { id: 'AGENCY001', name: 'Skolux Admin', role: 'agency' }
      setAgencyUser(admin)
      return true
    }
    setError('Invalid Skolux agency credentials.')
    return false
  }

  const agencyLogout = () => {
    setAgencyUser(null)
    setError('')
  }

  const updateSession = (year) => {
    setCurrentSession(year)
  }

  const addSession = (year) => {
    if (!sessions.includes(year)) {
      const newSessions = [...sessions, year].sort()
      setSessions(newSessions)
      
      // Initialize unique data for this session
      const initialData = {
        homework: [
          { id: Date.now(), subject: 'General', title: 'Welcome to ' + year, assignedBy: 'Admin', date: new Date().toISOString().split('T')[0], due: '', status: 'Pending', desc: 'Auto-initialized session.' }
        ],
        attendance: [],
        notices: [
          { id: 'start-' + year, title: 'New Academic Year Started: ' + year, date: new Date().toISOString().split('T')[0], category: 'General', priority: 'high', desc: 'All modules are now active for ' + year }
        ],
        results: {},
        feeStats: { collected: 0, pending: 0, overdue: 0, total: 2500000 }
      }
      localStorage.setItem(dataKey(year), JSON.stringify(initialData))

      // Carry over static configurations from currentSession
      const classData = localStorage.getItem(`${prefix}_classes_${currentSession}`) || localStorage.getItem(`${prefix}_classes`)
      if (classData) localStorage.setItem(`${prefix}_classes_${year}`, classData)

      const transportData = localStorage.getItem(`${prefix}_transport_${currentSession}`) || localStorage.getItem(`${prefix}_transport`)
      if (transportData) localStorage.setItem(`${prefix}_transport_${year}`, transportData)

      const feeConfigData = localStorage.getItem(`${prefix}_global_fee_config_${currentSession}`) || localStorage.getItem(`${prefix}_global_fee_config`)
      if (feeConfigData) localStorage.setItem(`${prefix}_global_fee_config_${year}`, feeConfigData)

      return true
    }
    return false
  }

  const deleteSession = (year) => {
    if (year === currentSession) return false
    const newSessions = sessions.filter(s => s !== year)
    setSessions(newSessions)
    
    // Wipe session-specific data
    localStorage.removeItem(dataKey(year))
    localStorage.removeItem(feeKey(year))
    return true
  }

  const updateProfile = (data) => {
    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    
    // Also update dynamic users list if this is a non-admin user
    const dynamicUsers = JSON.parse(localStorage.getItem(`${prefix}_dynamic_users`) || '[]')
    const updatedList = dynamicUsers.map(u => u.id === user.id ? { ...u, ...data } : u)
    if (dynamicUsers.length > 0) {
      localStorage.setItem(`${prefix}_dynamic_users`, JSON.stringify(updatedList))
      api.save('dynamic_users', updatedList)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, school, agencyUser, login, logout, agencyLogin, agencyLogout, error, setError, 
      currentSession, updateSession,
      sessions, addSession, deleteSession,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

/** Compute total unpaid carry-forward from all previous sessions */
export function getPreviousSessionsDue(studentId, currentSession, allSessions) {
  const sessionsList = allSessions || getStoredSessions()
  const currentIndex = sessionsList.indexOf(currentSession)
  if (currentIndex <= 0) return []
  const pastSessions = sessionsList.slice(0, currentIndex)
  const dues = []
  for (const session of pastSessions) {
    const rec = getSessionFees(studentId, session)
    if (rec && rec.remaining > 0) {
      dues.push({ session, remaining: rec.remaining })
    }
  }
  return dues
}

/** Compute total unpaid carry-forward from all previous sessions for all students */
export function getTotalPastDues(currentSession, allSessions, students) {
  const sessionsList = allSessions || getStoredSessions()
  const currentIndex = sessionsList.indexOf(currentSession)
  if (currentIndex <= 0) return 0
  
  const pastSessions = sessionsList.slice(0, currentIndex)
  let total = 0
  
  for (const session of pastSessions) {
    const stored = localStorage.getItem(feeKey(session))
    if (!stored) continue
    const data = JSON.parse(stored)
    Object.values(data).forEach(rec => {
      if (rec && rec.remaining > 0) total += rec.remaining
    })
  }
  return total
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

