import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/core/contexts/AuthContext"

interface RegisterPageProps {
  onRegister: () => void
  onGoToLogin: () => void
}

export default function RegisterPage({ onRegister, onGoToLogin }: RegisterPageProps) {
  const { register, isLoading, error: authError } = useAuth()
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Title: "",
    Department: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  })

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!form.FirstName || !form.LastName || !form.Email || !form.Password || !form.ConfirmPassword) {
      setError("Please fill in all required fields.")
      return
    }

    if (form.Password !== form.ConfirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      await register(form)
      onRegister()
    } catch {
      setError(authError || "Registration failed. Please try again.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="space-y-1">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="text-xs font-light text-primary-foreground">UWS</span>
              </div>
              <span className="font-semibold text-foreground">UWS Attendance System</span>
            </div>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Register as a lecturer</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="firstName"
                    placeholder="Jane"
                    value={form.FirstName}
                    onChange={(e) => handleChange("FirstName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={form.LastName}
                    onChange={(e) => handleChange("LastName", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input
                  id="middleName"
                  placeholder="Ann"
                  value={form.MiddleName}
                  onChange={(e) => handleChange("MiddleName", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="title">Title <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Input
                    id="title"
                    placeholder="Dr."
                    value={form.Title}
                    onChange={(e) => handleChange("Title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Input
                    id="department"
                    placeholder="Computer Science"
                    value={form.Department}
                    onChange={(e) => handleChange("Department", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.ac.uk"
                  value={form.Email}
                  onChange={(e) => handleChange("Email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.Password}
                  onChange={(e) => handleChange("Password", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password <span className="text-destructive">*</span></Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={form.ConfirmPassword}
                  onChange={(e) => handleChange("ConfirmPassword", e.target.value)}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account…" : "Create account"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Button variant="link" className="h-auto p-0 text-sm" onClick={onGoToLogin}>
                  Sign in
                </Button>
              </p>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          University of the West of Scotland — Attendance Management System
        </p>
      </div>
    </div>
  )
}