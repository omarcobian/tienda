/**
 * ProductList Component - Lista de productos
 * 
 * Buenas prácticas aplicadas:
 * - ✅ Componente de presentación puro
 * - ✅ Props tipadas con TypeScript
 * - ✅ Key única para cada elemento (id en lugar de index)
 * - ✅ Diseño responsivo con Tailwind
 * 
 * Mejoras aplicadas:
 * - Usar id como key en lugar de index (mejor para React reconciliation)
 * - Soporte para productos vacíos (manejado en parent)
 * 
 * Escalabilidad futura:
 * - Añadir virtualización para listas largas (react-window)
 * - Implementar drag & drop para reordenar
 * - Añadir selección múltiple con checkboxes
 * - Añadir ordenamiento por columnas
 */

"use client"

import React from "react"
import { ProductCard } from "./ProductCard"
import type { ProductWithId } from "@/types"

interface ProductListProps {
  products: ProductWithId[]
}

/**
 * Componente que renderiza una lista de productos
 * Delega la renderización de cada producto a ProductCard
 */
export function ProductList({ products }: ProductListProps) {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductCard
          key={product.id} // Usar id único en lugar de index
          product={product}
        />
      ))}
    </div>
  )
}

