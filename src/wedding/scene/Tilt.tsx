import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import * as THREE from "three";
import { pointer, tilt } from "./input";

// Gently rotates its children toward the pointer / device tilt.
export function TiltGroup({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    const k = 1 - Math.exp(-2.5 * Math.min(delta, 0.05));
    const tx = THREE.MathUtils.clamp(pointer.x * 0.6 + tilt.x * 0.4, -1, 1);
    const ty = THREE.MathUtils.clamp(pointer.y * 0.6 + tilt.y * 0.4, -1, 1);
    ref.current.rotation.y += (tx * 0.09 - ref.current.rotation.y) * k;
    ref.current.rotation.x += (-ty * 0.05 - ref.current.rotation.x) * k;
  });

  return <group ref={ref}>{children}</group>;
}
