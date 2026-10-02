import { Student } from "@/types/classroom"

type ExportImageOptions = {
    rows: number
    columns: number
    students: Student[]
    rowGap: number
    columnGap: number
    transparent: boolean
}

export async function exportClassroomAsImage({
    rows,
    columns,
    students,
    rowGap,
    columnGap,
    transparent,
}: ExportImageOptions) {
    const seatWidth = 180
    const seatHeight = 90
    const padding = 40

    const width =
        padding * 2 +
        columns * seatWidth +
        Math.max(0, columns - 1) * columnGap

    const height =
        padding * 2 +
        rows * seatHeight +
        Math.max(0, rows - 1) * rowGap

    const scale = 2

    const canvas = document.createElement("canvas")

    canvas.width = width * scale
    canvas.height = height * scale

    const context = canvas.getContext("2d")

    if (!context) {
        throw new Error(
            "No se ha podido crear la imagen."
        )
    }

    context.scale(scale, scale)

    // Fondo blanco si no se ha elegido transparente.
    if (!transparent) {
        context.fillStyle = "#ffffff"
        context.fillRect(
            0,
            0,
            width,
            height
        )
    }

    const sortedStudents = [...students]

    for (const student of sortedStudents) {
        if (student.position === null) {
            continue
        }

        const row = Math.floor(
            student.position / columns
        )

        const column =
            student.position % columns

        const x =
            padding +
            column *
            (seatWidth + columnGap)

        const y =
            padding +
            row *
            (seatHeight + rowGap)

        // Caja del asiento
        context.fillStyle = "#ffffff"
        context.strokeStyle = "#d4d4d8"
        context.lineWidth = 1

        roundRect(
            context,
            x,
            y,
            seatWidth,
            seatHeight,
            12
        )

        context.fill()
        context.stroke()

        // Nombre
        context.fillStyle = "#18181b"
        context.font =
            "600 18px Arial, sans-serif"
        context.textAlign = "center"
        context.textBaseline = "middle"

        const name =
            student.name

        drawWrappedText(
            context,
            name,
            x + seatWidth / 2,
            y + seatHeight / 2,
            seatWidth - 24,
            22
        )
    }

    const link =
        document.createElement("a")

    link.download =
        "cuadrante.png"

    link.href =
        canvas.toDataURL(
            "image/png"
        )

    link.click()
}

function roundRect(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
) {
    const safeRadius =
        Math.min(
            radius,
            width / 2,
            height / 2
        )

    context.beginPath()

    context.moveTo(
        x + safeRadius,
        y
    )

    context.lineTo(
        x + width - safeRadius,
        y
    )

    context.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + safeRadius
    )

    context.lineTo(
        x + width,
        y + height - safeRadius
    )

    context.quadraticCurveTo(
        x + width,
        y + height,
        x + width - safeRadius,
        y + height
    )

    context.lineTo(
        x + safeRadius,
        y + height
    )

    context.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - safeRadius
    )

    context.lineTo(
        x,
        y + safeRadius
    )

    context.quadraticCurveTo(
        x,
        y,
        x + safeRadius,
        y
    )

    context.closePath()
}

function drawWrappedText(
    context: CanvasRenderingContext2D,
    text: string,
    centerX: number,
    centerY: number,
    maxWidth: number,
    lineHeight: number
) {
    const words =
        text.split(" ")

    const lines: string[] = []

    let currentLine = ""

    for (const word of words) {
        const testLine =
            currentLine
                ? `${currentLine} ${word}`
                : word

        const width =
            context.measureText(
                testLine
            ).width

        if (
            width > maxWidth &&
            currentLine
        ) {
            lines.push(
                currentLine
            )

            currentLine = word
        } else {
            currentLine =
                testLine
        }
    }

    if (currentLine) {
        lines.push(
            currentLine
        )
    }

    const totalHeight =
        lines.length * lineHeight

    let y =
        centerY -
        totalHeight / 2 +
        lineHeight / 2

    for (const line of lines) {
        context.fillText(
            line,
            centerX,
            y
        )

        y += lineHeight
    }
}
