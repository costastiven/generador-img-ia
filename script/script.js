
/* Utilizamos la api key de esta web

https://huggingface.co/

El motor que se utilizara para generar las imagenes es openjoruney

https://api-inference.huggingface.co/models/prompthero/openjourney

*/

const apiKey = "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";

const maxImages = 4; // Número de imágenes a generar para cada mensaje
let selectedImageNumber = null;

// Función para generar un número aleatorio entre mínimo y máximo (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para desactivar el botón generar durante el procesamiento
function disableGenerateButton() {
    document.getElementById("generate").disabled = true;
}

// Función para habilitar el botón generar después del proceso
function enableGenerateButton() {
    document.getElementById("generate").disabled = false;
}

// Función para borrar la cuadrícula de imágenes
function clearImageGrid() {
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}

// Función para generar imágenes
async function generateImages(input) {
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];

    for (let i = 0; i < maxImages; i++) {
        // Genera un número aleatorio entre 1 y 10000 y lo agrega al mensaje
        const randomNumber = getRandomNumber(1, 10000);
        const prompt = `${input} ${randomNumber}`;
        // Agregamos un número aleatorio para solicitar crear resultados diferentes
        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );

        if (!response.ok) {
            alert("Failed to generate image!");
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }

    loading.style.display = "none";
    enableGenerateButton();

    selectedImageNumber = null; // Restablecer el número de imagen seleccionada
}

document.getElementById("generate").addEventListener('click', () => {
    const input = document.getElementById("user-prompt").value;
    generateImages(input);
});

function downloadImage(imgUrl, imageNumber) {
    const link = document.createElement("a");
    link.href = imgUrl;
    // Establece el nombre del archivo según la imagen seleccionada
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}