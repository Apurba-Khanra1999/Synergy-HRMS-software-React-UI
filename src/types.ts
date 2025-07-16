
import { z } from 'zod';

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  title: string;
  department: 'Engineering' | 'Marketing' | 'Sales' | 'HR' | 'Design';
  email: string;
  phone: string;
  skills: string[];
  performance: {
    score: number;
    lastReviewDate: Date;
    reviewCycle: 'Annual' | 'Quarterly';
  };
}

export interface Alumnus {
  id: string;
  name: string;
  avatar: string;
  lastRole: string;
  lastDepartment: 'Engineering' | 'Marketing' | 'Sales' | 'HR' | 'Design';
  email: string;
  departureDate: Date;
  contactFor: ('Contract' | 'Freelance' | 'Referral Program')[];
}


export interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeAvatar: string;
  startDate: Date;
  endDate: Date;
  leaveType: 'Vacation' | 'Sick Leave' | 'Personal';
  status: 'Pending' | 'Approved' | 'Denied';
}

export interface WfhRequest {
  id: string;
  employeeName: string;
  employeeAvatar: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
  status: 'Pending' | 'Approved' | 'Denied';
}

export interface OpenPosition {
  id: string;
  title: string;
  department: 'Engineering' | 'Marketing' | 'Sales' | 'HR' | 'Design';
  location: string;
  status: 'Open' | 'Interviewing' | 'Offer Extended' | 'Closed';
  postedDate: Date;
  applicantCount: number;
}

export interface AttendanceRecord {
  id: string;
  employeeName: string;
  employeeAvatar: string;
  date: Date;
  checkIn: string | null;
  checkOut: string | null;
  status: 'On Time' | 'Late' | 'Absent' | 'Present';
  shift: string;
  workHours: number | null;
  overtime: number | null;
}

export type ApplicantStage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';


const ExperienceSchema = z.object({
  title: z.string().describe('The job title.'),
  company: z.string().describe('The name of the company.'),
  duration: z.string().describe('The duration of employment (e.g., "2021 - Present").'),
});

const EducationSchema = z.object({
  institution: z.string().describe('The name of the educational institution.'),
  degree: z.string().describe('The degree or certification obtained.'),
  year: z.string().describe('The year of graduation or completion.'),
});

export const ParseResumeOutputSchema = z.object({
  name: z.string().describe("The applicant's full name."),
  email: z.string().describe("The applicant's email address."),
  phone: z.string().describe("The applicant's phone number."),
  skills: z.array(z.string()).describe('A list of key skills extracted from the resume.'),
  experience: z.array(ExperienceSchema).describe("The applicant's work experience."),
  education: z.array(EducationSchema).describe("The applicant's educational background."),
  resumeSummary: z.string().describe('A 2-3 sentence summary of the resume, highlighting key qualifications and experience.'),
});
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;


export interface Applicant {
    id: string;
    name: string;
    avatar: string;
    email: string;
    phone: string;
    positionId: string;
    appliedDate: Date;
    stage: ApplicantStage;
    skills: string[];
    experience: {
        title: string;
        company: string;
        duration: string;
    }[];
    education: {
        institution: string;
        degree: string;
        year: string;
    }[];
    resumeSummary: string;
}

export interface TravelRequest {
  id: string;
  employeeName: string;
  destination: string;
  purpose: string;
  startDate: Date;
  endDate: Date;
  estimatedCost: number;
  status: 'Pending' | 'Approved' | 'Denied';
}

export interface ExpenseClaim {
    id: string;
    travelRequestId: string | null;
    employeeName: string;
    date: Date;
    expenseType: 'Flight' | 'Hotel' | 'Meals' | 'Transport' | 'Other';
    amount: number;
    receiptUrl?: string;
    status: 'Submitted' | 'Approved' | 'Denied' | 'Reimbursed';
}

export interface Asset {
  id: string;
  name: string;
  type: 'Laptop' | 'Phone' | 'ID Card' | 'Other';
  serialNumber: string;
  status: 'Available' | 'Assigned' | 'In Repair' | 'Retired';
  assignedTo?: string; // Employee ID
  dateAssigned?: Date;
  condition: 'New' | 'Good' | 'Fair' | 'Poor';
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  employeeName: string;
  category: 'Payroll' | 'Benefits' | 'Leave' | 'Policy' | 'Grievance' | 'Other';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdDate: Date;
}

export interface HealthPlan {
  id: string;
  name: string;
  provider: string;
  type: 'PPO' | 'HMO';
  monthlyPremium: number;
  coverageDetails: {
    deductible: number;
    outOfPocketMax: number;
    primaryCareVisit: string;
    specialistVisit: string;
  };
}

export interface Project {
  id: string;
  name: string;
  client: string;
}

export interface TimesheetEntry {
  id: string;
  employeeName: string;
  projectId: string;
  date: Date;
  hours: number;
  isBillable: boolean;
  description: string;
  status: 'Submitted' | 'Approved' | 'Rejected';
}

export type RecognitionCategory = 'Team Player' | 'Innovation' | 'Customer First' | 'Excellence';

export interface Recognition {
  id: string;
  from: {
    name: string;
    avatar: string;
  };
  to: {
    name: string;
    avatar: string;
  };
  category: RecognitionCategory;
  message: string;
  points: number;
  date: Date;
}

export interface AwardRecipient {
  employeeId: string;
  name: string;
  avatar: string;
  points: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'Training' | 'Town Hall' | 'Celebration' | 'Holiday' | 'Other';
  description?: string;
}

export interface LoanRequest {
  id: string;
  employeeName: string;
  amount: number;
  paid: number;
  type: 'Loan' | 'Advance';
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestDate: Date;
}

export interface Referral {
    id: string;
    employeeId: string; // The employee who made the referral
    candidateName: string;
    positionId: string;
    positionTitle: string;
    date: Date;
    status: 'Applied' | 'Screening' | 'Interviewing' | 'Hired' | 'Rejected';
    rewardAmount: number;
    rewardStatus: 'Pending' | 'Paid';
}

export interface ReferralLeaderboardEntry {
    employeeId: string;
    name: string;
    avatar: string;
    successfulReferrals: number;
}

export type FeedbackCategory = 'Praise' | 'Suggestion' | 'Concern';

export interface Feedback {
  id: string;
  from: {
    name: string;
    avatar: string;
  };
  to: {
    name: string;
    avatar: string;
  };
  category: FeedbackCategory;
  message: string;
  date: Date;
  isAnonymous: boolean;
}

export interface PerformanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewDate: Date;
  score: number;
  reviewCycle: 'Annual' | 'Quarterly' | 'Mid-Year';
  department: Employee['department'];
}
