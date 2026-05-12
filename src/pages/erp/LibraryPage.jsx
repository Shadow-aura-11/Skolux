import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { FiBookOpen, FiSearch, FiPlus, FiCheckCircle, FiClock, FiBook, FiUser, FiInfo } from 'react-icons/fi'

const MOCK_BOOKS = [
  { id: 'LIB101', title: 'Concepts of Physics', author: 'H.C. Verma', category: 'Physics', copies: 12, available: 5, location: 'Shelf A-4' },
  { id: 'LIB102', title: 'Fundamentals of Mathematics', author: 'K.C. Sinha', category: 'Mathematics', copies: 15, available: 8, location: 'Shelf B-2' },
  { id: 'LIB103', title: 'Organic Chemistry', author: 'O.P. Tandon', category: 'Chemistry', copies: 8, available: 2, location: 'Shelf C-1' },
  { id: 'LIB104', title: 'Indian Constitution', author: 'D.D. Basu', category: 'Social Science', copies: 5, available: 5, location: 'Shelf D-3' },
  { id: 'LIB105', title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', category: 'Literature', copies: 10, available: 6, location: 'Shelf E-1' },
]

export default function LibraryPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState(() => {
    const s = localStorage.getItem('nms_library');
    return s ? JSON.parse(s) : MOCK_BOOKS
  })
  const [search, setSearch] = useState('')
  
  const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="dash-page-header">
        <div className="dash-page-title"><FiBookOpen style={{ display: 'inline', marginRight: 8 }} />Library Management</div>
        <div className="dash-page-subtitle">{books.length} titles available in the school library</div>
      </div>

      <div className="dash-stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
        <div className="dash-stat-card"><div className="dash-stat-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary-500)' }}><FiBook /></div><div><div className="dash-stat-value">2,450+</div><div className="dash-stat-label">Total Books</div></div></div>
        <div className="dash-stat-card"><div className="dash-stat-icon" style={{ background: 'var(--accent-50)', color: 'var(--accent-500)' }}><FiCheckCircle /></div><div><div className="dash-stat-value">185</div><div className="dash-stat-label">Issued Today</div></div></div>
        <div className="dash-stat-card"><div className="dash-stat-icon" style={{ background: 'var(--gold-50)', color: 'var(--gold-600)' }}><FiClock /></div><div><div className="dash-stat-value">12</div><div className="dash-stat-label">Overdue</div></div></div>
        <div className="dash-stat-card"><div className="dash-stat-icon" style={{ background: '#f3e8ff', color: '#8b5cf6' }}><FiUser /></div><div><div className="dash-stat-value">840</div><div className="dash-stat-label">Active Members</div></div></div>
      </div>

      <div className="dash-search" style={{ marginBottom: 20, maxWidth: 400 }}>
        <FiSearch />
        <input placeholder="Search books by title, author or ID..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="dash-widget">
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr><th>Book ID</th><th>Title</th><th>Author</th><th>Category</th><th>Available</th><th>Location</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.id}</td>
                  <td><strong>{b.title}</strong></td>
                  <td>{b.author}</td>
                  <td><span className="badge badge-info">{b.category}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, color: b.available > 0 ? 'var(--accent-600)' : 'var(--error)' }}>{b.available}</span>
                      <span style={{ fontSize: 10, color: 'var(--gray-400)' }}>/ {b.copies}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 'var(--text-xs)' }}>{b.location}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }}>
                      {user?.role === 'admin' ? 'Manage' : 'Reserve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
