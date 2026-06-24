/**
 * @file main.cpp
 * @author Gabriel Ferreira (gabrielinuz@fi.mdp.edu.ar)
 * @brief C Plus Plus Component Model
 * @version 1
 * @date 2026-05-19
 * 
 * @copyright Copyright (c) 2026 Released under the MIT license
 * @link https://opensource.org/licenses/MIT @endlink
 * 
 */
#include "module_manager.hpp"
#include "i_validator.hpp"
#include <iostream>
#include <string>

int main() 
{
    std::cout << "Iniciando Host..." << std::endl;

    try 
    {
        ModuleManager manager;
        
        // Cargar el módulo (asegurate que el archivo se llame validator.dll en la carpeta lib)
        std::cout << "Cargando módulo..." << std::endl;
        manager.load_module("./lib/validator"); 

        std::cout << "Creando instancia..." << std::endl;
        auto validator = manager.create_instance<IValidator>("validator");

        const char* email = "miguel@ejemplo.com";
        char buffer[256];

        std::cout << "Validando email..." << std::endl;
        ComponentResult res = validator->validate_email(email, buffer, sizeof(buffer));

        if (res == ComponentResult::SUCCESS) {
            std::cout << "Resultado: " << buffer << std::endl;
        } else {
            std::cout << "Falló la validación." << std::endl;
        }
    } 
    catch (const std::exception& e) 
    {
        std::cerr << "ERROR FATAL: " << e.what() << std::endl;
    }

    std::cout << "Presiona ENTER para salir..." << std::endl;
    std::cin.get(); // ESTO EVITA QUE SE CIERRE LA CONSOLA
    return 0;
}