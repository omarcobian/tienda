"use client"
import React from "react"
import { ProductCard } from "./ProductCard"
import { product } from "@/types"

export function ProductList({ products }: { products: product[] }) {
  return (
    <div className="space-y-4">
      {products.map((product, i) => (
        <ProductCard
          key={i}
          {...product}
        />
      ))}
    </div>
  )
}
