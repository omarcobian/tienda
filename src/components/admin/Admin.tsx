"use client"

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import MenuCard from "@/components/ui/MenuCard";
import SalesForm from "@/components/admin/SalesForm";
import SalesSummary from "@/components/admin/SalesSummary";

export default function Admin() {
  const [items, setItems] = useState<{ product: string; quantity: number }[]>([]);

  const handleAddProduct = (product: string, quantity: number) => {
    setItems((prev) => [...prev, { product, quantity }]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar superior */}
      <Navbar />

      <main className="p-6 space-y-6">
        {/* Menú principal */}
        <div className="grid grid-cols-5 gap-4">
          <MenuCard title="Registrar Venta" icon="venta" active />
          <MenuCard title="Gastos" icon="gasto" />
          <MenuCard title="Productos" icon="producto" />
          <MenuCard title="Reportes" icon="reporte" />
          <MenuCard title="Usuarios" icon="usuario" />
        </div>

        {/* Sección de ventas */}
        <div className="flex gap-6">
          <SalesForm onAddProduct={handleAddProduct} />
          <SalesSummary items={items} />
        </div>
      </main>
    </div>
  );
}
