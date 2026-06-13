#include <emscripten/bind.h>
#include <cstdint>
#include <vector>

using namespace emscripten;

class IImageFilter {
public:
    virtual ~IImageFilter() = default;

    virtual void apply(
        uint8_t& r,
        uint8_t& g,
        uint8_t& b
    ) const = 0;
};

class GrayscaleFilter : public IImageFilter {
public:

    void apply(
        uint8_t& r,
        uint8_t& g,
        uint8_t& b
    ) const override {

        uint8_t gray =
            (r * 0.3) +
            (g * 0.59) +
            (b * 0.11);

        r = gray;
        g = gray;
        b = gray;
    }
};

class ImageProcessor {

public:

    void process(val jsPixels) {

        std::vector<uint8_t> pixels =
            vecFromJSArray<uint8_t>(jsPixels);

        GrayscaleFilter filter;

        for(size_t i = 0; i < pixels.size(); i += 4) {

            filter.apply(
                pixels[i],
                pixels[i + 1],
                pixels[i + 2]
            );
        }

        jsPixels.call<void>(
            "set",
            val::array(pixels)
        );
    }
};

EMSCRIPTEN_BINDINGS(image_module) {

    class_<ImageProcessor>("ImageProcessor")
        .constructor<>()
        .function(
            "process",
            &ImageProcessor::process
        );
}