
import { useState, useEffect, type FormEvent } from "react"
import { useAuthService } from "@/core/services/auth.services"
import { useSettingsService } from "@/core/services/settings.services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, AlertCircle } from "lucide-react"

interface PasswordForm {
  newPass: string
  confirm: string
}

export default function Settings() {
  const { useGetProfile } = useAuthService()
  const { useUpdateUser } = useSettingsService()

  const { data: profile, isLoading: profileLoading } = useGetProfile()
  const updateMutation = useUpdateUser()

  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [department, setDepartment] = useState("")
  const [passwords, setPasswords] = useState<PasswordForm>({ newPass: "", confirm: "" })
  const [consecutiveAbsencesFlag, setConsecutiveAbsencesFlag] = useState(3)
  const [percentageAbsencesFlag, setPercentageAbsencesFlag] = useState(70)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.FirsName ?? "")
      setMiddleName(profile.MiddleName ?? "")
      setLastName(profile.LastName ?? "")
      setEmail(profile.Email ?? "")
      setDepartment(profile.Department ?? "")
      setConsecutiveAbsencesFlag(profile.ConsecutiveAbsencesFlag ?? 3)
      setPercentageAbsencesFlag(profile.PercentageAbsencesFlag ?? 70)
    }
  }, [profile])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (passwords.newPass && passwords.newPass !== passwords.confirm) {
      setError("New passwords do not match.")
      return
    }

    try {
      await updateMutation.mutateAsync({
        FirstName: firstName,
        MiddleName: middleName,
        LastName: lastName,
        Email: email,
        Department: department,
        Password: passwords.newPass,
        ConsecutiveAbsencesFlag: consecutiveAbsencesFlag,
        PercentageAbsencesFlag: percentageAbsencesFlag,
      })
      setSaved(true)
      setPasswords({ newPass: "", confirm: "" })
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError("Failed to save settings. Please try again.")
    }
  }

  if (profileLoading) {
    return <div className="text-sm text-muted-foreground">Loading profile...</div>
  }

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-6">
      {saved && (
        <Alert variant="default" className="border-green-500 text-green-700">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Settings saved successfully.</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="middleName">Middle Name</Label>
            <Input
              id="middleName"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pemail">University Email</Label>
            <Input
              id="pemail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="pdept">Department</Label>
            <Input
              id="pdept"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div> */}
        </CardContent>
      </Card>

      {/* Password */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-sm">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pwnew">New Password</Label>
            <Input
              id="pwnew"
              type="password"
              placeholder="••••••••"
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pwconf">Confirm New Password</Label>
            <Input
              id="pwconf"
              type="password"
              placeholder="••••••••"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
          </div>
          <p className="text-xs text-muted-foreground">Leave blank to keep your current password.</p>
        </CardContent>
      </Card> */}

      {/* At-risk preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">At-Risk Alert Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pabsence">Flag after consecutive absences</Label>
            <Input
              id="pabsence"
              type="number"
              min={1}
              max={10}
              className="w-32"
              value={consecutiveAbsencesFlag}
              onChange={(e) => setConsecutiveAbsencesFlag(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pattend">Flag when attendance drops below (%)</Label>
            <Input
              id="pattend"
              type="number"
              min={0}
              max={100}
              className="w-32"
              value={percentageAbsencesFlag}
              onChange={(e) => setPercentageAbsencesFlag(Number(e.target.value))}
            />
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="emailAlerts"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            {/* <Label htmlFor="emailAlerts" className="cursor-pointer font-normal">
              Send email alerts when a student is flagged as at-risk
            </Label> */}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
        {updateMutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}