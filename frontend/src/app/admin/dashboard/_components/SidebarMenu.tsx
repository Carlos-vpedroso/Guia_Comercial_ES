"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Tags,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  LoaderCircle,
  User,
} from "lucide-react";
import { useState } from "react";
import { adminService } from "@/services/admin.service";

const mainNavigation = [
  {
    label: "Visão Geral",
    page: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Empresas",
    page: "empresas",
    href: "/admin/dashboard?Page=empresas",
    icon: Building2,
  },
  {
    label: "Cadastro de Empresa",
    page: "cadastro",
    href: "/admin/dashboard?Page=cadastro",
    icon: Plus,
  },
  {
    label: "Categorias",
    page: "categorias",
    href: "/admin/dashboard?Page=categorias",
    icon: Tags,
  },
];

const secondaryNavigation = [
  {
    label: "Configurações",
    href: "/admin/dashboard?Page=configuracoes",
    icon: Settings,
  },
];

export default function SidebarMenu() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleNavigation = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const currentPage = searchParams.get("Page") ?? "Dashboard";

  const isActive = (page: string) => {
    return currentPage.toLowerCase() === page.toLowerCase();
  };

  async function handleLogout() {
    if (loading) return;

    setLoading(true);

    try {
      const result = await adminService.logout();

      if ("error" in result) {
        console.error(result.error.message);
        return;
      }

      router.push("/admin");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Header mobile */}
      <header className="border-marca1/20 bg-card text-text fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b px-4 shadow-xs lg:hidden">
        <button
          onClick={() => handleNavigation("/admin/dashboard")}
          className="flex items-center gap-3"
          aria-label="Ir para o painel"
        >
          <Image
            src="/Logo_COMPLETA.png"
            alt="Guia Comercial ES"
            width={500}
            height={500}
            className="h-12 w-24 object-contain"
          />
        </button>
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="border-marca1/20 hover:bg-marca/10 flex h-10 w-10 items-center justify-center rounded-xl border transition"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Overlay mobile */}
      {open && (
        <button
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
          className="bg-fundo2/70 fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-[260px] flex-col transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-marca1/20 bg-card text-text flex h-full flex-col border-r">
          {/* Logo */}
          <div className="border-marca1/20 flex h-24 shrink-0 items-center border-b px-5">
            <button
              onClick={() => handleNavigation("/admin/dashboard")}
              className="flex w-full items-center gap-3 text-left"
            >
              <Image
                src="/Logo_COMPLETA.png"
                alt="Guia Comercial ES"
                width={500}
                height={500}
                className="h-18 w-full object-contain"
              />
            </button>
          </div>

          {/* Navegação */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div>
              <p className="text-text/40 mb-3 px-3 text-[10px] font-semibold tracking-[0.2em] uppercase">
                Principal
              </p>

              <nav className="space-y-1">
                {mainNavigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.page);

                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNavigation(item.href)}
                      aria-current={active ? "page" : undefined}
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-all ${
                        active
                          ? "bg-marca/10 text-marca"
                          : "text-text/65 hover:bg-marca/10 hover:text-text"
                      }`}
                    >
                      <Icon
                        className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                          active
                            ? "text-marca"
                            : "text-text/45 group-hover:text-marca"
                        }`}
                      />

                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sistema
            <div className="mt-8">
              <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.2em] text-text/40 uppercase">
                Sistema
              </p>

              <nav className="space-y-1">
                {secondaryNavigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNavigation(item.href)}
                      aria-current={active ? "page" : undefined}
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-all ${
                        active
                          ? "bg-marca/10 text-marca"
                          : "text-text/65 hover:bg-marca1/10 hover:text-text"
                      }`}
                    >
                      <Icon
                        className={`h-[18px] w-[18px] ${
                          active
                            ? "text-marca"
                            : "text-text/45 group-hover:text-marca1"
                        }`}
                      />

                      <span>{item.label}</span>

                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-marca" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div> */}
          </div>

          {/* Usuário e saída */}
          <div className="border-marca1/20 shrink-0 border-t p-4">
            <div className="flex items-center gap-3 rounded-xl p-2">
              <div className="bg-marca/15 text-marca flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                <User size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-text truncate text-sm font-semibold">
                  Machado de Assis
                </p>

                <p className="text-text/45 truncate text-xs">
                  Painel de controle
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex w-full"
            >
              {loading ? (
                <div className="bg-marca/10 text-marca flex w-full items-center justify-center rounded-xl px-3 py-3">
                  <LoaderCircle size={18} className="animate-spin" />
                </div>
              ) : (
                <div className="text-text/55 hover:bg-marca/10 hover:text-marca mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition">
                  <LogOut size={18} />

                  <span>Sair</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
