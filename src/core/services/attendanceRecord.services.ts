import { useQuery } from "@tanstack/react-query"
import { getConfig } from "@/lib/utils"
import { getAxios } from "@/lib/axios"
import type { AttendanceRecordItem } from "@/core/interfaces/attendanceRecord.interfaces"
import type { IRequestErrorResponse } from "@/core/interfaces/student.interfaces"

const ATTENDANCE_RECORDS_QUERY_KEY = ["attendanceRecords"]

const attendanceRecordsApi = () => {
  return getAxios(getConfig().apiBaseUrl + "/AttendanceRecords")
}

export const useAttendanceRecordService = () => {
  const useFetchAttendanceRecords = (moduleId?: string | null, enabled: boolean = true) =>
    useQuery<AttendanceRecordItem[], IRequestErrorResponse>({
      queryKey: [...ATTENDANCE_RECORDS_QUERY_KEY, "list", { moduleId }],
      enabled,
      queryFn: () =>
        attendanceRecordsApi()
          .get("/GetAttendanceRecords", { params: { moduleId } })
          .then((res) => res.data),
    })

  return { useFetchAttendanceRecords }
}
