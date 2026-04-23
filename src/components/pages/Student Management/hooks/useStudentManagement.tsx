// import { useMemo, useState } from "react"
// import { modules } from "@/data/mockData"
// import { useStudentService } from "@/core/services/student.services"
// import type { StudentListItem } from "@/core/interfaces/student.interfaces"
// import type { NewStudentForm } from "../types"

// export function useStudentManagement() {
//   const {
//     useFetchStudents,
//   } = useStudentService()

//   const [filterModule, setFilterModule] = useState<string>("all")
//   const [searchQuery, setSearchQuery] = useState<string>("")
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const [form, setForm] = useState<NewStudentForm>({
//     name: "",
//     studentId: "",
//     moduleId: "",
//   })
//   const [pageIndex, setPageIndex] = useState(0)
//   const [pageSize, setPageSize] = useState(10)
//   const [deletedStudentIds, setDeletedStudentIds] = useState<Set<string>>(
//     new Set()
//   )
//   const [addedStudents, setAddedStudents] = useState<StudentListItem[]>([])

//   const moduleIdParam = filterModule === "all" ? undefined : filterModule

//   const { data, isLoading } = useFetchStudents(moduleIdParam)

//   const fetchedStudents = data?.data ?? []

//   const students = useMemo(() => {
//     const filtered = fetchedStudents
//       .filter((student) => !deletedStudentIds.has(student.StudentId))
//       .filter((student) => {
//         const query = searchQuery.toLowerCase()
//         return (
//           student.FullName.toLowerCase().includes(query) ||
//           student.StudentId.toLowerCase().includes(query) ||
//           student.ModuleCode.toLowerCase().includes(query)
//         )
//       })

//     return [...addedStudents, ...filtered]
//   }, [addedStudents, deletedStudentIds, fetchedStudents, searchQuery])

//   const totalRows = students.length

//   const handleAddStudent = () => {
//     if (!form.name || !form.studentId || !form.moduleId) return
//     const module = modules.find((m) => m.id === form.moduleId)
//     const newStudent: StudentListItem = {
//       StudentId: form.studentId,
//       FullName: form.name,
//       ModuleCode: module?.code ?? "Unknown",
//     }
//     setAddedStudents((prev) => [newStudent, ...prev])
//     setForm({ name: "", studentId: "", moduleId: "" })
//     setDialogOpen(false)
//   }

//   const handleDeleteStudent = (id: string) => {
//     setDeletedStudentIds((prev) => new Set(prev).add(id))
//   }

//   const handleSearchChange = (value: string) => {
//     setSearchQuery(value)
//     setPageIndex(0)
//   }

//   const handleFilterChange = (moduleId: string) => {
//     setFilterModule(moduleId)
//     setPageIndex(0)
//   }

//   const handleFormChange = (
//     field: keyof NewStudentForm,
//     value: string
//   ) => {
//     setForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const handleOpenDialog = () => {
//     setForm({ name: "", studentId: "", moduleId: "" })
//     setDialogOpen(true)
//   }

//   const handleCloseDialog = () => {
//     setDialogOpen(false)
//     setForm({ name: "", studentId: "", moduleId: "" })
//   }

//   return {
//     students,
//     filterModule,
//     searchQuery,
//     dialogOpen,
//     form,
//     pageIndex,
//     pageSize,
//     isLoading,
//     handleAddStudent,
//     handleDeleteStudent,
//     handleSearchChange,
//     handleFilterChange,
//     handleFormChange,
//     handleOpenDialog,
//     handleCloseDialog,
//     setPageIndex,
//     setPageSize,
//     totalRows,
//   }
// }


// import { useMemo, useState } from "react"
// import { useStudentService } from "@/core/services/student.services"
// import { useAuth } from "@/core/contexts/AuthContext"
// import type { StudentListItem } from "@/core/interfaces/student.interfaces"
// import type { NewStudentForm } from "../types"

// export function useStudentManagement() {
//   const { user } = useAuth()
//   const { useFetchStudents } = useStudentService()

//   const [filterModule, setFilterModule] = useState<string>("all")
//   const [searchQuery, setSearchQuery] = useState<string>("")
//   const [dialogOpen, setDialogOpen] = useState(false)
//   const [form, setForm] = useState<NewStudentForm>({
//     name: "",
//     studentId: "",
//     moduleId: "",
//   })
//   const [pageIndex, setPageIndex] = useState(0)
//   const [pageSize, setPageSize] = useState(10)
//   const [deletedStudentIds, setDeletedStudentIds] = useState<Set<string>>(new Set())
//   const [addedStudents, setAddedStudents] = useState<StudentListItem[]>([])

//   const moduleIdParam = filterModule === "all" ? undefined : filterModule

//   const { data, isLoading } = useFetchStudents(user?.id, moduleIdParam)

//   const fetchedStudents = data ?? []

//   const students = useMemo(() => {
//     const filtered = fetchedStudents
//       .filter((student) => !deletedStudentIds.has(student.StudentId))
//       .filter((student) => {
//         const query = searchQuery.toLowerCase()
//         return (
//           student.FullName.toLowerCase().includes(query) ||
//           student.StudentId.toLowerCase().includes(query) ||
//           student.ModuleCodes.some((code) => code.toLowerCase().includes(query))
//         )
//       })
//     return [...addedStudents, ...filtered]
//   }, [addedStudents, deletedStudentIds, fetchedStudents, searchQuery])

//   const totalRows = students.length

//   const handleAddStudent = () => {
//     if (!form.name || !form.studentId || !form.moduleId) return
//     const newStudent: StudentListItem = {
//       StudentId: form.studentId,
//       FullName: form.name,
//       ModuleCodes: [form.moduleId],
//     }
//     setAddedStudents((prev) => [newStudent, ...prev])
//     setForm({ name: "", studentId: "", moduleId: "" })
//     setDialogOpen(false)
//   }

//   const handleDeleteStudent = (id: string) => {
//     setDeletedStudentIds((prev) => new Set(prev).add(id))
//   }

//   const handleSearchChange = (value: string) => {
//     setSearchQuery(value)
//     setPageIndex(0)
//   }

//   const handleFilterChange = (moduleId: string) => {
//     setFilterModule(moduleId)
//     setPageIndex(0)
//   }

//   const handleFormChange = (field: keyof NewStudentForm, value: string) => {
//     setForm((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleOpenDialog = () => {
//     setForm({ name: "", studentId: "", moduleId: "" })
//     setDialogOpen(true)
//   }

//   const handleCloseDialog = () => {
//     setDialogOpen(false)
//     setForm({ name: "", studentId: "", moduleId: "" })
//   }

//   return {
//     students,
//     filterModule,
//     searchQuery,
//     dialogOpen,
//     form,
//     pageIndex,
//     pageSize,
//     isLoading,
//     handleAddStudent,
//     handleDeleteStudent,
//     handleSearchChange,
//     handleFilterChange,
//     handleFormChange,
//     handleOpenDialog,
//     handleCloseDialog,
//     setPageIndex,
//     setPageSize,
//     totalRows,
//   }
// }


import { useMemo, useState } from "react"
import { useStudentService } from "@/core/services/student.services"
import { useAuth } from "@/core/contexts/AuthContext"
import type { StudentListItem } from "@/core/interfaces/student.interfaces"
import type { NewStudentForm } from "../types"

export function useStudentManagement() {
  const { user } = useAuth()
  const { useFetchStudents } = useStudentService()

  const [filterModule, setFilterModule] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<NewStudentForm>({
    name: "",
    studentId: "",
    moduleId: "",
  })
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [deletedStudentIds, setDeletedStudentIds] = useState<Set<string>>(new Set())
  const [addedStudents, setAddedStudents] = useState<StudentListItem[]>([])

  const moduleCodeParam = filterModule === "all" ? undefined : filterModule

  const { data, isLoading } = useFetchStudents(user?.id, moduleCodeParam)

  const fetchedStudents = data ?? []

  const students = useMemo(() => {
    const filtered = fetchedStudents
      .filter((student) => !deletedStudentIds.has(student.StudentId))
      .filter((student) => {
        const query = searchQuery.toLowerCase()
        return (
          student.FullName.toLowerCase().includes(query) ||
          student.StudentId.toLowerCase().includes(query) ||
          student.ModuleCodes.some((code) => code.toLowerCase().includes(query))
        )
      })
    return [...addedStudents, ...filtered]
  }, [addedStudents, deletedStudentIds, fetchedStudents, searchQuery])

  const totalRows = students.length

  const handleAddStudent = () => {
    if (!form.name || !form.studentId || !form.moduleId) return
    const newStudent: StudentListItem = {
      StudentId: form.studentId,
      FullName: form.name,
      ModuleCodes: [form.moduleId],
    }
    setAddedStudents((prev) => [newStudent, ...prev])
    setForm({ name: "", studentId: "", moduleId: "" })
    setDialogOpen(false)
  }

  const handleDeleteStudent = (id: string) => {
    setDeletedStudentIds((prev) => new Set(prev).add(id))
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPageIndex(0)
  }

  // filterModule stores ModuleCode (e.g. "COE401"), not ModuleId
  const handleFilterChange = (moduleCode: string) => {
    setFilterModule(moduleCode)
    setPageIndex(0)
  }

  const handleFormChange = (field: keyof NewStudentForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleOpenDialog = () => {
    setForm({ name: "", studentId: "", moduleId: "" })
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setForm({ name: "", studentId: "", moduleId: "" })
  }

  return {
    students,
    filterModule,
    searchQuery,
    dialogOpen,
    form,
    pageIndex,
    pageSize,
    isLoading,
    handleAddStudent,
    handleDeleteStudent,
    handleSearchChange,
    handleFilterChange,
    handleFormChange,
    handleOpenDialog,
    handleCloseDialog,
    setPageIndex,
    setPageSize,
    totalRows,
  }
}