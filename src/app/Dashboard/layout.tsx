// Es un componente que siempre estara presente en todas las rutas de el dashboard
import Navbar from "@/components/ui/Navbar";
import Menu from "@/components/ui/Menu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Menú principal */}
        <Menu />
        {children}
        </main>
      </div>
  );
}