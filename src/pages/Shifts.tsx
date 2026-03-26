import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  CalendarClock, MapPin, CheckCircle, BrainCircuit, AlertTriangle, 
  Activity, Repeat, Target, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import type { Shift, Employee } from '../types';

export const Shifts = () => {
  const { user, employees, shifts, leaves, attendance } = useAppContext();
  const [geoLocating, setGeoLocating] = useState(false);
  const [checkedInState, setCheckedInState] = useState(false);

  // States
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [localShifts, setLocalShifts] = useState<Shift[]>(shifts);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ empId: string, dateStr: string } | null>(null);

  const isEmployee = user?.role === 'Employee';

  // Helper: Generate Week Days
  const weekDays = useMemo(() => {
    const arr = [];
    const baseDate = new Date();
    // Start of current week (Monday)
    const day = baseDate.getDay(), diff = baseDate.getDate() - day + (day === 0 ? -6 : 1); 
    baseDate.setDate(diff + (currentWeekOffset * 7));
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [currentWeekOffset]);

  // Color mappings
  const shiftColors: Record<string, { bg: string, text: string, border: string }> = {
    'Morning': { bg: '#dbeafe', text: '#1e3a8a', border: '#bfdbfe' }, // Blue
    'Evening': { bg: '#ffedd5', text: '#9a3412', border: '#fed7aa' }, // Orange
    'Night': { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff' },   // Purple
  };

  const myShifts = localShifts.filter(s => s.employeeId === user?.id);

  const handleGeoCheckIn = () => {
    setGeoLocating(true);
    setTimeout(() => {
      setGeoLocating(false);
      setCheckedInState(true);
      alert('Geo-location verified. You are successfully checked in at the designated premises.');
    }, 1500);
  };

  const handleAssignShift = (type: 'Morning' | 'Evening' | 'Night') => {
    if (!selectedCell) return;
    const { empId, dateStr } = selectedCell;

    // Smart Conflict Detection: 1. Leaves
    const employeeLeaves = leaves.filter(l => l.employeeId === empId && l.status === 'Approved');
    const isLeave = employeeLeaves.some(l => {
      // Basic check: if dateStr falls between startDate and endDate
      return dateStr >= l.startDate && dateStr <= l.endDate;
    });

    if (isLeave) {
      alert(`⚠️ CONFLICT: Employee is on approved leave on ${dateStr}. Shift cannot be assigned.`);
      return;
    }

    // Smart Conflict Detection: 2. Double Shift
    const hasShift = localShifts.some(s => s.employeeId === empId && s.date === dateStr);
    if (hasShift) {
      const confirmOverride = window.confirm(`⚠️ DOUBLE SHIFT: Employee already has a shift on ${dateStr}.\nDo you want to override and reassign to ${type}?`);
      if (!confirmOverride) return;
      
      // Override
      setLocalShifts(prev => prev.filter(s => !(s.employeeId === empId && s.date === dateStr)).concat({
        id: `SHF${Date.now()}`,
        employeeId: empId,
        date: dateStr,
        type: type,
        geoCheckInLocation: ''
      }));
    } else {
      // Normal Assign
      setLocalShifts(prev => [...prev, {
        id: `SHF${Date.now()}`,
        employeeId: empId,
        date: dateStr,
        type: type,
        geoCheckInLocation: ''
      }]);
    }

    setShowAssignModal(false);
    setSelectedCell(null);
  };

  const removeShift = (empId: string, dateStr: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalShifts(prev => prev.filter(s => !(s.employeeId === empId && s.date === dateStr)));
  };

  // ----- AI Recommendations & Balancer Logic -----
  const OvertimeAlert = () => {
    // Mock logic analyzing past attendance
    const highOvertimeEmployees = attendance.filter(a => a.overtimeHours > 2);
    if (highOvertimeEmployees.length === 0) return null;
    return (
      <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <AlertTriangle className="text-danger" size={24} style={{ flexShrink: 0 }} />
        <div>
          <h4 style={{ fontWeight: 600, color: '#991b1b', marginBottom: '0.25rem' }}>Overtime Alert</h4>
          <p style={{ fontSize: '0.875rem', color: '#7f1d1d' }}>
            Overtime has increased by 20% this week. Employees like <strong>{employees.find(e => e.id === highOvertimeEmployees[0].employeeId)?.name || 'certain staff'}</strong> are logging excess hours. Consider redistributing night shifts.
          </p>
        </div>
      </div>
    );
  };

  const AIRedistribution = () => {
    return (
      <div className="card animate-fade-in" style={{ borderColor: '#c084fc', marginBottom: '1.5rem' }}>
        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#6b21a8' }}>
          <BrainCircuit size={20} /> Smart Shift Recommendation Engine
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
            <strong>Optimizer:</strong> Assign <em>Sarah Connor</em> to Morning shifts to balance the workload away from the overloaded Night crew.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
            <strong>Preference Match:</strong> <em>Alice Smith</em> requested Evening shifts. 80% match probability for next week's schedule.
          </div>
        </div>
      </div>
    );
  };

  const EfficiencyGauge = () => {
    const score = 92; // Mock score based on check-ins vs assigned shifts
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none" stroke="#e5e7eb" strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${score}, 100`}
              className="animate-fade-in"
            />
          </svg>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.125rem' }}>
            {score}%
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} className="text-success" /> Shift Efficiency Score
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Schedule completion and check-in rate is high. Minimal absenteeism detected in currently assigned rosters.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>System Planner & Geo-Attendance</h1>
          <p style={{ color: 'var(--text-secondary)' }}>AI-driven scheduling, shift mapping, and preference balancing.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {isEmployee ? (
            <button className="btn btn-outline" onClick={() => setShowSwapModal(true)}>
              <Repeat size={18} /> Request Swap
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => alert('Auto-assigning shifts based on AI recommendations...')}>
              <BrainCircuit size={18} /> Auto-Optimize Shifts
            </button>
          )}
        </div>
      </div>

      {!isEmployee && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <OvertimeAlert />
            <AIRedistribution />
          </div>
          <div>
            <EfficiencyGauge />
          </div>
        </div>
      )}

      {/* Geo Attendance (Employee Only) */}
      {isEmployee && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
          <h2 className="card-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} className="text-accent-primary" /> Geo Attendance Check-In
          </h2>
          <div style={{ padding: '2rem', backgroundColor: 'var(--bg-card-hover)', borderRadius: '50%', marginBottom: '1.5rem', position: 'relative', border: '1px solid var(--border-color)' }}>
            <MapPin size={48} className={geoLocating ? 'text-warning animate-pulse' : (checkedInState ? 'text-success' : 'text-secondary')} />
          </div>
          {checkedInState ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-color)', fontWeight: 600, marginBottom: '1rem' }}>
              <CheckCircle size={20} /> Verified at Work Location
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Ensure you are within the geo-fenced boundaries before initiating.
            </p>
          )}
          <button 
            className={`btn ${checkedInState ? 'btn-outline' : 'btn-primary'}`} 
            onClick={handleGeoCheckIn} disabled={geoLocating || checkedInState} style={{ width: '100%', maxWidth: '300px' }}
          >
            {geoLocating ? 'Locating Coordinate...' : (checkedInState ? 'Checked In' : 'Verify Location & Check In')}
          </button>
        </div>
      )}

      {/* Weekly Planner (Admins) / Timeline View (Employees) */}
      <div className="card animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card-hover)' }}>
          <h2 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarClock size={20} className="text-primary" /> {isEmployee ? 'My Weekly Timeline' : 'Workforce Shift Planner'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn-icon" onClick={() => setCurrentWeekOffset(prev => prev - 1)}>
              <ChevronLeft size={20} />
            </button>
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
              {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button className="btn-icon" onClick={() => setCurrentWeekOffset(prev => prev + 1)}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto', padding: '1.5rem' }}>
          {!isEmployee ? (
            // Admin Weekly Grid View
            <table className="table" style={{ minWidth: '800px' }}>
              <thead>
                <tr>
                  <th style={{ width: '150px' }}>Employee</th>
                  {weekDays.map((d, i) => (
                    <th key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 600 }}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{d.getDate()} {d.toLocaleDateString('en-US', { month: 'short' })}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td style={{ fontWeight: 500 }}>
                      {emp.name}
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{emp.id}</div>
                    </td>
                    {weekDays.map((d, i) => {
                      const dateStr = d.toISOString().split('T')[0];
                      const shift = localShifts.find(s => s.employeeId === emp.id && s.date === dateStr);
                      const isLeave = leaves.some(l => l.employeeId === emp.id && l.status === 'Approved' && dateStr >= l.startDate && dateStr <= l.endDate);

                      return (
                        <td key={i} style={{ padding: '0.5rem', verticalAlign: 'top', border: '1px solid var(--border-color)', minWidth: '120px' }}>
                          {isLeave ? (
                            <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#f3f4f6', color: '#9ca3af', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                              ON LEAVE
                            </div>
                          ) : shift ? (
                            <div 
                              style={{ 
                                backgroundColor: shiftColors[shift.type].bg, 
                                color: shiftColors[shift.type].text,
                                border: `1px solid ${shiftColors[shift.type].border}`,
                                borderRadius: '4px', padding: '0.5rem', fontSize: '0.75rem',
                                display: 'flex', flexDirection: 'column', gap: '0.25rem', position: 'relative'
                              }}
                            >
                              <div style={{ fontWeight: 600 }}>{shift.type}</div>
                              <div style={{ opacity: 0.8 }}>
                                {shift.type === 'Morning' ? '06AM - 02PM' : shift.type === 'Evening' ? '02PM - 10PM' : '10PM - 06AM'}
                              </div>
                              <button 
                                onClick={(e) => removeShift(emp.id, dateStr, e)}
                                style={{ position: 'absolute', top: '2px', right: '2px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.7 }}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <div 
                              onClick={() => { setSelectedCell({ empId: emp.id, dateStr }); setShowAssignModal(true); }}
                              style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-color)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-muted)' }}
                              className="hover:bg-gray-50 hover:border-accent-primary transition-colors"
                            >
                              + Assign
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Employee Timeline View
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {weekDays.map((d, i) => {
                const dateStr = d.toISOString().split('T')[0];
                const shift = myShifts.find(s => s.date === dateStr);
                const isLeave = leaves.some(l => l.employeeId === user?.id && l.status === 'Approved' && dateStr >= l.startDate && dateStr <= l.endDate);

                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-background)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ width: '100px', flexShrink: 0, borderRight: '1px solid var(--border-color)', paddingRight: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{d.getDate()} {d.toLocaleDateString('en-US', { month: 'short' })}</div>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      {isLeave ? (
                         <span className="badge" style={{ backgroundColor: '#e5e7eb', color: '#6b7280' }}>Approved Leave</span>
                      ) : shift ? (
                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                             <span className="badge" style={{ backgroundColor: shiftColors[shift.type].bg, color: shiftColors[shift.type].text, border: `1px solid ${shiftColors[shift.type].border}` }}>
                               {shift.type} Shift
                             </span>
                             <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                               <Activity size={14} />
                               {shift.type === 'Morning' ? '06:00 AM - 02:00 PM' : shift.type === 'Evening' ? '02:00 PM - 10:00 PM' : '10:00 PM - 06:00 AM'}
                             </span>
                           </div>
                           {shift.date <= new Date().toISOString().split('T')[0] && !shift.geoCheckInLocation && (
                             <span style={{ fontSize: '0.75rem', color: 'var(--warning-color)', fontWeight: 600 }}>Action Required</span>
                           )}
                         </div>
                      ) : (
                         <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Off Day</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Assign Shift Modal */}
      {showAssignModal && selectedCell && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{ width: '400px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Assign Shift</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Date: {selectedCell.dateStr} <br/> Employee ID: {selectedCell.empId}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => handleAssignShift('Morning')}
                style={{ padding: '1rem', backgroundColor: shiftColors['Morning'].bg, color: shiftColors['Morning'].text, border: `1px solid ${shiftColors['Morning'].border}`, borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
              >
                Morning (06:00 AM - 02:00 PM)
              </button>
              <button 
                onClick={() => handleAssignShift('Evening')}
                style={{ padding: '1rem', backgroundColor: shiftColors['Evening'].bg, color: shiftColors['Evening'].text, border: `1px solid ${shiftColors['Evening'].border}`, borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
              >
                Afternoon / Evening (02:00 PM - 10:00 PM)
              </button>
              <button 
                onClick={() => handleAssignShift('Night')}
                style={{ padding: '1rem', backgroundColor: shiftColors['Night'].bg, color: shiftColors['Night'].text, border: `1px solid ${shiftColors['Night'].border}`, borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
              >
                Night (10:00 PM - 06:00 AM)
              </button>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => { setShowAssignModal(false); setSelectedCell(null); }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internal Swap Modal mockup */}
      {showSwapModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '1rem'
        }}>
           <div className="card animate-fade-in" style={{ width: '400px' }}>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Request Shift Swap</h2>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label">Select Your Shift to Swap</label>
                  <select className="form-input">
                    {myShifts.map(s => <option key={s.id}>{s.date} ({s.type})</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Reason logic matching</label>
                  <input type="text" className="form-input" placeholder="e.g. Personal emergency" />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowSwapModal(false)}>Cancel</button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { alert('Swap request submitted to Manager for approval.'); setShowSwapModal(false); }}>Submit Request</button>
                </div>
             </div>
           </div>
        </div>
      )}

    </div>
  );
};
