const componentToHex = (value) => value.toString(16).padStart(2, "0");

const rgbToHex = (red, green, blue) =>
  `#${componentToHex(red)}${componentToHex(green)}${componentToHex(blue)}`;

export const extractDominantColorFromImage = (imageUrl) =>
  new Promise((resolve, reject) => {
    if (!imageUrl) {
      reject(new Error("No hay imagen para analizar."));
      return;
    }

    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 80;
        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext("2d", { willReadFrequently: true });
        context.drawImage(image, 0, 0, size, size);

        const { data } = context.getImageData(0, 0, size, size);
        const buckets = new Map();

        for (let index = 0; index < data.length; index += 16) {
          const alpha = data[index + 3];
          if (alpha < 180) continue;

          const red = data[index];
          const green = data[index + 1];
          const blue = data[index + 2];
          const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
          const saturation = Math.max(red, green, blue) - Math.min(red, green, blue);

          if (brightness < 35 || brightness > 235 || saturation < 24) continue;

          const bucket = `${Math.round(red / 24) * 24},${Math.round(green / 24) * 24},${Math.round(blue / 24) * 24}`;
          buckets.set(bucket, (buckets.get(bucket) || 0) + saturation);
        }

        const [winner] = [...buckets.entries()].sort((a, b) => b[1] - a[1])[0] || [];
        if (!winner) {
          resolve("#00c979");
          return;
        }

        const [red, green, blue] = winner.split(",").map((value) => Math.max(0, Math.min(255, Number(value))));
        resolve(rgbToHex(red, green, blue));
      } catch {
        reject(new Error("No pude leer los colores de esa imagen. Probablemente la URL bloquea CORS."));
      }
    };

    image.onerror = () => reject(new Error("No pude cargar la imagen para leer el color."));
    image.src = imageUrl;
  });
