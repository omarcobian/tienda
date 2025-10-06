/**
 * NewProductModal Component - Modal para crear nuevos productos
 * 
 * Arquitectura aplicada:
 * - ✅ Componente controlado con React state
 * - ✅ Validación de formulario en cliente
 * - ✅ Props bien definidas con TypeScript
 * - ✅ Manejo de eventos apropiado
 * - ✅ Reset de formulario tras submit
 * 
 * Buenas prácticas implementadas:
 * - Componente reutilizable y modular
 * - Validación de campos requeridos
 * - Accesibilidad (labels, required attributes)
 * - UX mejorada (cierre con ESC, click fuera)
 * - Estados de formulario limpios
 * 
 * Mejoras futuras:
 * - Usar React Hook Form para manejo avanzado de formularios
 * - Validación con Zod en cliente (mismos schemas que backend)
 * - Añadir preview de imagen de producto
 * - Implementar autocompletado de categorías
 * - Añadir campo de descripción y SKU
 * - Soporte para múltiples imágenes
 * 
 * @example Usando React Hook Form + Zod (futuro):
 * ```tsx
 * import { useForm } from 'react-hook-form'
 * import { zodResolver } from '@hookform/resolvers/zod'
 * import { CreateProductSchema } from '@/schemas/product.schema'
 * 
 * const { register, handleSubmit, formState: { errors } } = useForm({
 *   resolver: zodResolver(CreateProductSchema)
 * })
 * ```
 */

"use client"

import React, { useState, useEffect } from "react"
import type { CreateProductDTO } from "@/types"

interface NewProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: CreateProductDTO) => void | Promise<void>
}

/**
 * Modal para crear un nuevo producto
 * Formulario controlado con validación básica
 */
export function NewProductModal({ isOpen, onClose, onSave }: NewProductModalProps) {
  // Estados del formulario
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState<string>("") // String para permitir input vacío
  const [status, setStatus] = useState<"Activo" | "Inactivo">("Activo")
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Reset del formulario cuando se cierra el modal
   */
  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  /**
   * Limpia todos los campos del formulario
   */
  const resetForm = () => {
    setName("")
    setCategory("")
    setPrice("")
    setStatus("Activo")
    setIsSubmitting(false)
  }

  /**
   * Maneja el cierre del modal con ESC
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  /**
   * Handler del submit del formulario
   * Valida y envía los datos al parent
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica (redundante pero útil para UX)
    if (!name.trim() || !category.trim() || !price) {
      alert("Por favor completa todos los campos")
      return
    }

    const priceNumber = parseFloat(price)
    if (isNaN(priceNumber) || priceNumber <= 0) {
      alert("El precio debe ser un número mayor a 0")
      return
    }

    setIsSubmitting(true)

    try {
      const newProduct: CreateProductDTO = {
        name: name.trim(),
        category: category.trim(),
        price: priceNumber,
        status,
      }

      await onSave(newProduct)
      
      // El parent se encarga de cerrar el modal tras éxito
      // resetForm() se ejecutará automáticamente al cerrar
    } catch (error) {
      console.error('Error submitting product:', error)
      // Mejora futura: mostrar error en UI
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handler para click en el backdrop
   * Cierra el modal si se hace click fuera
   */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // No renderizar si el modal está cerrado
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 m-4">
        <h2 id="modal-title" className="text-xl font-semibold mb-4">
          Nuevo Producto
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo: Nombre */}
          <div>
            <label htmlFor="product-name" className="block text-sm font-medium mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              id="product-name"
              type="text"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Laptop Dell XPS 13"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Campo: Categoría */}
          <div>
            <label htmlFor="product-category" className="block text-sm font-medium mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <input
              id="product-category"
              type="text"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej: Electrónica"
              required
              disabled={isSubmitting}
            />
            {/* 
              Mejora futura: Usar datalist o select con categorías predefinidas
              <datalist id="categories">
                <option value="Electrónica" />
                <option value="Ropa" />
                <option value="Alimentos" />
              </datalist>
            */}
          </div>

          {/* Campo: Precio */}
          <div>
            <label htmlFor="product-price" className="block text-sm font-medium mb-1">
              Precio <span className="text-red-500">*</span>
            </label>
            <input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Campo: Estado */}
          <div>
            <label htmlFor="product-status" className="block text-sm font-medium mb-1">
              Estado
            </label>
            <select
              id="product-status"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value as "Activo" | "Inactivo")}
              disabled={isSubmitting}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

