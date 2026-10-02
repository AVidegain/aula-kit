import {
    ClassroomProject,
    Student,
} from "@/types/classroom"

export function createStudent(
    name: string
): Student {
    return {
        id: crypto.randomUUID(),
        name,
        position: null,
    }
}

export function createEmptyProject(): ClassroomProject {
    return {
        classroom: {
            name: "Mi clase",
            rows: 4,
            columns: 5,
        },

        students: [],
    }
}
