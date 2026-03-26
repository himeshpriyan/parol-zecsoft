import { useAppContext } from '../context/AppContext';
import { ShieldAlert, Route, FileWarning, Search, ChevronRight } from 'lucide-react';

export const Compliance = () => {
  const { user, events, employees } = useAppContext();

  const isEmployee = user?.role === 'Employee';

  // Sort events chronologically
  const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const myEvents = isEmployee ? sortedEvents.filter(e => e.employeeId === user.id) : sortedEvents;

  // Mock Compliance Risks
  const risks = [
    { id: 1, type: 'Tax Deduction', severity: 'High', message: '3 Employees have not submitted investment proofs for Q4.', date: 'Oct 25' },
    { id: 2, type: 'PF Mismatch', severity: 'Medium', message: 'UAN missing for 2 new joiners.', date: 'Oct 22' },
    { id: 3, type: 'ESI Liability', severity: 'Low', message: 'ESI contribution delayed by 1 day for Sep payroll.', date: 'Oct 15' }
  ];

  const getEventColor = (type: string) => {
    switch(type) {
      case 'Joined': return 'var(--success-color)';
      case 'Promoted': return 'var(--accent-primary)';
      case 'Salary Revision': return 'var(--text-primary)';
      case 'Warning': return 'var(--danger-color)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Compliance & Lifecycle Tracker</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor regulatory discrepancies and track full-cycle employee events.</p>
        </div>
        {!isEmployee && (
          <button className="btn btn-outline">
            <Search size={18} /> Generate Audit Report
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isEmployee ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Compliance Risks */}
        {!isEmployee && (
          <div className="card">
            <h2 className="card-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} className="text-danger" /> Regulatory Action Items
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {risks.map(risk => (
                <div key={risk.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: risk.severity === 'High' ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                  <FileWarning size={24} style={{ color: risk.severity === 'High' ? 'var(--danger-color)' : risk.severity === 'Medium' ? 'var(--warning-color)' : 'var(--text-secondary)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600 }}>{risk.type}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{risk.date}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{risk.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lifecycle Timeline */}
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Route size={20} className="text-accent" /> {isEmployee ? 'My Journey Timeline' : 'Recent Employee Events'}
          </h2>
          
          <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            {/* Timeline Line */}
            <div style={{ position: 'absolute', left: '0.5rem', top: '0', bottom: '0', width: '2px', backgroundColor: 'var(--border-color)' }}></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {myEvents.map((event) => {
                const emp = employees.find(e => e.id === event.employeeId);
                return (
                  <div key={event.id} style={{ position: 'relative' }}>
                    {/* Timeline Dot */}
                    <div style={{ position: 'absolute', left: '-2rem', top: '0.25rem', width: '1rem', height: '1rem', borderRadius: '50%', backgroundColor: getEventColor(event.type), border: '2px solid var(--bg-card)' }}></div>
                    
                    <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600, color: getEventColor(event.type) }}>{event.type}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{event.date}</span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{event.description}</p>
                      {!isEmployee && emp && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <ChevronRight size={12} /> {emp.name} ({emp.role})
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {myEvents.length === 0 && (
                <p style={{ color: 'var(--text-muted)' }}>No notable events tracked yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
