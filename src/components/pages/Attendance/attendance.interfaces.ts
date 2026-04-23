export interface StartSessionRequest {
  moduleId: number
}

export interface StartSessionResponse {
  message: string
  sessionId: number
}

export interface MarkAttendanceRequest {
  StudentId: string
  LiveEmbedding: number[]
  ModuleOfferingId: number
  SessionId: number
  ManualVerification: boolean
}

export interface EndSessionRequest {
  SessionId: number
}

export interface RegisterStudentRequest {
  StudentId: string
  Embeddings: number[][]
  ModuleCode: string
}

export interface AlreadyScannedStudent {
  StudentId: string
  StudentName: string
  ConductedOn: string
}

export interface CheckActiveSessionResponse {
  SessionId: number
  ModuleOfferingId: number
  StartTime: string
  AlreadyScannedStudents: AlreadyScannedStudent[]
}