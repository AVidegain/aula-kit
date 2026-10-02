"use client"

import { useDroppable } from "@dnd-kit/core"
import { Student } from "@/types/classroom"
import DraggableStudent from "./DraggableStudent"

type Props = {
    index: number
    student?: Student
}

export default function ClassroomSeat({
    index,
    student,
}: Props) {
    const { setNodeRef, isOver } = useDroppable({
        id: `seat-${index}`,
    })

    return (
        <div
            ref={setNodeRef}
            className={`
        flex aspect-[1.4] items-center justify-center
        rounded-xl border-2 border-dashed
        text-center transition
        ${isOver
                    ? "scale-[1.02] border-amber-400 bg-amber-50"
                    : "border-zinc-200 bg-white"
                }
      `}
        >
            {student ? (
                <DraggableStudent
                    student={student}
                    compact
                    source="seat"
                />
            ) : (
                <span className="text-xs text-zinc-300">
                    {index + 1}
                </span>
            )}
        </div>
    )
}
