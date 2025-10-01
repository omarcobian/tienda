import { product } from "@/types";

export const stats =(products:product[]) => [
    { label: "Total Productos", value: products.length },
    { label: "Productos Activos", value: products.filter(p => p.status === "Activo").length, color: "text-green-600" },
    { label: "Productos Inactivos", value: products.filter(p => p.status === "Inactivo").length, color: "text-orange-600" },
  ]