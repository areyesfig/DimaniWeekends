# DimaniWeekends - React Native App

Una aplicación simple de React Native que muestra "¡Hola Mundo!" como punto de partida.

## 🚀 Estado del Proyecto

✅ **Android**: Funcionando correctamente  
⚠️ **iOS**: Requiere configuración adicional de CocoaPods

## 📱 Cómo Ejecutar

### Para Android

1. **Asegúrate de tener un emulador de Android ejecutándose** o un dispositivo conectado
2. **Ejecuta el proyecto**:
   ```bash
   npx react-native run-android
   ```

### Para iOS

**Nota**: Actualmente hay un problema con la instalación de CocoaPods debido a un error de checksum con boost. Para solucionarlo:

1. **Abre Xcode**:
   ```bash
   open ios/DimaniWeekends.xcworkspace
   ```
   
2. **O ejecuta desde la línea de comandos** (después de solucionar CocoaPods):
   ```bash
   npx react-native run-ios
   ```

## 🔧 Solución de Problemas

### Problema con CocoaPods (iOS)

Si encuentras errores con boost durante la instalación de CocoaPods:

1. **Limpia la caché de CocoaPods**:
   ```bash
   cd ios
   pod cache clean --all
   ```

2. **Reinstala las dependencias**:
   ```bash
   pod install --repo-update
   ```

3. **Si el problema persiste**, intenta:
   ```bash
   cd ios
   rm -rf Pods Podfile.lock
   pod install
   ```

### Verificar el Entorno

Para verificar que todo esté configurado correctamente:

```bash
npx react-native doctor
```

## 📁 Estructura del Proyecto

```
DimaniWeekends/
├── android/          # Configuración de Android
├── ios/             # Configuración de iOS
├── App.tsx          # Componente principal (Hola Mundo)
├── index.js         # Punto de entrada
└── package.json     # Dependencias del proyecto
```

## 🎯 Próximos Pasos

1. **Android**: El proyecto está listo para desarrollo
2. **iOS**: Resolver el problema de CocoaPods para desarrollo completo
3. **Desarrollo**: Comenzar a agregar funcionalidades específicas de DimaniWeekends

## 📞 Soporte

Si encuentras problemas, verifica:
- Que tienes Node.js instalado
- Que tienes React Native CLI configurado
- Que tienes Android Studio (para Android) y Xcode (para iOS) instalados
- Que los emuladores están ejecutándose correctamente
