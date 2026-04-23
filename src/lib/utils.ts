import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AxiosError, AxiosResponse } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getConfig() {
  return {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5024",
  }
}

export const checkError = (error: AxiosError): string => {
  const response = error.response as AxiosResponse
  if (response?.data && response.data?.message) {
    return response?.data?.message
  }
  return 'There was an issue processing your request'
}