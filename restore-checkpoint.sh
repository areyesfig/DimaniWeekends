#!/bin/bash

echo "🔄 Restaurando Checkpoint: Aplicación Funcionando en iOS"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

print_status "Iniciando restauración del checkpoint..."

# 1. Limpiar node_modules
print_status "Limpiando node_modules..."
rm -rf node_modules
rm -f package-lock.json

# 2. Instalar dependencias
print_status "Instalando dependencias..."
npm install --legacy-peer-deps

# 3. Limpiar iOS
print_status "Limpiando configuración iOS..."
cd ios
rm -rf Pods Podfile.lock
rm -rf ~/Library/Developer/Xcode/DerivedData

# 4. Instalar pods
print_status "Instalando pods..."
pod install --repo-update

# 5. Volver al directorio raíz
cd ..

# 6. Limpiar cache de Metro
print_status "Limpiando cache de Metro..."
npx react-native start --reset-cache &

# 7. Esperar un momento para que Metro inicie
sleep 5

# 8. Ejecutar en iOS
print_status "Ejecutando aplicación en iOS..."
npx react-native run-ios

echo ""
echo "🎉 ¡Checkpoint restaurado exitosamente!"
echo ""
echo "📱 La aplicación debería estar ejecutándose en el simulador de iOS"
echo "🔧 Si hay algún problema, revisa el archivo CHECKPOINT_WORKING_IOS.md"
echo ""
echo "📋 Funcionalidades disponibles:"
echo "   ✅ Autenticación mock (login/registro)"
echo "   ✅ Navegación completa"
echo "   ✅ Carrito de compras"
echo "   ✅ Catálogo de productos"
echo ""
echo "⚠️  Nota: Firebase está removido temporalmente"
echo "   Los datos son mock y no persisten" 