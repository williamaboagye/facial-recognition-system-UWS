import { students, modules } from "@/data/mockData"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import type { Student, Module } from "@/types"

export default function AtRiskStudents() {
  const atRisk = students.filter((s: Student) => s.status === "at-risk")

  const getModule = (moduleId: string): Module | undefined =>
    modules.find((m) => m.id === moduleId)

  return (
    <div className="space-y-6">
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{atRisk.length} students flagged</AlertTitle>
        <AlertDescription>
          Criteria: attendance rate below 70% or 3+ consecutive absences.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {atRisk.map((s: Student) => {
          const mod = getModule(s.moduleId)
          const isHighRisk = s.consecutiveAbsences >= 5

          return (
            <Card key={s.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{s.name}</CardTitle>
                      <Badge variant={isHighRisk ? "destructive" : "warning"}>
                        {isHighRisk ? "High Risk" : "Moderate Risk"}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {s.studentId} · {mod?.code} — {mod?.name}
                    </p>
                  </div>
                  <Button size="sm">Contact Student</Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-xl font-bold text-destructive">{s.attendanceRate}%</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Attendance Rate</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-xl font-bold text-orange-500">{s.consecutiveAbsences}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Consecutive Absences</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-xl font-bold">{100 - s.attendanceRate}%</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Absence Rate</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Attendance progress</span>
                    <span>Target: 70%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-destructive transition-all"
                      style={{ width: `${s.attendanceRate}%` }}
                    />
                  </div>
                </div>

                {/* Flag reasons */}
                <div className="flex flex-wrap gap-1.5">
                  {s.attendanceRate < 70 && (
                    <Badge variant="outline" className="border-destructive/40 text-destructive">
                      Below 70% threshold
                    </Badge>
                  )}
                  {s.consecutiveAbsences >= 3 && (
                    <Badge variant="outline" className="border-orange-300 text-orange-600">
                      {s.consecutiveAbsences} consecutive absences
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
