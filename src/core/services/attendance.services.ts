import { useMutation, useQuery } from "@tanstack/react-query"
import { getAxios } from "@/lib/axios"
import { getConfig } from "@/lib/utils"
import { CheckActiveSessionResponse, EndSessionRequest, MarkAttendanceRequest, RegisterStudentRequest, StartSessionRequest, StartSessionResponse } from "@/components/pages/Attendance/attendance.interfaces"


const attendanceApi = () => getAxios(getConfig().apiBaseUrl + "/Attendance")

export const useAttendanceService = () => {
  const useStartSession = () =>
    useMutation<StartSessionResponse, Error, StartSessionRequest>({
      mutationFn: (data) =>
        attendanceApi()
          .post<StartSessionResponse>("/StartSession", data)
          .then((res) => res.data as StartSessionResponse),
    })

  const useMarkAttendance = () =>
    useMutation<void, Error, MarkAttendanceRequest>({
      mutationFn: (data) =>
        attendanceApi()
          .post<void>("/MarkAttendance", data)
          .then((res) => res.data),
    })

  const useEndSession = () =>
    useMutation<void, Error, EndSessionRequest>({
      mutationFn: (data) =>
        attendanceApi()
          .post<void>("/EndSession", data)
          .then((res) => res.data),
    })

  const useRegisterStudent = () =>
    useMutation<void, Error, RegisterStudentRequest>({
      mutationFn: (data) =>
        attendanceApi()
          .post<void>("/RegisterStudent", data)
          .then((res) => res.data),
    })

  const useTrainModel = () =>
    useMutation<void, Error, void>({
      mutationFn: () =>
        attendanceApi()
          .post<void>("/TrainModel")
          .then((res) => res.data),
    })

  const useCheckActiveSession = (moduleOfferingId: number | null) =>
    useQuery<CheckActiveSessionResponse | null>({
      queryKey: ["attendance", "checkActiveSession", moduleOfferingId],
      queryFn: async () => {
        const res = await attendanceApi().get("/CheckActiveSession", {
          params: { moduleOfferingId },
          validateStatus: (status) => status === 200 || status === 204,
        })
        if (res.status === 204) return null
        return res.data as CheckActiveSessionResponse
      },
      enabled: !!moduleOfferingId,
    })

  return {
    useStartSession,
    useMarkAttendance,
    useEndSession,
    useRegisterStudent,
    useTrainModel,
    useCheckActiveSession,
  }
}