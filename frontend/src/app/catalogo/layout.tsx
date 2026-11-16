import Footer from "@/components/Footer";
import HeaderEmpresas from "@/components/HeaderEmpresas";

export default function CatalogoLayout({ children }: LayoutProps<"/catalogo">) {
  return (
    <>
      <HeaderEmpresas />
      {children}
      <Footer />
    </>
  );
}
