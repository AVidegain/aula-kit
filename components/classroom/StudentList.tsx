"use client"

import { useMemo, useState } from "react"
import { useDraggable } from "@dnd-kit/core"

import { Student } from "@/types/classroom"

type StudentListProps = {
    students: Student[]
    newStudent: string
    onNewStudentChange: (value: string) => void
    onAddStudent: () => void
    onRemoveStudent: (id: string) => void
    onAddMultipleStudents?: (names: string[]) => void
}

function DraggableStudentFromList({
    student,
    onRemove,
}: {
    student: Student
    onRemove: (id: string) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: `student-list-${student.id}`,
    })

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined

    const isPlaced = student.position !== null

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
        group flex cursor-grab select-none items-center justify-between
        rounded-lg border px-3 py-2
        transition
        active:cursor-grabbing
        ${isDragging ? "invisible" : ""}
        ${isPlaced
                    ? "border-emerald-200 bg-emerald-50 hover:border-emerald-300 hover:bg-emerald-100"
                    : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                }
      `}
        >
            <div className="flex min-w-0 items-center gap-2">
                <span
                    className={`
                        h-2 w-2 shrink-0 rounded-full
                        ${isPlaced ? "bg-emerald-500" : "bg-zinc-300"}
                    `}
                />

                <span
                    className={`
                        truncate text-sm font-medium
                        ${isPlaced
                            ? "text-emerald-900"
                            : "text-zinc-800"
                        }
                    `}
                >
                    {student.name}
                </span>
            </div>

            <button
                type="button"
                aria-label={`Eliminar a ${student.name}`}
                title={`Eliminar a ${student.name}`}
                onPointerDown={(event) => {
                    event.stopPropagation()
                }}
                onClick={(event) => {
                    event.stopPropagation()
                    onRemove(student.id)
                }}
                className={`
                    ml-2 flex h-7 w-7 shrink-0 cursor-pointer items-center
                    justify-center rounded-md text-lg leading-none transition
                    ${isPlaced
                        ? "text-emerald-400 hover:bg-red-50 hover:text-red-500"
                        : "text-zinc-400 hover:bg-red-50 hover:text-red-500"
                    }
                `}
            >
                ×
            </button>
        </div>
    )
}

export default function StudentList({
    students,
    newStudent,
    onNewStudentChange,
    onAddStudent,
    onRemoveStudent,
    onAddMultipleStudents,
}: StudentListProps) {
    const [search, setSearch] = useState("")
    const [showBulkAdd, setShowBulkAdd] = useState(false)
    const [bulkText, setBulkText] = useState("")
    const [showOnlyUnplaced, setShowOnlyUnplaced] = useState(false)

    const placedStudents = students.filter(
        (student) => student.position !== null
    ).length

    const filteredStudents = useMemo(() => {
        const query = search.trim().toLowerCase()

        return students.filter((student) => {
            const matchesSearch =
                !query ||
                student.name.toLowerCase().includes(query)

            const matchesPlacement =
                !showOnlyUnplaced ||
                student.position === null

            return matchesSearch && matchesPlacement
        })
    }, [students, search, showOnlyUnplaced])

    const handleBulkAdd = () => {
        const names = bulkText
            .split(/\r?\n/)
            .map((line) =>
                line
                    .replace(
                        /^\s*(?:\d+[\.\)\-:]|\-|\*)\s*/,
                        ""
                    )
                    .trim()
            )
            .filter(Boolean)

        if (names.length === 0) {
            return
        }

        if (onAddMultipleStudents) {
            onAddMultipleStudents(names)
        }

        setBulkText("")
        setShowBulkAdd(false)
    }

    const closeBulkAdd = () => {
        setShowBulkAdd(false)
        setBulkText("")
    }

    const handleClearStudents = () => {
        if (students.length === 0) {
            return
        }

        const confirmed = window.confirm(
            `¿Quieres vaciar la lista de alumnos?\n\nSe eliminarán los ${students.length} alumnos y también desaparecerán del cuadrante.`
        )

        if (!confirmed) {
            return
        }

        students.forEach((student) => {
            onRemoveStudent(student.id)
        })

        setSearch("")
        setShowOnlyUnplaced(false)
    }

    return (
        <>
            <section className="select-none rounded-2xl border bg-white p-5">
                <div className="mb-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h2 className="font-semibold text-zinc-900">
                                Alumnos
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                {placedStudents} / {students.length} colocados
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowBulkAdd(true)}
                            className="shrink-0 cursor-pointer rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 active:scale-[0.98]"
                        >
                            + Añadir alumnos
                        </button>
                    </div>

                    {students.length > 0 && (
                        <>
                            <div className="mt-4">
                                <input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Buscar alumno..."
                                    className="w-full cursor-text rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                />
                            </div>

                            <label className="mt-3 flex cursor-pointer select-none items-center gap-2 text-sm text-zinc-600">
                                <input
                                    type="checkbox"
                                    checked={showOnlyUnplaced}
                                    onChange={(event) =>
                                        setShowOnlyUnplaced(
                                            event.target.checked
                                        )
                                    }
                                    className="h-4 w-4 cursor-pointer rounded border-zinc-300 accent-amber-500"
                                />

                                <span>
                                    Mostrar solo no colocados
                                </span>
                            </label>
                        </>
                    )}

                    {students.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClearStudents}
                            className="mt-3 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-[0.99]"
                        >
                            Vaciar lista
                        </button>
                    )}
                </div>

                <div className="space-y-2">
                    {filteredStudents.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center">
                            {students.length === 0 ? (
                                <>
                                    <p className="text-sm font-medium text-zinc-600">
                                        Todavía no hay alumnos
                                    </p>

                                    <p className="mt-1 text-xs text-zinc-400">
                                        Añádelos uno a uno o pega una lista.
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm text-zinc-500">
                                    {showOnlyUnplaced
                                        ? "Todos los alumnos están colocados."
                                        : "No se encontraron alumnos."}
                                </p>
                            )}
                        </div>
                    ) : (
                        filteredStudents.map((student) => (
                            <DraggableStudentFromList
                                key={student.id}
                                student={student}
                                onRemove={onRemoveStudent}
                            />
                        ))
                    )}
                </div>

                <div className="mt-4 border-t pt-4">
                    <div className="flex gap-2">
                        <input
                            value={newStudent}
                            onChange={(event) =>
                                onNewStudentChange(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    onAddStudent()
                                }
                            }}
                            placeholder="Nuevo alumno..."
                            className="min-w-0 flex-1 cursor-text rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                        />

                        <button
                            type="button"
                            onClick={onAddStudent}
                            className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900 active:scale-[0.98]"
                        >
                            Añadir
                        </button>
                    </div>
                </div>
            </section>

            {showBulkAdd && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeBulkAdd()
                        }
                    }}
                >
                    <div
                        className="w-full max-w-lg select-none rounded-2xl bg-white p-6 shadow-xl"
                        onMouseDown={(event) => {
                            event.stopPropagation()
                        }}
                    >
                        <div className="mb-5 flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-900">
                                    Añadir alumnos
                                </h2>

                                <p className="mt-1 text-sm text-zinc-500">
                                    Pega un nombre por línea.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeBulkAdd}
                                className="cursor-pointer rounded-lg px-2 py-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                                aria-label="Cerrar"
                            >
                                ✕
                            </button>
                        </div>

                        <textarea
                            autoFocus
                            value={bulkText}
                            onChange={(event) =>
                                setBulkText(event.target.value)
                            }
                            placeholder={`Ana García
Pablo López
Lucía Martín
Carlos Pérez`}
                            className="h-56 w-full cursor-text resize-none rounded-xl border border-zinc-300 p-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                        />

                        <p className="mt-2 text-xs text-zinc-400">
                            También puedes pegar listas con números, por ejemplo:
                            "1. Ana García".
                        </p>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={closeBulkAdd}
                                className="cursor-pointer rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={handleBulkAdd}
                                disabled={bulkText.trim().length === 0}
                                className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Añadir{" "}
                                {bulkText
                                    .split(/\r?\n/)
                                    .map((line) => line.trim())
                                    .filter(Boolean).length > 0
                                    ? bulkText
                                        .split(/\r?\n/)
                                        .map((line) => line.trim())
                                        .filter(Boolean).length
                                    : ""}{" "}
                                alumnos
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
