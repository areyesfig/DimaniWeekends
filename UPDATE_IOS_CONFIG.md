# 📱 Actualizar Configuración de iOS - Firebase

## 🔧 Pasos para Actualizar GoogleService-Info.plist

### 1. Obtener Nuevo Archivo de Firebase Console

1. **Acceder a Firebase Console:**
   - Ve a https://console.firebase.google.com
   - Selecciona tu proyecto: `dimaniweekends-app`

2. **Descargar configuración de iOS:**
   - Ve a **Configuración del proyecto** (ícono de engranaje)
   - En la pestaña **General**, busca tu app iOS
   - Haz clic en **"Descargar GoogleService-Info.plist"**

### 2. Reemplazar Archivo Local

1. **Ubicación del archivo:**
   ```
   ios/DimaniWeekends/GoogleService-Info.plist
   ```

2. **Reemplazar archivo:**
   ```bash
   # Hacer backup del archivo actual
   cp ios/DimaniWeekends/GoogleService-Info.plist ios/DimaniWeekends/GoogleService-Info.plist.backup
   
   # Reemplazar con el nuevo archivo
   # (Copia el archivo descargado a la ubicación correcta)
   ```

### 3. Verificar Configuración

1. **Verificar que el archivo está en .gitignore:**
   ```bash
   grep "GoogleService-Info.plist" .gitignore
   ```

2. **Verificar que no está en Git:**
   ```bash
   git status ios/DimaniWeekends/GoogleService-Info.plist
   ```

3. **Verificar contenido del archivo:**
   ```bash
   # Verificar que tiene la nueva API Key
   grep "API_KEY" ios/DimaniWeekends/GoogleService-Info.plist
   ```

### 4. Actualizar Variables de Entorno

1. **Abrir archivo .env:**
   ```bash
   nano .env
   ```

2. **Actualizar API_KEY:**
   ```env
   API_KEY=tu_nueva_api_key_aqui
   ```

### 5. Probar Configuración

1. **Limpiar build:**
   ```bash
   cd ios
   rm -rf build/
   pod install
   cd ..
   ```

2. **Ejecutar aplicación:**
   ```bash
   npx react-native run-ios
   ```

3. **Verificar que no hay errores de Firebase**

## 🔍 Verificación de Seguridad

### Comandos de Verificación
```bash
# Verificar que el archivo no está en Git
git status ios/DimaniWeekends/GoogleService-Info.plist

# Verificar que está en .gitignore
grep "GoogleService-Info.plist" .gitignore

# Verificar contenido (sin mostrar la clave completa)
grep "API_KEY" ios/DimaniWeekends/GoogleService-Info.plist | head -1
```

### Checklist de Verificación
- [ ] Archivo descargado de Firebase Console
- [ ] Archivo reemplazado en ubicación correcta
- [ ] Archivo no está en Git
- [ ] Archivo está en .gitignore
- [ ] Variables de entorno actualizadas
- [ ] Aplicación funciona sin errores

## ⚠️ Importante

### Seguridad
- **Nunca** subas `GoogleService-Info.plist` a GitHub
- **Siempre** verifica que está en `.gitignore`
- **Rota** las claves API regularmente

### Backup
- Mantén un backup del archivo anterior
- Documenta cambios de configuración
- Verifica funcionamiento antes de hacer commit

## 🚨 Si Hay Problemas

### Error: "Firebase not initialized"
1. Verificar que el archivo está en la ubicación correcta
2. Verificar que el archivo tiene el formato correcto
3. Limpiar build y reinstalar pods

### Error: "API Key not found"
1. Verificar que la API Key está en el archivo
2. Verificar que la API Key es válida en Firebase Console
3. Regenerar archivo desde Firebase Console

### Error: "Permission denied"
1. Verificar permisos del archivo
2. Verificar que el archivo es legible
3. Reinstalar pods si es necesario

---

**Estado:** ⚠️ Requiere actualización
**Prioridad:** Alta
**Responsable:** Desarrollador iOS 