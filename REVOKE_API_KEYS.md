# 🔒 Instrucciones para Revocar Claves API - Firebase Console

## 🚨 Acción Crítica Requerida

**IMPORTANTE:** Las claves API han sido expuestas en GitHub y deben ser revocadas inmediatamente.

## 📋 Pasos para Revocar Claves en Firebase Console

### 1. Acceder a Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto: `dimaniweekends-app`
3. Ve a **Configuración del proyecto** (ícono de engranaje)

### 2. Revocar Claves API

#### Opción A: Revocar desde Google Cloud Console
1. En Firebase Console, ve a **Configuración del proyecto**
2. Haz clic en **"Ir a Google Cloud Console"**
3. En Google Cloud Console, ve a **APIs y servicios** > **Credenciales**
4. Busca la clave API: `AIzaSyDo8KZCyrzvK36HSaoCbUdqx5uUJaOoPPk`
5. Haz clic en la clave y selecciona **"Eliminar"**
6. Confirma la eliminación

#### Opción B: Regenerar desde Firebase Console
1. En Firebase Console, ve a **Configuración del proyecto**
2. En la pestaña **General**, busca la sección **"Tus apps"**
3. Para cada app (Android/iOS), haz clic en **"Descargar google-services.json"**
4. Esto regenerará automáticamente las claves API

### 3. Generar Nuevas Claves

#### Para Android:
1. En Firebase Console, ve a **Configuración del proyecto**
2. En la pestaña **General**, busca tu app Android
3. Haz clic en **"Descargar google-services.json"**
4. Reemplaza el archivo en `android/app/google-services.json`

#### Para iOS:
1. En Firebase Console, ve a **Configuración del proyecto**
2. En la pestaña **General**, busca tu app iOS
3. Haz clic en **"Descargar GoogleService-Info.plist"**
4. Reemplaza el archivo en `ios/DimaniWeekends/GoogleService-Info.plist`

### 4. Actualizar Variables de Entorno

1. Abre el archivo `.env` en la raíz del proyecto
2. Reemplaza la API Key con la nueva:
```env
API_KEY=tu_nueva_firebase_api_key_aqui
```

### 5. Verificar Configuración

1. Ejecuta la aplicación para verificar que funciona:
```bash
npx react-native run-ios
# o
npx react-native run-android
```

2. Verifica que no hay errores de autenticación

## 🔍 Verificación de Seguridad

### Comandos de Verificación
```bash
# Verificar que .env no está en Git
git status .env

# Verificar que no hay claves API en el código
grep -r "AIzaSy" src/ || echo "No se encontraron claves API en el código"

# Verificar archivos protegidos
grep -E "(\.env|google-services|GoogleService)" .gitignore
```

### Checklist de Seguridad
- [ ] Claves API revocadas en Firebase Console
- [ ] Nuevas claves generadas
- [ ] Archivos de configuración actualizados
- [ ] Variables de entorno actualizadas
- [ ] Aplicación funciona correctamente
- [ ] Archivos sensibles en `.gitignore`

## 📞 Contacto de Emergencia

Si encuentras problemas:
1. **Reporta inmediatamente** al equipo
2. **Revisa logs** en Firebase Console
3. **Verifica** configuración de APIs
4. **Documenta** cualquier incidente

## 🛡️ Prevención Futura

### Mejores Prácticas
1. **Nunca** subir archivos `.env` a GitHub
2. **Siempre** usar `.gitignore` para archivos sensibles
3. **Rotar** claves API regularmente
4. **Monitorear** uso de APIs
5. **Documentar** cambios de configuración

### Herramientas de Seguridad
- Script de limpieza: `./clean-api-keys-advanced.sh`
- Documentación: `SECURITY.md`
- Plantilla: `.env.example`

---

**Estado:** ⚠️ Requiere acción inmediata
**Prioridad:** Crítica
**Responsable:** Equipo de desarrollo 