import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { StudentListItem } from "@/core/interfaces/student.interfaces"

export const createStudentColumns = (
  onDelete: (id: string) => void,
  onRegisterFace: (student: StudentListItem) => void
): ColumnDef<StudentListItem>[] => [
  {
    accessorKey: "FullName",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.getValue("FullName")}</span>,
  },
  {
    accessorKey: "StudentId",
    header: "Student ID",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("StudentId")}</span>
    ),
  },
  {
    accessorKey: "ModuleCodes",
    header: "Modules",
    cell: ({ row }) => {
      const moduleCodes = row.original.ModuleCodes

      return (
        <div className="flex flex-col gap-1 text-muted-foreground">
          {moduleCodes.map((moduleCode) => (
            <span key={moduleCode}>{moduleCode}</span>
          ))}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onRegisterFace(row.original)}>
            Register Face
          </DropdownMenuItem>
         
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
