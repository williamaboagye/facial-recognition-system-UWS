export interface LoginRequest {
  Email: string
  Password: string
}

export interface LoginResponse {
  Token: string
  RefreshToken: string
//   tokenType: string
//   expiresIn: number
}

export interface LogoutRequest {
  RefreshToken: string
  IsLogoutFromAllDevices: boolean
}

export interface RegisterRequest {
  FirstName: string
  MiddleName: string
  LastName: string
  Title: string
  Department: string
  Email: string
  Password: string
  ConfirmPassword: string
}


export interface ProfileResponse {
  FirsName: string
  MiddleName: string
  LastName: string
  Email: string
  Department: string
  Title: string
  ConsecutiveAbsencesFlag: number
  PercentageAbsencesFlag: number
}

export interface TokenClaims {
  sub: string
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string
  exp: number
  iss: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

export interface AuthContextType {
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
 register: (data: RegisterRequest) => Promise<void>
  isLoading: boolean
  error: string | null
}
