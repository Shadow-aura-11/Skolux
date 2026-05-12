import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { FiUser, FiHome, FiShield, FiCreditCard, FiSmartphone, FiCalendar, FiMapPin, FiHeart, FiActivity, FiBriefcase, FiPaperclip, FiFile, FiDownload } from 'react-icons/fi'
import { formatDate } from '../../utils/exportUtils'

export default function StudentProfilePage() {
  const { user } = useAuth()
  const { students } = useData()

  // Sync profile from global students list
  const profile = students.find(s => s.id === user?.id) || user || {}

  const sections = [
    {
      title: 'Personal Info',
      icon: <FiUser />,
      color: 'var(--primary-600)',
      fields: [
        { label: 'Full Name', value: profile.name },
        { label: 'Student ID', value: profile.id },
        { label: 'Class & Section', value: `${profile.class}-${profile.section || 'A'}` },
        { label: 'Roll Number', value: profile.rollNo },
        { label: 'Date of Birth', value: formatDate(profile.dob) },
        { label: 'Birth Mark', value: profile.birthMark },
        { label: 'Blood Group', value: profile.bloodGroup },
        { label: 'Admission Date', value: formatDate(profile.admissionDate) },
      ]
    },
    {
      title: 'Family & Residence',
      icon: <FiHome />,
      color: 'var(--accent-600)',
      fields: [
        { label: "Father's Name", value: profile.fatherName },
        { label: "Mother's Name", value: profile.motherName },
        { label: "Father's Phone", value: profile.fatherPhone },
        { label: "Mother's Phone", value: profile.motherPhone },
        { label: 'Transport Route', value: profile.transportRoute || 'Self' },
        { label: 'Residential Address', value: profile.address, full: true },
      ]
    },
    {
      title: 'Body & Identity',
      icon: <FiActivity />,
      color: 'var(--success)',
      fields: [
        { label: 'Height', value: profile.height ? `${profile.height} cm` : '---' },
        { label: 'Weight', value: profile.weight ? `${profile.weight} kg` : '---' },
        { label: 'Aadhaar Number', value: profile.aadhaar },
        { label: 'Samagra ID', value: profile.samagra },
      ]
    },
    {
      title: 'Previous Academic History',
      icon: <FiBriefcase />,
      color: 'var(--primary-700)',
      fields: [
        { label: 'Previous School', value: profile.prevSchoolName },
        { label: 'Last Class', value: profile.prevSchoolClass },
        { label: 'TC Number', value: profile.prevSchoolTC },
        { label: 'Unique Number', value: profile.prevSchoolUniqueNo },
        { label: 'City/Location', value: profile.prevSchoolCity },
      ]
    }
  ]

  return (
    <div className="student-profile-page">
      <div className="dash-page-header">
        <div>
          <div className="dash-page-title"><FiUser style={{display:'inline', marginRight:8}} /> My Personal Dossier</div>
          <div className="dash-page-subtitle">Your official school records synchronized with the main registry</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)' }}>
        {/* Header Card */}
        <div className="dash-widget" style={{ 
          background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))', 
          color: 'white',
          padding: 'var(--space-8)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-8)'
        }}>
          <div style={{ 
            width: 120, height: 120, borderRadius: 30, background: 'rgba(255,255,255,0.2)', 
            backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontWeight: 900
          }}>
            {profile.photo ? <img src={profile.photo} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 30 }} /> : profile.name[0]}
          </div>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>{profile.name}</h2>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ padding: '6px 16px', background: 'rgba(255,255,255,0.15)', borderRadius: 100, fontSize: 13, fontWeight: 700 }}>Class {profile.class}-{profile.section || 'A'}</span>
              <span style={{ padding: '6px 16px', background: 'rgba(255,255,255,0.15)', borderRadius: 100, fontSize: 13, fontWeight: 700 }}>Roll: {profile.rollNo || 'N/A'}</span>
              <span style={{ padding: '6px 16px', background: 'rgba(255,255,255,0.15)', borderRadius: 100, fontSize: 13, fontWeight: 700 }}>UID: {profile.id}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-6)' }}>
          {sections.map((sec, idx) => (
            <div key={idx} className="dash-widget">
              <div className="dash-widget-header">
                <span className="dash-widget-title" style={{ color: sec.color }}>{sec.icon} {sec.title}</span>
              </div>
              <div className="dash-widget-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {sec.fields.map((f, i) => (
                  <div key={i} style={{ gridColumn: f.full ? 'span 2' : 'span 1' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 4 }}>{f.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-700)' }}>{f.value || '---'}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Documents Section */}
          <div className="dash-widget">
            <div className="dash-widget-header">
              <span className="dash-widget-title" style={{ color: 'var(--accent-700)' }}><FiPaperclip /> Related Documents</span>
            </div>
            <div className="dash-widget-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {profile.documents && profile.documents.length > 0 ? (
                  profile.documents.map((doc, idx) => (
                    <a key={idx} href={doc.file} download={doc.fileName || doc.name} style={{ textDecoration: 'none', background: 'var(--gray-50)', padding: '12px 20px', borderRadius: 15, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid var(--gray-100)', color: 'var(--primary-600)', fontWeight: 700 }}>
                      <FiFile />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14 }}>{doc.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 400 }}>Uploaded on {doc.date || '---'}</div>
                      </div>
                      <FiDownload />
                    </a>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--gray-400)', fontSize: 13 }}>
                    <FiPaperclip size={32} style={{ marginBottom: 12, opacity: 0.3 }} /><br />
                    No related documents found in your digital locker.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-6)', background: 'var(--accent-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--accent-100)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-600)' }}>
          <FiSmartphone />
        </div>
        <div>
          <div style={{ fontWeight: 800, color: 'var(--accent-900)' }}>Need to update your details?</div>
          <div style={{ fontSize: 13, color: 'var(--accent-700)' }}>Please contact the school administrative office or your class teacher to update any official information.</div>
        </div>
      </div>
    </div>
  )
}
