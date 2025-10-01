"use client"
import React, { useState } from "react"
import { ProductStats } from "./ProductStats"
import { ProductList } from "./ProductList"
import { NewProductModal } from "./NewProduct"

export default function ProductPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [products, setProducts] = useState([
    {
      name: "Coca Cola",
      status: "Activo",
      category: "Bebidas Frías",
      price: 77,
      createdBy: "Administrador",
      date: "27/9/2025",
    },
  ])

  const stats = [
    { label: "Total Productos", value: products.length },
    { label: "Productos Activos", value: products.filter(p => p.status === "Activo").length, color: "text-green-600" },
    { label: "Productos Inactivos", value: products.filter(p => p.status === "Inactivo").length, color: "text-orange-600" },
  ]

  const handleAddProduct = (newProduct: any) => {
    setProducts([...products, newProduct])
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-blue-600">📦</span> Gestión de Productos
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-80"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Stats */}
      <ProductStats stats={stats} />

      {/* Product List */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <h3 className="text-lg font-semibold">Lista de Productos</h3>
        <ProductList products={products} />
      </div>

      {/* Modal */}
      <NewProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddProduct}
      />
    </div>
  )
}
