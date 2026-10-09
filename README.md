# Taquería Andrés — React + Vite

Proyecto de interfaz construido con React y Vite. El código está separado por responsabilidad para que puedas modificar cada pantalla y componente sin tener todo en un único archivo.

## Ejecutar

1. Instala Node.js LTS.
2. Abre esta carpeta en Visual Studio Code.
3. En la terminal ejecuta:

```bash
npm install
npm run dev
```

## Organización

- `src/App.jsx`: estado general, navegación y acciones compartidas.
- `src/pages/Login.jsx`: pantalla de inicio de sesión.
- `src/pages/Inventario.jsx`: formulario y tabla de inventario.
- `src/pages/Usuarios.jsx`: formulario y tabla de usuarios.
- `src/components/layout/Sidebar.jsx`: menú lateral.
- `src/components/layout/Header.jsx`: encabezado superior.
- `src/components/layout/Footer.jsx`: pie de página.
- `src/components/ui/Modal.jsx`: ventana reutilizable para editar registros.
- `src/styles.css`: estilos del panel y sus módulos.
- `src/login.css`: estilos del inicio de sesión.

## Nota

El inicio de sesión es demostrativo: acepta cualquier usuario/correo y contraseña si ambos campos tienen contenido. No valida credenciales con un servidor. Los registros se guardan temporalmente en el estado de React, por lo que se reinician al recargar. No hay conexión a base de datos ni API todavía.
