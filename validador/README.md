# Validator Component

## Descripción General
El componente **Validator** es un módulo de software independiente diseñado para validar formatos de datos de entrada, específicamente direcciones de correo electrónico. Su función principal es recibir una cadena de texto, analizar su estructura y retornar un estado de validación junto con un mensaje descriptivo, sin exponer su lógica interna ni su estado al sistema anfitrión (Host).

## Justificación como Componente Independiente
Este módulo justifica su existencia como un componente separado (plugin) debido a:
1. **Responsabilidad Única (SRP):** Se enfoca exclusivamente en la lógica de validación de datos, separando esta preocupación de la lógica de negocio o de presentación del Host.
2. **Reutilización:** Puede ser integrado en cualquier sistema (aplicaciones de escritorio, servicios web, sistemas embebidos) que requiera validación de emails, sin necesidad de recompilar el código base.
3. **Aislamiento de Fallos:** Al ejecutarse en su propio espacio de memoria (biblioteca dinámica), un error crítico dentro del validador no compromete la estabilidad del Host, gracias al manejo seguro de excepciones en la frontera ABI.

## Interfaces y Contratos
El componente expone la interfaz `IValidator`, la cual hereda de `IComponent`.

### Interfaz `IValidator`
| Método | Descripción | Parámetros | Retorno |
| :--- | :--- | :--- | :--- |
| `validate_email` | Valida el formato de un correo electrónico. | `const char* input` (texto a validar)<br>`char* out_buffer` (buffer de salida)<br>`size_t buffer_size` (tamaño del buffer) | `ComponentResult` (SUCCESS, ERROR_INVALID_ARGUMENT, ERROR_INTERNAL) |

## Listado de Requerimientos
1. **Frontera ABI Segura:** El componente NO debe utilizar tipos complejos de la STL (como `std::string` o `std::vector`) en las firmas de sus métodos públicos. Se deben utilizar punteros a caracteres (`const char*`) y buffers mutables.
2. **Manejo de Excepciones:** Ninguna excepción de C++ debe cruzar la frontera del módulo. Todos los métodos deben estar marcados como `noexcept` y envueltos en bloques `try-catch(...)` que retornen `ComponentResult::ERROR_INTERNAL` en caso de fallo.
3. **Validación de Entradas:** El componente debe validar que los punteros de entrada no sean nulos (`nullptr`) y que el tamaño del buffer de salida sea mayor a cero antes de procesar la lógica de negocio.
4. **Gestión de Memoria:** El componente no debe asumir la propiedad de la memoria del buffer de salida. Debe copiar los resultados de forma segura utilizando `strncpy` para evitar desbordamientos (buffer overflows).
5. **Ciclo de Vida (C-API):** El módulo debe exportar tres funciones globales con enlace C (`extern "C"`) para gestionar su ciclo de vida:
   - `get_api_version()`: Retorna la versión del contrato ABI.
   - `create_component()`: Fábrica que instancia el componente.
   - `destroy_component()`: Libera la memoria de la instancia en su propio contexto.

## Guía de Compilación y Uso

### 1. Compilación del Componente (Biblioteca Dinámica)
Para generar el archivo `validator.dll` (Windows) o `validator.so` (Linux), ejecutar el siguiente comando en la raíz del proyecto:
```bash
g++ -std=c++17 -shared -o lib/validator.dll src/validator_component.cpp -Iinclude

g++ -std=c++17 -o host.exe main.cpp -Iinclude
./host.exe
