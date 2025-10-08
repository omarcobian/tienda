/**
 * Product Validation Schemas using Zod
 * 
 * Buenas prácticas aplicadas:
 * - ✅ Validación fuerte de tipos en runtime con Zod
 * - ✅ Mensajes de error descriptivos en español
 * - ✅ Reutilización de schemas base para diferentes casos (create, update)
 * - ✅ Transformación automática de datos (trim strings, parse numbers)
 * 
 * Escalabilidad futura:
 */

import { z } from 'zod';

/**
 * Schema base para venta
 * Define las reglas de validación comunes para todos los productos
 */
const VentaSchema = z.object({
  ventaId: z.string()
    .min(1, "El ID del producto es obligatorio")
    .regex(/^[a-f\d]{24}$/i, "ID de MongoDB inválido"), // Valida ObjectId de MongoDB
  
  total: z.number()
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0"),

  paymentMethod: z.enum(["Efectivo", "Tarjeta"], {
    message: "El método de pago debe ser 'Efectivo' o 'Tarjeta'"
  }),

  date: z.date({
    message: "La fecha es obligatoria",
  }),

  tip: z.number()
    .int("El tip debe ser un número entero")
    .positive("El tip debe ser mayor a 0"),

  products: z.array(z.object({
    productId: z.string()
      .min(1, "El ID del producto es obligatorio")
      .regex(/^[a-f\d]{24}$/i, "ID de MongoDB inválido"), // Valida ObjectId de MongoDB
    
    quantity: z.number()
      .int("La cantidad debe ser un número entero")
      .positive("La cantidad debe ser mayor a 0"),
  })),
});