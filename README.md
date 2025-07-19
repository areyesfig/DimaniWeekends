# DimaniWeekends - App de Catálogo y Carrito de Compras

## 📱 Descripción

DimaniWeekends es una aplicación móvil desarrollada en React Native que permite a los usuarios explorar un catálogo de productos (empanadas y cachitos) y realizar pedidos a través de un carrito de compras integrado.

## ✨ Funcionalidades Implementadas

### 🛍️ Catálogo de Productos
- **Productos disponibles:**
  - Empanada de Pino ($1,200)
  - Empanada Napolitana ($1,300)
  - Empanada de Queso y Jamón ($1,400)
  - Cachito de Jamón ($800)
  - Cachito de Queso ($900)

- **Características del catálogo:**
  - Filtros por categoría (Todos, Empanadas, Cachitos)
  - Información detallada de cada producto
  - Stock en tiempo real
  - Precios formateados en pesos chilenos
  - Indicador de productos en el carrito

### 🛒 Carrito de Compras
- **Funcionalidades:**
  - Agregar productos con validación de stock
  - Modificar cantidades (+ y -)
  - Eliminar productos automáticamente
  - Cálculo automático del total
  - Persistencia de datos en AsyncStorage
  - Badge visual con cantidad de items
  - Confirmación de pedidos

### 🎨 Interfaz de Usuario
- **Navegación:** React Navigation con stack navigator
- **Diseño:** Cards modernas con sombras y colores atractivos
- **Responsive:** Adaptado para diferentes tamaños de pantalla
- **Feedback:** Alertas y confirmaciones para mejor UX

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── ProductCard.tsx   # Tarjeta de producto
│   ├── CartItem.tsx      # Item del carrito
│   └── CartBadge.tsx     # Badge del carrito
├── context/
│   └── CartContext.tsx   # Contexto global del carrito
├── screens/              # Pantallas de la aplicación
│   ├── CatalogScreen.tsx # Pantalla del catálogo
│   └── CartScreen.tsx    # Pantalla del carrito
├── services/
│   └── productService.ts # Servicio de productos
└── types/
    └── index.ts          # Tipos TypeScript
```

## 🛠️ Tecnologías Utilizadas

- **React Native:** Framework principal
- **TypeScript:** Tipado estático
- **React Navigation:** Navegación entre pantallas
- **AsyncStorage:** Persistencia de datos
- **Context API:** Estado global
- **React Native Vector Icons:** Iconografía

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js >= 18
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS)

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd DimaniWeekends

# Instalar dependencias
npm install

# Para iOS (macOS)
cd ios && pod install && cd ..
```

### Ejecución
```bash
# Iniciar Metro bundler
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios
```

## 📋 Checkpoints del Proyecto

### ✅ Checkpoint 1: Catálogo y Carrito (Commit: cdd4f1e)
- Sistema completo de catálogo de productos
- Carrito de compras funcional
- Navegación entre pantallas
- Persistencia de datos
- Interfaz moderna y responsive

## 🎯 Próximas Funcionalidades

- [ ] Integración con Firebase para backend
- [ ] Sistema de autenticación de usuarios
- [ ] Historial de pedidos
- [ ] Notificaciones push
- [ ] Pago en línea
- [ ] Geolocalización para delivery
- [ ] Sistema de reseñas y calificaciones

## 📄 Licencia

Este proyecto es privado y desarrollado para DimaniWeekends.

## 👨‍💻 Desarrollador

Desarrollado con ❤️ usando React Native y TypeScript.
