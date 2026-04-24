# ArtSpace — Frontend

Interfaz web para **ArtSpace**, una plataforma social para artistas donde pueden publicar obras, seguirse entre sí, comentar y dar likes.

---

## Arquitectura y separación de capas

```
artspace-frontend/
├── src/
│   ├── app/
│   │   ├── (public)/         # Rutas sin autenticación: login, registro
│   │   ├── (private)/        # Rutas protegidas: feed, explorar, perfil, obras
│   │   └── (admin)/          # Panel de administración
│   └── services/
│       └── api.ts            # Cliente Axios con interceptor JWT
```

El frontend está **completamente desacoplado** del backend. Se comunica exclusivamente vía API REST bajo el prefijo `/api/v1`. La autenticación se maneja con JWT almacenado en `localStorage`.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| Next.js 15 + TypeScript | Framework React con App Router |
| Tailwind CSS | Estilos utilitarios |
| Axios | Cliente HTTP con interceptor de autenticación |

---

## Variables de entorno

Crea un archivo `.env.local` en `artspace-frontend/` con:

```env
NEXT_PUBLIC_API_URL=https://artspacebackend-production.up.railway.app/api/v1
```

---

## Instalación y ejecución

```bash
cd artspace-frontend
npm install

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

---

## Páginas de la aplicación

### Públicas (sin sesión)

| Ruta | Descripción |
|---|---|
| `/login` | Iniciar sesión |
| `/registro` | Crear cuenta nueva |

### Privadas (requieren sesión)

| Ruta | Descripción |
|---|---|
| `/feed` | Obras de usuarios que sigues |
| `/explorar` | Todas las obras con búsqueda y filtros por categoría |
| `/obras/:id` | Detalle de obra con likes y comentarios |
| `/obras/nueva` | Publicar una obra con imagen y categoría |
| `/obras/:id/editar` | Editar obra propia |
| `/perfil` | Ver y editar perfil propio |
| `/perfil/editar` | Editar biografía y avatar |
| `/usuario/:id` | Ver perfil de otro usuario, seguir/dejar de seguir |

### Administración *(requieren rol admin)*

| Ruta | Descripción |
|---|---|
| `/admin` | Panel principal |
| `/admin/usuarios` | Gestión de usuarios y roles |
| `/admin/obras` | Ver y eliminar obras |
| `/admin/comentarios` | Ver y eliminar comentarios |
| `/admin/categorias` | Crear y eliminar categorías |

---

## Funcionalidades implementadas

- **Autenticación**: registro, login, sesión persistente con JWT en localStorage
- **Feed**: obras de usuarios seguidos con likes, comentarios y respuestas
- **Explorar**: búsqueda en tiempo real con debounce, filtro por categoría y paginación
- **Obras**: publicar con imagen (JPG, PNG, WEBP · máx 5 MB), editar, eliminar
- **Categorías**: selector de subcategorías agrupadas al publicar una obra
- **Perfil**: ver obras propias, seguidores y seguidos, editar biografía y avatar
- **Usuarios**: ver perfil ajeno, seguir y dejar de seguir
- **Comentarios**: agregar, responder y eliminar comentario propio
- **Likes**: dar y quitar like con contador en tiempo real

---

## Despliegue

| Servicio | URL |
|---|---|
| Frontend (Vercel) | [art-space-frontend-eta.vercel.app](https://art-space-frontend-eta.vercel.app/) |
| Backend (Railway) | [artspacebackend-production.up.railway.app](https://artspacebackend-production.up.railway.app/) |

El frontend está desplegado en **Vercel** apuntando a la carpeta `artspace-frontend/` como directorio raíz del proyecto. El backend y la base de datos PostgreSQL corren en Railway.

Repositorio: [github.com/YBJ-UP/ArtSpace_frontend](https://github.com/YBJ-UP/ArtSpace_frontend)
