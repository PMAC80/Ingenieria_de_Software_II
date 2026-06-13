Module.onRuntimeInitialized = () => {

    const processor =
        new Module.ImageProcessor();

    const fileInput =
        document.getElementById("file");

    const canvas =
        document.getElementById("canvas");

    const ctx =
        canvas.getContext("2d");

    fileInput.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            const img =
                new Image();

            img.onload = () => {

                canvas.width =
                    img.width;

                canvas.height =
                    img.height;

                ctx.drawImage(
                    img,
                    0,
                    0
                );

                const imageData =
                    ctx.getImageData(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                processor.process(
                    imageData.data
                );

                ctx.putImageData(
                    imageData,
                    0,
                    0
                );
            };

            img.src =
                URL.createObjectURL(file);
        }
    );
};