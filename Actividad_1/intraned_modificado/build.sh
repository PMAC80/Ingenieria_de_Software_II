#!/bin/bash

# Colores para la terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Iniciando compilación de la Isla de Conocimiento (con Carga Dinámica)...${NC}"

# 1. Crear carpetas necesarias si no existen
mkdir -p build
mkdir -p server/uploads

# Detectar el SO para la extensión y flags de la librería compartida
OS="$(uname -s)"
if [[ "$OS" == *"MINGW"* ]] || [[ "$OS" == *"CYGWIN"* ]] || [[ "$OS" == *"MSYS"* ]]; then
    SHARED_LIB="build/ServerCore.dll"
    LDFLAGS="-shared -Wl,--out-implib,build/libServerCore.a"
else
    SHARED_LIB="build/libServerCore.so"
    # PIC necesario en linux para shared libraries
    CXXFLAGS="-fPIC"
    LDFLAGS="-shared"
    # Flag -ldl necesario para dlfcn.h
    DL_FLAG="-ldl"
fi

echo "Paso 1: Compilando la biblioteca dinámica (${SHARED_LIB}). (Dependencias pesadas)..."
# Paso A: Compilar wrappers individuales para httplib y json como DSO
echo "Compilando wrappers independientes: libhttplib / libjson"
if [[ "$OS" == *"MINGW"* ]] || [[ "$OS" == *"CYGWIN"* ]] || [[ "$OS" == *"MSYS"* ]]; then
    g++ -std=c++17 -O3 -s server/httplib_wrapper.cpp -o build/httplib.dll -shared -I server/include
    if [ $? -ne 0 ]; then
        echo "Error compilando httplib wrapper"
        exit 1
    fi
    g++ -std=c++17 -O3 -s server/json_wrapper.cpp -o build/json.dll -shared -I server/include
    if [ $? -ne 0 ]; then
        echo "Error compilando json wrapper"
        exit 1
    fi
    # Preparar nombre de ServerCore
    SHARED_LIB="build/ServerCore.dll"
    # Linkear ServerCore contra las DLLs
    echo "Compilando ServerCore (link dinámico contra httplib/json)..."
    g++ -std=c++17 -O3 -s server/ServerCore.cpp -o $SHARED_LIB -shared -I server/include -Lbuild -lhttplib -ljson -pthread
else
    # Linux / Unix: crear .so con PIC
    g++ -std=c++17 -O3 -s $CXXFLAGS server/httplib_wrapper.cpp -o build/libhttplib.so $LDFLAGS -pthread -I server/include
    if [ $? -ne 0 ]; then
        echo "Error compilando httplib wrapper"
        exit 1
    fi
    g++ -std=c++17 -O3 -s $CXXFLAGS server/json_wrapper.cpp -o build/libjson.so $LDFLAGS -pthread -I server/include
    if [ $? -ne 0 ]; then
        echo "Error compilando json wrapper"
        exit 1
    fi
    # Ahora compilamos ServerCore.linkándolo contra libhttplib.so y libjson.so
    echo "Compilando ServerCore (link dinámico contra libhttplib/libjson)..."
    g++ -std=c++17 -O3 -s $CXXFLAGS server/ServerCore.cpp -o $SHARED_LIB $LDFLAGS -pthread -I server/include -Lbuild -lhttplib -ljson
fi

if [ $? -ne 0 ]; then
    echo "Error compilando ServerCore.cpp"
    exit 1
fi

echo "Paso siguiente: Compilando main.cpp (Lanzador Ligero)..."
# Compilamos el lanzador (main) sin recompilar las cabeceras grandes
g++ -std=c++17 -O3 -s server/main.cpp -o build/intraned $DL_FLAG

# 3. Verificar si la compilación fue exitosa
if [ $? -eq 0 ]; then
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN} Compilación exitosa en: build/intraned ${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo -e "Para iniciar el servidor, ejecuta: ./build/intraned"
else
    echo "Error en la compilación del main."
fi