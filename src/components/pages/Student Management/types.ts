import type { Student, Module } from "@/types"

export interface NewStudentForm {
  name: string
  studentId: string
  moduleId: string
}

export interface StudentManagementState {
  students: Student[]
  filterModule: string
  searchQuery: string
  dialogOpen: boolean
  form: NewStudentForm
}
