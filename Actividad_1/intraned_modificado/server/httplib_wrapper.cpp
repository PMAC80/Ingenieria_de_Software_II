// Wrapper translation unit to compile httplib header into a shared library
#include "include/httplib.h"

extern "C" void __init_httplib_wrapper() {
    // Intentionally empty: ensures the translation unit emits symbols for httplib
}
