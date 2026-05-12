import { useState } from 'react'
import { FiLayout, FiSave, FiUser, FiSmartphone, FiMapPin, FiPrinter, FiShield, FiSquare } from 'react-icons/fi'
import { useParams } from 'react-router-dom'

export default function IDCardDesigner() {
  const { schoolId } = useParams()
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem(`erp_${schoolId}_id_config`)
    return saved ? JSON.parse(saved) : {
      schoolName: 'NEW MORNING STAR PUBLIC SCHOOL',
      themeColor: '#4f46e5',
      textColor: '#ffffff',
      showQr: true,
      showSign: true,
      cardType: 'vertical', // vertical, horizontal
      borderRadius: 12,
      headerHeight: 60
    }
  })

  // Fetch Global Branding Config
  const certConfig = JSON.parse(localStorage.getItem(`erp_${schoolId}_cert_config`) || '{"bgImage":null, "logoImage":null, "signImage":null, "qrImage":null}')

  const saveConfig = () => {
    localStorage.setItem(`erp_${schoolId}_id_config`, JSON.stringify(config))
    alert('ID Card Design Saved!')
  }

  return (
    <div className="id-designer">
      <div className="dash-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="dash-page-title"><FiShield style={{ display: 'inline', marginRight: 8 }} />ID Card Designer</div>
            <div className="dash-page-subtitle">Customize the digital and physical ID cards for students</div>
          </div>
          <button className="btn btn-primary" onClick={saveConfig}><FiSave /> Save ID Template</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 30 }}>
        
        {/* Controls */}
        <div className="dash-widget" style={{ padding: 20 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: 20 }}>Style Settings</h4>
          
          <div className="form-group">
            <label className="form-label">Theme Color</label>
            <input type="color" className="form-input" style={{ height: 40, padding: 2 }} value={config.themeColor} onChange={e => setConfig({...config, themeColor: e.target.value})} />
          </div>

          <div className="form-group">
            <label className="form-label">Card Orientation</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['vertical', 'horizontal'].map(t => (
                <button key={t} onClick={() => setConfig({...config, cardType: t})}
                  style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer',
                    background: config.cardType === t ? 'var(--primary-600)' : 'var(--gray-100)',
                    color: config.cardType === t ? 'white' : 'var(--gray-600)',
                    border: 'none'
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Corner Rounding</label>
            <input type="range" min="0" max="30" value={config.borderRadius} onChange={e => setConfig({...config, borderRadius: parseInt(e.target.value)})} style={{ width: '100%' }} />
          </div>

          <div style={{ marginTop: 25, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={config.showQr} onChange={e => setConfig({...config, showQr: e.target.checked})} style={{ width: 18, height: 18 }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Include QR Code</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={config.showSign} onChange={e => setConfig({...config, showSign: e.target.checked})} style={{ width: 18, height: 18 }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Show Principal Signature</span>
            </label>
          </div>
        </div>

        {/* Preview Container */}
        <div className="dash-widget" style={{ background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 50 }}>
          {/* ID CARD MOCKUP */}
          <div style={{
            width: config.cardType === 'vertical' ? 320 : 500,
            height: config.cardType === 'vertical' ? 500 : 320,
            background: 'white',
            borderRadius: config.borderRadius,
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{ 
              background: config.themeColor, 
              padding: 20, 
              textAlign: 'center', 
              color: 'white',
              height: config.cardType === 'vertical' ? 100 : 80,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              {certConfig.logoImage && <img src={certConfig.logoImage} style={{ height: 40, objectFit: 'contain', margin: '0 auto 5px' }} />}
              <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: 1 }}>{config.schoolName}</div>
              <div style={{ fontSize: 9, opacity: 0.8, marginTop: 4 }}>EXCELLENCE IN EDUCATION</div>
            </div>

            {/* Photo Area */}
            <div style={{ 
              padding: 20, 
              display: 'flex', 
              flexDirection: config.cardType === 'vertical' ? 'column' : 'row', 
              alignItems: 'center',
              gap: 20,
              flex: 1
            }}>
              <div style={{ 
                width: 110, height: 130, 
                background: 'var(--gray-100)', 
                border: `3px solid ${config.themeColor}`, 
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-300)'
              }}>
                <FiUser size={48} />
              </div>

              <div style={{ textAlign: config.cardType === 'vertical' ? 'center' : 'left', flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-800)', textTransform: 'uppercase' }}>AARAV SHARMA</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: config.themeColor, marginTop: 4 }}>CLASS X-A</div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>ID: STU001 | Roll: 12</div>
                
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--gray-600)' }}>
                    <FiSmartphone size={12} color={config.themeColor} /> +91 98765 43210
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--gray-600)' }}>
                    <FiMapPin size={12} color={config.themeColor} /> Sector 4, Main City
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with QR and Sign */}
            <div style={{ padding: '0 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              {config.showQr && (certConfig.qrImage ? <img src={certConfig.qrImage} style={{ width: 50, height: 50 }} /> : <div style={{ width: 50, height: 50, background: 'var(--gray-100)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--gray-400)' }}>QR</div>)}
              {config.showSign && (
                <div style={{ textAlign: 'center' }}>
                  {certConfig.signImage ? <img src={certConfig.signImage} style={{ height: 30, objectFit: 'contain' }} /> : <div style={{ fontSize: 16, fontFamily: 'cursive', color: config.themeColor, opacity: 0.6 }}>Principal</div>}
                  <div style={{ borderTop: certConfig.signImage ? 'none' : '1px solid var(--gray-300)', paddingTop: 2, fontSize: 8, fontWeight: 700, textTransform: 'uppercase' }}>Authorized Signatory</div>
                </div>
              )}
            </div>
            
            <div style={{ height: 10, background: config.themeColor }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
