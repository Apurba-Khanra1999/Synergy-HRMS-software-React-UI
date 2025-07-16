
import { Employee, LeaveRequest, OpenPosition, AttendanceRecord, Applicant, TravelRequest, ExpenseClaim, Asset, WfhRequest, Ticket, HealthPlan, Project, TimesheetEntry, Recognition, AwardRecipient, Alumnus, CalendarEvent, LoanRequest, Referral, ReferralLeaderboardEntry, Feedback, PerformanceRecord } from '@/types';
import { subDays, parse, addDays, subHours, subMonths, set } from 'date-fns';

// Helper to calculate work hours and overtime
const calculateWorkMetrics = (checkIn: string | null, checkOut: string | null): { workHours: number | null, overtime: number | null } => {
  if (!checkIn || !checkOut) {
    return { workHours: null, overtime: null };
  }

  const checkInTime = parse(checkIn, 'HH:mm', new Date());
  const checkOutTime = parse(checkOut, 'HH:mm', new Date());

  const diffMs = checkOutTime.getTime() - checkInTime.getTime();
  let workHours = diffMs / (1000 * 60 * 60);
  
  // Assuming a 1-hour break for shifts longer than 6 hours
  if (workHours > 6) {
    workHours -= 1;
  }

  const overtime = workHours > 8 ? workHours - 8 : 0;

  return { workHours, overtime: overtime > 0 ? overtime : 0 };
};


export const mockEmployees: Employee[] = [
  {
    id: 'EMP001',
    name: 'Alice Johnson',
    avatar: 'https://source.unsplash.com/random/100x100/?woman,portrait',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    email: 'alice.j@synergy.com',
    phone: '123-456-7890',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    performance: {
      score: 4.8,
      lastReviewDate: subMonths(new Date(), 2),
      reviewCycle: 'Quarterly',
    },
  },
  {
    id: 'EMP002',
    name: 'Bob Williams',
    avatar: 'https://source.unsplash.com/random/100x100/?man,portrait',
    title: 'Product Manager',
    department: 'Marketing',
    email: 'bob.w@synergy.com',
    phone: '123-456-7891',
    skills: ['Product Strategy', 'Agile', 'JIRA', 'Market Research'],
    performance: {
      score: 4.2,
      lastReviewDate: subMonths(new Date(), 1),
      reviewCycle: 'Quarterly',
    },
  },
  {
    id: 'EMP003',
    name: 'Charlie Brown',
    avatar: 'https://source.unsplash.com/random/100x100/?man,smiling',
    title: 'Sales Director',
    department: 'Sales',
    email: 'charlie.b@synergy.com',
    phone: '123-456-7892',
    skills: ['Salesforce', 'Negotiation', 'Team Leadership', 'Forecasting'],
    performance: {
      score: 4.9,
      lastReviewDate: subMonths(new Date(), 3),
      reviewCycle: 'Annual',
    },
  },
  {
    id: 'EMP004',
    name: 'Diana Prince',
    avatar: 'https://source.unsplash.com/random/100x100/?woman,professional',
    title: 'HR Generalist',
    department: 'HR',
    email: 'diana.p@synergy.com',
    phone: '123-456-7893',
    skills: ['Recruiting', 'Employee Relations', 'Onboarding', 'HRIS'],
    performance: {
      score: 4.5,
      lastReviewDate: subMonths(new Date(), 4),
      reviewCycle: 'Annual',
    },
  },
  {
    id: 'EMP005',
    name: 'Ethan Hunt',
    avatar: 'https://source.unsplash.com/random/100x100/?man,serious',
    title: 'UI/UX Designer',
    department: 'Design',
    email: 'ethan.h@synergy.com',
    phone: '123-456-7894',
    skills: ['Figma', 'Sketch', 'User Research', 'Prototyping'],
    performance: {
      score: 3.8,
      lastReviewDate: subMonths(new Date(), 2),
      reviewCycle: 'Quarterly',
    },
  },
];

export const mockAlumni: Alumnus[] = [
  {
    id: 'ALUM001',
    name: 'Fiona Gallagher',
    avatar: 'https://source.unsplash.com/random/100x100/?woman,ceo',
    lastRole: 'Head of Marketing',
    lastDepartment: 'Marketing',
    email: 'fiona.g@personal.com',
    departureDate: subMonths(new Date(), 3),
    contactFor: ['Referral Program'],
  },
  {
    id: 'ALUM002',
    name: 'George Lucas',
    avatar: 'https://source.unsplash.com/random/100x100/?man,tech',
    lastRole: 'Senior Backend Engineer',
    lastDepartment: 'Engineering',
    email: 'george.l@personal.dev',
    departureDate: subMonths(new Date(), 8),
    contactFor: ['Contract', 'Freelance'],
  },
  {
    id: 'ALUM003',
    name: 'Hannah Abbott',
    avatar: 'https://source.unsplash.com/random/100x100/?woman,designer',
    lastRole: 'Product Designer',
    lastDepartment: 'Design',
    email: 'hannah.a@personal.io',
    departureDate: subMonths(new Date(), 14),
    contactFor: ['Freelance'],
  },
];


export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'LR001',
    employeeName: 'Bob Williams',
    employeeAvatar: 'https://source.unsplash.com/random/100x100/?man,portrait',
    startDate: new Date(),
    endDate: subDays(new Date(), -5),
    leaveType: 'Vacation',
    status: 'Pending',
  },
  {
    id: 'LR002',
    employeeName: 'Alice Johnson',
    employeeAvatar: 'https://source.unsplash.com/random/100x100/?woman,portrait',
    startDate: subDays(new Date(), 10),
    endDate: subDays(new Date(), 8),
    leaveType: 'Sick Leave',
    status: 'Approved',
  },
  {
    id: 'LR003',
    employeeName: 'Ethan Hunt',
    employeeAvatar: 'https://source.unsplash.com/random/100x100/?man,serious',
    startDate: subDays(new Date(), 2),
    endDate: subDays(new Date(), 1),
    leaveType: 'Personal',
    status: 'Denied',
  },
  {
    id: 'LR004',
    employeeName: 'Diana Prince',
    employeeAvatar: 'https://source.unsplash.com/random/100x100/?woman,professional',
    startDate: subDays(new Date(), 1),
    endDate: subDays(new Date(), 1),
    leaveType: 'Sick Leave',
    status: 'Approved',
  },
];

export const mockWfhRequests: WfhRequest[] = [
    {
        id: 'WFH001',
        employeeName: 'Alice Johnson',
        employeeAvatar: 'https://source.unsplash.com/random/100x100/?woman,portrait',
        startDate: addDays(new Date(), 2),
        endDate: addDays(new Date(), 2),
        reason: 'Focus on project deadline.',
        status: 'Approved',
    },
    {
        id: 'WFH002',
        employeeName: 'Bob Williams',
        employeeAvatar: 'https://source.unsplash.com/random/100x100/?man,portrait',
        startDate: addDays(new Date(), 1),
        endDate: addDays(new Date(), 1),
        status: 'Pending',
    },
    {
        id: 'WFH003',
        employeeName: 'Diana Prince',
        employeeAvatar: 'https://source.unsplash.com/random/100x100/?woman,professional',
        startDate: subDays(new Date(), 1),
        endDate: subDays(new Date(), 1),
        reason: 'Doctor\'s appointment in the morning.',
        status: 'Denied',
    }
]

export const mockOpenPositions: OpenPosition[] = [
  {
    id: 'OP001',
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    status: 'Interviewing',
    postedDate: subDays(new Date(), 14),
    applicantCount: 2,
  },
  {
    id: 'OP002',
    title: 'Digital Marketing Specialist',
    department: 'Marketing',
    location: 'New York, NY',
    status: 'Open',
    postedDate: subDays(new Date(), 5),
    applicantCount: 0,
  },
  {
    id: 'OP003',
    title: 'Account Executive',
    department: 'Sales',
    location: 'San Francisco, CA',
    status: 'Offer Extended',
    postedDate: subDays(new Date(), 35),
    applicantCount: 0,
  },
  {
    id: 'OP004',
    title: 'Recruiter',
    department: 'HR',
    location: 'Austin, TX',
    status: 'Open',
    postedDate: subDays(new Date(), 2),
    applicantCount: 0,
  },
];

export const mockApplicants: Applicant[] = [
    {
        id: 'APP001',
        name: 'John Doe',
        avatar: 'https://source.unsplash.com/random/100x100/?man,professional',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        positionId: 'OP001',
        appliedDate: subDays(new Date(), 5),
        stage: 'Interview',
        skills: ['JavaScript', 'React', 'CSS', 'Next.js', 'GraphQL'],
        experience: [
            { title: 'Frontend Developer', company: 'Tech Solutions Inc.', duration: '2021 - Present' },
            { title: 'Junior Developer', company: 'Web Wizards LLC', duration: '2019 - 2021' },
        ],
        education: [
            { institution: 'State University', degree: 'B.S. in Computer Science', year: '2019' },
        ],
        resumeSummary: "Highly motivated Frontend Developer with 4+ years of experience in building and maintaining responsive web applications using modern technologies. Proven ability to collaborate with cross-functional teams to deliver high-quality software."
    },
    {
        id: 'APP002',
        name: 'Jane Smith',
        avatar: 'https://source.unsplash.com/random/100x100/?woman,tech',
        email: 'jane.smith@example.com',
        phone: '555-987-6543',
        positionId: 'OP001',
        appliedDate: subDays(new Date(), 2),
        stage: 'Screening',
        skills: ['TypeScript', 'React', 'Vue.js', 'Testing', 'CI/CD'],
        experience: [
            { title: 'Software Engineer', company: 'Innovate Corp.', duration: '2020 - Present' },
        ],
        education: [
            { institution: 'Code Academy', degree: 'Full-Stack Web Development Bootcamp', year: '2020' },
        ],
        resumeSummary: "Creative Software Engineer with a passion for clean code and user-centric design. Experienced in both frontend and backend development, with a strong focus on React and TypeScript."
    }
];

export const mockHeadcountData = [
    { month: 'Jan', headcount: 250 },
    { month: 'Feb', headcount: 255 },
    { month: 'Mar', headcount: 260 },
    { month: 'Apr', headcount: 265 },
    { month: 'May', headcount: 270 },
    { month: 'Jun', headcount: 275 },
];

export const mockTurnoverData = [
    { quarter: 'Q1', rate: 2.1 },
    { quarter: 'Q2', rate: 1.8 },
    { quarter: 'Q3', rate: 2.5 },
    { quarter: 'Q4', rate: 2.2 },
];

export const CHART_COLORS = {
  "Engineering": "hsl(var(--chart-1))",
  "Marketing": "hsl(var(--chart-2))",
  "Sales": "hsl(var(--chart-3))",
  "HR": "hsl(var(--chart-4))",
  "Design": "hsl(var(--chart-5))",
  "Male": "hsl(var(--chart-1))",
  "Female": "hsl(var(--chart-2))",
  "Other": "hsl(var(--chart-3))",
}

export const mockDepartmentHeadcount = [
  { department: 'Engineering', employees: 110, fill: CHART_COLORS.Engineering },
  { department: 'Sales', employees: 60, fill: CHART_COLORS.Sales },
  { department: 'Marketing', employees: 45, fill: CHART_COLORS.Marketing },
  { department: 'Design', employees: 30, fill: CHART_COLORS.Design },
  { department: 'HR', employees: 30, fill: CHART_COLORS.HR },
];

export const mockSalaryByDepartment = [
  { department: 'Engineering', salary: 105000 },
  { department: 'Design', salary: 95000 },
  { department: 'Sales', salary: 88000 },
  { department: 'Marketing', salary: 82000 },
  { department: 'HR', salary: 78000 },
];

const attendanceData: Omit<AttendanceRecord, 'workHours' | 'overtime'>[] = [
  {
    id: 'ATT001',
    employeeName: 'Alice Johnson',
    employeeAvatar: 'https://source.unsplash.com/random/100x100/?woman,portrait',
    date: new Date(),
    checkIn: '08:55',
    checkOut: '17:05',
    status: 'On Time',
    shift: '09:00-17:00',
  },
  {
    id: 'ATT002',
    employeeName: 'Bob Williams',
    employeeAvatar: 'https://source.unsplash.com/random/100x100/?man,portrait',
    date: new Date(),
    checkIn: '09:15',
    checkOut: '18:30',
    status: 'Late',
    shift: '09:00-17:00',
  },
  {
    id: 'ATT003',
    employeeName: 'Charlie Brown',
    employeeAvatar: 'https://source.unsplash.com/random/100x100/?man,smiling',
    date: new Date(),
    checkIn: null,
    checkOut: null,
    status: 'Absent',
    shift: '09:00-17:00',
  },
   {
    id: 'ATT004',
    employeeName: 'Diana Prince',
    employeeAvatar: 'https://source.unsplash.com/random/100x100/?woman,professional',
    date: new Date(),
    checkIn: '09:00',
    checkOut: '17:00',
    status: 'On Time',
    shift: '09:00-17:00',
  },
  {
    id: 'ATT005',
    employeeName: 'Ethan Hunt',
    employeeAvatar: 'https://source.unsplash.com/random/100x100/?man,serious',
    date: new Date(),
    checkIn: '09:05',
    checkOut: null,
    status: 'Present',
    shift: '09:00-17:00',
  },
  {
    id: 'ATT006',
    employeeName: 'Alice Johnson',
    employeeAvatar: 'https://source.unsplash.com/random/100x100/?woman,portrait',
    date: subDays(new Date(), 1),
    checkIn: '08:58',
    checkOut: '18:02',
    status: 'On Time',
    shift: '09:00-17:00',
  },
  {
    id: 'ATT007',
    employeeName: 'Bob Williams',
    employeeAvatar: 'https://source.unsplash.com/random/100x100/?man,portrait',
    date: subDays(new Date(), 1),
    checkIn: '09:25',
    checkOut: '17:45',
    status: 'Late',
    shift: '09:00-17:00',
  },
  {
    id: 'ATT008',
    employeeName: 'Ethan Hunt',
    employeeAvatar: 'https://source.unsplash.com/random/100x100/?man,serious',
    date: subDays(new Date(), 1),
    checkIn: '09:00',
    checkOut: '17:00',
    status: 'On Time',
    shift: '09:00-17:00',
  },
];

export const mockAttendanceRecords: AttendanceRecord[] = attendanceData.map(record => ({
  ...record,
  ...calculateWorkMetrics(record.checkIn, record.checkOut),
}));

export const mockTravelRequests: TravelRequest[] = [
  {
    id: 'TR001',
    employeeName: 'Alice Johnson',
    destination: 'London, UK',
    purpose: 'Client Meeting',
    startDate: addDays(new Date(), 10),
    endDate: addDays(new Date(), 15),
    estimatedCost: 3200,
    status: 'Approved',
  },
  {
    id: 'TR002',
    employeeName: 'Charlie Brown',
    destination: 'Las Vegas, NV',
    purpose: 'Annual Sales Conference',
    startDate: addDays(new Date(), 20),
    endDate: addDays(new Date(), 23),
    estimatedCost: 1800,
    status: 'Pending',
  },
  {
    id: 'TR003',
    employeeName: 'Ethan Hunt',
    destination: 'Berlin, Germany',
    purpose: 'Design Workshop',
    startDate: addDays(new Date(), 5),
    endDate: addDays(new Date(), 9),
    estimatedCost: 2500,
    status: 'Denied',
  },
];

export const mockExpenseClaims: ExpenseClaim[] = [
    {
        id: 'EC001',
        travelRequestId: 'TR001',
        employeeName: 'Alice Johnson',
        date: subDays(new Date(), 5),
        expenseType: 'Flight',
        amount: 1250.55,
        status: 'Reimbursed',
    },
    {
        id: 'EC002',
        travelRequestId: null,
        employeeName: 'Bob Williams',
        date: subDays(new Date(), 2),
        expenseType: 'Meals',
        amount: 75.20,
        status: 'Submitted',
    },
    {
        id: 'EC003',
        travelRequestId: 'TR001',
        employeeName: 'Alice Johnson',
        date: subDays(new Date(), 4),
        expenseType: 'Hotel',
        amount: 850.00,
        status: 'Approved',
    },
    {
        id: 'EC004',
        travelRequestId: null,
        employeeName: 'Charlie Brown',
        date: subDays(new Date(), 10),
        expenseType: 'Transport',
        amount: 45.00,
        status: 'Denied',
    }
];

export const mockAssets: Asset[] = [
  {
    id: 'ASSET001',
    name: 'MacBook Pro 16"',
    type: 'Laptop',
    serialNumber: 'C02G8R2JLVCF',
    status: 'Assigned',
    assignedTo: 'EMP001',
    dateAssigned: subDays(new Date(), 300),
    condition: 'Good',
  },
  {
    id: 'ASSET002',
    name: 'Dell XPS 15',
    type: 'Laptop',
    serialNumber: 'DXPS15-987654',
    status: 'Available',
    condition: 'New',
  },
  {
    id: 'ASSET003',
    name: 'iPhone 15 Pro',
    type: 'Phone',
    serialNumber: 'IP15P-123456',
    status: 'Assigned',
    assignedTo: 'EMP003',
    dateAssigned: subDays(new Date(), 60),
    condition: 'Good',
  },
  {
    id: 'ASSET004',
    name: 'ID Card',
    type: 'ID Card',
    serialNumber: 'IDC-EMP002',
    status: 'Assigned',
    assignedTo: 'EMP002',
    dateAssigned: subDays(new Date(), 450),
    condition: 'Fair',
  },
  {
    id: 'ASSET005',
    name: 'Lenovo ThinkPad X1',
    type: 'Laptop',
    serialNumber: 'LTX1-555444',
    status: 'In Repair',
    condition: 'Poor',
  },
  {
    id: 'ASSET006',
    name: 'Samsung Galaxy S23',
    type: 'Phone',
    serialNumber: 'SGS23-777888',
    status: 'Available',
    condition: 'New',
  },
  {
    id: 'ASSET007',
    name: 'MacBook Pro 14"',
    type: 'Laptop',
    serialNumber: 'C02H1A2B3D4E',
    status: 'Retired',
    condition: 'Poor',
  },
];

export const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'Incorrect Tax Deduction',
    description: 'I believe my tax deduction for last month was incorrect. Can someone please check?',
    employeeName: 'Bob Williams',
    category: 'Payroll',
    status: 'In Progress',
    createdDate: subDays(new Date(), 2),
  },
  {
    id: 'TKT-002',
    subject: 'How to enroll in dental plan?',
    description: 'I missed the open enrollment period but would like to enroll in the dental plan. What are my options?',
    employeeName: 'Ethan Hunt',
    category: 'Benefits',
    status: 'Resolved',
    createdDate: subDays(new Date(), 15),
  },
  {
    id: 'TKT-003',
    subject: 'Request for standing desk',
    description: 'I would like to request a standing desk for my workstation due to back issues.',
    employeeName: 'Alice Johnson',
    category: 'Other',
    status: 'Open',
    createdDate: subDays(new Date(), 1),
  },
  {
    id: 'TKT-004',
    subject: 'Question about WFH policy',
    description: 'What is the company policy on working from home on a regular basis?',
    employeeName: 'Diana Prince',
    category: 'Policy',
    status: 'Resolved',
    createdDate: subDays(new Date(), 25),
  },
];

export const currentUserPlan: HealthPlan = {
  id: 'plan-002',
  name: 'Gold PPO Plan',
  provider: 'United Health',
  type: 'PPO',
  monthlyPremium: 250,
  coverageDetails: {
    deductible: 1000,
    outOfPocketMax: 5000,
    primaryCareVisit: '$25 Co-pay',
    specialistVisit: '$50 Co-pay',
  }
};

export const mockHealthPlans: HealthPlan[] = [
  {
    id: 'plan-001',
    name: 'Bronze HMO Plan',
    provider: 'Kaiser Permanente',
    type: 'HMO',
    monthlyPremium: 150,
    coverageDetails: {
      deductible: 3000,
      outOfPocketMax: 8000,
      primaryCareVisit: '$45 Co-pay',
      specialistVisit: '$75 Co-pay (Referral Required)',
    }
  },
  currentUserPlan,
  {
    id: 'plan-003',
    name: 'Platinum PPO Plan',
    provider: 'Blue Cross',
    type: 'PPO',
    monthlyPremium: 400,
    coverageDetails: {
      deductible: 500,
      outOfPocketMax: 3000,
      primaryCareVisit: '$15 Co-pay',
      specialistVisit: '$30 Co-pay',
    }
  }
];

export const mockProjects: Project[] = [
  { id: 'PROJ-01', name: 'Website Redesign', client: 'Innovate Corp' },
  { id: 'PROJ-02', name: 'Mobile App Development', client: 'Tech Solutions Inc.' },
  { id: 'PROJ-03', name: 'Q3 Marketing Campaign', client: 'Internal' },
];

export const mockTimesheetEntries: TimesheetEntry[] = [
  {
    id: 'TS001',
    employeeName: 'Alice Johnson',
    projectId: 'PROJ-01',
    date: subDays(new Date(), 1),
    hours: 8,
    isBillable: true,
    description: 'Worked on homepage UI components.',
    status: 'Submitted',
  },
  {
    id: 'TS002',
    employeeName: 'Ethan Hunt',
    projectId: 'PROJ-01',
    date: subDays(new Date(), 1),
    hours: 6,
    isBillable: true,
    description: 'Created wireframes for the new checkout flow.',
    status: 'Approved',
  },
  {
    id: 'TS003',
    employeeName: 'Bob Williams',
    projectId: 'PROJ-03',
    date: subDays(new Date(), 2),
    hours: 4,
    isBillable: false,
    description: 'Planning meeting for social media strategy.',
    status: 'Approved',
  },
    {
    id: 'TS004',
    employeeName: 'Alice Johnson',
    projectId: 'PROJ-02',
    date: subDays(new Date(), 3),
    hours: 8,
    isBillable: true,
    description: 'Setup initial project structure and auth screens.',
    status: 'Rejected',
  },
];

export const mockLeaderboard: AwardRecipient[] = [
  { employeeId: 'EMP001', name: 'Alice Johnson', avatar: 'https://source.unsplash.com/random/100x100/?woman,portrait', points: 150 },
  { employeeId: 'EMP003', name: 'Charlie Brown', avatar: 'https://source.unsplash.com/random/100x100/?man,smiling', points: 125 },
  { employeeId: 'EMP005', name: 'Ethan Hunt', avatar: 'https://source.unsplash.com/random/100x100/?man,serious', points: 110 },
  { employeeId: 'EMP004', name: 'Diana Prince', avatar: 'https://source.unsplash.com/random/100x100/?woman,professional', points: 95 },
  { employeeId: 'EMP002', name: 'Bob Williams', avatar: 'https://source.unsplash.com/random/100x100/?man,portrait', points: 80 },
];

export const mockRecognitions: Recognition[] = [
  {
    id: 'REC001',
    from: { name: 'Diana Prince', avatar: 'https://source.unsplash.com/random/100x100/?woman,professional' },
    to: { name: 'Alice Johnson', avatar: 'https://source.unsplash.com/random/100x100/?woman,portrait' },
    category: 'Team Player',
    message: 'Alice is always willing to jump in and help, no matter the task. Her support on the latest deployment was invaluable!',
    points: 10,
    date: subHours(new Date(), 2),
  },
  {
    id: 'REC002',
    from: { name: 'Bob Williams', avatar: 'https://source.unsplash.com/random/100x100/?man,portrait' },
    to: { name: 'Ethan Hunt', avatar: 'https://source.unsplash.com/random/100x100/?man,serious' },
    category: 'Innovation',
    message: 'Ethan\'s new design for the user dashboard is a game-changer. It\'s both beautiful and incredibly intuitive.',
    points: 15,
    date: subDays(new Date(), 1),
  },
  {
    id: 'REC003',
    from: { name: 'Alice Johnson', avatar: 'https://source.unsplash.com/random/100x100/?woman,portrait' },
    to: { name: 'Charlie Brown', avatar: 'https://source.unsplash.com/random/100x100/?man,smiling' },
    category: 'Customer First',
    message: 'Charlie went above and beyond to resolve a tricky customer issue, turning a frustrated client into a happy one. Amazing work!',
    points: 10,
    date: subDays(new Date(), 2),
  },
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'EVT001',
    title: 'Q3 All-Hands Town Hall',
    date: addDays(new Date(), 3),
    type: 'Town Hall',
    description: 'Join us for the quarterly all-hands meeting to discuss Q3 results and Q4 goals.'
  },
  {
    id: 'EVT002',
    title: 'Engineering Tech Talk',
    date: addDays(new Date(), 7),
    type: 'Training',
    description: 'A deep dive into our new microservices architecture.'
  },
  {
    id: 'EVT003',
    title: 'Summer BBQ Party',
    date: addDays(new Date(), 10),
    type: 'Celebration',
    description: 'Let\'s celebrate a great quarter with some food and fun!'
  },
  {
    id: 'EVT004',
    title: 'Labor Day',
    date: set(new Date(), { month: 8, date: 2 }), // First monday of september
    type: 'Holiday',
    description: 'Company-wide holiday.'
  },
   {
    id: 'EVT005',
    title: 'React Best Practices',
    date: addDays(new Date(), 3),
    type: 'Training',
    description: 'Workshop on advanced React patterns and best practices.'
  }
];

export const mockLoanRequests: LoanRequest[] = [
  {
    id: 'LOAN001',
    employeeName: 'Bob Williams',
    amount: 500,
    paid: 0,
    type: 'Advance',
    reason: 'Unexpected medical expense.',
    status: 'Approved',
    requestDate: subDays(new Date(), 2),
  },
  {
    id: 'LOAN002',
    employeeName: 'Alice Johnson',
    amount: 5000,
    paid: 1000,
    type: 'Loan',
    reason: 'Home renovation project.',
    status: 'Approved',
    requestDate: subDays(new Date(), 30),
  },
  {
    id: 'LOAN003',
    employeeName: 'Ethan Hunt',
    amount: 1000,
    paid: 0,
    type: 'Advance',
    reason: 'Car repair.',
    status: 'Rejected',
    requestDate: subDays(new Date(), 10),
  },
  {
    id: 'LOAN004',
    employeeName: 'Diana Prince',
    amount: 2000,
    paid: 0,
    type: 'Loan',
    reason: 'Family emergency.',
    status: 'Pending',
    requestDate: subDays(new Date(), 1),
  }
];

export const mockReferrals: Referral[] = [
    {
        id: 'REF001',
        employeeId: 'EMP002',
        candidateName: 'Maria Garcia',
        positionId: 'OP001',
        positionTitle: 'Frontend Developer',
        date: subDays(new Date(), 10),
        status: 'Hired',
        rewardAmount: 1500,
        rewardStatus: 'Paid',
    },
    {
        id: 'REF002',
        employeeId: 'EMP001',
        candidateName: 'Ken Adams',
        positionId: 'OP002',
        positionTitle: 'Digital Marketing Specialist',
        date: subDays(new Date(), 5),
        status: 'Interviewing',
        rewardAmount: 1000,
        rewardStatus: 'Pending',
    },
    {
        id: 'REF003',
        employeeId: 'EMP002',
        candidateName: 'Sarah Jenkins',
        positionId: 'OP004',
        positionTitle: 'Recruiter',
        date: subDays(new Date(), 2),
        status: 'Applied',
        rewardAmount: 750,
        rewardStatus: 'Pending',
    }
];

export const mockReferralLeaderboard: ReferralLeaderboardEntry[] = [
    { employeeId: 'EMP002', name: 'Bob Williams', avatar: 'https://source.unsplash.com/random/100x100/?man,portrait', successfulReferrals: 3 },
    { employeeId: 'EMP004', name: 'Diana Prince', avatar: 'https://source.unsplash.com/random/100x100/?woman,professional', successfulReferrals: 2 },
    { employeeId: 'EMP001', name: 'Alice Johnson', avatar: 'https://source.unsplash.com/random/100x100/?woman,portrait', successfulReferrals: 1 },
];

export const mockFeedback: Feedback[] = [
  {
    id: 'FBK001',
    from: { name: 'Alice Johnson', avatar: 'https://source.unsplash.com/random/100x100/?woman,portrait' },
    to: { name: 'Ethan Hunt', avatar: 'https://source.unsplash.com/random/100x100/?man,serious' },
    category: 'Suggestion',
    message: 'Maybe we can explore using a new design tool for our next project to improve collaboration.',
    date: subHours(new Date(), 5),
    isAnonymous: false,
  },
  {
    id: 'FBK002',
    from: { name: 'Diana Prince', avatar: 'https://source.unsplash.com/random/100x100/?woman,professional' },
    to: { name: 'Bob Williams', avatar: 'https://source.unsplash.com/random/100x100/?man,portrait' },
    category: 'Praise',
    message: 'Great presentation on the product roadmap today! It was very clear and insightful.',
    date: subDays(new Date(), 1),
    isAnonymous: false,
  },
  {
    id: 'FBK003',
    from: { name: 'Charlie Brown', avatar: 'https://source.unsplash.com/random/100x100/?man,smiling' },
    to: { name: 'Diana Prince', avatar: 'https://source.unsplash.com/random/100x100/?woman,professional' },
    category: 'Concern',
    message: 'I felt that the new onboarding process was a bit rushed. Maybe we can allocate more time for the next cohort.',
    date: subDays(new Date(), 3),
    isAnonymous: true,
  },
];

export const mockPerformanceDistribution = [
  { rating: 'Needs Improvement', count: 15, fill: 'hsl(var(--chart-5))' },
  { rating: 'Meets Expectations', count: 150, fill: 'hsl(var(--chart-4))' },
  { rating: 'Exceeds Expectations', count: 90, fill: 'hsl(var(--chart-2))' },
  { rating: 'Outstanding', count: 20, fill: 'hsl(var(--chart-1))' },
]

export const mockPerformanceByDepartment = [
  { department: 'Engineering', score: 4.5 },
  { department: 'Design', score: 3.8 },
  { department: 'Sales', score: 4.8 },
  { department: 'Marketing', score: 4.0 },
  { department: 'HR', score: 4.2 },
]

export const mockRecruitmentFunnel = [
  { value: 120, name: 'Applied', fill: 'hsl(var(--chart-1))' },
  { value: 80, name: 'Screening', fill: 'hsl(var(--chart-2))' },
  { value: 45, name: 'Interview', fill: 'hsl(var(--chart-3))' },
  { value: 15, name: 'Offer', fill: 'hsl(var(--chart-4))' },
  { value: 8, name: 'Hired', fill: 'hsl(var(--chart-5))' },
];

export const dashboardInsights = {
    upcomingLeave: mockLeaveRequests.filter(r => r.startDate > new Date() && r.startDate < addDays(new Date(), 7)).length,
    openTickets: mockTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length,
    pendingTimesheets: mockTimesheetEntries.filter(t => t.status === 'Submitted').length,
    employeesOnTravel: mockTravelRequests.filter(r => r.status === 'Approved' && new Date() >= r.startDate && new Date() <= r.endDate).length
}
