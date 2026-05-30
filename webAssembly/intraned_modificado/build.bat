@echo off
echo Iniciando compilacion de Intraned Modificado para Windows...

:: 1. Crear carpetas necesarias
mkdir build 2>nul
mkdir server\uploads 2>nul

echo.
echo Paso 1: Compilando el Cartucho (ServerCore.dll)...
g++ -std=c++17 -shared -O3 -s server/ServerWrapper.cpp -o build/ServerCore.dll -I server/include -D_WIN32_WINNT=0x0A00 -lws2_32 -static-libgcc -static-libstdc++

echo.
echo Paso 2: Compilando la Consola (intraned.exe)...
g++ -std=c++17 -O3 -s server/main.cpp -o build/intraned.exe

echo.
echo =========================================
echo  Compilacion exitosa.
echo =========================================
echo Para encender el servidor escribe: .\build\intraned.exe
pause