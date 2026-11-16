"use client";

import { useState } from "react";
import { LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const result = await adminService.login(email.trim(), password);

      if ("error" in result) {
        toast.error(result.error.message);
        return;
      }

      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Não foi possível realizar o login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-fundo flex min-h-screen items-center justify-center px-4">
      <div className="border-marca1/30 bg-card w-full max-w-md rounded-2xl border p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="flex h-24 w-full items-center justify-center">
            <Image
              src="/Logo_COMPLETA.png"
              alt="Guia Comercial ES"
              width={500}
              height={500}
              className="h-18 w-24 object-contain"
            />
          </div>
          <h1 className="font-title text-fundo2 text-2xl font-bold lg:text-3xl">
            Painel Administrativo
          </h1>

          <p className="text-fundo2/70 mt-2 text-sm">
            Entre com suas credenciais para continuar.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="text-fundo2 mb-2 block text-sm font-medium"
            >
              Email
            </label>

            <div className="border-marca1/50 focus-within:border-marca focus-within:ring-marca/20 flex items-center gap-3 rounded-lg border px-3 focus-within:ring-2">
              <Mail size={18} className="text-marca" />

              <input
                id="email"
                type="email"
                placeholder="Digite seu username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                className="text-fundo2 placeholder:text-fundo2/40 w-full bg-transparent py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-fundo2 mb-2 block text-sm font-medium"
            >
              Senha
            </label>

            <div className="border-marca1/50 focus-within:border-marca focus-within:ring-marca/20 flex items-center gap-3 rounded-lg border px-3 focus-within:ring-2">
              <LockKeyhole size={18} className="text-marca" />

              <input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="text-fundo2 placeholder:text-fundo2/40 w-full bg-transparent py-3 text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-marca hover:bg-marca/90 focus:ring-marca flex w-full items-center justify-center rounded-lg px-4 py-3 font-semibold text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <span>Entrar</span>
            )}
          </button>
        </form>

        <p className="text-fundo2/50 mt-6 text-center text-xs">
          Guia Comercial ES · Área administrativa
        </p>
      </div>
    </main>
  );
}
