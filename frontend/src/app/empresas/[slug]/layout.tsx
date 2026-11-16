import Footer from "@/components/Footer";
import HeaderEmpresas from "@/components/HeaderEmpresas";

export default function EmpresaLayout({
  children,
}: LayoutProps<"/empresas/[slug]">) {
  return (
    <>
      <HeaderEmpresas />
      {children}
      <Footer />
    </>
  );
}
