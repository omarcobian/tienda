/**
 * ProductCard Component - Tarjeta individual de producto
 * 
 * Buenas prácticas aplicadas:
 * - ✅ Componente reutilizable y modular
 * - ✅ Props bien definidas con TypeScript
 * - ✅ Separación de lógica de presentación
 * - ✅ Accesibilidad (aria-labels, botones semánticos)
 * - ✅ Diseño responsivo con Tailwind
 * 
 * Mejoras implementadas:
 * - Recibe producto completo en lugar de props individuales
 * - Usa hook useProducts para operaciones (en lugar de imports directos)
 * - Feedback visual en operaciones (loading, confirmación)
 * - Formateo consistente de datos (precio, fecha)
 * 
 * Mejoras futuras:
 * - Implementar modal de confirmación para delete
 * - Añadir modal de edición inline
 * - Mostrar loader durante operaciones
 * - Añadir animaciones de transición
 * - Implementar undo/redo para acciones
 */

"use client"

import React, { useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import type { CreateProductDTO, ProductWithId } from "@/types"

interface ProductCardProps {
  product: ProductWithId
  onDelete:  (id: string) => Promise<boolean>
  onUpdate: (id: string, product: Partial<CreateProductDTO>) => Promise<ProductWithId | null>
}

/**
 * Tarjeta de producto con acciones de edición, toggle y eliminación
 * 
 * Mejora futura: Separar en componentes más pequeños
 * - ProductCardInfo (datos del producto)
 * - ProductCardActions (botones de acción)
 * - ProductCardBadges (badges de estado y categoría)
 */
export function ProductCard({ product, onDelete, onUpdate}: ProductCardProps) {
  const { id, name, status, category, price, date } = product
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  /**
   * Maneja la edición del producto
   * Mejora futura: Abrir modal de edición con formulario precargado
   */
  const handleEdit = () => {
    /**
     * TODO: Implementar modal de edición
     * setEditModalOpen(true)
     * setEditingProduct(product)
     */
    console.log("Editar producto:", name)
    // Placeholder: por ahora solo log
    alert("Función de edición en desarrollo. Ver console para detalles.")
  }

  /**
   * Maneja la eliminación del producto
   * Mejora futura: Mostrar modal de confirmación antes de eliminar
   */
  const handleDelete = async () => {
    // Confirmación de usuario
    const confirmed = window.confirm(`¿Estás seguro de eliminar "${name}"?`)
    if (!confirmed) return

    setIsDeleting(true)
    
    try {
      const success = await onDelete(id)
      
      if (success) {
        /**
         * Mejora futura: Mostrar toast notification
         * toast.success(`Producto "${name}" eliminado`)
         */
        console.log("Producto eliminado:", name)
      } else {
        alert("Error al eliminar el producto")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error al eliminar el producto")
    } finally {
      // Ya no necesitamos llamar a refreshProducts porque deleteProduct ya actualiza el estado
      setIsDeleting(false)
    }
  }

  /**
   * Cambia el estado del producto (Activo ↔ Inactivo)
   */
  const handleToggle = async () => {
    const newStatus = status === "Activo" ? "Inactivo" : "Activo"
    
    setIsToggling(true)
    
    try {
      const updated = await onUpdate(id, { status: newStatus })
      
      if (updated) {
        /**
         * Mejora futura: Mostrar toast notification
         * toast.success(`Producto ${newStatus.toLowerCase()}`)
         */
        console.log(`Producto ${newStatus}:`, name)
      } else {
        alert("Error al cambiar el estado")
      }
    } catch (error) {
      console.error("Error toggling product:", error)
      alert("Error al cambiar el estado")
    } finally {
      // Ya no necesitamos llamar a refreshProducts porque updateProduct ya actualiza el estado
      setIsToggling(false)
    }
  }

  /**
   * Formatea la fecha para mostrar
   * Mejora futura: Usar librería de formateo (date-fns, dayjs)
   */
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString // Fallback si el formato falla
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      {/* Información del producto */}
      <div className="flex-1 space-y-2">
        <h3 className="font-semibold text-lg">{name}</h3>
        
        {/* Badges de estado y categoría */}
        <div className="flex gap-2 flex-wrap">
          <span className={`px-2 py-1 text-xs rounded-md font-medium transition-colors ${
            status === "Activo"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}>
            {status}
          </span>
          <span className="px-2 py-1 text-xs rounded-md border bg-blue-50 text-blue-700">
            {category}
          </span>
        </div>
        
        {/* Precio y fecha */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <p className="text-green-600 font-semibold text-lg">
            ${price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            Creado: {formatDate(date)}
          </p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2 justify-end">
        {/* Botón editar */}
        <button
          onClick={handleEdit}
          className="p-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          aria-label={`Editar ${name}`}
          title="Editar producto"
        >
          <Edit size={18} />
        </button>
        
        {/* Botón toggle estado */}
        <button
          onClick={handleToggle}
          className="px-3 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
          disabled={isToggling}
          aria-label={status === "Activo" ? "Desactivar" : "Activar"}
        >
          {isToggling 
            ? "..." 
            : (status === "Activo" ? "Desactivar" : "Activar")
          }
        </button>
        
        {/* Botón eliminar */}
        <button
          onClick={handleDelete}
          className="p-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          disabled={isDeleting}
          aria-label={`Eliminar ${name}`}
          title="Eliminar producto"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}

