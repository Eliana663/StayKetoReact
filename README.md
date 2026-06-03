Markdown
# StayKeto - Frontend 🥑

## 🇪🇸 Versión en Español

Este es el cliente web de **StayKeto**, una aplicación dedicada a la gestión de dietas cetogénicas, recetas y control nutricional. El proyecto está desarrollado utilizando **React** y optimizado con **Vite** para ofrecer una experiencia de desarrollo rápida y un rendimiento eficiente en producción.

### 🛠️ Tecnologías Utilizadas
- **React** (v18+)
- **Vite** - Entorno de desarrollo y empaquetador rápido
- **Diseño y Estilos:** Bootstrap (React-Bootstrap)

### 🌐 Conexión con la API
Por defecto, el proyecto está configurado para conectarse a la API del backend desplegada en la nube:
`https://stay-keto-470404854796.europe-southwest1.run.app`

### 🚀 Instalación y Configuración Local

1. **Clonar el repositorio y acceder a la rama correcta:**
   ```bash
   git clone [https://github.com/tu-usuario/stayketo.git](https://github.com/tu-usuario/stayketo.git)
   cd stayketo
   git checkout front
Instalar dependencias y arrancar:

Bash
npm install
npm run dev

   La aplicación local se abrirá en `http://localhost:5173`.

###   📈 Analítica y Escalabilidad
Google Tag Manager (GTM): Configurado en la raíz del proyecto (index.html) para desacoplar los scripts de seguimiento del código fuente de React, manteniendo el proyecto limpio y modular.

Google Analytics 4 (GA4): Integrado a través de GTM con una etiqueta de configuración global para medir el tráfico, sesiones y el comportamiento de los usuarios en tiempo real.

Internacionalización (i18n): Implementado react-i18next para dar soporte multiidioma nativo (Español/Inglés) con carga dinámica de datos estáticos (como el catálogo de recetas) mediante returnObjects.

---

## 🇬🇧 English Version

This is the web client for **StayKeto**, an application dedicated to managing ketogenic diets, recipes, and nutritional tracking. The project is built using **React** and optimized with **Vite** to provide a fast development experience and efficient production performance.

### 🛠️ Tech Stack
- **React** (v18+)
- **Vite** - Next-generation frontend tooling
- **Design & Styling:** Bootstrap

### 🌐 API Connection
By default, the project is configured to communicate with the live backend API deployed in the cloud:
`https://stay-keto-470404854796.europe-southwest1.run.app`

### 🚀 Installation & Local Setup

1. **Clone the repository and switch to the correct branch:**
   ```bash
   git clone [https://github.com/your-username/stayketo.git](https://github.com/your-username/stayketo.git)
   cd stayketo
   git checkout front
   
Install dependencies and run:

Bash
npm install
npm run dev

   The application will be running locally at `http://localhost:5173`.
   
### 📈 Analytics & Scalability

* **Google Tag Manager (GTM):** Configured at the project's root (`index.html`) to decouple tracking scripts from the React source code, keeping the project clean and modular.
* **Google Analytics 4 (GA4):** Integrated through GTM using a global configuration tag to measure traffic, sessions, and user behavior in real time.
* **Internationalization (i18n):** Implemented `react-i18next` to provide native multi-language support (Spanish/English), featuring dynamic loading of static data (such as the recipe catalog) via `returnObjects`.
