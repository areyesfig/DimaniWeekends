#!/bin/bash

# Script para actualizar configuración de Firebase con nuevas claves API
# ⚠️ IMPORTANTE: Primero debes revocar las claves expuestas en Firebase Console

echo "🔧 Actualizando configuración de Firebase..."
echo "⚠️  IMPORTANTE: Asegúrate de haber revocado las claves expuestas en Firebase Console"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "android/app/google-services.json" ]; then
    echo "❌ Error: No se encontró google-services.json"
    echo "Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

echo "📋 Pasos para actualizar configuración:"
echo ""
echo "1. 🔒 Revocar claves expuestas en Firebase Console:"
echo "   - Ve a https://console.firebase.google.com"
echo "   - Selecciona proyecto: dimaniweekends-app"
echo "   - Ve a Configuración del proyecto"
echo "   - Haz clic en 'Ir a Google Cloud Console'"
echo "   - Ve a APIs y servicios > Credenciales"
echo "   - Busca y elimina la clave: AIzaSyDo8KZCyrzvK36HSaoCbUdqx5uUJaOoPPk"
echo ""
echo "2. 🔑 Generar nuevas claves:"
echo "   - En Firebase Console, ve a Configuración del proyecto"
echo "   - Para Android: Descarga nuevo google-services.json"
echo "   - Para iOS: Descarga nuevo GoogleService-Info.plist"
echo ""
echo "3. 📝 Actualizar archivos localmente:"
echo "   - Reemplaza android/app/google-services.json"
echo "   - Reemplaza ios/DimaniWeekends/GoogleService-Info.plist"
echo "   - Actualiza .env con nueva API_KEY"
echo ""

# Solicitar nueva API Key
read -p "¿Tienes la nueva API Key de Firebase? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Ingresa la nueva API Key: " new_api_key
    
    if [ ! -z "$new_api_key" ]; then
        echo "🔄 Actualizando google-services.json..."
        
        # Actualizar google-services.json
        sed -i.bak "s/TU_NUEVA_API_KEY_AQUI/$new_api_key/g" android/app/google-services.json
        
        echo "✅ google-services.json actualizado"
        echo ""
        echo "📝 Próximos pasos:"
        echo "1. Actualiza ios/DimaniWeekends/GoogleService-Info.plist"
        echo "2. Actualiza .env con la nueva API_KEY"
        echo "3. Ejecuta la aplicación para verificar"
        echo ""
        echo "🔍 Verificación:"
        echo "grep -r '$new_api_key' android/app/google-services.json"
    else
        echo "❌ No se proporcionó una API Key válida"
    fi
else
    echo "📋 Instrucciones para obtener nueva API Key:"
    echo ""
    echo "1. Ve a Firebase Console: https://console.firebase.google.com"
    echo "2. Selecciona tu proyecto: dimaniweekends-app"
    echo "3. Ve a Configuración del proyecto"
    echo "4. En la pestaña 'General', busca tu app Android"
    echo "5. Haz clic en 'Descargar google-services.json'"
    echo "6. Abre el archivo y copia la nueva API Key"
    echo "7. Ejecuta este script nuevamente"
fi

echo ""
echo "⚠️  RECUERDA:"
echo "- Nunca subas archivos de configuración a GitHub"
echo "- Mantén las claves API seguras"
echo "- Rota las claves regularmente" 