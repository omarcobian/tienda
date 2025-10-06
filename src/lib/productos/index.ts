/**
 * Product Client Helpers
 * 
 * DEPRECATED: Este archivo está deprecado.
 * La lógica de productos ahora está en:
 * - Backend: /src/services/product.service.ts
 * - Frontend: /src/hooks/useProducts.tsx
 * 
 * Mantener por compatibilidad temporal.
 * TODO: Eliminar cuando todos los componentes usen el nuevo hook.
 * 
 * Migración recomendada:
 * - En lugar de llamar editarProducto() directamente
 * - Usar el hook useProducts() en componentes
 * 
 * @deprecated Usar useProducts hook en su lugar
 */

import type { product } from "@/types";

/**
 * @deprecated Usar hook useProducts().updateProduct() en su lugar
 */
export function editarProducto(producto: product) {
  // Esta implementación está incompleta y no debería usarse
  fetch("/api/product", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(producto),
  })
}
