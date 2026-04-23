import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AlertCircle, Camera, Loader2, ScanFace } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { DataTable } from "@/components/ui/data_table"
import { useStudentManagement } from "./hooks/useStudentManagement"
import { createStudentColumns } from "./columns"
import { useModuleService } from "@/core/services/module.services"
import { useAttendanceService } from "@/core/services/attendance.services"
import { useAuth } from "@/core/contexts/AuthContext"
import { useFaceApi } from "@/hooks/useFaceApi"
import type { StudentListItem } from "@/core/interfaces/student.interfaces"
import type { ModuleListItem } from "@/core/interfaces/module.interfaces"

function getStudentModules(student: StudentListItem | null, modules: ModuleListItem[]) {
  if (!student) return []

  return modules.filter((module) => student.ModuleCodes.includes(module.ModuleCode))
}

export default function StudentManagement() {
  const { user } = useAuth()
  const {
    students,
    filterModule,
    searchQuery,
    pageIndex,
    pageSize,
    isLoading,
    handleDeleteStudent,
    handleSearchChange,
    handleFilterChange,
    setPageIndex,
    setPageSize,
    totalRows,
  } = useStudentManagement()
  const { useFetchModules } = useModuleService()
  const { useRegisterStudent, useTrainModel } = useAttendanceService()
  const { modelsLoaded, loadError, extractMultipleEmbeddings } = useFaceApi()
  const registerStudentMutation = useRegisterStudent()
  const trainModelMutation = useTrainModel()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Callback ref: if the stream is already running when the video element mounts
  // (race between getUserMedia resolving and the Dialog portal rendering), attach it immediately.
  const videoCallbackRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node
    if (node && streamRef.current) {
      node.srcObject = streamRef.current
      void node.play().catch(() => undefined)
    }
  }, [])
  const [selectedStudent, setSelectedStudent] = useState<StudentListItem | null>(null)
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false)
  const [selectedRegisterModuleId, setSelectedRegisterModuleId] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [pageMessage, setPageMessage] = useState("")
  const [captureMessage, setCaptureMessage] = useState("")
  const [isCapturing, setIsCapturing] = useState(false)
  const [registeredStudentIds, setRegisteredStudentIds] = useState<string[]>([])

  const { data: modulesData, isLoading: modulesLoading } = useFetchModules(user?.id)
  const modules: ModuleListItem[] = modulesData ?? []

  const availableRegisterModules = useMemo(
    () => getStudentModules(selectedStudent, modules),
    [selectedStudent, modules]
  )

  const pendingRegistrationsCount = registeredStudentIds.length

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  useEffect(() => {
    if (!registerDialogOpen) return

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play().catch(() => undefined)
        }
      } catch {
        setRegisterError("Could not access camera. Please allow camera access and try again.")
      }
    }

    void startCamera()

    return () => {
      stopCamera()
    }
  }, [registerDialogOpen])

  useEffect(() => () => stopCamera(), [])

  useEffect(() => {
    if (!registerDialogOpen) return

    if (filterModule && filterModule !== "all") {
      setSelectedRegisterModuleId(filterModule)
      return
    }

    setSelectedRegisterModuleId(availableRegisterModules[0]?.ModuleCode ?? "")
  }, [availableRegisterModules, filterModule, registerDialogOpen])

  const handleOpenRegisterDialog = (student: StudentListItem) => {
    setSelectedStudent(student)
    setRegisterError("")
    setPageMessage("")
    setCaptureMessage("")
    setSelectedRegisterModuleId("")
    setRegisterDialogOpen(true)
  }

  const handleCloseRegisterDialog = () => {
    setRegisterDialogOpen(false)
    setSelectedStudent(null)
    setSelectedRegisterModuleId("")
    setRegisterError("")
    setCaptureMessage("")
    setIsCapturing(false)
    stopCamera()
  }

  const handleRegisterFace = async () => {
    if (!selectedStudent || !videoRef.current) {
      setRegisterError("Camera preview is not ready yet.")
      return
    }

    if (!selectedRegisterModuleId) {
      setRegisterError("Select the module to associate with this face registration.")
      return
    }

    setRegisterError("")
    setPageMessage("")
    setCaptureMessage("Capturing face embeddings. Stay centered and look at the camera.")
    setIsCapturing(true)

    try {
      const embeddings = await extractMultipleEmbeddings(videoRef.current, 30, 400)

      if (!embeddings) {
        setRegisterError("No face embeddings were captured. Stay in frame with good lighting and try again.")
        return
      }

      setCaptureMessage(`Captured ${embeddings.length} sample${embeddings.length === 1 ? "" : "s"}. Registering student...`)

      await registerStudentMutation.mutateAsync({
        StudentId: selectedStudent.StudentId,
        Embeddings: embeddings,
        // ModuleId: string(selectedRegisterModuleId),
        ModuleCode: selectedRegisterModuleId,

      })

      setRegisteredStudentIds((prev) =>
        prev.includes(selectedStudent.StudentId) ? prev : [...prev, selectedStudent.StudentId]
      )
      setPageMessage(
        `${selectedStudent.FullName} was registered. Continue with more students, then run Train Model once for the batch.`
      )
      handleCloseRegisterDialog()
    } catch {
      setRegisterError("Failed to register face embeddings. Please try again.")
    } finally {
      setIsCapturing(false)
      setCaptureMessage("")
    }
  }

  const handleTrainModel = async () => {
    setRegisterError("")
    setPageMessage("")

    await trainModelMutation.mutateAsync().then(() => {
      setRegisteredStudentIds([])
      setPageMessage("Model retrained successfully for the current registration batch.")
    }).catch(() => {
      setRegisterError("Failed to retrain the model. Please try again.")
    })
  }

  const columns = createStudentColumns(handleDeleteStudent, handleOpenRegisterDialog)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-56"
        />
        <Select value={filterModule} onValueChange={handleFilterChange} disabled={modulesLoading}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All Modules"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {modules.map((module) => (
              <SelectItem key={module.ModuleId} value={module.ModuleId}>
                {module.ModuleCode} - {module.ModuleName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={handleTrainModel}
          disabled={pendingRegistrationsCount === 0 || trainModelMutation.isPending}
        >
          {trainModelMutation.isPending
            ? "Training..."
            : `Train Model (${pendingRegistrationsCount})`}
        </Button>
      </div>

      {!modelsLoaded && !loadError && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin"/>
          <AlertDescription>Loading face recognition models...</AlertDescription>
        </Alert>
      )}

      {loadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4"/>
          <AlertDescription>{loadError}</AlertDescription>
        </Alert>
      )}

      {registerError && !registerDialogOpen && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4"/>
          <AlertDescription>{registerError}</AlertDescription>
        </Alert>
      )}

      {pageMessage && (
        <Alert>
          <AlertDescription>{pageMessage}</AlertDescription>
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={students}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalRows={totalRows}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        tableTitle="Students"
        showSearchFilter={false}
        emptyDataMessage="No students found."
        isLoading={isLoading}
      />

      <Dialog open={registerDialogOpen} onOpenChange={(open) => !open && handleCloseRegisterDialog()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScanFace className="h-5 w-5"/>
              Register Face
            </DialogTitle>
            <DialogDescription>
              {selectedStudent
                ? `Capture embeddings for ${selectedStudent.FullName} (${selectedStudent.StudentId}).`
                : "Capture embeddings for the selected student."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border bg-black">
              <video
                ref={videoCallbackRef}
                autoPlay
                muted
                playsInline
                className="aspect-video w-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Module</p>
              <Select value={selectedRegisterModuleId} onValueChange={setSelectedRegisterModuleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select module for this registration"/>
                </SelectTrigger>
                <SelectContent>
                  {availableRegisterModules.map((module) => (
                    <SelectItem key={module.ModuleId} value={module.ModuleCode}>
                      {module.ModuleCode} - {module.ModuleName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {registerError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4"/>
                <AlertDescription>{registerError}</AlertDescription>
              </Alert>
            )}

            {captureMessage && (
              <p className="text-sm text-muted-foreground">{captureMessage}</p>
            )}

            <p className="text-sm text-muted-foreground">
              Capture multiple clear samples. Successful registrations stay queued until you run batch training.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseRegisterDialog} disabled={isCapturing}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleRegisterFace}
              disabled={!modelsLoaded || isCapturing || registerStudentMutation.isPending}
            >
              {isCapturing || registerStudentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  {registerStudentMutation.isPending ? "Registering..." : "Capturing..."}
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4"/>
                  Capture And Register
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
