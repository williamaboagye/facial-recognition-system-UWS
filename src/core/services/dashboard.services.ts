import { useQuery } from "@tanstack/react-query"
import { getConfig } from "@/lib/utils"
import { getAxios } from "@/lib/axios"
import type { DashboardStats } from "@/core/interfaces/dashboard.interfaces"
import type { IRequestErrorResponse } from "@/core/interfaces/student.interfaces"

const DASHBOARD_QUERY_KEY = ["dashboard"]

const dashboardApi = () => {
  return getAxios(getConfig().apiBaseUrl + "/Dashboard")
}

export const useDashboardService = () => {
  const useFetchDashboardStats = (enabled: boolean = true) =>
    useQuery<DashboardStats, IRequestErrorResponse>({
      queryKey: [...DASHBOARD_QUERY_KEY, "stats"],
      enabled,
      queryFn: () =>
        dashboardApi()
          .get("/GetDashboardStats")
          .then((res) => res.data),
    })

  return { useFetchDashboardStats }
}
