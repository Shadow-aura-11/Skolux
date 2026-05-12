import { useState } from 'react'
import { useAuth, MOCK_DATA } from '../../context/AuthContext'
import { FiBell, FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi'

export default function NoticesPage() {
  const { user } = useAuth()
  const [notices, setNotices] = useState(() => { const s = localStorage.getItem('nms_notices'); return s ? JSON.parse(s) : MOCK_DATA.notices })
  const [modal, setModal] = useState(null)
  const [editData, setEditData] = useState({id:0,title:'',date:'',category:'Academic',priority:'medium'})
  const isAdmin = user?.role === 'admin' || user?.role === 'teacher'

  const save = d => { localStorage.setItem('nms_notices', JSON.stringify(d)); setNotices(d) }
  const openAdd = () => { setEditData({id: Date.now(), title:'', date: new Date().toISOString().split('T')[0], category:'Academic', priority:'medium'}); setModal('add') }
  const openEdit = n => { setEditData({...n}); setModal('edit') }
  const handleSave = () => {
    if(!editData.title.trim()) return
    const updated = modal === 'add' ? [editData, ...notices] : notices.map(n => n.id === editData.id ? editData : n)
    save(updated); setModal(null)
  }

  return (
    <div>
      <div className="dash-page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
        <div><div className="dash-page-title"><FiBell style={{display:'inline',marginRight:8}}/>Notice Board</div><div className="dash-page-subtitle">{notices.length} notices</div></div>
        {isAdmin && <button className="btn btn-primary btn-sm" onClick={openAdd}><FiPlus/> New Notice</button>}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {notices.map(n => (
          <div key={n.id} className="dash-widget" style={{padding:'16px 20px'}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:n.priority==='high'?'var(--error)':n.priority==='medium'?'var(--gold-500)':'var(--accent-500)',flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,color:'var(--gray-800)'}}>{n.title}</div>
                <div style={{fontSize:'var(--text-xs)',color:'var(--gray-400)',marginTop:2}}>{n.date} | <span className="badge badge-info" style={{fontSize:10}}>{n.category}</span></div>
              </div>
              {isAdmin && (
                <div style={{display:'flex',gap:4}}>
                  <button className="btn btn-sm btn-secondary" style={{padding:'4px 8px'}} onClick={()=>openEdit(n)}><FiEdit2 size={12}/></button>
                  <button className="btn btn-sm" style={{padding:'4px 8px',background:'#fef2f2',color:'var(--error)'}} onClick={()=>save(notices.filter(x=>x.id!==n.id))}><FiTrash2 size={12}/></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={()=>setModal(null)}>
          <div style={{background:'white',borderRadius:20,padding:32,maxWidth:480,width:'100%'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}><h3 style={{fontWeight:700,fontSize:'var(--text-xl)'}}>{modal==='add'?'New Notice':'Edit Notice'}</h3><button onClick={()=>setModal(null)}><FiX/></button></div>
            <div className="form-group"><label className="form-label">Title *</label><input className="form-input" value={editData.title} onChange={e=>setEditData({...editData,title:e.target.value})} placeholder="Notice title"/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
              <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={editData.date} onChange={e=>setEditData({...editData,date:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={editData.category} onChange={e=>setEditData({...editData,category:e.target.value})}><option>Academic</option><option>Event</option><option>Meeting</option><option>Admission</option><option>Finance</option></select></div>
              <div className="form-group"><label className="form-label">Priority</label><select className="form-select" value={editData.priority} onChange={e=>setEditData({...editData,priority:e.target.value})}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div>
            </div>
            <div style={{display:'flex',gap:12,marginTop:8,justifyContent:'flex-end'}}><button className="btn btn-secondary" onClick={()=>setModal(null)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}><FiSave/> Save</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
