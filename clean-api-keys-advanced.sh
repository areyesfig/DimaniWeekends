#!/bin/bash

# Script avanzado para limpiar claves API expuestas usando git-filter-repo
# ⚠️ ADVERTENCIA: Este script modifica el historial de Git

echo "🔒 Limpiando claves API expuestas del historial de Git (versión avanzada)..."
echo "⚠️  ADVERTENCIA: Esto modificará el historial de Git"
echo ""

# Verificar si estamos en un repositorio Git
if [ ! -d ".git" ]; then
    echo "❌ Error: No se encontró un repositorio Git"
    exit 1
fi

# Verificar si git-filter-repo está instalado
if ! command -v git-filter-repo &> /dev/null; then
    echo "❌ Error: git-filter-repo no está instalado"
    echo "Instálalo con: pip3 install git-filter-repo"
    exit 1
fi

# Lista de archivos que pueden contener claves API
FILES_TO_CLEAN=(
    ".env"
    "android/app/google-services.json"
    "ios/DimaniWeekends/GoogleService-Info.plist"
)

echo "📋 Archivos que serán limpiados del historial:"
for file in "${FILES_TO_CLEAN[@]}"; do
    if [ -f "$file" ]; then
        echo "  - $file"
    fi
done
echo ""

# Confirmar acción
read -p "¿Estás seguro de que quieres continuar? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operación cancelada"
    exit 1
fi

echo "🧹 Limpiando historial de Git con git-filter-repo..."

# Crear backup del repositorio
echo "📦 Creando backup del repositorio..."
cp -r .git .git.backup.$(date +%Y%m%d_%H%M%S)

# Remover archivos sensibles del historial
for file in "${FILES_TO_CLEAN[@]}"; do
    if [ -f "$file" ]; then
        echo "Removiendo $file del historial..."
        git filter-repo --path "$file" --invert-paths --force
    fi
done

# Limpiar referencias y optimizar
echo "🧽 Optimizando repositorio..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "✅ Limpieza completada con git-filter-repo"
echo ""
echo "📝 Próximos pasos:"
echo "1. Revoca las claves API expuestas en Firebase Console"
echo "2. Genera nuevas claves API"
echo "3. Configura las nuevas claves en tu archivo .env"
echo "4. Haz push de los cambios: git push origin --force"
echo ""
echo "⚠️  IMPORTANTE: Notifica a tu equipo sobre estos cambios"
echo ""
echo "💾 Backup disponible en: .git.backup.*" 