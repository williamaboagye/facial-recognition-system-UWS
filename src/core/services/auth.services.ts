import { useMutation, useQuery } from "@tanstack/react-query"
import { getConfig } from "@/lib/utils"
import { getAxios } from "@/lib/axios"
import type { LoginRequest, LoginResponse, LogoutRequest, ProfileResponse, RegisterRequest } from "@/core/interfaces/auth.interfaces"
import type { ApiResponse } from "@/core/interfaces/student.interfaces"

const authApi = () => {
  return getAxios(getConfig().apiBaseUrl + "/Auth")
}

export const useAuthService = () => {
  const useLogin = () =>
    // useMutation<ApiResponse<LoginResponse>, Error, LoginRequest>({
     useMutation<LoginResponse, Error, LoginRequest>({
      mutationFn: (credentials) =>
        authApi()
        //   .post<ApiResponse<LoginResponse>>("/Login", credentials)
          .post<LoginResponse>("/Login", credentials)
          .then((res) => res.data),
    })

  const useLogout = () =>
    useMutation<void, Error, LogoutRequest>({
      mutationFn: (data) =>
        authApi()
          .post<void>("/Logout", data)
          .then((res) => res.data),
    })


const useRefreshToken = () =>
  useMutation<LoginResponse, Error, string>({
    mutationFn: (refreshToken) =>
      authApi()
        .post<LoginResponse>("/RefreshToken", { RefreshToken: refreshToken })
        .then((res) => res.data as LoginResponse),
  })

   const useRegister = () =>
    useMutation<void, Error, RegisterRequest>({
      mutationFn: (data) =>
        authApi()
          .post<void>("/Register", data)
          .then((res) => res.data),
    })

    const useGetProfile = (enabled: boolean = true) =>
    useQuery<ProfileResponse, Error>({
      queryKey: ["profile"],
      enabled,
      queryFn: () =>
        authApi()
          .get<ProfileResponse>("/GetProfile")
          .then((res) => res.data),
    })

    
  return { useLogin, useLogout, useRefreshToken, useRegister, useGetProfile }
}
