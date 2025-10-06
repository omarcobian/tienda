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
 * - Añadir validaciones más complejas (regex para SKU, validación de categorías contra DB)
 * - Crear schemas para búsquedas y filtros avanzados
 * - Implementar validación de relaciones (ej: categoría debe existir en tabla Categories)
 */

import { z } from 'zod';

/**
 * Schema base para Product
 * Define las reglas de validación comunes para todos los productos
 */
const ProductBaseSchema = z.object({
  name: z.string()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim()
    .transform(val => val.replace(/\s+/g, ' ')), // Normaliza espacios múltiples
  
  category: z.string()
    .min(1, "La categoría es obligatoria")
    .max(50, "La categoría no puede exceder 50 caracteres")
    .trim(),
  
  price: z.number()
    .positive("El precio debe ser mayor a 0")
    .finite("El precio debe ser un número válido")
    .refine(val => Number(val.toFixed(2)) === val || val.toString().split('.')[1]?.length <= 2, {
      message: "El precio no puede tener más de 2 decimales"
    }),
  
  status: z.enum(["Activo", "Inactivo"], {
    message: "El estado debe ser 'Activo' o 'Inactivo'"
  }).default("Activo"),
});

/**
 * Schema para crear un producto
 * No incluye id ni date ya que se generan automáticamente
 */
export const CreateProductSchema = ProductBaseSchema;

/**
 * Schema para actualizar un producto
 * Incluye el id obligatorio y permite campos opcionales
 */
export const UpdateProductSchema = z.object({
  id: z.string()
    .min(1, "El ID es obligatorio")
    .regex(/^[a-f\d]{24}$/i, "ID de MongoDB inválido"), // Valida ObjectId de MongoDB
  
  name: z.string()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim()
    .optional(),
  
  category: z.string()
    .min(1, "La categoría es obligatoria")
    .max(50, "La categoría no puede exceder 50 caracteres")
    .trim()
    .optional(),
  
  price: z.number()
    .positive("El precio debe ser mayor a 0")
    .finite("El precio debe ser un número válido")
    .optional(),
  
  status: z.enum(["Activo", "Inactivo"]).optional(),
});

/**
 * Schema para eliminar un producto
 */
export const DeleteProductSchema = z.object({
  id: z.string()
    .min(1, "El ID es obligatorio")
    .regex(/^[a-f\d]{24}$/i, "ID de MongoDB inválido"),
});

/**
 * Schema para buscar producto por ID
 */
export const GetProductByIdSchema = z.object({
  id: z.string()
    .min(1, "El ID es obligatorio")
    .regex(/^[a-f\d]{24}$/i, "ID de MongoDB inválido"),
});

/**
 * Tipos TypeScript inferidos de los schemas Zod
 * Estos garantizan la sincronización entre validación runtime y tipado estático
 */
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type DeleteProductInput = z.infer<typeof DeleteProductSchema>;
export type GetProductByIdInput = z.infer<typeof GetProductByIdSchema>;
