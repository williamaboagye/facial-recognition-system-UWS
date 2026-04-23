// import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react"
// import { useAuthService } from "@/core/services/auth.services"
// import type { AuthContextType } from "@/core/interfaces/auth.interfaces"

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [accessToken, setAccessToken] = useState<string | null>(() =>
//     localStorage.getItem("accessToken")
//   )
//   const [refreshToken, setRefreshToken] = useState<string | null>(() =>
//     localStorage.getItem("refreshToken")
//   )
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)

//   const { useLogin, useLogout, useRefreshToken } = useAuthService()
//   const loginMutation = useLogin()
//   const logoutMutation = useLogout()
//   const refreshMutation = useRefreshToken()

//   // Set authorization header whenever token changes
//   useEffect(() => {
//     if (accessToken) {
//       // This sets the default header for all future requests
//       const script = document.createElement("script")
//       // Store token in a way axios can access it
//       window.localStorage.setItem("_auth_token", accessToken)
//     }
//   }, [accessToken])

//   const handleRefreshToken = useCallback(async (): Promise<string | null> => {
//     if (!refreshToken) {
//       return null
//     }
//     try {
//       const result = await refreshMutation.mutateAsync(refreshToken)
//     //   if (result.data) {
//         const { Token: newAccessToken, refreshToken: newRefreshToken } = result
//         setAccessToken(newAccessToken)
//         setRefreshToken(newRefreshToken)
//         localStorage.setItem("accessToken", newAccessToken)
//         localStorage.setItem("refreshToken", newRefreshToken)
//         localStorage.setItem("_auth_token", newAccessToken)
//         return newAccessToken
//     //   }
//     } catch (err) {
//       // If refresh fails, clear tokens and redirect to login
//       setAccessToken(null)
//       setRefreshToken(null)
//       localStorage.removeItem("accessToken")
//       localStorage.removeItem("refreshToken")
//       localStorage.removeItem("_auth_token")
//     }
//     return null
//   }, [refreshToken, refreshMutation])

//   const login = useCallback(
//     async (email: string, password: string) => {
//       setError(null)
//       setIsLoading(true)
//       try {
//         const result = await loginMutation.mutateAsync({ Email: email, Password: password })
//         // if (result.data) {
//           const { Token: newAccessToken, refreshToken: newRefreshToken } = result
//           setAccessToken(newAccessToken)
//           setRefreshToken(newRefreshToken)
//           localStorage.setItem("accessToken", newAccessToken)
//           localStorage.setItem("refreshToken", newRefreshToken)
//           localStorage.setItem("_auth_token", newAccessToken)
//         // }
//       } catch (err) {
//         const message = err instanceof Error ? err.message : "Login failed"
//         setError(message)
//         throw err
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [loginMutation]
//   )

//   const logout = useCallback(async () => {
//     setError(null)
//     setIsLoading(true)
//     try {
//       if (refreshToken) {
//         await logoutMutation.mutateAsync({
//           RefreshToken: refreshToken,
//           IsLogoutFromAllDevices: true,
//         })
//       }
//       setAccessToken(null)
//       setRefreshToken(null)
//       localStorage.removeItem("accessToken")
//       localStorage.removeItem("refreshToken")
//       localStorage.removeItem("_auth_token")
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Logout failed"
//       setError(message)
//       // Still clear tokens even if logout API call fails
//       setAccessToken(null)
//       setRefreshToken(null)
//       localStorage.removeItem("accessToken")
//       localStorage.removeItem("refreshToken")
//       localStorage.removeItem("_auth_token")
//       throw err
//     } finally {
//       setIsLoading(false)
//     }
//   }, [refreshToken, logoutMutation])

//   const value: AuthContextType = {
//     accessToken,
//     refreshToken,
//     isAuthenticated: !!accessToken,
//     login,
//     logout,
//     isLoading,
//     error,
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }


import { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import { useAuthService } from "@/core/services/auth.services"
import { setRefreshCallback, setLogoutCallback } from "@/lib/axios"
import type { AuthContextType, AuthUser, TokenClaims, RegisterRequest } from "@/core/interfaces/auth.interfaces"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function decodeUser(token: string): AuthUser | null {
  try {
    const claims = jwtDecode<TokenClaims>(token)
    return {
      id: claims.sub,
      name: claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      email: claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      role: claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken")
  )
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    localStorage.getItem("refreshToken")
  )
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { useLogin, useLogout, useRefreshToken, useRegister} = useAuthService()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()
  const refreshMutation = useRefreshToken()
  const registerMutation = useRegister()


  const user = useMemo<AuthUser | null>(() => {
    if (!accessToken) return null
    return decodeUser(accessToken)
  }, [accessToken])

  const handleRefreshToken = useCallback(async (): Promise<string | null> => {
    if (!refreshToken) return null
    try {
      const result = await refreshMutation.mutateAsync(refreshToken)
      const { Token: newAccessToken, RefreshToken: newRefreshToken } = result
      setAccessToken(newAccessToken)
      setRefreshToken(newRefreshToken)
      localStorage.setItem("accessToken", newAccessToken)
      localStorage.setItem("refreshToken", newRefreshToken)
      localStorage.setItem("_auth_token", newAccessToken)
      return newAccessToken
    } catch {
      setAccessToken(null)
      setRefreshToken(null)
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("_auth_token")
      return null
    }
  }, [refreshToken, refreshMutation])

  const clearAuth = useCallback(() => {
    setAccessToken(null)
    setRefreshToken(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("_auth_token")
  }, [])

  useEffect(() => {
    setRefreshCallback(handleRefreshToken)
    setLogoutCallback(clearAuth)
  }, [handleRefreshToken, clearAuth])

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null)
      setIsLoading(true)
      try {
        const result = await loginMutation.mutateAsync({ Email: email, Password: password })
        const { Token: newAccessToken, RefreshToken: newRefreshToken } = result
        setAccessToken(newAccessToken)
        setRefreshToken(newRefreshToken)
        localStorage.setItem("accessToken", newAccessToken)
        localStorage.setItem("refreshToken", newRefreshToken)
        localStorage.setItem("_auth_token", newAccessToken)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed"
        setError(message)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [loginMutation]
  )

  const logout = useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
      if (refreshToken) {
        await logoutMutation.mutateAsync({
          RefreshToken: refreshToken,
          IsLogoutFromAllDevices: true,
        })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed"
      setError(message)
    } finally {
      setAccessToken(null)
      setRefreshToken(null)
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("_auth_token")
      setIsLoading(false)
    }
  }, [refreshToken, logoutMutation])

  const register = useCallback(async (data: RegisterRequest) => {
    setError(null)
    setIsLoading(true)
    try {
      await registerMutation.mutateAsync(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [registerMutation])

  const value: AuthContextType = {
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken,
    user,
    login,
    logout,
    register,
    isLoading,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}