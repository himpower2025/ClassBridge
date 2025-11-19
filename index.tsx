
// Ensure we are using the global React/ReactDOM variables loaded via UMD in index.html
const React = (window as any).React;
const ReactDOM = (window as any).ReactDOM;

// Destructure the hooks and functions we need
const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;

console.log("ClassBridge App Starting... React Version:", React.version);

type Role = 'Student' | 'Parent' | 'Teacher' | 'Administrator';

// --- UPDATED LOGO COMPONENT (Uses PNG from Manifest) ---
const ClassBridgeLogo = ({ size = 64 }) => {
    // Use the high-quality PNG from the manifest
    const logoUrl = "https://storage.googleapis.com/maker-studio-project-media-prod/media/20240502111105151528-5e2ea7a6c9e9.png";
    
    return (
        <img 
            src={logoUrl} 
            alt="ClassBridge Logo" 
            className="classbridge-logo"
            style={{ 
                width: size, 
                height: size, 
                objectFit: 'contain',
                borderRadius: '12px',
                display: 'block' // Removes inline spacing issues
            }} 
        />
    );
};

// --- NEW SCHOOL-SPECIFIC LOGO COMPONENT ---
const SchoolLogo = ({ logoUrl, schoolName }) => {
    if (logoUrl) {
        return <img src={logoUrl} alt={`${schoolName} Logo`} className="school-logo-image" />;
    }
    // Fallback to the generic ClassBridge logo if no specific URL is provided
    return <ClassBridgeLogo size={40} />;
};


// --- MOCK DATA AND TYPES ---
interface SchoolConfig {
    id: string;
    name: string;
    primaryColor: string;
    logoUrl?: string; // Optional: URL for the school's specific logo
    schoolType: 'Elementary' | 'Secondary';
    features: {
        schoolBusTracking?: boolean;
        collegeCounselingPortal?: boolean;
        // ... other feature flags can be added here
    };
}

interface UserRegistryEntry {
    userId: number;
    role: Role;
    schoolId: string;
    email: string;
}

// --- NEW CONFIGURATION-BASED SCHOOL DEFINITIONS ---
const schoolConfigs: Record<string, SchoolConfig> = {
    'ea': {
        id: 'ea',
        name: 'Everest Academy',
        primaryColor: '#4A90E2',
        logoUrl: 'https://storage.googleapis.com/maker-studio-project-media-prod/media/20240502111105151528-5e2ea7a6c9e9.png',
        schoolType: 'Elementary',
        features: {
            schoolBusTracking: true,
        },
    },
    'his': {
        id: 'his',
        name: 'Himalayan International School',
        primaryColor: '#34A853',
        logoUrl: 'https://storage.googleapis.com/maker-studio-project-media-prod/media/20240502111109018449-31742a23330f.png',
        schoolType: 'Secondary',
        features: {
            schoolBusTracking: false,
        },
    },
    'lpa': {
        id: 'lpa',
        name: 'Life-Prep Academy',
        primaryColor: '#002D62', // Dark, academic blue from logo
        logoUrl: 'https://storage.googleapis.com/maker-studio-project-media-prod/media/20240503063821815198-1d145f8e0797.png',
        schoolType: 'Secondary',
        features: {
            schoolBusTracking: false,
            collegeCounselingPortal: true, // Custom feature for this school
        },
    },
    'eis': {
        id: 'eis',
        name: 'Everest International School',
        primaryColor: '#0077c2', // A professional, sky blue
        logoUrl: 'https://storage.googleapis.com/maker-studio-project-media-prod/media/20240502111105151528-5e2ea7a6c9e9.png', // Using a similar logo for demo
        schoolType: 'Elementary',
        features: {
            schoolBusTracking: true,
        },
    },
};


const mockUserRegistry: Record<string, Omit<UserRegistryEntry, 'email'> | Omit<UserRegistryEntry, 'email'>[]> = {
    // Everest Academy Users
    'alex.kim@example.com': { userId: 1, role: 'Student', schoolId: 'ea' },
    'charles.kim@gmail.com': { userId: 201, role: 'Parent', schoolId: 'ea' },
    'ms.davis@everest-academy.edu': { userId: 101, role: 'Teacher', schoolId: 'ea' },
    'principal.evans@everest-academy.edu': { userId: 999, role: 'Administrator', schoolId: 'ea' },
    'chen.admin@everest-academy.edu': { userId: 998, role: 'Administrator', schoolId: 'ea' },
    // Himalayan International School Users
    'emily.park@example.com': { userId: 2, role: 'Student', schoolId: 'his' },
    'sarah.park@yahoo.com': { userId: 202, role: 'Parent', schoolId: 'his' },
    'mr.lee@himalayan.edu': { userId: 102, role: 'Teacher', schoolId: 'his' },
    // New Students & Parents for Ms. Davis's Class
    'liam.chen@example.com': { userId: 3, role: 'Student', schoolId: 'ea' },
    'david.chen@gmail.com': { userId: 203, role: 'Parent', schoolId: 'ea' },
    'olivia.garcia@example.com': { userId: 4, role: 'Student', schoolId: 'ea' },
    'maria.garcia@yahoo.com': { userId: 204, role: 'Parent', schoolId: 'ea' },
    'noah.r@example.com': { userId: 5, role: 'Student', schoolId: 'ea' },
    'james.rodriguez@hotmail.com': { userId: 205, role: 'Parent', schoolId: 'ea' },
    'sophia.miller@example.com': { userId: 6, role: 'Student', schoolId: 'ea' },
    'linda.m@gmail.com': { userId: 206, role: 'Parent', schoolId: 'ea' },
    // New Secondary Students & Parents for Mr. Lee
    'rohan.sharma@example.com': { userId: 7, role: 'Student', schoolId: 'his' },
    'vikram.sharma@gmail.com': { userId: 207, role: 'Parent', schoolId: 'his' },
    'priya.patel@example.com': { userId: 8, role: 'Student', schoolId: 'his' },
    'nita.patel@yahoo.com': { userId: 208, role: 'Parent', schoolId: 'his' },
    'sanjay.gupta@example.com': { userId: 9, role: 'Student', schoolId: 'his' },
    'raj.gupta@hotmail.com': { userId: 209, role: 'Parent', schoolId: 'his' },
    'anjali.singh@example.com': { userId: 10, role: 'Student', schoolId: 'his' },
    'meera.singh@gmail.com': { userId: 210, role: 'Parent', schoolId: 'his' },
    // Life-Prep Academy Users
    'ben.carter@lpa.edu': { userId: 11, role: 'Student', schoolId: 'lpa' },
    'susan.carter@gmail.com': { userId: 211, role: 'Parent', schoolId: 'lpa' },
    'dr.wallace@lpa.edu': { userId: 106, role: 'Teacher', schoolId: 'lpa' },
    // Everest International School Users (New)
    'aarav.sharma@example.com': { userId: 12, role: 'Student', schoolId: 'eis' },
    'prakash.sharma@gmail.com': { userId: 212, role: 'Parent', schoolId: 'eis' },
    'mrs.thapa@eis.edu.np': { userId: 107, role: 'Teacher', schoolId: 'eis' },
    // FIX: Add user registry entry for student with ID 13 to ensure data consistency.
    'zoe.r@example.com': { userId: 13, role: 'Student', schoolId: 'his' },
    // --- NEW MULTI-SCHOOL USERS ---
    'teacher.multi@example.com': [
        { userId: 105, role: 'Teacher', schoolId: 'ea' },
        { userId: 105, role: 'Teacher', schoolId: 'lpa' },
    ],
    'parent.multi@example.com': [
        { userId: 213, role: 'Parent', schoolId: 'ea' },
        { userId: 213, role: 'Parent', schoolId: 'his' },
    ]
};

// Add email to registry entries, handling both single and array entries
const completeUserRegistry = Object.entries(mockUserRegistry).reduce((acc, [email, data]) => {
    if (Array.isArray(data)) {
        acc[email] = data.map(d => ({ ...d, email }));
    } else {
        acc[email] = [{ ...data, email }];
    }
    return acc;
}, {} as Record<string, UserRegistryEntry[]>);


interface Grade {
  subject: string;
  score: string;
}

interface Attendance {
  present: number;
  tardy: number;  
  absent: number;
}

interface TimetableEntry {
    day: string;
    time: string;
    subject:string;
    teacher: string;
}

interface ReportEntry {
    subject: string;
    score: string;
    comment: string;
}

interface ReportCard {
    id: number;
    studentId: number;
    term: string;
    issueDate: string;
    overallComment: string;

    entries: ReportEntry[];
}

interface TuitionItem {
    description: string;
    amount: number;
}

interface TuitionInvoice {
    id: number;
    studentId: number;
    term: string;
    amount: number;
    dueDate: string;
    status: 'Paid' | 'Due' | 'Overdue';
    items: TuitionItem[];
    issueDate: string;
    paidDate?: string;
}

interface User {
  id: number;
  name: string;
  role: Role;
}

interface Teacher extends User {
    role: 'Teacher';
    teachesGrades?: string[];
}


interface Child extends User {
  role: 'Student';
  // FIX: Add email property to Child interface to resolve type errors.
  email: string;
  parentId: number;
  grade: string;
  teacher: string;
  grades: Grade[];
  attendance: Attendance;
  timetable: TimetableEntry[];
}

interface Parent extends User {
    role: 'Parent';
    childrenIds: number[];
}

interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  recipientRole?: Role | 'All';
}

const mockInitialChildren: Child[] = [
  {
    id: 1,
    name: 'Alex Kim',
    email: 'alex.kim@example.com',
    role: 'Student',
    parentId: 201,
    grade: 'Grade 5',
    teacher: 'Ms. Davis',
    grades: [
      { subject: 'Mathematics', score: 'A-' },
      { subject: 'Science', score: 'B+' },
      { subject: 'English', score: 'A' },
      { subject: 'History', score: 'B' },
    ],
    attendance: { present: 85, tardy: 3, absent: 2 },
    timetable: [
        { day: 'Monday', time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Ms. Davis' },
        { day: 'Monday', time: '10:15 - 11:15', subject: 'English', teacher: 'Mr. Smith' },
        { day: 'Tuesday', time: '09:00 - 10:00', subject: 'Science', teacher: 'Ms. Jones' },
        { day: 'Wednesday', time: '11:30 - 12:30', subject: 'History', teacher: 'Mr. Brown' },
        { day: 'Friday', time: '13:00 - 14:00', subject: 'Art', teacher: 'Ms. White' },
    ]
  },
  {
    id: 2,
    name: 'Emily Park',
    email: 'emily.park@example.com',
    role: 'Student',
    parentId: 202,
    grade: 'Grade 7',
    teacher: 'Mr. Lee',
    grades: [
      { subject: 'English', score: 'A' },
      { subject: 'History', score: 'B+' },
      { subject: 'Music', score: 'A-' },
    ],
    attendance: { present: 88, tardy: 1, absent: 1 },
    timetable: [
        { day: 'Monday', time: '09:00 - 10:00', subject: 'English', teacher: 'Mr. Lee' },
        { day: 'Tuesday', time: '10:15 - 11:15', subject: 'History', teacher: 'Mr. Sharma' },
        { day: 'Thursday', time: '13:00 - 14:00', subject: 'Music', teacher: 'Ms. Green' },
    ]
  },
  // New students for Ms. Davis's class
  {
    id: 3,
    name: 'Liam Chen',
    email: 'liam.chen@example.com',
    role: 'Student',
    parentId: 203,
    grade: 'Grade 5',
    teacher: 'Ms. Davis',
    grades: [
      { subject: 'Mathematics', score: 'B+' },
      { subject: 'Science', score: 'A-' },
      { subject: 'English', score: 'B' },
      { subject: 'History', score: 'A' },
    ],
    attendance: { present: 88, tardy: 1, absent: 1 },
    timetable: [
        { day: 'Monday', time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Ms. Davis' },
        { day: 'Monday', time: '10:15 - 11:15', subject: 'English', teacher: 'Mr. Smith' },
        { day: 'Tuesday', time: '09:00 - 10:00', subject: 'Science', teacher: 'Ms. Jones' },
        { day: 'Wednesday', time: '11:30 - 12:30', subject: 'History', teacher: 'Mr. Brown' },
        { day: 'Friday', time: '13:00 - 14:00', subject: 'Art', teacher: 'Ms. White' },
    ]
  },
  {
    id: 4,
    name: 'Olivia Garcia',
    email: 'olivia.garcia@example.com',
    role: 'Student',
    parentId: 204,
    grade: 'Grade 5',
    teacher: 'Ms. Davis',
    grades: [
      { subject: 'Mathematics', score: 'A' },
      { subject: 'Science', score: 'A' },
      { subject: 'English', score: 'B+' },
      { subject: 'History', score: 'B+' },
    ],
    attendance: { present: 90, tardy: 0, absent: 0 },
    timetable: [
        { day: 'Monday', time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Ms. Davis' },
        { day: 'Monday', time: '10:15 - 11:15', subject: 'English', teacher: 'Mr. Smith' },
        { day: 'Tuesday', time: '09:00 - 10:00', subject: 'Science', teacher: 'Ms. Jones' },
        { day: 'Wednesday', time: '11:30 - 12:30', subject: 'History', teacher: 'Mr. Brown' },
        { day: 'Friday', time: '13:00 - 14:00', subject: 'Art', teacher: 'Ms. White' },
    ]
  },
  {
    id: 5,
    name: 'Noah Rodriguez',
    email: 'noah.r@example.com',
    role: 'Student',
    parentId: 205,
    grade: 'Grade 5',
    teacher: 'Ms. Davis',
    grades: [
      { subject: 'Mathematics', score: 'C+' },
      { subject: 'Science', score: 'B' },
      { subject: 'English', score: 'B' },
      { subject: 'History', score: 'C' },
    ],
    attendance: { present: 82, tardy: 5, absent: 3 },
    timetable: [
        { day: 'Monday', time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Ms. Davis' },
        { day: 'Monday', time: '10:15 - 11:15', subject: 'English', teacher: 'Mr. Smith' },
        { day: 'Tuesday', time: '09:00 - 10:00', subject: 'Science', teacher: 'Ms. Jones' },
        { day: 'Wednesday', time: '11:30 - 12:30', subject: 'History', teacher: 'Mr. Brown' },
        { day: 'Friday', time: '13:00 - 14:00', subject: 'Art', teacher: 'Ms. White' },
    ]
  },
  {
    id: 6,
    name: 'Sophia Miller',
    email: 'sophia.miller@example.com',
    role: 'Student',
    parentId: 206,
    grade: 'Grade 5',
    teacher: 'Ms. Davis', // Changed to Ms. Davis to be consistent
    grades: [
      { subject: 'Mathematics', score: 'B' },
      { subject: 'Science', score: 'B+' },
      { subject: 'English', score: 'A-' },
      { subject: 'History', score: 'B-' },
    ],
    attendance: { present: 86, tardy: 2, absent: 2 },
    timetable: [
        { day: 'Monday', time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Ms. Davis' },
        { day: 'Monday', time: '10:15 - 11:15', subject: 'English', teacher: 'Mr. Smith' },
        { day: 'Tuesday', time: '09:00 - 10:00', subject: 'Science', teacher: 'Ms. Jones' },
        { day: 'Wednesday', time: '11:30 - 12:30', subject: 'History', teacher: 'Mr. Brown' },
        { day: 'Friday', time: '13:00 - 14:00', subject: 'Art', teacher: 'Ms. White' },
    ]
  },
   // New secondary students
  {
    id: 7, name: 'Rohan Sharma', email: 'rohan.sharma@example.com', role: 'Student', parentId: 207, grade: 'Grade 7', teacher: 'Mr. Lee',
    grades: [{ subject: 'English', score: 'B+' }, { subject: 'Geography', score: 'A-' }],
    attendance: { present: 89, tardy: 1, absent: 0 }, timetable: [],
  },
  {
    id: 8, name: 'Priya Patel', email: 'priya.patel@example.com', role: 'Student', parentId: 208, grade: 'Grade 7', teacher: 'Mr. Lee',
    grades: [{ subject: 'English', score: 'A' }, { subject: 'Geography', score: 'B' }],
    attendance: { present: 87, tardy: 2, absent: 1 }, timetable: [],
  },
  {
    id: 9, name: 'Sanjay Gupta', email: 'sanjay.gupta@example.com', role: 'Student', parentId: 209, grade: 'Grade 8', teacher: 'Mr. Kumar',
    grades: [{ subject: 'Science', score: 'A-' }, { subject: 'Math', score: 'B+' }],
    attendance: { present: 90, tardy: 0, absent: 0 }, timetable: [],
  },
  {
    id: 10, name: 'Anjali Singh', email: 'anjali.singh@example.com', role: 'Student', parentId: 210, grade: 'Grade 8', teacher: 'Mr. Kumar',
    grades: [{ subject: 'Science', score: 'B' }, { subject: 'Math', score: 'C+' }],
    attendance: { present: 85, tardy: 4, absent: 1 }, timetable: [],
  },
    // Life-Prep Academy student
  {
    id: 11, name: 'Ben Carter', email: 'ben.carter@lpa.edu', role: 'Student', parentId: 211, grade: 'Grade 11', teacher: 'Dr. Wallace',
    grades: [
        { subject: 'AP Calculus BC', score: 'A' }, 
        { subject: 'AP Physics C', score: 'A-' },
        { subject: 'English Literature', score: 'B+' },
        { subject: 'US History', score: 'A' }
    ],
    attendance: { present: 90, tardy: 0, absent: 0 },
    timetable: [
        { day: 'Monday', time: '08:30 - 09:45', subject: 'AP Calculus BC', teacher: 'Dr. Wallace' },
        { day: 'Monday', time: '10:00 - 11:15', subject: 'AP Physics C', teacher: 'Mr. Jones' },
        { day: 'Monday', time: '12:30 - 13:45', subject: 'US History', teacher: 'Mr. Brown' },
        { day: 'Tuesday', time: '08:30 - 09:45', subject: 'English Literature', teacher: 'Ms. Evans' },
        { day: 'Tuesday', time: '11:30 - 12:45', subject: 'AP Physics C', teacher: 'Mr. Jones' },
        { day: 'Wednesday', time: '08:30 - 09:45', subject: 'AP Calculus BC', teacher: 'Dr. Wallace' },
        { day: 'Wednesday', time: '10:00 - 11:15', subject: 'Study Hall', teacher: 'N/A' },
        { day: 'Thursday', time: '10:00 - 11:15', subject: 'US History', teacher: 'Mr. Brown' },
        { day: 'Thursday', time: '12:30 - 13:45', subject: 'English Literature', teacher: 'Ms. Evans' },
        { day: 'Friday', time: '08:30 - 09:45', subject: 'AP Physics C (Lab)', teacher: 'Mr. Jones' },
        { day: 'Friday', time: '10:00 - 11:15', subject: 'AP Calculus BC', teacher: 'Dr. Wallace' },
    ],
  },
  // New student for Everest International School
  {
    id: 12, name: 'Aarav Sharma', email: 'aarav.sharma@example.com', role: 'Student', parentId: 212, grade: 'Grade 3', teacher: 'Mrs. Thapa',
    grades: [
        { subject: 'Nepali', score: 'A' },
        { subject: 'Mathematics', score: 'B+' },
        { subject: 'Science', score: 'A-' }
    ],
    attendance: { present: 89, tardy: 1, absent: 0 },
    timetable: [
        { day: 'Sunday', time: '10:00 - 11:00', subject: 'Nepali', teacher: 'Mrs. Thapa' },
        { day: 'Monday', time: '09:00 - 10:00', subject: 'Mathematics', teacher: 'Mrs. Thapa' },
        { day: 'Wednesday', time: '11:15 - 12:15', subject: 'Science', teacher: 'Mrs. Thapa' },
    ],
  },
  // New child for multi-school parent
  {
    id: 13,
    name: 'Zoe Rodriguez',
    email: 'zoe.r@example.com',
    role: 'Student',
    parentId: 213,
    grade: 'Grade 7',
    teacher: 'Mr. Lee',
    grades: [
      { subject: 'English', score: 'A' },
      { subject: 'Geography', score: 'A-' },
    ],
    attendance: { present: 90, tardy: 0, absent: 0 },
    timetable: [
        { day: 'Monday', time: '09:00 - 10:00', subject: 'English', teacher: 'Mr. Lee' },
    ]
  },
];

const mockReportCards: ReportCard[] = [
    {
        id: 101,
        studentId: 1,
        term: 'First Term (2024)',
        issueDate: 'August 5, 2024',
        overallComment: 'Alex has shown great enthusiasm for learning this term. He excels in English and actively participates in class discussions. Continued focus on organizing his history notes will be beneficial.',
        entries: [
            { subject: 'Mathematics', score: 'A-', comment: 'Excellent problem-solving skills.' },
            { subject: 'Science', score: 'B+', comment: 'Shows good understanding of concepts, needs to be more thorough in lab reports.' },
            { subject: 'English', score: 'A', comment: 'A talented writer with a strong command of grammar and vocabulary.' },
            { subject: 'History', score: 'B', comment: 'Participates well but could improve on retaining dates and key events.' },
        ]
    }
];

const mockTuitionData: TuitionInvoice[] = [
    {
        id: 202401, studentId: 1, term: 'Fall Term 2024', amount: 4500,
        dueDate: '2024-09-01', status: 'Due', issueDate: '2024-08-01',
        items: [
            { description: 'Tuition Fee', amount: 4200 },
            { description: 'Activity Fee', amount: 200 },
            { description: 'Technology Fee', amount: 100 },
        ]
    },
    {
        id: 202302, studentId: 1, term: 'Spring Term 2024', amount: 4500,
        dueDate: '2024-02-01', status: 'Paid', issueDate: '2024-01-15', paidDate: '2024-01-28',
        items: [
            { description: 'Tuition Fee', amount: 4200 },
            { description: 'Activity Fee', amount: 200 },
            { description: 'Technology Fee', amount: 100 },
        ]
    },
    {
        id: 202402, studentId: 2, term: 'Fall Term 2024', amount: 6500,
        dueDate: '2024-09-01', status: 'Due', issueDate: '2024-08-01',
        items: [
            { description: 'Tuition Fee', amount: 6200 },
            { description: 'Lab Fee', amount: 300 },
        ]
    }
];

const mockTeachers: Teacher[] = [
    { id: 101, name: 'Ms. Davis', role: 'Teacher' },
    { id: 102, name: 'Mr. Lee', role: 'Teacher', teachesGrades: ['Grade 7', 'Grade 8'] },
    { id: 103, name: 'Mr. Smith', role: 'Teacher' },
    { id: 104, name: 'Mr. Kumar', role: 'Teacher', teachesGrades: ['Grade 8'] },
    { id: 105, name: 'Ms. Multi', role: 'Teacher', teachesGrades: ['Grade 5', 'Grade 11'] },
    { id: 106, name: 'Dr. Wallace', role: 'Teacher', teachesGrades: ['Grade 11', 'Grade 12'] },
    { id: 107, name: 'Mrs. Thapa', role: 'Teacher', teachesGrades: ['Grade 3'] },
];

const mockParents: Parent[] = [
    { id: 201, name: 'Charles Kim', role: 'Parent', childrenIds: [1] },
    { id: 202, name: 'Sarah Park', role: 'Parent', childrenIds: [2] },
    { id: 203, name: 'David Chen', role: 'Parent', childrenIds: [3] },
    { id: 204, name: 'Maria Garcia', role: 'Parent', childrenIds: [4] },
    { id: 205, name: 'James Rodriguez', role: 'Parent', childrenIds: [5] },
    { id: 206, name: 'Linda Miller', role: 'Parent', childrenIds: [6] },
    { id: 207, name: 'Vikram Sharma', role: 'Parent', childrenIds: [7] },
    { id: 208, name: 'Nita Patel', role: 'Parent', childrenIds: [8] },
    { id: 209, name: 'Raj Gupta', role: 'Parent', childrenIds: [9] },
    { id: 210, name: 'Meera Singh', role: 'Parent', childrenIds: [10] },
    { id: 211, name: 'Susan Carter', role: 'Parent', childrenIds: [11] },
    { id: 212, name: 'Prakash Sharma', role: 'Parent', childrenIds: [12] },
    { id: 213, name: 'Maria Rodriguez', role: 'Parent', childrenIds: [5, 13]}, // Multi-school parent
];

const mockAdmins: User[] = [
    { id: 999, name: 'Principal Evans', role: 'Administrator' },
    { id: 998, name: 'Ms. Chen', role: 'Administrator' },
];

const mockUsers: User[] = [...mockInitialChildren, ...mockParents, ...mockTeachers, ...mockAdmins];


const mockNotifications: Notification[] = [
    { id: 1, title: 'Welcome!', message: 'Thanks for joining ClassBridge. Check here for important updates.', timestamp: new Date(Date.now() - 1000 * 60 * 5), read: true, recipientRole: 'All' },
    { id: 2, title: 'Parent-Teacher Meeting', message: 'A school-wide parent-teacher meeting is scheduled for next Friday. Please check your email for details.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), read: false, recipientRole: 'Parent' },
    { id: 3, title: 'New Grade Posted', message: 'Your grade for Mathematics has been updated by Ms. Davis.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), read: false, recipientRole: 'Student' },
    { id: 4, title: 'School Holiday', message: 'The school will be closed this Monday for a public holiday.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), read: false, recipientRole: 'All' },
    { id: 5, title: 'Faculty Meeting', message: 'A mandatory faculty meeting is scheduled for tomorrow at 3 PM in the main hall.', timestamp: new Date(Date.now() - 1000 * 60 * 30), read: false, recipientRole: 'Teacher' },
];

interface Announcement {
    id: number;
    title: string;
    content: string;
    date: string; // "YYYY-MM-DD"
}

const mockAnnouncements: Announcement[] = [
    { id: 1, title: 'School Picture Day', content: 'School picture day is scheduled for October 15th. Please ensure students are in full uniform.', date: '2024-09-25' },
    { id: 2, title: 'Mid-Term Exam Schedule', content: 'Mid-term exams will be held from October 21st to October 25th. The detailed schedule has been sent via email.', date: '2024-09-20' },
    { id: 3, title: 'Parent-Teacher Conference Sign-ups', content: 'Sign-ups for the November Parent-Teacher conferences are now open on the portal.', date: '2024-09-18' },
    { id: 4, title: 'Welcome Back!', content: 'Welcome to the new school year! We are excited for a year of learning and growth.', date: '2024-09-02' },
];

interface CalendarEvent {
    id: number;
    date: string; // "YYYY-MM-DD"
    title: string;
    description: string;
}

const mockAcademicCalendar: CalendarEvent[] = [
    // September
    { id: 1, date: '2024-09-02', title: 'First Day of School', description: 'Welcome back students!' },
    { id: 2, date: '2024-09-27', title: 'Professional Development Day', description: 'No school for students.' },
    // October
    { id: 3, date: '2024-10-14', title: 'National Holiday', description: 'School closed.' },
    { id: 4, date: '2024-10-21', title: 'Mid-Term Exams Begin', description: 'Exams for Grades 6-12.' },
    { id: 5, date: '2024-10-31', title: 'Halloween Activities', description: 'Elementary school parade at 1 PM.' },
    // November
    { id: 6, date: '2024-11-11', title: 'Remembrance Day', description: 'School closed.' },
    { id: 7, date: '2024-11-15', title: 'Parent-Teacher Conferences', description: 'No school for students.' },
    // December
    { id: 8, date: '2024-12-20', title: 'Last Day of School', description: 'Winter break begins. Early dismissal at 12 PM.' },
    { id: 9, date: '2024-12-23', title: 'Winter Break', description: 'School closed until January 6th.' },
];

interface Assignment {
  id: number;
  grade: string;
  title: string;
  description: string;
  dueDate: string;
}

const mockAssignments: Assignment[] = [
    { id: 1, grade: 'Grade 5', title: 'Math Worksheet #3', description: 'Complete all problems on pages 45-46.', dueDate: '2024-10-15' },
    { id: 2, grade: 'Grade 5', title: 'History Reading', description: 'Read Chapter 4 and prepare for a quiz.', dueDate: '2024-10-18' },
    { id: 3, grade: 'Grade 7', title: 'English Essay Draft', description: 'Submit the first draft of your essay on "The Great Gatsby".', dueDate: '2024-10-20' },
];
// -------------------------

const MagicLinkLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState('identify');
    const [error, setError] = useState('');
    const [identifiedAffiliations, setIdentifiedAffiliations] = useState([]);
    const [selectedAffiliation, setSelectedAffiliation] = useState(null);


    const handleIdentifySubmit = (e) => {
        e.preventDefault();
        const userAffiliations = completeUserRegistry[email.toLowerCase()];

        if (userAffiliations && userAffiliations.length > 0) {
            setError('');
            if (userAffiliations.length > 1) {
                setIdentifiedAffiliations(userAffiliations);
                setStep('select-school');
            } else {
                setSelectedAffiliation(userAffiliations[0]);
                setStep('confirm');
            }
        } else {
            setError('This email is not registered. Please contact your school administrator.');
        }
    };
    
    const handleSelectSchool = (affiliation) => {
        setSelectedAffiliation(affiliation);
        setStep('confirm');
    };

    const handleSimulateLogin = () => {
        if (selectedAffiliation) {
            const user = mockUsers.find(u => u.id === selectedAffiliation.userId);
            const school = schoolConfigs[selectedAffiliation.schoolId];
            const allAffiliations = completeUserRegistry[selectedAffiliation.email.toLowerCase()] || [];
            if (user && school) {
                onLogin(user, school, selectedAffiliation.role, allAffiliations);
            } else {
                 setError('An unexpected error occurred. Please try again.');
                 setStep('identify');
            }
        }
    };

    const resetState = () => {
        setStep('identify');
        setEmail('');
        setError('');
        setIdentifiedAffiliations([]);
        setSelectedAffiliation(null);
    }

    return (
        <div className="universal-login-container">
             <div className="login-header">
                {/* ADDED LOGO HERE */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <ClassBridgeLogo size={100} />
                </div>
                <h2>{
                    step === 'identify' ? "Welcome to ClassBridge" : 
                    step === 'select-school' ? "Select a School" : 
                    "Check your inbox"
                }</h2>
            </div>

            {step === 'identify' && (
                <form onSubmit={handleIdentifySubmit} className="login-form">
                    <p>Enter your registered email address to receive a login link.</p>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            placeholder="e.g., your.name@email.com"
                            required
                            autoFocus
                        />
                    </div>
                    <button type="submit" className="form-button">Send Login Link</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            )}
            
            {step === 'select-school' && (
                <div className="school-selection-view">
                    <p>This email is associated with multiple schools. Please choose which one you'd like to access.</p>
                    <div className="school-selection-container">
                        {identifiedAffiliations.map(affiliation => {
                            const school = schoolConfigs[affiliation.schoolId];
                            return (
                                <div key={school.id} className="school-selection-card" role="button" onClick={() => handleSelectSchool(affiliation)} tabIndex={0}>
                                    <SchoolLogo logoUrl={school.logoUrl} schoolName={school.name} />
                                    <h4>{school.name}</h4>
                                    <p>Login as {affiliation.role}</p>
                                </div>
                            )
                        })}
                    </div>
                     <button onClick={() => setStep('identify')} className="back-button-link">
                        Use a different email
                    </button>
                </div>
            )}

            {step === 'confirm' && (
                 <div className="login-form confirmation-view">
                    <p className="confirmation-icon">📧</p>
                    <p>
                        We've sent a magic login link to <br/><strong>{email}</strong>.
                    </p>
                    <p className="confirmation-note">Click the link in the email to log in instantly.</p>
                    
                    {/* This button simulates the user clicking the link in their email */}
                    <button onClick={handleSimulateLogin} className="form-button simulate-button">
                        Simulate Clicking Email Link
                    </button>
                    <button onClick={() => identifiedAffiliations.length > 1 ? setStep('select-school') : setStep('identify')} className="back-button-link">
                       &larr; Back
                    </button>
                </div>
            )}
        </div>
    );
};


// --- NOTIFICATION COMPONENTS ---
const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
};

const Notifications = ({ notifications, onUpdateNotifications }) => {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef(null);
    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = (id: number) => {
        const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
        onUpdateNotifications(updated);
    };

    const handleMarkAllAsRead = () => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        onUpdateNotifications(updated);
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [panelRef]);

    return (
        <div className="notifications-container" ref={panelRef}>
            <button className="notifications-bell" onClick={() => setIsOpen(!isOpen)} aria-label={`View notifications. ${unreadCount} unread.`}>
                🔔
                {unreadCount > 0 && <span className="notifications-badge">{unreadCount}</span>}
            </button>
            {isOpen && (
                <div className="notifications-panel">
                    <div className="notification-header">
                        <h4>Notifications</h4>
                        {unreadCount > 0 && <button onClick={handleMarkAllAsRead}>Mark all as read</button>}
                    </div>
                    {notifications.length > 0 ? (
                        <ul className="notification-list">
                            {notifications.map(n => (
                                <li key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`} onClick={() => handleMarkAsRead(n.id)}>
                                    <strong>{n.title}</strong>
                                    <p>{n.message}</p>
                                    <div className="timestamp">{formatTimeAgo(n.timestamp)}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-notifications">No new notifications.</p>
                    )}
                </div>
            )}
        </div>
    );
};


// --- SHARED & PARENT DASHBOARD COMPONENTS ---
const GradesView = ({ grades }) => (
    <div className="detail-section">
        <h3>Current Grades</h3>
        <ul className="grades-list">
            {grades.map(grade => (
                <li key={grade.subject}>
                    <span>{grade.subject}</span>
                    <span className="grade-score">{grade.score}</span>
                </li>
            ))}
        </ul>
    </div>
);

const AttendanceView = ({ attendance }) => (
    <div className="detail-section">
        <h3>Attendance Summary</h3>
        <div className="attendance-summary">
            <div className="attendance-stat">
                <span className="stat-value">{attendance.present}</span>
                <span className="stat-label">Present</span>
            </div>
            <div className="attendance-stat">
                <span className="stat-value">{attendance.tardy}</span>
                <span className="stat-label">Tardy</span>
            </div>
            <div className="attendance-stat">
                 <span className="stat-value">{attendance.absent}</span>
                <span className="stat-label">Absent</span>
            </div>
        </div>
    </div>
);

const AbsenceNotificationView = () => {
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <div className="detail-section">
            <h3>Report an Absence</h3>
            {submitted ? (
                <p className="confirmation-message">Absence reported successfully. The school has been notified.</p>
            ) : (
                <form onSubmit={handleSubmit} className="detail-form">
                    <div className="form-group">
                        <label htmlFor="absence-date">Date of Absence</label>
                        <input type="date" id="absence-date" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="absence-reason">Reason (optional)</label>
                        <textarea id="absence-reason" rows={3} placeholder="e.g., Doctor's appointment"></textarea>
                    </div>
                    <button type="submit" className="form-button">Notify School</button>
                </form>
            )}
        </div>
    );
};

const ReportCardPreviewModal = ({ report, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content report-card-preview-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3>{report.term}</h3>
                <button onClick={onClose} className="modal-close-button" aria-label="Close">&times;</button>
            </div>
            <div className="modal-body">
                <div className="report-card-body">
                    <h5>Teacher's Overall Comment</h5>
                    <p className="overall-comment">{report.overallComment}</p>
                    <h5>Subject Details</h5>
                    <ul className="report-card-entries">
                        {report.entries.map(entry => (
                            <li key={entry.subject} className="report-entry">
                                <div className="report-entry-header">
                                    <span className="entry-subject">{entry.subject}</span>
                                    <span className="entry-score">{entry.score}</span>
                                </div>
                                <p className="entry-comment">"{entry.comment}"</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

const ReportCardView = ({ reportCards }) => {
    const [previewingReport, setPreviewingReport] = useState(null);

    return (
        <>
            <div className="report-card-list-container">
                {reportCards.length > 0 ? (
                    reportCards.map(report => (
                        <div key={report.id} className="report-card">
                            <div className="report-card-header">
                                <h4>{report.term}</h4>
                                <span>Issued: {report.issueDate}</span>
                            </div>
                            <div className="report-card-body">
                                <h5>Teacher's Overall Comment</h5>
                                <p className="overall-comment">{report.overallComment}</p>
                                <h5>Subject Details</h5>
                                <ul className="report-card-entries">
                                    {report.entries.slice(0, 2).map(entry => ( // Show first 2 entries as a snippet
                                        <li key={entry.subject} className="report-entry">
                                            <div className="report-entry-header">
                                                <span className="entry-subject">{entry.subject}</span>
                                                <span className="entry-score">{entry.score}</span>
                                            </div>
                                            <p className="entry-comment">"{entry.comment}"</p>
                                        </li>
                                    ))}
                                    {report.entries.length > 2 && <p className="entry-comment">...and more.</p>}
                                </ul>
                            </div>
                            <div className="report-card-footer">
                                <button className="form-button preview-btn" onClick={() => setPreviewingReport(report)}>
                                    Preview
                                </button>
                                <button className="form-button download-pdf-btn" onClick={() => alert('PDF download feature coming soon!')}>
                                    Download as PDF
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No report cards have been issued yet.</p>
                )}
            </div>
            {previewingReport && (
                <ReportCardPreviewModal report={previewingReport} onClose={() => setPreviewingReport(null)} />
            )}
        </>
    );
};

// New Tuition & Fees View Component
const TuitionView = ({ invoices, onPayInvoice }) => {
    const [payingInvoice, setPayingInvoice] = useState(null);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);

    const handleSimulatedPayment = () => {
        if (payingInvoice) {
            onPayInvoice(payingInvoice.id);
            setPaymentConfirmed(true);
            setTimeout(() => {
                setPayingInvoice(null);
                setPaymentConfirmed(false);
            }, 4000);
        }
    };
    
    if (payingInvoice) {
        return (
             <div className="detail-section payment-simulation">
                <button onClick={() => setPayingInvoice(null)} className="back-button">&larr; Back to Invoices</button>
                <h3>Complete Your Payment</h3>
                {paymentConfirmed ? (
                     <p className="confirmation-message">Thank you! Your payment has been submitted for verification. It may take 2-3 business days to reflect.</p>
                ) : (
                    <>
                        <p className="payment-instructions">To pay for <strong>{payingInvoice.term}</strong>, please transfer the amount below to the school's bank account.</p>
                        <div className="payment-details">
                            <div className="detail-item"><span>Amount:</span> <strong>${payingInvoice.amount.toLocaleString()}</strong></div>
                            <div className="detail-item"><span>Bank:</span> <strong>Global Education Bank</strong></div>
                            <div className="detail-item"><span>Account #:</span> <strong>123-456-7890</strong></div>
                            <div className="detail-item"><span>Beneficiary:</span> <strong>Everest Academy</strong></div>
                            <div className="detail-item"><span>Reference Code:</span> <strong className="reference-code">{payingInvoice.studentId}-{payingInvoice.id}</strong></div>
                        </div>
                        <p className="payment-instructions">Please include the <strong>Reference Code</strong> in your transfer description to ensure your payment is processed correctly.</p>
                        <button onClick={handleSimulatedPayment} className="form-button">I have completed the transfer</button>
                    </>
                )}
            </div>
        )
    }

    return (
        <div className="detail-section">
            <h3>Tuition & Fees</h3>
            {invoices.length > 0 ? (
                <div className="invoice-list">
                    {invoices.map(invoice => (
                        <div key={invoice.id} className="invoice-card">
                            <div className="invoice-header">
                                <h4>{invoice.term}</h4>
                                <span className={`invoice-status status-${invoice.status.toLowerCase()}`}>{invoice.status}</span>
                            </div>
                            <div className="invoice-body">
                                <p><strong>Total Amount:</strong> ${invoice.amount.toLocaleString()}</p>
                                <p><strong>Due Date:</strong> {invoice.dueDate}</p>
                                {invoice.status === 'Paid' && <p><strong>Paid On:</strong> {invoice.paidDate}</p>}
                            </div>
                            {invoice.status !== 'Paid' && (
                                <div className="invoice-footer">
                                    <button onClick={() => setPayingInvoice(invoice)} className="form-button">Pay Now</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : <p>No tuition information available.</p>}
        </div>
    );
};


const MessageTeacherView = ({ teacherName, isModal = false }) => {
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    const viewContent = (
        <>
            <h3>{isModal ? `Message to ${teacherName}` : `Message ${teacherName}`}</h3>
             {submitted ? (
                <p className="confirmation-message">Your message has been sent!</p>
            ) : (
                <form onSubmit={handleSubmit} className="detail-form">
                     <div className="form-group">
                        <label htmlFor="message-subject">Subject</label>
                        <input type="text" id="message-subject" required placeholder="e.g., Question about homework" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message-body">Message</label>
                        <textarea id="message-body" rows={isModal ? 5 : 4} required placeholder="Write your message here..."></textarea>
                    </div>
                    <button type="submit" className="form-button">Send Message</button>
                </form>
            )}
        </>
    );

    return isModal ? viewContent : <div className="detail-section">{viewContent}</div>;
};

type ParentActiveView = 'Grades' | 'Attendance' | 'Absence' | 'Message' | 'ReportCards' | 'Tuition';

const ChildDetailView = ({ 
    child, 
    reportCards, 
    tuitionInvoices, 
    onBack, 
    onUpdateTuition 
}) => {
    const [activeView, setActiveView] = useState('Grades');

    return (
        <div className="child-detail-container">
             <button onClick={onBack} className="back-button" aria-label="Go back to children list">
                &larr; Back to My Children
            </button>
            <div className="child-detail-header">
                <h2>{child.name}</h2>
                <p>{child.grade} &bull; Teacher: {child.teacher}</p>
            </div>
            <nav className="detail-nav">
                <button onClick={() => setActiveView('Grades')} className={activeView === 'Grades' ? 'active' : ''}>Grades</button>
                <button onClick={() => setActiveView('ReportCards')} className={activeView === 'ReportCards' ? 'active' : ''}>Report Cards</button>
                <button onClick={() => setActiveView('Tuition')} className={activeView === 'Tuition' ? 'active' : ''}>Tuition & Fees</button>
                <button onClick={() => setActiveView('Attendance')} className={activeView === 'Attendance' ? 'active' : ''}>Attendance</button>
                <button onClick={() => setActiveView('Absence')} className={activeView === 'Absence' ? 'active' : ''}>Report Absence</button>
                <button onClick={() => setActiveView('Message')} className={activeView === 'Message' ? 'active' : ''}>Message Teacher</button>
            </nav>
            <div className="detail-content">
                {activeView === 'Grades' && <GradesView grades={child.grades} />}
                {activeView === 'ReportCards' && (
                    <div className="detail-section report-card-section">
                        <h3>Term Report Cards</h3>
                        <ReportCardView reportCards={child.reportCards} />
                    </div>
                )}
                {activeView === 'Tuition' && <TuitionView invoices={tuitionInvoices} onPayInvoice={onUpdateTuition} />}
                {activeView === 'Attendance' && <AttendanceView attendance={child.attendance} />}
                {activeView === 'Absence' && <AbsenceNotificationView />}
                {activeView === 'Message' && <MessageTeacherView teacherName={child.teacher} />}
            </div>
        </div>
    );
}

const AnnouncementsView = () => {
    // Sort announcements by date, newest first
    const sortedAnnouncements = [...mockAnnouncements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="detail-section">
            <h3 className="dashboard-subtitle">School Announcements</h3>
            <div className="announcements-list">
                {sortedAnnouncements.map(ann => (
                    <div key={ann.id} className="announcement-card">
                        <h4>{ann.title}</h4>
                        <p>{ann.content}</p>
                        <span>{new Date(ann.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CalendarView = () => {
    const eventsByMonth = mockAcademicCalendar.reduce((acc, event) => {
        const month = new Date(event.date).toLocaleString('en-US', { month: 'long', year: 'numeric' });
        if (!acc[month]) {
            acc[month] = [];
        }
        acc[month].push(event);
        return acc;
    }, {} as Record<string, CalendarEvent[]>);

    return (
        <div className="detail-section">
            <h3 className="dashboard-subtitle">Academic Calendar</h3>
            <div className="calendar-view">
                {Object.entries(eventsByMonth).map(([month, events]) => (
                    <div key={month} className="calendar-month">
                        <h4>{month}</h4>
                        <ul>
                            {events.sort((a,b) => new Date(a.date).getDate() - new Date(b.date).getDate()).map(event => (
                                <li key={event.id} className="calendar-event">
                                    <div className="event-date">
                                        <span>{new Date(event.date).getDate()}</span>
                                    </div>
                                    <div className="event-details">
                                        <strong>{event.title}</strong>
                                        <p>{event.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SchoolBusView = () => {
    return (
        <div className="detail-section">
            <h3 className="dashboard-subtitle">School Bus Tracking</h3>
            <div className="placeholder-content" style={{border: '1px solid #eee', borderRadius: '8px', padding: '4rem', height: 'auto'}}>
                <p style={{margin: 0}}>Real-time map functionality will be implemented here.</p>
            </div>
        </div>
    )
}

// NEW: Component for Life-Prep Academy's custom feature
const CollegeCounselingView = () => {
    return (
        <div className="detail-section">
            <h3 className="dashboard-subtitle">College Counseling Portal</h3>
            <div className="placeholder-content" style={{border: '1px solid #eee', borderRadius: '8px', padding: '2rem'}}>
                <p>Welcome to the College Counseling Portal.</p>
                <p style={{color: '#666', fontSize: '0.9rem'}}>Here you will find resources for applications, SAT/ACT prep materials, and a scheduler to meet with your counselor.</p>
                 <button className="form-button" style={{marginTop: '1rem'}}>Schedule a Meeting</button>
            </div>
        </div>
    )
}


const ReportsView = ({ parent, allChildren, reportCards }) => {
    const myChildren = allChildren.filter(child => parent.childrenIds.includes(child.id));
    
    return (
        <div className="detail-section reports-view">
            <h3 className="dashboard-subtitle">Child Report Cards</h3>
            {myChildren.map(child => {
                const childsReportCards = reportCards.filter(rc => rc.studentId === child.id);
                
                return (
                    <div key={child.id} className="child-reports-section">
                        <h4>{child.name}'s Report Cards</h4>
                        {childsReportCards.length > 0 ? (
                            <ReportCardView reportCards={childsReportCards} />
                        ) : (
                            <p>{child.name} has no report cards yet.</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const SchoolSwitcher = ({
    currentSchool,
    affiliations,
    onSwitchSchool,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const switcherRef = useRef(null);

    const otherAffiliations = affiliations.filter(aff => aff.schoolId !== currentSchool.id);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (switcherRef.current && !switcherRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [switcherRef]);
    
    if (affiliations.length <= 1) {
        return <h2 className="school-name-static">{currentSchool.name}</h2>
    }

    return (
        <div className="school-switcher-container" ref={switcherRef}>
            <button className="school-switcher-button" onClick={() => setIsOpen(!isOpen)}>
                <span>{currentSchool.name}</span>
                <span className="switcher-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
                <div className="school-switcher-dropdown">
                    <ul>
                        {otherAffiliations.map(aff => {
                            const school = schoolConfigs[aff.schoolId];
                            return (
                                <li key={school.id} onClick={() => { onSwitchSchool(school.id); setIsOpen(false); }}>
                                    <SchoolLogo logoUrl={school.logoUrl} schoolName={school.name} />
                                    <span>{school.name}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};


type ParentTab = 'Announcements' | 'Calendar' | 'Children' | 'Reports' | 'SchoolBus' | 'CollegeCounseling';

const ParentDashboard = ({ parent, school, allChildren, notifications, reportCards, tuitionInvoices, userAffiliations, onUpdateNotifications, onUpdateTuition, onSwitchSchool, onLogout }) => {
    const [selectedChild, setSelectedChild] = useState(null);
    const [activeTab, setActiveTab] = useState('Children');
    
    // Filter children to show only those in the currently selected school
    const myChildren = allChildren.filter(child => {
        if (!parent.childrenIds.includes(child.id)) {
            return false;
        }
        const affiliation = completeUserRegistry[child.email.toLowerCase()];
        // Ensure the child has a valid school affiliation in the registry before checking schoolId
        return affiliation && affiliation.length > 0 && affiliation[0].schoolId === school.id;
    });

    if (selectedChild) {
        const childsInvoices = tuitionInvoices.filter(inv => inv.studentId === selectedChild.id);
        const childsReportCards = reportCards.filter(rc => rc.studentId === selectedChild.id);
        return <ChildDetailView child={selectedChild} reportCards={childsReportCards} tuitionInvoices={childsInvoices} onBack={() => setSelectedChild(null)} onUpdateTuition={onUpdateTuition} />;
    }

    const renderActiveTab = () => {
        switch(activeTab) {
            case 'Announcements':
                return <AnnouncementsView />;
            case 'Calendar':
                return <CalendarView />;
            case 'Reports':
                return <ReportsView parent={parent} allChildren={myChildren} reportCards={reportCards} />;
            case 'SchoolBus':
                return school.features.schoolBusTracking ? <SchoolBusView /> : null;
            case 'CollegeCounseling':
                return school.features.collegeCounselingPortal ? <CollegeCounselingView /> : null;
            case 'Children':
            default:
                return (
                     <>
                        <h3 className="dashboard-subtitle">My Children at {school.name}</h3>
                        <div className="child-selection-container">
                            {myChildren.map(child => (
                                <div key={child.id} className="child-card" role="button" onClick={() => setSelectedChild(child)} tabIndex={0} aria-label={`View dashboard for ${child.name}`}>
                                    <div className="child-icon" aria-hidden="true">{child.name.charAt(0)}</div>
                                    <h4>{child.name}</h4>
                                    <p>{child.grade}</p>
                                </div>
                            ))}
                        </div>
                    </>
                );
        }
    };
    
    return (
        <div className="dashboard-container parent-dashboard">
            <header className="dashboard-header">
                <div className="dashboard-header-school-info">
                    <SchoolLogo logoUrl={school.logoUrl} schoolName={school.name} />
                    <SchoolSwitcher currentSchool={school} affiliations={userAffiliations} onSwitchSchool={onSwitchSchool} />
                </div>
                <div className="header-actions">
                    <span className="welcome-message">Welcome, {parent.name}!</span>
                    <Notifications notifications={notifications} onUpdateNotifications={onUpdateNotifications} />
                    <button onClick={onLogout} className="logout-button">Logout</button>
                </div>
            </header>
            <main className="dashboard-main">
                {renderActiveTab()}
            </main>
            <nav className="bottom-nav">
                <button className={`nav-item ${activeTab === 'Announcements' ? 'active' : ''}`} onClick={() => setActiveTab('Announcements')}>
                    <span className="nav-icon">📢</span>
                    <span className="nav-label">Announcements</span>
                </button>
                 <button className={`nav-item ${activeTab === 'Calendar' ? 'active' : ''}`} onClick={() => setActiveTab('Calendar')}>
                    <span className="nav-icon">📅</span>
                    <span className="nav-label">Calendar</span>
                </button>
                 <button className={`nav-item ${activeTab === 'Children' ? 'active' : ''}`} onClick={() => setActiveTab('Children')}>
                    <span className="nav-icon">👨‍👩‍👧‍👦</span>
                    <span className="nav-label">My Children</span>
                </button>
                 <button className={`nav-item ${activeTab === 'Reports' ? 'active' : ''}`} onClick={() => setActiveTab('Reports')}>
                    <span className="nav-icon">📄</span>
                    <span className="nav-label">Reports</span>
                </button>
                {school.features.schoolBusTracking && (
                    <button className={`nav-item ${activeTab === 'SchoolBus' ? 'active' : ''}`} onClick={() => setActiveTab('SchoolBus')}>
                        <span className="nav-icon">🚌</span>
                        <span className="nav-label">School Bus</span>
                    </button>
                )}
                 {school.features.collegeCounselingPortal && (
                    <button className={`nav-item ${activeTab === 'CollegeCounseling' ? 'active' : ''}`} onClick={() => setActiveTab('CollegeCounseling')}>
                        <span className="nav-icon">🎓</span>
                        <span className="nav-label">Counseling</span>
                    </button>
                )}
            </nav>
        </div>
    );
};

// --- TEACHER DASHBOARD COMPONENTS ---
const GradeEditor = ({ grades, onAddGrade }) => {
    const [subject, setSubject] = useState('');
    const [score, setScore] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (subject && score) {
            onAddGrade({ subject, score });
            setSubject('');
            setScore('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-grade-form detail-form">
            <h4>Add New Grade</h4>
            <div className="form-group-inline">
                <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g., Art" required />
                </div>
                <div className="form-group">
                    <label htmlFor="score">Score</label>
                    <input type="text" id="score" value={score} onChange={e => setScore(e.target.value)} placeholder="e.g., A+" required />
                </div>
                <button type="submit" className="form-button">Add Grade</button>
            </div>
        </form>
    );
};

const AttendanceEditor = ({ attendance, onUpdateAttendance }) => {
    const handleUpdate = (field, delta) => {
        const newValue = Math.max(0, attendance[field] + delta);
        onUpdateAttendance({ ...attendance, [field]: newValue });
    };

    return (
        <div className="detail-section">
            <h3>Edit Attendance</h3>
            <div className="attendance-editor">
                {Object.keys(attendance).map(key => (
                    <div key={key} className="attendance-control">
                        <span className="stat-label">{key}</span>
                        <div className="control-group">
                            <button onClick={() => handleUpdate(key, -1)} aria-label={`Decrease ${key} count`}>-</button>
                            <span className="stat-value">{attendance[key]}</span>
                            <button onClick={() => handleUpdate(key, 1)} aria-label={`Increase ${key} count`}>+</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TeacherStudentDetailView = ({ student, onUpdateStudent, onBack }) => {
    const [currentStudent, setCurrentStudent] = useState(student);
    const [activeView, setActiveView] = useState('Grades');

    const handleUpdate = (updatedStudentData) => {
        setCurrentStudent(updatedStudentData);
        onUpdateStudent(updatedStudentData);
    };

    const handleAddGrade = (newGrade) => {
        const updatedGrades = [...currentStudent.grades, newGrade];
        handleUpdate({ ...currentStudent, grades: updatedGrades });
    };

    const handleUpdateAttendance = (newAttendance) => {
        handleUpdate({ ...currentStudent, attendance: newAttendance });
    };

    return (
        <div className="child-detail-container">
            <button onClick={onBack} className="back-button">&larr; Back to Student List</button>
            <div className="child-detail-header">
                <h2>{currentStudent.name}</h2>
                <p>{currentStudent.grade}</p>
            </div>
            <nav className="detail-nav">
                <button onClick={() => setActiveView('Grades')} className={activeView === 'Grades' ? 'active' : ''}>Grades</button>
                <button onClick={() => setActiveView('Attendance')} className={activeView === 'Attendance' ? 'active' : ''}>Attendance</button>
            </nav>
            <div className="detail-content">
                 {activeView === 'Grades' && (
                    <div className="detail-section">
                        <GradesView grades={currentStudent.grades} />
                        <GradeEditor grades={currentStudent.grades} onAddGrade={handleAddGrade} />
                    </div>
                 )}
                 {activeView === 'Attendance' && <AttendanceEditor attendance={currentStudent.attendance} onUpdateAttendance={handleUpdateAttendance} />}
            </div>
        </div>
    );
};


type TeacherTab = 'Students' | 'Assignments' | 'MessageParents';

const MessageModal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button onClick={onClose} className="modal-close-button" aria-label="Close">&times;</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
};

const MessageParentsView = ({ myStudents }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [messageType, setMessageType] = useState('All'); // 'All' or 'Individual'
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            if (showModal) {
                setShowModal(false);
                setSelectedStudent(null);
            }
        }, 3000);
    };

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
        setShowModal(true);
    };

    return (
        <div className="detail-section">
            <h3 className="dashboard-subtitle">Message Parents</h3>
            
            <div className="message-type-selector">
                <button className={messageType === 'All' ? 'active' : ''} onClick={() => setMessageType('All')}>Broadcast to All</button>
                <button className={messageType === 'Individual' ? 'active' : ''} onClick={() => setMessageType('Individual')}>Message Individually</button>
            </div>

            {messageType === 'All' && (
                 submitted ? (
                    <p className="confirmation-message">Your broadcast message has been sent to all parents.</p>
                ) : (
                    <form onSubmit={handleSubmit} className="detail-form">
                        <div className="form-group">
                            <label htmlFor="broadcast-subject">Subject</label>
                            <input type="text" id="broadcast-subject" required placeholder="e.g., Upcoming Field Trip" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="broadcast-body">Message</label>
                            <textarea id="broadcast-body" rows={5} required placeholder="Write your message to all parents here..."></textarea>
                        </div>
                        <button type="submit" className="form-button">Send to All Parents</button>
                    </form>
                )
            )}

            {messageType === 'Individual' && (
                <div className="student-list-for-messaging">
                    <h4>Select a student to message their parent:</h4>
                    <ul>
                        {myStudents.map(s => (
                            <li key={s.id} onClick={() => handleSelectStudent(s)}>{s.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            <MessageModal show={showModal} onClose={() => { setShowModal(false); setSelectedStudent(null); }} title={`Message Parent of ${selectedStudent?.name}`}>
                 {submitted ? (
                    <p className="confirmation-message">Your message has been sent!</p>
                ) : (
                    <form onSubmit={handleSubmit} className="detail-form">
                        <div className="form-group">
                            <label htmlFor="individual-message-subject">Subject</label>
                            <input type="text" id="individual-message-subject" required placeholder="e.g., Update on progress" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="individual-message-body">Message</label>
                            <textarea id="individual-message-body" rows={5} required placeholder={`Write your message to the parent of ${selectedStudent?.name}...`}></textarea>
                        </div>
                        <button type="submit" className="form-button">Send Message</button>
                    </form>
                )}
            </MessageModal>
        </div>
    );
};

const AssignmentsView = ({ myStudents }) => {
    const gradesTaught = [...new Set(myStudents.map(s => s.grade))];
    const [selectedGrade, setSelectedGrade] = useState(gradesTaught[0] || 'All');

    const filteredAssignments = selectedGrade === 'All'
        ? mockAssignments
        : mockAssignments.filter(a => a.grade === selectedGrade);
    
    return (
        <div className="detail-section">
             <h3 className="dashboard-subtitle">Class Assignments</h3>

            <div className="grade-filter-tabs">
                <button className={selectedGrade === 'All' ? 'active' : ''} onClick={() => setSelectedGrade('All')}>All Grades</button>
                {gradesTaught.map(grade => (
                    <button key={grade} className={selectedGrade === grade ? 'active' : ''} onClick={() => setSelectedGrade(grade)}>{grade}</button>
                ))}
            </div>

            <div className="assignments-list">
                {filteredAssignments.map(assignment => (
                    <div key={assignment.id} className="assignment-card">
                        <h4>{assignment.title} <span className="assignment-grade-tag">{assignment.grade}</span></h4>
                        <p>{assignment.description}</p>
                        <span>Due: {assignment.dueDate}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const TeacherDashboard = ({ teacher, school, allChildren, notifications, userAffiliations, onUpdateStudent, onUpdateNotifications, onSwitchSchool, onLogout }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [activeTab, setActiveTab] = useState('Students');
    
    // Filter students for the current teacher at the current school
    const myStudents = allChildren.filter(child => {
        // Find the student's affiliation in the registry
        const affiliation = completeUserRegistry[child.email.toLowerCase()];
        // Check if the student is affiliated with the current school
        const isInSchool = affiliation && affiliation.length > 0 && affiliation[0].schoolId === school.id;
        if (!isInSchool) return false;

        // For multi-school teachers, their name might be different in the system
        const teacherNameInSystem = userAffiliations.length > 1 ? "Ms. Multi" : teacher.name;
        return child.teacher === teacherNameInSystem;
    });

    if (selectedStudent) {
        return <TeacherStudentDetailView student={selectedStudent} onUpdateStudent={onUpdateStudent} onBack={() => setSelectedStudent(null)} />;
    }

    const renderActiveTab = () => {
        switch(activeTab) {
            case 'Assignments':
                return <AssignmentsView myStudents={myStudents} />;
            case 'MessageParents':
                return <MessageParentsView myStudents={myStudents} />;
            case 'Students':
            default:
                return (
                    <>
                        <h3 className="dashboard-subtitle">My Students at {school.name}</h3>
                        <div className="student-list">
                            {myStudents.map(student => (
                                <div key={student.id} className="student-card" role="button" onClick={() => setSelectedStudent(student)} tabIndex={0}>
                                    <div className="student-icon" aria-hidden="true">{student.name.charAt(0)}</div>
                                    <h4>{student.name}</h4>
                                    <p>{student.grade}</p>
                                </div>
                            ))}
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="dashboard-container teacher-dashboard">
            <header className="dashboard-header">
                <div className="dashboard-header-school-info">
                     <SchoolLogo logoUrl={school.logoUrl} schoolName={school.name} />
                     <SchoolSwitcher currentSchool={school} affiliations={userAffiliations} onSwitchSchool={onSwitchSchool} />
                </div>
                <div className="header-actions">
                    <span className="welcome-message">Welcome, {teacher.name}!</span>
                    <Notifications notifications={notifications} onUpdateNotifications={onUpdateNotifications} />
                    <button onClick={onLogout} className="logout-button">Logout</button>
                </div>
            </header>
            <main className="dashboard-main">
                {renderActiveTab()}
            </main>
            <nav className="bottom-nav">
                <button className={`nav-item ${activeTab === 'Students' ? 'active' : ''}`} onClick={() => setActiveTab('Students')}>
                    <span className="nav-icon">👥</span>
                    <span className="nav-label">My Students</span>
                </button>
                 <button className={`nav-item ${activeTab === 'Assignments' ? 'active' : ''}`} onClick={() => setActiveTab('Assignments')}>
                    <span className="nav-icon">📝</span>
                    <span className="nav-label">Assignments</span>
                </button>
                 <button className={`nav-item ${activeTab === 'MessageParents' ? 'active' : ''}`} onClick={() => setActiveTab('MessageParents')}>
                    <span className="nav-icon">✉️</span>
                    <span className="nav-label">Message Parents</span>
                </button>
            </nav>
        </div>
    );
};

// --- STUDENT DASHBOARD COMPONENTS ---
const StudentTimetableView = ({ timetable }: { timetable: TimetableEntry[] }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const entriesByDay = days.reduce((acc: Record<string, TimetableEntry[]>, day) => {
        const dayEntries = timetable.filter(entry => entry.day === day).sort((a,b) => a.time.localeCompare(b.time));
        if (dayEntries.length > 0) {
            acc[day] = dayEntries;
        }
        return acc;
    }, {} as Record<string, TimetableEntry[]>);

    return (
        <div className="detail-section">
            <h3 className="dashboard-subtitle">My Timetable</h3>
            <div className="timetable-view">
                 {Object.entries(entriesByDay).map(([day, entries]) => {
                    const currentEntries = entries as TimetableEntry[];
                    const dayKey = day as string;
                    return (
                        <div key={dayKey} className="timetable-day">
                            <h4>{dayKey}</h4>
                            <ul>
                                {currentEntries.map((entry, index: number) => (
                                    <li key={index} className="timetable-entry">
                                        <span className="entry-time">{entry.time}</span>
                                        <div className="entry-details">
                                            <strong>{entry.subject}</strong>
                                            <span>with {entry.teacher}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                 })}
            </div>
        </div>
    );
};

const StudentDashboard = ({ student, school, notifications, onUpdateNotifications, onLogout }) => {
    const [activeTab, setActiveTab] = useState('Grades');

    const renderActiveTab = () => {
        switch(activeTab) {
            case 'Attendance':
                return <AttendanceView attendance={student.attendance} />;
            case 'Timetable':
                return <StudentTimetableView timetable={student.timetable} />;
            case 'Assignments':
                return <AssignmentsView myStudents={[student]} />;
            case 'Grades':
            default:
                return <GradesView grades={student.grades} />;
        }
    }
    
    return (
        <div className="dashboard-container student-dashboard">
            <header className="dashboard-header">
                <div className="dashboard-header-school-info">
                    <SchoolLogo logoUrl={school.logoUrl} schoolName={school.name} />
                    <h2 className="school-name-static">{school.name}</h2>
                </div>
                <div className="header-actions">
                    <span className="welcome-message">Welcome, {student.name}!</span>
                     <Notifications notifications={notifications} onUpdateNotifications={onUpdateNotifications} />
                    <button onClick={onLogout} className="logout-button">Logout</button>
                </div>
            </header>
             <main className="dashboard-main">
                {renderActiveTab()}
            </main>
            <nav className="bottom-nav">
                <button className={`nav-item ${activeTab === 'Grades' ? 'active' : ''}`} onClick={() => setActiveTab('Grades')}>
                    <span className="nav-icon">📊</span>
                    <span className="nav-label">Grades</span>
                </button>
                 <button className={`nav-item ${activeTab === 'Attendance' ? 'active' : ''}`} onClick={() => setActiveTab('Attendance')}>
                    <span className="nav-icon">✅</span>
                    <span className="nav-label">Attendance</span>
                </button>
                 <button className={`nav-item ${activeTab === 'Timetable' ? 'active' : ''}`} onClick={() => setActiveTab('Timetable')}>
                    <span className="nav-icon">🗓️</span>
                    <span className="nav-label">Timetable</span>
                </button>
                 <button className={`nav-item ${activeTab === 'Assignments' ? 'active' : ''}`} onClick={() => setActiveTab('Assignments')}>
                    <span className="nav-icon">📝</span>
                    <span className="nav-label">Assignments</span>
                </button>
            </nav>
        </div>
    );
};

// --- ADMIN DASHBOARD COMPONENTS ---
const AdminDashboard = ({ admin, school, onLogout }) => {
    return (
        <div className="dashboard-container admin-dashboard">
            <header className="dashboard-header">
                 <div className="dashboard-header-school-info">
                    <SchoolLogo logoUrl={school.logoUrl} schoolName={school.name} />
                    <h2 className="school-name-static">{school.name}</h2>
                </div>
                <div className="header-actions">
                    <span className="welcome-message">Welcome, {admin.name}!</span>
                    <button onClick={onLogout} className="logout-button">Logout</button>
                </div>
            </header>
            <main className="dashboard-main">
                <div className="placeholder-content" style={{textAlign: 'center', padding: '4rem'}}>
                    <h3>Administrator Dashboard</h3>
                    <p>Features for managing students, teachers, and school-wide settings will be available here.</p>
                </div>
            </main>
        </div>
    );
};


// --- APP ---
const App = () => {
    const [user, setUser] = useState(null);
    const [school, setSchool] = useState(null);
    const [role, setRole] = useState(null);
    const [userAffiliations, setUserAffiliations] = useState([]);

    const [allChildren, setAllChildren] = useState(mockInitialChildren);
    const [allNotifications, setAllNotifications] = useState(mockNotifications);
    const [allTuitionInvoices, setAllTuitionInvoices] = useState(mockTuitionData);

    // Apply school-specific theme when school changes
    useEffect(() => {
        if (school) {
            document.documentElement.style.setProperty('--primary-color', school.primaryColor);
            // You can set other theme variables here, e.g., font, secondary color, etc.
        }
    }, [school]);

    const handleLogin = (loggedInUser, selectedSchool, selectedRole, affiliations) => {
        setUser(loggedInUser);
        setSchool(selectedSchool);
        setRole(selectedRole);
        setUserAffiliations(affiliations);
    };

    const handleLogout = () => {
        setUser(null);
        setSchool(null);
        setRole(null);
        setUserAffiliations([]);
        // Reset theme to default
        document.documentElement.style.setProperty('--primary-color', '#4A90E2');
    };
    
    const handleSwitchSchool = (newSchoolId) => {
        const newAffiliation = userAffiliations.find(aff => aff.schoolId === newSchoolId);
        if (newAffiliation) {
            const newSchool = schoolConfigs[newSchoolId];
            const newUser = mockUsers.find(u => u.id === newAffiliation.userId);
            if (newSchool && newUser) {
                // Keep the same role, just switch context
                setUser(newUser);
                setSchool(newSchool);
            }
        }
    };

    const handleUpdateStudent = (updatedStudent) => {
        setAllChildren(allChildren.map(c => c.id === updatedStudent.id ? updatedStudent : c));
    };

    const handleUpdateTuition = (invoiceIdToPay) => {
        setAllTuitionInvoices(
            allTuitionInvoices.map(inv =>
                inv.id === invoiceIdToPay ? { ...inv, status: 'Paid', paidDate: new Date().toISOString().split('T')[0] } : inv
            )
        );
    };
    
    // Filter notifications based on the current user's role
    const relevantNotifications = allNotifications.filter(n => n.recipientRole === 'All' || n.recipientRole === role);

    if (!user) {
        return <MagicLinkLogin onLogin={handleLogin} />;
    }

    const renderDashboard = () => {
        switch (role) {
            case 'Parent':
                return <ParentDashboard
                    parent={user}
                    school={school}
                    allChildren={allChildren}
                    notifications={relevantNotifications}
                    reportCards={mockReportCards}
                    tuitionInvoices={allTuitionInvoices}
                    userAffiliations={userAffiliations}
                    onUpdateNotifications={setAllNotifications}
                    onUpdateTuition={handleUpdateTuition}
                    onSwitchSchool={handleSwitchSchool}
                    onLogout={handleLogout}
                />;
            case 'Teacher':
                return <TeacherDashboard
                    teacher={user}
                    school={school}
                    allChildren={allChildren}
                    notifications={relevantNotifications}
                    userAffiliations={userAffiliations}
                    onUpdateStudent={handleUpdateStudent}
                    onUpdateNotifications={setAllNotifications}
                    onSwitchSchool={handleSwitchSchool}
                    onLogout={handleLogout}
                />;
            case 'Student':
                return <StudentDashboard 
                    student={user} 
                    school={school} 
                    notifications={relevantNotifications} 
                    onUpdateNotifications={setAllNotifications} 
                    onLogout={handleLogout} 
                />;
            case 'Administrator':
                return <AdminDashboard admin={user} school={school} onLogout={handleLogout} />;
            default:
                return <div>Error: Unknown user role.</div>;
        }
    };
    
    return <div className="app-container">{renderDashboard()}</div>;
};


// Render the app
const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);