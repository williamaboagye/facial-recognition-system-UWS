export interface ApiResponse<T> {
  data: T
  success?: boolean
  message?: string
}

export interface IRequestErrorResponse {
  message: string
  statusCode?: number
  errors?: Record<string, string[]>
}

export interface ModuleListItem {
  ModuleId: string
  ModuleOfferingId: number
  ModuleCode: string
  ModuleName: string
  Location: string
  Periods: string[]
  EnrolledStudentsCount: number
}

export interface ModuleDetail {
  ModuleId: string
  ModuleCode: string
  ModuleName: string
  Location: string
  Periods: string[]
  EnrolledStudentsCount: number
}
