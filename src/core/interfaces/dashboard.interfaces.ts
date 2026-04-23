export interface ModuleInfo {
  Name: string
  Code: string
  Periods: string[]
  AverageAttendancePercentage: number
}

export interface RecentSession {
  ModuleName: string
  SessionDate: string
  NumberPresent: number
  TotalStudents: number
}

export interface AtRiskStudent {
  FullName: string
  ConsecutiveAbsences: number
  AbsencePercentage: number
}

export interface DashboardStats {
  SemesterAverageAttendance: number
  TotalAtRiskStudents: number
  Modules: ModuleInfo[]
  RecentSessions: RecentSession[]
  AtRiskStudents: AtRiskStudent[]
}
