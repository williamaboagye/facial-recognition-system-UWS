import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useModuleManagement } from "./hooks/useModuleManagement"
import type { Module } from "@/types"

export default function ModuleManagement() {
  const {
    modules,
    dialogOpen,
    form,
    isLoading,
    handleAddModule,
    handleDeleteModule,
    handleFormChange,
    handleOpenDialog,
    handleCloseDialog,
    // getStudentCount,
    getRateColor,
    getBarColor,
  } = useModuleManagement()

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {/* <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenDialog}>+ Add Module</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Module</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="mcode">Module Code</Label>
                <Input
                  id="mcode"
                  placeholder="e.g. CS501"
                  value={form.code}
                  onChange={(e) => handleFormChange("code", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mname">Module Name</Label>
                <Input
                  id="mname"
                  placeholder="e.g. Artificial Intelligence"
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="msched">Schedule</Label>
                <Input
                  id="msched"
                  placeholder="e.g. Mon & Wed, 11:00 AM"
                  value={form.schedule}
                  onChange={(e) => handleFormChange("schedule", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mroom">Room</Label>
                <Input
                  id="mroom"
                  placeholder="e.g. Room D401"
                  value={form.room}
                  onChange={(e) => handleFormChange("room", e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button onClick={handleAddModule} disabled={!form.code || !form.name}>
                Create Module
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {isLoading ? (
          <>
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-16 mb-2" />
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-16 mb-2" />
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          modules.map((m: Module) => {
            // const count = getStudentCount(m.id)
            return (
              <Card key={m.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2 border-primary/30 text-primary">
                        {m.code}
                      </Badge>
                      <CardTitle className="text-base">{m.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="pt-4 space-y-3">
                  <CardDescription className="space-y-1">
                    <p>📅 {m.schedule}</p>
                    <p>📍 {m.room}</p>
                    <p>👥 {m.totalStudents} students enrolled</p>
                  </CardDescription>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteModule(m.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
