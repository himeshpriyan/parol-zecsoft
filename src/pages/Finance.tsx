import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { PiggyBank, Banknote, Target, AlertTriangle, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';


export const Finance = () => {
  const { user, loans, goals, updateLoan } = useAppContext();
  
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanAmount, setLoanAmount] = useState('');
  const [loanReason, setLoanReason] = useState('');
  
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDeduction, setGoalDeduction] = useState('');

  const isEmployee = user?.role === 'Employee';

  // Filter for employee view
  const myLoans = isEmployee ? loans.filter(l => l.employeeId === user.id) : loans;
  const myGoals = isEmployee ? goals.filter(g => g.employeeId === user.id) : [];

  // Mock Wellness Data (Salary vs Expense)
  const wellnessData = [
    { name: 'Jul', Income: 60000, Expense: 45000 },
    { name: 'Aug', Income: 65000, Expense: 42000 },
    { name: 'Sep', Income: 60000, Expense: 48000 },
    { name: 'Oct', Income: 60000, Expense: 38000 },
  ];

  const financialScore = 85; // Mock AI Score

  const handleApplyLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Logic goes to AppContext or mockDb via Context
    alert(`Loan request of ₹${loanAmount} submitted successfully.`);
    setShowLoanModal(false);
  };

  const handleApplyGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    alert(`Goal "${goalTitle}" for ₹${goalTarget} created successfully.`);
    setShowGoalModal(false);
  };

  const handleApproveLoan = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (loan) {
      updateLoan({ ...loan, status: 'Approved' });
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Financial Wellness & Loans</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage salary advances, savings goals, and track your financial health score.</p>
        </div>
        {isEmployee && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-outline" onClick={() => setShowGoalModal(true)}>
              <Target size={18} /> New Goal
            </button>
            <button className="btn btn-primary" onClick={() => setShowLoanModal(true)}>
              <Banknote size={18} /> Request Advance
            </button>
          </div>
        )}
      </div>

      {/* Wellness & Score (Visible to All) */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="card w-full md:w-1/3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-primary)' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '8px solid var(--accent-primary)', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{financialScore}</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Financial Health Score</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Your savings rate mapping is excellent. Keep it up!</p>
          </div>

          <div className="card w-full md:w-2/3">
            <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>{isEmployee ? 'Salary vs Expenses (Simulated)' : 'Company Wide Expense vs Capital Growth'}</h2>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={wellnessData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                  <Legend />
                  <Bar dataKey="Income" fill="var(--success-color)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expense" fill="var(--danger-color)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      {/* Goals & Loans List */}
      <div className={`grid gap-6 ${isEmployee ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* Goals List */}
        {isEmployee && (
          <div className="card">
            <h2 className="card-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PiggyBank size={20} className="text-accent" /> Active Goals
            </h2>
            {myGoals.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No active goals.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {myGoals.map(goal => (
                  <div key={goal.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600 }}>{goal.title}</span>
                      <span style={{ color: 'var(--accent-primary)' }}>₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-dark)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                      <div style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%`, height: '100%', backgroundColor: 'var(--accent-primary)' }}></div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-deducting ₹{goal.monthlyDeduction.toLocaleString()}/month</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Loans / Advances */}
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Banknote size={20} className="text-warning" /> {isEmployee ? 'My Advances' : 'All Advance Requests'}</span>
            {!isEmployee && (
               <button className="btn btn-outline" onClick={() => setShowLoanModal(true)} style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                 Grant Advance
               </button>
            )}
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  {!isEmployee && <th>Employee ID</th>}
                  <th>Amount</th>
                  <th>EMI / Month</th>
                  <th>Reason</th>
                  <th>Status</th>
                  {!isEmployee && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {myLoans.length === 0 ? (
                  <tr><td colSpan={isEmployee ? 4 : 6} style={{ textAlign: 'center' }}>No records found.</td></tr>
                ) : myLoans.map(loan => (
                  <tr key={loan.id}>
                    {!isEmployee && <td>{loan.employeeId}</td>}
                    <td style={{ fontWeight: 600 }}>₹{loan.amount.toLocaleString()}</td>
                    <td>₹{loan.emi.toLocaleString()}</td>
                    <td>{loan.reason}</td>
                    <td>
                      <span className={`status-badge status-${loan.status.toLowerCase()}`}>
                        {loan.status}
                      </span>
                    </td>
                    {!isEmployee && (
                      <td>
                        {loan.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-outline" onClick={() => handleApproveLoan(loan.id)} style={{ padding: '0.25rem', color: 'var(--success-color)' }}>
                              <Check size={16} />
                            </button>
                          </div>
                        ) : '-'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals placed below */}
      {showLoanModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card animate-fade-in" style={{ width: '400px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Request Advance Salary</h2>
            <form onSubmit={handleApplyLoan} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Amount (₹)</label>
                <input type="number" className="form-input" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} required min={1000} />
              </div>
              <div>
                <label className="form-label">Reason</label>
                <input type="text" className="form-input" value={loanReason} onChange={e => setLoanReason(e.target.value)} required />
              </div>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem' }}>
                <AlertTriangle size={16} className="text-warning" style={{ marginTop: '2px' }} />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>EMI will be auto-calculated and deducted from your monthly salary over 10 months.</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowLoanModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showGoalModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card animate-fade-in" style={{ width: '400px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Create Saving Goal</h2>
            <form onSubmit={handleApplyGoal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Goal Title</label>
                <input type="text" className="form-input" placeholder="e.g., Vacation Fund" value={goalTitle} onChange={e => setGoalTitle(e.target.value)} required />
              </div>
              <div>
                <label className="form-label">Target Amount (₹)</label>
                <input type="number" className="form-input" value={goalTarget} onChange={e => setGoalTarget(e.target.value)} required min={1000} />
              </div>
              <div>
                <label className="form-label">Monthly Deduction (₹)</label>
                <input type="number" className="form-input" value={goalDeduction} onChange={e => setGoalDeduction(e.target.value)} required min={500} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowGoalModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
