import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

type Role = 'Student' | 'Parent' | 'Teacher' | 'Administrator';

// --- NEW LOGO COMPONENT (CONCEPT 2: THE SPARK OF CONNECTION) ---
const ClassBridgeLogo: React.FC<{ size?: number }> = ({ size = 48 }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    const handleDownload = () => {
        if (!svgRef.current) return;

        // Get computed colors from CSS variables
        const computedStyles = getComputedStyle(document.documentElement);
        const primaryColor = computedStyles.getPropertyValue('--primary-color').trim();
        const secondaryColor = computedStyles.getPropertyValue('--secondary-color').trim();
        
        // Clone the node to avoid modifying the one in the DOM
        const svgNode = svgRef.current.cloneNode(true) as SVGSVGElement;
        
        // Remove classes and interactive attributes for a clean, self-contained SVG file
        svgNode.removeAttribute('class');
        svgNode.removeAttribute('style');
        svgNode.removeAttribute('aria-label');
        svgNode.removeAttribute('role');
        svgNode.removeAttribute('tabindex');
        
        // Find each group and inline the color
        const entities = svgNode.querySelector('.entities') as SVGGElement;
        if (entities) {
            entities.removeAttribute('class');
            entities.setAttribute('stroke', primaryColor);
        }

        const spark = svgNode.querySelector('.spark') as SVGGElement;
        if (spark) {
            spark.removeAttribute('class');
            spark.setAttribute('fill', secondaryColor);
        }

        const serializer = new XMLSerializer();
        // Add XML declaration for better compatibility
        const svgString = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(svgNode);

        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'classbridge-logo-spark.svg';
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    return (
        <svg 
            ref={svgRef}
            width={size} 
            height={size} 
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg" 
            className="classbridge-logo downloadable"
            aria-label="ClassBridge Logo, click to download"
            onClick={handleDownload}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleDownload(); } }}
        >
            <title>Download Logo as SVG</title>
            {/* School and Home entities */}
            <g className="entities" strokeWidth="9" strokeLinecap="round" fill="none">
                <path d="M20 20 C 40 50, 40 50, 20 80" />
                <path d="M80 80 C 60 50, 60 50, 80 20" />
            </g>
            
            {/* The Spark of Connection */}
            <g className="spark">
                <path d="M50 38 L56 50 L50 62 L44 50 Z" />
            </g>
        </svg>
    );
};

// --- NEW SCHOOL-SPECIFIC LOGO COMPONENT ---
const SchoolLogo: React.FC<{ logoUrl?: string; schoolName?: string }> = ({ logoUrl, schoolName }) => {
    if (logoUrl) {
        return <img src={logoUrl} alt={`${schoolName} Logo`} className="school-logo-image" />;
    }
    // Fallback to the generic ClassBridge logo if no specific URL is provided
    return <ClassBridgeLogo />;
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
    id: 7, name: 'Rohan Sharma', role: 'Student', parentId: 207, grade: 'Grade 7', teacher: 'Mr. Lee',
    grades: [{ subject: 'English', score: 'B+' }, { subject: 'Geography', score: 'A-' }],
    attendance: { present: 89, tardy: 1, absent: 0 }, timetable: [],
  },
  {
    id: 8, name: 'Priya Patel', role: 'Student', parentId: 208, grade: 'Grade 7', teacher: 'Mr. Lee',
    grades: [{ subject: 'English', score: 'A' }, { subject: 'Geography', score: 'B' }],
    attendance: { present: 87, tardy: 2, absent: 1 }, timetable: [],
  },
  {
    id: 9, name: 'Sanjay Gupta', role: 'Student', parentId: 209, grade: 'Grade 8', teacher: 'Mr. Kumar',
    grades: [{ subject: 'Science', score: 'A-' }, { subject: 'Math', score: 'B+' }],
    attendance: { present: 90, tardy: 0, absent: 0 }, timetable: [],
  },
  {
    id: 10, name: 'Anjali Singh', role: 'Student', parentId: 210, grade: 'Grade 8', teacher: 'Mr. Kumar',
    grades: [{ subject: 'Science', score: 'B' }, { subject: 'Math', score: 'C+' }],
    attendance: { present: 85, tardy: 4, absent: 1 }, timetable: [],
  },
    // Life-Prep Academy student
  {
    id: 11, name: 'Ben Carter', role: 'Student', parentId: 211, grade: 'Grade 11', teacher: 'Dr. Wallace',
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
    id: 12, name: 'Aarav Sharma', role: 'Student', parentId: 212, grade: 'Grade 3', teacher: 'Mrs. Thapa',
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

const MagicLinkLogin: React.FC<{
    onLogin: (user: User, school: SchoolConfig, role: Role, allAffiliations: UserRegistryEntry[]) => void;
}> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState<'identify' | 'select-school' | 'confirm'>('identify');
    const [error, setError] = useState('');
    const [identifiedAffiliations, setIdentifiedAffiliations] = useState<UserRegistryEntry[]>([]);
    const [selectedAffiliation, setSelectedAffiliation] = useState<UserRegistryEntry | null>(null);


    const handleIdentifySubmit = (e: React.FormEvent) => {
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
    
    const handleSelectSchool = (affiliation: UserRegistryEntry) => {
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

const Notifications: React.FC<{
    notifications: Notification[];
    onUpdateNotifications: (notifications: Notification[]) => void;
}> = ({ notifications, onUpdateNotifications }) => {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
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
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
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
const GradesView: React.FC<{ grades: Grade[] }> = ({ grades }) => (
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

const AttendanceView: React.FC<{ attendance: Attendance }> = ({ attendance }) => (
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

const AbsenceNotificationView: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

const ReportCardPreviewModal: React.FC<{ report: ReportCard, onClose: () => void }> = ({ report, onClose }) => (
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

const ReportCardView: React.FC<{ reportCards: ReportCard[] }> = ({ reportCards }) => {
    const [previewingReport, setPreviewingReport] = useState<ReportCard | null>(null);

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
const TuitionView: React.FC<{ 
    invoices: TuitionInvoice[]; 
    onPayInvoice: (invoiceId: number) => void;
}> = ({ invoices, onPayInvoice }) => {
    const [payingInvoice, setPayingInvoice] = useState<TuitionInvoice | null>(null);
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


const MessageTeacherView: React.FC<{ teacherName: string; isModal?: boolean }> = ({ teacherName, isModal = false }) => {
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

const ChildDetailView: React.FC<{ 
    child: Child; 
    reportCards: ReportCard[];
    tuitionInvoices: TuitionInvoice[];
    onBack: () => void;
    onUpdateTuition: (invoiceId: number) => void;
}> = ({ child, reportCards, tuitionInvoices, onBack, onUpdateTuition }) => {
    const [activeView, setActiveView] = useState<ParentActiveView>('Grades');

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
                        <ReportCardView reportCards={reportCards} />
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

const AnnouncementsView: React.FC = () => {
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

const CalendarView: React.FC = () => {
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

const SchoolBusView: React.FC = () => {
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
const CollegeCounselingView: React.FC = () => {
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


const ReportsView: React.FC<{ parent: Parent; allChildren: Child[]; reportCards: ReportCard[] }> = ({ parent, allChildren, reportCards }) => {
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

const SchoolSwitcher: React.FC<{
    currentSchool: SchoolConfig;
    affiliations: UserRegistryEntry[];
    onSwitchSchool: (schoolId: string) => void;
}> = ({ currentSchool, affiliations, onSwitchSchool }) => {
    const [isOpen, setIsOpen] = useState(false);
    const switcherRef = useRef<HTMLDivElement>(null);

    const otherAffiliations = affiliations.filter(aff => aff.schoolId !== currentSchool.id);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
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

const ParentDashboard: React.FC<{ 
    parent: Parent;
    school: SchoolConfig;
    allChildren: Child[]; 
    notifications: Notification[];
    reportCards: ReportCard[];
    tuitionInvoices: TuitionInvoice[];
    userAffiliations: UserRegistryEntry[];
    onUpdateNotifications: (notifications: Notification[]) => void; 
    onUpdateTuition: (invoiceId: number) => void;
    onSwitchSchool: (schoolId: string) => void;
    onLogout: () => void 
}> = ({ parent, school, allChildren, notifications, reportCards, tuitionInvoices, userAffiliations, onUpdateNotifications, onUpdateTuition, onSwitchSchool, onLogout }) => {
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [activeTab, setActiveTab] = useState<ParentTab>('Children');
    // Filter children to show only those in the currently selected school
    const myChildren = allChildren.filter(child => parent.childrenIds.includes(child.id) && completeUserRegistry[child.email.toLowerCase()][0].schoolId === school.id);

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
const GradeEditor: React.FC<{ grades: Grade[], onAddGrade: (newGrade: Grade) => void }> = ({ grades, onAddGrade }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const subject = (form.elements.namedItem('subject') as HTMLInputElement).value;
        const score = (form.elements.namedItem('score') as HTMLInputElement).value;
        onAddGrade({ subject, score });
        form.reset();
    };

    return (
        <div className="detail-section">
            <h3>Manage Grades</h3>
            <ul className="grades-list">
                {grades.map(grade => (
                    <li key={grade.subject}>
                        <span>{grade.subject}</span>
                        <span className="grade-score">{grade.score}</span>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit} className="detail-form add-grade-form">
                <h4>Add New Grade</h4>
                <div className="form-group-inline">
                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input type="text" id="subject" name="subject" required placeholder="e.g., Mathematics" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="score">Score</label>
                        <input type="text" id="score" name="score" required placeholder="e.g., A+" />
                    </div>
                    <button type="submit" className="form-button">Add</button>
                </div>
            </form>
        </div>
    );
};

const AttendanceEditor: React.FC<{ attendance: Attendance, onUpdateAttendance: (newAttendance: Attendance) => void }> = ({ attendance, onUpdateAttendance }) => {
    const handleUpdate = (type: keyof Attendance, delta: number) => {
        const newValue = attendance[type] + delta;
        if (newValue >= 0) {
            onUpdateAttendance({ ...attendance, [type]: newValue });
        }
    };

    return (
        <div className="detail-section">
            <h3>Manage Attendance</h3>
            <div className="attendance-editor">
                {(Object.keys(attendance) as Array<keyof Attendance>).map(key => (
                    <div key={key} className="attendance-control">
                        <span className="stat-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
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

const ReportCardStudio: React.FC<{
    student: Child;
    onPublish: (reportCard: ReportCard) => void;
}> = ({ student, onPublish }) => {
    const [term, setTerm] = useState(`Second Term (${new Date().getFullYear()})`);
    const [overallComment, setOverallComment] = useState('');
    const [subjectComments, setSubjectComments] = useState<Record<string, string>>({});
    const [published, setPublished] = useState(false);

    const handleSubjectCommentChange = (subject: string, comment: string) => {
        setSubjectComments(prev => ({...prev, [subject]: comment}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newReportCard: ReportCard = {
            id: Date.now(),
            studentId: student.id,
            term,
            issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            overallComment,
            entries: student.grades.map(grade => ({
                subject: grade.subject,
                score: grade.score,
                comment: subjectComments[grade.subject] || 'No comment.',
            }))
        };
        onPublish(newReportCard);
        setPublished(true);
        setTimeout(() => {
            setPublished(false);
            setOverallComment('');
            setSubjectComments({});
        }, 5000)
    };
    
    return (
        <div className="detail-section report-card-studio">
            <h3>Report Card Studio</h3>
             {published ? (
                <p className="confirmation-message">Report card has been published successfully and is now visible to the student and parent.</p>
            ) : (
                <form onSubmit={handleSubmit} className="studio-form">
                    <div className="form-group">
                        <label htmlFor="term">Term</label>
                        <input type="text" id="term" value={term} onChange={e => setTerm(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="overall-comment">Teacher's Overall Comment</label>
                        <textarea id="overall-comment" rows={5} value={overallComment} onChange={e => setOverallComment(e.target.value)} placeholder={`Write a summary of ${student.name}'s progress this term...`} required />
                    </div>

                    <h4>Subject-Specific Comments</h4>
                    <div className="subject-comments-list">
                        {student.grades.map(grade => (
                             <div key={grade.subject} className="subject-comment-entry">
                                <div className="subject-header">
                                    <span className="entry-subject">{grade.subject}</span>
                                    <span className="entry-score">{grade.score}</span>
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`comment-${grade.subject}`} className="sr-only">Comment for {grade.subject}</label>
                                    <textarea 
                                        id={`comment-${grade.subject}`} 
                                        rows={3}
                                        value={subjectComments[grade.subject] || ''}
                                        onChange={e => handleSubjectCommentChange(grade.subject, e.target.value)}
                                        placeholder={`Add a comment for ${grade.subject}...`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="form-button publish-btn">Publish Report Card</button>
                </form>
            )}
        </div>
    );
};

type TeacherActiveView = 'Grades' | 'Attendance' | 'ReportCard';

const StudentEditorView: React.FC<{ 
    child: Child; 
    onBack?: () => void; 
    onUpdateChild: (updatedChild: Child) => void;
    onAddReportCard: (reportCard: ReportCard) => void;
    defaultView?: TeacherActiveView;
}> = ({ child, onBack, onUpdateChild, onAddReportCard, defaultView }) => {
    const [activeView, setActiveView] = useState<TeacherActiveView>(defaultView || 'Grades');

    const handleAddGrade = (newGrade: Grade) => {
        const updatedChild = { ...child, grades: [...child.grades, newGrade] };
        onUpdateChild(updatedChild);
    };

    const handleUpdateAttendance = (newAttendance: Attendance) => {
        const updatedChild = { ...child, attendance: newAttendance };
        onUpdateChild(updatedChild);
    };

    return (
        <div className="child-detail-container">
             {onBack && <button onClick={onBack} className="back-button" aria-label="Go back to class list">
                &larr; Back to Student List
            </button>}
            <div className="child-detail-header">
                <h2>{child.name}</h2>
                <p>{child.grade}</p>
            </div>
            <nav className="detail-nav">
                <button onClick={() => setActiveView('Grades')} className={activeView === 'Grades' ? 'active' : ''}>Manage Grades</button>
                <button onClick={() => setActiveView('Attendance')} className={activeView === 'Attendance' ? 'active' : ''}>Manage Attendance</button>
                 <button onClick={() => setActiveView('ReportCard')} className={activeView === 'ReportCard' ? 'active' : ''}>Write Report Card</button>
            </nav>
            <div className="detail-content">
                {activeView === 'Grades' && <GradeEditor grades={child.grades} onAddGrade={handleAddGrade} />}
                {activeView === 'Attendance' && <AttendanceEditor attendance={child.attendance} onUpdateAttendance={handleUpdateAttendance} />}
                {activeView === 'ReportCard' && <ReportCardStudio student={child} onPublish={onAddReportCard} />}
            </div>
        </div>
    );
};

const AssignmentManager: React.FC<{
    selectedGrade: string;
    assignments: Assignment[];
    onAddAssignment: (newAssignment: Omit<Assignment, 'id'>) => void;
    onBack: () => void;
}> = ({ selectedGrade, assignments, onAddAssignment, onBack }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const gradeAssignments = assignments.filter(a => a.grade === selectedGrade);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddAssignment({ grade: selectedGrade, title, description, dueDate });
        setTitle('');
        setDescription('');
        setDueDate('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="detail-section assignment-manager">
            <button onClick={onBack} className="back-button">&larr; Back to Class List</button>
            <h3 className="dashboard-subtitle">{selectedGrade} Assignments</h3>
            
            <div className="assignment-content">
                <div className="assignment-list">
                    <h4>Current Assignments</h4>
                    {gradeAssignments.length > 0 ? (
                        <ul>
                            {gradeAssignments.map(a => (
                                <li key={a.id}>
                                    <strong>{a.title}</strong>
                                    <p>{a.description}</p>
                                    <span>Due: {a.dueDate}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No assignments have been posted for this class yet.</p>
                    )}
                </div>

                <div className="assignment-form-container">
                    <h4>Add New Assignment</h4>
                     {submitted ? (
                        <p className="confirmation-message">Assignment posted successfully!</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="detail-form">
                            <div className="form-group">
                                <label htmlFor="assignment-title">Title</label>
                                <input id="assignment-title" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="assignment-desc">Description</label>
                                <textarea id="assignment-desc" rows={4} value={description} onChange={e => setDescription(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="assignment-due">Due Date</label>
                                <input id="assignment-due" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
                            </div>
                            <button type="submit" className="form-button">Post Assignment</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

const PortalLauncher: React.FC<{ onEnterPortal: () => void }> = ({ onEnterPortal }) => (
    <div className="feature-spotlight mobile-portal-launcher">
        <h2>Web Platform Available</h2>
        <p className="feature-intro">
            Access the full suite of management tools on your desktop.
        </p>
        <button className="form-button portal-login-button" onClick={onEnterPortal}>
            Launch Web Platform
        </button>
    </div>
);

const TeacherDashboard: React.FC<{ 
    teacher: Teacher; 
    school: SchoolConfig; 
    allChildren: Child[]; 
    assignments: Assignment[];
    notifications: Notification[]; 
    userAffiliations: UserRegistryEntry[];
    onUpdateNotifications: (notifications: Notification[]) => void; 
    onUpdateChildren: (children: Child[]) => void; 
    onAddReportCard: (reportCard: ReportCard) => void;
    onAddAssignment: (assignment: Omit<Assignment, 'id'>) => void;
    onSwitchSchool: (schoolId: string) => void;
    onEnterPortal: () => void;
    onLogout: () => void;
}> = ({ teacher, school, allChildren, assignments, notifications, userAffiliations, onUpdateNotifications, onUpdateChildren, onAddReportCard, onAddAssignment, onSwitchSchool, onEnterPortal, onLogout }) => {
    const [selectedChildInfo, setSelectedChildInfo] = useState<{ child: Child; defaultView?: TeacherActiveView } | null>(null);
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'Home' | 'Management' | 'Reports'>('Home');
    const [viewingAssignmentsForGrade, setViewingAssignmentsForGrade] = useState<string|null>(null);
    
    // Filter students by the current school context
    const studentsAtCurrentSchool = allChildren.filter(child => {
        const studentAffiliation = completeUserRegistry[child.email.toLowerCase()];
        return studentAffiliation && studentAffiliation[0].schoolId === school.id;
    });

    const isSecondary = school.schoolType === 'Secondary';

    const handleUpdateChild = (updatedChild: Child) => {
        const newChildren = allChildren.map(c => c.id === updatedChild.id ? updatedChild : c);
        onUpdateChildren(newChildren);
        setSelectedChildInfo(prev => prev ? { ...prev, child: updatedChild } : null); 
    };

    if (selectedChildInfo) {
        return <StudentEditorView 
            child={selectedChildInfo.child} 
            onBack={() => setSelectedChildInfo(null)} 
            onUpdateChild={handleUpdateChild} 
            onAddReportCard={onAddReportCard} 
            defaultView={selectedChildInfo.defaultView}
        />;
    }
    
    if (viewingAssignmentsForGrade) {
        return <AssignmentManager 
            selectedGrade={viewingAssignmentsForGrade}
            assignments={assignments}
            onAddAssignment={onAddAssignment}
            onBack={() => setViewingAssignmentsForGrade(null)}
        />
    }

    const renderClassSelector = (mode: 'Management' | 'Reports') => {
        // For Elementary, find the grade the teacher teaches. For Secondary, use teachesGrades array.
        const classes = isSecondary ? (teacher.teachesGrades || []) : Array.from(new Set(studentsAtCurrentSchool.filter(c => c.teacher === teacher.name).map(c => c.grade)));

        let classStudents: Child[] = [];
        if (selectedGrade) {
            classStudents = studentsAtCurrentSchool.filter(child => child.grade === selectedGrade && (isSecondary || child.teacher === teacher.name));
        }
        
        if (selectedGrade) {
             return (
                <div className="student-list-view">
                     <button onClick={() => setSelectedGrade(null)} className="back-button">&larr; Back to Class List</button>
                     <h3 className="dashboard-subtitle">{selectedGrade} Student List</h3>
                     <div className="child-selection-container">
                        {classStudents.map(child => (
                            <div key={child.id} className="child-card" role="button" onClick={() => {
                                const defaultView = mode === 'Reports' ? 'ReportCard' : 'Grades';
                                setSelectedChildInfo({ child, defaultView });
                            }} tabIndex={0} aria-label={`Manage student ${child.name}`}>
                                <div className="child-icon" aria-hidden="true">{child.name.charAt(0)}</div>
                                <h4>{child.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <>
                <h3 className="dashboard-subtitle">{mode === 'Management' ? 'Class Management' : 'Report Card Entry'}</h3>
                <div className="teacher-class-list">
                    {classes.map(grade => (
                         <div key={grade} className="class-card" >
                            <div className="class-card-header">
                                <div className="child-icon" aria-hidden="true">🎓</div>
                                <h4>{grade}</h4>
                            </div>
                             <div className="class-card-actions">
                                {mode === 'Management' ? (
                                    <>
                                        <button onClick={() => setSelectedGrade(grade)}>Manage Students</button>
                                        <button onClick={() => setViewingAssignmentsForGrade(grade)}>Manage Assignments</button>
                                    </>
                                ) : (
                                     <button onClick={() => setSelectedGrade(grade)}>Select Students</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    const renderActiveTab = () => {
        switch(activeTab) {
            case 'Home':
                return (
                    <div className="detail-section">
                        <PortalLauncher onEnterPortal={onEnterPortal} />
                        <AnnouncementsView />
                    </div>
                );
            case 'Management':
                return renderClassSelector('Management');
            case 'Reports':
                return renderClassSelector('Reports');
            default:
                return null;
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
                <button className={`nav-item ${activeTab === 'Home' ? 'active' : ''}`} onClick={() => setActiveTab('Home')}>
                    <span className="nav-icon">🏠</span>
                    <span className="nav-label">Home</span>
                </button>
                 <button className={`nav-item ${activeTab === 'Management' ? 'active' : ''}`} onClick={() => setActiveTab('Management')}>
                    <span className="nav-icon">🧑‍🏫</span>
                    <span className="nav-label">Class Mgmt</span>
                </button>
                 <button className={`nav-item ${activeTab === 'Reports' ? 'active' : ''}`} onClick={() => setActiveTab('Reports')}>
                    <span className="nav-icon">✍️</span>
                    <span className="nav-label">Reports</span>
                </button>
            </nav>
        </div>
    );
};


// --- STUDENT DASHBOARD COMPONENTS ---

// New Modal Component for Subject Details
const SubjectDetailModal: React.FC<{ entry: TimetableEntry, onClose: () => void }> = ({ entry, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3>{entry.subject}</h3>
                <button onClick={onClose} className="modal-close-button" aria-label="Close">&times;</button>
            </div>
            <div className="modal-body">
                <p><strong>Teacher:</strong> {entry.teacher}</p>
                <div className="subject-modal-section">
                    <h4>Learning Materials</h4>
                    <ul>
                        <li><a href="#" onClick={e => e.preventDefault()}>Today's Lecture Notes.pdf</a></li>
                        <li><a href="#" onClick={e => e.preventDefault()}>Reference Video Link</a></li>
                    </ul>
                </div>
                <div className="subject-modal-section">
                    <h4>Assignment</h4>
                    <p>Complete problems 3 and 5 on page 54 of the textbook and submit by the next class.</p>
                </div>
            </div>
        </div>
    </div>
);

// New Modal Component for Messaging Teacher
const MessageTeacherModal: React.FC<{ teacherName: string, onClose: () => void }> = ({ teacherName, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
             <div className="modal-header">
                <h3>Message to {teacherName}</h3>
                <button onClick={onClose} className="modal-close-button" aria-label="Close">&times;</button>
            </div>
            <div className="modal-body">
                <MessageTeacherView teacherName={teacherName} isModal={true} />
            </div>
        </div>
    </div>
);


const TimetableView: React.FC<{ 
    timetable: TimetableEntry[];
    onSubjectClick: (entry: TimetableEntry) => void;
    onTeacherClick: (teacherName: string) => void;
}> = ({ timetable, onSubjectClick, onTeacherClick }) => {
    const groupedByDay = timetable.reduce((acc, entry) => {
        (acc[entry.day] = acc[entry.day] || []).push(entry);
        return acc;
    }, {} as Record<string, TimetableEntry[]>);

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className="detail-section timetable-view">
            <h3 className="dashboard-subtitle">My Timetable</h3>
            {daysOfWeek.map(day => (
                groupedByDay[day] && (
                    <div key={day} className="timetable-day">
                        <h4>{day}</h4>
                        <ul className="timetable-list">
                            {groupedByDay[day].sort((a,b) => a.time.localeCompare(b.time)).map((entry, index) => (
                                <li key={index} className="timetable-entry">
                                    <span className="entry-time">{entry.time}</span>
                                    <div className="entry-details-interactive">
                                      <button className="subject-button" onClick={() => onSubjectClick(entry)}>{entry.subject}</button>
                                      <button className="teacher-button" onClick={() => onTeacherClick(entry.teacher)}>{entry.teacher}</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            ))}
        </div>
    );
};

type StudentTab = 'Announcements' | 'Calendar' | 'Timetable' | 'Reports';

const StudentDashboard: React.FC<{ 
    student: Child;
    school: SchoolConfig;
    reportCards: ReportCard[];
    notifications: Notification[]; 
    userAffiliations: UserRegistryEntry[];
    onUpdateNotifications: (notifications: Notification[]) => void;
    onSwitchSchool: (schoolId: string) => void; 
    onLogout: () => void 
}> = ({ student, school, reportCards, notifications, userAffiliations, onUpdateNotifications, onSwitchSchool, onLogout }) => {
    const [activeTab, setActiveTab] = useState<StudentTab>('Timetable');
    const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null>(null);
    const [messagingTeacher, setMessagingTeacher] = useState<string | null>(null);
    const studentReportCards = reportCards.filter(rc => rc.studentId === student.id);

    const renderActiveTab = () => {
        switch(activeTab) {
            case 'Announcements':
                return <AnnouncementsView />;
            case 'Calendar':
                return <CalendarView />;
            case 'Reports':
                return (
                     <div className="detail-section report-card-section">
                        <h3 className="dashboard-subtitle">Report Cards</h3>
                        <ReportCardView reportCards={studentReportCards} />
                    </div>
                );
            case 'Timetable':
            default:
                return <TimetableView 
                          timetable={student.timetable} 
                          onSubjectClick={setSelectedEntry}
                          onTeacherClick={setMessagingTeacher}
                        />;
        }
    };

    return (
        <div className="dashboard-container student-dashboard">
             <header className="dashboard-header">
                 <div className="dashboard-header-school-info">
                    <SchoolLogo logoUrl={school.logoUrl} schoolName={school.name} />
                    <SchoolSwitcher currentSchool={school} affiliations={userAffiliations} onSwitchSchool={onSwitchSchool} />
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
                <button className={`nav-item ${activeTab === 'Announcements' ? 'active' : ''}`} onClick={() => setActiveTab('Announcements')}>
                    <span className="nav-icon">📢</span>
                    <span className="nav-label">Announcements</span>
                </button>
                 <button className={`nav-item ${activeTab === 'Calendar' ? 'active' : ''}`} onClick={() => setActiveTab('Calendar')}>
                    <span className="nav-icon">📅</span>
                    <span className="nav-label">Calendar</span>
                </button>
                 <button className={`nav-item ${activeTab === 'Timetable' ? 'active' : ''}`} onClick={() => setActiveTab('Timetable')}>
                    <span className="nav-icon">🕒</span>
                    <span className="nav-label">Timetable</span>
                </button>
                 <button className={`nav-item ${activeTab === 'Reports' ? 'active' : ''}`} onClick={() => setActiveTab('Reports')}>
                    <span className="nav-icon">📄</span>
                    <span className="nav-label">Reports</span>
                </button>
            </nav>

            {selectedEntry && (
                <SubjectDetailModal 
                    entry={selectedEntry}
                    onClose={() => setSelectedEntry(null)}
                />
            )}
            {messagingTeacher && (
                <MessageTeacherModal 
                    teacherName={messagingTeacher}
                    onClose={() => setMessagingTeacher(null)}
                />
            )}
        </div>
    );
};

// --- ADMIN DASHBOARD / PORTAL COMPONENTS (OLD, for reference, see WebPortal for new) ---
const AdminAnnouncements: React.FC<{ onAddNotification: (title: string, message: string, recipient: Role | 'All') => void; }> = ({ onAddNotification }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [recipient, setRecipient] = useState<Role | 'All'>('All');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onAddNotification(title, message, recipient);
        setTitle('');
        setMessage('');
        setRecipient('All');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <div className="detail-section">
            <h3>Send a New Announcement</h3>
            {submitted ? (
                <p className="confirmation-message">Announcement sent successfully!</p>
            ) : (
                <form onSubmit={handleSubmit} className="detail-form">
                    <div className="form-group">
                        <label htmlFor="announcement-title">Title</label>
                        <input
                            type="text"
                            id="announcement-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="e.g., School Closure"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="announcement-message">Message</label>
                        <textarea
                            id="announcement-message"
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            placeholder="Write your announcement here..."
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="announcement-recipient">Recipient Group</label>
                        <select
                            id="announcement-recipient"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value as Role | 'All')}
                        >
                            <option value="All">All Users</option>
                            <option value="Parent">Parents</option>
                            <option value="Teacher">Teachers</option>
                            <option value="Student">Students</option>
                        </select>
                    </div>
                    <button type="submit" className="form-button">Send Announcement</button>
                </form>
            )}
        </div>
    );
};

const AdminDashboardMobile: React.FC<{ admin: User; school: SchoolConfig; userAffiliations: UserRegistryEntry[]; onAddNotification: (title: string, message: string, recipient: Role | 'All') => void; onSwitchSchool: (schoolId: string) => void; onLogout: () => void; onEnterPortal: () => void }> = ({ admin, school, userAffiliations, onAddNotification, onSwitchSchool, onLogout, onEnterPortal }) => {
    
    return (
        <div className="dashboard-container admin-dashboard">
            <header className="dashboard-header">
                <div className="dashboard-header-school-info">
                    <SchoolLogo logoUrl={school.logoUrl} schoolName={school.name} />
                    <SchoolSwitcher currentSchool={school} affiliations={userAffiliations} onSwitchSchool={onSwitchSchool} />
                </div>
                 <div className="header-actions">
                    <span className="welcome-message">Welcome, {admin.name}!</span>
                    <button onClick={onLogout} className="logout-button">Logout</button>
                </div>
            </header>
            <main className="dashboard-main portal-main">
                <PortalLauncher onEnterPortal={onEnterPortal} />
                <div className="detail-section">
                    <AdminAnnouncements onAddNotification={onAddNotification} />
                </div>
            </main>
        </div>
    );
};

// --- WEB PORTAL COMPONENTS (REBUILT) ---
type WebPortalView = 
  | 'teacher_dashboard' | 'teacher_classes' | 'teacher_assignments' | 'teacher_reports' | 'teacher_communication'
  | 'admin_dashboard' | 'admin_users' | 'admin_academics' | 'admin_announcements' | 'admin_settings';

const SideNavbar: React.FC<{ role: Role, activeView: WebPortalView, onNavigate: (view: WebPortalView) => void }> = ({ role, activeView, onNavigate }) => {
    const getNavItems = () => {
        if (role === 'Teacher') {
            return [
                { id: 'teacher_dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'teacher_classes', label: 'My Classes', icon: '🧑‍🏫' },
                { id: 'teacher_assignments', label: 'Assignments', icon: '📝' },
                { id: 'teacher_reports', label: 'Report Card Studio', icon: '✍️' },
                { id: 'teacher_communication', label: 'Communication', icon: '💬' },
            ] as const;
        }
        if (role === 'Administrator') {
            return [
                { id: 'admin_dashboard', label: 'School Dashboard', icon: '📈' },
                { id: 'admin_users', label: 'User Management', icon: '👥' },
                { id: 'admin_academics', label: 'Academics', icon: '📚' },
                { id: 'admin_announcements', label: 'Announcements', icon: '📢' },
                { id: 'admin_settings', label: 'School Settings', icon: '⚙️' },
            ] as const;
        }
        return [];
    }

    return (
        <nav className="side-navbar">
            <div className="portal-logo">
                <ClassBridgeLogo size={32}/>
                <span>ClassBridge</span>
            </div>
            <ul>
                {getNavItems().map(item => (
                    <li key={item.id}>
                        <button 
                            className={`nav-link ${activeView === item.id ? 'active' : ''}`}
                            onClick={() => onNavigate(item.id)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

// --- START: NEW PORTAL PAGE COMPONENTS ---
interface CSVProcessResult {
    added: number;
    updated: number;
    errors: string[];
}

const CSVUploadResultModal: React.FC<{ result: CSVProcessResult, onClose: () => void }> = ({ result, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content csv-result-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3>CSV Processing Complete</h3>
                <button onClick={onClose} className="modal-close-button" aria-label="Close">&times;</button>
            </div>
            <div className="modal-body">
                <h4>Summary</h4>
                <p><strong>Users Added:</strong> {result.added}</p>
                <p><strong>Users Updated:</strong> {result.updated}</p>
                <p><strong>Errors Found:</strong> {result.errors.length}</p>
                
                {result.errors.length > 0 && (
                    <div className="error-details">
                        <h4>Error Details</h4>
                        <ul>
                            {result.errors.map((error, index) => <li key={index}>{error}</li>)}
                        </ul>
                    </div>
                )}
                <button onClick={onClose} className="form-button" style={{width: '100%', marginTop: '1.5rem'}}>Close</button>
            </div>
        </div>
    </div>
);


const AdminPortalDashboard: React.FC<{ allUsers: User[], allChildren: Child[] }> = ({ allUsers, allChildren }) => {
    const totalStudents = allChildren.length;
    const totalTeachers = allUsers.filter(u => u.role === 'Teacher').length;
    const totalParents = allUsers.filter(u => u.role === 'Parent').length;

    return (
        <div className="portal-page">
            <h2>School Dashboard</h2>
            <div className="portal-dashboard-grid">
                <div className="dashboard-card">
                    <h3>Total Students</h3>
                    <p className="dashboard-card-metric">{totalStudents}</p>
                </div>
                <div className="dashboard-card">
                    <h3>Total Teachers</h3>
                    <p className="dashboard-card-metric">{totalTeachers}</p>
                </div>
                <div className="dashboard-card">
                    <h3>Total Parents</h3>
                    <p className="dashboard-card-metric">{totalParents}</p>
                </div>
                <div className="dashboard-card">
                    <h3>Overall Attendance</h3>
                    <p className="dashboard-card-metric">96.5%</p>
                </div>
            </div>
            <p className="portal-page-description">An overview of school-wide analytics and key performance indicators.</p>
        </div>
    );
};

const AdminPortalUserManagement: React.FC<{
    school: SchoolConfig,
    onUpdateAllUsers: (registry: Record<string, Omit<UserRegistryEntry, 'email'>>, users: User[]) => void
}> = ({ school, onUpdateAllUsers }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<Role | 'All'>('All');
    const [uploadResult, setUploadResult] = useState<CSVProcessResult | null>(null);

    const combinedUsers = Object.values(completeUserRegistry).flat().map(reg => {
        const user = mockUsers.find(u => u.id === reg.userId);
        return { ...user, ...reg };
    });

    const filteredUsers = combinedUsers.filter(user => {
        if (user.schoolId !== school.id) return false;
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });
    
    const handleDownloadTemplate = () => {
        const header = "email,fullName,role,grade,childEmail,teacherName\n";
        const examples = [
            "student.new@example.com,Eva Green,Student,Grade 4,,Ms. Davis",
            "parent.new@gmail.com,Frank Green,Parent,,,student.new@example.com",
            "teacher.new@myschool.edu,Grace Hall,Teacher,Grade 4;Grade 5,,"
        ].join('\n');
        const csvContent = header + examples;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "user_template.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            processCSV(text);
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    };

    const processCSV = (csvText: string) => {
        const result: CSVProcessResult = { added: 0, updated: 0, errors: [] };
        
        // This is a simplified mock update. A real app would have a more robust backend process.
        // Let's create copies to modify
        const newRegistry = { ...mockUserRegistry };
        const newAllUsers = [...mockUsers];

        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        const headers = lines[0].split(',').map(h => h.trim());
        
        for (let i = 1; i < lines.length; i++) {
            const data = lines[i].split(',').map(d => d.trim());
            const row = Object.fromEntries(headers.map((key, index) => [key, data[index]]));
            
            const { email, fullName, role } = row;

            if (!email || !fullName || !role) {
                result.errors.push(`Row ${i + 1}: Missing required fields (email, fullName, role).`);
                continue;
            }

            const existingUser = newRegistry[email.toLowerCase()];
            if (existingUser) {
                // Update logic
                result.updated++;
                // In a real app, update name, grade, etc.
            } else {
                // Add new user logic
                result.added++;
                const newUserId = Math.floor(Math.random() * 10000) + 1000; // Mock ID
                newRegistry[email.toLowerCase()] = { userId: newUserId, role: role as Role, schoolId: school.id };
                const newUser: User = { id: newUserId, name: fullName, role: role as Role };
                newAllUsers.push(newUser);
            }
        }

        // Here you would call the prop to update the global state
        // For this demo, we'll just show the result
        setUploadResult(result);
        
        // In a real scenario, you'd call:
        // onUpdateAllUsers(newRegistry, newAllUsers);
    };


    return (
        <div className="portal-page">
            <h2>User Management</h2>
            <p className="portal-page-description">Manage all student, parent, and teacher accounts with powerful search and filtering capabilities.</p>
            
            <div className="portal-section bulk-management">
                <h3>Bulk User Management</h3>
                <p>Download the template, fill in user details, and upload the CSV file to add or update users in bulk.</p>
                <div className="bulk-management-actions">
                    <button onClick={handleDownloadTemplate} className="form-button secondary">Download Template (.csv)</button>
                    <label htmlFor="csv-upload" className="form-button">
                        Upload CSV
                    </label>
                    <input type="file" id="csv-upload" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }}/>
                </div>
            </div>

            <div className="user-management-controls">
                <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as Role | 'All')}>
                    <option value="All">All Roles</option>
                    <option value="Student">Students</option>
                    <option value="Parent">Parents</option>
                    <option value="Teacher">Teachers</option>
                    <option value="Administrator">Administrators</option>
                </select>
            </div>
            <div className="portal-table-container">
                <table className="portal-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.userId}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td><span className={`role-badge role-${user.role?.toLowerCase()}`}>{user.role}</span></td>
                                <td className="table-actions">
                                    <button onClick={() => alert(`Editing ${user.name}...`)}>Edit</button>
                                    <button onClick={() => alert(`Deleting ${user.name}...`)} className="delete">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {uploadResult && <CSVUploadResultModal result={uploadResult} onClose={() => setUploadResult(null)} />}
        </div>
    );
};


const TeacherPortalClasses: React.FC<{
    teacher: Teacher;
    school: SchoolConfig;
    allChildren: Child[];
    onUpdateChild: (child: Child) => void;
    onAddReportCard: (rc: ReportCard) => void;
}> = ({ teacher, school, allChildren, onUpdateChild, onAddReportCard }) => {
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Child | null>(null);

    const isSecondary = school.schoolType === 'Secondary';
    const classes = isSecondary ? (teacher.teachesGrades || []) : Array.from(new Set(allChildren.filter(c => c.teacher === teacher.name).map(c => c.grade)));
    
    const studentsInSelectedGrade = allChildren.filter(child => child.grade === selectedGrade && (isSecondary || child.teacher === teacher.name));

    useEffect(() => {
        if (classes.length > 0 && !selectedGrade) {
            setSelectedGrade(classes[0]);
        }
    }, [classes, selectedGrade]);
    
    useEffect(() => {
        setSelectedStudent(null);
    }, [selectedGrade]);

    return (
        <div className="portal-page two-pane-layout">
            <div className="pane-left">
                <h3>My Classes</h3>
                <ul className="portal-list">
                    {classes.map(grade => (
                        <li key={grade} className={selectedGrade === grade ? 'active' : ''} onClick={() => setSelectedGrade(grade)}>
                            {grade}
                        </li>
                    ))}
                </ul>
                <h3>Students</h3>
                {selectedGrade && (
                     <ul className="portal-list">
                        {studentsInSelectedGrade.map(student => (
                            <li key={student.id} className={selectedStudent?.id === student.id ? 'active' : ''} onClick={() => setSelectedStudent(student)}>
                                {student.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="pane-right">
                {selectedStudent ? (
                    <StudentEditorView 
                        child={selectedStudent} 
                        onUpdateChild={onUpdateChild} 
                        onAddReportCard={onAddReportCard}
                    />
                ) : (
                    <div className="placeholder-content">
                        <h3>Select a student to manage their details.</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- END: NEW PORTAL PAGE COMPONENTS ---


const WebPortalContent: React.FC<{ 
    activeView: WebPortalView; 
    user: User;
    school: SchoolConfig;
    appState: AppState;
    allChildren: Child[];
    assignments: Assignment[];
    onAddNotification: (title: string, message: string, recipient: Role | 'All') => void;
    onUpdateChildren: (children: Child[]) => void;
    onAddReportCard: (reportCard: ReportCard) => void;
}> = ({ activeView, user, school, appState, allChildren, assignments, onAddNotification, onUpdateChildren, onAddReportCard }) => {
    const renderContent = () => {
        switch (activeView) {
            // Teacher Views
            case 'teacher_dashboard': return <div className="portal-page"><h2>Teacher Dashboard</h2><p className="portal-page-description">Welcome, {user.name}!</p></div>;
            case 'teacher_classes': return <TeacherPortalClasses teacher={user as Teacher} school={appState.school!} allChildren={allChildren} onUpdateChild={(child) => onUpdateChildren(allChildren.map(c => c.id === child.id ? child : c))} onAddReportCard={onAddReportCard} />;
            case 'teacher_assignments': return <div className="portal-page"><h2>Assignments</h2></div>;
            case 'teacher_reports': return <div className="portal-page"><h2>Report Card Studio</h2></div>;
            case 'teacher_communication': return <div className="portal-page"><h2>Communication</h2></div>;

            // Admin Views
            case 'admin_dashboard': return <AdminPortalDashboard allUsers={appState.allUsers} allChildren={allChildren} />;
            case 'admin_users': return <AdminPortalUserManagement school={school} onUpdateAllUsers={() => { /* Mock handler */ }} />;
            case 'admin_academics': return <div className="portal-page"><h2>Academics</h2></div>;
            case 'admin_announcements': return <div className="portal-page"><h2>Announcements</h2><div className="portal-form-container"><AdminAnnouncements onAddNotification={onAddNotification}/></div></div>;
            case 'admin_settings': return <div className="portal-page"><h2>School Settings</h2></div>;
            default: return null;
        }
    };
    return <>{renderContent()}</>;
};

const WebPortal: React.FC<{ 
    user: User; 
    school: SchoolConfig;
    appState: AppState;
    onExitPortal: () => void;
    onAddNotification: (title: string, message: string, recipient: Role | 'All') => void;
    onUpdateChildren: (children: Child[]) => void;
    onAddReportCard: (reportCard: ReportCard) => void;
}> = ({ user, school, appState, onExitPortal, onAddNotification, onUpdateChildren, onAddReportCard }) => {
    
    const initialView: WebPortalView = user.role === 'Teacher' ? 'teacher_dashboard' : 'admin_dashboard';
    const [activeView, setActiveView] = useState<WebPortalView>(initialView);

    return (
        <div className="web-portal-container">
            <SideNavbar role={user.role} activeView={activeView} onNavigate={setActiveView} />
            <div className="portal-main-content">
                <header className="portal-header">
                     <h2>{school.name} Portal</h2>
                     <div className="header-actions">
                        <span>Welcome, {user.name} ({user.role})</span>
                        <button onClick={onExitPortal} className="form-button">Exit Portal</button>
                    </div>
                </header>
                <main className="portal-content-area">
                   <WebPortalContent 
                     activeView={activeView} 
                     user={user}
                     school={school}
                     appState={appState}
                     allChildren={appState.allChildren}
                     assignments={appState.assignments}
                     onAddNotification={onAddNotification}
                     onUpdateChildren={onUpdateChildren}
                     onAddReportCard={onAddReportCard}
                    />
                </main>
            </div>
        </div>
    )
};


// --- MAIN APP COMPONENT ---
interface AppState {
    loggedInUser: User | null;
    loggedInAsRole: Role | null;
    school: SchoolConfig | null;
    userAffiliations: UserRegistryEntry[] | null;
    allChildren: Child[];
    allUsers: User[];
    notifications: Notification[];
    reportCards: ReportCard[];
    tuitionInvoices: TuitionInvoice[];
    assignments: Assignment[];
    viewingPortal: boolean;
}

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>({
        loggedInUser: null,
        loggedInAsRole: null,
        school: null,
        userAffiliations: null,
        allChildren: mockInitialChildren,
        allUsers: mockUsers,
        notifications: mockNotifications,
        reportCards: mockReportCards,
        tuitionInvoices: mockTuitionData,
        assignments: mockAssignments,
        viewingPortal: false,
    });
    
    // This effect dynamically sets the CSS variable for the primary color
    // when the logged-in user's school changes.
    useEffect(() => {
        const root = document.documentElement;
        if (appState.school) {
            root.style.setProperty('--primary-color', appState.school.primaryColor);
        } else {
            root.style.setProperty('--primary-color', '#4A90E2'); // Default color
        }
    }, [appState.school]);


    const handleLogin = (user: User, school: SchoolConfig, role: Role, allAffiliations: UserRegistryEntry[]) => {
        const userNotifications = mockNotifications.filter(n => {
            return n.recipientRole === 'All' || n.recipientRole === role;
        });

        setAppState(prev => ({ 
            ...prev,
            loggedInUser: user,
            loggedInAsRole: role,
            school: school,
            userAffiliations: allAffiliations,
            notifications: userNotifications,
        }));
    };
    
    const handleSwitchSchool = (schoolId: string) => {
        if (!appState.userAffiliations) return;

        const newAffiliation = appState.userAffiliations.find(aff => aff.schoolId === schoolId);
        if (newAffiliation) {
            const user = mockUsers.find(u => u.id === newAffiliation.userId);
            const school = schoolConfigs[newAffiliation.schoolId];
            if (user && school) {
                // Re-run the login logic for the new school context
                handleLogin(user, school, newAffiliation.role, appState.userAffiliations);
            }
        }
    };

    const handleLogout = () => {
        setAppState(prev => ({
            ...prev,
            loggedInUser: null,
            loggedInAsRole: null,
            school: null,
            userAffiliations: null,
            viewingPortal: false, // Exit portal on logout
        }));
    };

    const handleUpdateNotifications = (updatedNotifications: Notification[]) => {
        setAppState(prev => ({ ...prev, notifications: updatedNotifications }));
    };

    const handleAddNotification = (title: string, message: string, recipient: Role | 'All') => {
        const newNotification: Notification = {
            id: Date.now(),
            title,
            message,
            timestamp: new Date(),
            read: false,
            recipientRole: recipient,
        };
        // This is a mock; in a real app, this would be sent to a server
        // and pushed to relevant users. Here, we'll just add it to the global list.
        mockNotifications.unshift(newNotification); 
        alert('Announcement sent!');
    };
    
    const handleUpdateChildren = (updatedChildren: Child[]) => {
        setAppState(prev => ({ ...prev, allChildren: updatedChildren }));
    };
    
    const handleAddReportCard = (newReportCard: ReportCard) => {
        setAppState(prev => ({ ...prev, reportCards: [...prev.reportCards, newReportCard] }));
        // Also add a notification for the parent
        const student = appState.allChildren.find(c => c.id === newReportCard.studentId);
        if (student) {
            const newNotification: Notification = {
                id: Date.now(),
                title: 'New Report Card Published',
                message: `${student.name}'s report card for ${newReportCard.term} is now available.`,
                timestamp: new Date(),
                read: false,
                // In a real app, you'd target the specific parent. Here we simulate it.
                recipientRole: 'Parent', 
            };
             mockNotifications.unshift(newNotification);
        }
    };

    const handleAddAssignment = (newAssignment: Omit<Assignment, 'id'>) => {
        const fullAssignment = { ...newAssignment, id: Date.now() };
        setAppState(prev => ({ ...prev, assignments: [fullAssignment, ...prev.assignments] }));
    };

    const handleUpdateTuition = (paidInvoiceId: number) => {
        setAppState(prev => ({
            ...prev,
            tuitionInvoices: prev.tuitionInvoices.map(inv => 
                inv.id === paidInvoiceId 
                ? { ...inv, status: 'Paid', paidDate: new Date().toISOString().split('T')[0] } 
                : inv
            )
        }));
    };

    const { loggedInUser, loggedInAsRole, school, userAffiliations, allChildren, notifications, reportCards, tuitionInvoices, viewingPortal } = appState;
    
    if (viewingPortal && loggedInUser && school && (loggedInAsRole === 'Teacher' || loggedInAsRole === 'Administrator')) {
        return (
            <div className="container portal-active">
                <WebPortal 
                    user={loggedInUser} 
                    school={school}
                    appState={appState}
                    onExitPortal={() => setAppState(prev => ({ ...prev, viewingPortal: false }))}
                    onAddNotification={handleAddNotification}
                    onUpdateChildren={handleUpdateChildren}
                    onAddReportCard={handleAddReportCard}
                />
            </div>
        );
    }

    return (
        <div className="container">
            {!loggedInUser && (
                <header className="app-header">
                    <h1>
                      <SchoolLogo logoUrl={school?.logoUrl} schoolName={school?.name} />
                      <span>{school?.name || 'ClassBridge'}</span>
                    </h1>
                </header>
            )}
            <main className={!loggedInUser ? "full-height-main" : ""}>
                 {!loggedInUser ? (
                    <div className="login-page-layout">
                        <p className="tagline">Connecting your school community.</p>
                        <MagicLinkLogin onLogin={handleLogin} />
                    </div>
                ) : (
                    <>
                        {loggedInAsRole === 'Parent' && <ParentDashboard parent={loggedInUser as Parent} school={school!} userAffiliations={userAffiliations!} allChildren={allChildren} notifications={notifications} reportCards={reportCards} tuitionInvoices={tuitionInvoices} onUpdateNotifications={handleUpdateNotifications} onUpdateTuition={handleUpdateTuition} onSwitchSchool={handleSwitchSchool} onLogout={handleLogout} />}
                        {loggedInAsRole === 'Teacher' && <TeacherDashboard teacher={loggedInUser as Teacher} school={school!} userAffiliations={userAffiliations!} allChildren={allChildren} assignments={appState.assignments} notifications={notifications} onUpdateNotifications={handleUpdateNotifications} onUpdateChildren={handleUpdateChildren} onAddReportCard={handleAddReportCard} onAddAssignment={handleAddAssignment} onSwitchSchool={handleSwitchSchool} onEnterPortal={() => setAppState(prev => ({...prev, viewingPortal: true}))} onLogout={handleLogout} />}
                        {loggedInAsRole === 'Student' && <StudentDashboard student={loggedInUser as Child} school={school!} userAffiliations={userAffiliations!} reportCards={reportCards} notifications={notifications} onUpdateNotifications={handleUpdateNotifications} onSwitchSchool={handleSwitchSchool} onLogout={handleLogout} />}
                        {loggedInAsRole === 'Administrator' && <AdminDashboardMobile admin={loggedInUser} school={school!} userAffiliations={userAffiliations!} onAddNotification={handleAddNotification} onSwitchSchool={handleSwitchSchool} onLogout={handleLogout} onEnterPortal={() => setAppState(prev => ({...prev, viewingPortal: true}))} />}
                    </>
                )}
            </main>
            {!loggedInUser && <footer>&copy; {new Date().getFullYear()} ClassBridge. All rights reserved.</footer>}
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);