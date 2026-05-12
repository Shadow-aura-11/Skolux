import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { FiDollarSign, FiPlusCircle, FiTruck, FiList, FiPieChart, FiX, FiDownload } from 'react-icons/fi'
import { exportToCSV } from '../../utils/exportUtils'

export default function ExpensesPage() {
  const { user, currentSession } = useAuth()
  const { 
    feeStats, 
    generalExpenses = [], updateExpenses,
    fleetLogs = [], refreshData 
  } = useData()
  const isAdmin = user?.role === 'admin'

  const [expenseModal, setExpenseModal] = useState(false)
  const [newExpense, setNewExpense] = useState({ date: new Date().toISOString().split('T')[0], category: 'Other Activities', amount: '', description: '' })

  const totalFuelCost = generalExpenses.filter(e => e.category === 'Transport/Fuel').reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
  const totalMaintCost = generalExpenses.filter(e => e.category === 'Vehicle Maintenance').reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
  const totalOtherExpenses = generalExpenses.filter(e => e.category !== 'Transport/Fuel' && e.category !== 'Vehicle Maintenance').reduce((sum, exp) => sum + Number(exp.amount || 0), 0)
  
  const totalExpenses = totalFuelCost + totalMaintCost + totalOtherExpenses
  const netBalance = (feeStats.collected || 0) - totalExpenses

  const handleAddExpense = (e) => {
    e.preventDefault()
    const exp = { ...newExpense, id: Date.now(), amount: Number(newExpense.amount) }
    const updated = [exp, ...generalExpenses]
    updateExpenses(updated)
    setExpenseModal(false)
    setNewExpense({ date: new Date().toISOString().split('T')[0], category: 'Other Activities', amount: '', description: '' })
    refreshData()
  }

  const handleDeleteExpense = (id) => {
    if (!window.confirm('Delete this expense?')) return
    const updated = generalExpenses.filter(e => e.id !== id)
    updateExpenses(updated)
    refreshData()
  }

  if (!isAdmin) {
    return <div style={{ padding: 40, textAlign: 'center' }}>You do not have access to the Financial module.</div>
  }

  return (
    <div>
      <div className="dash-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="dash-page-title"><FiDollarSign style={{ display: 'inline', marginRight: 8 }} />Financial Operations & Expenses</div>
          <div className="dash-page-subtitle">Track collections, manage school expenses, and monitor net balance</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => exportToCSV(generalExpenses, `Expenses_Report_${currentSession}.csv`)}><FiDownload /> Export CSV</button>
          <button className="btn btn-primary" onClick={() => setExpenseModal(true)}><FiPlusCircle /> Add Expense</button>
        </div>
      </div>

      <div className="dash-widget" style={{ marginBottom: 20 }}>
        <div className="dash-widget-header">
          <span className="dash-widget-title"><FiPieChart /> Master Financial Summary</span>
        </div>
        <div className="dash-widget-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: 1 }}>Net Balance (Profit/Loss)</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: netBalance >= 0 ? 'var(--accent-600)' : 'var(--error)' }}>₹{netBalance.toLocaleString()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: 1 }}>Total Collected Revenue</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary-600)' }}>₹{(feeStats.collected || 0).toLocaleString()}</div>
            </div>
          </div>
          
          <div style={{ borderTop: '2px dashed var(--gray-200)', margin: '20px 0' }}></div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-4)', background: '#fff1f2', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--error)' }}>- ₹{totalFuelCost.toLocaleString()}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}><FiTruck /> Transport/Fuel</div>
            </div>
            <div style={{ padding: 'var(--space-4)', background: '#fff7ed', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: '#ea580c' }}>- ₹{totalMaintCost.toLocaleString()}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}><FiPlusCircle /> Vehicle Maintenance</div>
            </div>
            <div style={{ padding: 'var(--space-4)', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--gray-700)' }}>- ₹{totalOtherExpenses.toLocaleString()}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}><FiList /> Other Activities</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-widget">
        <div className="dash-widget-header">
          <span className="dash-widget-title"><FiList /> General Expense Logs</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {generalExpenses.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>No general expenses recorded.</td></tr>
              ) : (
                generalExpenses.map(exp => (
                  <tr key={exp.id}>
                    <td>{exp.date}</td>
                    <td><span className="badge badge-info">{exp.category}</span></td>
                    <td>{exp.description}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--error)' }}>₹{exp.amount.toLocaleString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-sm btn-secondary" onClick={() => handleDeleteExpense(exp.id)} style={{ color: 'var(--error)' }}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {expenseModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setExpenseModal(false)}>
          <form style={{ background: 'white', borderRadius: 20, padding: 32, maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()} onSubmit={handleAddExpense}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 'var(--text-xl)' }}>Record New Expense</h3>
              <button type="button" onClick={() => setExpenseModal(false)}><FiX /></button>
            </div>
            
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" required value={newExpense.date} onChange={e => setNewExpense({ ...newExpense, date: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" required value={newExpense.category} onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}>
                <option value="Other Activities">Other Activities</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Events">School Events</option>
                <option value="Staff Refreshments">Staff Refreshments</option>
                <option value="Misc">Miscellaneous</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input type="number" required min="1" className="form-input" value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Description / Remarks</label>
              <input type="text" required className="form-input" placeholder="e.g. Science Fair Setup..." value={newExpense.description} onChange={e => setNewExpense({ ...newExpense, description: e.target.value })} />
            </div>
            
            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: 15 }}>Save Expense</button>
          </form>
        </div>
      )}
    </div>
  )
}
