import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { LeaveRequest } from '../types';
import { Plus, Check, X, CalendarOff } from 'lucide-react';

export const Leave = () => {
  const { user, employees, leaves, addLeave, updateLeaveStatus } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [leaveData, setLeaveData] = useState({
    type: 'Sick' as LeaveRequest['type'],
    startDate: '',
    endDate: '',
    reason: ''
  });

  const isEmployee = user?.role === 'Employee';

  const myLeaves = leaves.filter(l => l.employeeId === user?.id);
  const displayLeaves = isEmployee ? myLeaves : leaves;

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newLeave: LeaveRequest = {
      id: `LEAVE${Math.floor(Math.random() * 10000)}`,
      employeeId: user.id,
      type: leaveData.type,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      status: 'Pending',
      reason: leaveData.reason
    };

    addLeave(newLeave);
    setIsModalOpen(false);
    setLeaveData({ type: 'Sick', startDate: '', endDate: '', reason: '' });
  };

  const getLeaveBalance = (type: string) => {
    // Mock logic: 12 sick, 12 casual, 15 earned total per year
    const total = type === 'Earned' ? 15 : 12;
    const used = myLeaves.filter(l => l.type === type && l.status === 'Approved').length;
    return total - used;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CalendarOff size={24} color="var(--accent-primary)" /> Leave Management
        </h2>
        
        {isEmployee && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Apply Leave
          </button>
        )}
      </div>

      {isEmployee && (
        <div className="grid grid-cols-3 gap-6 animate-fade-in">
          <div className="card" style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'var(--text-secondary)' }}>Sick Leave Balance</h4>
            <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--accent-primary)' }}>
              {getLeaveBalance('Sick')}
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Out of 12 days</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'var(--text-secondary)' }}>Casual Leave Balance</h4>
            <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--accent-primary)' }}>
              {getLeaveBalance('Casual')}
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Out of 12 days</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'var(--text-secondary)' }}>Earned Leave Balance</h4>
            <div style={{ fontSize: '2rem', fontWeight: 700, margin: '0.5rem 0', color: 'var(--accent-primary)' }}>
              {getLeaveBalance('Earned')}
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Out of 15 days</p>
          </div>
        </div>
      )}

      <div className="card animate-fade-in" style={{ padding: 0 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {!isEmployee && <th>Employee</th>}
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                {!isEmployee && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {displayLeaves.map(leave => {
                const emp = employees.find(e => e.id === leave.employeeId);
                return (
                  <tr key={leave.id}>
                    {!isEmployee && (
                      <td>
                        <div style={{ fontWeight: 500 }}>{emp?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{emp?.department}</div>
                      </td>
                    )}
                    <td>
                      <span className="badge" style={{ backgroundColor: 'var(--bg-card-hover)' }}>{leave.type}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.875rem' }}>{leave.startDate} to {leave.endDate}</div>
                    </td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {leave.reason}
                    </td>
                    <td>
                      <span className={`badge ${leave.status === 'Approved' ? 'badge-success' : leave.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                        {leave.status}
                      </span>
                    </td>
                    {!isEmployee && (
                      <td style={{ textAlign: 'right' }}>
                        {leave.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', color: 'var(--success)', borderColor: 'var(--success)' }} onClick={() => updateLeaveStatus(leave.id, 'Approved')}>
                              <Check size={16} /> Approve
                            </button>
                            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => updateLeaveStatus(leave.id, 'Rejected')}>
                              <X size={16} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Processed</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
              
              {displayLeaves.length === 0 && (
                <tr>
                  <td colSpan={isEmployee ? 4 : 6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 50,
          padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            <div className="card-header">
              <h3 className="card-title">Apply for Leave</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleApplyLeave} className="grid gap-4">
              <div className="input-group">
                <label>Leave Type</label>
                <select value={leaveData.type} onChange={e => setLeaveData({...leaveData, type: e.target.value as any})} required>
                  <option value="Sick">Sick Leave</option>
                  <option value="Casual">Casual Leave</option>
                  <option value="Earned">Earned Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                  <label>Start Date</label>
                  <input type="date" value={leaveData.startDate} onChange={e => setLeaveData({...leaveData, startDate: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>End Date</label>
                  <input type="date" value={leaveData.endDate} onChange={e => setLeaveData({...leaveData, endDate: e.target.value})} required />
                </div>
              </div>

              <div className="input-group">
                <label>Reason</label>
                <textarea 
                  rows={3} 
                  value={leaveData.reason} 
                  onChange={e => setLeaveData({...leaveData, reason: e.target.value})}
                  placeholder="Please provide a brief reason..."
                  required 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
