export const computers = [
  { name: 'MSC-ICU-WS-01', ip: '10.24.1.18', user: 'Dr. Amelia Reed', status: 'Online', cpu: 32, ram: 61, os: 'Windows 11 Pro', lastSeen: 'Just now', dept: 'Intensive Care', processor: 'Intel Core i7-12700', storage: '512 GB SSD', risk: 'Low' },
  { name: 'MSC-ER-WS-04', ip: '10.24.2.44', user: 'Nurse Leah Kim', status: 'Online', cpu: 48, ram: 72, os: 'Windows 11 Pro', lastSeen: '2 min ago', dept: 'Emergency', processor: 'Intel Core i5-12400', storage: '512 GB SSD', risk: 'Low' },
  { name: 'MSC-LAB-PC-12', ip: '10.24.4.91', user: 'Ethan Cole', status: 'Offline', cpu: 0, ram: 0, os: 'Windows 10 Pro', lastSeen: '38 min ago', dept: 'Pathology Lab', processor: 'Intel Core i5-10500', storage: '1 TB SSD', risk: 'High' },
  { name: 'MSC-RAD-WS-07', ip: '10.24.5.22', user: 'Dr. Arjun Mehta', status: 'Online', cpu: 67, ram: 58, os: 'Windows 11 Pro', lastSeen: 'Just now', dept: 'Radiology', processor: 'Intel Xeon W-2245', storage: '2 TB SSD', risk: 'Medium' },
  { name: 'MSC-PHARM-03', ip: '10.24.6.31', user: 'Sophia Ellis', status: 'Online', cpu: 21, ram: 44, os: 'Windows 11 Pro', lastSeen: '4 min ago', dept: 'Pharmacy', processor: 'Intel Core i5-11400', storage: '512 GB SSD', risk: 'Low' },
  { name: 'MSC-ADMIN-09', ip: '10.24.8.15', user: 'Noah Williams', status: 'Offline', cpu: 0, ram: 0, os: 'Windows 10 Pro', lastSeen: '1 hr ago', dept: 'Administration', processor: 'Intel Core i5-9500', storage: '256 GB SSD', risk: 'Medium' },
  { name: 'MSC-OPD-WS-18', ip: '10.24.3.64', user: 'Dr. Maya Patel', status: 'Online', cpu: 41, ram: 53, os: 'Windows 11 Pro', lastSeen: '1 min ago', dept: 'Outpatient', processor: 'Intel Core i5-12400', storage: '512 GB SSD', risk: 'Low' },
]

export const activities = [
  { type: 'Gmail Accessed', user: 'Dr. Amelia Reed', computer: 'MSC-ICU-WS-01', time: '2 min ago', detail: 'mail.google.com opened', tone: 'blue' },
  { type: 'Outlook Opened', user: 'Nurse Leah Kim', computer: 'MSC-ER-WS-04', time: '8 min ago', detail: 'Microsoft Outlook desktop client', tone: 'cyan' },
  { type: 'File Upload Detected', user: 'Ethan Cole', computer: 'MSC-LAB-PC-12', time: '14 min ago', detail: 'lab-results-may.xlsx uploaded', tone: 'amber' },
  { type: 'USB Connected', user: 'Sophia Ellis', computer: 'MSC-PHARM-03', time: '19 min ago', detail: 'Kingston DataTraveler USB storage', tone: 'violet' },
  { type: 'Unknown EXE Executed', user: 'Dr. Arjun Mehta', computer: 'MSC-RAD-WS-07', time: '27 min ago', detail: 'invoice_reader.exe blocked', tone: 'red' },
  { type: 'Browser Activity', user: 'Dr. Maya Patel', computer: 'MSC-OPD-WS-18', time: '33 min ago', detail: 'Clinical research portal accessed', tone: 'blue' },
  { type: 'Software Opened', user: 'Noah Williams', computer: 'MSC-ADMIN-09', time: '44 min ago', detail: 'Microsoft Excel launched', tone: 'cyan' },
]

export const threats = [
  { name: 'Trojan.Win32.Generic', severity: 'Critical', computer: 'MSC-LAB-PC-12', status: 'Quarantined', message: 'Suspicious executable isolated', time: '12 min ago' },
  { name: 'Behavior.Ransomware', severity: 'High', computer: 'MSC-RAD-WS-07', status: 'Investigating', message: 'Unusual file encryption behavior', time: '27 min ago' },
  { name: 'PUA.Toolbar.Bundle', severity: 'Medium', computer: 'MSC-ADMIN-09', status: 'Blocked', message: 'Potentially unwanted app blocked', time: '1 hr ago' },
  { name: 'Macro.Script.Alert', severity: 'Low', computer: 'MSC-PHARM-03', status: 'Resolved', message: 'Unsigned macro prevented from running', time: '3 hr ago' },
]

export const emailLogs = [
  { user: 'Ethan Cole', computer: 'MSC-LAB-PC-12', service: 'Gmail', file: 'lab-results-may.xlsx', size: '4.8 MB', time: '14 min ago' },
  { user: 'Dr. Maya Patel', computer: 'MSC-OPD-WS-18', service: 'Outlook', file: 'patient-referral.pdf', size: '1.2 MB', time: '36 min ago' },
  { user: 'Noah Williams', computer: 'MSC-ADMIN-09', service: 'Outlook', file: 'shift-allocation.xlsx', size: '856 KB', time: '1 hr ago' },
  { user: 'Dr. Amelia Reed', computer: 'MSC-ICU-WS-01', service: 'Gmail', file: 'care-guideline.pdf', size: '2.1 MB', time: '2 hr ago' },
  { user: 'Sophia Ellis', computer: 'MSC-PHARM-03', service: 'Gmail', file: 'stock-request.csv', size: '212 KB', time: '3 hr ago' },
]

export const usbLogs = [
  { device: 'Kingston DataTraveler 3.0', user: 'Sophia Ellis', computer: 'MSC-PHARM-03', connected: '10:42 AM', removed: '10:49 AM', status: 'Removed' },
  { device: 'SanDisk Ultra USB', user: 'Ethan Cole', computer: 'MSC-LAB-PC-12', connected: '09:18 AM', removed: '09:34 AM', status: 'Removed' },
  { device: 'WD Elements Portable', user: 'Noah Williams', computer: 'MSC-ADMIN-09', connected: 'Yesterday, 05:10 PM', removed: 'Yesterday, 05:52 PM', status: 'Removed' },
  { device: 'Transcend JetFlash', user: 'Dr. Arjun Mehta', computer: 'MSC-RAD-WS-07', connected: 'Yesterday, 02:23 PM', removed: '-', status: 'Connected' },
]

export const software = [
  { name: 'Microsoft Edge', version: '125.0.2535', publisher: 'Microsoft Corporation', installDate: 'May 26, 2026', systems: 238, category: 'Browser' },
  { name: 'Hospital Endpoint Agent', version: '8.4.2', publisher: 'Hospital IT', installDate: 'May 18, 2026', systems: 248, category: 'Security' },
  { name: 'Microsoft 365 Apps', version: '2404', publisher: 'Microsoft Corporation', installDate: 'Apr 30, 2026', systems: 226, category: 'Productivity' },
  { name: 'RadiAnt DICOM Viewer', version: '2025.1', publisher: 'Medixant', installDate: 'Apr 18, 2026', systems: 34, category: 'Clinical' },
  { name: 'Google Chrome', version: '125.0.6422', publisher: 'Google LLC', installDate: 'May 22, 2026', systems: 198, category: 'Browser' },
  { name: 'Cisco Secure Client', version: '5.1.4', publisher: 'Cisco Systems', installDate: 'Mar 12, 2026', systems: 248, category: 'Network' },
]

export const hourlyActivity = [
  { time: '00:00', email: 8, uploads: 2, usb: 1, threats: 0 }, { time: '03:00', email: 4, uploads: 1, usb: 0, threats: 1 },
  { time: '06:00', email: 12, uploads: 3, usb: 2, threats: 0 }, { time: '09:00', email: 42, uploads: 14, usb: 5, threats: 2 },
  { time: '12:00', email: 56, uploads: 21, usb: 8, threats: 4 }, { time: '15:00', email: 49, uploads: 18, usb: 6, threats: 2 },
  { time: '18:00', email: 28, uploads: 9, usb: 3, threats: 1 }, { time: '21:00', email: 17, uploads: 4, usb: 1, threats: 0 },
  { time: '24:00', email: 9, uploads: 2, usb: 0, threats: 0 },
]

export const networkTraffic = [
  { time: '08:00', inbound: 42, outbound: 24 }, { time: '09:00', inbound: 58, outbound: 31 }, { time: '10:00', inbound: 81, outbound: 45 },
  { time: '11:00', inbound: 73, outbound: 38 }, { time: '12:00', inbound: 96, outbound: 52 }, { time: '13:00', inbound: 88, outbound: 47 },
  { time: '14:00', inbound: 104, outbound: 61 }, { time: '15:00', inbound: 92, outbound: 49 },
]

export const auditLogs = [
  { action: 'Malware alert quarantined', user: 'Aarav Sharma', role: 'Security Admin', resource: 'MSC-LAB-PC-12', time: '12 min ago', result: 'Success' },
  { action: 'Computer details viewed', user: 'Priya Nair', role: 'IT Staff', resource: 'MSC-RAD-WS-07', time: '28 min ago', result: 'Success' },
  { action: 'Daily security report generated', user: 'Aarav Sharma', role: 'Security Admin', resource: 'Daily Report', time: '1 hr ago', result: 'Success' },
  { action: 'Login attempt blocked', user: 'Unknown', role: 'External', resource: 'Admin Portal', time: '2 hr ago', result: 'Blocked' },
  { action: 'Notification settings updated', user: 'Kabir Verma', role: 'IT Manager', resource: 'System Settings', time: '4 hr ago', result: 'Success' },
]

export const users = [
  { name: 'Aarav Sharma', initials: 'AS', role: 'Security Admin', team: 'Security Team', email: 'aarav.sharma@hospital.in', status: 'Active', lastActive: 'Now' },
  { name: 'Priya Nair', initials: 'PN', role: 'Endpoint Analyst', team: 'Security Team', email: 'priya.nair@hospital.in', status: 'Active', lastActive: '8 min ago' },
  { name: 'Kabir Verma', initials: 'KV', role: 'IT Manager', team: 'IT Staff', email: 'kabir.verma@hospital.in', status: 'Active', lastActive: '22 min ago' },
  { name: 'Riya Malhotra', initials: 'RM', role: 'IT Support', team: 'IT Staff', email: 'riya.malhotra@hospital.in', status: 'Invited', lastActive: '-' },
]

export const itAssets = [
  { id: 'IT-PC-001', type: 'PC', name: 'ICU Nursing Station PC', department: 'Intensive Care', location: 'ICU Block A', assignedTo: 'Nurse Leah Kim', serial: 'HP-ICU-8821', status: 'Active', health: 'Good', purchaseDate: 'Jan 12, 2024', warranty: 'Jan 11, 2027', amc: 'Covered', vendor: 'CareTech Systems' },
  { id: 'IT-PC-002', type: 'PC', name: 'Radiology Workstation', department: 'Radiology', location: 'Radiology Room 2', assignedTo: 'Dr. Arjun Mehta', serial: 'DL-RAD-5510', status: 'Active', health: 'Needs Service', purchaseDate: 'Mar 20, 2023', warranty: 'Mar 19, 2026', amc: 'Covered', vendor: 'Medix IT Services' },
  { id: 'IT-PRN-014', type: 'Printer', name: 'OPD Token Printer', department: 'Outpatient', location: 'OPD Reception', assignedTo: 'Front Desk', serial: 'EP-OPD-7742', status: 'Active', health: 'Good', purchaseDate: 'Aug 02, 2024', warranty: 'Aug 01, 2026', amc: 'Covered', vendor: 'PrintCare AMC' },
  { id: 'IT-PRN-021', type: 'Printer', name: 'Billing Laser Printer', department: 'Billing', location: 'Billing Counter 3', assignedTo: 'Billing Team', serial: 'CN-BIL-2190', status: 'Maintenance', health: 'Critical', purchaseDate: 'Nov 15, 2022', warranty: 'Expired', amc: 'Renewal Due', vendor: 'PrintCare AMC' },
  { id: 'IT-CAM-033', type: 'Camera', name: 'Emergency Gate CCTV', department: 'Security', location: 'Emergency Entrance', assignedTo: 'Security Room', serial: 'HIK-ER-5581', status: 'Active', health: 'Good', purchaseDate: 'Feb 04, 2024', warranty: 'Feb 03, 2027', amc: 'Covered', vendor: 'SecureVision' },
  { id: 'IT-CAM-041', type: 'Camera', name: 'Pharmacy CCTV', department: 'Pharmacy', location: 'Pharmacy Store', assignedTo: 'Security Room', serial: 'HIK-PH-9912', status: 'Offline', health: 'Critical', purchaseDate: 'Dec 18, 2023', warranty: 'Dec 17, 2026', amc: 'Covered', vendor: 'SecureVision' },
  { id: 'IT-BIO-007', type: 'Biometric', name: 'Staff Entry Biometric', department: 'HR', location: 'Staff Entry Gate', assignedTo: 'HR Desk', serial: 'BIO-HR-4420', status: 'Active', health: 'Good', purchaseDate: 'Jun 11, 2024', warranty: 'Jun 10, 2027', amc: 'Covered', vendor: 'AccessGrid' },
  { id: 'IT-BIO-012', type: 'Biometric', name: 'OT Access Biometric', department: 'Operation Theatre', location: 'OT Corridor', assignedTo: 'OT Admin', serial: 'BIO-OT-1190', status: 'Maintenance', health: 'Needs Service', purchaseDate: 'Sep 21, 2023', warranty: 'Sep 20, 2026', amc: 'Covered', vendor: 'AccessGrid' },
]

export const helpDeskTickets = [
  { id: 'HD-1028', requester: 'Dr. Maya Patel', department: 'Outpatient', subject: 'OPD printer not printing prescriptions', category: 'Printer', priority: 'High', status: 'Open', assignedTo: 'Riya Malhotra', created: '10 min ago', sla: '1h 50m left' },
  { id: 'HD-1027', requester: 'Nurse Leah Kim', department: 'Emergency', subject: 'Workstation login slow after update', category: 'PC', priority: 'Medium', status: 'In Progress', assignedTo: 'Kabir Verma', created: '42 min ago', sla: '3h 18m left' },
  { id: 'HD-1026', requester: 'Security Desk', department: 'Security', subject: 'Emergency gate camera feed offline', category: 'Camera', priority: 'Critical', status: 'Escalated', assignedTo: 'Aarav Sharma', created: '1 hr ago', sla: '28m left' },
  { id: 'HD-1025', requester: 'HR Team', department: 'HR', subject: 'Biometric attendance mismatch', category: 'Biometric', priority: 'Medium', status: 'Open', assignedTo: 'Priya Nair', created: '2 hr ago', sla: '2h 05m left' },
  { id: 'HD-1024', requester: 'Billing Counter', department: 'Billing', subject: 'Billing printer toner low', category: 'Printer', priority: 'Low', status: 'Resolved', assignedTo: 'Riya Malhotra', created: 'Yesterday', sla: 'Completed' },
]

export const amcContracts = [
  { vendor: 'CareTech Systems', scope: 'PCs and Workstations', assets: 124, start: 'Apr 01, 2026', end: 'Mar 31, 2027', status: 'Active', value: '₹8,40,000', nextReview: 'Jun 30, 2026' },
  { vendor: 'PrintCare AMC', scope: 'Printers and Scanners', assets: 42, start: 'Jan 01, 2026', end: 'Dec 31, 2026', status: 'Active', value: '₹3,25,000', nextReview: 'Jul 05, 2026' },
  { vendor: 'SecureVision', scope: 'CCTV Cameras and NVRs', assets: 96, start: 'May 01, 2025', end: 'Jun 15, 2026', status: 'Renewal Due', value: '₹5,75,000', nextReview: 'Jun 10, 2026' },
  { vendor: 'AccessGrid', scope: 'Biometric Devices', assets: 18, start: 'Oct 01, 2025', end: 'Sep 30, 2026', status: 'Active', value: '₹1,85,000', nextReview: 'Aug 15, 2026' },
]

export const maintenanceHistory = [
  { id: 'MH-884', asset: 'IT-PRN-021', device: 'Billing Laser Printer', type: 'Corrective', technician: 'Riya Malhotra', date: 'May 31, 2026', issue: 'Paper feed roller replaced', downtime: '45 min', result: 'Resolved' },
  { id: 'MH-883', asset: 'IT-CAM-041', device: 'Pharmacy CCTV', type: 'Corrective', technician: 'SecureVision Engineer', date: 'May 30, 2026', issue: 'Camera power adapter checked', downtime: '2 hr', result: 'Monitoring' },
  { id: 'MH-882', asset: 'IT-BIO-012', device: 'OT Access Biometric', type: 'Preventive', technician: 'AccessGrid Engineer', date: 'May 29, 2026', issue: 'Sensor cleaned and firmware updated', downtime: '20 min', result: 'Resolved' },
  { id: 'MH-881', asset: 'IT-PC-002', device: 'Radiology Workstation', type: 'Preventive', technician: 'Kabir Verma', date: 'May 28, 2026', issue: 'Thermal cleaning and disk health check', downtime: '30 min', result: 'Resolved' },
  { id: 'MH-880', asset: 'IT-CAM-033', device: 'Emergency Gate CCTV', type: 'Inspection', technician: 'Security IT Team', date: 'May 27, 2026', issue: 'Lens alignment and stream validation', downtime: '10 min', result: 'Resolved' },
]

export const itAdmins = [
  { name: 'Kabir Verma', role: 'IT Manager', queue: 'Infrastructure', openTickets: 8, resolvedToday: 5, status: 'Online' },
  { name: 'Riya Malhotra', role: 'IT Support', queue: 'Help Desk', openTickets: 11, resolvedToday: 9, status: 'Online' },
  { name: 'Priya Nair', role: 'Endpoint Analyst', queue: 'Assets', openTickets: 4, resolvedToday: 3, status: 'Online' },
  { name: 'Aarav Sharma', role: 'Security Admin', queue: 'Escalations', openTickets: 2, resolvedToday: 2, status: 'Online' },
]
