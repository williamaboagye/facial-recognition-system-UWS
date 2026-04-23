import type {
  Lecturer, Module, Student, AttendanceSession,
  DailyAttendance, ModuleAttendance, MonthlyAttendance, Notification
} from "@/types"

export const lecturer: Lecturer = {
  id: "lec_001",
  name: "Dr. Sarah Johnson",
  email: "s.johnson@university.ac.uk",
  department: "School of Computing",
}

export const modules: Module[] = [
  { id: "mod_001", code: "CS101", name: "Introduction to Computer Science", schedule: "Mon & Wed, 10:00 AM", room: "Room A204", totalStudents: 32, attendanceRate: 87 },
  { id: "mod_002", code: "CS203", name: "Data Structures & Algorithms",     schedule: "Tue & Thu, 2:00 PM",  room: "Room B101", totalStudents: 28, attendanceRate: 74 },
  { id: "mod_003", code: "CS305", name: "Software Engineering",              schedule: "Friday, 9:00 AM",     room: "Lab 3",     totalStudents: 24, attendanceRate: 91 },
  { id: "mod_004", code: "CS410", name: "Machine Learning",                  schedule: "Wed & Fri, 1:00 PM",  room: "Room C302", totalStudents: 19, attendanceRate: 68 },
]

export const students: Student[] = [
  { id: "stu_001", name: "Kwame Mensah",   studentId: "B01901", moduleId: "mod_001", attendanceRate: 95, consecutiveAbsences: 0, status: "active"  },
  { id: "stu_002", name: "Ama Owusu",      studentId: "B01902", moduleId: "mod_001", attendanceRate: 60, consecutiveAbsences: 4, status: "at-risk" },
  { id: "stu_003", name: "James Boateng",  studentId: "B01903", moduleId: "mod_001", attendanceRate: 88, consecutiveAbsences: 0, status: "active"  },
  { id: "stu_004", name: "Abena Asante",   studentId: "B01904", moduleId: "mod_002", attendanceRate: 45, consecutiveAbsences: 6, status: "at-risk" },
  { id: "stu_005", name: "Kofi Darkwah",   studentId: "B01905", moduleId: "mod_002", attendanceRate: 79, consecutiveAbsences: 0, status: "active"  },
  { id: "stu_006", name: "Efua Amponsah",  studentId: "B01906", moduleId: "mod_002", attendanceRate: 55, consecutiveAbsences: 3, status: "at-risk" },
  { id: "stu_007", name: "Yaw Frimpong",   studentId: "B01907", moduleId: "mod_003", attendanceRate: 92, consecutiveAbsences: 0, status: "active"  },
  { id: "stu_008", name: "Akosua Danso",   studentId: "B01908", moduleId: "mod_003", attendanceRate: 83, consecutiveAbsences: 1, status: "active"  },
  { id: "stu_009", name: "Nana Adjei",     studentId: "B01909", moduleId: "mod_004", attendanceRate: 40, consecutiveAbsences: 7, status: "at-risk" },
  { id: "stu_010", name: "Adwoa Nyarko",   studentId: "B01910", moduleId: "mod_004", attendanceRate: 71, consecutiveAbsences: 0, status: "active"  },
]

export const attendanceSessions = [
  {
    id: "ses_001", moduleId: "mod_001", moduleName: "Introduction to Computer Science",
    date: "2026-03-06", time: "10:00 AM", totalStudents: 32, present: 29, absent: 3,
    records: [
      { studentId: "stu_001", name: "Kwame Mensah",  status: "Present", time: "10:02 AM" },
      { studentId: "stu_002", name: "Ama Owusu",     status: "Absent",  time: null },
      { studentId: "stu_003", name: "James Boateng", status: "Present", time: "10:05 AM" },
    ],
  },
  {
    id: "ses_002", moduleId: "mod_002", moduleName: "Data Structures & Algorithms",
    date: "2026-03-05", time: "2:00 PM", totalStudents: 28, present: 21, absent: 7,
    records: [
      { studentId: "stu_004", name: "Abena Asante",  status: "Absent",  time: null },
      { studentId: "stu_005", name: "Kofi Darkwah",  status: "Present", time: "2:03 PM" },
      { studentId: "stu_006", name: "Efua Amponsah", status: "Present", time: "2:07 PM" },
    ],
  },
  {
    id: "ses_003", moduleId: "mod_003", moduleName: "Software Engineering",
    date: "2026-03-07", time: "9:00 AM", totalStudents: 24, present: 23, absent: 1,
    records: [
      { studentId: "stu_007", name: "Yaw Frimpong", status: "Present", time: "9:01 AM" },
      { studentId: "stu_008", name: "Akosua Danso", status: "Present", time: "9:04 AM" },
    ],
  },
]

export const weeklyAttendance: DailyAttendance[] = [
  { day: "Mon", rate: 88 },
  { day: "Tue", rate: 74 },
  { day: "Wed", rate: 91 },
  { day: "Thu", rate: 69 },
  { day: "Fri", rate: 85 },
]

export const moduleAttendanceComparison: ModuleAttendance[] = [
  { module: "CS101", rate: 87 },
  { module: "CS203", rate: 74 },
  { module: "CS305", rate: 91 },
  { module: "CS410", rate: 68 },
]

export const monthlyTrend: MonthlyAttendance[] = [
  { month: "Oct", rate: 82 },
  { month: "Nov", rate: 78 },
  { month: "Dec", rate: 71 },
  { month: "Jan", rate: 85 },
  { month: "Feb", rate: 80 },
  { month: "Mar", rate: 83 },
]

export const notifications: Notification[] = [
  { id: "n1", message: "Abena Asante has missed 6 consecutive classes in CS203", type: "alert",   time: "2 hours ago", read: false },
  { id: "n2", message: "Nana Adjei attendance dropped below 40% in CS410",       type: "alert",   time: "5 hours ago", read: false },
  { id: "n3", message: "Attendance session for CS305 completed successfully",     type: "success", time: "1 day ago",   read: true  },
  { id: "n4", message: "Ama Owusu has missed 4 consecutive classes in CS101",     type: "alert",   time: "2 days ago",  read: true  },
  { id: "n5", message: "Module CS410 attendance rate fell below 70%",             type: "warning", time: "3 days ago",  read: true  },
]
