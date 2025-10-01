'use client'
//importaciones de hooks y estado
import { useAuth } from "@hooks/useAuth";
 export default function Navbar() {
//   const router = useRouter()
//   const { pathname } = router
  const {  logout } = useAuth()
  return (
    <nav className="flex justify-between items-center bg-white shadow-neutral-950 border-b border-b-gray-500/40 px-6 py-4">
      {/* Título */}
      <h1 className="text-xl font-bold">Sistema POS</h1>

      {/* Rol y tienda */}
      <div className="flex items-center gap-4">
        <span className="px-3 py-1 bg-gray-200 text-sm rounded-full">
          Administrador
        </span>
        <span className="text-sm text-gray-600">Tienda Principal</span>

        {/* Botón salir */}
        <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm" onClick={logout}>
          Salir
        </button>
      </div>
    </nav>
  );
}
