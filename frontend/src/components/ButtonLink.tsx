import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ButtonLinkProps {
  bgColor?:
    | "bg-marca"
    | "bg-marca1"
    | "bg-marca2"
    | "bg-marca3"
    | "bg-fundo"
    | "bg-card";
  bgHover?:
    | ""
    | "hover:bg-marca"
    | "hover:bg-marca1"
    | "hover:bg-marca2"
    | "hover:bg-marca3"
    | "hover:bg-fundo"
    | "hover:bg-card";
  colorText?: "text-text" | "text-text2";
  href: string;
  children: React.ReactNode;
  reverse?: boolean;
  target?: boolean;
}

export default function ButtonLink({
  bgColor = "bg-marca1",
  bgHover = "hover:bg-marca",
  colorText = "text-text2",
  href,
  children,
  reverse = false,
  target = false,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      target={target ? "_blank" : undefined}
      rel={target ? "noopener noreferrer" : undefined}
      className={`${bgColor} ${colorText} ${bgHover} group flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md`}
    >
      {reverse && (
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
      )}

      {children}

      {!reverse && (
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </Link>
  );
}
