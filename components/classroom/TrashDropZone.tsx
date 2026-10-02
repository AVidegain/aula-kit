"use client"

import { useDroppable } from "@dnd-kit/core"

type Props = {
    active: boolean
}

export default function TrashDropZone({
    active,
}: Props) {
    const {
        setNodeRef,
        isOver,
    } = useDroppable({
        id: "trash-drop-zone",
    })

    if (!active) {
        return null
    }

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex justify-center">
            <div
                ref={setNodeRef}
                className={`
                    pointer-events-auto
                    flex h-20 w-20
                    items-center justify-center
                    rounded-2xl
                    border-2
                    shadow-2xl
                    transition-all
                    duration-150
                    ${isOver
                        ? "scale-125 border-red-500 bg-red-500 text-white"
                        : "border-red-300 bg-white text-red-500"
                    }
                `}
            >
                <span
                    className="text-4xl"
                    aria-hidden="true"
                >
                    🗑️
                </span>
            </div>
        </div>
    )
}
