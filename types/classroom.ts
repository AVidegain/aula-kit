export type Student = {
    id: string
    name: string
    position: number | null
}

export type Classroom = {
    name: string
    rows: number
    columns: number
}

export type ClassroomProject = {
    classroom: Classroom
    students: Student[]
}
