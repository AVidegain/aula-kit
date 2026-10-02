import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold">
            AulaKit
          </Link>

          <Link
            href="/cuadrante"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Crear cuadrante
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-3xl">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
            Herramientas para docentes
          </span>

          <h1 className="mt-6 text-5xl font-bold tracking-tight">
            Menos tiempo organizando.
            <br />
            <span className="text-amber-500">
              Más tiempo enseñando.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            Herramientas sencillas para esas pequeñas tareas repetitivas
            que consumen tiempo en el día a día del aula.
          </p>

          <div className="mt-8">
            <Link
              href="/cuadrante"
              className="inline-flex rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-700"
            >
              Crear mi primer cuadrante →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold">
            Pequeñas tareas que quitan mucho tiempo.
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Tool
              emoji="🪑"
              title="Cuadrante de clase"
              description="Organiza a tus alumnos arrastrándolos a sus sitios."
              href="/cuadrante"
            />

            <Tool
              emoji="👥"
              title="Crear grupos"
              description="Forma equipos rápidamente."
            />

            <Tool
              emoji="🎲"
              title="Selector aleatorio"
              description="Elige alumnos al azar."
            />
          </div>
        </div>
      </section>
    </main>
  )
}

function Tool({
  emoji,
  title,
  description,
  href,
}: {
  emoji: string
  title: string
  description: string
  href?: string
}) {
  const content = (
    <>
      <div className="text-4xl">{emoji}</div>

      <h3 className="mt-5 text-xl font-semibold">{title}</h3>

      <p className="mt-2 text-zinc-600">{description}</p>

      <div className="mt-5 text-sm font-medium text-amber-600">
        {href ? "Empezar →" : "Próximamente"}
      </div>
    </>
  )

  if (!href) {
    return (
      <div className="rounded-2xl border bg-zinc-50 p-6 opacity-60">
        {content}
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="rounded-2xl border bg-zinc-50 p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
    >
      {content}
    </Link>
  )
}
