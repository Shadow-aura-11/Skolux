import { useState } from 'react'
import { useAuth, MOCK_DATA } from '../../context/AuthContext'
import { FiMessageCircle, FiSend, FiCheckCircle, FiSearch } from 'react-icons/fi'

export default function MessagesPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState(() => { const s = localStorage.getItem('nms_msgs'); return s ? JSON.parse(s) : MOCK_DATA.messages })
  const [selected, setSelected] = useState(null)
  const [compose, setCompose] = useState(false)
  const [composeForm, setComposeForm] = useState({to:'',subject:'',body:''})
  const [sent, setSent] = useState(false)

  const save = d => { localStorage.setItem('nms_msgs', JSON.stringify(d)); setMessages(d) }
  const markRead = (id) => save(messages.map(m => m.id === id ? {...m, read: true} : m))

  const handleSend = (e) => {
    e.preventDefault()
    const newMsg = { id: Date.now(), from: user?.name, role: user?.role, subject: composeForm.subject, preview: composeForm.body.slice(0,60)+'...', time: 'Just now', read: false }
    save([newMsg, ...messages])
    setCompose(false); setComposeForm({to:'',subject:'',body:''}); setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div>
      <div className="dash-page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div><div className="dash-page-title"><FiMessageCircle style={{display:'inline',marginRight:8}}/>Messages</div><div className="dash-page-subtitle">{messages.filter(m=>!m.read).length} unread</div></div>
        <button className="btn btn-primary btn-sm" onClick={()=>setCompose(true)}><FiSend/> Compose</button>
      </div>

      {sent && <div style={{padding:12,background:'var(--accent-50)',borderRadius:12,marginBottom:16,fontSize:'var(--text-sm)',color:'var(--accent-700)',fontWeight:600}}><FiCheckCircle style={{display:'inline',marginRight:6}}/>Message sent!</div>}

      <div className="dash-widget">
        <div className="dash-widget-body" style={{padding:0}}>
          {messages.map(m => (
            <div key={m.id} onClick={() => {setSelected(m); markRead(m.id)}} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'14px 20px',borderBottom:'1px solid var(--gray-50)',cursor:'pointer',background:m.read?'transparent':'var(--primary-50)',transition:'background 0.15s'}}
              onMouseEnter={e=>e.currentTarget.style.background='var(--gray-50)'} onMouseLeave={e=>e.currentTarget.style.background=m.read?'transparent':'var(--primary-50)'}>
              <div style={{width:36,height:36,borderRadius:'50%',background:'var(--primary-100)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'var(--primary-600)',flexShrink:0}}>{m.from.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',justifyContent:'space-between'}}><strong style={{fontSize:'var(--text-sm)'}}>{m.from}</strong><span style={{fontSize:'var(--text-xs)',color:'var(--gray-400)'}}>{m.time}</span></div>
                <div style={{fontSize:'var(--text-sm)',fontWeight:600,color:'var(--gray-700)'}}>{m.subject}</div>
                <div style={{fontSize:'var(--text-xs)',color:'var(--gray-400)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.preview}</div>
              </div>
              {!m.read && <div style={{width:8,height:8,borderRadius:'50%',background:'var(--primary-500)',flexShrink:0,marginTop:6}}/>}
            </div>
          ))}
        </div>
      </div>

      {/* Selected message detail */}
      {selected && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={()=>setSelected(null)}>
          <div style={{background:'white',borderRadius:20,padding:32,maxWidth:520,width:'100%'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}><h3 style={{fontWeight:700}}>{selected.subject}</h3><button onClick={()=>setSelected(null)} style={{color:'var(--gray-400)',fontSize:20}}>×</button></div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}><div style={{width:32,height:32,borderRadius:'50%',background:'var(--primary-100)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'var(--primary-600)'}}>{selected.from.split(' ').map(n=>n[0]).join('').slice(0,2)}</div><div><strong style={{fontSize:'var(--text-sm)'}}>{selected.from}</strong><div style={{fontSize:'var(--text-xs)',color:'var(--gray-400)'}}>{selected.time}</div></div></div>
            <div style={{padding:16,background:'var(--gray-50)',borderRadius:12,fontSize:'var(--text-sm)',color:'var(--gray-600)',lineHeight:1.7}}>{selected.preview}</div>
            <div style={{marginTop:16}}><button className="btn btn-primary btn-sm" onClick={()=>{setSelected(null);setCompose(true);setComposeForm({to:selected.from,subject:`Re: ${selected.subject}`,body:''})}}><FiSend/> Reply</button></div>
          </div>
        </div>
      )}

      {/* Compose */}
      {compose && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={()=>setCompose(false)}>
          <form style={{background:'white',borderRadius:20,padding:32,maxWidth:500,width:'100%'}} onClick={e=>e.stopPropagation()} onSubmit={handleSend}>
            <h3 style={{fontWeight:700,fontSize:'var(--text-xl)',marginBottom:16}}>Compose Message</h3>
            <div className="form-group"><label className="form-label">To *</label>
              <select className="form-select" required value={composeForm.to} onChange={e=>setComposeForm({...composeForm,to:e.target.value})}>
                <option value="">Select recipient</option>
                {MOCK_DATA.staff.map(s => <option key={s.id} value={s.name}>{s.name} ({s.dept})</option>)}
                <option value="Admin Office">Admin Office</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Subject *</label><input className="form-input" required value={composeForm.subject} onChange={e=>setComposeForm({...composeForm,subject:e.target.value})} placeholder="Message subject"/></div>
            <div className="form-group"><label className="form-label">Message *</label><textarea className="form-textarea" required style={{minHeight:120}} value={composeForm.body} onChange={e=>setComposeForm({...composeForm,body:e.target.value})} placeholder="Type your message..."/></div>
            <div style={{display:'flex',gap:12}}><button type="submit" className="btn btn-primary" style={{flex:1}}><FiSend/> Send</button><button type="button" className="btn btn-secondary" onClick={()=>setCompose(false)}>Cancel</button></div>
          </form>
        </div>
      )}
    </div>
  )
}
