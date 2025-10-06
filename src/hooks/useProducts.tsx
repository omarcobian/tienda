/**
 * useProducts Hook - Custom hook para gestión de productos
 * 
 * Buenas prácticas aplicadas:
 * - ✅ Separación de lógica de negocio de componentes UI
 * - ✅ Manejo centralizado de estados (loading, error, data)
 * - ✅ Funciones reutilizables para CRUD operations
 * - ✅ Tipado fuerte con TypeScript
 * - ✅ Manejo de errores consistente
 * 
 * Patrón aplicado: Custom Hooks Pattern
 * - Encapsula lógica de fetching y mutaciones
 * - Reutilizable en múltiples componentes
 * - Facilita testing y mantenimiento
 * 
 * Escalabilidad futura:
 * - Implementar React Query/SWR para caching automático
 * - Añadir optimistic updates
 * - Implementar paginación y scroll infinito
 * - Añadir debounce en búsquedas
 * - Sincronización en tiempo real con WebSockets
 * 
 * @example Usando React Query (futuro):
 * ```typescript
 * import { useQuery, useMutation } from '@tanstack/react-query'
 * 
 * export function useProducts() {
 *   const { data, isLoading, error } = useQuery({
 *     queryKey: ['products'],
 *     queryFn: fetchProducts,
 *     staleTime: 5 * 60 * 1000, // 5 minutos
 *   })
 *   
 *   const createMutation = useMutation({
 *     mutationFn: createProduct,
 *     onSuccess: () => queryClient.invalidateQueries(['products'])
 *   })
 * }
 * ```
 */

"use client"

import { useState, useEffect, useCallback } from 'react';
import type { ProductWithId, ApiResponse, CreateProductDTO } from '@/types';

/**
 * Estado del hook useProducts
 */
interface UseProductsState {
  products: ProductWithId[];
  loading: boolean;
  error: string | null;
}

/**
 * Retorno del hook useProducts
 */
interface UseProductsReturn extends UseProductsState {
  // Métodos CRUD
  createProduct: (product: CreateProductDTO) => Promise<ProductWithId | null>;
  updateProduct: (id: string, product: Partial<CreateProductDTO>) => Promise<ProductWithId | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  refreshProducts: () => Promise<void>;
  
  // Helpers
  clearError: () => void;
}

/**
 * Custom hook para gestión de productos
 * Maneja el estado y operaciones CRUD de productos
 * 
 * @example
 * ```tsx
 * function ProductList() {
 *   const { products, loading, error, createProduct } = useProducts();
 *   
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   
 *   return <div>{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
 * }
 * ```
 */
export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<ProductWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene todos los productos desde la API
   * Se ejecuta al montar el componente
   */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/product');
      const data: ApiResponse<ProductWithId[]> = await response.json();

      if (!response.ok) {
        throw new Error(
          data.success === false 
            ? data.error.message 
            : 'Error al cargar productos'
        );
      }

      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carga inicial de productos
   */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /**
   * Crea un nuevo producto
   * Actualiza la lista local automáticamente tras crear
   * 
   * Mejora futura: Implementar optimistic update
   * - Añadir producto a la lista inmediatamente
   * - Revertir si falla la petición
   */
  const createProduct = useCallback(async (product: CreateProductDTO): Promise<ProductWithId | null> => {
    try {
      setError(null);

      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      const data: ApiResponse<ProductWithId> = await response.json();

      if (!response.ok) {
        throw new Error(
          data.success === false 
            ? data.error.message 
            : 'Error al crear producto'
        );
      }

      if (data.success) {
        // Añadir el nuevo producto a la lista
        setProducts(prev => [data.data, ...prev]);
        return data.data;
      }

      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error creating product:', err);
      return null;
    }
  }, []);

  /**
   * Actualiza un producto existente
   * Actualiza la lista local tras la operación
   */
  const updateProduct = useCallback(async (
    id: string, 
    product: Partial<CreateProductDTO>
  ): Promise<ProductWithId | null> => {
    try {
      setError(null);

      const response = await fetch('/api/product', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...product }),
      });

      const data: ApiResponse<ProductWithId> = await response.json();

      if (!response.ok) {
        throw new Error(
          data.success === false 
            ? data.error.message 
            : 'Error al actualizar producto'
        );
      }

      if (data.success) {
        // Actualizar el producto en la lista
        setProducts(prev => 
          prev.map(p => p.id === id ? data.data : p)
        );
        return data.data;
      }

      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error updating product:', err);
      return null;
    }
  }, []);

  /**
   * Elimina un producto
   * Remueve de la lista local tras eliminar
   */
  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch('/api/product', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data: ApiResponse<ProductWithId> = await response.json();

      if (!response.ok) {
        throw new Error(
          data.success === false 
            ? data.error.message 
            : 'Error al eliminar producto'
        );
      }

      if (data.success) {
        // Remover el producto de la lista
        setProducts(prev => prev.filter(p => p.id !== id));
        return true;
      }

      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error deleting product:', err);
      return false;
    }
  }, []);

  /**
   * Refresca la lista de productos manualmente
   * Útil tras operaciones que puedan afectar múltiples productos
   */
  const refreshProducts = useCallback(async () => {
    await fetchProducts();
  }, [fetchProducts]);

  /**
   * Limpia el error actual
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    clearError,
  };
}
