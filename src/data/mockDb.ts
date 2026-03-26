import type { Employee, AttendanceRecord, LeaveRequest, SalaryRecord, LoanRequest, FinancialGoal, PerformanceScore, Shift, LifecycleEvent } from '../types';

export const mockEmployees: Employee[] = [
  {
    id: 'EMP001',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'Admin',
    department: 'Management',
    joinDate: '2020-01-15',
    status: 'Active',
    salaryStructure: {
      basic: 50000,
      hra: 20000,
      da: 10000,
      pf: 1800,
      esi: 0,
      tax: 5000
    }
  },
  {
    id: 'EMP002',
    name: 'Sarah Connor',
    email: 'hr@company.com',
    role: 'HR',
    department: 'Human Resources',
    joinDate: '2021-03-10',
    status: 'Active',
    salaryStructure: {
      basic: 40000,
      hra: 15000,
      da: 8000,
      pf: 1800,
      esi: 0,
      tax: 3000
    }
  },
  {
    id: 'EMP003',
    name: 'John Doe',
    email: 'employee@company.com',
    role: 'Employee',
    department: 'Engineering',
    joinDate: '2022-06-01',
    status: 'Active',
    salaryStructure: {
      basic: 60000,
      hra: 25000,
      da: 12000,
      pf: 1800,
      esi: 0,
      tax: 8000
    }
  },
  {
    id: 'EMP004',
    name: 'Jane Smith',
    email: 'jane@company.com',
    role: 'Employee',
    department: 'Marketing',
    joinDate: '2023-01-20',
    status: 'Active',
    salaryStructure: {
      basic: 35000,
      hra: 12000,
      da: 5000,
      pf: 1800,
      esi: 250,
      tax: 1500
    }
  }
];

// Generate some attendance for current month
export const mockAttendance: AttendanceRecord[] = [
  { id: 'ATT001', employeeId: 'EMP003', date: new Date().toISOString().split('T')[0], status: 'Present', checkIn: '09:00', checkOut: '18:00', overtimeHours: 0 },
  { id: 'ATT002', employeeId: 'EMP004', date: new Date().toISOString().split('T')[0], status: 'Half Day', checkIn: '09:00', checkOut: '13:00', overtimeHours: 0 }
];

export const mockLeaves: LeaveRequest[] = [
  {
    id: 'LEAVE001',
    employeeId: 'EMP003',
    type: 'Sick',
    startDate: '2023-10-15',
    endDate: '2023-10-16',
    status: 'Approved',
    reason: 'Fever'
  },
  {
    id: 'LEAVE002',
    employeeId: 'EMP004',
    type: 'Casual',
    startDate: '2023-11-01',
    endDate: '2023-11-03',
    status: 'Pending',
    reason: 'Personal work'
  }
];

export const mockSalaries: SalaryRecord[] = [
  {
    id: 'SAL001',
    employeeId: 'EMP003',
    month: '10',
    year: 2023,
    earnings: { basic: 60000, hra: 25000, da: 12000, overtime: 0 },
    deductions: { pf: 1800, esi: 0, tax: 8000, other: 0 },
    netPay: 87200,
    status: 'Paid'
  }
];

export const mockLoans: LoanRequest[] = [
  {
    id: 'LOAN001',
    employeeId: 'EMP003',
    amount: 50000,
    emi: 5000,
    reason: 'Medical Emergency',
    status: 'Approved',
    remainingAmount: 40000
  }
];

export const mockGoals: FinancialGoal[] = [
  {
    id: 'GOAL001',
    employeeId: 'EMP003',
    title: 'New Car Fund',
    targetAmount: 500000,
    monthlyDeduction: 10000,
    currentAmount: 120000,
    status: 'Active'
  }
];

export const mockScores: PerformanceScore[] = [
  {
    id: 'SCORE001',
    employeeId: 'EMP003',
    month: '10',
    productivityScore: 92,
    mood: 'Excellent',
    incentiveBonus: 2000
  }
];

export const mockShifts: Shift[] = [
  {
    id: 'SHIFT001',
    employeeId: 'EMP003',
    date: new Date().toISOString().split('T')[0],
    type: 'Morning',
    geoCheckInLocation: '12.9716, 77.5946'
  }
];

export const mockEvents: LifecycleEvent[] = [
  {
    id: 'EVENT001',
    employeeId: 'EMP003',
    date: '2022-06-01',
    type: 'Joined',
    description: 'Joined as Software Engineer'
  },
  {
    id: 'EVENT002',
    employeeId: 'EMP003',
    date: '2023-01-15',
    type: 'Promoted',
    description: 'Promoted to Senior Engineer'
  }
];
