/**
 * Realistic 3D car models (glTF / GLB) used by the studio.
 *
 * Put an optimised .glb in /public/models/cars/ and register it here with its
 * key "brand/model" (same keys as catalog.ts). Models not listed here fall back
 * to the procedural car for their body type.
 *
 * Every entry must be commercially usable (CC-BY, CC0 or Sketchfab "Free Standard")
 * and CC-BY models must keep their credit — it is displayed in the studio.
 */
export type CarModelAsset = {
  file: string;
  /** Extra rotation (radians, around Y) so the car's nose points to +X */
  yaw?: number;
  /** Material names (regex) that receive the paint colour picker */
  paint?: RegExp;
  credit: { title: string; author: string; url: string; license: string };
};

export const CAR_MODELS: Record<string, CarModelAsset> = {
  // "chery/tiggo-7-pro": {
  //   file: "/models/cars/chery-tiggo-7-pro.glb",
  //   yaw: 0,
  //   credit: { title: "2023 Chery Tiggo 7 Pro", author: "…", url: "https://sketchfab.com/3d-models/…", license: "CC BY 4.0" },
  // },
};

export function carModelFor(brand: string, model: string) {
  return CAR_MODELS[`${brand}/${model}`];
}
