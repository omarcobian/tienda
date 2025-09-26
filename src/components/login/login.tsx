//espesificamos que se ejetute del lado del cliente para manejar el estado con useState
"use client"
//importaciones de hooks y estado
import { useState } from "react"
import { useAuth } from "@hooks/useAuth";

export default function Login() {
  //estado para manejar la api y formularios
  const { user, login, logout } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [api, setApi] = useState(false)

  //funcion para manejar el login
  const handleLogin = async (e: React.FormEvent) => {
    //no refrescar la pagina
    e.preventDefault()

    //reinicia el estado de error y activa el estado de cargando
    setError("")
    setLoading(true)

    //llama a la api del login
    try {
      //fetch a la api del login
      const success = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      //si la api no responde correctamente con un error 401 
      if (success.status === 401) {
        setApi(false)
        setError("Credenciales inválidas")
      }
    // manejo de errores si la api responde con 500
    } catch (err) {
      setError("Error al iniciar sesión")
    } finally {
      //desactiva el estado de cargando y activa el estado de api
      setLoading(false)
      setApi(true)
      //guarda el email y password en el estado de auth que es global
      await login(email,password)
    }
  }
  //si el usuario esta autenticado redirige a la pagina de productos
  if (user) {
    return(
      <div>
        <h1>listo</h1>
        <button onClick={logout}>Cerrar sesión</button>
      </div>
    )
  }

  

  return (
    <div >
      <div className="w-full max-w-md bg-white mx-14 my-4 p-4 rounded-xl shadow-lg space-y-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">Sistema POS</h3>
          <h5 className="text-sm text-gray-600">Ingresa tus credenciales para acceder al sistema</h5>
        </div>
        <div>
          <form onSubmit={handleLogin} className="space-y-4 ">
            <div className="space-y-2 flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                className="px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <label htmlFor="password">Contraseña</label>
              <input
                className="px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error !=="" && (
              <div>
                <p>{error}</p>
              </div>
            )}
            <button type="submit" className="w-full bg-black text-white py-2 rounded-md hover:opacity-80 transition duration-300" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>
          <div className="mt-6 text-sm text-gray-600">
            <p className="font-medium">Usuarios de prueba:</p>
            <p>Admin: admin@pos.com / admin123</p>
            <p>Empleado: empleado@pos.com / emp123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
