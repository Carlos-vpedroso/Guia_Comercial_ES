import { Suspense } from "react";
import SidebarMenu from "./_components/SidebarMenu";

export default function DashboardLayout({
  children,
}: LayoutProps<"/admin/dashboard">) {
  return (
    <div className="bg-fundo min-h-screen lg:flex">
      <Suspense fallback={<div className="flex-1 p-6">Carregando...</div>}>
        <SidebarMenu />
        <main className="flex w-full flex-col pt-16 lg:p-0">{children}</main>
      </Suspense>
    </div>
  );
}
