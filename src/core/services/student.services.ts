// import { useQuery, useQueryClient } from "@tanstack/react-query"
// import { getAxios } from "@/lib/axios"
// import { getConfig } from "@/lib/utils"
// import {
//   ApiResponse,
//   IRequestErrorResponse,
//   StudentDetail,
//   StudentListItem,
// } from "@/core/interfaces/student.interfaces"

// const apiAxios = (route: string) =>
//   getAxios(getConfig().apiBaseUrl + route)

// const studentsApi = () => apiAxios("/Students")
// const STUDENTS_QUERY_KEY = ["students"]

// export const useStudentService = () => {
//   const queryClient = useQueryClient()

//   const useFetchStudents = (
//     moduleId?: number | string,
//     enabled: boolean = true
//   ) =>
//     useQuery<ApiResponse<StudentListItem[]>, IRequestErrorResponse>({
//       queryKey: [...STUDENTS_QUERY_KEY, "list", { moduleId }],
//       enabled,
//       queryFn: () =>
//         studentsApi()
//           .get("/GetStudents", { params: { moduleId } })
//           .then((res) => res.data),
//     })

//   const useFetchStudentById = (
//     studentId?: string,
//     enabled: boolean = true
//   ) =>
//     useQuery<ApiResponse<StudentDetail>, IRequestErrorResponse>({
//       queryKey: [...STUDENTS_QUERY_KEY, "detail", studentId],
//       enabled: enabled && !!studentId,
//       queryFn: () =>
//         studentsApi()
//           .get("/GetStudent", { params: { studentId } })
//           .then((res) => res.data),
//     })

//   return {
//     useFetchStudents,
//     useFetchStudentById,
//   }
// }


// import { useQuery } from "@tanstack/react-query"
// import { getAxios } from "@/lib/axios"
// import { getConfig } from "@/lib/utils"
// import type {
//   IRequestErrorResponse,
//   StudentDetail,
//   StudentListItem,
// } from "@/core/interfaces/student.interfaces"

// const apiAxios = (route: string) =>
//   getAxios(getConfig().apiBaseUrl + route)

// const studentsApi = () => apiAxios("/Students")
// const STUDENTS_QUERY_KEY = ["students"]

// export const useStudentService = () => {
//   const useFetchStudents = (
//     lecturerId?: string,
//     moduleId?: string,
//     enabled: boolean = true
//   ) =>
//     useQuery<StudentListItem[], IRequestErrorResponse>({
//       queryKey: [...STUDENTS_QUERY_KEY, "list", { lecturerId, moduleId }],
//       enabled: enabled && !!lecturerId,
//       queryFn: () =>
//         studentsApi()
//           .get("/GetStudents", { params: { lecturerId, moduleId } })
//           .then((res) => res.data),
//     })

//   const useFetchStudentById = (
//     studentId?: string,
//     enabled: boolean = true
//   ) =>
//     useQuery<StudentDetail, IRequestErrorResponse>({
//       queryKey: [...STUDENTS_QUERY_KEY, "detail", studentId],
//       enabled: enabled && !!studentId,
//       queryFn: () =>
//         studentsApi()
//           .get("/GetStudent", { params: { studentId } })
//           .then((res) => res.data),
//     })

//   return {
//     useFetchStudents,
//     useFetchStudentById,
//   }
// }



import { useQuery } from "@tanstack/react-query"
import { getAxios } from "@/lib/axios"
import { getConfig } from "@/lib/utils"
import type {
  IRequestErrorResponse,
  StudentDetail,
  StudentListItem,
} from "@/core/interfaces/student.interfaces"

const apiAxios = (route: string) =>
  getAxios(getConfig().apiBaseUrl + route)

const studentsApi = () => apiAxios("/Students")
const STUDENTS_QUERY_KEY = ["students"]

export const useStudentService = () => {
  const useFetchStudents = (
    lecturerId?: string,
    moduleCode?: string,
    enabled: boolean = true
  ) =>
    useQuery<StudentListItem[], IRequestErrorResponse>({
      queryKey: [...STUDENTS_QUERY_KEY, "list", { lecturerId, moduleCode }],
      enabled: enabled && !!lecturerId,
      queryFn: () =>
        studentsApi()
          .get("/GetStudents", { params: { lecturerId, moduleCode } })
          .then((res) => res.data),
    })

  const useFetchStudentById = (
    studentId?: string,
    enabled: boolean = true
  ) =>
    useQuery<StudentDetail, IRequestErrorResponse>({
      queryKey: [...STUDENTS_QUERY_KEY, "detail", studentId],
      enabled: enabled && !!studentId,
      queryFn: () =>
        studentsApi()
          .get("/GetStudent", { params: { studentId } })
          .then((res) => res.data),
    })

  return {
    useFetchStudents,
    useFetchStudentById,
  }
}