// import { useState, useRef, useEffect } from "react"
// import { modules, students } from "@/data/mockData"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { CheckCircle, Video, VideoOff } from "lucide-react"
// import type { LiveRecord } from "@/types"

// export default function TakeAttendance() {
//   const [selectedModule, setSelectedModule] = useState<string>("")
//   const [sessionActive, setSessionActive]   = useState(false)
//   const [records, setRecords]               = useState<LiveRecord[]>([])
//   const [scanning, setScanning]             = useState(false)
//   const [sessionDone, setSessionDone]       = useState(false)
//   const videoRef  = useRef<HTMLVideoElement>(null)
//   const streamRef = useRef<MediaStream | null>(null)

//   const moduleStudents = students.filter((s) => s.moduleId === selectedModule)

//   const startSession = async () => {
//     if (!selectedModule) return
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true })
//       streamRef.current = stream
//       if (videoRef.current) videoRef.current.srcObject = stream
//       setSessionActive(true)
//       setRecords(moduleStudents.map((s) => ({ ...s, attendStatus: "Pending" as const })))
//     } catch {
//       alert("Could not access camera. Please allow camera access and try again.")
//     }
//   }

//   const stopStream = () => {
//     streamRef.current?.getTracks().forEach((t) => t.stop())
//     setSessionActive(false)
//     setScanning(false)
//   }

//   const markPresent = (studentId: string) => {
//     setRecords((prev) =>
//       prev.map((r) =>
//         r.id === studentId
//           ? { ...r, attendStatus: "Present" as const, markedAt: new Date().toLocaleTimeString() }
//           : r
//       )
//     )
//   }

//   // Simulates face scan — face-api.js integration replaces this
//   const simulateScan = () => {
//     setScanning(true)
//     setTimeout(() => {
//       const pending = records.find((r) => r.attendStatus === "Pending")
//       if (pending) markPresent(pending.id)
//       setScanning(false)
//     }, 1500)
//   }

//   const finishSession = () => {
//     stopStream()
//     setSessionDone(true)
//   }

//   const resetSession = () => {
//     setSelectedModule("")
//     setRecords([])
//     setSessionDone(false)
//   }

//   useEffect(() => () => stopStream(), [])

//   const presentCount = records.filter((r) => r.attendStatus === "Present").length

//   // ── Session complete ────────────────────────────────────────────────────────
//   if (sessionDone) {
//     return (
//       <div className="mx-auto max-w-xl space-y-4">
//         <Card>
//           <CardContent className="flex flex-col items-center p-8 text-center space-y-3">
//             <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
//               <CheckCircle className="h-7 w-7 text-green-600" />
//             </div>
//             <h2 className="text-xl font-semibold">Session Complete</h2>
//             <p className="text-sm text-muted-foreground">
//               {presentCount} of {records.length} students marked present.
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Student</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Time</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {records.map((r) => (
//                   <TableRow key={r.id}>
//                     <TableCell className="font-medium">{r.name}</TableCell>
//                     <TableCell>
//                       <Badge variant={r.attendStatus === "Present" ? "success" : "secondary"}>
//                         {r.attendStatus === "Pending" ? "Absent" : r.attendStatus}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-muted-foreground">{r.markedAt ?? "—"}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>

//         <Button onClick={resetSession} className="w-full">Start New Session</Button>
//       </div>
//     )
//   }

//   // ── Main UI ─────────────────────────────────────────────────────────────────
//   return (
//     <div className=" space-y-6">
//       {/* Step 1 */}
//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle className="text-sm">Step 1 — Select a Module</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Select value={selectedModule} onValueChange={setSelectedModule} disabled={sessionActive}>
//             <SelectTrigger className="w-full max-w-md">
//               <SelectValue placeholder="Choose a module…" />
//             </SelectTrigger>
//             <SelectContent>
//               {modules.map((m) => (
//                 <SelectItem key={m.id} value={m.id}>
//                   {m.code} — {m.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </CardContent>
//       </Card>

//       {/* Step 2 + 3 */}
//       <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//         {/* Camera */}
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm">Step 2 — Camera Feed</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gray-900">
//               {sessionActive ? (
//                 <>
//                   <video ref={videoRef} autoPlay muted className="h-full w-full object-cover" />
//                   {scanning && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-black/50">
//                       <div className="text-center text-white">
//                         <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                         <p className="text-sm">Scanning…</p>
//                       </div>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div className="text-center text-gray-500">
//                   <VideoOff className="mx-auto mb-2 h-10 w-10 opacity-40" />
//                   <p className="text-sm">Camera inactive</p>
//                 </div>
//               )}
//             </div>

//             <div className="flex gap-2">
//               {!sessionActive ? (
//                 <Button
//                   onClick={startSession}
//                   disabled={!selectedModule}
//                   className="flex-1"
//                 >
//                   <Video className="mr-2 h-4 w-4" />
//                   Start Attendance
//                 </Button>
//               ) : (
//                 <>
//                   <Button onClick={simulateScan} disabled={scanning} className="flex-1">
//                     {scanning ? "Scanning…" : "Scan Face"}
//                   </Button>
//                   <Button onClick={finishSession} variant="outline" className="flex-1">
//                     Finish Session
//                   </Button>
//                 </>
//               )}
//             </div>

//             {/* <Alert>
//               <AlertDescription className="text-xs">
//                 face-api.js will handle automatic recognition in production. "Scan Face" simulates a detection.
//               </AlertDescription>
//             </Alert> */}
//           </CardContent>
//         </Card>

//         {/* Live record */}
//         <Card>
//           <CardHeader className="pb-3">
//             <div className="flex items-center justify-between">
//               <CardTitle className="text-sm">Step 3 — Live Record</CardTitle>
//               {records.length > 0 && (
//                 <Badge variant="outline" className="text-primary">
//                   {presentCount}/{records.length} present
//                 </Badge>
//               )}
//             </div>
//           </CardHeader>
//           <CardContent>
//             {records.length === 0 ? (
//               <div className="flex items-center justify-center py-10">
//                 <p className="text-sm text-muted-foreground">Select a module and start the session.</p>
//               </div>
//             ) : (
//               <ul className="max-h-72 space-y-1 overflow-y-auto">
//                 {records.map((r) => (
//                   <li key={r.id} className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/50">
//                     <div>
//                       <p className="text-sm font-medium">{r.name}</p>
//                       <p className="text-xs text-muted-foreground">{r.studentId}</p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Badge variant={r.attendStatus === "Present" ? "success" : "secondary"}>
//                         {r.attendStatus}
//                       </Badge>
//                       {r.attendStatus === "Pending" && (
//                         <Button variant="ghost" size="sm" onClick={() => markPresent(r.id)}
//                           className="h-auto p-0 text-xs text-primary hover:text-primary/80">
//                           Mark
//                         </Button>
//                       )}
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }



import { useState, useRef, useEffect } from "react"
import * as faceapi from "face-api.js"
import { useModuleService } from "@/core/services/module.services"
import { useStudentService } from "@/core/services/student.services"
import { useAttendanceService } from "@/core/services/attendance.services"
import { useAuth } from "@/core/contexts/AuthContext"
import { useFaceApi } from "@/hooks/useFaceApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { CheckCircle, Video, AlertCircle, Loader2 } from "lucide-react"
import type { ModuleListItem } from "@/core/interfaces/module.interfaces"

interface LiveRecord {
  studentId: string
  fullName: string
  moduleCode: string
  status: "Pending" | "Present"
  markedAt?: string
}

export default function TakeAttendance() {
  const { user } = useAuth()
  const { useFetchModules } = useModuleService()
  const { useFetchStudents } = useStudentService()
  const { useStartSession, useMarkAttendance, useEndSession, useCheckActiveSession } = useAttendanceService()
  const { modelsLoaded, loadError, extractEmbedding } = useFaceApi()

  const startSessionMutation = useStartSession()
  const markAttendanceMutation = useMarkAttendance()
  const endSessionMutation = useEndSession()

  const [selectedModuleId, setSelectedModuleId] = useState<string>("")
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [records, setRecords] = useState<LiveRecord[]>([])
  const [scanning, setScanning] = useState(false)
  const [autoScan, setAutoScan] = useState(false)
  const [sessionDone, setSessionDone] = useState(false)
  const [error, setError] = useState("")
  const [scanMessage, setScanMessage] = useState("")

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const autoScanRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const performScanRef = useRef<() => Promise<void>>(() => Promise.resolve())

  const { data: modulesData, isLoading: modulesLoading } = useFetchModules(user?.id)
  const modules: ModuleListItem[] = modulesData ?? []
  // const selectedModule = modules.find((m) => m.ModuleId === selectedModuleId)
  const selectedModule = modules.find((m) => m.ModuleCode === selectedModuleId)

  const { data: activeSession, isLoading: checkingSession, refetch: refetchActiveSession } =
    useCheckActiveSession(selectedModule ? selectedModule.ModuleOfferingId : null)

  // const { data: studentsData } = useFetchStudents(user?.id, selectedModuleId || undefined)
  const { data: studentsData } = useFetchStudents(user?.id, selectedModule?.ModuleCode || undefined)

  const moduleStudents = studentsData ?? []

  const presentCount = records.filter((r) => r.status === "Present").length

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch {
      setError("Could not access camera. Please allow camera access and try again.")
    }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (autoScanRef.current) clearInterval(autoScanRef.current)
  }

  const handleStartSession = async () => {
    if (!selectedModule) return
    setError("")
    try {
      const result = await startSessionMutation.mutateAsync({
       moduleId: Number(selectedModule.ModuleOfferingId),
      })
      setSessionId(result.sessionId)
      setRecords(
        moduleStudents.map((s) => ({
          studentId: s.StudentId,
          fullName: s.FullName,
          moduleCode: s.ModuleCodes.join(", "),
          status: "Pending",
        }))
      )
      setDialogOpen(true)
      await startCamera()
    } catch {
      setError("Failed to start session. Please try again.")
    }
  }

  const handleResumeSession = async () => {
    if (!activeSession || !selectedModule) return
    setError("")
    setSessionId(activeSession.SessionId)
    const scannedIds = new Set(activeSession.AlreadyScannedStudents.map((s) => s.StudentId))
    const scannedMap = new Map(
      activeSession.AlreadyScannedStudents.map((s) => [s.StudentId, s.ConductedOn])
    )
    setRecords(
      moduleStudents.map((s) => {
        const alreadyPresent = scannedIds.has(s.StudentId)
        return {
          studentId: s.StudentId,
          fullName: s.FullName,
          moduleCode: s.ModuleCodes.join(", "),
          status: alreadyPresent ? "Present" : "Pending",
          markedAt: alreadyPresent
            ? new Date(scannedMap.get(s.StudentId)!).toLocaleTimeString()
            : undefined,
        }
      })
    )
    setDialogOpen(true)
    await startCamera()
  }

  const handleEndActiveSession = async () => {
    if (!activeSession) return
    setError("")
    try {
      await endSessionMutation.mutateAsync({ SessionId: activeSession.SessionId })
      refetchActiveSession()
    } catch {
      setError("Failed to end session. Please try again.")
    }
  }

  const performScan = async () => {
    if (!sessionId || !selectedModule || !videoRef.current || scanning) return
    setScanning(true)
    setScanMessage("")
    setError("")

    try {
      const embedding = await extractEmbedding(videoRef.current)

      // Draw detection overlay only after video is ready (videoWidth > 0)
      if (canvasRef.current && videoRef.current && videoRef.current.videoWidth > 0) {
        try {
          const dims = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight }
          const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
            .withFaceLandmarks()
          faceapi.matchDimensions(canvasRef.current, dims)
          const resized = faceapi.resizeResults(detections, dims)
          const ctx = canvasRef.current.getContext("2d")
          ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
          faceapi.draw.drawDetections(canvasRef.current, resized)
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resized)
        } catch {
          // canvas overlay is non-critical
        }
      }

      if (!embedding) {
        setScanMessage("No face detected. Please look at the camera.")
        return
      }

      const payload = {
        StudentId: "",
        LiveEmbedding: embedding,
        ModuleOfferingId: selectedModule.ModuleOfferingId,
        SessionId: sessionId,
        ManualVerification: false,
      }
      console.log("[MarkAttendance] payload", payload)
      await markAttendanceMutation.mutateAsync(payload)

      // TODO: When backend returns matched StudentId in response,
      // use that to mark the specific student present instead of first pending
      setRecords((prev) => {
        const firstPending = prev.find((r) => r.status === "Pending")
        if (!firstPending) return prev
        return prev.map((r) =>
          r.studentId === firstPending.studentId
            ? { ...r, status: "Present", markedAt: new Date().toLocaleTimeString() }
            : r
        )
      })
      setScanMessage("Student marked present!")
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string }; status?: number }; message?: string }
      const detail = axiosErr?.response?.data?.message ?? axiosErr?.message ?? "Unknown error"
      setError(`Failed to mark attendance: ${detail} (status: ${axiosErr?.response?.status ?? "no response"})`)
    } finally {
      setScanning(false)
    }
  }

  // Auto scan toggle — scans every 3 seconds automatically
  const toggleAutoScan = () => {
    if (autoScan) {
      if (autoScanRef.current) clearInterval(autoScanRef.current)
      setAutoScan(false)
    } else {
      setAutoScan(true)
      void performScanRef.current()
      autoScanRef.current = setInterval(() => {
        void performScanRef.current()
      }, 3000)
    }
  }

  const handleManualMark = async (studentId: string) => {
    if (!sessionId || !selectedModule) return
    try {
      await markAttendanceMutation.mutateAsync({
        StudentId: studentId,
        LiveEmbedding: [],
        ModuleOfferingId: selectedModule.ModuleOfferingId,
        SessionId: sessionId,
        ManualVerification: true,
      })
      setRecords((prev) =>
        prev.map((r) =>
          r.studentId === studentId
            ? { ...r, status: "Present", markedAt: new Date().toLocaleTimeString() }
            : r
        )
      )
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string }; status?: number }; message?: string }
      const detail = axiosErr?.response?.data?.message ?? axiosErr?.message ?? "Unknown error"
      setError(`Failed to mark attendance: ${detail}`)
    }
  }

  const handleEndSession = async () => {
    if (!sessionId) return
    setError("")
    try {
      await endSessionMutation.mutateAsync({ SessionId: sessionId })
      stopCamera()
      setDialogOpen(false)
      setSessionDone(true)
      refetchActiveSession()
    } catch {
      setError("Failed to end session. Please try again.")
    }
  }

  const resetSession = () => {
    setSelectedModuleId("")
    setSessionId(null)
    setRecords([])
    setSessionDone(false)
    setError("")
    setScanMessage("")
    setAutoScan(false)
  }

  useEffect(() => {
    performScanRef.current = performScan
  })

  useEffect(() => () => stopCamera(), [])

  // ── Session complete ────────────────────────────────────────────────────────
  if (sessionDone) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <Card>
          <CardContent className="flex flex-col items-center p-8 text-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-7 w-7 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold">Session Complete</h2>
            <p className="text-sm text-muted-foreground">
              {presentCount} of {records.length} students marked present.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r) => (
                  <TableRow key={r.studentId}>
                    <TableCell className="font-medium">{r.fullName}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === "Present" ? "default" : "secondary"}>
                        {r.status === "Pending" ? "Absent" : r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.markedAt ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Button onClick={resetSession} className="w-full">Start New Session</Button>
      </div>
    )
  }

  // ── Main page ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Models loading indicator */}
      {!modelsLoaded && !loadError && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>Loading face recognition models…</AlertDescription>
        </Alert>
      )}

      {loadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{loadError}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Select a Module</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={selectedModuleId}
            onValueChange={setSelectedModuleId}
            disabled={modulesLoading}
          >
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder={modulesLoading ? "Loading modules…" : "Choose a module…"} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {modules.map((m) => (
                // <SelectItem key={m.ModuleId} value={m.ModuleId}>
                //   {m.ModuleCode} — {m.ModuleName}
                // </SelectItem>
                <SelectItem key={m.ModuleId} value={m.ModuleCode}>
  {m.ModuleCode} — {m.ModuleName}
</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {checkingSession ? (
            <Button disabled className="w-full max-w-md">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking session…
            </Button>
          ) : activeSession ? (
            <div className="flex w-full max-w-md gap-2">
              <Button
                onClick={handleResumeSession}
                disabled={!modelsLoaded || startSessionMutation.isPending}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Video className="mr-2 h-4 w-4" />
                {startSessionMutation.isPending ? "Resuming…" : "Resume Session"}
              </Button>
              <Button
                variant="destructive"
                onClick={handleEndActiveSession}
                disabled={endSessionMutation.isPending}
                className="flex-1"
              >
                {endSessionMutation.isPending ? "Ending…" : "End Session"}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleStartSession}
              disabled={!selectedModuleId || !modelsLoaded || startSessionMutation.isPending}
              className="w-full max-w-md"
            >
              <Video className="mr-2 h-4 w-4" />
              {startSessionMutation.isPending ? "Starting…" : "Start Session"}
            </Button>
          )}

          {!modelsLoaded && (
            <p className="text-xs text-muted-foreground">
              Waiting for face recognition models to load before starting…
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Attendance Dialog ─────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={() => {}}>
        <DialogContent
          className="max-w-4xl"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span>
                Live Attendance —{" "}
                {selectedModule
                  ? `${selectedModule.ModuleCode} ${selectedModule.ModuleName}`
                  : ""}
              </span>
              <Badge variant="outline" className="text-primary">
                {presentCount}/{records.length} present
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Camera + controls */}
            <div className="space-y-3">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gray-900">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="h-full w-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 h-full w-full"
                />
                {scanning && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1">
                    <Loader2 className="h-3 w-3 animate-spin text-white" />
                    <span className="text-xs text-white">Scanning…</span>
                  </div>
                )}
                {autoScan && !scanning && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-green-600/80 px-2 py-1">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    <span className="text-xs text-white">Auto scanning</span>
                  </div>
                )}
              </div>

              {scanMessage && (
                <p className="text-center text-xs text-green-600">{scanMessage}</p>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={performScan}
                  disabled={scanning || autoScan || !modelsLoaded}
                  className="flex-1"
                >
                  {scanning ? "Scanning…" : "Scan Once"}
                </Button>
                <Button
                  onClick={toggleAutoScan}
                  variant={autoScan ? "destructive" : "outline"}
                  className="flex-1"
                  disabled={!modelsLoaded}
                >
                  {autoScan ? "Stop Auto Scan" : "Auto Scan"}
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Live record */}
            <div className="flex flex-col">
              <p className="mb-2 text-sm font-medium">Live Record</p>
              <ul className="max-h-80 flex-1 space-y-1 overflow-y-auto">
                {records.length === 0 ? (
                  <li className="py-10 text-center text-sm text-muted-foreground">
                    No students found for this module.
                  </li>
                ) : (
                  records.map((r) => (
                    <li
                      key={r.studentId}
                      className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted/50"
                    >
                      <div>
                        <p className="text-sm font-medium">{r.fullName}</p>
                        <p className="text-xs text-muted-foreground">{r.studentId}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={r.status === "Present" ? "default" : "secondary"}>
                          {r.status}
                        </Badge>
                        {r.status === "Pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleManualMark(r.studentId)}
                            className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                          >
                            Mark
                          </Button>
                        )}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleEndSession}
              disabled={endSessionMutation.isPending}
              className="w-full"
            >
              {endSessionMutation.isPending ? "Ending Session…" : "End Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
