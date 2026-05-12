import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { exportToCSV } from '../../utils/exportUtils'
import { FiUser, FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiPhone, FiMail, FiFileText, FiUpload, FiTrash, FiPrinter, FiShield, FiDownload } from 'react-icons/fi'

export default function StaffPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { schoolId } = useParams()
  const { staff, updateStaff } = useData()
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [printStaff, setPrintStaff] = useState(null)
  const [brandingModal, setBrandingModal] = useState(false)
  const [docName, setDocName] = useState('')
  
  const [editData, setEditData] = useState({
    id:'', name:'', dept:'', designation:'Teacher', status:'Present', phone:'',
    dob: '', bloodGroup: '', address: '', aadhaarNo: '', panNo: '', joinDate: '',
    photo: null,
    documents: [],
    username: '',
    password: ''
  })

  const [customDesignation, setCustomDesignation] = useState(false)
  const [certConfig, setCertConfig] = useState(() => JSON.parse(localStorage.getItem(`erp_${schoolId}_cert_config`) || '{"schoolName":"NEW MORNING STAR PUBLIC SCHOOL", "logoImage": null}'))
  const idConfig = JSON.parse(localStorage.getItem(`erp_${schoolId}_id_config`) || '{"schoolName":"NEW MORNING STAR PUBLIC SCHOOL","themeColor":"#4f46e5","textColor":"#ffffff","showQr":true,"showSign":true,"cardType":"vertical","borderRadius":12,"headerHeight":60}')

  const filtered = staff.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.dept.toLowerCase().includes(search.toLowerCase()) ||
    s.designation.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => { 
    setEditData({
      id:`STF${String(staff.length+1).padStart(3,'0')}`, name:'', dept:'', designation:'Teacher', status:'Present', phone:'',
      dob: '', bloodGroup: '', address: '', aadhaarNo: '', panNo: '', joinDate: new Date().toISOString().split('T')[0],
      photo: null, documents: [],
      username: '', password: ''
    }); 
    setCustomDesignation(false)
    setModal('add') 
  }

  const openEdit = s => { 
    setEditData({
      ...s,
      documents: s.documents || [],
      photo: s.photo || null,
      dob: s.dob || '',
      bloodGroup: s.bloodGroup || '',
      address: s.address || '',
      aadhaarNo: s.aadhaarNo || '',
      panNo: s.panNo || '',
      joinDate: s.joinDate || '',
      username: s.username || '',
      password: s.password || ''
    }); 
    setCustomDesignation(false)
    setModal('edit') 
  }

  const handleSave = () => {
    if(!editData.name.trim()) return
    const updated = modal === 'add' ? [...staff, editData] : staff.map(s => s.id === editData.id ? editData : s)
    updateStaff(updated)
    setModal(null)
  }

  const handleExport = () => {
    // Exclude heavy binary data like photos and documents from CSV
    const exportData = filtered.map(({ photo, documents, ...rest }) => rest)
    exportToCSV(exportData, `Staff_Directory_${new Date().toLocaleDateString()}.csv`)
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditData({ ...editData, photo: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDocUpload = (e) => {
    const file = e.target.files[0]
    if (file && docName.trim()) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newDoc = { name: docName, data: reader.result, id: Date.now() }
        setEditData({ ...editData, documents: [...(editData.documents || []), newDoc] })
        setDocName('')
      }
      reader.readAsDataURL(file)
    } else if (!docName.trim()) {
      alert('Please type a document name first (e.g. Aadhaar Card, Appointment Letter)')
    }
  }

  const removeDoc = (docId) => {
    setEditData({ ...editData, documents: editData.documents.filter(d => d.id !== docId) })
  }

  const toggleStatus = id => {
    updateStaff(staff.map(s => s.id === id ? {...s, status: s.status === 'Present' ? 'On Leave' : 'Present'} : s))
  }

  const designations = ['Principal', 'Vice Principal', 'Teacher', 'Accountant', 'Clerk', 'Librarian', 'Lab Asst.', 'Driver', 'Conductor', 'Peon', 'Security Guard', 'Other']

  return (
    <div className="staff-page">
      <div className="dash-page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
        <div>
          <div className="dash-page-title"><FiUser style={{display:'inline',marginRight:8}}/>Staff Management</div>
          <div className="dash-page-subtitle">{staff.length} staff members | {staff.filter(s=>s.status==='Present').length} present today</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {user?.role==='admin' && (
            <>
              <button className="btn btn-secondary" onClick={() => setBrandingModal(true)}><FiImage /> Branding</button>
              <button className="btn btn-secondary" onClick={handleExport}><FiDownload /> Export CSV</button>
              <button className="btn btn-secondary" onClick={() => navigate(`/${schoolId}/erp/id-card-design`)}><FiShield /> Design ID Cards</button>
              <button className="btn btn-primary" onClick={openAdd}><FiPlus/> Add Staff</button>
            </>
          )}
        </div>
      </div>

      <div style={{display:'flex',gap:12,marginBottom:20}}>
        <div className="dash-search" style={{flex:1}}><FiSearch/><input placeholder="Search name, department or designation..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      </div>

      <div className="dash-widget">
        <div style={{overflowX:'auto'}}>
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Dept</th><th>Designation</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td style={{fontWeight:600}}>{s.id}</td>
                  <td>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <div style={{width:32, height:32, borderRadius:'50%', background:'var(--gray-100)', overflow:'hidden'}}>
                        {s.photo ? <img src={s.photo} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <FiUser style={{margin:8}} />}
                      </div>
                      <div>
                        <div style={{fontWeight:700}}>{s.name}</div>
                        <div style={{fontSize:10, color:'var(--gray-400)'}}>{s.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>{s.dept}</td>
                  <td><span className="badge badge-info">{s.designation}</span></td>
                  <td>
                    <button onClick={() => toggleStatus(s.id)} className={`badge ${s.status==='Present'?'badge-success':'badge-error'}`} style={{cursor:'pointer',border:'none'}}>
                      {s.status}
                    </button>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:4}}>
                      <button className="btn btn-sm btn-secondary" style={{padding:'4px 8px'}} onClick={() => openEdit(s)}><FiEdit2 size={12}/></button>
                      <button className="btn btn-sm btn-secondary" style={{padding:'4px 8px'}} onClick={() => setPrintStaff(s)}><FiPrinter size={12}/></button>
                      {user?.role==='admin' && <button className="btn btn-sm" style={{padding:'4px 8px',background:'#fef2f2',color:'var(--error)'}} onClick={() => updateStaff(staff.filter(st => st.id !== s.id))}><FiTrash2 size={12}/></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff ID Card Preview Modal */}
      {printStaff && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:99999, display:'flex', alignItems:'center', justifyContent:'center', padding:20}}>
          <div style={{background:'white', padding:30, borderRadius:16, maxWidth:500}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:20}}>
              <h3 style={{fontWeight:800}}>Staff ID Card Preview</h3>
              <div style={{display:'flex', gap:10}}>
                <button className="btn btn-primary" onClick={() => window.print()}><FiPrinter /> Print</button>
                <button className="btn btn-secondary" onClick={() => setPrintStaff(null)}><FiX /></button>
              </div>
            </div>
            <div id="staff-id-card" style={{ 
              width: idConfig.cardType === 'vertical' ? 320 : 500, 
              height: idConfig.cardType === 'vertical' ? 480 : 320, 
              margin:'0 auto', border:`4px solid ${idConfig.themeColor}`, borderRadius:idConfig.borderRadius, overflow:'hidden', background:'white', position:'relative', textAlign:'center',
              display: 'flex', flexDirection: 'column'
            }}>
                <div style={{background:idConfig.themeColor, color:'white', padding:15}}>
                  {certConfig.logoImage && <img src={certConfig.logoImage} style={{ height: 30, marginBottom: 5, display: 'block', margin: '0 auto' }} />}
                  <div style={{fontSize:14, fontWeight:900}}>{certConfig.schoolName || idConfig.schoolName}</div>
                  <div style={{fontSize:8}}>STAFF IDENTITY CARD</div>
                </div>
               <div style={{padding:20, display:'flex', flexDirection: idConfig.cardType === 'vertical' ? 'column' : 'row', alignItems:'center', gap:20, flex:1}}>
                 <div style={{width:110, height:130, margin: idConfig.cardType === 'vertical' ? '0 auto' : '0', borderRadius:8, border:`3px solid ${idConfig.themeColor}`, overflow:'hidden', background:'var(--gray-50)', flexShrink:0}}>
                   {printStaff.photo ? <img src={printStaff.photo} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <FiUser size={40} style={{marginTop:35}} />}
                 </div>
                 <div style={{textAlign: idConfig.cardType === 'vertical' ? 'center' : 'left', flex:1}}>
                   <div style={{fontSize:18, fontWeight:800, textTransform:'uppercase', color:'var(--gray-800)'}}>{printStaff.name}</div>
                   <div style={{fontSize:13, fontWeight:700, color:idConfig.themeColor, marginTop:5}}>{printStaff.designation}</div>
                   <div style={{marginTop:15, fontSize:11}}>
                     <div style={{display:'flex', gap:8, marginBottom:4}}><strong style={{width:40, color:'var(--gray-400)'}}>ID:</strong> <span style={{fontWeight:700}}>{printStaff.id}</span></div>
                     <div style={{display:'flex', gap:8, marginBottom:4}}><strong style={{width:40, color:'var(--gray-400)'}}>DEPT:</strong> <span style={{fontWeight:700}}>{printStaff.dept}</span></div>
                     <div style={{display:'flex', gap:8, marginBottom:4}}><strong style={{width:40, color:'var(--gray-400)'}}>MOB:</strong> <span style={{fontWeight:700}}>{printStaff.phone}</span></div>
                   </div>
                 </div>
               </div>
               <div style={{padding:'0 20px 20px', width:'100%', display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                  {idConfig.showQr && <div style={{width:40, height:40, background:'var(--gray-100)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:'var(--gray-400)'}}>QR</div>}
                  {idConfig.showSign && (
                    <div style={{textAlign:'center'}}>
                      <div style={{fontSize:14, fontFamily:'cursive', color:idConfig.themeColor, opacity:0.6}}>Principal</div>
                      <div style={{borderTop:'1px solid var(--gray-300)', fontSize:7, fontWeight:700, paddingTop:2}}>AUTHORIZED SIGNATORY</div>
                    </div>
                  )}
               </div>
               <div style={{height:8, background:idConfig.themeColor}}></div>
             </div>
             {user?.role === 'admin' && (
               <div style={{ marginTop: 25, padding: 20, background: 'var(--primary-50)', borderRadius: 12, border: '1px solid var(--primary-200)' }} className="no-print">
                 <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary-700)', marginBottom: 12, textTransform: 'uppercase' }}>Update Global School Branding</div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                   <div className="form-group" style={{ marginBottom: 0 }}>
                     <label className="form-label" style={{ fontSize: 10 }}>School Name</label>
                     <input className="form-input" style={{ height: 32, fontSize: 12 }} value={certConfig.schoolName} onChange={e => setCertConfig({ ...certConfig, schoolName: e.target.value })} />
                   </div>
                   <div className="form-group" style={{ marginBottom: 0 }}>
                     <label className="form-label" style={{ fontSize: 10 }}>Update School Logo</label>
                     <input type="file" className="form-input" style={{ height: 32, fontSize: 10, padding: '4px 8px' }} accept="image/*" 
                       onChange={e => {
                         const file = e.target.files[0]
                         if (file) {
                           const reader = new FileReader()
                           reader.onloadend = () => setCertConfig({ ...certConfig, logoImage: reader.result })
                           reader.readAsDataURL(file)
                         }
                       }} 
                     />
                   </div>
                 </div>
                 <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: 5 }} 
                   onClick={() => {
                     localStorage.setItem(`erp_${schoolId}_cert_config`, JSON.stringify(certConfig))
                     alert('Global Branding Updated!')
                   }}>
                   <FiSave /> Save to All Documents
                 </button>
               </div>
             )}
            </div>
          </div>
        </div>
      )}

      {/* Global Branding Modal */}
      {brandingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setBrandingModal(false)}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 18 }}>Global School Branding</h3>
              <button type="button" onClick={() => setBrandingModal(false)}><FiX /></button>
            </div>
            
            <div className="form-group">
              <label className="form-label">School Name</label>
              <input className="form-input" value={certConfig.schoolName} onChange={e => setCertConfig({ ...certConfig, schoolName: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">School Logo</label>
              <input type="file" className="form-input" accept="image/*" 
                onChange={e => {
                  const file = e.target.files[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => setCertConfig({ ...certConfig, logoImage: reader.result })
                    reader.readAsDataURL(file)
                  }
                }} 
              />
              {certConfig.logoImage && <img src={certConfig.logoImage} style={{ height: 60, marginTop: 10, borderRadius: 4 }} alt="Logo Preview" />}
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea className="form-input" style={{ height: 60 }} value={certConfig.address} onChange={e => setCertConfig({ ...certConfig, address: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={certConfig.phone} onChange={e => setCertConfig({ ...certConfig, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={certConfig.email} onChange={e => setCertConfig({ ...certConfig, email: e.target.value })} />
              </div>
            </div>

            <button className="btn btn-primary w-full" style={{ marginTop: 10 }}
              onClick={() => {
                localStorage.setItem(`erp_${schoolId}_cert_config`, JSON.stringify(certConfig))
                setBrandingModal(false)
                alert('Branding updated successfully!')
              }}>
              <FiSave /> Save Global Branding
            </button>
          </div>
        </div>
      )}

      {modal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={()=>setModal(null)}>
          <div style={{background:'white',borderRadius:'var(--radius-2xl)',padding:'var(--space-8)',maxWidth:800,width:'100%',maxHeight:'90vh',overflowY:'auto',boxShadow:'var(--shadow-2xl)'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:25}}>
              <h3 style={{fontSize:'var(--text-xl)',fontWeight:800}}>{modal==='add'?'Add New Staff':'Edit Staff Details'}</h3>
              <button onClick={()=>setModal(null)} style={{padding:5, color:'var(--gray-400)'}}><FiX size={20}/></button>
            </div>

            <div style={{display:'flex', gap:30, marginBottom:30}}>
              <div style={{textAlign:'center'}}>
                <div style={{width:120, height:120, borderRadius:15, background:'var(--gray-50)', border:'2px dashed var(--gray-200)', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12}}>
                  {editData.photo ? <img src={editData.photo} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <FiUser size={48} color="var(--gray-300)" />}
                </div>
                <label className="btn btn-secondary btn-sm" style={{cursor:'pointer'}}>
                  Upload Photo
                  <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>
              <div style={{flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={editData.name} onChange={e=>setEditData({...editData,name:e.target.value})} placeholder="Full name"/></div>
                <div className="form-group"><label className="form-label">Phone Number *</label><input className="form-input" value={editData.phone} onChange={e=>setEditData({...editData,phone:e.target.value})} placeholder="+91..."/></div>
                <div className="form-group">
                  <label className="form-label">Designation</label>
                  {!customDesignation ? (
                    <select className="form-select" value={editData.designation} onChange={e => {
                      if(e.target.value === 'Other') setCustomDesignation(true)
                      else setEditData({...editData, designation: e.target.value})
                    }}>
                      {designations.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  ) : (
                    <div style={{display:'flex', gap:4}}>
                      <input className="form-input" placeholder="Type designation" autoFocus value={editData.designation} onChange={e=>setEditData({...editData, designation:e.target.value})} />
                      <button className="btn btn-sm btn-secondary" onClick={()=>setCustomDesignation(false)}><FiX/></button>
                    </div>
                  )}
                </div>
                <div className="form-group"><label className="form-label">Department</label><input className="form-input" value={editData.dept} onChange={e=>setEditData({...editData,dept:e.target.value})} placeholder="e.g. Science"/></div>
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16}}>
              <div className="form-group"><label className="form-label">Aadhaar Number</label><input className="form-input" value={editData.aadhaarNo} onChange={e=>setEditData({...editData,aadhaarNo:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">PAN Number</label><input className="form-input" value={editData.panNo} onChange={e=>setEditData({...editData,panNo:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Date of Joining</label><input className="form-input" type="date" value={editData.joinDate} onChange={e=>setEditData({...editData,joinDate:e.target.value})}/></div>
            </div>

            <div style={{marginTop:30, padding:20, background:'var(--primary-50)', borderRadius:16, border:'1px solid var(--primary-100)'}}>
              <h4 style={{fontSize:13, fontWeight:800, color:'var(--primary-700)', marginBottom:15, display:'flex', alignItems:'center', gap:8}}><FiShield /> Teacher Portal Credentials</h4>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--primary-600)' }}>Login Username</label>
                  <input className="form-input" style={{ borderColor: 'var(--primary-200)' }} value={editData.username} onChange={e=>setEditData({...editData,username:e.target.value})} placeholder="Set portal username"/>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--primary-600)' }}>Login Password</label>
                  <input className="form-input" style={{ borderColor: 'var(--primary-200)' }} type="text" value={editData.password} onChange={e=>setEditData({...editData,password:e.target.value})} placeholder="Set portal password"/>
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--primary-500)', marginTop: 8, fontWeight: 600 }}>
                💡 Tip: Use a unique username and strong password. Staff can use these to log into their specific teacher dashboard.
              </div>
            </div>

            <div style={{marginTop:30, padding:20, background:'var(--gray-50)', borderRadius:16}}>
              <h4 style={{fontSize:13, fontWeight:800, color:'var(--gray-700)', marginBottom:15, display:'flex', alignItems:'center', gap:8}}><FiFileText /> Staff Documents & Files</h4>
              <div style={{display:'flex', gap:12, marginBottom:20}}>
                <input className="form-input" style={{flex:1}} placeholder="Type Document Name (e.g. B.Ed Degree, Aadhaar)" value={docName} onChange={e=>setDocName(e.target.value)} />
                <label className="btn btn-secondary" style={{cursor:'pointer', whiteSpace:'nowrap'}}>
                  <FiUpload /> Upload File
                  <input type="file" hidden onChange={handleDocUpload} />
                </label>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
                {(editData.documents || []).map(doc => (
                  <div key={doc.id} style={{padding:'10px 15px', background:'white', borderRadius:10, border:'1px solid var(--gray-200)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div style={{display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:600}}>
                      <FiFileText color="var(--primary-500)" /> {doc.name}
                    </div>
                    <div style={{display:'flex', gap:5}}>
                      <button className="btn btn-sm" style={{padding:4, color:'var(--primary-600)'}} title="View Document" onClick={() => window.open(doc.data)}><FiUpload size={12}/></button>
                      <button className="btn btn-sm" style={{padding:4, color:'var(--error)'}} title="Delete" onClick={() => removeDoc(doc.id)}><FiTrash size={12}/></button>
                    </div>
                  </div>
                ))}
                {(editData.documents || []).length === 0 && <div style={{gridColumn:'span 2', textAlign:'center', padding:10, fontSize:12, color:'var(--gray-400)'}}>No documents uploaded yet</div>}
              </div>
            </div>

            <div style={{display:'flex',gap:12,marginTop:30,justifyContent:'flex-end'}}>
              <button className="btn btn-secondary" onClick={()=>setModal(null)}>Cancel</button>
              <button className="btn btn-primary btn-lg" onClick={handleSave}><FiSave/> Save Staff Member</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #staff-id-card, #staff-id-card * { 
            visibility: visible; 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #staff-id-card { 
            position: absolute; 
            left: 50%; 
            top: 50%; 
            transform: translate(-50%, -50%); 
            border: none !important; 
          }
        }
      `}</style>
    </div>
  )
}
