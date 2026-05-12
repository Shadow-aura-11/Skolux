import { useState } from 'react'
import { useAuth, MOCK_DATA } from '../../context/AuthContext'
import { FiLayout, FiPlus, FiUsers, FiEdit2, FiTrash2, FiSave, FiX, FiInfo } from 'react-icons/fi'

export default function ClassesPage() {
  const { user } = useAuth()
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('nms_classes')
    return saved ? JSON.parse(saved) : MOCK_DATA.classesAndSections
  })

  const [addModal, setAddModal] = useState(false)
  const [newClass, setNewClass] = useState({ name: '', sections: [{ name: 'A', teacher: '' }] })

  const handleSave = () => {
    const updated = [...classes, { class: newClass.name, sections: newClass.sections }]
    setClasses(updated)
    localStorage.setItem('nms_classes', JSON.stringify(updated))
    setAddModal(false)
    setNewClass({ name: '', sections: [{ name: 'A', teacher: '' }] })
  }

  const deleteClass = (idx) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      const updated = classes.filter((_, i) => i !== idx)
      setClasses(updated)
      localStorage.setItem('nms_classes', JSON.stringify(updated))
    }
  }

  return (
    <div className="classes-page">
      <div className="dash-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="dash-page-title"><FiLayout style={{ display: 'inline', marginRight: 8 }} />Class Management</div>
          <div className="dash-page-subtitle">Add classes, sections and assign class teachers</div>
        </div>
        <button className="btn btn-primary" onClick={() => setAddModal(true)}>
          <FiPlus /> Add New Class
        </button>
      </div>

      <div className="dash-stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {classes.map((c, i) => (
          <div key={i} className="dash-widget">
            <div className="dash-widget-header" style={{ background: 'var(--primary-50)' }}>
              <span className="dash-widget-title" style={{ color: 'var(--primary-700)' }}>Class {c.class}</span>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-sm btn-secondary" style={{ padding: 4 }}><FiEdit2 size={12} /></button>
                <button className="btn btn-sm btn-secondary" style={{ padding: 4, color: 'var(--error)' }} onClick={() => deleteClass(i)}><FiTrash2 size={12} /></button>
              </div>
            </div>
            <div className="dash-widget-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {c.sections.map((sec, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)' }}>
                    <div>
                      <span style={{ fontWeight: 800, color: 'var(--primary-600)', marginRight: 10 }}>Sec {sec.name}</span>
                      <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>{sec.teacher || 'No teacher assigned'}</span>
                    </div>
                    <FiUsers size={14} color="var(--gray-400)" />
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary btn-sm w-full" style={{ marginTop: 15, fontSize: 11 }}>
                <FiPlus size={10} /> Add Section
              </button>
            </div>
          </div>
        ))}
      </div>

      {addModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setAddModal(false)}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700 }}>Add New Class</h3>
              <button onClick={() => setAddModal(false)}><FiX /></button>
            </div>

            <div className="form-group">
              <label className="form-label">Class Name (e.g. PG, Nursery, 5th)</label>
              <input className="form-input" placeholder="Enter class name" value={newClass.name} onChange={e => setNewClass({...newClass, name: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Section Teacher</label>
              <select className="form-select" value={newClass.sections[0].teacher} onChange={e => {
                const updatedSec = [...newClass.sections]
                updatedSec[0].teacher = e.target.value
                setNewClass({...newClass, sections: updatedSec})
              }}>
                <option value="">Select Teacher</option>
                {MOCK_DATA.staff.map(s => <option key={s.id} value={s.name}>{s.name} ({s.dept})</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}><FiSave /> Save Class</button>
              <button className="btn btn-secondary" onClick={() => setAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 40, padding: 20, background: 'var(--gold-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gold-200)', display: 'flex', gap: 15, alignItems: 'center' }}>
        <FiInfo size={24} color="var(--gold-600)" />
        <div style={{ fontSize: 13, color: 'var(--gold-800)' }}>
          <strong>Note:</strong> Classes added here will be available across the entire ERP for student admissions, timetable creation, and exam marks entry.
        </div>
      </div>
    </div>
  )
}
