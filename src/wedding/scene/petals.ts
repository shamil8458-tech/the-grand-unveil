// Pure TypeScript petal simulation — no React, no three.js.
// The scene reads this state each frame and writes it into matrices.

export interface Petal {
  baseX: number;
  y: number;
  z: number;
  fallSpeed: number;
  phase: number;
  swayAmp: number;
  swaySpeed: number;
  rotSpeedX: number;
  rotSpeedZ: number;
  size: number;
  colorIndex: number;
}

export interface PetalBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

export const PETAL_COLORS = ["#f3c9c9", "#e8b4b8", "#dfe5d0", "#e6d3a3", "#f5e6d8"];

export function createPetals(count: number, bounds: PetalBounds): Petal[] {
  const petals: Petal[] = [];
  for (let i = 0; i < count; i++) {
    petals.push({
      baseX: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
      y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY),
      z: bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ),
      fallSpeed: 0.35 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
      swayAmp: 0.4 + Math.random() * 0.8,
      swaySpeed: 0.3 + Math.random() * 0.5,
      rotSpeedX: (Math.random() - 0.5) * 1.6,
      rotSpeedZ: (Math.random() - 0.5) * 1.2,
      size: 0.16 + Math.random() * 0.22,
      colorIndex: Math.floor(Math.random() * PETAL_COLORS.length),
    });
  }
  return petals;
}

// Advances one petal; wraps vertically so petals never run out.
export function stepPetal(p: Petal, t: number, dt: number, bounds: PetalBounds) {
  p.y -= p.fallSpeed * dt;
  if (p.y < bounds.minY) {
    p.y = bounds.maxY;
    p.baseX = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
  }
  const swayX = Math.sin(t * p.swaySpeed + p.phase) * p.swayAmp;
  return {
    x: p.baseX + swayX,
    y: p.y,
    z: p.z,
    rotX: t * p.rotSpeedX + p.phase,
    rotZ: t * p.rotSpeedZ + p.phase * 0.7,
    size: p.size,
  };
}
