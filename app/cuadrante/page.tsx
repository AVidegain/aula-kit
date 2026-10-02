"use client"

import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"

import {
    ChangeEvent,
    useEffect,
    useRef,
    useState,
} from "react"

import {
    createEmptyProject,
    createStudent,
} from "@/lib/classroom"

import {
    exportProject,
    importProject,
    loadProject,
    saveProject,
} from "@/lib/storage"

import {
    exportClassroomAsImage,
} from "@/lib/exportImage"

import { Student } from "@/types/classroom"

import Link from "next/link"

import ClassroomGrid from "@/components/classroom/ClassroomGrid"
import StudentList from "@/components/classroom/StudentList"
import DraggableStudent from "@/components/classroom/DraggableStudent"
import TrashDropZone from "@/components/classroom/TrashDropZone"

export default function CuadrantePage() {
    const [project, setProject] =
        useState(createEmptyProject())

    const [newStudent, setNewStudent] =
        useState("")

    const [activeStudent, setActiveStudent] =
        useState<Student | null>(null)

    const [isLoaded, setIsLoaded] =
        useState(false)

    const [saveStatus, setSaveStatus] =
        useState("")

    const [rowGap, setRowGap] =
        useState(12)

    const [columnGap, setColumnGap] =
        useState(12)

    const [
        showImageExport,
        setShowImageExport,
    ] = useState(false)

    const [
        imageBackground,
        setImageBackground,
    ] = useState<
        "white" | "transparent"
    >("white")

    const fileInputRef =
        useRef<HTMLInputElement>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    )

    // ==========================================
    // CARGAR PROYECTO
    // ==========================================

    useEffect(() => {
        const savedProject =
            loadProject()

        if (savedProject) {
            setProject(savedProject)
        }

        setIsLoaded(true)
    }, [])

    // ==========================================
    // GUARDAR AUTOMÁTICAMENTE
    // ==========================================

    useEffect(() => {
        if (!isLoaded) {
            return
        }

        saveProject(project)

        setSaveStatus("Guardado")

        const timeout =
            window.setTimeout(() => {
                setSaveStatus("")
            }, 1500)

        return () => {
            window.clearTimeout(timeout)
        }
    }, [project, isLoaded])

    // ==========================================
    // AÑADIR UN ALUMNO
    // ==========================================

    const addStudent = () => {
        const name =
            newStudent.trim()

        if (!name) {
            return
        }

        setProject((current) => ({
            ...current,

            students: [
                ...current.students,
                createStudent(name),
            ],
        }))

        setNewStudent("")
    }

    // ==========================================
    // AÑADIR VARIOS ALUMNOS
    // ==========================================

    const addMultipleStudents = (
        names: string[]
    ) => {
        const newStudents =
            names.map((name) =>
                createStudent(name)
            )

        setProject((current) => ({
            ...current,

            students: [
                ...current.students,
                ...newStudents,
            ],
        }))
    }

    // ==========================================
    // ELIMINAR ALUMNO
    // ==========================================

    const removeStudent = (
        id: string
    ) => {
        setProject((current) => ({
            ...current,

            students:
                current.students.filter(
                    (student) =>
                        student.id !== id
                ),
        }))
    }

    // ==========================================
    // CAMBIAR FILAS
    // ==========================================

    const updateRows = (
        rows: number
    ) => {
        if (
            rows < 1 ||
            rows > 12
        ) {
            return
        }

        const maxPositions =
            rows *
            project.classroom.columns

        setProject((current) => ({
            ...current,

            classroom: {
                ...current.classroom,
                rows,
            },

            students:
                current.students.map(
                    (student) => ({
                        ...student,

                        position:
                            student.position !==
                                null &&
                                student.position >=
                                maxPositions
                                ? null
                                : student.position,
                    })
                ),
        }))
    }

    // ==========================================
    // CAMBIAR COLUMNAS
    // ==========================================

    const updateColumns = (
        columns: number
    ) => {
        if (
            columns < 1 ||
            columns > 12
        ) {
            return
        }

        const maxPositions =
            project.classroom.rows *
            columns

        setProject((current) => ({
            ...current,

            classroom: {
                ...current.classroom,
                columns,
            },

            students:
                current.students.map(
                    (student) => ({
                        ...student,

                        position:
                            student.position !==
                                null &&
                                student.position >=
                                maxPositions
                                ? null
                                : student.position,
                    })
                ),
        }))
    }

    // ==========================================
    // LIMPIAR CUADRANTE
    // ==========================================

    const clearClassroom = () => {
        const hasPlacedStudents =
            project.students.some(
                (student) =>
                    student.position !==
                    null
            )

        if (!hasPlacedStudents) {
            return
        }

        const confirmed =
            window.confirm(
                "¿Quieres limpiar el cuadrante?\n\nLos alumnos seguirán en la lista, pero se quitarán todas sus posiciones."
            )

        if (!confirmed) {
            return
        }

        setProject((current) => ({
            ...current,

            students:
                current.students.map(
                    (student) => ({
                        ...student,
                        position: null,
                    })
                ),
        }))
    }

    // ==========================================
    // RELLENAR AUTOMÁTICAMENTE
    // ==========================================

    const fillClassroomAutomatically =
        () => {
            const totalPositions =
                project.classroom.rows *
                project.classroom.columns

            setProject((current) => {
                const occupiedPositions =
                    new Set(
                        current.students
                            .map(
                                (student) =>
                                    student.position
                            )
                            .filter(
                                (
                                    position
                                ): position is number =>
                                    position !==
                                    null
                            )
                    )

                const availablePositions: number[] =
                    []

                for (
                    let position = 0;
                    position <
                    totalPositions;
                    position++
                ) {
                    if (
                        !occupiedPositions.has(
                            position
                        )
                    ) {
                        availablePositions.push(
                            position
                        )
                    }
                }

                let positionIndex = 0

                const updatedStudents =
                    current.students.map(
                        (student) => {
                            if (
                                student.position !==
                                null
                            ) {
                                return student
                            }

                            if (
                                positionIndex >=
                                availablePositions.length
                            ) {
                                return student
                            }

                            const position =
                                availablePositions[
                                positionIndex
                                ]

                            positionIndex++

                            return {
                                ...student,
                                position,
                            }
                        }
                    )

                return {
                    ...current,
                    students:
                        updatedStudents,
                }
            })
        }

    // ==========================================
    // DRAG START
    // ==========================================

    const handleDragStart = (
        event: any
    ) => {
        const draggableId =
            String(event.active.id)

        const studentId =
            draggableId.replace(
                /^student-(list|seat)-/,
                ""
            )

        const student =
            project.students.find(
                (student) =>
                    student.id ===
                    studentId
            )

        if (student) {
            setActiveStudent(student)
        }
    }

    // ==========================================
    // DRAG END
    // ==========================================

    const handleDragEnd = (
        event: DragEndEvent
    ) => {
        const draggableId =
            String(event.active.id)

        const isDraggingFromList =
            draggableId.startsWith(
                "student-list-"
            )

        const studentId =
            draggableId.replace(
                /^student-(list|seat)-/,
                ""
            )

        const overId =
            event.over?.id

        // ==========================================
        // SOLTAR EN PAPELERA
        // ==========================================

        if (
            overId &&
            String(overId) ===
            "trash-drop-zone"
        ) {
            setProject((current) => ({
                ...current,

                students:
                    current.students.map(
                        (student) => {
                            if (
                                student.id ===
                                studentId
                            ) {
                                return {
                                    ...student,
                                    position: null,
                                }
                            }

                            return student
                        }
                    ),
            }))

            setActiveStudent(null)

            return
        }


        // La papelera desaparece
        // al terminar el drag.
        setActiveStudent(null)

        if (!overId) {
            return
        }

        // ==========================================
        // SOLTAR EN UNA POSICIÓN
        // ==========================================

        const targetPosition =
            Number(
                String(overId).replace(
                    "seat-",
                    ""
                )
            )

        if (
            Number.isNaN(
                targetPosition
            )
        ) {
            return
        }

        setProject((current) => {
            const movingStudent =
                current.students.find(
                    (student) =>
                        student.id ===
                        studentId
                )

            if (!movingStudent) {
                return current
            }

            const targetStudent =
                current.students.find(
                    (student) =>
                        student.position ===
                        targetPosition &&
                        student.id !==
                        studentId
                )

            // ==========================================
            // LISTA → CUADRÍCULA
            // ==========================================

            if (isDraggingFromList) {
                return {
                    ...current,

                    students:
                        current.students.map(
                            (student) => {
                                if (
                                    student.id ===
                                    studentId
                                ) {
                                    return {
                                        ...student,
                                        position:
                                            targetPosition,
                                    }
                                }

                                if (
                                    targetStudent &&
                                    student.id ===
                                    targetStudent.id
                                ) {
                                    return {
                                        ...student,
                                        position:
                                            null,
                                    }
                                }

                                return student
                            }
                        ),
                }
            }

            // ==========================================
            // CUADRÍCULA → CUADRÍCULA
            // ==========================================

            return {
                ...current,

                students:
                    current.students.map(
                        (student) => {
                            if (
                                student.id ===
                                studentId
                            ) {
                                return {
                                    ...student,
                                    position:
                                        targetPosition,
                                }
                            }

                            if (
                                targetStudent &&
                                student.id ===
                                targetStudent.id
                            ) {
                                return {
                                    ...student,
                                    position:
                                        movingStudent.position,
                                }
                            }

                            return student
                        }
                    ),
            }
        })
    }

    // ==========================================
    // EXPORTAR PROYECTO
    // ==========================================

    const handleExport = () => {
        exportProject(project)
        setSaveStatus("Exportado")
    }

    // ==========================================
    // IMPORTAR PROYECTO
    // ==========================================

    const handleImportClick = () => {
        fileInputRef.current?.click()
    }

    const handleImport = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file =
            event.target.files?.[0]

        if (!file) {
            return
        }

        try {
            const importedProject =
                await importProject(file)

            const confirmed =
                window.confirm(
                    "¿Quieres importar este proyecto?\n\nEl cuadrante actual será reemplazado por el contenido del archivo."
                )

            if (!confirmed) {
                event.target.value = ""
                return
            }

            setProject(
                importedProject
            )

            setSaveStatus("Importado")
        } catch (error) {
            console.error(error)

            window.alert(
                error instanceof Error
                    ? error.message
                    : "No se ha podido importar el archivo."
            )
        }

        event.target.value = ""
    }

    // ==========================================
    // EXPORTAR IMAGEN
    // ==========================================

    const handleExportImage =
        async () => {
            try {
                await exportClassroomAsImage(
                    {
                        rows:
                            project
                                .classroom
                                .rows,

                        columns:
                            project
                                .classroom
                                .columns,

                        students:
                            project.students,

                        rowGap,

                        columnGap,

                        background:
                            imageBackground,

                        classroomName:
                            project
                                .classroom
                                .name,
                    }
                )

                setSaveStatus(
                    "Imagen exportada"
                )

                setShowImageExport(
                    false
                )
            } catch (error) {
                console.error(error)

                window.alert(
                    error instanceof Error
                        ? error.message
                        : "No se ha podido exportar la imagen."
                )
            }
        }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={
                handleDragStart
            }
            onDragEnd={
                handleDragEnd
            }
        >
            <main className="min-h-screen bg-zinc-100">

                {/* HEADER */}

                <header className="border-b bg-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                        <Link
                            href="/"
                            className="cursor-pointer"
                        >
                            <h1 className="text-xl font-bold text-zinc-900 transition hover:text-zinc-600">
                                AulaKit
                            </h1>

                            <p className="text-sm text-zinc-500">
                                Cuadrante de clase
                            </p>
                        </Link>

                        <div className="flex items-center gap-3 select-none">

                            {saveStatus && (
                                <span className="hidden text-sm text-zinc-400 sm:block">
                                    {saveStatus}
                                </span>
                            )}

                            {/* IMPORTAR */}

                            <button
                                type="button"
                                onClick={handleImportClick}
                                className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all duration-150 hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 hover:shadow active:scale-[0.98]"
                            >
                                Importar
                            </button>

                            {/* EXPORTAR */}

                            <button
                                type="button"
                                onClick={handleExport}
                                className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-zinc-700 hover:shadow-md active:scale-[0.98]"
                            >
                                Exportar
                            </button>

                            {/* EXPORTAR IMAGEN */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowImageExport(true)
                                }
                                className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all duration-150 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 hover:shadow active:scale-[0.98]"
                            >
                                Exportar imagen
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".aula,application/json"
                                onChange={handleImport}
                                className="hidden"
                            />
                        </div>
                    </div>
                </header>

                {/* CONTENIDO */}

                <div className="mx-auto max-w-7xl p-6">

                    {/* CONFIGURACIÓN */}

                    <section className="mb-6 select-none rounded-2xl border bg-white p-5">
                        <div className="flex flex-wrap items-end gap-6">

                            {/* NOMBRE */}

                            <div>
                                <label className="mb-2 block select-none text-sm font-medium">
                                    Nombre de la clase
                                </label>

                                <input
                                    value={
                                        project
                                            .classroom
                                            .name
                                    }
                                    onChange={(event) =>
                                        setProject(
                                            (current) => ({
                                                ...current,

                                                classroom: {
                                                    ...current.classroom,
                                                    name:
                                                        event
                                                            .target
                                                            .value,
                                                },
                                            })
                                        )
                                    }
                                    className="w-56 cursor-text rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-amber-500"
                                />
                            </div>

                            {/* FILAS */}

                            <div>
                                <label className="mb-2 block select-none text-sm font-medium">
                                    Filas
                                </label>

                                <input
                                    type="number"
                                    min={1}
                                    max={12}
                                    value={
                                        project
                                            .classroom
                                            .rows
                                    }
                                    onChange={(event) =>
                                        updateRows(
                                            Number(
                                                event
                                                    .target
                                                    .value
                                            )
                                        )
                                    }
                                    className="w-24 cursor-text rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-amber-500"
                                />
                            </div>

                            {/* COLUMNAS */}

                            <div>
                                <label className="mb-2 block select-none text-sm font-medium">
                                    Columnas
                                </label>

                                <input
                                    type="number"
                                    min={1}
                                    max={12}
                                    value={
                                        project
                                            .classroom
                                            .columns
                                    }
                                    onChange={(event) =>
                                        updateColumns(
                                            Number(
                                                event
                                                    .target
                                                    .value
                                            )
                                        )
                                    }
                                    className="w-24 cursor-text rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-amber-500"
                                />
                            </div>

                            {/* RELLENAR */}

                            <button
                                type="button"
                                onClick={
                                    fillClassroomAutomatically
                                }
                                className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all duration-150 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 hover:shadow active:scale-[0.98]"
                            >
                                Rellenar automáticamente
                            </button>

                            {/* LIMPIAR */}

                            <button
                                type="button"
                                onClick={
                                    clearClassroom
                                }
                                className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all duration-150 hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:shadow active:scale-[0.98]"
                            >
                                Limpiar cuadrante
                            </button>

                        </div>
                    </section>

                    {/* CUADRÍCULA + ALUMNOS */}

                    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

                        {/* CUADRÍCULA */}

                        <section className="select-none rounded-2xl border bg-white p-6">

                            <div className="mb-5">
                                <h2 className="font-semibold">
                                    {
                                        project
                                            .classroom
                                            .name
                                    }
                                </h2>

                                <p className="text-sm text-zinc-500">
                                    {
                                        project
                                            .classroom
                                            .rows
                                    }{" "}
                                    ×{" "}
                                    {
                                        project
                                            .classroom
                                            .columns
                                    }
                                </p>
                            </div>

                            <ClassroomGrid
                                rows={
                                    project
                                        .classroom
                                        .rows
                                }
                                columns={
                                    project
                                        .classroom
                                        .columns
                                }
                                students={
                                    project.students
                                }
                                rowGap={
                                    rowGap
                                }
                                columnGap={
                                    columnGap
                                }
                            />
                        </section>

                        {/* ALUMNOS */}

                        <StudentList
                            students={
                                project.students
                            }
                            newStudent={
                                newStudent
                            }
                            onNewStudentChange={
                                setNewStudent
                            }
                            onAddStudent={
                                addStudent
                            }
                            onRemoveStudent={
                                removeStudent
                            }
                            onAddMultipleStudents={
                                addMultipleStudents
                            }
                        />
                    </div>
                </div>
            </main>

            {/* MODAL EXPORTAR IMAGEN */}

            {showImageExport && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onMouseDown={(
                        event
                    ) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setShowImageExport(
                                false
                            )
                        }
                    }}
                >
                    <div
                        className="w-full max-w-md select-none rounded-2xl bg-white p-6 shadow-xl"
                        onMouseDown={(
                            event
                        ) => {
                            event.stopPropagation()
                        }}
                    >
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-zinc-900">
                                    Exportar cuadrante
                                </h2>

                                <p className="mt-1 text-sm text-zinc-500">
                                    Configura la imagen PNG.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowImageExport(
                                        false
                                    )
                                }
                                className="cursor-pointer rounded-lg px-2 py-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                                aria-label="Cerrar"
                            >
                                ✕
                            </button>
                        </div>

                        {/* FONDO */}

                        <div className="mb-6">
                            <label className="mb-3 block text-sm font-medium text-zinc-800">
                                Fondo
                            </label>

                            <div className="grid grid-cols-2 gap-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setImageBackground(
                                            "white"
                                        )
                                    }
                                    className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition ${imageBackground ===
                                        "white"
                                        ? "border-zinc-900 bg-zinc-900 text-white"
                                        : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                                        }`}
                                >
                                    Blanco
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setImageBackground(
                                            "transparent"
                                        )
                                    }
                                    className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition ${imageBackground ===
                                        "transparent"
                                        ? "border-zinc-900 bg-zinc-900 text-white"
                                        : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                                        }`}
                                >
                                    Transparente
                                </button>

                            </div>
                        </div>

                        {/* DISTANCIA FILAS */}

                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-medium text-zinc-800">
                                Distancia entre filas
                            </label>

                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min={0}
                                    max={60}
                                    value={
                                        rowGap
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setRowGap(
                                            Number(
                                                event
                                                    .target
                                                    .value
                                            )
                                        )
                                    }
                                    className="w-full cursor-pointer accent-zinc-900"
                                />

                                <span className="w-12 text-right text-sm text-zinc-500">
                                    {rowGap}px
                                </span>
                            </div>
                        </div>

                        {/* DISTANCIA COLUMNAS */}

                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-medium text-zinc-800">
                                Distancia entre columnas
                            </label>

                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min={0}
                                    max={60}
                                    value={
                                        columnGap
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setColumnGap(
                                            Number(
                                                event
                                                    .target
                                                    .value
                                            )
                                        )
                                    }
                                    className="w-full cursor-pointer accent-zinc-900"
                                />

                                <span className="w-12 text-right text-sm text-zinc-500">
                                    {columnGap}px
                                </span>
                            </div>
                        </div>

                        {/* BOTONES */}

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowImageExport(
                                        false
                                    )
                                }
                                className="cursor-pointer rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleExportImage
                                }
                                className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 active:scale-[0.98]"
                            >
                                Descargar PNG
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PAPELERA FIJA */}

            <TrashDropZone
                active={
                    activeStudent !== null
                }
            />

            {/* DRAG OVERLAY */}

            <DragOverlay>
                {activeStudent ? (
                    <DraggableStudent
                        student={
                            activeStudent
                        }
                        compact
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
