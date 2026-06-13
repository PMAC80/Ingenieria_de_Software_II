/**
 * @file main.cpp
 * @author Gabriel Nicolás González Ferreira
 * @brief Servidor principal - Runtime de Carga Dinámica
 * @version 0.4
 */
 
#include <iostream>
#include <string>

#ifdef _WIN32
    #include <windows.h>
#else
    #include <dlfcn.h>
#endif

// Incluimos la interfaz para que reconozca los metodos
#include "include/IServer.h"

typedef IServer* (*CreateServerFunc)();

int main() 
{
    std::cout << "Iniciando cargador dinámico de Intraned..." << std::endl;

#ifdef _WIN32
    const char* lib_name = "build/ServerCore.dll";
    HMODULE lib = LoadLibraryA(lib_name);
    if (!lib) {
        std::cerr << "Error: No se pudo cargar " << lib_name << std::endl;
        return 1;
    }
    
    CreateServerFunc create_server = (CreateServerFunc)GetProcAddress(lib, "CreateServerInstance");
    if (!create_server) {
        std::cerr << "Error: No se encontro el punto de entrada 'CreateServerInstance'" << std::endl;
        FreeLibrary(lib);
        return 1;
    }
#else
    const char* lib_name = "./build/libServerCore.so";
    void* lib = dlopen(lib_name, RTLD_LAZY);
    if (!lib) {
        std::cerr << "Error: No se pudo cargar " << lib_name << "\n" << dlerror() << std::endl;
        return 1;
    }

    CreateServerFunc create_server = (CreateServerFunc)dlsym(lib, "CreateServerInstance");
    if (!create_server) {
        std::cerr << "Error: No se encontro el punto de entrada 'CreateServerInstance'\n" << dlerror() << std::endl;
        dlclose(lib);
        return 1;
    }
#endif

    // Lanzar el servidor alojado en la librería dinámica
    IServer* server = create_server();
    if (server) {
        server->iniciar();
    }

#ifdef _WIN32
    FreeLibrary(lib);
#else
    dlclose(lib);
#endif

    return 0;
}