import Container from "@/components/Container";

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-marca1/30 animate-pulse rounded-lg ${className}`} />
  );
}

export default function Loading() {
  return (
    <Container>
      <main className="px-2 py-8 lg:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 pb-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-36" />
        </div>

        {/* Galeria de fotos */}
        <section className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr]">
          <Skeleton className="min-h-[260px] rounded-2xl md:min-h-[430px]" />

          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="min-h-[125px] rounded-2xl md:min-h-[208px]"
              />
            ))}
          </div>
        </section>

        {/* Conteúdo principal e barra lateral */}
        <section className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Conteúdo principal */}
          <div className="min-w-0 space-y-8">
            {/* Cabeçalho */}
            <div>
              <Skeleton className="mb-5 h-7 w-32 rounded-full" />

              <Skeleton className="h-12 w-4/5 sm:h-14 lg:h-16" />

              <div className="mt-5 flex flex-wrap gap-4">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-40" />
              </div>

              {/* Botões */}
              <div className="mt-7 flex flex-wrap gap-3">
                <Skeleton className="h-12 w-52 rounded-xl" />
                <Skeleton className="h-12 w-36 rounded-xl" />
              </div>
            </div>

            {/* Sobre a empresa */}
            <div className="space-y-4 pt-2">
              <Skeleton className="h-8 w-56" />

              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Localização */}
            <div>
              <Skeleton className="h-8 w-40" />

              <div className="border-border/50 bg-card mt-4 space-y-4 rounded-2xl border p-4">
                <Skeleton className="h-11 w-11 rounded-xl" />

                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>

                {/* Mapa */}
                <Skeleton className="aspect-4/3 w-full rounded-xl" />
              </div>
            </div>
          </div>

          {/* Barra lateral */}
          <aside className="space-y-4 lg:sticky lg:top-6">
            {/* Contatos */}
            <div className="border-text/10 bg-card rounded-2xl border p-4">
              <Skeleton className="h-7 w-28" />

              <div className="mt-5 space-y-5">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-4 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Horários */}
            <div className="border-text/10 bg-card rounded-2xl border p-4">
              <Skeleton className="h-7 w-28" />

              <div className="mt-5 space-y-2">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="even:bg-fundo flex items-center justify-between gap-3 rounded-lg px-2 py-2.5"
                  >
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </Container>
  );
}
