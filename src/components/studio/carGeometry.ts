import type { Model } from "@/lib/catalog";
import type { CategoryKey } from "@/lib/catalog";

export type V2 = [number, number];
export type V3 = [number, number, number];

export type BodySpec = {
  /** Side profile, x = length (front is +x), y = height */
  profile: V2[];
  /** Side window polygon (slightly inside the profile) */
  sideGlass: V2[];
  windshield: [V2, V2];
  rearGlass?: [V2, V2];
  width: number;
  front: number;
  rear: number;
  wheelR: number;
  wheels: [number, number]; // front x, rear x
  hood: [V2, V2];
  roofY: number;
  bed?: { x0: number; x1: number; y: number }; // pickup bed opening
};

export const BODIES: Record<Model["body"], BodySpec> = {
  sedan: {
    profile: [[-2.2, 0.36], [-2.22, 0.84], [-1.72, 0.96], [-1.3, 0.99], [-0.7, 1.42], [0.35, 1.43], [1.0, 1.0], [2.05, 0.88], [2.22, 0.7], [2.2, 0.36]],
    sideGlass: [[-1.2, 1.02], [-0.68, 1.37], [0.32, 1.38], [0.9, 1.03]],
    windshield: [[0.35, 1.43], [1.0, 1.0]],
    rearGlass: [[-1.3, 0.99], [-0.7, 1.42]],
    width: 1.8, front: 2.22, rear: -2.22, wheelR: 0.34, wheels: [1.35, -1.35], hood: [[1.0, 1.0], [2.05, 0.88]], roofY: 1.43,
  },
  suv: {
    profile: [[-2.2, 0.42], [-2.22, 1.05], [-2.14, 1.66], [-1.9, 1.73], [0.45, 1.73], [1.05, 1.13], [2.1, 1.02], [2.27, 0.8], [2.25, 0.42]],
    sideGlass: [[-2.02, 1.16], [-1.92, 1.63], [0.42, 1.66], [0.98, 1.15]],
    windshield: [[0.45, 1.73], [1.05, 1.13]],
    rearGlass: [[-2.22, 1.08], [-2.14, 1.64]],
    width: 1.86, front: 2.27, rear: -2.22, wheelR: 0.4, wheels: [1.4, -1.4], hood: [[1.05, 1.13], [2.1, 1.02]], roofY: 1.73,
  },
  hatch: {
    profile: [[-1.95, 0.36], [-2.0, 0.95], [-1.82, 1.4], [-1.6, 1.46], [0.2, 1.46], [0.85, 1.0], [1.85, 0.9], [2.0, 0.7], [1.98, 0.36]],
    sideGlass: [[-1.8, 1.02], [-1.7, 1.38], [0.18, 1.41], [0.78, 1.03]],
    windshield: [[0.2, 1.46], [0.85, 1.0]],
    rearGlass: [[-2.0, 0.97], [-1.82, 1.4]],
    width: 1.74, front: 2.0, rear: -2.0, wheelR: 0.33, wheels: [1.25, -1.25], hood: [[0.85, 1.0], [1.85, 0.9]], roofY: 1.46,
  },
  pickup: {
    profile: [[-2.5, 0.48], [-2.5, 1.08], [-0.62, 1.08], [-0.62, 1.76], [-0.45, 1.82], [0.4, 1.82], [1.0, 1.22], [2.2, 1.1], [2.36, 0.86], [2.35, 0.48]],
    sideGlass: [[-0.56, 1.14], [-0.46, 1.74], [0.37, 1.76], [0.93, 1.22]],
    windshield: [[0.4, 1.82], [1.0, 1.22]],
    width: 1.86, front: 2.36, rear: -2.5, wheelR: 0.41, wheels: [1.5, -1.6], hood: [[1.0, 1.22], [2.2, 1.1]], roofY: 1.82,
    bed: { x0: -2.42, x1: -0.7, y: 1.08 },
  },
};

/** Where each category's clickable pin floats around the car */
export function pinPositions(b: BodySpec): Record<CategoryKey, V3> {
  const hw = b.width / 2;
  const [h0, h1] = b.hood;
  const hoodMid: V2 = [(h0[0] + h1[0]) / 2, (h0[1] + h1[1]) / 2];
  const cabinX = (b.windshield[0][0] + (b.rearGlass?.[1][0] ?? b.windshield[0][0] - 1)) / 2;
  return {
    engine: [hoodMid[0], hoodMid[1] + 0.32, 0.25],
    filters: [hoodMid[0] - 0.2, hoodMid[1] + 0.28, -0.45],
    electrical: [h0[0] + 0.15, h0[1] + 0.3, -hw + 0.1],
    cooling: [b.front + 0.22, 0.62, 0],
    lighting: [b.front + 0.05, 0.86, hw - 0.18],
    brakes: [b.wheels[0], b.wheelR, hw + 0.32],
    suspension: [b.wheels[1], b.wheelR * 2 + 0.2, hw + 0.2],
    transmission: [0.1, 0.22, hw + 0.25],
    body: [b.rear + 0.35, 0.95, hw + 0.15],
    interior: [cabinX, b.roofY - 0.25, hw + 0.2],
  };
}
