/**
 * Product Statistics Helper
 * 
 * Buenas prácticas aplicadas:
 * - ✅ Función pura (no tiene side effects)
 * - ✅ Reutilizable en diferentes contextos
 * - ✅ Tipado fuerte con TypeScript
 * - ✅ Cálculo eficiente con métodos nativos
 * 
 * Escalabilidad futura:
 * - Añadir más estadísticas (valor total del inventario, productos más vendidos)
 * - Implementar caché de estadísticas si el cálculo se vuelve costoso
 * - Calcular estadísticas en backend para grandes volúmenes
 * - Añadir comparación con períodos anteriores (% de cambio)
 * 
 * @example
 * const productStats = stats(products)
 * // [
 * //   { label: "Total Productos", value: 150 },
 * //   { label: "Productos Activos", value: 120, color: "text-green-600" },
 * //   { label: "Productos Inactivos", value: 30, color: "text-orange-600" }
 * // ]
 */

import type { ProductWithId, ProductStat } from "@/types";

/**
 * Calcula estadísticas de una lista de productos
 * 
 * @param products - Array de productos
 * @returns Array de estadísticas para mostrar en UI
 */
export const stats = (products: ProductWithId[]): ProductStat[] => [
  { 
    label: "Total Productos", 
    value: products.length 
  },
  { 
    label: "Productos Activos", 
    value: products.filter(p => p.status === "Activo").length, 
    color: "text-green-600" 
  },
  { 
    label: "Productos Inactivos", 
    value: products.filter(p => p.status === "Inactivo").length, 
    color: "text-orange-600" 
  },
  /**
   * Mejora futura: Añadir más estadísticas útiles
   * 
   * {
   *   label: "Valor Total Inventario",
   *   value: products.reduce((sum, p) => sum + p.price, 0),
   *   color: "text-blue-600",
   *   format: "currency" // para formatear como moneda
   * },
   * {
   *   label: "Precio Promedio",
   *   value: products.length > 0 
   *     ? products.reduce((sum, p) => sum + p.price, 0) / products.length 
   *     : 0,
   *   color: "text-purple-600"
   * }
   */
]