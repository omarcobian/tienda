//Es el estado global del usuario se ejecuta en el cliente
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "employee"
  store: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo purposes
const mockUsers: Record<string, { password: string; user: User }> = {
  "admin@pos.com": {
    password: "admin123",
    user: {
      id: "1",
      email: "admin@pos.com",
      name: "Administrador",
      role: "admin",
      store: "Tienda Principal",
    },
  },
  "empleado@pos.com": {
    password: "emp123",
    user: {
      id: "2",
      email: "empleado@pos.com",
      name: "Juan Pérez",
      role: "employee",
      store: "Tienda Principal",
    },
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("pos-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const mockUser = mockUsers[email]
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user)
      localStorage.setItem("pos-user", JSON.stringify(mockUser.user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("pos-user")
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
