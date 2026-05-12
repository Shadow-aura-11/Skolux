import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { FiAward, FiCheck, FiPrinter, FiLayout, FiType, FiImage, FiGrid, FiSquare, FiSave, FiChevronLeft } from 'react-icons/fi'

export default function CertificateDesigner() {
  const { user } = useAuth()
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('nms_cert_config')
    return saved ? JSON.parse(saved) : {
      schoolName: 'New Morning Star Public School',
      address: 'Main Road, Sector 4, City - 123456',
      borderColor: '#4f46e5',
      headerColor: '#1e1b4b',
      showLogo: true,
      showPhoto: true,
      showSign: true,
      watermark: 'OFFICIAL',
      theme: 'classic', // classic, modern, elegant
      bgImage: null,
      logoImage: null,
      signImage: null,
      qrImage: null,
      contentMarginTop: 0
    }
  })

  const saveConfig = () => {
    localStorage.setItem('nms_cert_config', JSON.stringify(config))
    alert('Certificate Design Saved Successfully!')
  }

  return (
    <div className="cert-designer">
      <div className="dash-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="dash-page-title"><FiLayout style={{ display: 'inline', marginRight: 8 }} />Report Card & Certificate Designer</div>
            <div className="dash-page-subtitle">Customize the visual layout of student results and certificates</div>
          </div>
          <button className="btn btn-primary" onClick={saveConfig}><FiSave /> Save Design Template</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 30, height: 'calc(100vh - 200px)' }}>
        
        {/* Controls */}
        <div className="dash-widget" style={{ overflowY: 'auto', padding: 20 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: 20 }}>Design Elements</h4>
          
          <div className="form-group">
            <label className="form-label">School Name</label>
            <input className="form-input" value={config.schoolName} onChange={e => setConfig({...config, schoolName: e.target.value})} />
          </div>

          <div className="form-group">
            <label className="form-label">School Address</label>
            <textarea className="form-textarea" value={config.address} onChange={e => setConfig({...config, address: e.target.value})} style={{ minHeight: 60 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            <div className="form-group">
              <label className="form-label">Border Color</label>
              <input type="color" className="form-input" style={{ height: 40, padding: 2 }} value={config.borderColor} onChange={e => setConfig({...config, borderColor: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Header Color</label>
              <input type="color" className="form-input" style={{ height: 40, padding: 2 }} value={config.headerColor} onChange={e => setConfig({...config, headerColor: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Design Theme</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['classic', 'modern', 'elegant'].map(t => (
                <button key={t} onClick={() => setConfig({...config, theme: t})}
                  style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer',
                    background: config.theme === t ? 'var(--primary-600)' : 'var(--gray-100)',
                    color: config.theme === t ? 'white' : 'var(--gray-600)',
                    border: 'none'
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 25, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={config.showLogo} onChange={e => setConfig({...config, showLogo: e.target.checked})} style={{ width: 18, height: 18 }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Show School Logo</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={config.showPhoto} onChange={e => setConfig({...config, showPhoto: e.target.checked})} style={{ width: 18, height: 18 }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Show Student Photo</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={config.showSign} onChange={e => setConfig({...config, showSign: e.target.checked})} style={{ width: 18, height: 18 }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Show Digital Signatures</span>
            </label>
          </div>

          <div className="form-group" style={{ marginTop: 20 }}>
            <label className="form-label">Watermark Text</label>
            <input className="form-input" value={config.watermark} onChange={e => setConfig({...config, watermark: e.target.value})} placeholder="e.g. OFFICIAL" />
          </div>

          <div style={{ borderTop: '1px solid var(--gray-200)', margin: '25px 0' }} />
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: 20 }}>Custom Branding & Overlays</h4>
          
          <div style={{ padding: 15, background: 'var(--primary-50)', borderRadius: 8, border: '1px solid var(--primary-100)' }}>
            <p style={{ fontSize: 13, color: 'var(--primary-700)', marginBottom: 10 }}>
              Background templates, logos, and signatures are now managed globally.
            </p>
            <a href="/erp/settings" style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <FiLayout /> Go to Global Branding Settings
            </a>
          </div>
        </div>

        {/* Live Preview */}
        <div className="dash-widget" style={{ background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, overflowY: 'auto' }}>
          <div id="cert-preview" style={{
            width: '100%', maxWidth: 700, minHeight: 900, background: config.bgImage ? `url(${config.bgImage}) no-repeat center/100% 100%` : 'white', position: 'relative',
            border: config.bgImage ? 'none' : `15px solid ${config.borderColor}`, padding: 40, boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            borderRadius: config.theme === 'modern' ? '0' : 'var(--radius-xl)'
          }}>
            {/* Watermark */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-45deg)',
              fontSize: 80, fontWeight: 900, color: 'rgba(0,0,0,0.03)', pointerEvents: 'none', whiteSpace: 'nowrap'
            }}>
              {config.watermark}
            </div>

            {/* Dynamic Content Wrapper for adjusting top margin over custom backgrounds */}
            <div style={{ paddingTop: config.bgImage ? config.contentMarginTop : 0 }}>
              {/* Header */}
              {!config.bgImage && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    {config.showLogo && (
                      config.logoImage ? 
                      <img src={config.logoImage} style={{ width: 80, height: 80, objectFit: 'contain', margin: '0 auto 15px', display: 'block' }} /> :
                      <div style={{ width: 80, height: 80, background: config.headerColor, borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><FiAward size={40}/></div>
                    )}
                    <h1 style={{ fontSize: 28, fontWeight: 900, color: config.headerColor, textTransform: 'uppercase' }}>{config.schoolName}</h1>
                    <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 5 }}>{config.address}</p>
                  </div>
      
                  <div style={{ borderBottom: `2px solid ${config.borderColor}`, margin: '20px 0' }} />
                  
                  <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, color: 'var(--gray-800)' }}>ACADEMIC REPORT CARD</h2>
                    <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>Annual Session 2026 - 2027</p>
                  </div>
                </>
              )}

            {/* Student Info Area */}
            <div style={{ display: 'flex', gap: 30, marginBottom: 40 }}>
              {config.showPhoto && <div style={{ width: 100, height: 120, border: '2px solid var(--gray-200)', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-300)' }}><FiImage size={32}/></div>}
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                <div style={{ fontSize: 14 }}><strong>Name:</strong> _________________</div>
                <div style={{ fontSize: 14 }}><strong>Class:</strong> _________________</div>
                <div style={{ fontSize: 14 }}><strong>Roll No:</strong> _______________</div>
                <div style={{ fontSize: 14 }}><strong>Section:</strong> ______________</div>
              </div>
            </div>

            {/* Table Mockup */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 40 }}>
              <thead>
                <tr style={{ background: config.headerColor, color: 'white' }}>
                  <th style={{ border: '1px solid white', padding: 10, textAlign: 'left' }}>Subject</th>
                  <th style={{ border: '1px solid white', padding: 10 }}>Max</th>
                  <th style={{ border: '1px solid white', padding: 10 }}>Obt.</th>
                  <th style={{ border: '1px solid white', padding: 10 }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4,5].map(i => (
                  <tr key={i}>
                    <td style={{ border: '1px solid var(--gray-200)', padding: 10 }}>Sample Subject {i}</td>
                    <td style={{ border: '1px solid var(--gray-200)', padding: 10, textAlign: 'center' }}>100</td>
                    <td style={{ border: '1px solid var(--gray-200)', padding: 10, textAlign: 'center' }}>--</td>
                    <td style={{ border: '1px solid var(--gray-200)', padding: 10, textAlign: 'center' }}>--</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signature Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 80, position: 'relative' }}>
              <div style={{ textAlign: 'center', width: 150 }}>
                {config.qrImage ? <img src={config.qrImage} style={{ width: 60, height: 60, marginBottom: 10 }} /> : <div style={{ height: 60, width: 60, border: '1px solid #ddd', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#aaa' }}>QR</div>}
                <div style={{ borderBottom: '1px solid var(--gray-300)', marginBottom: 8 }}></div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>Class Teacher / Stamp</div>
              </div>
              <div style={{ textAlign: 'center', width: 150 }}>
                {config.showSign && (
                  config.signImage ? 
                  <img src={config.signImage} style={{ height: 40, objectFit: 'contain', margin: '0 auto 10px' }} /> :
                  <div style={{ height: 40, fontSize: 24, fontFamily: 'cursive', color: config.headerColor, opacity: 0.7 }}>Principal</div>
                )}
                <div style={{ borderBottom: '1px solid var(--gray-300)', marginBottom: 8 }}></div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>Principal</div>
              </div>
            </div>
            
            {/* End of Dynamic Wrapper */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
