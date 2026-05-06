/**
 * Resizes a base64 image if it exceeds a certain size.
 */
export async function resizeImageIfNeeded(base64Data: string, mimeType: string, maxSizeMB: number = 3.5): Promise<string> {
  // Estimation: base64 is ~1.37x larger than the binary data
  const estimatedSizeMB = (base64Data.length * 0.75) / (1024 * 1024);
  
  if (estimatedSizeMB <= maxSizeMB) {
    return base64Data;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `data:${mimeType};base64,${base64Data}`;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate scale factor to get roughly the target size
      // We aim for a bit less than max to be safe
      const scale = Math.sqrt(maxSizeMB / estimatedSizeMB) * 0.9;
      width *= scale;
      height *= scale;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Data);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const resizedBase64 = canvas.toDataURL(mimeType, 0.8).split(',')[1];
      resolve(resizedBase64);
    };
    img.onerror = (err) => resolve(base64Data);
  });
}
