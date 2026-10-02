"use client"

import { Student } from "@/types/classroom"
import ClassroomSeat from "./ClassroomSeat"

type Props = {
    rows: number
    columns: number
    students: Student[]
    rowGap?: number
    columnGap?: number
}

export default function ClassroomGrid({
    rows,
    columns,
    students,
    rowGap = 12,
    columnGap = 12,
}: Props) {
    const totalSeats =
        rows * columns

    return (
        <div className="rounded-xl bg-zinc-50 p-6">
            <div
                className="grid"
                style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                    rowGap: `${rowGap}px`,
                    columnGap: `${columnGap}px`,
                }}
            >
                {Array.from({
                    length: totalSeats,
                }).map((_, index) => {
                    const student =
                        students.find(
                            (student) =>
                                student.position ===
                                index
                        )

                    return (
                        <ClassroomSeat
                            key={index}
                            index={index}
                            student={student}
                        />
                    )
                })}
            </div>
        </div>
    )
}
