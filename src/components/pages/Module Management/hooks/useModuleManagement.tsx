// import { useMemo, useState } from "react"
// import { students } from "@/data/mockData"
// import { useModuleService } from "@/core/services/module.services"
// import type { Module } from "@/types"
// import type { ModuleListItem } from "@/core/interfaces/module.interfaces"
// import type { NewModuleForm } from "../types"

// export function useModuleManagement() {
//   const { useFetchModules } = useModuleService()

//   const [dialogOpen, setDialogOpen] = useState(false)
//   const [form, setForm] = useState<NewModuleForm>({
//     code: "",
//     name: "",
//     schedule: "",
//     room: "",
//   })
//   const [addedModules, setAddedModules] = useState<Module[]>([])
//   const [deletedModuleIds, setDeletedModuleIds] = useState<Set<string>>(
//     new Set()
//   )

//   const { data, isLoading } = useFetchModules()

//   const fetchedModules: Module[] = useMemo(() => {
//     return (data?.data ?? []).map((m: ModuleListItem) => ({
//       id: m.ModuleId,
//       code: m.ModuleCode,
//       name: m.ModuleName,
//       schedule: m.Periods.join(", "),
//       room: m.Location,
//       totalStudents: m.EnrolledStudentsCount,
//       attendanceRate: 0,
//     }))
//   }, [data])

//   const modules = useMemo(() => {
//     const filtered = fetchedModules.filter(
//       (m) => !deletedModuleIds.has(m.id)
//     )
//     return [...addedModules, ...filtered]
//   }, [addedModules, deletedModuleIds, fetchedModules])

//   const handleAddModule = () => {
//     if (!form.code || !form.name) return
//     const newModule: Module = {
//       id: `mod_${Date.now()}`,
//       code: form.code,
//       name: form.name,
//       schedule: form.schedule,
//       room: form.room,
//       totalStudents: 0,
//       attendanceRate: 0,
//     }
//     setAddedModules((prev) => [newModule, ...prev])
//     setForm({ code: "", name: "", schedule: "", room: "" })
//     setDialogOpen(false)
//   }

//   const handleDeleteModule = (id: string) => {
//     setDeletedModuleIds((prev) => new Set(prev).add(id))
//   }

//   const handleFormChange = (field: keyof NewModuleForm, value: string) => {
//     setForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const handleOpenDialog = () => {
//     setForm({ code: "", name: "", schedule: "", room: "" })
//     setDialogOpen(true)
//   }

//   const handleCloseDialog = () => {
//     setDialogOpen(false)
//     setForm({ code: "", name: "", schedule: "", room: "" })
//   }

//   const getStudentCount = (moduleId: string): number =>
//     students.filter((s) => s.moduleId === moduleId).length

//   const getRateColor = (rate: number): string => {
//     if (rate >= 80) return "text-green-600"
//     if (rate >= 70) return "text-yellow-600"
//     return "text-destructive"
//   }

//   const getBarColor = (rate: number): string => {
//     if (rate >= 80) return "bg-green-500"
//     if (rate >= 70) return "bg-yellow-500"
//     return "bg-destructive"
//   }

//   return {
//     // State
//     modules,
//     dialogOpen,
//     form,
//     isLoading,

//     // Actions
//     handleAddModule,
//     handleDeleteModule,
//     handleFormChange,
//     handleOpenDialog,
//     handleCloseDialog,

//     // Utilities
//     getStudentCount,
//     getRateColor,
//     getBarColor,
//   }
// }

import { useMemo, useState } from "react"
import { useModuleService } from "@/core/services/module.services"
import { useAuth } from "@/core/contexts/AuthContext"
import type { Module } from "@/types"
import type { ModuleListItem } from "@/core/interfaces/module.interfaces"
import type { NewModuleForm } from "../types"

export function useModuleManagement() {
  const { user } = useAuth()
  const { useFetchModules } = useModuleService()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<NewModuleForm>({
    code: "",
    name: "",
    schedule: "",
    room: "",
  })
  const [addedModules, setAddedModules] = useState<Module[]>([])
  const [deletedModuleIds, setDeletedModuleIds] = useState<Set<string>>(new Set())

  const { data, isLoading } = useFetchModules(user?.id)

  const fetchedModules: Module[] = useMemo(() => {
    return (data ?? []).map((m: ModuleListItem) => ({
      id: m.ModuleId,
      code: m.ModuleCode,
      name: m.ModuleName,
      schedule: m.Periods.join(", "),
      room: m.Location,
      totalStudents: m.EnrolledStudentsCount,
      attendanceRate: 0,
    }))
  }, [data])

  const modules = useMemo(() => {
    const filtered = fetchedModules.filter((m) => !deletedModuleIds.has(m.id))
    return [...addedModules, ...filtered]
  }, [addedModules, deletedModuleIds, fetchedModules])

  const handleAddModule = () => {
    if (!form.code || !form.name) return
    const newModule: Module = {
      id: `mod_${Date.now()}`,
      code: form.code,
      name: form.name,
      schedule: form.schedule,
      room: form.room,
      totalStudents: 0,
      attendanceRate: 0,
    }
    setAddedModules((prev) => [newModule, ...prev])
    setForm({ code: "", name: "", schedule: "", room: "" })
    setDialogOpen(false)
  }

  const handleDeleteModule = (id: string) => {
    setDeletedModuleIds((prev) => new Set(prev).add(id))
  }

  const handleFormChange = (field: keyof NewModuleForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleOpenDialog = () => {
    setForm({ code: "", name: "", schedule: "", room: "" })
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setForm({ code: "", name: "", schedule: "", room: "" })
  }

  const getRateColor = (rate: number): string => {
    if (rate >= 80) return "text-green-600"
    if (rate >= 70) return "text-yellow-600"
    return "text-destructive"
  }

  const getBarColor = (rate: number): string => {
    if (rate >= 80) return "bg-green-500"
    if (rate >= 70) return "bg-yellow-500"
    return "bg-destructive"
  }

  return {
    modules,
    dialogOpen,
    form,
    isLoading,
    handleAddModule,
    handleDeleteModule,
    handleFormChange,
    handleOpenDialog,
    handleCloseDialog,
    getRateColor,
    getBarColor,
  }
}