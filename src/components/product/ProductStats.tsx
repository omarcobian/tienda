/**
 * ProductStats Component - Componente de estadísticas de productos
 * 
 * Buenas prácticas aplicadas:
 * - ✅ Componente de presentación puro
 * - ✅ Props bien tipadas con TypeScript
 * - ✅ Diseño responsivo con CSS Grid
 * - ✅ Reutilizable en diferentes contextos
 * 
 * Mejoras de UX:
 * - Grid responsivo (1 columna móvil, 3 en desktop)
 * - Colores semánticos para diferentes estadísticas
 * - Sombras y bordes para jerarquía visual
 * 
 * Escalabilidad futura:
 * - Añadir gráficos (charts) para visualización
 * - Implementar animación de números (count up)
 * - Añadir comparación con período anterior (↑↓ %)
 * - Permitir click para filtrar por estadística
 * - Añadir exportación de estadísticas
 * 
 * @example
 * <ProductStats stats={[
 *   { label: "Total", value: 100 },
 *   { label: "Activos", value: 80, color: "text-green-600" }
 * ]} />
 */

"use client"

import type { ProductStat } from "@/types"

interface ProductStatsProps {
  stats: ProductStat[]
}

/**
 * Componente que muestra estadísticas en tarjetas
 * Recibe un array de estadísticas y las renderiza en un grid
 */
export function ProductStats({ stats }: ProductStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow "
        >
          <p className={`text-3xl font-bold mb-2 ${stat.color || "text-gray-900"}`}>
            {stat.value.toLocaleString()} {/* Formatear números con separadores */}
          </p>
          <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

