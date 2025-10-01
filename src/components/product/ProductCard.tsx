"use client"
import React from "react"
import { Edit, Trash2 } from "lucide-react"

interface ProductCardProps {
  name: string
  status: "Activo" | "Inactivo"
  category: string
  price: number
  createdBy: string
  date: string
  onEdit?: () => void
  onDelete?: () => void
  onToggle?: () => void
}

export function ProductCard({
  name,
  status,
  category,
  price,
  createdBy,
  date,
  onEdit,
  onDelete,
  onToggle,
}: ProductCardProps) {
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
          Creado por: {createdBy} • {date}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={onEdit}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={onToggle}
          className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          {status === "Activo" ? "Desactivar" : "Activar"}
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-md bg-red-600 text-white hover:bg-red-700"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}
