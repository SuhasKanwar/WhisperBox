import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "../context/AuthProvider";
import { Toaster } from "@/components/ui/toaster"
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Whisper Box",
  description: "A web app for messaging anonymously",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`antialiased`}>
          <header className="sticky top-0 z-50">
            <NavBar />
          </header>
          <main>
            {children}
          </main>
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}