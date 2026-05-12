import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ERPLogin from './pages/ERPDashboard'
import { ProtectedRoute, RoleDashboard } from './components/ERPRouter'
import StudentsPage from './pages/erp/StudentsPage'
import StaffPage from './pages/erp/StaffPage'
import FeesPage from './pages/erp/FeesPage'
import ExpensesPage from './pages/erp/ExpensesPage'
import AttendancePage from './pages/erp/AttendancePage'
import ExamsPage from './pages/erp/ExamsPage'
import TimetablePage from './pages/erp/TimetablePage'
import TransportPage from './pages/erp/TransportPage'
import LibraryPage from './pages/erp/LibraryPage'
import NoticesPage from './pages/erp/NoticesPage'
import MessagesPage from './pages/erp/MessagesPage'
import HomeworkPage from './pages/erp/HomeworkPage'
import SettingsPage from './pages/erp/SettingsPage'
import CertificateDesigner from './pages/erp/CertificateDesigner'
import IDCardDesigner from './pages/erp/IDCardDesigner'
import PromotionPage from './pages/erp/PromotionPage'
import MarkAttendancePage from './pages/erp/MarkAttendancePage'
import MyClassesPage from './pages/erp/MyClassesPage'
import StudentProfilePage from './pages/erp/StudentProfilePage'
import StaffAttendancePage from './pages/erp/StaffAttendancePage'
import AgencyHome from './pages/AgencyHome'
import ServicesPage from './pages/ServicesPage'
import ContactPage from './pages/ContactPage'
import AgencyLogin from './pages/AgencyLogin'
import AgencyDashboard from './pages/AgencyDashboard'
import DemosPage from './pages/DemosPage'
import SchoolLandingPage from './pages/SchoolLandingPage'
import CBSEWebsite from './pages/CBSEWebsite'
import NMSWebsite from './pages/demos/NMSWebsite'
import QuantumWebsite from './pages/demos/QuantumWebsite'
import HeritageWebsite from './pages/demos/HeritageWebsite'
import StarlightWebsite from './pages/demos/StarlightWebsite'





function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Agency Management Routes */}
        <Route path="/agency/login" element={<AgencyLogin />} />
        <Route path="/agency/dashboard" element={<AgencyDashboard />} />

        {/* Public Agency Landing Page */}
        <Route path="/" element={<AgencyHome />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/demos" element={<DemosPage />} />
        <Route path="/contact" element={<ContactPage />} />

        
        {/* Dynamic School Path: /schoolId/erp */}
        <Route path="/:schoolId/erp">
          <Route index element={<ERPLogin />} />
          <Route path="dashboard" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
          <Route path="students" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
          <Route path="staff" element={<ProtectedRoute><StaffPage /></ProtectedRoute>} />
          <Route path="fees" element={<ProtectedRoute><FeesPage /></ProtectedRoute>} />
          <Route path="expenses" element={<ProtectedRoute role={['admin']}><ExpensesPage /></ProtectedRoute>} />
          <Route path="attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
          <Route path="exams" element={<ProtectedRoute><ExamsPage /></ProtectedRoute>} />
          <Route path="marks" element={<ProtectedRoute><ExamsPage /></ProtectedRoute>} />
          <Route path="timetable" element={<ProtectedRoute><TimetablePage /></ProtectedRoute>} />
          <Route path="transport" element={<ProtectedRoute><TransportPage /></ProtectedRoute>} />
          <Route path="library" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
          <Route path="notices" element={<ProtectedRoute><NoticesPage /></ProtectedRoute>} />
          <Route path="messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="homework" element={<ProtectedRoute><HomeworkPage /></ProtectedRoute>} />
          <Route path="results" element={<ProtectedRoute><ExamsPage /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="certificate-design" element={<ProtectedRoute role={['admin']}><CertificateDesigner /></ProtectedRoute>} />
          <Route path="id-card-design" element={<ProtectedRoute role={['admin']}><IDCardDesigner /></ProtectedRoute>} />
          <Route path="promotion" element={<ProtectedRoute role={['admin']}><PromotionPage /></ProtectedRoute>} />
          <Route path="mark-attendance" element={<ProtectedRoute role={['admin', 'teacher']}><MarkAttendancePage /></ProtectedRoute>} />
          <Route path="my-classes" element={<ProtectedRoute role={['teacher']}><MyClassesPage /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute role={['student']}><StudentProfilePage /></ProtectedRoute>} />
          <Route path="children" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute><ExamsPage /></ProtectedRoute>} />
          <Route path="staff-attendance" element={<ProtectedRoute role={['admin', 'teacher']}><StaffAttendancePage /></ProtectedRoute>} />
        </Route>

        {/* Dynamic School Landing Page: /schoolId */}
        <Route path="/nms" element={<NMSWebsite />} />
        <Route path="/quantum" element={<QuantumWebsite />} />
        <Route path="/heritage" element={<HeritageWebsite />} />
        <Route path="/starlight" element={<StarlightWebsite />} />
        <Route path="/:schoolId" element={<CBSEWebsite />} />




        {/* Legacy /erp fallback (redirects to nms/erp) */}
        <Route path="/erp/*" element={<Navigate to="/nms/erp" replace />} />

        {/* Catch-all: redirect any other route to Agency Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
