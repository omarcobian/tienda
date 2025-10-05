//aqui se pondran las funciones relacionadas con los fetch de productos para
//separar la logica de productos de la logica de los componentes
import { product } from "@/types";

export function editarProducto(producto: product) {
  // Lógica para editar el producto
  fetch("/api/productos", {
    method: "PUT",
    body: JSON.stringify(producto),
  })
}