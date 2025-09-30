// Es un componente que siempre estara presente en todas las rutas de el dashboard
import MenuCard from "@/components/ui/MenuCard";
import Navbar from "@/components/ui/Navbar";

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
        <div className="grid grid-cols-5 gap-4">
          <MenuCard title="Registrar Venta" icon="venta" active />
          <MenuCard title="Gastos" icon="gasto" />
          <MenuCard title="Productos" icon="producto" />
          <MenuCard title="Reportes" icon="reporte" />
          <MenuCard title="Usuarios" icon="usuario" />
        </div>

        {children}
        </main>
      </div>
  );
}