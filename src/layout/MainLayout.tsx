import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  CalendarOff, 
  Wallet, 
  FileText, 
  LogOut,
  BrainCircuit,
  PiggyBank,
  Target,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { ChatAssistant } from '../components/ChatAssistant';

const MainLayout = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Employees', path: '/employees', icon: <Users size={20} /> },
    { name: 'Attendance', path: '/attendance', icon: <CalendarCheck size={20} /> },
    { name: 'Leave', path: '/leave', icon: <CalendarOff size={20} /> },
    { name: 'Salary & Payslips', path: '/salary', icon: <Wallet size={20} /> },
    { name: 'AI Insights', path: '/ai-insights', icon: <BrainCircuit size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: 'var(--sidebar-width)', 
        backgroundColor: 'var(--bg-card)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          height: 'var(--header-height)', 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 1.5rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h1 style={{ fontSize: '1.25rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BrainCircuit /> Payroll.ai
          </h1>
        </div>
        
        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            if (item.name === 'Employees' && user?.role === 'Employee') return null; // Simple RBAC
            
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s'
                }}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}

          <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '1rem 0 0.5rem 0', paddingLeft: '1rem' }}>Smart Modules</h3>
          <Link key="/finance" to="/finance" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: location.pathname === '/finance' ? 'var(--accent-light)' : 'transparent', color: location.pathname === '/finance' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: location.pathname === '/finance' ? 600 : 500, transition: 'all 0.2s' }}>
            <PiggyBank size={20} /> Finance & Loans
          </Link>
          <Link key="/workforce" to="/workforce" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: location.pathname === '/workforce' ? 'var(--accent-light)' : 'transparent', color: location.pathname === '/workforce' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: location.pathname === '/workforce' ? 600 : 500, transition: 'all 0.2s' }}>
            <Target size={20} /> Workforce & Teams
          </Link>
          <Link key="/shifts" to="/shifts" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: location.pathname === '/shifts' ? 'var(--accent-light)' : 'transparent', color: location.pathname === '/shifts' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: location.pathname === '/shifts' ? 600 : 500, transition: 'all 0.2s' }}>
            <Clock size={20} /> Smart Shifts
          </Link>
          <Link key="/compliance" to="/compliance" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: location.pathname === '/compliance' ? 'var(--accent-light)' : 'transparent', color: location.pathname === '/compliance' ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: location.pathname === '/compliance' ? 600 : 500, transition: 'all 0.2s' }}>
            <ShieldCheck size={20} /> Compliance Tracking
          </Link>
        </nav>
        
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button 
            className="btn w-full" 
            onClick={handleLogout}
            style={{ 
              color: 'var(--text-secondary)', 
              justifyContent: 'flex-start' 
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          height: 'var(--header-height)',
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem'
        }}>
          <div>
            {/* Could add a breadcrumb or page title here */}
            <h2 className="card-title" style={{ textTransform: 'capitalize' }}>
              {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1).replace('-', ' ')}
            </h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{user?.role}</p>
            </div>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <Outlet />
        </main>
      </div>
      <ChatAssistant />
    </div>
  );
};

export default MainLayout;
