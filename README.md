# DoLean — prototipo frontend

Prototipo navegable de la interfaz web para análisis y corrección de afinación de audio monofónico.

## Requisitos

- Node.js 18 o superior
- npm

## Ejecutar en local

1. Descomprime el proyecto.
2. Abre una terminal dentro de la carpeta `dolean-frontend`.
3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abre la dirección local que muestra Vite (normalmente `http://localhost:5173`).

## Acceso de demostración

- Correo: `demo@dolean.app`
- Contraseña: `demo1234`

También puedes crear una cuenta desde la pantalla de registro. La sesión y los proyectos se guardan en `localStorage`.

## Navegación incluida

- Inicio de sesión
- Registro local de demostración
- Dashboard
- Creación de proyectos
- Listado y búsqueda de proyectos
- Editor de audio con forma de onda ilustrativa y piano-roll interactivo
- Selección y ajuste visual de notas
- División visual de notas
- Reproductor de demostración y comparación A/B
- Vista de análisis con datos ilustrativos
- Configuración de perfil local

## Importante: alcance de esta versión

Este proyecto es únicamente frontend. No tiene backend ni procesa audio real.

Las siguientes acciones son demostrativas:
- El inicio de sesión y registro no autentican contra un servidor.
- El análisis y las notas del editor utilizan datos de ejemplo.
- La reproducción no reproduce un archivo de audio real.
- La comparación A/B alterna el estado visual.
- Guardar conserva algunos datos de interfaz localmente.
- Exportar WAV muestra un aviso porque todavía no existe un motor de procesamiento conectado.
- La grabación desde micrófono está representada como punto de integración futuro.

Los puntos de integración con el backend pueden añadirse después mediante servicios REST, manteniendo las pantallas y componentes de interfaz.

## Arquitectura frontend

El código se organiza con Feature-Sliced Design (FSD), manteniendo dependencias desde las capas de mayor nivel hacia las de menor nivel:

```text
src/
├── app/         # composición, rutas, proveedores y estilos globales
├── pages/       # pantallas asociadas a rutas
├── widgets/     # bloques de interfaz reutilizables, como navegación y layouts
├── features/    # acciones de usuario y reglas de aplicación
├── entities/    # modelos y estado de usuario, proyectos y notas
└── shared/      # UI genérica, almacenamiento local y cliente HTTP
```

Las dependencias entre capas apuntan hacia abajo; los imports entre slices usan sus archivos `index.js` como API pública. La capa `app` compone rutas y proveedores; las entidades exponen su estado y repositorios; las features encapsulan acciones y reglas de aplicación.

La lógica de edición de notas y autenticación de demostración se mantiene separada de las pantallas. Los repositorios de sesión y proyectos aíslan el almacenamiento local; pueden sustituirse por adaptadores de API cuando se definan los contratos del backend. El cliente HTTP lee `VITE_API_BASE_URL`; se puede copiar `.env.example` a `.env.local` y asignar la URL acordada con el equipo backend.

Esta separación prepara la integración, pero no la implementa: el login y los proyectos siguen siendo de demostración y el cliente HTTP todavía no se utiliza en los flujos de la interfaz.

Las reglas de dominio y creación de proyectos tienen pruebas ejecutables con `npm test`.

## Compilar para despliegue

```bash
npm run build
```

Vite genera la aplicación estática en `dist/`.

Para comprobar la compilación localmente:

```bash
npm run preview
```

## Despliegue sugerido

### Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- El archivo `public/_redirects` incluido permite que las rutas de React Router funcionen como SPA.

### Vercel
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Se incluye `vercel.json` con fallback para rutas de la SPA.

## Estructura

```text
dolean-frontend/
├── public/
│   ├── favicon.svg
│   └── _redirects
├── src/
│   ├── app/
│   │   ├── App.jsx
│   │   ├── providers/
│   │   └── routes/
│   ├── entities/
│   │   ├── note/
│   │   ├── project/
│   │   └── user/
│   ├── features/
│   │   ├── authentication/
│   │   └── create-project/
│   ├── pages/
│   │   ├── analysis/
│   │   ├── dashboard/
│   │   ├── editor/
│   │   ├── login/
│   │   ├── projects/
│   │   ├── register/
│   │   └── settings/
│   ├── shared/
│   │   ├── api/
│   │   ├── lib/
│   │   └── ui/
│   ├── widgets/
│   │   ├── app-shell/
│   │   └── auth-layout/
│   ├── main.jsx
│   └── app/styles.css
├── index.html
├── .env.example
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```
