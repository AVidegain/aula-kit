"use client"

import { useDraggable } from "@dnd-kit/core"
import { Student } from "@/types/classroom"

type Props = {
    student: Student
    onRemove?: (id: string) => void
    compact?: boolean
    source?: "list" | "seat"
}

export default function DraggableStudent({
    student,
    onRemove,
    compact = false,
    source = "list",
}: Props) {
    const draggableId = `student-${source}-${student.id}`

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: draggableId,
    })

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined

    if (compact) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                className={`
                    inline-block w-fit
                    cursor-grab select-none rounded-lg
                    bg-white px-3 py-2
                    text-sm font-medium text-zinc-900
                    whitespace-nowrap
                    active:cursor-grabbing
                    ${isDragging ? "opacity-0" : ""}
                `}
            >
                {student.name}
            </div>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
                group flex cursor-grab select-none
                items-center justify-between
                rounded-lg border bg-zinc-50 px-3 py-2
                active:cursor-grabbing
                ${isDragging ? "opacity-0" : "hover:border-amber-300"}
            `}
        >
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
                    {student.name.charAt(0).toUpperCase()}
                </div>

                <span className="text-sm font-medium">
                    {student.name}
                </span>
            </div>

            {onRemove && (
                <button
                    onPointerDown={(event) => {
                        event.stopPropagation()
                    }}
                    onClick={() => onRemove(student.id)}
                    className="ml-2 text-xs text-zinc-400 hover:text-red-500"
                >
                    Eliminar
                </button>
            )}
        </div>
    )
}
