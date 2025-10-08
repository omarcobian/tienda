/**
 * ProductPage Component - Página principal de gestión de productos
 * 
 * Arquitectura aplicada:
 * - ✅ Componente limpio sin lógica de negocio pesada
 * - ✅ Uso de custom hooks para separar lógica
 * - ✅ Manejo de estados centralizado (loading, error)
 * - ✅ Componentes reutilizables y modulares
 * - ✅ Tipado fuerte con TypeScript
 * 
 * Buenas prácticas implementadas:
 * - Separación de responsabilidades (UI vs lógica)
 * - Composición de componentes
 * - Manejo de errores en UI
 * - Estados de carga apropiados
 * - Props drilling mínimo
 * 
 * Mejoras de UX aplicadas:
 * - Loading state mientras carga datos
 * - Error messages descriptivos
 * - Feedback visual en operaciones
 * 
 * Escalabilidad futura:
 * - Implementar búsqueda y filtros (input de búsqueda, filtros por categoría/estado)
 * - Añadir paginación o scroll infinito
 * - Implementar ordenamiento de columnas
 * - Añadir exportación de datos (CSV, Excel)
 * - Implementar edición inline de productos
 * - Añadir bulk operations (eliminar múltiples, cambiar estado masivo)
 */

"use client"

import { useState } from "react"
import { ProductStats } from "./ProductStats"
import { NewProductModal } from "./NewProduct"
import { useProducts } from "@/hooks/useProducts"
import { stats } from "@/lib/constantes/index"
import type { CreateProductDTO } from "@/types"
import { ProductCard } from "./ProductCard"

/**
 * Componente principal de gestión de productos
 * Orquesta los subcomponentes y maneja el estado de la UI
 */
export default function ProductPage() {
  // Estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Hook personalizado para gestión de productos
  const { 
    products, 
    loading, 
    error, 
    createProduct,
    clearError,
    deleteProduct,
    updateProduct
  } = useProducts()

  /**
   * Handler para crear un producto
   * Muestra feedback al usuario y cierra el modal tras crear
   */
  const handleAddProduct = async (newProduct: CreateProductDTO) => {
    const product = await createProduct(newProduct)
    
    if (product) {
      // Éxito: cerrar modal
      setIsModalOpen(false)
      
      /**
       * Mejora futura: Mostrar toast notification
       * toast.success(`Producto "${product.name}" creado exitosamente`)
       */
    } else {
      /**
       * Mejora futura: Mostrar toast de error
       * toast.error('Error al crear el producto')
       */
    }
  }

  /**
   * Renderizar estado de carga
   * Mejora futura: Usar skeleton loader para mejor UX
   */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    )
  }

  /**
   * Renderizar estado de error
   * Mejora futura: Añadir botón de reintentar
   */
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <span className="text-red-600 text-xl mr-3">⚠️</span>
          <div className="flex-1">
            <h3 className="text-red-800 font-semibold">Error al cargar productos</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={clearError}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con título y botón de acción */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-blue-600">📦</span> 
          Gestión de Productos
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-80 transition-opacity"
          aria-label="Crear nuevo producto"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Estadísticas de productos */}
      <ProductStats stats={stats(products)} />

      {/* Lista de productos */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <h3 className="text-lg font-semibold">Lista de Productos</h3>
        
        {/* 
          Mejora futura: Añadir barra de búsqueda y filtros aquí
          <div className="flex gap-4 mb-4">
            <SearchInput onSearch={handleSearch} />
            <CategoryFilter onChange={handleFilterCategory} />
            <StatusFilter onChange={handleFilterStatus} />
          </div>
        */}
        
        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No hay productos registrados</p>
            <p className="text-sm mt-2">Crea tu primer producto usando el botón &quot;Nuevo Producto&quot;</p>
          </div>
        ) : (
          <div className="space-y-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id} // Usar id único en lugar de index
                  product={product}
                  onDelete={deleteProduct}
                  onUpdate={updateProduct}
                />
              ))}
            </div>
        )}
      </div>

      {/* Modal para crear producto */}
      <NewProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddProduct}
      />
    </div>
  )
}

