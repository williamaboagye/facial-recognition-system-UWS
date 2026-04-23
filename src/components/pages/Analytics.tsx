import { useAnalyticsService } from "@/core/services/analytics.services"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"

export default function Analytics() {
  const { useFetchAnalyticsReport } = useAnalyticsService()
  const { data, isLoading, isError } = useFetchAnalyticsReport()

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load analytics report. Please try again.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Monthly trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Monthly Attendance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[220px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data?.MonthlyTrends ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="Month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} unit="%" />
                <Tooltip formatter={(v: number) => [`${v}%`, "Attendance Rate"]} />
                <Line type="monotone" dataKey="PercentagePresent" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Two-column charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">This Week — Daily Rate</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data?.CurrentWeekDailyRates ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="DayOfWeek" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} unit="%" />
                  <Tooltip formatter={(v: number) => [`${v}%`, "Rate"]} />
                  <Bar dataKey="PercentagePresent" fill="hsl(var(--primary))" opacity={0.7} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Attendance by Module</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data?.ModuleAttendanceRates ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="ModuleCode" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} unit="%" />
                  <Tooltip formatter={(v: number) => [`${v}%`, "Rate"]} />
                  <Bar dataKey="PercentagePresent" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* At-risk table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">At-Risk Student Breakdown</CardTitle>
            {!isLoading && (
              <Badge variant="destructive">{data?.TotalAtRiskStudents ?? 0} students</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Attendance Rate</TableHead>
                  <TableHead>Consecutive Absences</TableHead>
                  <TableHead>Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.AtRiskStudents ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      No at-risk students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  (data?.AtRiskStudents ?? []).map((s) => (
                    <TableRow key={s.StudentId}>
                      <TableCell className="font-medium">{s.FullName}</TableCell>
                      <TableCell className="text-muted-foreground">{s.StudentId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-destructive" style={{ width: `${s.AttendanceRate}%` }} />
                          </div>
                          <span className="text-sm font-medium text-destructive">{s.AttendanceRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{s.ConsecutiveAbsences}</TableCell>
                      <TableCell>
                        <Badge variant={s.RiskLevel.toLowerCase() === "high" ? "destructive" : "warning"}>
                          {s.RiskLevel}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
