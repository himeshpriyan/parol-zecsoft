import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { AttendanceRecord } from '../types';
import { BrainCircuit, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const Attendance = () => {
  const { user, employees, attendance, markAttendance } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // For Employee Role - mark own attendance
  const [checkIn, setCheckIn] = useState('09:00');
  const [checkOut, setCheckOut] = useState('18:00');

  const isEmployee = user?.role === 'Employee';

  const handleMarkMyAttendance = () => {
    if (!user) return;
    
    // Calculate overtime
    const checkInDate = new Date(`2000-01-01T${checkIn}`);
    const checkOutDate = new Date(`2000-01-01T${checkOut}`);
    const diffHours = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60);
    const overtimeHours = diffHours > 9 ? diffHours - 9 : 0; // Assuming 9 hours is standard

    const newRecord: AttendanceRecord = {
      id: `ATT${Math.floor(Math.random() * 10000)}`,
      employeeId: user.id,
      date: selectedDate,
      status: 'Present',
      checkIn,
      checkOut,
      overtimeHours: Number(overtimeHours.toFixed(2))
    };

    markAttendance(newRecord);
    alert('Attendance marked successfully!');
  };

  const handleAdminMarkAttendance = (empId: string, status: AttendanceRecord['status']) => {
    const newRecord: AttendanceRecord = {
      id: `ATT${Math.floor(Math.random() * 10000)}`,
      employeeId: empId,
      date: selectedDate,
      status,
      checkIn: status === 'Present' ? '09:00' : undefined,
      checkOut: status === 'Present' ? '18:00' : undefined,
      overtimeHours: 0
    };
    markAttendance(newRecord);
  };

  const todaysAttendance = attendance.filter(a => a.date === selectedDate);
  const presentCount = todaysAttendance.filter(a => a.status === 'Present' || a.status === 'Half Day').length;
  const absentCount = todaysAttendance.filter(a => a.status === 'Absent' || a.status === 'Leave').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* AI Intelligence Banner */}
      {!isEmployee && (
        <div className="ai-banner animate-fade-in">
          <div className="ai-icon-container">
            <BrainCircuit size={24} />
          </div>
          <div className="ai-banner-content">
            <h4>Attendance Intelligence</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Detected pattern: <strong>2 employees</strong> frequently arriving late on Mondays. 
              <strong> 1 employee</strong> has unusually high overtime this week.
            </p>
          </div>
        </div>
      )}

      {/* Date Selector */}
      <div className="card flex items-center gap-4">
        <label style={{ fontWeight: 500 }}>Select Date:</label>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)} 
          style={{ maxWidth: '200px' }}
        />
      </div>

      {isEmployee ? (
        <div className="card animate-fade-in" style={{ maxWidth: '500px' }}>
          <h3 className="card-title" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} /> Mark Today's Attendance
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <label>Check In</label>
              <input type="time" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
            </div>
            
            <div className="input-group">
              <label>Check Out</label>
              <input type="time" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
            </div>
          </div>
          
          <button 
            className="btn btn-primary w-full" 
            style={{ marginTop: '1.5rem' }}
            onClick={handleMarkMyAttendance}
            disabled={todaysAttendance.some(a => a.employeeId === user.id)}
          >
            {todaysAttendance.some(a => a.employeeId === user.id) ? 'Already Marked' : 'Mark Present'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-full)' }}>
                <Clock size={24} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Employees</p>
                <h3 style={{ fontSize: '1.5rem' }}>{employees.length}</h3>
              </div>
            </div>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-full)' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Present Today</p>
                <h3 style={{ fontSize: '1.5rem' }}>{presentCount}</h3>
              </div>
            </div>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-full)' }}>
                <XCircle size={24} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Absent / Leave</p>
                <h3 style={{ fontSize: '1.5rem' }}>{absentCount}</h3>
              </div>
            </div>
          </div>

          <div className="hidden md:block card" style={{ padding: 0 }}>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Check In</th>
                    <th>Overtime</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => {
                    const record = todaysAttendance.find(a => a.employeeId === emp.id);
                    return (
                      <tr key={emp.id}>
                        <td>
                          <div style={{ fontWeight: 500 }}>{emp.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{emp.id}</div>
                        </td>
                        <td>{emp.department}</td>
                        <td>
                          {record ? (
                            <span className={`badge ${record.status === 'Present' ? 'badge-success' : record.status === 'Leave' ? 'badge-warning' : 'badge-danger'}`}>
                              {record.status}
                            </span>
                          ) : (
                            <span className="badge badge-info" style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)' }}>
                              Not Marked
                            </span>
                          )}
                        </td>
                        <td>{record?.checkIn || '-'}</td>
                        <td>{record?.overtimeHours ? `${record.overtimeHours} hrs` : '-'}</td>
                        <td style={{ textAlign: 'right' }}>
                          {!record && (
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }} onClick={() => handleAdminMarkAttendance(emp.id, 'Present')}>
                                <CheckCircle2 size={14} /> P
                              </button>
                              <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', color: 'var(--danger)' }} onClick={() => handleAdminMarkAttendance(emp.id, 'Absent')}>
                                <XCircle size={14} /> A
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* Premium Mobile View Cards */}
          <div className="md:hidden flex flex-col gap-5 mt-2">
            {employees.map(emp => {
                const record = todaysAttendance.find(a => a.employeeId === emp.id);
                return (
                  <div key={emp.id} className="card p-0 overflow-hidden" style={{ background: 'linear-gradient(to bottom right, var(--bg-card), rgba(255, 255, 255, 0.02))', border: '1px solid var(--border-color)' }}>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{emp.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ background: 'rgba(255,255,255,0.08)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{emp.id}</span>
                          <span>{emp.department}</span>
                        </div>
                      </div>
                      {record ? (
                        <span className={`badge ${record.status === 'Present' ? 'badge-success' : record.status === 'Leave' ? 'badge-warning' : 'badge-danger'}`}>
                          {record.status}
                        </span>
                      ) : (
                        <span className="badge badge-info" style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)' }}>
                          Not Marked
                        </span>
                      )}
                    </div>

                    <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Check In</span>
                        <span style={{ fontWeight: 600 }}>{record?.checkIn || '-'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Overtime</span>
                        <span style={{ fontWeight: 600, color: record?.overtimeHours ? 'var(--warning)' : 'var(--text-primary)' }}>{record?.overtimeHours ? `${record.overtimeHours} hrs` : '-'}</span>
                      </div>
                    </div>

                    {!record && (
                      <div style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary w-full justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', border: '1px solid var(--success-color)' }} onClick={() => handleAdminMarkAttendance(emp.id, 'Present')}>
                          <CheckCircle2 size={16} /> Preset
                        </button>
                        <button className="btn btn-secondary w-full justify-center" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: '1px solid var(--danger)' }} onClick={() => handleAdminMarkAttendance(emp.id, 'Absent')}>
                          <XCircle size={16} /> Absent
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
