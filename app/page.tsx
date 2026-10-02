import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen select-none bg-zinc-100">

      {/* NAVBAR */}

      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

          <Link
            href="/"
            className="text-lg font-bold tracking-tight"
          >
            AulaKit
          </Link>

          <div className="flex items-center gap-1">

            <Link
              href="/cuadrante"
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              Cuadrante
            </Link>


          </div>
        </nav>
      </header>

      {/* CONTENIDO */}

      <div className="mx-auto max-w-6xl px-6">

        {/* INTRODUCCIÓN */}

        <section className="border-b border-zinc-200 py-20">

          <div className="max-w-2xl">

            <p className="text-sm font-medium text-zinc-500">
              Herramientas para el aula
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              AulaKit
            </h1>

            <p className="mt-5 text-lg leading-8 text-zinc-600">
              Una colección de herramientas sencillas para
              organizar diferentes tareas del día a día en clase.
            </p>

          </div>

        </section>

        {/* HERRAMIENTAS */}

        <section className="py-16">

          <div className="flex items-end justify-between">

            <div>
              <h2 className="text-2xl font-semibold">
                Herramientas
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Selecciona una herramienta para empezar.
              </p>
            </div>

          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">

            <Tool
              title="Cuadrante de clase"
              description="Organiza a los alumnos en el aula mediante una cuadrícula."
              href="/cuadrante"
              available
            />

            <Tool
              title="Más herramientas"
              description="Por venir."
            />

            <Tool
              title="Más herramientas"
              description="Por venir."
            />

          </div>

        </section>

      </div>
    </main>
  )
}

function Tool({
  title,
  description,
  href,
  available = false,
}: {
  title: string
  description: string
  href?: string
  available?: boolean
}) {
  const content = (
    <>
      <div className="flex items-center justify-between">

        <h3 className="font-semibold">
          {title}
        </h3>

        {available ? (
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
            Disponible
          </span>
        ) : (
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-400">
            Próximamente
          </span>
        )}

      </div>

      <p className="mt-3 text-sm leading-6 text-zinc-500">
        {description}
      </p>

      {available && (
        <div className="mt-6 text-sm font-medium text-zinc-900">
          Abrir herramienta →
        </div>
      )}
    </>
  )

  if (!href) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        {content}
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="group rounded-xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm"
    >
      {content}
    </Link>
  )
}
