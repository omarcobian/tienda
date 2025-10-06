# 🏪 Sistema POS - Gestión de Tienda

Sistema de punto de venta (POS) moderno construido con Next.js 15, TypeScript, Prisma y TailwindCSS. Implementa arquitectura en capas con las mejores prácticas de desarrollo.

## ✨ Características

- 🔐 **Autenticación segura** con bcrypt para hash de contraseñas
- 📦 **Gestión de productos** con CRUD completo
- ✅ **Validación de datos** con Zod en runtime y compilación
- 🎨 **UI moderna** con TailwindCSS
- 🏗️ **Arquitectura escalable** con service layer y custom hooks
- 🐛 **Manejo centralizado de errores**
- 📱 **Diseño responsivo** para todos los dispositivos
- 🔒 **Tipado fuerte** con TypeScript

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+ 
- MongoDB (local o Atlas)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd tienda
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales:
```env
DATABASE_URL="mongodb://..."
# Futuro: JWT_SECRET="your-secret-key"
```

4. **Generar Prisma Client**
```bash
npx prisma generate
```

5. **Migrar contraseñas existentes (si aplica)**
```bash
npm run migrate:passwords
```

6. **Iniciar en desarrollo**
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 📚 Documentación

- **[Arquitectura](docs/ARCHITECTURE.md)** - Documentación completa de la arquitectura
- **[API Routes](src/app/api/)** - Endpoints documentados
- **[Schemas](src/schemas/)** - Validaciones con Zod
- **[Services](src/services/)** - Lógica de negocio

## 🏗️ Estructura del Proyecto

```
src/
├── app/              # Next.js App Router
│   ├── api/         # API Routes (Backend)
│   └── Dashboard/   # Páginas del dashboard
├── components/       # Componentes React
├── hooks/           # Custom React Hooks
├── services/        # Lógica de negocio
├── schemas/         # Validaciones Zod
├── types/           # Tipos TypeScript
├── utils/           # Utilidades
└── lib/             # Configuraciones
```

## 🔐 Usuarios de Prueba

### Desarrollo (Frontend Mock)
- **Admin:** admin@pos.com / admin123
- **Usuario:** empleado@pos.com / emp123

⚠️ **Nota:** En producción, eliminar usuarios mock y usar solo autenticación de BD.

## 🛠️ Tecnologías

### Core
- **[Next.js 15](https://nextjs.org/)** - Framework React
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Prisma](https://www.prisma.io/)** - ORM para MongoDB
- **[TailwindCSS](https://tailwindcss.com/)** - Estilos

### Validación y Seguridad
- **[Zod](https://zod.dev/)** - Validación de schemas
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Hash de contraseñas

### UI
- **[Lucide React](https://lucide.dev/)** - Iconos

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Producción
npm run build        # Construir para producción
npm start            # Iniciar servidor de producción

# Calidad de código
npm run lint         # Ejecutar ESLint

# Utilidades
npm run migrate:passwords  # Migrar contraseñas a bcrypt
```

## 🔒 Seguridad

### ✅ Implementado
- Hash de contraseñas con bcrypt
- Validación de datos con Zod
- Sanitización de inputs
- Mensajes de error seguros

### ⚠️ Pendiente para Producción
- [ ] JWT para autenticación stateless
- [ ] httpOnly cookies (no localStorage)
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] 2FA (Two-Factor Authentication)

Ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#seguridad) para detalles.

## 🚀 Mejoras Futuras

### Corto Plazo
- Implementar JWT
- Añadir tests (Jest + Testing Library)
- Crear componente de edición de productos
- Implementar búsqueda y filtros

### Mediano Plazo
- Caching con Redis
- Upload de imágenes (S3/Cloudinary)
- Sistema de inventario
- Reportes y analytics

### Largo Plazo
- Microservicios
- API Gateway
- Real-time con WebSockets
- PWA para uso offline

Ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#escalabilidad) para roadmap completo.

## 🧪 Testing (Futuro)

```bash
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:coverage # Cobertura de código
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones
- Seguir la arquitectura en capas
- Añadir validación con Zod
- Documentar con comentarios JSDoc
- Actualizar tests (cuando se implementen)

## 📄 Licencia

Este proyecto es de código abierto.

## 📞 Soporte

Para preguntas o problemas:
- Abrir un [Issue](../../issues)
- Ver [Documentación](docs/ARCHITECTURE.md)

---

**Desarrollado con ❤️ usando Next.js 15 y TypeScript**

