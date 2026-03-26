import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Employee } from '../types';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';

export const Employees = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Employee' as Employee['role'],
    department: '',
    status: 'Active' as Employee['status'],
    joinDate: new Date().toISOString().split('T')[0],
    basic: 0,
    hra: 0,
    da: 0,
    pf: 0,
    esi: 0,
    tax: 0
  });

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (emp?: Employee) => {
    if (emp) {
      setEditingEmployee(emp);
      setFormData({
        name: emp.name,
        email: emp.email,
        role: emp.role,
        department: emp.department,
        status: emp.status,
        joinDate: emp.joinDate,
        basic: emp.salaryStructure.basic,
        hra: emp.salaryStructure.hra,
        da: emp.salaryStructure.da,
        pf: emp.salaryStructure.pf,
        esi: emp.salaryStructure.esi,
        tax: emp.salaryStructure.tax
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '', email: '', role: 'Employee', department: '', 
        status: 'Active', joinDate: new Date().toISOString().split('T')[0],
        basic: 0, hra: 0, da: 0, pf: 0, esi: 0, tax: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEmp: Employee = {
      id: editingEmployee ? editingEmployee.id : `EMP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      status: formData.status,
      joinDate: formData.joinDate,
      salaryStructure: {
        basic: Number(formData.basic),
        hra: Number(formData.hra),
        da: Number(formData.da),
        pf: Number(formData.pf),
        esi: Number(formData.esi),
        tax: Number(formData.tax)
      }
    };

    if (editingEmployee) {
      updateEmployee(newEmp);
    } else {
      addEmployee(newEmp);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search employees..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.5rem' }}
          />
        </div>
        
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add Employee
        </button>
      </div>

      {/* Employee Table */}
      <div className="card animate-fade-in" style={{ padding: '0' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id}>
                  <td style={{ fontWeight: 500 }}>{emp.id}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{emp.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{emp.email}</div>
                  </td>
                  <td>
                    <span className={`badge ${emp.role === 'Admin' ? 'badge-primary' : emp.role === 'HR' ? 'badge-info' : 'badge-success'}`}>
                      {emp.role}
                    </span>
                  </td>
                  <td>{emp.department}</td>
                  <td>
                    <span className={`badge ${emp.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-icon" onClick={() => openModal(emp)} title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-icon" onClick={() => deleteEmployee(emp.id)} title="Delete" style={{ color: 'var(--danger)' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No employees found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 50,
          padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="card-header">
              <h3 className="card-title">{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label>Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div className="input-group">
                <label>Email Address</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              
              <div className="input-group">
                <label>Department</label>
                <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
              </div>

              <div className="input-group">
                <label>Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})}>
                  <option value="Employee">Employee</option>
                  <option value="HR">HR</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="input-group">
                <label>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <h4 style={{ margin: '0.5rem 0', color: 'var(--accent-primary)' }}>Salary Structure</h4>
              </div>

              <div className="input-group">
                <label>Basic Pay</label>
                <input required type="number" value={formData.basic} onChange={e => setFormData({...formData, basic: Number(e.target.value)})} />
              </div>
              
              <div className="input-group">
                <label>HRA</label>
                <input required type="number" value={formData.hra} onChange={e => setFormData({...formData, hra: Number(e.target.value)})} />
              </div>
              
              <div className="input-group">
                <label>DA</label>
                <input required type="number" value={formData.da} onChange={e => setFormData({...formData, da: Number(e.target.value)})} />
              </div>

              <div className="input-group">
                <label>PF Deduction</label>
                <input required type="number" value={formData.pf} onChange={e => setFormData({...formData, pf: Number(e.target.value)})} />
              </div>

              <div className="input-group">
                <label>ESI Deduction</label>
                <input required type="number" value={formData.esi} onChange={e => setFormData({...formData, esi: Number(e.target.value)})} />
              </div>

              <div className="input-group">
                <label>Tax Deduction</label>
                <input required type="number" value={formData.tax} onChange={e => setFormData({...formData, tax: Number(e.target.value)})} />
              </div>
              
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
