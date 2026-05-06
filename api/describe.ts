import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, mimeType } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured in Vercel environment variables." });
    }

    const genAI = new GoogleGenAI({ apiKey });
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Perform an EXHAUSTIVE, FORENSIC-LEVEL, ULTRA-LONG investigation of this image for a RAW photographic reconstruction. 
    You are an expert at identifying the "boring reality" of a scene. 
    The resulting text must be a massive, dense block of descriptive data, exceeding 500 words (aim for 1500-2000 characters).
    
    MANDATORY DATA POINTS TO INCLUDE IN EXTREME DETAIL:
    1. EXACT CAMERA PERSPECTIVE: Identify the hardware point of view. Is it chest-height, slightly tilted, or held at arm's length? Describe the specific barrel distortion of a 24-26mm smartphone lens.
    2. CHARACTER POSE & BIOMETRICS: Map the exact positioning of the skeletal structure. Describe the weight distribution, the specific tension in the neck, the angle of the shoulders, and the precise placement of every finger. Note the natural, unposed "slouch" or stiffness. 
    3. FACIAL TOPOGRAPHY: Describe the skin surface in raw detail—pores, micro-sweat, oiliness, specific texture of imperfections, stray facial hairs, and the complex, authentic micro-expressions that signify a real human moment rather than a posed one.
    4. CLOTHING & MATERIAL SCIENCE: Describe the fabric weave, the specific way it wrinkles at joints, any visible lint, pilling, or slight discoloration.
    5. ENVIRONMENTAL FORENSICS: Document the background with zero neglect. Identify cables, power outlets, scuffed floorboards, dust on shelves, the specific "mess" of shadows in corners, and the unpolished clutter of a real, lived-in environment.
    6. LIGHTING PHYSICS: Describe the raw light—harsh ceiling bulbs, flat grey window light, or the uneven yellow cast of a desk lamp. Note digital noise (ISO grain) in the darker segments.

    STRICT CONSTRAINT: No artistic buzzwords. No "cinematic," "masterpiece," or "ethereal." Use only raw, physical, physical, unpolished descriptive language. 
    If you see a character, describe their pose and angle relative to the lens with surgical precision.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: image,
          mimeType: mimeType
        }
      }
    ]);

    const response = await result.response;
    res.json({ description: response.text() });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to process image analysis." });
  }
}
