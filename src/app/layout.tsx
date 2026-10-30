import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FUTSALHUB - Integrated Arena Booking System",
  description: "Platform Reservasi Lapangan Futsal Real-Time Modern",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
