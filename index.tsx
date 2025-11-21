
// Ensure we are using the global React/ReactDOM variables loaded via UMD in index.html
const React = (window as any).React;
const ReactDOM = (window as any).ReactDOM;

// Destructure the hooks and functions we need
const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;

console.log("ClassBridge App Starting... React Version:", React.version);

type Role = 'Student' | 'Parent' | 'Teacher' | 'Administrator';

// --- COMPONENTS ---

// 학교 로고 컴포넌트 (이미지 로드 실패 시 텍스트 표시)
const SchoolLogo = ({ logoUrl, schoolName }) => {
    const [imgError, setImgError] = useState(false);

    if (logoUrl && !imgError) {
        return (
            <img 
                src={logoUrl} 
                alt={`${schoolName}`} 
                className="school-logo-image" 
                onError={() => setImgError(true)}
            />
        );
    }
    // Fallback text logo
    return (
        <div style={{ 
            fontWeight: 'bold', 
            color: 'var(--primary-color)', 
            border: '2px solid var(--primary-color)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem'
        }}>
            {schoolName.charAt(0)}
        </div>
    );
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

// --- CONFIGURATION-BASED SCHOOL DEFINITIONS (학교 설정) ---
const schoolConfigs: Record<string, SchoolConfig> = {
    'ea': {
        id: 'ea',
        name: 'Everest Academy',
        primaryColor: '#4A90E2',
        logoUrl: '', // Empty to test fallback
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
        primaryColor: '#002D62', 
        logoUrl: 'https://lpa.edu.np/wp-content/uploads/2024/04/lifePrep.jpg',
        schoolType: 'Secondary',
        features: {
            schoolBusTracking: false,
            collegeCounselingPortal: true,
        },
    },
    'eis': {
        id: 'eis',
        name: 'Everest International School',
        primaryColor: '#0077c2', 
        logoUrl: '',
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
    
    // Life-Prep Academy Users (Requested for Testing)
    'ben.carter@lpa.edu': { userId: 11, role: 'Student', schoolId: 'lpa' },
    'susan.carter@gmail.com': { userId: 211, role: 'Parent', schoolId: 'lpa' },
    'dr.wallace@lpa.edu': { userId: 106, role: 'Teacher', schoolId: 'lpa' },
    'principal.lpa@lpa.edu': { userId: 997, role: 'Administrator', schoolId: 'lpa' }, // New Admin for LPA

    // Everest International School Users (New)
    'aarav.sharma@example.com': { userId: 12, role: 'Student', schoolId: 'eis' },
    'prakash.sharma@gmail.com': { userId: 212, role: 'Parent', schoolId: 'eis' },
    'mrs.thapa@eis.edu.np': { userId: 107, role: 'Teacher', schoolId: 'eis' },
    
    // Other Test Users...
    'liam.chen@example.com': { userId: 3, role: 'Student', schoolId: 'ea' },
    'david.chen@gmail.com': { userId: 203, role: 'Parent', schoolId: 'ea' },
    'olivia.garcia@example.com': { userId: 4, role: 'Student', schoolId: 'ea' },
    'maria.garcia@yahoo.com': { userId: 204, role: 'Parent', schoolId: 'ea' },
    'noah.r@example.com': { userId: 5, role: 'Student', schoolId: 'ea' },
    'james.rodriguez@hotmail.com': { userId: 205, role: 'Parent', schoolId: 'ea' },
    'sophia.miller@example.com': { userId: 6, role: 'Student', schoolId: 'ea' },
    'linda.m@gmail.com': { userId: 206, role: 'Parent', schoolId: 'ea' },
    'rohan.sharma@example.com': { userId: 7, role: 'Student', schoolId: 'his' },
    'vikram.sharma@gmail.com': { userId: 207, role: 'Parent', schoolId: 'his' },
    'priya.patel@example.com': { userId: 8, role: 'Student', schoolId: 'his' },
    'nita.patel@yahoo.com': { userId: 208, role: 'Parent', schoolId: 'his' },
    'sanjay.gupta@example.com': { userId: 9, role: 'Student', schoolId: 'his' },
    'raj.gupta@hotmail.com': { userId: 209, role: 'Parent', schoolId: 'his' },
    'anjali.singh@example.com': { userId: 10, role: 'Student', schoolId: 'his' },
    'meera.singh@gmail.com': { userId: 210, role: 'Parent', schoolId: 'his' },
    'zoe.r@example.com': { userId: 13, role: 'Student', schoolId: 'his' },
    
    // Multi-School Users
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
const completeUserRegistry = Object.keys(mockUserRegistry).reduce((acc, email) => {
    const data = mockUserRegistry[email];
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
    teacher: 'Ms. Davis', 
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
    { id: 997, name: 'Principal Taylor', role: 'Administrator' }, // LPA Admin
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

// --- NEW: Welcome Section Component ---
// 인사말과 사용자 이름을 띄워주는 컴포넌트
const WelcomeSection = ({ userName, role }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    // 사용자 이름이 문자열인지 확인하는 안전 장치
    const safeName = typeof userName === 'string' ? userName : 'User';

    return (
        <div className="welcome-section">
            <span className="welcome-date">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
            <h1 className="welcome-title">
                {getGreeting()},<br />
                <strong>{safeName}</strong>
            </h1>
        </div>
    );
};

// --- REFACTORED: Clean Header Component ---
// 복잡한 기능을 뺀 깔끔한 헤더
const CleanHeader = ({ school, onLogout }) => {
    return (
        <header className="dashboard-header">
            <div className="header-left">
                <SchoolLogo logoUrl={school.logoUrl} schoolName={school.name} />
                <h2 className="school-name-text">{school.name}</h2>
            </div>
            <button onClick={onLogout} className="logout-icon-btn" aria-label="Logout">
                ⏻
            </button>
        </header>
    );
};

// --- REFACTORED: Floating Nav Component ---
// 하단에 둥둥 떠있는 알약 모양 네비게이션
const FloatingNav = ({ activeTab, setActiveTab, tabs }) => {
    return (
        <div className="bottom-nav-container">
            <nav className="floating-nav">
                {tabs.map(tab => (
                    <button 
                        key={tab.id} 
                        className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        aria-label={tab.label}
                    >
                        <span className="nav-icon">{tab.icon}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

// --- LOGIN COMPONENT ---
const MagicLinkLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;
        
        const lowerEmail = email.toLowerCase();
        // 방어 코드: completeUserRegistry가 존재하는지 확인
        const userEntries = (typeof completeUserRegistry !== 'undefined' ? completeUserRegistry : {})[lowerEmail];

        if (userEntries && userEntries.length > 0) {
            const entry = userEntries[0];
            const user = mockUsers.find(u => u.id === entry.userId);
            const school = schoolConfigs[entry.schoolId];

            if (user && school) {
                onLogin(user, school, entry.role, userEntries);
            } else {
                setError('Configuration error: User or School not found.');
            }
        } else {
            setError('User not found. Please try one of the demo accounts below.');
        }
    };

    return (
        <div className="universal-login-container">
            <div style={{ marginBottom: '1.5rem' }}>
                {/* ClassBridge Logo SVG */}
                <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{margin:'0 auto'}}>
                    {/* Left Bracket */}
                    <path d="M35 25 C 20 40, 20 60, 35 75" stroke="#546E7A" strokeWidth="8" strokeLinecap="round" fill="none"/>
                    {/* Right Bracket */}
                    <path d="M65 25 C 80 40, 80 60, 65 75" stroke="#546E7A" strokeWidth="8" strokeLinecap="round" fill="none"/>
                    {/* Center Diamond */}
                    <path d="M50 40 L 57 50 L 50 60 L 43 50 Z" fill="#50E3C2" />
                </svg>
                <h2 style={{margin: '0.5rem 0', color: '#333', fontSize: '1.8rem'}}>ClassBridge</h2>
            </div>
            
            <p style={{color: '#666', marginBottom: '2rem'}}>Enter your email to sign in</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                />
                <button type="submit" className="form-button">Sign In</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            
            {/* Demo Credentials Display for Testing */}
            <div style={{marginTop: '2rem', textAlign: 'left', fontSize: '0.85rem', color: '#555', background: '#f5f5f5', padding: '1rem', borderRadius: '12px'}}>
                <div style={{fontWeight: '700', marginBottom: '0.5rem', color: '#333'}}>Life-Prep Academy Demo Accounts:</div>
                <ul style={{paddingLeft: '1.2rem', margin: '0'}}>
                    <li style={{marginBottom:'4px'}}><strong>Student:</strong> ben.carter@lpa.edu</li>
                    <li style={{marginBottom:'4px'}}><strong>Parent:</strong> susan.carter@gmail.com</li>
                    <li style={{marginBottom:'4px'}}><strong>Teacher:</strong> dr.wallace@lpa.edu</li>
                    <li><strong>Admin:</strong> principal.lpa@lpa.edu</li>
                </ul>
            </div>
        </div>
    );
};

// --- PARENT DASHBOARD ---
const ParentDashboard = ({ parent, school, allChildren, onLogout }) => {
    const [activeTab, setActiveTab] = useState('Children');
    const [selectedChild, setSelectedChild] = useState(null);

    // 내 자녀만 필터링 (안전 장치 추가)
    const myChildren = (allChildren || []).filter(child => 
        (parent.childrenIds || []).includes(child.id)
    );

    // 자녀 상세 보기 화면
    if (selectedChild) {
        return (
            <div className="dashboard-container">
                 <button className="back-button" onClick={() => setSelectedChild(null)}>
                    ← Back to Dashboard
                </button>
                <div className="detail-section" style={{textAlign:'center'}}>
                    <div className="child-icon" style={{margin:'0 auto 1rem'}}>{selectedChild.name.charAt(0)}</div>
                    <h2>{selectedChild.name}</h2>
                    <p>{selectedChild.grade}</p>
                </div>

                <div className="detail-section">
                    <h3 style={{fontSize:'1.1rem', marginBottom:'1rem'}}>Recent Grades</h3>
                    <ul className="grades-list">
                        {(selectedChild.grades || []).map((g, i) => (
                            <li key={i}>
                                <span>{g.subject}</span>
                                <span className="grade-score">{g.score}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    // 메인 대시보드 화면
    return (
        <div className="dashboard-container">
            <CleanHeader school={school} onLogout={onLogout} />
            <WelcomeSection userName={parent.name} role="Parent" />

            {activeTab === 'Children' && (
                <div className="child-selection-container">
                    {myChildren.map(child => (
                        <div key={child.id} className="child-card" onClick={() => setSelectedChild(child)}>
                            <div className="child-icon">{child.name.charAt(0)}</div>
                            <h4>{child.name}</h4>
                            <p>{child.grade}</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'Notices' && (
                <div className="detail-section">
                    <h3>Announcements</h3>
                    <p style={{color:'#888'}}>No new announcements today.</p>
                </div>
            )}

            {activeTab === 'Calendar' && (
                <div className="detail-section">
                    <h3>Calendar</h3>
                    <p style={{color:'#888'}}>Upcoming events will appear here.</p>
                </div>
            )}

            <FloatingNav 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                tabs={[
                    { id: 'Children', icon: '👨‍👩‍👧‍👦', label: 'Children' },
                    { id: 'Notices', icon: '📢', label: 'Notices' },
                    { id: 'Calendar', icon: '📅', label: 'Calendar' }
                ]} 
            />
        </div>
    );
};

// --- TEACHER DASHBOARD ---
const TeacherDashboard = ({ teacher, school, allChildren, onLogout }) => {
    const [activeTab, setActiveTab] = useState('Students');

    const myStudents = (allChildren || []).filter(child => 
        child.teacher === teacher.name || child.teacher === 'Ms. Multi'
    );

    return (
        <div className="dashboard-container">
            <CleanHeader school={school} onLogout={onLogout} />
            <WelcomeSection userName={teacher.name} role="Teacher" />

            {activeTab === 'Students' && (
                <div className="child-selection-container">
                    {myStudents.map(student => (
                        <div key={student.id} className="child-card">
                            <div className="child-icon">{student.name.charAt(0)}</div>
                            <h4>{student.name}</h4>
                            <p>{student.grade}</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'Assignments' && (
                <div className="detail-section">
                    <h3>Class Assignments</h3>
                    <p>Manage your class assignments here.</p>
                </div>
            )}

            <FloatingNav 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                tabs={[
                    { id: 'Students', icon: '🎓', label: 'Students' },
                    { id: 'Assignments', icon: '📝', label: 'Assignments' },
                    { id: 'Messages', icon: '✉️', label: 'Messages' }
                ]} 
            />
        </div>
    );
};

// --- STUDENT DASHBOARD ---
const StudentDashboard = ({ student, school, onLogout }) => {
    const [activeTab, setActiveTab] = useState('Home');

    return (
        <div className="dashboard-container">
            <CleanHeader school={school} onLogout={onLogout} />
            <WelcomeSection userName={student.name} role="Student" />

            {activeTab === 'Home' && (
                <div className="detail-section">
                    <h3>My Grades</h3>
                    <ul className="grades-list">
                        {(student.grades || []).map((g, i) => (
                            <li key={i}>
                                <span>{g.subject}</span>
                                <span className="grade-score">{g.score}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <FloatingNav 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                tabs={[
                    { id: 'Home', icon: '🏠', label: 'Home' },
                    { id: 'Timetable', icon: '🗓️', label: 'Timetable' },
                    { id: 'Tasks', icon: '✅', label: 'Tasks' }
                ]} 
            />
        </div>
    );
};

// --- MAIN APP COMPONENT ---
const App = () => {
    const [user, setUser] = useState(null);
    const [school, setSchool] = useState(null);
    const [role, setRole] = useState(null);
    
    // 데이터 초기화 (안전하게)
    const [allChildren, setAllChildren] = useState(typeof mockInitialChildren !== 'undefined' ? mockInitialChildren : []);

    const handleLogin = (loggedInUser, selectedSchool, selectedRole) => {
        setUser(loggedInUser);
        setSchool(selectedSchool);
        setRole(selectedRole);
        
        if (selectedSchool && selectedSchool.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', selectedSchool.primaryColor);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setSchool(null);
        setRole(null);
        document.documentElement.style.setProperty('--primary-color', '#4A90E2');
    };

    if (!user) {
        return <MagicLinkLogin onLogin={handleLogin} />;
    }

    // 역할에 따른 화면 렌더링
    switch (role) {
        case 'Parent':
            return <ParentDashboard parent={user} school={school} allChildren={allChildren} onLogout={handleLogout} />;
        case 'Teacher':
            return <TeacherDashboard teacher={user} school={school} allChildren={allChildren} onLogout={handleLogout} />;
        case 'Student':
            return <StudentDashboard student={user} school={school} onLogout={handleLogout} />;
        case 'Administrator':
             return (
                <div className="dashboard-container">
                    <CleanHeader school={school} onLogout={handleLogout} />
                    <WelcomeSection userName={user.name} role="Administrator" />
                    <div className="detail-section">
                        <h3>Administrator Dashboard</h3>
                        <p>Welcome, Principal. School metrics loading...</p>
                    </div>
                </div>
             );
        default:
            return <div style={{padding:'2rem'}}>Unknown Role</div>;
    }
};

// --- RENDER ---
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
}