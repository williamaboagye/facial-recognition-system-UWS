import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboardService } from "@/core/services/dashboard.services"
import type { ModuleInfo, RecentSession, AtRiskStudent } from "@/core/interfaces/dashboard.interfaces"

function getAttendanceColor(rate: number): string {
  if (rate >= 80) return "text-green-600"
  if (rate >= 70) return "text-yellow-600"
  return "text-destructive"
}

interface StatCardProps {
  label: string
  value: string | number
  sub: string
  valueClass?: string
}

function StatCard({ label, value, sub, valueClass = "text-foreground" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`mt-1 text-3xl font-bold ${valueClass}`}>{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { useFetchDashboardStats } = useDashboardService()
  const { data, isLoading } = useFetchDashboardStats()

  const stats = useMemo(() => data, [data])

  const modules = useMemo(() => stats?.Modules ?? [], [stats])
  const recentSessions = useMemo(() => stats?.RecentSessions ?? [], [stats])
  const atRiskStudents = useMemo(() => stats?.AtRiskStudents ?? [], [stats])
  const avgRate = useMemo(() => stats?.SemesterAverageAttendance ?? 0, [stats])
  const atRiskCount = useMemo(() => stats?.TotalAtRiskStudents ?? 0, [stats])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading ? (
          <>
            <Card>
              <CardContent className="p-5">
                <Skeleton className="mb-3 h-4 w-24" />
                <Skeleton className="mb-2 h-8 w-12" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <Skeleton className="mb-3 h-4 w-24" />
                <Skeleton className="mb-2 h-8 w-12" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <Skeleton className="mb-3 h-4 w-24" />
                <Skeleton className="mb-2 h-8 w-12" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <Skeleton className="mb-3 h-4 w-24" />
                <Skeleton className="mb-2 h-8 w-12" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <StatCard label="Total Modules" value={modules.length} sub="Active this semester" />
            <StatCard label="Total Students" value={stats?.Modules.reduce((sum: number, m: ModuleInfo) => sum + m.Periods.length, 0) ?? 0} sub="Across all modules" />
            <StatCard label="Avg Attendance" value={`${avgRate}%`} sub="This semester" valueClass="text-primary" />
            <StatCard label="At-Risk Students" value={atRiskCount} sub="Need attention" valueClass="text-destructive" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Your Modules</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {isLoading ? (
                <>
                  <li className="space-y-2 px-6 py-3">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-60" />
                  </li>
                  <li className="space-y-2 px-6 py-3">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-60" />
                  </li>
                  <li className="space-y-2 px-6 py-3">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-60" />
                  </li>
                </>
              ) : (
                modules.map((m: ModuleInfo) => (
                  <li key={m.Code} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <p className="text-sm font-medium">{m.Code} - {m.Name}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.Periods.length} periods
                      </p>
                    </div>
                    <span className={`text-sm font-semibold ${getAttendanceColor(m.AverageAttendancePercentage)}`}>
                      {m.AverageAttendancePercentage}%
                    </span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {isLoading ? (
                <>
                  <li className="space-y-3 px-6 py-3">
                    <div>
                      <Skeleton className="mb-1 h-4 w-32" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                    <Skeleton className="h-1.5 w-full" />
                  </li>
                  <li className="space-y-3 px-6 py-3">
                    <div>
                      <Skeleton className="mb-1 h-4 w-32" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                    <Skeleton className="h-1.5 w-full" />
                  </li>
                  <li className="space-y-3 px-6 py-3">
                    <div>
                      <Skeleton className="mb-1 h-4 w-32" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                    <Skeleton className="h-1.5 w-full" />
                  </li>
                </>
              ) : (
                recentSessions.map((s: RecentSession, idx: number) => (
                  <li key={idx} className="px-6 py-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{s.ModuleName}</p>
                        <p className="text-xs text-muted-foreground">{s.SessionDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{s.NumberPresent}/{s.TotalStudents}</p>
                        <p className="text-xs text-muted-foreground">present</p>
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.round((s.NumberPresent / s.TotalStudents) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">At-Risk Students</CardTitle>
            <Badge variant="destructive">{atRiskCount} flagged</Badge>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <ul className="divide-y">
            {isLoading ? (
              <>
                <li className="space-y-2 px-6 py-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-3 w-64" />
                </li>
                <li className="space-y-2 px-6 py-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-3 w-64" />
                </li>
                <li className="space-y-2 px-6 py-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-3 w-64" />
                </li>
              </>
            ) : (
              atRiskStudents.map((s: AtRiskStudent, idx: number) => (
                <li key={idx} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium">{s.FullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.ConsecutiveAbsences} consecutive absences - {s.AbsencePercentage}% absence rate
                    </p>
                  </div>
                  <Badge variant="destructive">At Risk</Badge>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
