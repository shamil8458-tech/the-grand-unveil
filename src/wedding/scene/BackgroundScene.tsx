import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { PetalField } from "./PetalField";
import { TiltGroup } from "./Tilt";
import { pointer, tilt } from "./input";
import { bus } from "./bus";

function Hearts({ count = 8 }: { count?: number }) {
  const group = useRef<THREE.Group>(null!);

  const data = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        baseX: -6 + (i / count) * 12 + (Math.random() - 0.5) * 2,
        baseY: -1.5 + Math.random() * 4,
        z: -2 + Math.random() * 2.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.5,
        size: 0.5 + Math.random() * 0.5,
      })),
    [count],
  );

  const geometry = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.3);
    s.bezierCurveTo(0, 0.5, 0.45, 0.5, 0.45, 0.25);
    s.bezierCurveTo(0.45, 0.02, 0.2, -0.1, 0, -0.32);
    s.bezierCurveTo(-0.2, -0.1, -0.45, 0.02, -0.45, 0.25);
    s.bezierCurveTo(-0.45, 0.5, 0, 0.5, 0, 0.3);
    return new THREE.ExtrudeGeometry(s, {
      depth: 0.09,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    data.forEach((h, i) => {
      const mesh = group.current.children[i];
      mesh.position.y = h.baseY + Math.sin(t * h.speed + h.phase) * 0.55;
      mesh.position.x = h.baseX + Math.sin(t * h.speed * 0.6 + h.phase * 1.7) * 0.4;
      mesh.rotation.y = Math.sin(t * 0.4 + h.phase) * 0.6;
      mesh.rotation.z = Math.sin(t * 0.5 + h.phase) * 0.22;
    });
  });

  return (
    <group ref={group}>
      {data.map((h, i) => (
        <mesh key={i} geometry={geometry} position={[h.baseX, h.baseY, h.z]} scale={h.size}>
          <meshStandardMaterial
            color="#d4af6a"
            metalness={0.75}
            roughness={0.22}
            emissive="#c9a24d"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

const BURST_COUNT = 180;
const BURST_LIFE = 2.4;

function Burst() {
  const ref = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.PointsMaterial>(null!);
  const vel = useRef(new Float32Array(BURST_COUNT * 3));
  const life = useRef(0);

  const { geometry, sprite } = useMemo(() => {
    const colors = new Float32Array(BURST_COUNT * 3);
    const palette = ["#d4af6a", "#e8b4b8", "#dfe5d0", "#f5e6d8", "#c9a24b"].map(
      (c) => new THREE.Color(c),
    );
    for (let i = 0; i < BURST_COUNT; i++) {
      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(BURST_COUNT * 3), 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const cnv = document.createElement("canvas");
    cnv.width = cnv.height = 64;
    const g = cnv.getContext("2d")!;
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.8)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return { geometry: geo, sprite: new THREE.CanvasTexture(cnv) };
  }, []);

  useEffect(
    () =>
      bus.onBurst(() => {
        const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
        for (let i = 0; i < BURST_COUNT; i++) {
          pos.setXYZ(i, 0, 0.4, 1.5);
          const angle = Math.random() * Math.PI * 2;
          const elevation = Math.random() * Math.PI * 0.5;
          const speed = 2.5 + Math.random() * 3.5;
          vel.current[i * 3] = Math.cos(angle) * Math.cos(elevation) * speed;
          vel.current[i * 3 + 1] = Math.sin(elevation) * speed * 1.3;
          vel.current[i * 3 + 2] = Math.sin(angle) * Math.cos(elevation) * speed * 0.6;
        }
        pos.needsUpdate = true;
        life.current = BURST_LIFE;
        ref.current.visible = true;
        if (matRef.current) matRef.current.opacity = 1;
      }),
    [geometry],
  );

  useFrame((_, delta) => {
    if (life.current <= 0) return;
    const dt = Math.min(delta, 0.05);
    life.current -= dt;
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    const drag = Math.exp(-1.4 * dt);
    for (let i = 0; i < BURST_COUNT; i++) {
      vel.current[i * 3 + 1] -= 2.6 * dt;
      vel.current[i * 3] *= drag;
      vel.current[i * 3 + 1] *= drag;
      vel.current[i * 3 + 2] *= drag;
      pos.setXYZ(
        i,
        pos.getX(i) + vel.current[i * 3] * dt,
        pos.getY(i) + vel.current[i * 3 + 1] * dt,
        pos.getZ(i) + vel.current[i * 3 + 2] * dt,
      );
    }
    pos.needsUpdate = true;
    matRef.current.opacity = Math.max(0, life.current / BURST_LIFE);
    if (life.current <= 0) ref.current.visible = false;
  });

  return (
    <points ref={ref} geometry={geometry} visible={false}>
      <pointsMaterial
        ref={matRef}
        size={0.18}
        map={sprite}
        transparent
        vertexColors
        depthWrite={false}
        opacity={1}
      />
    </points>
  );
}

function ReadySignal() {
  useEffect(() => {
    document.querySelector("[data-scene-root]")?.setAttribute("data-scene-ready", "");
  }, []);
  return null;
}

export default function BackgroundScene() {
  const isMobile = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches,
    [],
  );

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      performance={{ min: 0.5 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={0.75} color="#fff3e2" />
      <Environment resolution={64}>
        <Lightformer intensity={1.2} position={[0, 5, 0]} scale={[10, 10, 1]} color="#fff2df" />
        <Lightformer
          intensity={0.6}
          position={[-5, 1, -1]}
          rotation-y={Math.PI / 2}
          scale={[20, 1, 1]}
          color="#e8d5c0"
        />
        <Lightformer
          intensity={0.4}
          position={[5, -1, 0]}
          rotation-y={-Math.PI / 2}
          scale={[20, 1, 1]}
          color="#dfe5d0"
        />
      </Environment>
      <TiltGroup>
        <PetalField count={isMobile ? 42 : 72} />
        <Hearts count={isMobile ? 5 : 8} />
      </TiltGroup>
      <Sparkles
        count={isMobile ? 30 : 50}
        scale={[16, 10, 6]}
        size={2.5}
        speed={0.3}
        color="#d4af6a"
        opacity={0.55}
      />
      <Burst />
      <ReadySignal />
    </Canvas>
  );
}
