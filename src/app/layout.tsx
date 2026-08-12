import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope, Caveat } from "next/font/google";
import { AuthProvider } from "@/lib/supabase/auth-context";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Empática Pet | O Cuidado Perfeito para seu Pet",
  description: "Ecossistema completo de saúde pet - conectando tutores, veterinários e tecnologia de IA com empatia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${plusJakarta.variable} ${manrope.variable} ${caveat.variable} h-full`}>
      <body className="min-h-full antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
