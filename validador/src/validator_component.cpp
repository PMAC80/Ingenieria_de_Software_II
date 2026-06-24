#include "../include/i_validator.hpp"
#include <cstring>
#include <string>

// La clase concreta usa PascalCase y hereda de la interfaz
class ValidatorComponent : public IValidator 
{
public:
    ValidatorComponent() = default;
    ~ValidatorComponent() noexcept override = default;

    ComponentResult validate_email(const char* input, char* out_buffer, size_t buffer_size) noexcept override 
    {
        // 1. Validar que no nos pasen punteros nulos (Regla de seguridad)
        if (!input || !out_buffer || buffer_size == 0) 
        {
            return ComponentResult::ERROR_INVALID_ARGUMENT;
        }

        try 
        {
            // 2. Lógica de negocio (Simple: buscar '@' y '.')
            std::string email(input);
            bool tiene_arroba = (email.find('@') != std::string::npos);
            bool tiene_punto = (email.find('.') != std::string::npos);
            bool es_valido = tiene_arroba && tiene_punto;

            // 3. Preparar la respuesta
            const char* respuesta = es_valido ? "VALIDO" : "INVALIDO";

            // 4. Copiar la respuesta al buffer de salida de forma segura
            if (strlen(respuesta) >= buffer_size) 
            {
                return ComponentResult::ERROR_INVALID_ARGUMENT; // El buffer es muy chico
            }
            
            strncpy(out_buffer, respuesta, buffer_size - 1);
            out_buffer[buffer_size - 1] = '\0'; // Asegurar que termine en null

            return ComponentResult::SUCCESS;
        } 
        catch (...) 
        {
            // 5. Regla de oro: NINGUNA excepción cruza la frontera ABI
            return ComponentResult::ERROR_INTERNAL;
        }
    }
};

// ==========================================
// FUNCIONES GLOBALES (C-API)
// Estas son las "puertas" por donde el Host entra al plugin.
// ==========================================

extern "C" int get_api_version() noexcept 
{
    return CURRENT_API_VERSION;
}

extern "C" IComponent* create_component() noexcept 
{
    try 
    {
        return new ValidatorComponent();
    } 
    catch (...) 
    {
        return nullptr;
    }
}

extern "C" void destroy_component(IComponent* instance) noexcept 
{
    delete instance;
}