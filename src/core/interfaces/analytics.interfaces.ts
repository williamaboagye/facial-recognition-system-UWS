export interface AtRiskStudent {
  StudentId: string
  FullName: string
  AttendanceRate: number
  ConsecutiveAbsences: number
  RiskLevel: string
}

export interface DailyRate {
  DayOfWeek: string
  Date: string
  PercentagePresent: number
}

export interface ModuleAttendanceRate {
  ModuleCode: string
  ModuleName: string
  PercentagePresent: number
}

export interface MonthlyTrend {
  Month: string
  Year: number
  MonthNumber: number
  PercentagePresent: number
}

export interface AnalyticsReport {
  TotalAtRiskStudents: number
  AtRiskStudents: AtRiskStudent[]
  CurrentWeekDailyRates: DailyRate[]
  ModuleAttendanceRates: ModuleAttendanceRate[]
  MonthlyTrends: MonthlyTrend[]
}
