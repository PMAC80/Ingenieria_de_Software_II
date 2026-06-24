#ifndef IVALIDATOR_HPP
#define IVALIDATOR_HPP

#include "i_component.hpp"
#include <cstddef>

// La interfaz siempre empieza con "I" y usa PascalCase
class IValidator : public IComponent 
{
public:
    // Método para validar un email.
    // input: el email a validar.
    // out_buffer: donde el plugin escribirá "VALIDO" o "INVALIDO".
    // buffer_size: el tamaño máximo de out_buffer para no desbordar la memoria.
    virtual ComponentResult validate_email(const char* input, char* out_buffer, size_t buffer_size) noexcept = 0;
};

#endif // IVALIDATOR_HPP