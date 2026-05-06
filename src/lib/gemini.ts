// Gemini Logic moved to server-side for security.
export async function describeImage(base64Data: string, mimeType: string): Promise<string> {
  const response = await fetch('/api/describe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Data, mimeType })
  });

  if (!response.ok) {
    let errorMessage = 'Failed to analyze image';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      errorMessage = `Server Error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.description || "Analysis failed.";
}

export function buildPrompt(description: string, aspectRatio: string = "1:1"): string {
  const technicalAdditions = [
    "Unedited raw photo",
    "candid natural amateur shot",
    "messy background in sharp focus",
    "amateur snap from a casual observer",
    "Captured on a standard entry-level smartphone camera with a slightly smudged lens",
    "budget mobile phone photography aesthetics",
    "digital sensor noise in the shadows",
    "fixed focal length",
    "f/11 aperture ensuring deep depth of field",
    "The Boring Reality of the moment",
    "harsh unmanipulated natural shadows",
    "flat and clinical illumination",
    "Zero post-processing, Zero filters, Zero color grading",
    "Low color saturation",
    "disposable camera aesthetic with slight color shifts",
    "authentic point-and-shoot vibe",
    "Everything in the frame is completely and sharply in focus",
    "Micro-imperfections everywhere",
    "everyday messy aesthetic including clutter and background noise",
    "noticeable JPEG compression artifacts typical of a quick social media upload",
    "unpolished texture with no smoothing",
    "raw unedited digital asset",
    "badly framed amateur photo showing parts of the environment that are usually cropped out",
    "no artistic intent",
    "pure physical documentation",
    "natural lens flare from cheap optics",
    "faint chromatic aberration at the edges of high-contrast objects",
    "realistic casual photography",
    "no aesthetic enhancements",
    "authentic surveillance camera vibe",
    "untouched frame",
    "natural lens distortion in the corners",
    "overexposed highlight clipping",
    "grainy texture",
    "mundane everyday life"
  ];

  return `${description.trim()}. ${aspectRatio} aspect ratio. Raw Realistic candid natural amateur photo, background in focus, amateur candid photography, Captured on iPhone 17 Pro, amateur candid smartphone photography, 24mm lens, f/8, Boring reality, natural soft shadows, candid snapshot, flat natural lighting, Realism, low contrast, disposable camera vibe, casual photography, background also completely in focus, Tiny imperfections, everyday aesthetic, slight JPEG artifacts, unpolished look, unedited, imperfect amateur photo. Only create real, non fictional images for max effect. ${technicalAdditions.join(", ")} --ar ${aspectRatio} --style raw --v 6.0`;
}
