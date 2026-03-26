import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, CreditCard, CalendarX2, Briefcase, TrendingUp, AlertTriangle, 
  Lightbulb, Activity, CheckCircle, Clock, Plus, IndianRupee, Target, X, Bell
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';

export const Dashboard = () => {
  const { user, employees, leaves, salaries, attendance, scores } = useAppContext();
  const navigate = useNavigate();

  const isEmployee = user?.role === 'Employee';

  // Smart Alerts State
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: '3 Employees have low attendance this week.' },
    { id: 2, type: 'danger', message: 'Payroll expenses projected to exceed budget by 5%.' },
    { id: 3, type: 'info', message: '5 Leave requests pending approval.' }
  ]);

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  if (isEmployee) {
    const myLeaves = leaves.filter(l => l.employeeId === user?.id);
    const pendingLeaves = myLeaves.filter(l => l.status === 'Pending').length;
    const mySalaries = salaries.filter(s => s.employeeId === user?.id);
    const latestSalary = mySalaries[mySalaries.length - 1];

    // Employee specific interactive actions can go here
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Welcome back, {user?.name} 👋</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card animate-fade-in cursor-pointer hover:border-accent-primary" onClick={() => navigate('/payroll')} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-lg)' }}>
              <TrendingUp size={28} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Latest Net Pay</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{latestSalary ? formatCurrency(latestSalary.netPay) : '₹0'}</h3>
            </div>
          </div>
          <div className="card animate-fade-in cursor-pointer hover:border-warning" onClick={() => navigate('/leave')} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--warning-light)', color: 'var(--warning)', borderRadius: 'var(--radius-lg)' }}>
              <CalendarX2 size={28} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Pending Leaves</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{pendingLeaves}</h3>
            </div>
          </div>
          <div className="card animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-lg)' }}>
              <Briefcase size={28} />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Designation</p>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{user?.department}</h3>
            </div>
          </div>
        </div>

        <div className="card animate-fade-in">
          <h3 className="card-title">Recent Activity</h3>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myLeaves.slice(-3).map(l => (
              <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <p style={{ fontWeight: 500 }}>Leave Application ({l.type})</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{l.startDate} to {l.endDate}</p>
                </div>
                <span className={`badge ${l.status === 'Approved' ? 'badge-success' : l.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ----- Admin / HR Dashboard Computed Mock Data -----

  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  
  // Daily Summary Calculations
  const today = new Date().toISOString().split('T')[0];
  const presentToday = attendance.filter(a => a.date === today && a.status === 'Present').length;
  const leavesToday = attendance.filter(a => a.date === today && a.status === 'Leave').length;

  const monthlyCost = employees.reduce((acc, emp) => acc + (emp.salaryStructure.basic + emp.salaryStructure.hra + emp.salaryStructure.da), 0);
  
  // Salary Trend Mock Data for Bar Chart
  const costTrendData = [
    { name: 'Aug', cost: monthlyCost * 0.95 },
    { name: 'Sep', cost: monthlyCost * 0.98 },
    { name: 'Oct', cost: monthlyCost },
    { name: 'Nov (AI Est)', cost: monthlyCost * 1.05 }
  ];

  // Salary Distribution by Department for Pie Chart
  const deptDataMap = employees.reduce((acc, emp) => {
    const cost = emp.salaryStructure.basic + emp.salaryStructure.hra + emp.salaryStructure.da;
    acc[emp.department] = (acc[emp.department] || 0) + cost;
    return acc;
  }, {} as Record<string, number>);

  const departmentData = Object.keys(deptDataMap).map(dept => ({
    name: dept,
    value: deptDataMap[dept]
  }));

  const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

  // AI Insights
  const aiInsights = [
    { id: 1, text: 'Overtime increased by 12% this week.', icon: <Clock size={16} className="text-warning" /> },
    { id: 2, text: '2 employees eligible for performance bonus.', icon: <Target size={16} className="text-success" /> },
    { id: 3, text: 'Engineering team has unusually high leave requests.', icon: <AlertTriangle size={16} className="text-danger" /> }
  ];

  // Employee Risk Indicator (Mock Logic: Score < 60)
  const atRiskEmployees = scores.filter(s => s.productivityScore < 60).map(s => {
    const emp = employees.find(e => e.id === s.employeeId);
    return { name: emp?.name, score: s.productivityScore, risk: s.productivityScore < 50 ? 'High' : 'Moderate' };
  });

  // Calculate overall Health Score
  const avgPerformance = scores.reduce((acc, s) => acc + s.productivityScore, 0) / (scores.length || 1);
  const healthScore = Math.round((avgPerformance * 0.6) + (presentToday / (activeEmployees || 1) * 100 * 0.4));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      
      {/* 1. Smart Daily Summary Banner */}
      <div className="card animate-fade-in flex flex-col md:flex-row justify-between items-start md:items-center gap-4" style={{ backgroundColor: 'var(--accent-primary)', color: 'white', padding: '1.25rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Lightbulb size={24} className="animate-pulse" />
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Smart Daily Summary</h2>
            <p style={{ margin: 0, opacity: 0.9 }}>Today: {presentToday} present, {leavesToday} on leave. Payroll cost estimated to increase by 5% next month.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => navigate('/attendance')}>
            View Roster
          </button>
        </div>
      </div>

      {/* 2. Interactive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card animate-fade-in cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/employees')} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-lg)' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Employees</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{activeEmployees}</h3>
          </div>
        </div>

        <div className="card animate-fade-in cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/finance')} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-lg)' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Monthly Cost</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatCurrency(monthlyCost)}</h3>
          </div>
        </div>

        <div className="card animate-fade-in cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/leave')} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--warning-light)', color: 'var(--warning)', borderRadius: 'var(--radius-lg)' }}>
            <CalendarX2 size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Pending Leaves</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{pendingLeaves}</h3>
          </div>
        </div>

        <div className="card animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--info-light)', color: 'var(--info)', borderRadius: 'var(--radius-lg)' }}>
            <Activity size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Health Score</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: healthScore >= 80 ? 'var(--success)' : 'var(--warning)' }}>{healthScore}</h3>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>/ 100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* AI Insights & Alerts combined row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card animate-fade-in">
               <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Lightbulb size={18} className="text-accent-primary" /> AI Insights
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {aiInsights.map(insight => (
                  <div key={insight.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--bg-background)', borderRadius: 'var(--radius-md)' }}>
                    {insight.icon}
                    <span style={{ fontSize: '0.875rem' }}>{insight.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Alerts */}
            <div className="card animate-fade-in">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Bell size={18} className="text-warning" /> Smart Alerts
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '180px', overflowY: 'auto' }}>
                {alerts.length === 0 ? (
                   <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>All clear! No pending alerts.</p>
                ) : alerts.map(alert => (
                  <div key={alert.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', padding: '0.75rem', borderLeft: `4px solid var(--${alert.type})`, backgroundColor: 'var(--bg-background)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.875rem' }}>{alert.message}</span>
                    <button onClick={() => dismissAlert(alert.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Predictive Cost Chart */}
            <div className="card animate-fade-in" style={{ height: '350px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="card-title">Cost Trend (AI Predictor)</h3>
                <span className="badge badge-warning">Rising</span>
              </div>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={costTrendData}>
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    formatter={(value: any) => formatCurrency(value as number)}
                    cursor={{ fill: 'var(--bg-card-hover)' }}
                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'white' }}
                  />
                  <Bar dataKey="cost" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Salary Distribution */}
            <div className="card animate-fade-in" style={{ height: '350px' }}>
              <h3 className="card-title" style={{ marginBottom: '1rem' }}>Salary by Department</h3>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {departmentData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => formatCurrency(value as number)}
                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'white' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column (1 span) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Quick Actions Panel */}
          <div className="card animate-fade-in">
            <h3 className="card-title" style={{ marginBottom: '1rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/employees')}>
                <Plus size={18} /> Add Employee
              </button>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/finance')}>
                <IndianRupee size={18} /> Run Payroll
              </button>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/leave')}>
                <CheckCircle size={18} /> Approve Leaves
              </button>
            </div>
          </div>

          {/* Employee Risk Indicator */}
          <div className="card animate-fade-in">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <AlertTriangle size={18} className="text-danger" /> Risk Indicator
            </h3>
            {atRiskEmployees.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {atRiskEmployees.map((emp, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>{emp.name}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Productivity: {emp.score}</p>
                    </div>
                    <span className={`badge ${emp.risk === 'High' ? 'badge-danger' : 'badge-warning'}`}>{emp.risk} Risk</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No high-risk employees detected.</p>
            )}
          </div>

          {/* Upcoming Actions Timeline */}
          <div className="card animate-fade-in" style={{ flex: 1 }}>
            <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>Upcoming Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', backgroundColor: 'var(--border-color)', zIndex: 0 }}></div>
              
              <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', border: '2px solid var(--accent-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }}></div>
                </div>
                <div>
                  <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>Salary Processing</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Oct 31, 2026</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', border: '2px solid var(--warning)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--warning)' }}></div>
                </div>
                <div>
                  <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>Leave Approvals</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{pendingLeaves} pending requests</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--bg-card)', border: '2px solid var(--info)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--info)' }}></div>
                </div>
                <div>
                  <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>Shift Updates</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Next week schedule</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
