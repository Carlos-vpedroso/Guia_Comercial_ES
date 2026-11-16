"use client";

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-marca1/30 animate-pulse rounded-lg ${className}`} />
  );
}

function EmpresaCardSkeleton() {
  return (
    <div className="bg-card flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border">
      {/* Imagem da empresa */}
      <Skeleton className="aspect-video w-full rounded-none" />

      {/* Informações da empresa */}
      <div className="flex flex-1 flex-col space-y-3 p-4">
        <Skeleton className="h-5 w-3/4" />

        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>

        <div className="mt-auto flex items-start gap-2 pt-2">
          <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FiltrosSkeleton() {
  return (
    <aside className="bg-card hidden h-fit rounded-2xl border p-5 lg:block">
      {/* Cabeçalho */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-5 w-20" />
      </div>

      <div className="mt-6 space-y-6">
        {/* Cidade */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>

        {/* Categorias */}
        <div className="space-y-4 border-t pt-5">
          <Skeleton className="h-4 w-24" />

          <div className="space-y-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
          </div>
        </div>

        {/* Ordenação */}
        <div className="space-y-3 border-t pt-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    </aside>
  );
}

export default function Loading() {
  return (
    <>
      {/* Cabeçalho do catálogo */}
      <section className="flex w-full px-2 py-8 lg:px-6">
        <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full max-w-2xl space-y-4">
            <Skeleton className="h-12 w-56 lg:h-20 lg:w-80" />

            <div className="max-w-xl space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          {/* Contador de empresas */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl" />

            <div className="space-y-2">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo principal */}
      <main className="px-4 pb-8 lg:px-6">
        <section>
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
            <FiltrosSkeleton />

            <div className="min-w-0">
              {/* Contagem e botão de filtros */}
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>

                <Skeleton className="h-9 w-24 rounded-xl lg:hidden" />
              </div>

              {/* Cards das empresas */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <EmpresaCardSkeleton key={index} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
