"use client"
import { useState,useEffect } from "react"
import { ProductStats } from "./ProductStats"
import { ProductList } from "./ProductList"
import { NewProductModal } from "./NewProduct"
import { product } from "@/types/index"
import { stats } from "@/lib/constantes/index"



export  default function ProductPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [products, setProducts] = useState<product[]>([])
  //vamos a poder obtener la lista de productos con el metodo GET
  useEffect(() => {
    fetch("/api/product")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
      })
  }, [])


  const handleAddProduct = (newProduct: product) => {
    //desestructuramos el objeto para agregar la fecha
    const { name, category, price, status } = newProduct
    //agregar con un post a su api
    fetch("/api/product", {
      method: "POST",
      body: JSON.stringify({ name, category, price , status }),
    })
    //verificamos algun error en la respuesta
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error al agregar el producto")
      }
      return res.json()
    })
    //actualizamos la lista de productos
    .then(() => {
      setProducts([...products, newProduct])
    })
    //manejamos el error
    .catch((error) => {
      console.error("Error:", error)
    })
  }

  return (
    <div >
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
      <ProductStats stats={stats(products || [])} />

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
