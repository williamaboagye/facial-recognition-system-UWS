import { useQuery } from "@tanstack/react-query"
import { getConfig } from "@/lib/utils"
import { getAxios } from "@/lib/axios"
import type { AnalyticsReport } from "@/core/interfaces/analytics.interfaces"
import type { IRequestErrorResponse } from "@/core/interfaces/student.interfaces"

const ANALYTICS_QUERY_KEY = ["analytics"]

const analyticsApi = () => getAxios(getConfig().apiBaseUrl + "/AnalyticsReport")

export const useAnalyticsService = () => {
  const useFetchAnalyticsReport = (enabled: boolean = true) =>
    useQuery<AnalyticsReport, IRequestErrorResponse>({
      queryKey: [...ANALYTICS_QUERY_KEY, "report"],
      enabled,
      queryFn: () =>
        analyticsApi()
          .get("/GetAnalyticsReport")
          .then((res) => res.data),
    })

  return { useFetchAnalyticsReport }
}
