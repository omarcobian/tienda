'use client'

import { useState } from "react";

interface SalesFormProps {
  onAddProduct: (product: string, quantity: number) => void;
}

export default function SalesForm({ onAddProduct }: SalesFormProps) {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="w-1/2 border rounded-xl p-6">
      <h2 className="font-semibold text-lg mb-4">Registrar Nueva Venta</h2>

      {/* Selector de producto */}
      <label className="block mb-2 text-sm font-medium">Seleccionar Producto</label>
      <select
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        className="w-full border rounded-md p-2 mb-4"
      >
        <option value="">Selecciona un producto</option>
        <option value="Hamburguesa">Hamburguesa</option>
        <option value="Papas">Papas</option>
        <option value="Refresco">Refresco</option>
      </select>

      {/* Cantidad */}
      <label className="block mb-2 text-sm font-medium">Cantidad</label>
      <input
        type="number"
        value={quantity}
        min={1}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-full border rounded-md p-2 mb-4"
      />

      {/* Botón agregar */}
      <button
        onClick={() => {
          if (product) onAddProduct(product, quantity);
        }}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
      >
        + Agregar a la Venta
      </button>
    </div>
  );
}
