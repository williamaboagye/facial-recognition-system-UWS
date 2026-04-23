// import { useState } from "react"
// import { attendanceSessions, modules } from "@/data/mockData"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import type { AttendanceSession } from "@/types"

// export default function AttendanceRecords() {
//   const [selectedModule, setSelectedModule] = useState<string>("all")
//   const [selectedSession, setSelectedSession] = useState<string | null>(null)

//   const filtered: AttendanceSession[] =
//     selectedModule === "all"
//       ? attendanceSessions
//       : attendanceSessions.filter((s) => s.moduleId === selectedModule)

//   // ── Session detail view ────────────────────────────────────────────────────
//   if (selectedSession) {
//     const session = attendanceSessions.find((s) => s.id === selectedSession)!
//     return (
//       <div className="max-w-3xl space-y-4">
//         <Button variant="ghost" size="sm" onClick={() => setSelectedSession(null)} className="text-primary">
//           ← Back to Records
//         </Button>

//         <Card>
//           <CardHeader>
//             <CardTitle>{session.moduleName}</CardTitle>
//             <CardDescription>{session.date} · {session.time}</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {/* Summary pills */}
//             <div className="flex gap-4">
//               <div className="rounded-lg bg-green-50 px-4 py-2 text-center">
//                 <p className="text-xs text-muted-foreground">Present</p>
//                 <p className="text-xl font-bold text-green-600">{session.present}</p>
//               </div>
//               <div className="rounded-lg bg-red-50 px-4 py-2 text-center">
//                 <p className="text-xs text-muted-foreground">Absent</p>
//                 <p className="text-xl font-bold text-destructive">{session.absent}</p>
//               </div>
//               <div className="rounded-lg bg-muted px-4 py-2 text-center">
//                 <p className="text-xs text-muted-foreground">Total</p>
//                 <p className="text-xl font-bold">{session.totalStudents}</p>
//               </div>
//             </div>

//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Student</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Time</TableHead>
//                   <TableHead>Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {session.records.map((r) => (
//                   <TableRow key={r.studentId}>
//                     <TableCell className="font-medium">{r.name}</TableCell>
//                     <TableCell>
//                       <Badge variant={r.status === "Present" ? "success" : "destructive"}>
//                         {r.status}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-muted-foreground">{r.time ?? "—"}</TableCell>
//                     <TableCell>
//                       <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary">
//                         Edit
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   // ── Sessions list ──────────────────────────────────────────────────────────
//   return (
//     <div className=" space-y-6">
//       <div className="flex items-center gap-3">
//         <Select value={selectedModule} onValueChange={setSelectedModule}>
//           <SelectTrigger className="w-64">
//             <SelectValue placeholder="All Modules" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Modules</SelectItem>
//             {modules.map((m) => (
//               <SelectItem key={m.id} value={m.id}>{m.code} — {m.name}</SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <p className="text-sm text-muted-foreground">{filtered.length} sessions</p>
//       </div>

//       <Card>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Module</TableHead>
//                 <TableHead>Date</TableHead>
//                 <TableHead>Time</TableHead>
//                 <TableHead>Present</TableHead>
//                 <TableHead>Absent</TableHead>
//                 <TableHead>Rate</TableHead>
//                 <TableHead />
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filtered.map((s) => (
//                 <TableRow key={s.id}>
//                   <TableCell className="font-medium">{s.moduleName}</TableCell>
//                   <TableCell className="text-muted-foreground">{s.date}</TableCell>
//                   <TableCell className="text-muted-foreground">{s.time}</TableCell>
//                   <TableCell className="font-medium text-green-600">{s.present}</TableCell>
//                   <TableCell className="font-medium text-destructive">{s.absent}</TableCell>
//                   <TableCell>
//                     <Badge variant="outline" className="text-primary border-primary/30">
//                       {Math.round((s.present / s.totalStudents) * 100)}%
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => setSelectedSession(s.id)}
//                       className="text-primary h-auto p-0 text-xs"
//                     >
//                       View →
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAttendanceRecordService } from "@/core/services/attendanceRecord.services"
import { useModuleService } from "@/core/services/module.services"
import { useAuth } from "@/core/contexts/AuthContext"
import type { AttendanceRecordItem } from "@/core/interfaces/attendanceRecord.interfaces"

interface FlatRecord {
  studentName: string
  studentId: string
  moduleName: string
  moduleCode: string
  date: string
  status: string
}

export default function AttendanceRecords() {
  const { user } = useAuth()
  const { useFetchModules } = useModuleService()
  const { useFetchAttendanceRecords } = useAttendanceRecordService()

  const [moduleFilter, setModuleFilter] = useState<string>("all")
  const [studentFilter, setStudentFilter] = useState<string>("")

  const { data: modulesData, isLoading: modulesLoading } = useFetchModules(user?.id, !!user?.id)

  const moduleId = moduleFilter === "all" ? null : moduleFilter
  const { data, isLoading } = useFetchAttendanceRecords(moduleId)

  const allRecords: FlatRecord[] = useMemo(() => {
    return (data ?? []).map((r: AttendanceRecordItem) => ({
      studentName: r.StudentFullName,
      studentId: r.StudentId,
      moduleName: r.ModuleName,
      moduleCode: r.ModuleCode,
      date: new Date(r.DateofAttendance).toLocaleDateString(),
      status: r.Status,
    }))
  }, [data])

  const filtered = useMemo(() => {
    return allRecords.filter((r) =>
      !studentFilter ||
      r.studentName.toLowerCase().includes(studentFilter.toLowerCase()) ||
      r.studentId.toLowerCase().includes(studentFilter.toLowerCase())
    )
  }, [allRecords, studentFilter])

  return (
    <div className=" space-y-6">
      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Module filter */}
        <Select value={moduleFilter} onValueChange={setModuleFilter} disabled={modulesLoading}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All Modules" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {(modulesData ?? []).map((m) => (
              <SelectItem key={m.ModuleId} value={m.ModuleOfferingId.toString()}>
                {m.ModuleCode} — {m.ModuleName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date filter */}
        {/* <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-44"
        /> */}

        {/* Student filter */}
        <Input
          placeholder="Search student…"
          value={studentFilter}
          onChange={(e) => setStudentFilter(e.target.value)}
          className="w-full max-w-xl"
        />

        {/* <p className="ml-auto text-sm text-muted-foreground">
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        </p> */}
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  <TableRow>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                  </TableRow>
                </>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                    No records match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <p className="font-medium">{r.studentName}</p>
                      <p className="text-xs text-muted-foreground">{r.studentId}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{r.moduleCode}</p>
                      <p className="text-xs text-muted-foreground">{r.moduleName}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          r.status === "Present"
                            ? "success"
                            : r.status === "Absent"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}