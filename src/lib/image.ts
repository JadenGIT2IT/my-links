const MAX_INPUT_BYTES = 10 * 1024 * 1024;
const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 0.88;

export async function processAvatarImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("Image must be 10MB or smaller.");
  }

  const source = await loadImage(file);
  const { width, height } = fitWithinBounds(
    source.naturalWidth,
    source.naturalHeight,
    MAX_DIMENSION
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not process this image.");
  }

  context.drawImage(source, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load this image."));
    };

    image.src = url;
  });
}

function fitWithinBounds(
  width: number,
  height: number,
  maxDimension: number
): { width: number; height: number } {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }

  const scale = maxDimension / Math.max(width, height);
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}
