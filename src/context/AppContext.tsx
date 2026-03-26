import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Employee, AttendanceRecord, LeaveRequest, SalaryRecord, LoanRequest, FinancialGoal, PerformanceScore, Shift, LifecycleEvent } from '../types';
import { mockEmployees, mockAttendance, mockLeaves, mockSalaries, mockLoans, mockGoals, mockScores, mockShifts, mockEvents } from '../data/mockDb';

interface AppContextType {
  user: Employee | null;
  login: (user: Employee) => void;
  logout: () => void;
  
  employees: Employee[];
  addEmployee: (emp: Employee) => void;
  updateEmployee: (emp: Employee) => void;
  deleteEmployee: (id: string) => void;
  
  attendance: AttendanceRecord[];
  markAttendance: (record: AttendanceRecord) => void;
  
  leaves: LeaveRequest[];
  addLeave: (leave: LeaveRequest) => void;
  updateLeaveStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  
  salaries: SalaryRecord[];
  addSalary: (salary: SalaryRecord) => void;
  
  loans: LoanRequest[];
  updateLoan: (loan: LoanRequest) => void;
  
  goals: FinancialGoal[];
  updateGoal: (goal: FinancialGoal) => void;

  scores: PerformanceScore[];
  shifts: Shift[];
  events: LifecycleEvent[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Employee | null>(null);
  
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(mockLeaves);
  const [salaries, setSalaries] = useState<SalaryRecord[]>(mockSalaries);
  const [loans, setLoans] = useState<LoanRequest[]>(mockLoans);
  const [goals, setGoals] = useState<FinancialGoal[]>(mockGoals);
  const [scores] = useState<PerformanceScore[]>(mockScores);
  const [shifts] = useState<Shift[]>(mockShifts);
  const [events] = useState<LifecycleEvent[]>(mockEvents);

  const login = (userData: Employee) => setUser(userData);
  const logout = () => setUser(null);

  const addEmployee = (emp: Employee) => setEmployees([...employees, emp]);
  const updateEmployee = (emp: Employee) => setEmployees(employees.map(e => e.id === emp.id ? emp : e));
  const deleteEmployee = (id: string) => setEmployees(employees.filter(e => e.id !== id));

  const markAttendance = (record: AttendanceRecord) => setAttendance([...attendance, record]);

  const addLeave = (leave: LeaveRequest) => setLeaves([...leaves, leave]);
  const updateLeaveStatus = (id: string, status: 'Approved' | 'Rejected') => 
    setLeaves(leaves.map(l => l.id === id ? { ...l, status } : l));

  const addSalary = (salary: SalaryRecord) => setSalaries([...salaries, salary]);

  const updateLoan = (loan: LoanRequest) => setLoans(loans.map(l => l.id === loan.id ? loan : l));
  
  const updateGoal = (goal: FinancialGoal) => setGoals(goals.map(g => g.id === goal.id ? goal : g));

  return (
    <AppContext.Provider value={{
      user, login, logout,
      employees, addEmployee, updateEmployee, deleteEmployee,
      attendance, markAttendance,
      leaves, addLeave, updateLeaveStatus,
      salaries, addSalary,
      loans, updateLoan,
      goals, updateGoal,
      scores, shifts, events
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
