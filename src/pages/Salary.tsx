import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import type { SalaryRecord, Employee } from '../types';
import { BrainCircuit, DollarSign, Download, Settings2, FileText, CheckCircle, Clock, Loader2 } from 'lucide-react';

export const Salary = () => {
  const { user, employees, salaries, addSalary, loans, goals, scores, attendance, leaves } = useAppContext();
  
  // Dynamic Month & Year
  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const currentYear = currentDate.getFullYear().toString();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [viewingPayslip, setViewingPayslip] = useState<SalaryRecord | null>(null);
  const [processingEmpId, setProcessingEmpId] = useState<string | null>(null);

  const isEmployee = user?.role === 'Employee';

  // Generate Months
  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  // Generate Years (Last 5 + Next 2)
  const years = useMemo(() => {
    const minYear = parseInt(currentYear) - 5;
    const maxYear = parseInt(currentYear) + 2;
    const arr = [];
    for (let yr = minYear; yr <= maxYear; yr++) {
      arr.push(yr.toString());
    }
    return arr;
  }, [currentYear]);

  const targetPeriodStr = `${selectedYear}-${selectedMonth}`;

  const calculateNetPay = (emp: Employee) => {
    let earnings = emp.salaryStructure.basic + emp.salaryStructure.hra + emp.salaryStructure.da;
    
    // Performance Incentives for specific month and year
    const empScores = scores.filter(s => s.employeeId === emp.id && s.month === selectedMonth && (s as any).year?.toString() === selectedYear);
    const totalIncentives = empScores.reduce((sum, s) => sum + s.incentiveBonus, 0);
    earnings += totalIncentives;

    let deductions = emp.salaryStructure.pf + emp.salaryStructure.esi + emp.salaryStructure.tax;
    
    // Active Loan EMIs
    const activeLoans = loans.filter(l => l.employeeId === emp.id && l.status === 'Approved');
    const totalEmi = activeLoans.reduce((sum, l) => sum + l.emi, 0);
    deductions += totalEmi;

    // Active Goal Deductions
    const activeGoals = goals.filter(g => g.employeeId === emp.id && g.status === 'Active');
    const totalGoalDeductions = activeGoals.reduce((sum, g) => sum + g.monthlyDeduction, 0);
    deductions += totalGoalDeductions;

    // Absent / Leave Deductions matched precisely to YYYY-MM
    const absentDays = attendance.filter(a => a.employeeId === emp.id && a.status === 'Absent' && a.date.startsWith(targetPeriodStr)).length;
    const rejectedLeaves = leaves.filter(l => l.employeeId === emp.id && l.status === 'Rejected' && l.startDate.startsWith(targetPeriodStr)).length;
    
    const perDaySalary = (emp.salaryStructure.basic + emp.salaryStructure.hra) / 30;
    const unpaidLeaveDeductions = (absentDays + rejectedLeaves) * perDaySalary;
    
    deductions += unpaidLeaveDeductions;

    return earnings - deductions;
  };

  const handleProcessSalary = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;

    if (salaries.some(s => s.employeeId === empId && s.month === selectedMonth && s.year.toString() === selectedYear)) {
      alert('Salary already processed for this month!');
      return;
    }

    setProcessingEmpId(empId);

    // Simulate API Delay
    setTimeout(() => {
      // Re-calculate exactly as above for the final record
      const empScores = scores.filter(s => s.employeeId === emp.id && s.month === selectedMonth && (s as any).year?.toString() === selectedYear);
      const totalIncentives = empScores.reduce((sum, s) => sum + s.incentiveBonus, 0);
      
      const activeLoans = loans.filter(l => l.employeeId === emp.id && l.status === 'Approved');
      const totalEmi = activeLoans.reduce((sum, l) => sum + l.emi, 0);
      
      const activeGoals = goals.filter(g => g.employeeId === emp.id && g.status === 'Active');
      const totalGoalDeductions = activeGoals.reduce((sum, g) => sum + g.monthlyDeduction, 0);
      
      const absentDays = attendance.filter(a => a.employeeId === emp.id && a.status === 'Absent' && a.date.startsWith(targetPeriodStr)).length;
      const rejectedLeaves = leaves.filter(l => l.employeeId === emp.id && l.status === 'Rejected' && l.startDate.startsWith(targetPeriodStr)).length;
      
      const perDaySalary = (emp.salaryStructure.basic + emp.salaryStructure.hra) / 30;
      const unpaidLeaveDeductions = (absentDays + rejectedLeaves) * perDaySalary;

      const otherDeductions = totalEmi + totalGoalDeductions + unpaidLeaveDeductions;

      const newSalary: SalaryRecord = {
        id: `SAL${Math.floor(Math.random() * 100000)}`,
        employeeId: emp.id,
        month: selectedMonth,
        year: parseInt(selectedYear),
        earnings: {
          basic: emp.salaryStructure.basic,
          hra: emp.salaryStructure.hra,
          da: emp.salaryStructure.da,
          overtime: totalIncentives
        },
        deductions: {
          pf: emp.salaryStructure.pf,
          esi: emp.salaryStructure.esi,
          tax: emp.salaryStructure.tax,
          other: otherDeductions
        },
        netPay: calculateNetPay(emp),
        status: 'Paid'
      };

      addSalary(newSalary);
      setProcessingEmpId(null);
      
      // Use standard modern alert or toast
      alert(`Salary processed successfully for ${emp.name}`);
    }, 1200);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const TaxOptimizer = () => {
    if (!user) return null;
    return (
      <div className="ai-banner animate-fade-in" style={{ marginBottom: '1.5rem' }}>
        <div className="ai-icon-container">
          <BrainCircuit size={24} />
        </div>
        <div className="ai-banner-content">
          <h4>Smart Salary Optimizer & Tax AI</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            <strong>Recommendation:</strong> Restructuring your base pay could save you {formatCurrency(user.salaryStructure.tax * 0.15)} in TDS annually.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            <em>"Increasing your HRA allowance component by 10% will automatically lower your taxable bracket under Section 10(13A)."</em>
          </p>
          <button className="btn btn-secondary" style={{ marginTop: '0.75rem', fontSize: '0.75rem', borderColor: '#c084fc', color: '#c084fc' }}>
            <Settings2 size={14} /> View Restructure Plan
          </button>
        </div>
      </div>
    );
  };

  const PayslipModal = () => {
    if (!viewingPayslip || !user) return null;
    const emp = employees.find(e => e.id === viewingPayslip.employeeId);
    if (!emp) return null;

    const totalEarnings = Object.values(viewingPayslip.earnings).reduce((a, b) => a + b, 0);
    const totalDeductions = Object.values(viewingPayslip.deductions).reduce((a, b) => a + b, 0);
    const monthLabel = months.find(m => m.value === viewingPayslip.month)?.label || viewingPayslip.month;

    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 50,
        padding: '1rem', backdropFilter: 'blur(4px)'
      }}>
        <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '800px', backgroundColor: 'white', color: 'black', maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ color: '#111827', fontWeight: 800 }}>PAYROLL.AI INC.</h2>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Payslip for the month of {monthLabel} {viewingPayslip.year}</p>
            </div>
            <button className="btn-icon" onClick={() => setViewingPayslip(null)} style={{ color: '#111827' }}><span style={{fontSize: '1.5rem'}}>&times;</span></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: '2rem' }}>
            <div>
              <p><strong>Employee Name:</strong> {emp.name}</p>
              <p><strong>Employee ID:</strong> {emp.id}</p>
              <p><strong>Department:</strong> {emp.department}</p>
            </div>
            <div>
              <p><strong>Bank Account:</strong> XXXX-XXXX-1234</p>
              <p><strong>PAN:</strong> ABCDE1234F</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: '1px solid #e5e7eb' }}>
            <div style={{ borderRight: '1px solid #e5e7eb' }}>
              <div style={{ backgroundColor: '#f9fafb', padding: '0.5rem 1rem', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>Earnings</div>
              <div style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between' }}><span>Basic</span><span>{formatCurrency(viewingPayslip.earnings.basic)}</span></div>
              <div style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between' }}><span>HRA</span><span>{formatCurrency(viewingPayslip.earnings.hra)}</span></div>
              <div style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between' }}><span>DA</span><span>{formatCurrency(viewingPayslip.earnings.da)}</span></div>
              {viewingPayslip.earnings.overtime > 0 && <div style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', color: 'var(--success-color)' }}><span>Incentives</span><span>{formatCurrency(viewingPayslip.earnings.overtime)}</span></div>}
              <div style={{ backgroundColor: '#f9fafb', padding: '0.5rem 1rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb' }}>
                <span>Total Earnings</span><span>{formatCurrency(totalEarnings)}</span>
              </div>
            </div>
            <div>
              <div style={{ backgroundColor: '#f9fafb', padding: '0.5rem 1rem', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>Deductions</div>
              <div style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between' }}><span>Provident Fund (PF)</span><span>{formatCurrency(viewingPayslip.deductions.pf)}</span></div>
              <div style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between' }}><span>ESI</span><span>{formatCurrency(viewingPayslip.deductions.esi)}</span></div>
              <div style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between' }}><span>Income Tax (TDS)</span><span>{formatCurrency(viewingPayslip.deductions.tax)}</span></div>
              {viewingPayslip.deductions.other > 0 && <div style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}><span>Other Deductions</span><span>{formatCurrency(viewingPayslip.deductions.other)}</span></div>}
              
              <div style={{ backgroundColor: '#f9fafb', padding: '0.5rem 1rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', height: '100%', minHeight: '40px', alignItems: 'flex-end' }}>
                <span>Total Deductions</span><span>{formatCurrency(totalDeductions)}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center', backgroundColor: '#ecfdf5', color: '#065f46', padding: '1rem', borderRadius: '8px', border: '1px solid #a7f3d0', fontWeight: 700, fontSize: '1.5rem' }}>
            Net Pay: {formatCurrency(viewingPayslip.netPay)}
          </div>

          {/* AI Auto Explainer Feature */}
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f3e8ff', color: '#6b21a8', borderRadius: '8px', border: '1px solid #e9d5ff', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <BrainCircuit size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>AI Payslip Summary</h4>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                Your net pay this month is <strong>{formatCurrency(viewingPayslip.netPay)}</strong>. 
                A total of {formatCurrency(totalDeductions)} was deducted, mainly towards Income Tax and PF contributions. 
                {viewingPayslip.earnings.overtime > 0 && ` Great job earning ${formatCurrency(viewingPayslip.earnings.overtime)} in performance incentives!`}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button className="btn btn-outline" onClick={() => setViewingPayslip(null)} style={{ color: '#111827', borderColor: '#d1d5db' }}>
              Close
            </button>
            <button className="btn btn-primary" onClick={() => { 
                alert(`Payslip for ${emp.name} has been downloaded successfully.`); 
                setViewingPayslip(null); 
              }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={18} /> Download PDF
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ----- Employee View -----
  if (isEmployee) {
    const mySalaries = salaries.filter(s => s.employeeId === user?.id);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <DollarSign size={24} color="var(--accent-primary)" /> My Salary & Payslips
        </h2>
        
        <TaxOptimizer />

        {/* Premium Mobile View: Cards */}
        <div className="md:hidden flex flex-col gap-5">
          {mySalaries.map(sal => {
            const totalDeductions = Object.values(sal.deductions).reduce((a, b) => a + b, 0);
            const mLabel = months.find(m => m.value === sal.month)?.label.substring(0,3) || sal.month;
            
            return (
              <div key={sal.id} className="card p-0 overflow-hidden" style={{ background: 'linear-gradient(to bottom right, var(--bg-card), rgba(59, 130, 246, 0.05))', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-primary)' }}>{mLabel} {sal.year}</span>
                    <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}><CheckCircle size={14}/> Paid</span>
                  </div>
                </div>
                
                <div style={{ padding: '1.25rem', background: 'rgba(0, 0, 0, 0.2)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Deductions</span>
                    <span style={{ color: 'var(--danger-color)', fontWeight: 600 }}>{formatCurrency(totalDeductions)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Net Pay Received</span>
                    <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--success-color)' }}>{formatCurrency(sal.netPay)}</span>
                  </div>
                </div>

                <div style={{ padding: '1rem' }}>
                  <button className="btn btn-primary w-full justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', fontWeight: 600, padding: '0.6rem' }} onClick={() => setViewingPayslip(sal)}>
                    <FileText size={16} /> View Detailed Payslip
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block card animate-fade-in" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Basic Pay</th>
                  <th>Earnings</th>
                  <th>Deductions</th>
                  <th>Net Pay</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {mySalaries.map(sal => {
                  const totalEarnings = Object.values(sal.earnings).reduce((a, b) => a + b, 0);
                  const totalDeductions = Object.values(sal.deductions).reduce((a, b) => a + b, 0);
                  const mLabel = months.find(m => m.value === sal.month)?.label.substring(0,3) || sal.month;

                  return (
                    <tr key={sal.id}>
                      <td>{mLabel} {sal.year}</td>
                      <td>{formatCurrency(sal.earnings.basic)}</td>
                      <td>{formatCurrency(totalEarnings)}</td>
                      <td style={{ color: 'var(--danger-color)' }}>{formatCurrency(totalDeductions)}</td>
                      <td style={{ fontWeight: 600, color: 'var(--success-color)' }}>{formatCurrency(sal.netPay)}</td>
                      <td>
                        <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12}/> Paid</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => setViewingPayslip(sal)}>
                          <FileText size={16} /> Slip
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <PayslipModal />
      </div>
    );
  }

  // ----- Admin / HR View -----
  const salariesForMonth = salaries.filter(s => s.month === selectedMonth && s.year.toString() === selectedYear);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <DollarSign size={24} color="var(--accent-primary)" /> Payroll Processing
      </h2>

      {/* Dynamic Filter Row */}
      <div className="card flex items-center gap-6 animate-fade-in" style={{ flexWrap: 'wrap' }}>
        <div className="input-group" style={{ margin: 0, minWidth: '150px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Select Month</label>
          <select className="form-input" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div className="input-group" style={{ margin: 0, minWidth: '150px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Select Year</label>
          <select className="form-input" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Premium Mobile View: Cards */}
      <div className="md:hidden flex flex-col gap-5 mt-2">
        {employees.map(emp => {
          const processed = salariesForMonth.find(s => s.employeeId === emp.id);
          const isProcessing = processingEmpId === emp.id;
          const netPay = calculateNetPay(emp);

          return (
            <div key={emp.id} className="card p-0 overflow-hidden" style={{ 
              background: processed ? 'linear-gradient(to bottom right, var(--bg-card), rgba(16, 185, 129, 0.05))' : 'linear-gradient(to bottom right, var(--bg-card), rgba(245, 158, 11, 0.05))',
              border: processed ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)'
            }}>
               <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>{emp.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ background: 'rgba(255,255,255,0.08)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{emp.id}</span>
                      <span>{emp.department}</span>
                    </div>
                  </div>
                  {processed ? (
                    <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}><CheckCircle size={14}/> Paid</span>
                  ) : (
                    <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}><Clock size={14}/> Pending</span>
                  )}
               </div>
               
               <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Net Payable Amount</span>
                 <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{formatCurrency(netPay)}</span>
               </div>

               <div style={{ padding: '1rem' }}>
                 {processed ? (
                    <button className="btn w-full justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', border: '1px solid var(--success-color)', fontWeight: 600, padding: '0.6rem' }} onClick={() => setViewingPayslip(processed)}>
                      <FileText size={18} /> View Payslip
                    </button>
                  ) : (
                    <button className="btn btn-primary w-full justify-center" style={{ padding: '0.75rem', fontSize: '0.95rem', fontWeight: 600 }} onClick={() => handleProcessSalary(emp.id)} disabled={isProcessing}>
                      {isProcessing ? <><Loader2 size={18} className="animate-spin" /> Processing Salary...</> : 'Process Salary Now'}
                    </button>
                  )}
               </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block card animate-fade-in" style={{ padding: 0 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Net Payable</th>
                <th>Payment Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => {
                const processed = salariesForMonth.find(s => s.employeeId === emp.id);
                const isProcessing = processingEmpId === emp.id;
                const netPay = calculateNetPay(emp);

                return (
                  <tr key={emp.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{emp.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{emp.id}</div>
                    </td>
                    <td>{emp.department}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(netPay)}</td>
                    <td>
                      {processed ? (
                        <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12}/> Paid</span>
                      ) : (
                        <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12}/> Pending</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {processed ? (
                        <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.875rem' }} onClick={() => setViewingPayslip(processed)}>
                          <FileText size={14} /> View Slip
                        </button>
                      ) : (
                        <button className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.875rem', opacity: isProcessing ? 0.7 : 1 }} onClick={() => handleProcessSalary(emp.id)} disabled={isProcessing}>
                          {isProcessing ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Loader2 size={14} className="animate-spin" /> Processing
                            </span>
                          ) : 'Process Salary'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <PayslipModal />
    </div>
  );
};
