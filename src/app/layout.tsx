import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "../context/AuthProvider";

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
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}