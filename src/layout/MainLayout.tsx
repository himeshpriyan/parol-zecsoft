import { useState, useEffect } from 'react';
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
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { ChatAssistant } from '../components/ChatAssistant';

const MainLayout = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close sidebar automatically on navigation route change (mobile view)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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
    <div className="flex h-screen overflow-hidden text-[var(--text-primary)] relative" style={{ backgroundColor: 'var(--bg-dark)' }}>
      {/* Mobile Screen Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50 h-full flex flex-col bg-[var(--bg-card)] border-r border-[var(--border-color)] transition-transform duration-300 w-[var(--sidebar-width)]
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div style={{ 
          height: 'var(--header-height)', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h1 style={{ fontSize: '1.25rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <BrainCircuit /> Payroll.ai
          </h1>
          <button 
            className="md:hidden text-[var(--text-secondary)] hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
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
                className="hover:bg-[var(--bg-card-hover)] hover:text-white"
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}

          <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '1rem 0 0.5rem 0', paddingLeft: '1rem' }}>Smart Modules</h3>
          
          {[
            { name: 'Finance & Loans', path: '/finance', icon: <PiggyBank size={20} /> },
            { name: 'Workforce & Teams', path: '/workforce', icon: <Target size={20} /> },
            { name: 'Smart Shifts', path: '/shifts', icon: <Clock size={20} /> },
            { name: 'Compliance Tracking', path: '/compliance', icon: <ShieldCheck size={20} /> }
          ].map(mod => {
            const isActive = location.pathname === mod.path;
            return (
              <Link key={mod.path} to={mod.path} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: isActive ? 'var(--accent-light)' : 'transparent', color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)', fontWeight: isActive ? 600 : 500, transition: 'all 0.2s' }} className="hover:bg-[var(--bg-card-hover)] hover:text-white">
                {mod.icon} {mod.name}
              </Link>
            );
          })}
        </nav>
        
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button 
            className="btn w-full" 
            onClick={handleLogout}
            style={{ 
              color: 'var(--text-secondary)', 
              justifyContent: 'flex-start',
              padding: '0.75rem 1rem'
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
          justifyContent: 'space-between'
        }} className="px-4 md:px-8">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="md:hidden p-1 text-[var(--text-secondary)] hover:text-white" 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="card-title hidden sm:block" style={{ textTransform: 'capitalize' }}>
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
              fontWeight: 'bold',
              border: '2px solid rgba(59, 130, 246, 0.3)'
            }}>
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '1rem md:padding-2rem' }} className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
      <ChatAssistant />
    </div>
  );
};

export default MainLayout;
