import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FiGrid, FiUsers, FiDollarSign, FiCalendar, FiFileText,
  FiClock, FiTruck, FiBookOpen, FiBarChart2, FiSettings,
  FiLogOut, FiBell, FiMenu, FiX, FiChevronDown, FiSearch,
  FiUser, FiMessageCircle, FiHome, FiCheckSquare, FiClipboard,
  FiBook, FiAward, FiLayout, FiArrowUp, FiActivity
} from 'react-icons/fi'
import './DashboardLayout.css'

export default function DashboardLayout({ children }) {
  const { user, logout, school } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const prefix = `/${school.key}/erp`

  const NAV_ITEMS = {
    admin: [
      { icon: <FiGrid />, label: 'Dashboard', path: `${prefix}/dashboard` },
      { icon: <FiUsers />, label: 'Students', path: `${prefix}/students` },
      { icon: <FiUser />, label: 'Staff', path: `${prefix}/staff` },
      { icon: <FiDollarSign />, label: 'Fee Management', path: `${prefix}/fees` },
      { icon: <FiClock />, label: 'Student Attendance', path: `${prefix}/attendance` },
      { icon: <FiActivity />, label: 'Staff Attendance', path: `${prefix}/staff-attendance` },
      { icon: <FiCheckSquare />, label: 'Mark Todays attendance', path: `${prefix}/mark-attendance` },
      { icon: <FiFileText />, label: 'Exams & Results', path: `${prefix}/exams` },
      { icon: <FiCalendar />, label: 'Timetable', path: `${prefix}/timetable` },
      { icon: <FiTruck />, label: 'Transport', path: `${prefix}/transport` },
      { icon: <FiDollarSign />, label: 'Expenses', path: `${prefix}/expenses` },
      { icon: <FiBell />, label: 'Notices', path: `${prefix}/notices` },
      { icon: <FiMessageCircle />, label: 'Messages', path: `${prefix}/messages` },
      { icon: <FiSettings />, label: 'Settings', path: `${prefix}/settings` },
    ],
    teacher: [
      { icon: <FiGrid />, label: 'Dashboard', path: `${prefix}/dashboard` },
      { icon: <FiUsers />, label: 'My Classes', path: `${prefix}/my-classes` },
      { icon: <FiClock />, label: 'Student Attendance', path: `${prefix}/attendance` },
      { icon: <FiCheckSquare />, label: 'Mark Todays attendance', path: `${prefix}/mark-attendance` },
      { icon: <FiClipboard />, label: 'Marks Entry', path: `${prefix}/marks` },
      { icon: <FiBook />, label: 'Homework', path: `${prefix}/homework` },
      { icon: <FiCalendar />, label: 'Timetable', path: `${prefix}/timetable` },
      { icon: <FiBell />, label: 'Notices', path: `${prefix}/notices` },
      { icon: <FiMessageCircle />, label: 'Messages', path: `${prefix}/messages` },
      { icon: <FiSettings />, label: 'Profile', path: `${prefix}/settings` },
    ],
    student: [
      { icon: <FiGrid />, label: 'Dashboard', path: `${prefix}/dashboard` },
      { icon: <FiUser />, label: 'My Personal Details', path: `${prefix}/profile` },
      { icon: <FiClock />, label: 'My Attendance History', path: `${prefix}/attendance` },
      { icon: <FiAward />, label: 'My Results', path: `${prefix}/results` },
      { icon: <FiBook />, label: 'Homework', path: `${prefix}/homework` },
      { icon: <FiCalendar />, label: 'Timetable', path: `${prefix}/timetable` },
      { icon: <FiDollarSign />, label: 'Fee Details', path: `${prefix}/fees` },
      { icon: <FiBell />, label: 'Notices', path: `${prefix}/notices` },
      { icon: <FiMessageCircle />, label: 'Messages', path: `${prefix}/messages` },
      { icon: <FiSettings />, label: 'Profile', path: `${prefix}/settings` },
    ],
  }

  const navItems = NAV_ITEMS[user?.role] || []

  const handleLogout = () => {
    logout()
    navigate(prefix)
  }

  const roleColors = {
    admin: 'var(--primary-500)',
    teacher: 'var(--accent-500)',
    student: '#8b5cf6',
  }

  return (
    <div className="dash-layout">
      <aside className={`dash-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="dash-sidebar-header">
          <Link to={prefix} className="dash-logo">
            <div className="dash-logo-icon" style={{ background: school.logoColor, overflow: 'hidden' }}>
              {school.logo ? <img src={school.logo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="logo" /> : school.logoText}
            </div>
            <div className="dash-logo-text">
              <span className="dash-logo-name">{school.shortName} ERP</span>
              <span className="dash-logo-role">{user?.role?.toUpperCase()} PANEL</span>
            </div>
          </Link>
          <button className="dash-sidebar-close" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

        <div className="dash-sidebar-user">
          <div className="dash-avatar" style={{ background: roleColors[user?.role], overflow: 'hidden' }}>
            {user?.photo ? (
              <img src={user.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
            ) : (
              user?.avatar
            )}
          </div>
          <div className="dash-user-info">
            <span className="dash-user-name">{user?.name}</span>
            <span className="dash-user-role">{user?.designation || user?.role}</span>
          </div>
        </div>

        <nav className="dash-nav">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`dash-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <button className="dash-nav-item logout-btn" onClick={handleLogout}>
            <FiLogOut /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="dash-main">
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <button className="dash-menu-btn" onClick={() => setSidebarOpen(true)}>
              <FiMenu />
            </button>
            <div className="dash-search">
              <FiSearch />
              <input type="text" placeholder="Search students, classes, reports..." />
            </div>
          </div>
          <div className="dash-topbar-right">
            <button className="dash-topbar-icon">
              <FiBell />
              <span className="dash-notif-dot" />
            </button>
            <button className="dash-topbar-icon">
              <FiMessageCircle />
              <span className="dash-notif-dot" />
            </button>
            <div className="dash-profile-wrapper">
              <button className="dash-profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                <div className="dash-avatar-sm" style={{ background: roleColors[user?.role], overflow: 'hidden' }}>
                  {user?.photo ? (
                    <img src={user.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
                  ) : (
                    user?.avatar
                  )}
                </div>
                <span className="dash-profile-name">{user?.name?.split(' ')[0]}</span>
                <FiChevronDown size={14} />
              </button>
              {profileOpen && (
                <div className="dash-profile-dropdown">
                  <div className="dash-profile-info">
                    <strong>{user?.name}</strong>
                    <span>{user?.email}</span>
                    <span className="dash-role-badge" style={{ background: `${roleColors[user?.role]}20`, color: roleColors[user?.role] }}>
                      {user?.role?.toUpperCase()}
                    </span>
                  </div>
                  <div className="dash-profile-actions">
                    <Link to={`${prefix}/settings`} onClick={() => setProfileOpen(false)}>
                      <FiSettings /> Settings
                    </Link>
                    <button onClick={handleLogout}>
                      <FiLogOut /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="dash-content">
          {children}
        </div>
      </div>
    </div>
  )
}
