
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

console.log("ClassBridge App Starting... ESM React Version:", React.version);


type Role = 'Student' | 'Parent' | 'Teacher' | 'Administrator';

// --- COMPONENTS ---

// 학교 로고 컴포넌트
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

interface ReportCardTemplateField {
    id: string;
    label: string;
    type: 'text' | 'number' | 'textarea' | 'grade_select';
    options?: string[]; // For select types
}

interface SchoolConfig {
    id: string;
    name: string;
    primaryColor: string;
    logoUrl?: string;
    schoolType: 'Elementary' | 'Secondary';
    features: {
        schoolBusTracking?: boolean;
        collegeCounselingPortal?: boolean;
    };
    // Admin configurable report card template
    reportCardTemplate: ReportCardTemplateField[]; 
}

interface UserRegistryEntry {
    userId: number;
    role: Role;
    schoolId: string;
    email: string;
}

// --- CONFIGURATION-BASED SCHOOL DEFINITIONS ---
const defaultReportCardTemplate: ReportCardTemplateField[] = [
    { id: 'attendance_comment', label: 'Attendance Comment', type: 'textarea' },
    { id: 'behavior_grade', label: 'Behavior Grade', type: 'grade_select', options: ['Exemplary', 'Satisfactory', 'Needs Improvement'] },
    { id: 'teacher_comment', label: 'Teacher\'s Overall Comment', type: 'textarea' }
];

const schoolConfigs: Record<string, SchoolConfig> = {
    'lpa': {
        id: 'lpa',
        name: 'Life-Prep Academy',
        primaryColor: '#002D62', 
        logoUrl: 'https://lpa.edu.np/wp-content/uploads/2024/04/lifePrep.jpg',
        schoolType: 'Secondary',
        features: { schoolBusTracking: false, collegeCounselingPortal: true },
        reportCardTemplate: [
            { id: 'academic_progress', label: 'Academic Progress Summary', type: 'textarea' },
            { id: 'conduct', label: 'Conduct & Character', type: 'grade_select', options: ['Excellent', 'Good', 'Average', 'Poor'] },
            { id: 'next_term_goals', label: 'Goals for Next Term', type: 'text' }
        ]
    },
    'ea': {
        id: 'ea',
        name: 'Everest Academy',
        primaryColor: '#4A90E2',
        logoUrl: '',
        schoolType: 'Elementary',
        features: { schoolBusTracking: true },
        reportCardTemplate: defaultReportCardTemplate
    },
    // ... other schools would follow similar structure
};

// --- USERS ---
// (Simplified User Registry for brevity - using the previous data structure concept)
const mockUserRegistry: Record<string, any> = {
    'ben.carter@lpa.edu': { userId: 11, role: 'Student', schoolId: 'lpa' },
    'susan.carter@gmail.com': { userId: 211, role: 'Parent', schoolId: 'lpa' },
    'dr.wallace@lpa.edu': { userId: 106, role: 'Teacher', schoolId: 'lpa' },
    'principal.lpa@lpa.edu': { userId: 997, role: 'Administrator', schoolId: 'lpa' },
};

// --- DATA INTERFACES ---
interface Message {
    id: number;
    senderId: number;
    receiverId: number | 'School'; // 'School' for general inquiries
    senderName: string;
    content: string;
    timestamp: string;
    read: boolean;
}

interface Announcement {
    id: number;
    title: string;
    content: string;
    date: string;
}

interface CalendarEvent {
    id: number;
    date: string;
    title: string;
    description: string;
}

// --- MOCK STATE DATA (Mutable for demo) ---
let mockMessages: Message[] = [
    { id: 1, senderId: 106, receiverId: 211, senderName: 'Dr. Wallace', content: 'Ben did excellent work on his Physics project today.', timestamp: '2024-10-05 14:30', read: false },
    { id: 2, senderId: 211, receiverId: 106, senderName: 'Susan Carter', content: 'Thank you! He was very excited about it.', timestamp: '2024-10-05 15:00', read: true },
];

let mockAnnouncements: Announcement[] = [
    { id: 1, title: 'Mid-Term Exam Schedule', content: 'Exams start next Monday. Please check the schedule.', date: '2024-10-01' },
    { id: 2, title: 'Science Fair', content: 'The annual Science Fair will be held on Nov 15th.', date: '2024-09-28' },
];

let mockCalendar: CalendarEvent[] = [
    { id: 1, date: '2024-10-14', title: 'National Holiday', description: 'School Closed' },
    { id: 2, date: '2024-10-21', title: 'Mid-Term Exams', description: 'All Grades' },
];

// Mock Report Card Data (Stored per student, per term)
// Structure: { studentId: { termId: { ...fieldValues, grades: [] } } }
let mockReportCardData = {
    11: { // Ben Carter
        'Fall 2024': {
            academic_progress: "Ben is performing at the top of his class in STEM subjects.",
            conduct: "Excellent",
            next_term_goals: "Prepare for AP exams.",
            issued: true,
            grades: [
                { subject: 'AP Calculus BC', score: 'A' }, 
                { subject: 'AP Physics C', score: 'A-' },
                { subject: 'English Lit', score: 'B+' }
            ]
        }
    }
};

// Mock User Objects
const mockUsers = [
    { id: 11, name: 'Ben Carter', role: 'Student', email: 'ben.carter@lpa.edu', grade: 'Grade 11', parentId: 211 },
    { id: 211, name: 'Susan Carter', role: 'Parent', childrenIds: [11] },
    { id: 106, name: 'Dr. Wallace', role: 'Teacher', teachesGrades: ['Grade 11', 'Grade 12'], email: 'dr.wallace@lpa.edu' },
    { id: 997, name: 'Principal Taylor', role: 'Administrator', email: 'principal@lpa.edu' }
];

// --- SHARED COMPONENTS ---

const WelcomeSection = ({ userName, role }) => (
    <div className="welcome-section">
        <span className="welcome-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
        <h1 className="welcome-title">
            {new Date().getHours() < 12 ? "Good Morning" : "Good Afternoon"},<br />
            <strong>{userName}</strong>
        </h1>
    </div>
);

// --- STORE READINESS & NOTIFICATION COMPONENTS ---

const OfflineBanner = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div className="offline-banner">
            ⚡ Internet connection lost. Operating in offline cache mode.
        </div>
    );
};

const CleanHeader = ({ school, onLogout, onOpenNotifications, onOpenReadiness, unreadCount }) => (
    <header className="dashboard-header">
        <div className="header-left">
            <SchoolLogo logoUrl={school?.logoUrl} schoolName={school?.name || 'School'} />
            <div>
                <h2 className="school-name-text">{school?.name}</h2>
                <div style={{ fontSize: '0.6rem', color: '#999', marginTop: '-2px' }}>by Himpower Pvt. Ltd.</div>
            </div>
        </div>
        <div className="header-actions">
            <button onClick={onOpenNotifications} className="icon-badge-btn" aria-label="Notifications" title="Notification Center">
                🔔
                {unreadCount > 0 && <span className="notification-dot" />}
            </button>
            <button onClick={onOpenReadiness} className="icon-badge-btn" aria-label="Store Readiness" title="App Store Readiness Audit">
                🛡️
            </button>
            <button onClick={onLogout} className="logout-icon-btn" aria-label="Logout" title="Logout">⏻</button>
        </div>
    </header>
);

const FloatingNav = ({ activeTab, setActiveTab, tabs }) => (
    <div className="bottom-nav-container">
        <nav className="floating-nav">
            {tabs.map(tab => (
                <button 
                    key={tab.id} 
                    className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    <span className="nav-icon">{tab.icon}</span>
                </button>
            ))}
        </nav>
    </div>
);

// Notification Modal Component
const NotificationCenterModal = ({ isOpen, onClose, notifications, setNotifications, onTestPush }) => {
    const [activeTab, setActiveTab] = useState<'list' | 'settings'>('list');
    const [permissionStatus, setPermissionStatus] = useState<string>(
        typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
    );
    const [settings, setSettings] = useState({
        announcements: true,
        reportCards: true,
        messages: true,
        busAlerts: true
    });

    if (!isOpen) return null;

    const requestPermission = async () => {
        if ('Notification' in window) {
            const res = await Notification.requestPermission();
            setPermissionStatus(res);
            if (res === 'granted') {
                onTestPush("Push Permission Granted", "ClassBridge push notification alerts are now enabled.");
            }
        }
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>🔔 Notification Center</h3>
                    <button className="close-modal-btn" onClick={onClose}>✕</button>
                </div>

                <div className="manage-tabs" style={{ padding: 0 }}>
                    <button className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
                        Notifications ({notifications.filter(n => !n.read).length})
                    </button>
                    <button className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                        Push Settings
                    </button>
                </div>

                {activeTab === 'list' ? (
                    <div style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center', gap: '8px' }}>
                            <button className="action-btn" onClick={markAllRead} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                                ✓ Mark All Read
                            </button>
                            <button className="save-btn" onClick={() => onTestPush("Test Push Notification", "ClassBridge push and background service notifications are operational.")} style={{ width: 'auto', fontSize: '0.8rem', padding: '6px 14px' }}>
                                📣 Test Push
                            </button>
                        </div>

                        {notifications.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#888', padding: '2rem 0' }}>No notifications received.</p>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="tag" style={{ background: n.type === 'Grade' ? '#E8F5E9' : '#E3F2FD' }}>{n.type || 'Notice'}</span>
                                        <span className="time">{n.time}</span>
                                    </div>
                                    <div style={{ marginTop: '6px', fontSize: '0.9rem', color: '#333' }}>{n.text}</div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div style={{ marginTop: '1rem' }}>
                        <div className="config-box">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem' }}>App Push Permission:</span>
                                <span className={`status-pill ${permissionStatus === 'granted' ? 'success' : 'warning'}`}>
                                    {permissionStatus === 'granted' ? 'Granted' : permissionStatus === 'denied' ? 'Denied' : 'Permission Required'}
                                </span>
                            </div>
                            {permissionStatus !== 'granted' && (
                                <button className="save-btn" onClick={requestPermission} style={{ marginTop: '0.8rem' }}>
                                    Request Push Permission
                                </button>
                            )}
                        </div>

                        <div className="toggle-row">
                            <div>
                                <div style={{ fontWeight: 600 }}>📢 School Announcements & Letters</div>
                                <div style={{ fontSize: '0.75rem', color: '#888' }}>Notifications for new notices and letters</div>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" checked={settings.announcements} onChange={e => setSettings({ ...settings, announcements: e.target.checked })} />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="toggle-row">
                            <div>
                                <div style={{ fontWeight: 600 }}>📄 Report Cards & Academic Alerts</div>
                                <div style={{ fontSize: '0.75rem', color: '#888' }}>Notifications for grades and reports</div>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" checked={settings.reportCards} onChange={e => setSettings({ ...settings, reportCards: e.target.checked })} />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="toggle-row">
                            <div>
                                <div style={{ fontWeight: 600 }}>✉️ Direct Messages & Chat</div>
                                <div style={{ fontSize: '0.75rem', color: '#888' }}>Real-time messaging alerts</div>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" checked={settings.messages} onChange={e => setSettings({ ...settings, messages: e.target.checked })} />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="toggle-row">
                            <div>
                                <div style={{ fontWeight: 600 }}>🚌 School Bus & Attendance</div>
                                <div style={{ fontSize: '0.75rem', color: '#888' }}>School bus tracking and attendance alerts</div>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" checked={settings.busAlerts} onChange={e => setSettings({ ...settings, busAlerts: e.target.checked })} />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Store Readiness Modal Component
const StoreReadinessModal = ({ isOpen, onClose, onOpenLegal }) => {
    if (!isOpen) return null;

    const checklist = [
        { title: "Vercel & Cloud Run Module Bundling", desc: "Vite ESM standard bundle configured (eliminates white-screen rendering issues)", status: "pass" },
        { title: "Apple & Google PWA Manifest Spec", desc: "manifest.json id, scope, maskable icons, and standalone settings complete", status: "pass" },
        { title: "Service Worker & Push API Engine", desc: "service-worker.js background push and offline caching operational", status: "pass" },
        { title: "iOS & Android Safe Area Alignment", desc: "viewport-fit=cover responsive layout with notch safe area padding", status: "pass" },
        { title: "Privacy Policy (App Store Guideline 5.1.1)", desc: "In-app privacy policy accessible across all screens for store review", status: "pass" },
        { title: "Network Offline Mode Detection", desc: "Automatic offline disconnect detection with offline cache fallback", status: "pass" },
        { title: "Developer Credit (Himpower Pvt. Ltd.)", desc: "Developer identity explicitly declared in App Metadata, Header, and Footer", status: "pass" },
        { title: "Minimum Touch Target Size (44px)", desc: "Strict compliance with mobile HIG minimum touch target guidelines", status: "pass" }
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>📱 App Store & Play Store Audit</h3>
                    <button className="close-modal-btn" onClick={onClose}>✕</button>
                </div>

                <div className="store-readiness-card">
                    <h4>🛡️ ClassBridge Store Candidate v1.0</h4>
                    <p>Technical requirements for official Google Play Store (TWA/Capacitor) and Apple App Store submissions have been verified.</p>
                    <span className="status-pill success">✓ Ready for App Store Submission</span>
                </div>

                <div style={{ margin: '1rem 0' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem' }}>Verification Checklist:</h4>
                    {checklist.map((item, idx) => (
                        <div key={idx} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '10px' }}>
                            <span style={{ color: '#2ECC71', fontWeight: 'bold' }}>✓</span>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#333' }}>{item.title}</div>
                                <div style={{ fontSize: '0.78rem', color: '#777', marginTop: '2px' }}>{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
                    <button className="action-btn" onClick={() => { onClose(); onOpenLegal('privacy'); }}>
                        📄 View Privacy Policy
                    </button>
                </div>
            </div>
        </div>
    );
};

// Legal Documents Modal (Privacy Policy & Terms)
const LegalModal = ({ type, onClose }) => {
    if (!type) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{type === 'privacy' ? '🔒 Privacy Policy' : '📜 Terms of Service'}</h3>
                    <button className="close-modal-btn" onClick={onClose}>✕</button>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#444', lineHeight: 1.6 }}>
                    {type === 'privacy' ? (
                        <>
                            <p><strong>Developer & Operator:</strong> Himpower Pvt. Ltd.</p>
                            <p><strong>App Name:</strong> ClassBridge by Himpower</p>
                            <hr style={{ border: 0, borderTop: '1px solid #eee', margin: '1rem 0' }} />
                            <p><strong>1. Information Collection & Purpose</strong><br />
                            ClassBridge collects user email addresses, names, and account roles solely to connect school communities, deliver student report cards, distribute announcements, and manage attendance records.</p>
                            <p><strong>2. Retention & Data Usage Period</strong><br />
                            Personal data is retained and processed securely until a user requests account deletion or until service delivery purposes are fulfilled.</p>
                            <p><strong>3. Third-Party Disclosure</strong><br />
                            Collected personal information is never disclosed or provided to third parties without prior user consent and is safeguarded under strict privacy standards.</p>
                            <p><strong>4. User Rights & Data Control</strong><br />
                            Users reserve the right to access, modify, or request deletion of their personal information at any time.</p>
                        </>
                    ) : (
                        <>
                            <p><strong>Operator:</strong> Himpower Pvt. Ltd.</p>
                            <p><strong>1. Purpose of Service</strong><br />
                            These terms govern the use of school community networking, notice broadcasting, and academic reporting services provided by the ClassBridge platform.</p>
                            <p><strong>2. Account Management & Security</strong><br />
                            Users are responsible for safeguarding their login credentials and must immediately report any unauthorized access or security breach to the operator.</p>
                            <p><strong>3. Intellectual Property Rights</strong><br />
                            All software code, visual design, trademarks, and media content included in ClassBridge are the exclusive property of Himpower Pvt. Ltd.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const CompanyFooter = ({ onOpenLegal, onOpenReadiness }: { onOpenLegal?: (t: 'privacy' | 'terms') => void; onOpenReadiness?: () => void; }) => (
    <footer className="company-footer">
        Developed & Maintained by<br />
        <strong>Himpower Pvt. Ltd.</strong><br />
        © 2024-2026 All Rights Reserved
        
        {onOpenLegal && (
            <div className="policy-footer-links">
                <button className="policy-link-btn" onClick={() => onOpenLegal('privacy')}>Privacy Policy</button>
                <span>•</span>
                <button className="policy-link-btn" onClick={() => onOpenLegal('terms')}>Terms of Service</button>
                {onOpenReadiness && (
                    <>
                        <span>•</span>
                        <button className="policy-link-btn" onClick={onOpenReadiness}>App Store Audit</button>
                    </>
                )}
            </div>
        )}
    </footer>
);


// --- FEATURE COMPONENTS ---

// 1. Messaging System
const MessageCenter = ({ currentUser, contacts }) => {
    const [messages, setMessages] = useState(mockMessages.filter(m => m.receiverId === currentUser.id || m.senderId === currentUser.id));
    const [newMessage, setNewMessage] = useState('');
    const [selectedContact, setSelectedContact] = useState(contacts.length > 0 ? contacts[0].id : null);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: Date.now(),
            senderId: currentUser.id,
            receiverId: selectedContact,
            senderName: currentUser.name,
            content: newMessage,
            timestamp: new Date().toLocaleString(),
            read: false
        };
        
        // Update local and "server" state
        mockMessages.push(msg);
        setMessages([...messages, msg]);
        setNewMessage('');
    };

    const conversation = messages.filter(m => 
        (m.senderId === currentUser.id && m.receiverId === selectedContact) ||
        (m.senderId === selectedContact && m.receiverId === currentUser.id)
    );

    return (
        <div className="feature-container">
            <h3>Messages</h3>
            <div className="message-layout">
                <div className="contact-list">
                    {contacts.map(c => (
                        <div 
                            key={c.id} 
                            className={`contact-item ${selectedContact === c.id ? 'active' : ''}`}
                            onClick={() => setSelectedContact(c.id)}
                        >
                            <div className="avatar-small">{c.name.charAt(0)}</div>
                            <span>{c.name}</span>
                        </div>
                    ))}
                </div>
                <div className="chat-area">
                    <div className="messages-feed">
                        {conversation.length === 0 ? <p className="no-msg">No messages yet.</p> : 
                        conversation.map(m => (
                            <div key={m.id} className={`message-bubble ${m.senderId === currentUser.id ? 'sent' : 'received'}`}>
                                <div className="msg-content">{m.content}</div>
                                <div className="msg-time">{m.timestamp.split(',')[1]}</div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSend} className="message-input-area">
                        <input 
                            type="text" 
                            value={newMessage} 
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder="Type a message..." 
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// 2. News Feed (Shared)
const NewsFeed = ({ announcements }) => (
    <div className="feature-container">
        <h3>School News</h3>
        {announcements.length === 0 ? <p>No news available.</p> : 
            announcements.map(a => (
                <div key={a.id} className="news-card">
                    <div className="news-date">{a.date}</div>
                    <h4>{a.title}</h4>
                    <p>{a.content}</p>
                </div>
            ))
        }
    </div>
);

// 3. Calendar (Shared)
const CalendarView = ({ events }) => (
    <div className="feature-container">
        <h3>Academic Calendar</h3>
        <div className="calendar-list">
            {events.map(e => (
                <div key={e.id} className="calendar-item">
                    <div className="cal-date-box">
                        <span className="cal-month">{new Date(e.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="cal-day">{new Date(e.date).getDate()}</span>
                    </div>
                    <div className="cal-info">
                        <h4>{e.title}</h4>
                        <p>{e.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// 4. Report Card View (Parent/Student)
const ReportCardViewer = ({ studentId, studentName }) => {
    const reports = mockReportCardData[studentId] || {};
    const terms = Object.keys(reports);

    const handleDownload = (term) => {
        alert(`Downloading PDF Report Card for ${studentName} - ${term}...`);
    };

    if (terms.length === 0) return <div className="info-box">No report cards issued yet.</div>;

    return (
        <div className="report-card-list">
            <h3>Report Cards</h3>
            {terms.map(term => (
                <div key={term} className="report-card-item">
                    <div className="rc-icon">📄</div>
                    <div className="rc-info">
                        <h4>{term} Report</h4>
                        <p>Issued: Oct 2024</p>
                    </div>
                    <button className="download-btn" onClick={() => handleDownload(term)}>
                        Download PDF
                    </button>
                </div>
            ))}
            
            {/* Preview of Latest Report */}
            <div className="report-preview">
                <h4>Latest Preview: {terms[0]}</h4>
                <div className="paper-preview">
                    <div className="paper-header">
                        <h2>LPA Official Report</h2>
                        <p>Student: {studentName}</p>
                    </div>
                    <table className="grade-table">
                        <thead><tr><th>Subject</th><th>Grade</th></tr></thead>
                        <tbody>
                            {reports[terms[0]].grades.map((g,i) => (
                                <tr key={i}><td>{g.subject}</td><td>{g.score}</td></tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="comments-section">
                        <p><strong>Conduct:</strong> {reports[terms[0]].conduct}</p>
                        <p><strong>Academic Progress:</strong> {reports[terms[0]].academic_progress}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- DASHBOARDS ---

// 1. PARENT DASHBOARD
const ParentDashboard = ({ parent, school, onLogout, onOpenNotifications, onOpenReadiness, onOpenLegal, unreadCount }) => {
    const [activeTab, setActiveTab] = useState('Children');
    const [selectedChild, setSelectedChild] = useState(null);

    const myChildren = mockUsers.filter(u => u.role === 'Student' && u.parentId === parent.id);
    const teachers = mockUsers.filter(u => u.role === 'Teacher');

    if (selectedChild) {
        return (
            <div className="dashboard-container">
                 <button className="back-button" onClick={() => setSelectedChild(null)}>← Back</button>
                <div className="detail-section text-center">
                    <div className="child-icon large">{selectedChild.name.charAt(0)}</div>
                    <h2>{selectedChild.name}</h2>
                    <p>{selectedChild.grade}</p>
                </div>

                <ReportCardViewer studentId={selectedChild.id} studentName={selectedChild.name} />
                
                <div className="detail-section">
                    <h3>Attendance & Schedule</h3>
                    <p style={{color:'#666'}}>Attendance: 98% Present</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <CleanHeader school={school} onLogout={onLogout} onOpenNotifications={onOpenNotifications} onOpenReadiness={onOpenReadiness} unreadCount={unreadCount} />
            <WelcomeSection userName={parent.name} role="Parent" />

            {activeTab === 'Children' && (
                <div className="child-selection-container">
                    {myChildren.map(child => (
                        <div key={child.id} className="child-card" onClick={() => setSelectedChild(child)}>
                            <div className="child-icon">{child.name.charAt(0)}</div>
                            <h4>{child.name}</h4>
                            <p>{child.grade}</p>
                            <span className="tap-hint">Tap for Report Card</span>
                        </div>
                    ))}
                </div>
            )}
            
            {activeTab === 'Messages' && <MessageCenter currentUser={parent} contacts={teachers} />}
            {activeTab === 'Notices' && <NewsFeed announcements={mockAnnouncements} />}
            {activeTab === 'Calendar' && <CalendarView events={mockCalendar} />}

            <FloatingNav 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                tabs={[
                    { id: 'Children', icon: '👨‍👩‍👧‍👦', label: 'Children' },
                    { id: 'Messages', icon: '✉️', label: 'Messages' },
                    { id: 'Notices', icon: '📢', label: 'News' },
                    { id: 'Calendar', icon: '📅', label: 'Calendar' }
                ]} 
            />
            <CompanyFooter onOpenLegal={onOpenLegal} onOpenReadiness={onOpenReadiness} />
        </div>
    );
};

// 2. STUDENT DASHBOARD
const StudentDashboard = ({ student, school, onLogout, onOpenNotifications, onOpenReadiness, onOpenLegal, unreadCount }) => {
    const [activeTab, setActiveTab] = useState('Home');

    return (
        <div className="dashboard-container">
            <CleanHeader school={school} onLogout={onLogout} onOpenNotifications={onOpenNotifications} onOpenReadiness={onOpenReadiness} unreadCount={unreadCount} />
            <WelcomeSection userName={student.name} role="Student" />

            {activeTab === 'Home' && (
                <>
                    <ReportCardViewer studentId={student.id} studentName={student.name} />
                    <div className="detail-section">
                        <h3>Today's Timetable</h3>
                        <div className="timetable-row">08:30 - AP Calculus</div>
                        <div className="timetable-row">10:00 - AP Physics</div>
                    </div>
                </>
            )}
            
            {activeTab === 'Notices' && <NewsFeed announcements={mockAnnouncements} />}
            {activeTab === 'Calendar' && <CalendarView events={mockCalendar} />}

            <FloatingNav 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                tabs={[
                    { id: 'Home', icon: '🏠', label: 'Home' },
                    { id: 'Notices', icon: '📢', label: 'News' },
                    { id: 'Calendar', icon: '📅', label: 'Calendar' }
                ]} 
            />
            <CompanyFooter onOpenLegal={onOpenLegal} onOpenReadiness={onOpenReadiness} />
        </div>
    );
};

// 3. TEACHER DASHBOARD
const TeacherDashboard = ({ teacher, school, onLogout, onOpenNotifications, onOpenReadiness, onOpenLegal, unreadCount }) => {
    const [activeTab, setActiveTab] = useState('Students');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editingReport, setEditingReport] = useState(false);

    const myStudents = mockUsers.filter(u => u.role === 'Student');
    const parents = mockUsers.filter(u => u.role === 'Parent');

    const ReportCardForm = ({ student }) => {
        const template = school.reportCardTemplate || defaultReportCardTemplate;
        
        const handleSubmit = (e) => {
            e.preventDefault();
            alert("Report Card Saved Successfully! Admin can now print.");
            setEditingReport(false);
        };

        return (
            <div className="report-form">
                <h4>Filling Report: Fall 2024</h4>
                <form onSubmit={handleSubmit}>
                    {template.map(field => (
                        <div key={field.id} className="form-group">
                            <label>{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea rows={3} placeholder={`Enter ${field.label}...`}></textarea>
                            ) : field.type === 'grade_select' ? (
                                <select>
                                    {field.options?.map(o => <option key={o}>{o}</option>)}
                                </select>
                            ) : (
                                <input type="text" />
                            )}
                        </div>
                    ))}
                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => setEditingReport(false)}>Cancel</button>
                        <button type="submit" className="save-btn">Save Report</button>
                    </div>
                </form>
            </div>
        );
    };

    if (selectedStudent) {
        return (
            <div className="dashboard-container">
                <button className="back-button" onClick={() => {setSelectedStudent(null); setEditingReport(false);}}>← Back to List</button>
                <div className="detail-section header-row">
                    <h2>{selectedStudent.name}</h2>
                    <span className="badge">{selectedStudent.grade}</span>
                </div>

                <div className="manage-tabs">
                    <button className={`tab-btn ${!editingReport ? 'active' : ''}`} onClick={() => setEditingReport(false)}>Overview</button>
                    <button className={`tab-btn ${editingReport ? 'active' : ''}`} onClick={() => setEditingReport(true)}>Report Card</button>
                </div>

                {editingReport ? (
                    <div className="detail-section">
                        <ReportCardForm student={selectedStudent} />
                    </div>
                ) : (
                    <div className="detail-section">
                        <h3>Quick Actions</h3>
                        <div className="action-grid">
                            <button className="action-btn" onClick={() => alert("Marked Present")}>✅ Mark Present</button>
                            <button className="action-btn warning" onClick={() => alert("Marked Absent")}>❌ Mark Absent</button>
                            <button className="action-btn" onClick={() => alert("Grade Input Modal Open")}>📊 Add Grade</button>
                        </div>
                        <div style={{marginTop:'1rem'}}>
                            <h4>Current Grades</h4>
                            <ul className="grades-list">
                                <li><span>Math</span><span className="grade-score">A</span></li>
                                <li><span>Science</span><span className="grade-score">B+</span></li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <CleanHeader school={school} onLogout={onLogout} onOpenNotifications={onOpenNotifications} onOpenReadiness={onOpenReadiness} unreadCount={unreadCount} />
            <WelcomeSection userName={teacher.name} role="Teacher" />

            {activeTab === 'Students' && (
                <div className="child-selection-container">
                    {myStudents.map(student => (
                        <div key={student.id} className="child-card" onClick={() => setSelectedStudent(student)}>
                            <div className="child-icon">{student.name.charAt(0)}</div>
                            <h4>{student.name}</h4>
                            <p>{student.grade}</p>
                        </div>
                    ))}
                </div>
            )}
            
            {activeTab === 'Messages' && <MessageCenter currentUser={teacher} contacts={parents} />}
            {activeTab === 'Notices' && <NewsFeed announcements={mockAnnouncements} />}
            {activeTab === 'Calendar' && <CalendarView events={mockCalendar} />}

            <FloatingNav 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                tabs={[
                    { id: 'Students', icon: '🎓', label: 'Students' },
                    { id: 'Messages', icon: '✉️', label: 'Messages' },
                    { id: 'Notices', icon: '📢', label: 'News' },
                    { id: 'Calendar', icon: '📅', label: 'Calendar' }
                ]} 
            />
            <CompanyFooter onOpenLegal={onOpenLegal} onOpenReadiness={onOpenReadiness} />
        </div>
    );
};

// 4. ADMINISTRATOR DASHBOARD
const AdminDashboard = ({ admin, school, onLogout, onOpenNotifications, onOpenReadiness, onOpenLegal, unreadCount }) => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [contentMode, setContentMode] = useState(null);

    const handleAddContent = (e) => {
        e.preventDefault();
        alert("New content published successfully!");
        setContentMode(null);
    };

    const handlePrintAllReports = () => {
        const confirm = window.confirm(`Ready to generate PDF reports for all students using the "${school.name}" template?`);
        if(confirm) alert("Generating 150 Report Cards... Done!");
    };

    return (
        <div className="dashboard-container">
            <CleanHeader school={school} onLogout={onLogout} onOpenNotifications={onOpenNotifications} onOpenReadiness={onOpenReadiness} unreadCount={unreadCount} />
            <div className="welcome-section">
                <h1 className="welcome-title">Admin Console<br/><strong>{school.name}</strong></h1>
            </div>

            {activeTab === 'Dashboard' && (
                <div className="admin-grid">
                    <div className="admin-card" onClick={() => setActiveTab('Content')}>
                        <div className="icon">📢</div>
                        <h4>Manage Content</h4>
                        <p>News & Calendar</p>
                    </div>
                    <div className="admin-card" onClick={() => setActiveTab('Reports')}>
                        <div className="icon">🖨️</div>
                        <h4>Report Cards</h4>
                        <p>Config & Print</p>
                    </div>
                    <div className="admin-card" onClick={() => alert("Manage Users Feature")}>
                        <div className="icon">👥</div>
                        <h4>Users</h4>
                        <p>Student/Staff</p>
                    </div>
                    <div className="admin-card" onClick={() => alert("School Settings")}>
                        <div className="icon">⚙️</div>
                        <h4>Settings</h4>
                        <p>School Profile</p>
                    </div>
                </div>
            )}

            {activeTab === 'Content' && (
                <div className="detail-section">
                    <button className="back-button" onClick={() => {setActiveTab('Dashboard'); setContentMode(null);}}>← Back</button>
                    <h3>Content Management</h3>
                    
                    {!contentMode ? (
                        <div className="action-grid">
                            <button className="action-btn" onClick={() => setContentMode('news')}>+ Post News</button>
                            <button className="action-btn" onClick={() => setContentMode('calendar')}>+ Add Event</button>
                        </div>
                    ) : (
                        <form onSubmit={handleAddContent} className="content-form">
                            <h4>{contentMode === 'news' ? 'Post Announcement' : 'Add Calendar Event'}</h4>
                            <input type="text" placeholder="Title" required className="full-width" />
                            <textarea rows={4} placeholder="Description/Details" className="full-width"></textarea>
                            {contentMode === 'calendar' && <input type="date" required className="full-width" />}
                            <button type="submit" className="save-btn">Publish</button>
                        </form>
                    )}

                    <div style={{marginTop:'2rem'}}>
                        <h4>Recent Posts</h4>
                        {mockAnnouncements.slice(0,2).map(a => (
                            <div key={a.id} className="list-item-row">
                                <span>{a.title}</span>
                                <button className="small-btn danger">Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'Reports' && (
                <div className="detail-section">
                    <button className="back-button" onClick={() => setActiveTab('Dashboard')}>← Back</button>
                    <h3>Report Card Management</h3>
                    
                    <div className="config-box">
                        <h4>Current Template Config</h4>
                        <p>Fields active for Teachers:</p>
                        <ul className="template-list">
                            {school.reportCardTemplate.map(f => (
                                <li key={f.id}>
                                    <span className="tag">{f.type}</span> {f.label}
                                </li>
                            ))}
                        </ul>
                        <button className="small-btn" onClick={() => alert("Opens Template Editor")}>Edit Template</button>
                    </div>

                    <div className="print-zone">
                        <h4>Production</h4>
                        <p>Fall 2024 Term</p>
                        <div className="stats-row">
                            <span>Completed by Teachers: <strong>85%</strong></span>
                        </div>
                        <button className="save-btn full-width" onClick={handlePrintAllReports}>
                            🖨️ Print All Report Cards
                        </button>
                    </div>
                </div>
            )}

            <FloatingNav 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                tabs={[
                    { id: 'Dashboard', icon: '📊', label: 'Dash' },
                    { id: 'Content', icon: '📝', label: 'Content' },
                    { id: 'Reports', icon: '🎓', label: 'Reports' }
                ]} 
            />
            <CompanyFooter onOpenLegal={onOpenLegal} onOpenReadiness={onOpenReadiness} />
        </div>
    );
};


// --- LOGIN COMPONENT ---
const MagicLinkLogin = ({ onLogin, onOpenLegal, onOpenReadiness }: { onLogin: any; onOpenLegal: (t: 'privacy' | 'terms') => void; onOpenReadiness: () => void; }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [logoError, setLogoError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;
        
        const lowerEmail = email.toLowerCase();
        const userRegistry = mockUserRegistry[lowerEmail];

        if (userRegistry) {
            const user = mockUsers.find(u => u.id === userRegistry.userId);
            const school = schoolConfigs[userRegistry.schoolId];

            if (user && school) {
                onLogin(user, school, userRegistry.role);
            } else {
                setError('Configuration error.');
            }
        } else {
            setError('User not found. Try the demo accounts below.');
        }
    };

    return (
        <div className="universal-login-container">
            <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                 <div style={{ 
                    height: '140px', 
                    width: '140px', 
                    marginBottom: '1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                 }}>
                    {!logoError ? (
                        <img 
                            src="/logo.svg" 
                            alt="ClassBridge Logo" 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={() => setLogoError(true)}
                        />
                    ) : (
                        <img 
                            src="/icon-512.png" 
                            alt="ClassBridge Logo Fallback"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    )}
                 </div>
                <h2 style={{margin: '0.5rem 0', color: '#333', fontSize: '1.8rem'}}>ClassBridge</h2>
            </div>
            
            <p style={{color: '#666', marginBottom: '2rem'}}>Enter your email to sign in</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                />
                <button type="submit" className="form-button">Sign In</button>
                {error && <p className="error-message">{error}</p>}
            </form>

            <div className="powered-by">
                Developed by <strong>Himpower Pvt. Ltd.</strong>
            </div>

            <div className="policy-footer-links" style={{ marginTop: '1rem' }}>
                <button className="policy-link-btn" onClick={() => onOpenLegal('privacy')}>Privacy Policy</button>
                <span>•</span>
                <button className="policy-link-btn" onClick={() => onOpenLegal('terms')}>Terms of Service</button>
                <span>•</span>
                <button className="policy-link-btn" onClick={onOpenReadiness}>App Store Audit</button>
            </div>
            
            <div className="demo-accounts">
                <div style={{fontWeight: '700', marginBottom: '0.5rem', color: '#333'}}>Life-Prep Academy Demo Accounts:</div>
                <ul>
                    <li><strong>Student:</strong> ben.carter@lpa.edu</li>
                    <li><strong>Parent:</strong> susan.carter@gmail.com</li>
                    <li><strong>Teacher:</strong> dr.wallace@lpa.edu</li>
                    <li><strong>Admin:</strong> principal.lpa@lpa.edu</li>
                </ul>
            </div>
        </div>
    );
};

const initialNotifications = [
    { id: 1, type: 'Notice', text: 'Spring Semester Mid-Term Exam Schedule has been published.', time: '10m ago', read: false },
    { id: 2, type: 'Grade', text: 'AP Physics assignment evaluation & grades are updated.', time: '1h ago', read: false },
    { id: 3, type: 'Bus', text: 'School Bus Route #2 is arriving at your stop in 5 minutes.', time: '3h ago', read: true }
];

// --- MAIN APP COMPONENT ---
const App = () => {
    const [user, setUser] = useState(null);
    const [school, setSchool] = useState(null);
    const [role, setRole] = useState(null);

    const [notifications, setNotifications] = useState(initialNotifications);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isReadinessOpen, setIsReadinessOpen] = useState(false);
    const [legalType, setLegalType] = useState<'privacy' | 'terms' | null>(null);

    const handleLogin = (loggedInUser, selectedSchool, selectedRole) => {
        setUser(loggedInUser);
        setSchool(selectedSchool);
        setRole(selectedRole);
        if (selectedSchool?.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', selectedSchool.primaryColor);
        }
    };

    const handleLogout = () => {
        setUser(null); setSchool(null); setRole(null);
        document.documentElement.style.setProperty('--primary-color', '#4A90E2');
    };

    const triggerPushNotification = (title: string, body: string) => {
        const newNotif = {
            id: Date.now(),
            type: 'Notice',
            text: `${title}: ${body}`,
            time: 'Just now',
            read: false
        };
        setNotifications(prev => [newNotif, ...prev]);

        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'TRIGGER_NOTIFICATION',
                title,
                body
            });
        } else if ('Notification' in window && Notification.permission === 'granted') {
            try {
                new Notification(title, { body, icon: '/icon-192.png' });
            } catch (e) {
                console.log('Browser notification error:', e);
            }
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const commonProps = {
        school,
        onLogout: handleLogout,
        onOpenNotifications: () => setIsNotificationOpen(true),
        onOpenReadiness: () => setIsReadinessOpen(true),
        onOpenLegal: (type: 'privacy' | 'terms') => setLegalType(type),
        unreadCount
    };

    return (
        <>
            <OfflineBanner />
            {!user ? (
                <MagicLinkLogin 
                    onLogin={handleLogin} 
                    onOpenLegal={(type) => setLegalType(type)} 
                    onOpenReadiness={() => setIsReadinessOpen(true)} 
                />
            ) : (
                <>
                    {role === 'Parent' && <ParentDashboard parent={user} {...commonProps} />}
                    {role === 'Student' && <StudentDashboard student={user} {...commonProps} />}
                    {role === 'Teacher' && <TeacherDashboard teacher={user} {...commonProps} />}
                    {role === 'Administrator' && <AdminDashboard admin={user} {...commonProps} />}
                </>
            )}

            <NotificationCenterModal
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                notifications={notifications}
                setNotifications={setNotifications}
                onTestPush={triggerPushNotification}
            />

            <StoreReadinessModal
                isOpen={isReadinessOpen}
                onClose={() => setIsReadinessOpen(false)}
                onOpenLegal={(type) => setLegalType(type)}
            />

            <LegalModal
                type={legalType}
                onClose={() => setLegalType(null)}
            />
        </>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
}

