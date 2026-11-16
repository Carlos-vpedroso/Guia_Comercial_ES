import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "session";
const LOGIN_PATH = "/admin";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permite acessar a tela de login sem autenticação.
  if (pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  // Obtém o JWT do cookie HttpOnly.
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET não foi configurado.");
    return NextResponse.json(
      { error: "Erro interno de autenticação." },
      { status: 500 },
    );
  }

  try {
    // Valida assinatura, expiração e algoritmo permitido.
    const secretKey = new TextEncoder().encode(secret);

    await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    // Token válido: permite continuar a requisição.
    return NextResponse.next();
  } catch {
    // Token inválido, malformado ou expirado.
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));

  // Remove o cookie inválido no navegador.
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
