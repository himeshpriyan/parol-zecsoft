export type Role = 'Admin' | 'HR' | 'Employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
}

export interface Employee extends User {
  joinDate: string;
  status: 'Active' | 'Inactive';
  salaryStructure: {
    basic: number;
    hra: number;
    da: number;
    pf: number;
    esi: number;
    tax: number;
  };
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Half Day' | 'Leave';
  checkIn?: string;
  checkOut?: string;
  overtimeHours: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'Sick' | 'Casual' | 'Earned';
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  month: string; // e.g., '2023-10'
  year: number;
  earnings: {
    basic: number;
    hra: number;
    da: number;
    overtime: number;
  };
  deductions: {
    pf: number;
    esi: number;
    tax: number;
    other: number;
  };
  netPay: number;
  status: 'Paid' | 'Pending';
}

export interface LoanRequest {
  id: string;
  employeeId: string;
  amount: number;
  emi: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
  remainingAmount: number;
}

export interface FinancialGoal {
  id: string;
  employeeId: string;
  title: string;
  targetAmount: number;
  monthlyDeduction: number;
  currentAmount: number;
  status: 'Active' | 'Completed';
}

export interface PerformanceScore {
  id: string;
  employeeId: string;
  month: string;
  productivityScore: number; // 0-100
  mood: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  incentiveBonus: number;
}

export interface Shift {
  id: string;
  employeeId: string;
  date: string;
  type: 'Morning' | 'Evening' | 'Night';
  geoCheckInLocation?: string;
}

export interface LifecycleEvent {
  id: string;
  employeeId: string;
  date: string;
  type: 'Joined' | 'Promoted' | 'Salary Revision' | 'Warning';
  description: string;
}
