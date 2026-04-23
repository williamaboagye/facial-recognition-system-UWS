import axios, { AxiosInstance, AxiosError } from "axios"

let globalRefreshCallback: (() => Promise<string | null>) | null = null
let globalLogoutCallback: (() => void) | null = null

export function setRefreshCallback(callback: () => Promise<string | null>) {
  globalRefreshCallback = callback
}

export function setLogoutCallback(callback: () => void) {
  globalLogoutCallback = callback
}

export function getAxios(baseURL: string, onRefreshToken?: () => Promise<string | null>): AxiosInstance {
  const instance = axios.create({
    baseURL,
    // withCredentials: true,
  })

  // Add token to requests
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("_auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  let isRefreshing = false
  let failedQueue: Array<{
    resolve: (value: string) => void
    reject: (reason?: any) => void
  }> = []

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve(token || "")
      }
    })
    failedQueue = []
  }

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest.headers["X-Retry-Count"] &&
        !originalRequest.url?.includes("/RefreshToken")
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              return instance(originalRequest)
            })
            .catch((err) => Promise.reject(err))
        }

        isRefreshing = true

        const refreshFn = onRefreshToken ?? globalRefreshCallback

        try {
          const newToken = await refreshFn?.()
          if (newToken) {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              originalRequest.headers["X-Retry-Count"] = "1"
            }
            processQueue(null, newToken)
            return instance(originalRequest)
          } else {
            processQueue(null, null)
            globalLogoutCallback?.()
          }
        } catch (refreshError) {
          processQueue(refreshError, null)
          globalLogoutCallback?.()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    }
  )

  return instance
}
