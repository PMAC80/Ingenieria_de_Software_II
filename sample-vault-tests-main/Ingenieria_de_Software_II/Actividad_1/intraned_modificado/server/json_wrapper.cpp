// Wrapper translation unit to compile nlohmann::json header into a shared library
#include "include/json.hpp"

using json = nlohmann::json;

extern "C" void __init_json_wrapper() {
    // Intentionally empty: forces template instantiation units if needed
}
