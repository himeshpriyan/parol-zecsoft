import { useAppContext } from '../context/AppContext';
import { BrainCircuit, TrendingUp, TrendingDown, Users, AlertTriangle } from 'lucide-react';

export const AiInsights = () => {
  const { employees, attendance } = useAppContext();

  // Mock Insights Generation using actual attendance
  const empAttendanceCounts = employees.map(emp => {
    return {
      emp,
      presents: attendance.filter(a => a.employeeId === emp.id && a.status === 'Present').length,
      absents: attendance.filter(a => a.employeeId === emp.id && a.status === 'Absent').length,
    };
  });

  const sortedByPresents = [...empAttendanceCounts].sort((a, b) => b.presents - a.presents);
  const sortedByAbsents = [...empAttendanceCounts].sort((a, b) => b.absents - a.absents);

  const topPerformer = sortedByPresents[0]?.emp || employees[0];
  const lowEngagement = sortedByAbsents[0]?.emp || employees[employees.length - 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <BrainCircuit size={24} color="var(--accent-primary)" /> AI Insights & Optimization
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workforce Optimization */}
        <div className="card animate-fade-in" style={{ borderTop: '4px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Users color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Workforce Optimization AI</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
            Based on recent workload and overtime patterns in the <strong>Engineering</strong> department, 
            we recommend hiring <strong>1 additional Employee</strong>. This will reduce overtime costs by 
            approx. 15% and improve overall team efficiency.
          </p>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Current Overtime Cost</span>
              <span style={{ color: 'var(--danger)', fontWeight: 600 }}>₹45,000 / mo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Projected Cost with New Hire</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>₹38,000 / mo</span>
            </div>
          </div>
        </div>

        {/* Anomaly Detection */}
        <div className="card animate-fade-in" style={{ borderTop: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle color="var(--warning)" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Anomaly Detection Engine</h3>
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--warning)', marginTop: '0.5rem' }} />
              <div>
                <p style={{ fontWeight: 500 }}>Unusual Attendance Pattern</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  3 employees in Marketing have consecutive half-days this week.
                </p>
              </div>
            </li>
            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger)', marginTop: '0.5rem' }} />
              <div>
                <p style={{ fontWeight: 500 }}>High Overtime Alert</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {topPerformer?.name} has logged 18 hours of overtime, exceeding the standard threshold.
                </p>
              </div>
            </li>
            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--info)', marginTop: '0.5rem' }} />
              <div>
                <p style={{ fontWeight: 500 }}>Salary Mismatch Flag</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  No mismatch detected in the current month's payroll processing. Data integrity is 100%.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Employee Performance Insight */}
        <div className="card animate-fade-in md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <TrendingUp color="var(--success)" />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Top Performers</h3>
            </div>
            <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {topPerformer?.name.charAt(0)}
              </div>
              <div>
                <p style={{ fontWeight: 600 }}>{topPerformer?.name}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>100% Attendance • High Productivity</p>
              </div>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <TrendingDown color="var(--danger)" />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Low Engagement Warning</h3>
            </div>
            <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {lowEngagement?.name.charAt(0)}
              </div>
              <div>
                <p style={{ fontWeight: 600 }}>{lowEngagement?.name}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Frequent Absenteeism • Needs 1-on-1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
