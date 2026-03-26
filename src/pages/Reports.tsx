import { useAppContext } from '../context/AppContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download } from 'lucide-react';

export const Reports = () => {
  const { employees, attendance } = useAppContext();

  // Department wise cost calculation
  const deptCost = employees.reduce((acc, emp) => {
    // using base salary + hra + da as cost for simplicity
    const cost = emp.salaryStructure.basic + emp.salaryStructure.hra + emp.salaryStructure.da;
    acc[emp.department] = (acc[emp.department] || 0) + cost;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(deptCost).map(dept => ({
    name: dept,
    value: deptCost[dept]
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  // Mock month over month trend
  const barData = [
    { month: 'Jul', cost: 180000 },
    { month: 'Aug', cost: 185000 },
    { month: 'Sep', cost: 190000 },
    { month: 'Oct', cost: Object.values(deptCost).reduce((a, b) => a + b, 0) },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={24} color="var(--accent-primary)" /> Integrations & Reports
        </h2>
        
        <button className="btn btn-secondary" onClick={() => alert('Report download initiated.')}>
          <Download size={18} /> Export Data
        </button>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card animate-fade-in" style={{ minHeight: '400px' }}>
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Department-wise Cost</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card animate-fade-in" style={{ minHeight: '400px' }}>
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Payroll Cost Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="month" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" tickFormatter={(value) => `₹${value/1000}k`} />
              <Tooltip 
                formatter={(value: any) => formatCurrency(value as number)}
                contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              />
              <Legend />
              <Bar dataKey="cost" fill="var(--accent-primary)" name="Total Cost" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card animate-fade-in" style={{ padding: 0 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Headcount</th>
                <th>Total Base Cost</th>
                <th>Avg Cost / Emp</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(deptCost).map(dept => {
                const count = employees.filter(e => e.department === dept).length;
                return (
                  <tr key={dept}>
                    <td style={{ fontWeight: 500 }}>{dept}</td>
                    <td>{count}</td>
                    <td>{formatCurrency(deptCost[dept])}</td>
                    <td>{formatCurrency(deptCost[dept] / count)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card animate-fade-in" style={{ minHeight: '400px' }}>
          <h3 className="card-title" style={{ marginBottom: '1rem' }}>Global Attendance Analytics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Present', value: attendance.filter(a => a.status === 'Present').length },
                  { name: 'Absent', value: attendance.filter(a => a.status === 'Absent').length },
                  { name: 'On Leave', value: attendance.filter(a => a.status === 'Leave').length },
                  { name: 'Half Day', value: attendance.filter(a => a.status === 'Half Day').length },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
                <Cell fill="#f59e0b" />
                <Cell fill="#3b82f6" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
