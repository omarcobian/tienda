"use client"
import React from "react"
import { ProductCard } from "./ProductCard"

export function ProductList({ products }: { products: any[] }) {
  return (
    <div className="space-y-4">
      {products.map((product, i) => (
        <ProductCard
          key={i}
          {...product}
          onEdit={() => console.log("Editar", product.name)}
          onDelete={() => console.log("Eliminar", product.name)}
          onToggle={() => console.log("Toggle", product.name)}
        />
      ))}
    </div>
  )
}
