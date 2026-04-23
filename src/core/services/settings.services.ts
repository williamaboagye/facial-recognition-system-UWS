import { useMutation } from "@tanstack/react-query"
import { getAxios } from "@/lib/axios"
import { getConfig } from "@/lib/utils"
import { UpdateUserRequest } from "../interfaces/settings.interfaces"

const settingsApi = () => getAxios(getConfig().apiBaseUrl + "/Settings")

export const useSettingsService = () => {
  const useUpdateUser = () =>
    useMutation<void, Error, UpdateUserRequest>({
      mutationFn: (data) =>
        settingsApi()
          .post<void>("/UpdateUser", data)
          .then((res) => res.data),
    })

  return { useUpdateUser }
}