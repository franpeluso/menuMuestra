import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nombre | Carta',
  description: 'Nuestra carta digital',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-[#fbf4eb] text-zinc-800 min-h-screen relative">
        {children}
      </body>
    </html>
  );
}