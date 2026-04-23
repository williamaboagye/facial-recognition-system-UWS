// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
// import { useAuth } from "@/core/contexts/AuthContext"
// import AppLayout from "@/components/layout/AppLayout"
// import LoginPage from "@/components/pages/LoginPage"
// import Dashboard from "@/components/pages/Dashboard"
// import TakeAttendance from "@/components/pages/TakeAttendance"
// import AttendanceRecords from "@/components/pages/AttendanceRecords"
// import Analytics from "@/components/pages/Analytics"
// import AtRiskStudents from "@/components/pages/AtRiskStudents"
// import StudentManagement from "@/components/pages/Student Management/StudentManagement"
// import ModuleManagement from "@/components/pages/Module Management/ModuleManagement"
// import Settings from "@/components/pages/Settings"

// export default function App() {
//   const { isAuthenticated, logout } = useAuth()

//   if (!isAuthenticated) {
//     return <LoginPage onLogin={() => {}} />
//   }


//   return (
//     <BrowserRouter>
//       <AppLayout onLogout={logout}>
//         <Routes>
//           <Route path="/"                    element={<Navigate to="/dashboard" replace />} />
//           <Route path="/dashboard"           element={<Dashboard />} />
//           <Route path="/take-attendance"     element={<TakeAttendance />} />
//           <Route path="/attendance-records"  element={<AttendanceRecords />} />
//           <Route path="/analytics"           element={<Analytics />} />
//           <Route path="/at-risk-students"    element={<AtRiskStudents />} />
//           <Route path="/student-management"  element={<StudentManagement />} />
//           <Route path="/module-management"   element={<ModuleManagement />} />
//           <Route path="/settings"            element={<Settings />} />
//         </Routes>
//       </AppLayout>
//     </BrowserRouter>
//   )
// }



import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "@/core/contexts/AuthContext"
import AppLayout from "@/components/layout/AppLayout"
import LoginPage from "@/components/pages/LoginPage"
import RegisterPage from "@/components/pages/RegisterPage"
import Dashboard from "@/components/pages/Dashboard"
import TakeAttendance from "@/components/pages/TakeAttendance"
import AttendanceRecords from "@/components/pages/AttendanceRecords"
import Analytics from "@/components/pages/Analytics"
import AtRiskStudents from "@/components/pages/AtRiskStudents"
import StudentManagement from "@/components/pages/Student Management/StudentManagement"
import ModuleManagement from "@/components/pages/Module Management/ModuleManagement"
import Settings from "@/components/pages/Settings"

export default function App() {
  const { isAuthenticated, logout } = useAuth()
  const [authView, setAuthView] = useState<"login" | "register">("login")

  if (!isAuthenticated) {
    if (authView === "register") {
      return (
        <RegisterPage
          onRegister={() => setAuthView("login")}
          onGoToLogin={() => setAuthView("login")}
        />
      )
    }
    return (
      <LoginPage
        onLogin={() => {}}
        onGoToRegister={() => setAuthView("register")}
      />
    )
  }

  return (
    <BrowserRouter>
      <AppLayout onLogout={logout}>
        <Routes>
          <Route path="/"                    element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"           element={<Dashboard />} />
          <Route path="/take-attendance"     element={<TakeAttendance />} />
          <Route path="/attendance-records"  element={<AttendanceRecords />} />
          <Route path="/analytics"           element={<Analytics />} />
          <Route path="/at-risk-students"    element={<AtRiskStudents />} />
          <Route path="/student-management"  element={<StudentManagement />} />
          <Route path="/module-management"   element={<ModuleManagement />} />
          <Route path="/settings"            element={<Settings />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}