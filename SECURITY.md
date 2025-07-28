# 🔒 Guía de Seguridad - DimaniWeekends

## ⚠️ Advertencia de Seguridad

**IMPORTANTE:** Las claves API y configuraciones sensibles NO deben subirse a GitHub.

## 🛡️ Protección de Datos Sensibles

### Archivos Protegidos
Los siguientes archivos están incluidos en `.gitignore` y NO deben subirse a GitHub:

- `.env` - Variables de entorno
- `google-services.json` - Configuración de Firebase para Android
- `GoogleService-Info.plist` - Configuración de Firebase para iOS
- Cualquier archivo que contenga claves API

### Configuración de Variables de Entorno

1. **Crear archivo `.env`:**
```bash
# En la raíz del proyecto
touch .env
```

2. **Agregar variables sensibles:**
```env
API_KEY=tu_firebase_api_key_real
WEBPAY_API_KEY=tu_webpay_api_key_real
```

3. **Verificar que `.env` está en `.gitignore`:**
```bash
grep -n ".env" .gitignore
```

## 🔑 Configuración de Firebase

### Para Desarrolladores

1. **Obtener claves desde Firebase Console:**
   - Ve a [Firebase Console](https://console.firebase.google.com)
   - Selecciona tu proyecto
   - Ve a Configuración del proyecto
   - Descarga los archivos de configuración

2. **Configurar archivos de Firebase:**
   - `google-services.json` para Android
   - `GoogleService-Info.plist` para iOS

3. **Configurar variables de entorno:**
   - Copia la API Key a tu archivo `.env`

### Para Producción

1. **Usar variables de entorno del servidor**
2. **Rotar claves regularmente**
3. **Monitorear uso de API**
4. **Configurar restricciones de dominio/IP**

## 🚨 Si las Claves se Han Expuesto

### Pasos Inmediatos

1. **Revocar claves expuestas:**
   - Ve a Firebase Console
   - Revoca las claves comprometidas
   - Genera nuevas claves

2. **Limpiar historial de Git:**
```bash
# Remover archivo del historial de Git
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

3. **Forzar push:**
```bash
git push origin --force
```

4. **Notificar al equipo:**
   - Comunicar la exposición
   - Actualizar documentación
   - Revisar logs de uso

## 📋 Checklist de Seguridad

- [ ] Archivo `.env` creado y configurado
- [ ] `.env` incluido en `.gitignore`
- [ ] Claves API no están en el código
- [ ] Archivos de Firebase configurados localmente
- [ ] Documentación actualizada sin claves reales
- [ ] Equipo notificado sobre prácticas de seguridad

## 🔍 Verificación

### Comandos de Verificación

```bash
# Verificar que .env no está en Git
git status .env

# Verificar que .gitignore incluye archivos sensibles
grep -E "(\.env|google-services|GoogleService)" .gitignore

# Verificar que no hay claves API en el código
grep -r "AIzaSy" src/ || echo "No se encontraron claves API en el código"
```

## 📞 Contacto

Si encuentras una exposición de seguridad:
1. Reporta inmediatamente al equipo
2. Sigue los pasos de revocación
3. Documenta el incidente
4. Implementa medidas preventivas

---

**Recuerda:** La seguridad es responsabilidad de todos. Siempre verifica antes de hacer commit. 