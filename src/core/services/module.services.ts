// import { useQuery } from "@tanstack/react-query"
// import { getAxios } from "@/lib/axios"
// import { getConfig } from "@/lib/utils"
// import {
//   ApiResponse,
//   IRequestErrorResponse,
//   ModuleDetail,
//   ModuleListItem,
// } from "@/core/interfaces/module.interfaces"

// const apiAxios = (route: string) =>
//   getAxios(getConfig().apiBaseUrl + route)

// const modulesApi = () => apiAxios("/Modules")
// const MODULES_QUERY_KEY = ["modules"]

// export const useModuleService = () => {
//   const useFetchModules = (enabled: boolean = true) =>
//     useQuery<ApiResponse<ModuleListItem[]>, IRequestErrorResponse>({
//       queryKey: [...MODULES_QUERY_KEY, "list"],
//       enabled,
//       queryFn: () =>
//         modulesApi()
//           .get("/GetModules")
//           .then((res) => res.data),
//     })

//   const useFetchModuleById = (
//     lecturerId?: number | string,
//     moduleCode?: string,
//     enabled: boolean = true
//   ) =>
//     useQuery<ApiResponse<ModuleDetail>, IRequestErrorResponse>({
//       queryKey: [...MODULES_QUERY_KEY, "detail", { lecturerId, moduleCode }],
//       enabled: enabled && !!lecturerId && !!moduleCode,
//       queryFn: () =>
//         modulesApi()
//           .get("/GetModule", { params: { lecturerId, moduleCode } })
//           .then((res) => res.data),
//     })

//   return {
//     useFetchModules,
//     useFetchModuleById,
//   }
// }


import { useQuery } from "@tanstack/react-query"
import { getAxios } from "@/lib/axios"
import { getConfig } from "@/lib/utils"
import type {
  IRequestErrorResponse,
  ModuleDetail,
  ModuleListItem,
} from "@/core/interfaces/module.interfaces"

const apiAxios = (route: string) =>
  getAxios(getConfig().apiBaseUrl + route)

const modulesApi = () => apiAxios("/Modules")
const MODULES_QUERY_KEY = ["modules"]

export const useModuleService = () => {
  const useFetchModules = (lecturerId?: string, enabled: boolean = true) =>
    useQuery<ModuleListItem[], IRequestErrorResponse>({
      queryKey: [...MODULES_QUERY_KEY, "list", { lecturerId }],
      enabled: enabled && !!lecturerId,
      queryFn: () =>
        modulesApi()
          .get("/GetModules", { params: { lecturerId } })
          .then((res) => res.data),
    })

  const useFetchModuleById = (
    lecturerId?: string,
    moduleCode?: string,
    enabled: boolean = true
  ) =>
    useQuery<ModuleDetail, IRequestErrorResponse>({
      queryKey: [...MODULES_QUERY_KEY, "detail", { lecturerId, moduleCode }],
      enabled: enabled && !!lecturerId && !!moduleCode,
      queryFn: () =>
        modulesApi()
          .get("/GetModule", { params: { lecturerId, moduleCode } })
          .then((res) => res.data),
    })

  return {
    useFetchModules,
    useFetchModuleById,
  }
}