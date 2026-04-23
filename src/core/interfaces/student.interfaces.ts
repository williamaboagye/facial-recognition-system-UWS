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

export interface StudentListItem {
  StudentId: string
  FullName: string
  ModuleCodes: string[]
}

export interface StudentDetail {
  StudentId: string
  FirstName: string
  MiddleName: string
  LastName: string
  ModuleCodes: string[]
}
