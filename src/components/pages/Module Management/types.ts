import type { Module } from "@/types"

export interface NewModuleForm {
  code: string
  name: string
  schedule: string
  room: string
}

export interface ModuleManagementState {
  modules: Module[]
  dialogOpen: boolean
  form: NewModuleForm
}
