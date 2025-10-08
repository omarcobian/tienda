'use client'
import MenuCard from "./MenuCard";
//importamos el path para saber la ruta
import { usePathname } from 'next/navigation'
export default function Menu() {
  const pathname = usePathname()
  return (
    <div className="grid grid-cols-5 gap-4">
          <MenuCard title="Registrar Venta" icon="venta" active={pathname === "/dashboard/admin/ventas"} />
          <MenuCard title="Gastos" icon="gasto" active={pathname === "/dashboard/admin/gastos"} />
          <MenuCard title="Productos" icon="producto" active={pathname === "/dashboard/admin/productos"} />
          <MenuCard title="Reportes" icon="reporte" active={pathname === "/dashboard/admin/reportes"} />
          <MenuCard title="Usuarios" icon="usuario" active={pathname === "/dashboard/admin/usuarios"} />
    </div>
  )
}
