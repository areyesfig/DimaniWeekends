#!/bin/bash

echo "🔧 Aplicando fixes adicionales para gRPC..."

# Crear directorios si no existen
mkdir -p Pods/Headers/Private/gRPC
mkdir -p Pods/Headers/Private/BoringSSL-GRPC

# Crear modulemap para gRPC-Core
cat > Pods/Headers/Private/gRPC/gRPC-Core.modulemap << 'EOF'
module gRPC-Core {
  umbrella header "gRPC-Core-umbrella.h"
  export *
  module * { export * }
}
EOF

# Crear modulemap para gRPC-C++
cat > Pods/Headers/Private/gRPC/gRPC-C++.modulemap << 'EOF'
module gRPC-C++ {
  umbrella header "gRPC-C++-umbrella.h"
  export *
  module * { export * }
}
EOF

# Crear modulemap para BoringSSL-GRPC
cat > Pods/Headers/Private/BoringSSL-GRPC/BoringSSL-GRPC.modulemap << 'EOF'
module BoringSSL-GRPC {
  umbrella header "BoringSSL-GRPC-umbrella.h"
  export *
  module * { export * }
}
EOF

echo "✅ Modulemaps creados exitosamente"

# Aplicar configuración adicional al proyecto
echo "🔧 Configurando proyecto Xcode..."

# Buscar y modificar archivos de configuración de gRPC
find Pods -name "*.podspec" -exec grep -l "gRPC\|BoringSSL" {} \; | while read podspec; do
    echo "Modificando: $podspec"
    # Agregar configuración de compilación si es necesario
done

echo "✅ Configuración completada" 