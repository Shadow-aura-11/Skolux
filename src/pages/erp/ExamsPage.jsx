import { useState, useMemo, useEffect } from 'react'
import { useAuth, MOCK_DATA } from '../../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { exportToCSV } from '../../utils/exportUtils'
import { generatePDF } from '../../utils/pdfUtils'
import { FiAward, FiCheckCircle, FiEdit3, FiSave, FiX, FiFilter, FiTrendingUp, FiFileText, FiDownload, FiSearch, FiUser, FiChevronRight, FiPrinter, FiLayout } from 'react-icons/fi'

export default function ExamsPage() {
  const { user, currentSession } = useAuth()
  const navigate = useNavigate()
  const { schoolId } = useParams()
  const { marks: marksData, updateMarks, students = [] } = useData() || {}
  const isAdmin = user?.role === 'admin'
  const isTeacher = user?.role === 'teacher'
  const isStudent = user?.role === 'student'
  const isParent = user?.role === 'parent'

  // Filter States
  const [selectedClass, setSelectedClass] = useState('10th')
  const [selectedSection, setSelectedSection] = useState('A')
  const [selectedExam, setSelectedExam] = useState('')
  const [search, setSearch] = useState('')
  const [printStudent, setPrintStudent] = useState(null)

  // Dynamic Exam Settings
  const examTypes = useMemo(() => {
    const saved = localStorage.getItem(`erp_${schoolId}_exam_types_${currentSession}`)
    return saved ? JSON.parse(saved) : ['FA1', 'FA2', 'SA1', 'FA3', 'FA4', 'SA2']
  }, [currentSession, schoolId])

  const examConfig = useMemo(() => {
    const saved = localStorage.getItem(`erp_${schoolId}_exam_config_${currentSession}`)
    return saved ? JSON.parse(saved) : {}
  }, [currentSession, schoolId])

  useEffect(() => {
    if (examTypes.length > 0 && !selectedExam) setSelectedExam(examTypes[0])
  }, [examTypes, selectedExam])
  

  const [isEditing, setIsEditing] = useState(false)
  const [editBuffer, setEditBuffer] = useState({}) // studentId -> subject -> mark

  // Derived Data
  const globalClasses = useMemo(() => {
    return JSON.parse(localStorage.getItem(`erp_${schoolId}_classes_${currentSession}`) || localStorage.getItem(`erp_${schoolId}_classes`) || '[]')
  }, [currentSession, schoolId])

  const classes = globalClasses.length > 0 ? globalClasses.map(c => c.class) : ['UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']
  const selectedClassObj = globalClasses.find(c => c.class === selectedClass)
  const sections = ['-', ...(selectedClassObj ? selectedClassObj.sections.map(s => s.name) : ['A', 'B', 'C', 'D'])]
  const subjects = selectedClassObj?.subjects || ['English', 'Hindi', 'Mathematics', 'Science', 'Social Sc.']
  
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const sClass = s.class || ''
      const sSection = s.section || 'A'
      const matchesClass = selectedClass ? sClass === selectedClass : true
      const matchesSection = selectedSection && selectedSection !== '-' ? sSection === selectedSection : true
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
      return matchesClass && matchesSection && matchesSearch
    })
  }, [selectedClass, selectedSection, search, students])

  const handleStartEdit = () => {
    const buffer = {}
    filteredStudents.forEach(s => {
      const studentMarks = (marksData[s.id] || {})[selectedExam] || []
      buffer[s.id] = {}
      subjects.forEach(sub => {
        const markObj = studentMarks.find(m => m.subject === sub)
        buffer[s.id][sub] = markObj ? markObj.marks : ''
      })
    })
    setEditBuffer(buffer)
    setIsEditing(true)
  }

  const handleSaveAll = () => {
    const newMarksData = { ...marksData }
    Object.keys(editBuffer).forEach(sid => {
      if (!newMarksData[sid]) newMarksData[sid] = {}
      newMarksData[sid][selectedExam] = subjects.map(sub => ({
        subject: sub,
        marks: editBuffer[sid][sub] || 0,
        max: Number(examConfig[`${selectedExam}_${selectedClass}_${sub}`]) || 100
      }))
    })
    updateMarks(newMarksData)
    setIsEditing(false)
  }

  const getStudentTotal = (sid) => {
    const sMarks = (marksData[sid] || {})[selectedExam] || []
    if (sMarks.length === 0) return { marks: 0, max: 0 }
    const totalMarks = sMarks.reduce((sum, m) => sum + (parseFloat(m.marks) || 0), 0)
    const totalMax = sMarks.reduce((sum, m) => sum + (parseFloat(m.max) || 0), 0)
    return { marks: totalMarks, max: totalMax }
  }

  const getGrade = (pct) => {
    if (pct >= 91) return 'A1'
    if (pct >= 81) return 'A2'
    if (pct >= 71) return 'B1'
    if (pct >= 61) return 'B2'
    if (pct >= 51) return 'C1'
    if (pct >= 41) return 'C2'
    if (pct >= 33) return 'D'
    return 'E'
  }

  const handleExport = () => {
    const exportData = filteredStudents.map(s => {
      const studentMarks = (marksData[s.id] || {})[selectedExam] || []
      const row = { 'ID': s.id, 'Name': s.name, 'Roll No': s.rollNo }
      subjects.forEach(sub => {
        row[sub] = studentMarks.find(m => m.subject === sub)?.marks || '0'
      })
      const totals = getStudentTotal(s.id)
      row['Total'] = totals.marks
      row['Max'] = totals.max
      row['Percentage'] = totals.max > 0 ? ((totals.marks / totals.max) * 100).toFixed(2) + '%' : '0%'
      return row
    })
    exportToCSV(exportData, `${selectedExam}_Results_${selectedClass}_${selectedSection}.csv`)
  }

  return (
    <div className="exams-page">
      <div className="dash-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 15 }}>
          <div>
            <div className="dash-page-title"><FiAward style={{ display: 'inline', marginRight: 8 }} />Bulk Marks Management</div>
            <div className="dash-page-subtitle">View and enter marks for all students in Class {selectedClass}-{selectedSection}</div>
          </div>
          {(isAdmin || isTeacher) && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary btn-sm" onClick={handleExport}>
                <FiDownload /> Export Marks
              </button>
              {isAdmin && (
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/${schoolId}/erp/certificate-design`)}>
                  <FiLayout /> Design Certificate
                </button>
              )}
              <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                <FiPrinter /> Print Results
              </button>
              {!isEditing ? (
                <>
                  <button className="btn btn-primary btn-sm" onClick={handleStartEdit}><FiEdit3 /> Bulk Entry Mode</button>
                </>
              ) : (
                <>
                  <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}><FiX /> Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={handleSaveAll}><FiSave /> Save All Marks</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="dash-widget" style={{ padding: '20px', marginBottom: 'var(--space-6)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', alignItems: 'end' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: 11, color: 'var(--gray-400)' }}>EXAM TYPE</label>
          <select className="form-select" value={selectedExam} onChange={e => { setSelectedExam(e.target.value); setIsEditing(false); }}>
            {examTypes.map(et => <option key={et} value={et}>{et}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: 11, color: 'var(--gray-400)' }}>CLASS</label>
          <select className="form-select" value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setIsEditing(false); }}>
            {classes.map(c => <option key={c} value={c}>Class {c}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: 11, color: 'var(--gray-400)' }}>SECTION</label>
          <select className="form-select" value={selectedSection} onChange={e => { setSelectedSection(e.target.value); setIsEditing(false); }}>
            {sections.map(s => <option key={s} value={s}>{s === '-' ? 'No Section' : `Section ${s}`}</option>)}
          </select>
        </div>
        <div className="dash-search" style={{ marginBottom: 0 }}>
          <FiSearch />
          <input placeholder="Search student name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="dash-widget">
        <div className="dash-widget-header" style={{ justifyContent: 'space-between' }}>
          <span className="dash-widget-title"><FiTrendingUp /> Student Results: {selectedExam}</span>
          {isEditing && <span className="badge badge-warning">Bulk Editing Enabled</span>}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)' }}>
                <th style={{ padding: '12px 15px', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }}>Roll / Student</th>
                {subjects.map(s => <th key={s} style={{ textAlign: 'center' }}>{s}</th>)}
                <th style={{ textAlign: 'center' }}>Total</th>
                <th style={{ textAlign: 'center' }}>Grade</th>
                <th style={{ textAlign: 'center', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>Report</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr><td colSpan={subjects.length + 3} style={{ textAlign: 'center', padding: 60, color: 'var(--gray-400)' }}>No students found in this class/section.</td></tr>
              ) : filteredStudents.map(s => {
                const totals = getStudentTotal(s.id)
                const pct = totals.max > 0 ? Math.round((totals.marks / totals.max) * 100) : 0
                return (
                  <tr key={s.id} style={{ background: 'white', transition: 'transform 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary-600)', width: 24 }}>{s.rollNo}</div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--gray-800)' }}>{s.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>{s.id}</div>
                        </div>
                      </div>
                    </td>
                    {subjects.map(sub => (
                      <td key={sub} style={{ textAlign: 'center', minWidth: 80 }}>
                        {isEditing ? (
                          <input type="number" className="form-input" 
                            style={{ width: 60, textAlign: 'center', padding: '5px', fontSize: 12, margin: '0 auto', borderColor: 'var(--primary-200)' }}
                            value={editBuffer[s.id]?.[sub] || ''}
                            onChange={e => setEditBuffer({ ...editBuffer, [s.id]: { ...editBuffer[s.id], [sub]: e.target.value } })} />
                        ) : (
                          <span style={{ fontWeight: 600, color: (marksData[s.id]?.[selectedExam]?.find(m => m.subject === sub)?.marks >= 33) ? 'var(--gray-700)' : 'var(--error)' }}>
                            {(marksData[s.id]?.[selectedExam]?.find(m => m.subject === sub)?.marks) || '--'}
                          </span>
                        )}
                      </td>
                    ))}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, color: 'var(--primary-700)' }}>{totals.marks}</div>
                      <div style={{ fontSize: 9, color: 'var(--gray-400)' }}>/ {totals.max}</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${pct >= 33 ? 'badge-success' : 'badge-error'}`} style={{ minWidth: 40 }}>
                        {totals.marks > 0 ? getGrade(pct) : '--'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn btn-sm btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setPrintStudent(s)}>
                        <FiPrinter size={12} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isEditing && (
        <div style={{ marginTop: 20, padding: 20, background: 'var(--primary-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--primary-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FiTrendingUp size={24} color="var(--primary-600)" />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--primary-900)' }}>Bulk Entry Mode Active</div>
              <div style={{ fontSize: 12, color: 'var(--primary-700)' }}>You are editing marks for {filteredStudents.length} students simultaneously. Remember to save!</div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleSaveAll}><FiSave /> Save All Marks</button>
        </div>
      )}

      {/* Individual Report Card Modal */}
      {printStudent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', padding: 20, borderRadius: 12, maxWidth: 850, width: '100%', maxHeight: '95vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800 }}>Student Report Card Preview</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" onClick={() => generatePDF('report-card-printable', `ReportCard_${printStudent.id}_${selectedExam}.pdf`)}><FiPrinter /> Download PDF Report</button>
                <button className="btn btn-secondary" onClick={() => setPrintStudent(null)}><FiX /></button>
              </div>
            </div>
            
            <div id="report-card-printable" style={{ padding: 40, border: '10px solid var(--primary-600)', minHeight: 800 }}>
              {/* This mimics the CertificateDesigner layout */}
              <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--primary-800)' }}>NEW MORNING STAR PUBLIC SCHOOL</h1>
                <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>Main Road, Sector 4, City - 123456</p>
                <div style={{ borderBottom: '2px solid var(--primary-100)', margin: '15px 0' }} />
                <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>{selectedExam} Report Card</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
                <div><strong>Student Name:</strong> {printStudent.name}</div>
                <div><strong>Admission No:</strong> {printStudent.id}</div>
                <div><strong>Class & Section:</strong> {printStudent.class}</div>
                <div><strong>Roll Number:</strong> {printStudent.rollNo}</div>
              </div>

              <table className="table" style={{ border: '1px solid var(--gray-200)' }}>
                <thead>
                  <tr style={{ background: 'var(--gray-50)' }}>
                    <th style={{ border: '1px solid var(--gray-200)' }}>Subject</th>
                    <th style={{ border: '1px solid var(--gray-200)', textAlign: 'center' }}>Max Marks</th>
                    <th style={{ border: '1px solid var(--gray-200)', textAlign: 'center' }}>Obtained</th>
                    <th style={{ border: '1px solid var(--gray-200)', textAlign: 'center' }}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map(sub => {
                    const markObj = (marksData[printStudent.id]?.[selectedExam] || []).find(m => m.subject === sub)
                    const marks = markObj ? markObj.marks : 0
                    const max = markObj?.max || Number(examConfig[`${selectedExam}_${printStudent.class}_${sub}`]) || 100
                    const pct = max > 0 ? (marks / max) * 100 : 0
                    return (
                      <tr key={sub}>
                        <td style={{ border: '1px solid var(--gray-200)', padding: '10px' }}>{sub}</td>
                        <td style={{ border: '1px solid var(--gray-200)', textAlign: 'center' }}>{max}</td>
                        <td style={{ border: '1px solid var(--gray-200)', textAlign: 'center', fontWeight: 700 }}>{marks || '--'}</td>
                        <td style={{ border: '1px solid var(--gray-200)', textAlign: 'center' }}>{marks ? getGrade(Math.round(pct)) : '--'}</td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ fontWeight: 800, background: 'var(--gray-50)' }}>
                    <td style={{ border: '1px solid var(--gray-200)' }}>AGGREGATE TOTAL</td>
                    <td style={{ border: '1px solid var(--gray-200)', textAlign: 'center' }}>{getStudentTotal(printStudent.id).max}</td>
                    <td style={{ border: '1px solid var(--gray-200)', textAlign: 'center' }}>{getStudentTotal(printStudent.id).marks}</td>
                    <td style={{ border: '1px solid var(--gray-200)', textAlign: 'center' }}>
                      {(() => {
                        const totals = getStudentTotal(printStudent.id)
                        const pct = totals.max > 0 ? Math.round((totals.marks / totals.max) * 100) : 0
                        return getGrade(pct)
                      })()}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 100 }}>
                <div style={{ textAlign: 'center', borderTop: '1px solid var(--gray-300)', paddingTop: 5, width: 150 }}>Class Teacher</div>
                <div style={{ textAlign: 'center', borderTop: '1px solid var(--gray-300)', paddingTop: 5, width: 150 }}>Principal</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #report-card-printable, #report-card-printable * { 
            visibility: visible; 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #report-card-printable { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            border: none !important; 
          }
        }
        .exams-page tr:hover {
          background: var(--gray-50) !important;
        }
        .form-select {
          width: 100%;
          padding: 10px 12px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--gray-200);
          font-size: 13px;
          background: white;
        }
      `}</style>
    </div>
  )
}
