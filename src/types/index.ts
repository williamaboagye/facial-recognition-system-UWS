// ─── Core entity types ────────────────────────────────────────────────────────

export interface Lecturer {
  id: string
  name: string
  email: string
  department: string
}

export interface Module {
  id: string
  code: string
  name: string
  schedule: string
  room: string
  totalStudents: number
  attendanceRate: number
}

export type StudentStatus = "active" | "at-risk"

export interface Student {
  id: string
  name: string
  studentId: string
  moduleId: string
  attendanceRate: number
  consecutiveAbsences: number
  status: StudentStatus
}

export type AttendanceStatus = "Present" | "Absent" | "Pending"

export interface AttendanceRecord {
  studentId: string
  name: string
  status: AttendanceStatus
  time: string | null
}

export interface AttendanceSession {
  id: string
  moduleId: string
  moduleOfferingId: number
  moduleName: string
  date: string
  time: string
  totalStudents: number
  present: number
  absent: number
  records: AttendanceRecord[]
}

// ─── Analytics types ──────────────────────────────────────────────────────────

export interface DailyAttendance {
  day: string
  rate: number
}

export interface ModuleAttendance {
  module: string
  rate: number
}

export interface MonthlyAttendance {
  month: string
  rate: number
}

// ─── Notification types ───────────────────────────────────────────────────────

export type NotificationType = "alert" | "success" | "warning"

export interface Notification {
  id: string
  message: string
  type: NotificationType
  time: string
  read: boolean
}

// ─── Live session types ───────────────────────────────────────────────────────

export interface LiveRecord extends Student {
  attendStatus: AttendanceStatus
  markedAt?: string
}
