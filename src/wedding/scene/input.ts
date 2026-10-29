// Shared pointer + device-tilt state, read by the 3D scenes every frame.
// Values are normalized to roughly -1..1.

export const pointer = { x: 0, y: 0 };
export const tilt = { x: 0, y: 0 };

let detach: (() => void) | null = null;

export function attachPointerTracking() {
  if (detach || typeof window === "undefined") return () => {};

  const onPointerMove = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  const onOrientation = (e: DeviceOrientationEvent) => {
    if (e.gamma == null || e.beta == null) return;
    // gamma: left/right tilt (-90..90), beta: front/back tilt (-180..180)
    tilt.x = Math.max(-1, Math.min(1, e.gamma / 35));
    tilt.y = Math.max(-1, Math.min(1, (e.beta - 45) / 35));
  };
  window.addEventListener("deviceorientation", onOrientation, true);

  detach = () => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("deviceorientation", onOrientation, true);
    detach = null;
  };
  return detach;
}

// iOS 13+ requires an explicit permission request from a user gesture.
export async function enableGyroscope(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const anyOrientation = window.DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<"granted" | "denied">;
  };
  try {
    if (typeof anyOrientation?.requestPermission === "function") {
      const result = await anyOrientation.requestPermission();
      return result === "granted";
    }
    return typeof window.DeviceOrientationEvent !== "undefined";
  } catch {
    return false;
  }
}
