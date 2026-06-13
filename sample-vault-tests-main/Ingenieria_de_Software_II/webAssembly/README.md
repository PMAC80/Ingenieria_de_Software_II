# Procesamiento de Imágenes con WebAssembly (C++ + JavaScript)

## Descripción

Este proyecto implementa un filtro de escala de grises utilizando WebAssembly (WASM) y C++.

La aplicación permite seleccionar una imagen desde el navegador, enviar sus píxeles a un módulo WebAssembly, procesarlos en C++ y devolver el resultado para mostrar la imagen modificada en pantalla.

El objetivo principal es demostrar la integración entre:

* HTML
* JavaScript
* WebAssembly
* C++
* Embind
* Emscripten

---

# ¿Qué hace el proyecto?

1. El usuario selecciona una imagen.
2. JavaScript carga la imagen en un canvas.
3. Se obtiene el arreglo de píxeles RGBA.
4. El arreglo se envía al módulo WebAssembly.
5. C++ recorre todos los píxeles.
6. Se aplica un filtro de escala de grises.
7. Los datos modificados regresan a JavaScript.
8. El canvas muestra la imagen en blanco y negro.

---

# Estructura del proyecto

```text
webAssembly/
│
├── image_processor.cpp
├── image_processor.js
├── image_processor.wasm
├── index.html
└── main.js
```

## image_processor.cpp

Contiene la lógica principal en C++.

Responsabilidades:

* Definir filtros.
* Procesar los píxeles.
* Exponer funciones y clases a JavaScript mediante Embind.

---

## image_processor.js

Generado automáticamente por Emscripten.

Actúa como puente entre:

JavaScript ↔ WebAssembly

No debe modificarse manualmente.

---

## image_processor.wasm

Archivo binario WebAssembly.

Contiene el código compilado desde C++.

El navegador lo ejecuta de forma muy eficiente.

---

## main.js

Responsabilidades:

* Detectar la selección de una imagen.
* Obtener los píxeles del canvas.
* Invocar el módulo WebAssembly.
* Mostrar el resultado.

---

## index.html

Interfaz mínima del proyecto.

Contiene:

* Input para seleccionar archivos.
* Canvas para visualizar la imagen.
* Inclusión de JavaScript y WebAssembly.

---

# Conceptos importantes

## ¿Qué es WebAssembly?

WebAssembly (WASM) es un formato binario que permite ejecutar código compilado dentro del navegador.

Ventajas:

* Más rápido que JavaScript para tareas pesadas.
* Compatible con varios lenguajes.
* Se ejecuta en todos los navegadores modernos.

---

## ¿Qué es Emscripten?

Emscripten es una herramienta que compila código C/C++ hacia WebAssembly.

Durante la compilación genera:

```text
image_processor.js
image_processor.wasm
```

Comando utilizado:

```bash
emcc image_processor.cpp -o image_processor.js --bind
```

---

## ¿Qué es Embind?

Embind es una biblioteca incluida en Emscripten.

Permite exponer clases y funciones C++ a JavaScript.

Gracias a Embind fue posible escribir:

```javascript
const processor =
    new Module.ImageProcessor();
```

aunque la clase fue creada originalmente en C++.

---

## ¿Qué es una ABI?

ABI significa:

Application Binary Interface

Define cómo se comunican componentes compilados.

Por ejemplo:

* Cómo se pasan parámetros.
* Cómo se devuelven resultados.
* Cómo se representa la memoria.

La ABI permite que JavaScript y WebAssembly trabajen juntos correctamente.

---

## ¿Qué es un Allocator?

Un allocator es un componente encargado de administrar memoria.

Sus tareas principales son:

* Reservar memoria.
* Liberar memoria.
* Gestionar recursos.

En proyectos más grandes de WebAssembly la gestión de memoria suele ser un aspecto importante.

---

# Aplicación de SOLID

## S - Single Responsibility Principle

Cada clase tiene una única responsabilidad.

### GrayscaleFilter

Convierte un píxel a escala de grises.

### ImageProcessor

Recorre la imagen y aplica filtros.

---

## O - Open/Closed Principle

El sistema puede extenderse sin modificar código existente.

Por ejemplo:

```cpp
class SepiaFilter
```

```cpp
class NegativeFilter
```

podrían agregarse sin modificar el procesador principal.

---

## D - Dependency Inversion Principle

ImageProcessor trabaja contra una abstracción:

```cpp
IImageFilter
```

en lugar de depender directamente de una implementación concreta.

---

# Fórmula utilizada

Para obtener el gris:

```text
gris =
(R * 0.3) +
(G * 0.59) +
(B * 0.11)
```

donde:

* R = rojo
* G = verde
* B = azul

---

# Flujo completo

```text
Usuario
   │
   ▼
HTML
   │
   ▼
JavaScript
   │
   ▼
WebAssembly
   │
   ▼
C++
   │
   ▼
Filtro escala de grises
   │
   ▼
JavaScript
   │
   ▼
Canvas
   │
   ▼
Imagen final
```

---

# Problemas encontrados durante el desarrollo

## PowerShell y Command Prompt

Se detectó que Emscripten funcionaba correctamente en Command Prompt (CMD), pero no siempre era reconocido desde PowerShell.

Para verificar la instalación:

```bash
emcc -v
```

Si aparece la versión de Emscripten, el entorno está correctamente configurado.

---

# Cómo ejecutar el proyecto

Abrir el proyecto mediante un servidor local.

Ejemplo:

```bash
python -m http.server 8000
```

Luego abrir:

```text
http://localhost:8000
```

Seleccionar una imagen y verificar que se convierta automáticamente a escala de grises.

---

# Conclusión

Este proyecto demuestra cómo integrar C++, WebAssembly y JavaScript para procesar imágenes en el navegador.

Además permite comprender conceptos importantes como:

* WebAssembly
* Emscripten
* Embind
* ABI
* Gestión de memoria
* Principios SOLID

sirviendo como base para futuros filtros de imágenes o aplicaciones de procesamiento más complejas.

