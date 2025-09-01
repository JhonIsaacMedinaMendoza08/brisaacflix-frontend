# 🎥 BrisaacFlix - Frontend  

BrisaacFlix es una aplicación **web full-stack** donde los usuarios pueden explorar, reseñar y rankear películas, series y animes geek.  

Este repositorio corresponde al **Frontend**, desarrollado con **React + Next.js + TailwindCSS**, que consume la API del backend para mostrar la información y permitir la interacción de los usuarios.  

---

## 🚀 Objetivo  

Construir una interfaz moderna, rápida y responsiva que permita a los usuarios:  

- Registrarse e iniciar sesión.  
- Explorar películas y series por categorías, popularidad o búsqueda.  
- Crear, editar y eliminar reseñas.  
- Dar like/dislike a reseñas de otros usuarios.  
- Los administradores pueden aprobar/rechazar contenidos desde un panel de administración.  

---

## 🛠️ Tecnologías utilizadas  

### Frontend  
- **React 18 + Next.js 14**  
- **TailwindCSS** → estilos modernos y responsivos  
- **shadcn/ui + lucide-react** → componentes de UI reutilizables  
- **Framer Motion** → animaciones fluidas  
- **Recharts** → gráficas interactivas (ranking, estadísticas)  
- **JWT** (manejado vía `localStorage`) para sesiones  
- **Fetch API** encapsulada en `lib/api.js` para consumo de endpoints  

---

## 📂 Estructura del proyecto (frontend)  

```text
/frontend
│── /src
│   ├── /app              # Páginas principales (Next.js App Router)
│   │   ├── /auth         # Login y registro
│   │   ├── /categorias   # Listado y detalle por categoría
│   │   ├── /contenido    # Detalle de película/serie
│   │   ├── /gestion      # Panel de administración
│   │   └── layout.js     # Layout global
│   │
│   ├── /components       # Componentes UI reutilizables
│   ├── /lib              # api.js y utilidades
│   ├── /styles           # Estilos globales y Tailwind
│   └── /hooks            # Hooks personalizados
│
│── public/               # Assets estáticos (logos, íconos)
│── package.json
│── tailwind.config.js
│── next.config.js
```

---

## 🔐 Autenticación y roles  

- **JWT almacenado en localStorage** para mantener la sesión.  
- **Protección de rutas**:  
  - 👤 **usuario** → puede explorar contenido, reseñar, votar.  
  - 🛡️ **admin** → acceso a panel de gestión de categorías y aprobación de contenido.  

---

## 🎬 Funcionalidades principales  

### 📱 Usuarios  
- Login / Registro con validaciones y feedback visual.  
- Persistencia de sesión con JWT.  

### 🎥 Contenido  
- Explorar contenido aprobado en la plataforma.  
- Filtrar por categoría, popularidad o búsqueda por título.  
- Vista detallada con sinopsis, póster y reseñas.  

### ✍️ Reseñas  
- Crear, editar y eliminar reseñas.  
- Like / Dislike en reseñas de otros usuarios.  
- Notificaciones visuales con toasts tras cada acción.  

### 🛠️ Administración (solo admin)  
- Aprobar o rechazar solicitudes de películas/series.  
- Eliminar contenido.  
- Interfaz responsiva para usar desde desktop o móvil.  

---

## ⚡ Instalación y uso (local)  

### Requisitos  
- Node.js >= 18  
- Tener el backend corriendo en `http://localhost:4000`  

### Pasos  

```bash
# Clonar repositorio
git clone https://github.com/JhonIsaacMedinaMendoza08/brisaacflix-frontend.git
cd brisaacflix-frontend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

Por defecto se sirve en: `http://localhost:3000`  

---

## 🌐 Deploy  

El frontend está desplegado en **Vercel**:  

👉 [BrisaacFlix Frontend (Deploy)](https://gestor-de-reservas-de-canchas-front.vercel.app/)  

---

## 🔗 Repositorios relacionados  

- **Backend**: [BrisaacFlix Backend](https://github.com/JhonIsaacMedinaMendoza08/BrisaacFlix-backend)  

---

## ✨ Créditos  

- Equipo: Isaac Medina & Brian Suárez  
- Inspiración/recursos: **TMDB API** para metadata de contenidos  
