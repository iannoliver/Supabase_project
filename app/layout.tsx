import type { Metadata } from "next";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { cn } from "@/lib/utils/cn";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pulse Commerce",
    template: "%s | Pulse Commerce",
  },
  description:
    "Painel administrativo e vitrine de produtos com Next.js, Supabase e arquitetura pronta para produção.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn("min-h-screen text-slate-950 antialiased")}>
        <QueryProvider>{children}</QueryProvider>
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}
