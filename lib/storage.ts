import { ClassroomProject } from "@/types/classroom"

const STORAGE_KEY = "aulakit-current-project"

export function saveProject(
    project: ClassroomProject
) {
    if (typeof window === "undefined") {
        return
    }

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(project)
        )
    } catch (error) {
        console.error(
            "No se pudo guardar el proyecto:",
            error
        )
    }
}

export function loadProject(): ClassroomProject | null {
    if (typeof window === "undefined") {
        return null
    }

    try {
        const stored =
            localStorage.getItem(STORAGE_KEY)

        if (!stored) {
            return null
        }

        const project = JSON.parse(stored)

        if (!isValidProject(project)) {
            return null
        }

        return project
    } catch (error) {
        console.error(
            "No se pudo cargar el proyecto:",
            error
        )

        return null
    }
}

export function exportProject(
    project: ClassroomProject
) {
    if (typeof window === "undefined") {
        return
    }

    const data = JSON.stringify(
        project,
        null,
        2
    )

    const blob = new Blob([data], {
        type: "application/json",
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")

    link.href = url
    link.download = `${getSafeFileName(
        project.classroom.name
    )}.aula`

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)

    URL.revokeObjectURL(url)
}

export function importProject(
    file: File
): Promise<ClassroomProject> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            try {
                const project = JSON.parse(
                    String(reader.result)
                )

                if (!isValidProject(project)) {
                    reject(
                        new Error(
                            "El archivo no es un proyecto válido de AulaKit."
                        )
                    )

                    return
                }

                resolve(project)
            } catch {
                reject(
                    new Error(
                        "No se ha podido leer el archivo."
                    )
                )
            }
        }

        reader.onerror = () => {
            reject(
                new Error(
                    "No se ha podido leer el archivo."
                )
            )
        }

        reader.readAsText(file)
    })
}

function isValidProject(
    value: unknown
): value is ClassroomProject {
    if (
        !value ||
        typeof value !== "object"
    ) {
        return false
    }

    const project =
        value as Record<string, unknown>

    if (
        !project.classroom ||
        typeof project.classroom !== "object"
    ) {
        return false
    }

    if (!Array.isArray(project.students)) {
        return false
    }

    const classroom =
        project.classroom as Record<string, unknown>

    if (
        typeof classroom.name !== "string" ||
        typeof classroom.rows !== "number" ||
        typeof classroom.columns !== "number"
    ) {
        return false
    }

    return true
}

function getSafeFileName(name: string) {
    const safeName = name
        .trim()
        .replace(/[<>:"/\\|?*]/g, "")
        .replace(/\s+/g, "-")

    return safeName || "mi-clase"
}
