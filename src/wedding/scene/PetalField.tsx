import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { createPetals, stepPetal, PETAL_COLORS, type PetalBounds } from "./petals";

export const DEFAULT_BOUNDS: PetalBounds = {
  minX: -9,
  maxX: 9,
  minY: -5.5,
  maxY: 5.5,
  minZ: -4,
  maxZ: 2,
};

function petalGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.5);
  shape.bezierCurveTo(0.42, 0.42, 0.5, -0.15, 0, -0.5);
  shape.bezierCurveTo(-0.5, -0.15, -0.42, 0.42, 0, 0.5);
  return new THREE.ShapeGeometry(shape, 6);
}

export function PetalField({
  count = 64,
  bounds = DEFAULT_BOUNDS,
}: {
  count?: number;
  bounds?: PetalBounds;
}) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const petals = useMemo(() => createPetals(count, bounds), [count, bounds]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const geometry = useMemo(petalGeometry, []);

  useEffect(() => {
    petals.forEach((p, i) => {
      tmpColor.set(PETAL_COLORS[p.colorIndex]);
      ref.current.setColorAt(i, tmpColor);
    });
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [petals, tmpColor]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    for (let i = 0; i < petals.length; i++) {
      const s = stepPetal(petals[i], t, dt, bounds);
      dummy.position.set(s.x, s.y, s.z);
      dummy.rotation.set(s.rotX, 0, s.rotZ);
      dummy.scale.setScalar(s.size);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[geometry, undefined, count]} frustumCulled={false}>
      <meshStandardMaterial
        side={THREE.DoubleSide}
        transparent
        opacity={0.92}
        roughness={0.5}
        metalness={0.05}
      />
    </instancedMesh>
  );
}
