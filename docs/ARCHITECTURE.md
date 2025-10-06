# 📚 Documentación de Arquitectura - Sistema POS

## 🏗️ Arquitectura General

Este proyecto implementa una **arquitectura en capas (Layered Architecture)** con separación clara de responsabilidades, siguiendo las mejores prácticas de Next.js 15, TypeScript, Prisma y TailwindCSS.

### Estructura de Carpetas

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes (Backend)
│   │   ├── auth/            # Autenticación
│   │   ├── product/         # Gestión de productos
│   │   ├── admin/           # Registro de administradores
│   │   └── user/            # Registro de usuarios
│   ├── Dashboard/           # Páginas del dashboard
│   ├── layout.tsx           # Layout raíz
│   └── page.tsx             # Página principal (Login)
│
├── components/              # Componentes React
│   ├── product/            # Componentes de productos
│   ├── login/              # Componente de login
│   ├── ui/                 # Componentes UI reutilizables
│   └── admin/              # Componentes de admin
│
├── hooks/                   # Custom React Hooks
│   ├── useAuth.tsx         # Hook de autenticación (mock - deprecado)
│   └── useProducts.tsx     # Hook de gestión de productos
│
├── services/               # Capa de lógica de negocio
│   ├── auth.service.ts    # Servicio de autenticación
│   └── product.service.ts # Servicio de productos
│
├── schemas/                # Schemas de validación (Zod)
│   ├── auth.schema.ts     # Validaciones de autenticación
│   └── product.schema.ts  # Validaciones de productos
│
├── types/                  # Tipos TypeScript
│   └── index.ts           # Tipos compartidos
│
├── utils/                  # Utilidades
│   └── errors/            # Manejo centralizado de errores
│       └── index.ts
│
├── lib/                    # Configuraciones y constantes
│   ├── prisma.ts          # Cliente Prisma (singleton)
│   ├── constantes/        # Constantes y helpers
│   └── productos/         # Helpers de productos (deprecado)
│
└── config/                # Configuraciones (futuro)
```

---

## 🔄 Flujo de Datos

### 1. Cliente → Servidor (Request)

```
Componente UI
    ↓
Custom Hook (useProducts)
    ↓
API Route (/api/product)
    ↓
Validación (Zod Schema)
    ↓
Service Layer (ProductService)
    ↓
Prisma Client
    ↓
Base de Datos (MongoDB)
```

### 2. Servidor → Cliente (Response)

```
Base de Datos
    ↓
Prisma Client
    ↓
Service Layer (formato de datos)
    ↓
API Route (Response estandarizada)
    ↓
Custom Hook (actualiza estado)
    ↓
Componente UI (re-render)
```

---

## 🛡️ Buenas Prácticas Implementadas

### 1. **Separación de Responsabilidades**

#### ✅ Componentes Limpios
- **Solo UI y presentación**
- No contienen lógica de negocio
- Delegan operaciones a hooks personalizados
- Ejemplo: `ProductPage.tsx` usa `useProducts()` hook

#### ✅ Custom Hooks
- **Encapsulan lógica de estado y fetching**
- Reutilizables en múltiples componentes
- Ejemplo: `useProducts.tsx` maneja CRUD de productos

#### ✅ Service Layer
- **Contiene toda la lógica de negocio**
- Reutilizable desde API routes o funciones server
- Valida datos con Zod
- Ejemplo: `ProductService` en `product.service.ts`

#### ✅ API Routes
- **Solo routing y orquestación**
- Delegan lógica a services
- Manejan errores de forma consistente
- Retornan respuestas estandarizadas

### 2. **Validación de Datos (Zod)**

```typescript
// Definición de schema
export const CreateProductSchema = z.object({
  name: z.string().min(1).trim(),
  category: z.string().min(1).trim(),
  price: z.number().positive(),
  status: z.enum(["Activo", "Inactivo"]).default("Activo"),
})

// Uso en API
const validatedData = CreateProductSchema.parse(body)
```

**Ventajas:**
- ✅ Validación runtime + tipos estáticos
- ✅ Mensajes de error descriptivos
- ✅ Transformación automática de datos
- ✅ Sincronización entre frontend y backend

### 3. **Manejo Centralizado de Errores**

```typescript
// Clases de error personalizadas
throw new ValidationError("Datos inválidos")
throw new NotFoundError("Producto no encontrado")
throw new AuthenticationError("Credenciales inválidas")

// Handler centralizado
export function handleApiError(error: unknown): Response {
  if (error instanceof ZodError) { /* ... */ }
  if (error instanceof AppError) { /* ... */ }
  // ...
}
```

**Ventajas:**
- ✅ Errores consistentes en toda la app
- ✅ Códigos HTTP semánticamente correctos
- ✅ Fácil debugging con stack traces en dev
- ✅ Mensajes seguros en producción

### 4. **Tipado Fuerte con TypeScript**

```typescript
// Tipos inferidos de Zod
export type CreateProductInput = z.infer<typeof CreateProductSchema>

// Respuestas tipadas
interface ApiSuccessResponse<T> {
  success: true
  data: T
}
```

**Ventajas:**
- ✅ Autocompletado en IDE
- ✅ Detección de errores en tiempo de desarrollo
- ✅ Refactoring seguro
- ✅ Documentación implícita

### 5. **Seguridad**

#### ✅ Hash de Contraseñas (bcrypt)
```typescript
const hashedPassword = await bcrypt.hash(password, 10)
const isValid = await bcrypt.compare(password, hashedPassword)
```

#### ✅ Validación de Inputs
- Sanitización de strings (trim, normalización)
- Validación de tipos y formatos
- Prevención de inyección

#### ⚠️ Pendiente para Producción:
- [ ] Implementar JWT para autenticación stateless
- [ ] Usar httpOnly cookies en lugar de localStorage
- [ ] Rate limiting para prevenir brute force
- [ ] CSRF protection
- [ ] Sanitización adicional para XSS

---

## 📊 Patrones de Diseño Utilizados

### 1. **Singleton Pattern**
- **Dónde:** Prisma Client
- **Por qué:** Evitar múltiples conexiones a BD
- **Archivo:** `src/lib/prisma.ts`

### 2. **Service Layer Pattern**
- **Dónde:** ProductService, AuthService
- **Por qué:** Separar lógica de negocio de infraestructura
- **Archivos:** `src/services/*.service.ts`

### 3. **Repository Pattern (parcial)**
- **Dónde:** Services encapsulan acceso a Prisma
- **Por qué:** Abstraer acceso a datos
- **Mejora futura:** Crear capa Repository explícita

### 4. **Factory Pattern**
- **Dónde:** Creación de respuestas API
- **Por qué:** Respuestas consistentes
- **Función:** `createSuccessResponse()`

### 5. **Custom Hooks Pattern**
- **Dónde:** useProducts, useAuth
- **Por qué:** Reutilizar lógica de estado
- **Archivos:** `src/hooks/*.tsx`

---

## 🔐 Autenticación y Autorización

### Estado Actual

#### ⚠️ Problemas Identificados:

1. **Doble Autenticación:**
   - API valida contra BD (`/api/auth`)
   - Hook `useAuth` tiene usuarios mock en frontend
   - **Riesgo:** Inconsistencia entre sistemas

2. **Sin Tokens:**
   - No hay JWT implementation
   - Sesión en localStorage (inseguro)
   - No hay expiración de sesión

3. **Contraseñas:**
   - ✅ Hasheadas con bcrypt en nuevos usuarios
   - ⚠️ Usuarios existentes pueden tener contraseñas en texto plano

### Roadmap de Seguridad

#### Fase 1: JWT Implementation
```typescript
// Backend: Generar token al login
const token = jwt.sign(
  { userId: user.id, email: user.email, role: user.roll },
  process.env.JWT_SECRET!,
  { expiresIn: '15m' }
)

// Frontend: Enviar token en headers
headers: { Authorization: `Bearer ${token}` }
```

#### Fase 2: Middleware de Autenticación
```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token')
  if (!token) return NextResponse.redirect('/login')
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!)
    // Añadir user a request
  } catch {
    return NextResponse.redirect('/login')
  }
}
```

#### Fase 3: Refresh Tokens
- Access token: 15 minutos
- Refresh token: 7 días
- Endpoint `/api/auth/refresh`

---

## 🚀 Escalabilidad Futura

### 1. **Base de Datos**

#### Optimizaciones:
- [ ] Índices en campos frecuentemente consultados
- [ ] Read replicas para queries pesadas
- [ ] Connection pooling configurado
- [ ] Query optimization con `select` específicos

#### Schema Evolution:
```prisma
model Product {
  // Campos actuales
  id       String @id @default(auto()) @map("_id") @db.ObjectId
  
  // Campos futuros
  sku      String? @unique    // SKU único
  images   String[]           // URLs de imágenes
  stock    Int @default(0)    // Inventario
  deletedAt DateTime?         // Soft delete
  
  // Auditoría
  createdBy String @db.ObjectId
  updatedBy String @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. **Caching**

#### Redis para Performance:
```typescript
// Caché de productos
const cachedProducts = await redis.get('products:all')
if (cachedProducts) return JSON.parse(cachedProducts)

const products = await prisma.product.findMany()
await redis.setex('products:all', 300, JSON.stringify(products)) // 5 min TTL
```

### 3. **Microservicios (cuando escale)**

Dividir en servicios independientes:
- **Auth Service:** Autenticación y autorización
- **Product Service:** Gestión de productos
- **Order Service:** Gestión de pedidos (futuro)
- **Notification Service:** Emails, push notifications

### 4. **API Gateway**

Implementar gateway para:
- Rate limiting global
- Logging centralizado
- Autenticación unificada
- Routing a microservicios

### 5. **Monitoreo y Logging**

```typescript
// Integración con servicios externos
import * as Sentry from '@sentry/nextjs'
import { logger } from './lib/logger' // Winston/Pino

// Error tracking
Sentry.captureException(error)

// Performance monitoring
logger.info('Query executed', { 
  duration: executionTime,
  query: 'findMany products'
})
```

---

## 📝 Convenciones de Código

### Naming Conventions:

- **Componentes:** PascalCase (`ProductCard.tsx`)
- **Hooks:** camelCase con prefijo `use` (`useProducts.tsx`)
- **Services:** camelCase con sufijo `.service` (`product.service.ts`)
- **Types:** PascalCase (`ProductWithId`)
- **Constantes:** UPPER_SNAKE_CASE (`SALT_ROUNDS`)

### Estructura de Archivos:

```typescript
/**
 * Documentación del módulo
 * - Qué hace
 * - Buenas prácticas aplicadas
 * - Mejoras futuras
 */

// Imports
import { ... } from '...'

// Types/Interfaces
interface ComponentProps { ... }

// Componente/Función principal
export function Component() { ... }

// Helpers locales (si aplica)
function helperFunction() { ... }
```

---

## 🔄 Workflow de Desarrollo

### 1. **Crear Nueva Feature**

```bash
# 1. Crear schema de validación
src/schemas/feature.schema.ts

# 2. Crear service
src/services/feature.service.ts

# 3. Crear API route
src/app/api/feature/route.ts

# 4. Crear hook (si necesario)
src/hooks/useFeature.tsx

# 5. Crear componentes
src/components/feature/FeatureComponent.tsx
```

### 2. **Modificar Existente**

1. Actualizar schema de validación
2. Actualizar service con nueva lógica
3. Actualizar API route si necesario
4. Actualizar hook si necesario
5. Actualizar componentes UI

### 3. **Checklist Pre-Deploy**

- [ ] Código linted (`npm run lint`)
- [ ] Tipos verificados (`npm run build`)
- [ ] Migraciones de BD aplicadas
- [ ] Variables de entorno configuradas
- [ ] Secrets rotados (JWT_SECRET, DATABASE_URL)
- [ ] Rate limiting configurado
- [ ] Monitoreo activo (Sentry, etc.)

---

**Última actualización:** Refactorización completa implementando service layer, validación con Zod, error handling centralizado y mejores prácticas de Next.js 15.
