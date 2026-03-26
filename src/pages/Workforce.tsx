import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Users, TrendingUp, Award, Activity } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const Workforce = () => {
  const { user, scores, employees } = useAppContext();
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState('');
  const [bonusAmount, setBonusAmount] = useState('');

  const isEmployee = user?.role === 'Employee';

  // Mock Data for Radar (Team Efficiency)
  const efficiencyData = [
    { subject: 'Engineering', A: 90, fullMark: 100 },
    { subject: 'Marketing', A: 85, fullMark: 100 },
    { subject: 'Sales', A: 80, fullMark: 100 },
    { subject: 'HR', A: 95, fullMark: 100 },
    { subject: 'Support', A: 88, fullMark: 100 },
  ];

  // Mock Data for Area (Mood & Productivity)
  const productivityData = [
    { name: 'Mon', score: 85 },
    { name: 'Tue', score: 88 },
    { name: 'Wed', score: 92 },
    { name: 'Thu', score: 86 },
    { name: 'Fri', score: 95 },
  ];

  const handleAssignBonus = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Assigned ₹${bonusAmount} bonus and added to next payroll.`);
    setShowBonusModal(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Workforce Intelligence</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Analyze team efficiency, employee mood, and assign productivity incentives.</p>
        </div>
        {!isEmployee && (
          <button className="btn btn-primary" onClick={() => setShowBonusModal(true)}>
            <Award size={18} /> Assign Bonus
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Mood & Productivity */}
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} className="text-secondary" /> Company Productivity Trend
          </h2>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                <Area type="monotone" dataKey="score" stroke="var(--accent-primary)" fill="rgba(99, 102, 241, 0.2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Efficiency Analyzer */}
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} className="text-accent" /> Team Efficiency Comparison
          </h2>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={efficiencyData}>
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis dataKey="subject" stroke="var(--text-secondary)" fontSize={12} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Efficiency %" dataKey="A" stroke="var(--success-color)" fill="var(--success-color)" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Rewards List */}
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={20} className="text-warning" /> Recent Incentives Given
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Month</th>
                <th>Mood Sync</th>
                <th>Productivity Score</th>
                <th>Incentive Bonus</th>
              </tr>
            </thead>
            <tbody>
              {scores.map(s => (
                <tr key={s.id}>
                  <td>{s.employeeId}</td>
                  <td>{s.month}</td>
                  <td>{s.mood}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '100px', height: '6px', backgroundColor: 'var(--bg-dark)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${s.productivityScore}%`, height: '100%', backgroundColor: s.productivityScore > 80 ? 'var(--success-color)' : 'var(--warning-color)' }}></div>
                      </div>
                      <span style={{ fontSize: '0.875rem' }}>{s.productivityScore}%</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--success-color)' }}>+ ₹{s.incentiveBonus.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showBonusModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card animate-fade-in" style={{ width: '400px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Assign Performance Bonus</h2>
            <form onSubmit={handleAssignBonus} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Select Employee</label>
                <select className="form-input" value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)} required>
                  <option value="">-- Choose --</option>
                  {employees.filter(e => e.role === 'Employee').map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Bonus Amount (₹)</label>
                <input type="number" className="form-input" value={bonusAmount} onChange={e => setBonusAmount(e.target.value)} required min={500} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowBonusModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Assign Bonus</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
