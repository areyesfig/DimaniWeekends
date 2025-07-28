#!/bin/bash

# Script para limpiar claves API expuestas en Git
# ⚠️ ADVERTENCIA: Este script modifica el historial de Git

echo "🔒 Limpiando claves API expuestas del historial de Git..."
echo "⚠️  ADVERTENCIA: Esto modificará el historial de Git"
echo ""

# Verificar si estamos en un repositorio Git
if [ ! -d ".git" ]; then
    echo "❌ Error: No se encontró un repositorio Git"
    exit 1
fi

# Lista de archivos que pueden contener claves API
FILES_TO_CLEAN=(
    ".env"
    "android/app/google-services.json"
    "ios/DimaniWeekends/GoogleService-Info.plist"
    "AUTHENTICATION_GUIDE.md"
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

echo "🧹 Limpiando historial de Git..."

# Remover archivos sensibles del historial
for file in "${FILES_TO_CLEAN[@]}"; do
    if [ -f "$file" ]; then
        echo "Removiendo $file del historial..."
        git filter-branch --force --index-filter \
            "git rm --cached --ignore-unmatch '$file'" \
            --prune-empty --tag-name-filter cat -- --all
    fi
done

# Limpiar referencias
git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d

# Forzar garbage collection
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "✅ Limpieza completada"
echo ""
echo "📝 Próximos pasos:"
echo "1. Revoca las claves API expuestas en Firebase Console"
echo "2. Genera nuevas claves API"
echo "3. Configura las nuevas claves en tu archivo .env"
echo "4. Haz push de los cambios: git push origin --force"
echo ""
echo "⚠️  IMPORTANTE: Notifica a tu equipo sobre estos cambios" 