import Container from "@/components/Container";
import Header from "@/components/Header";
import Hero from "./_components/Hero";
import EmDestaque from "./_components/EmDestaque";
import Categorias from "./_components/Categorias";
import InfoCta from "./_components/InfoCta";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Container maxWidth={false}>
        <Header />
        <Hero />
      </Container>
      <EmDestaque />
      <Categorias  />
      <InfoCta />
      <Footer />
    </>
  );
}
