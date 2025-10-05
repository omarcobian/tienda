"use client"
import React from "react"
import { Edit, Trash2 } from "lucide-react"
import { editarProducto } from "@/lib/productos/index"
interface ProductCardProps {
  name: string
  status: "Activo" | "Inactivo"
  category: string
  price: number
  date: string
}

export function ProductCard({
  name,
  status,
  category,
  price,
  date,
}: ProductCardProps) {
  //funciones para manejar los eventos
  const handleEdit = () => {
    //llama a la funcion editarProducto de lib/productos para editar el producto
    editarProducto({
      name,
      status,
      category,
      price,
      date,
    })
  }
  const handleDelete = () => {
    console.log("Eliminar", name)
  }
  const handleToggle = () => {
    console.log("Toggle", name)
  }
  return (
    <div className="bg-white rounded-xl shadow p-4 border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      {/* Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">{name}</h3>
        <div className="flex gap-2">
          <span className={`px-2 py-1 text-xs rounded-md font-medium ${
            status === "Activo"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700"
          }`}>
            {status}
          </span>
          <span className="px-2 py-1 text-xs rounded-md border">{category}</span>
        </div>
        <p className="text-green-600 font-semibold">${price.toFixed(2)}</p>
        <p className="text-sm text-gray-500">
          Creado en: • {date}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={handleEdit}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={handleToggle}
          className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          {status === "Activo" ? "Desactivar" : "Activar"}
        </button>
        <button
          onClick={handleDelete}
          className="p-2 rounded-md bg-red-600 text-white hover:bg-red-700"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}
