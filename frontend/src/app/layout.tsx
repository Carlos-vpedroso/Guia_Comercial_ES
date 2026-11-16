import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/lib/utils";
import { ApplicationProvider } from "@/context/ApplicationContext";
import { Toaster } from "sonner";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Guia Comercial ES",
  description:
    "Encontre empresas, serviços e comércios do Espírito Santo em um só lugar. Conheça negócios, produtos, serviços e formas de contato.",
  authors: [{ name: "TecZed", url: "https://www.teczed.com.br" }],
  creator: "TecZed",
  publisher: "TecZed",
  icons: {
    icon: [
      { url: "/icons/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/icons/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/icons/site.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-Br"
      data-scroll-behavior="smooth"
      className={cn(
        "h-full",
        "antialiased",
        bricolageGrotesque.variable,
        figtree.variable,
        "font-sans",
      )}
    >
      <body className="flex min-h-full flex-col">
        <ApplicationProvider>{children}</ApplicationProvider>
        <Analytics />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
