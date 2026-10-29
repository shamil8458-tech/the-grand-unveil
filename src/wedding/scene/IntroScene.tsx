import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { PetalField } from "./PetalField";
import { TiltGroup } from "./Tilt";
import { enableGyroscope } from "./input";
import { useContent, weddingDate, type WeddingContent } from "../content";

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

function drawCard(
  canvas: HTMLCanvasElement,
  first: string,
  second: string,
  date: Date,
) {
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fffdf6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#c9a24b";
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
  ctx.strokeStyle = "rgba(201,162,75,0.45)";
  ctx.lineWidth = 1;
  ctx.strokeRect(52, 52, canvas.width - 104, canvas.height - 104);

  ctx.textAlign = "center";
  ctx.fillStyle = "#8a7a5c";
  ctx.font = "26px 'Cormorant Garamond', Georgia, serif";
  ctx.fillText("Y O U   A R E   C O R D I A L L Y   I N V I T E D", canvas.width / 2, 175);

  ctx.fillStyle = "#4a4132";
  ctx.font = "108px 'Great Vibes', 'Snell Roundhand', cursive";
  ctx.fillText(`${first} & ${second}`, canvas.width / 2, 340);

  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  ctx.fillStyle = "#c9a24b";
  ctx.font = "36px 'Cormorant Garamond', Georgia, serif";
  ctx.fillText(`${m} · ${d} · ${date.getFullYear()}`, canvas.width / 2, 440);

  // small flourish diamond
  ctx.fillStyle = "rgba(201,162,75,0.9)";
  ctx.save();
  ctx.translate(canvas.width / 2, 500);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-7, -7, 14, 14);
  ctx.restore();
}

function useCardTexture(first: string, second: string, date: Date) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    drawCard(canvas, first, second, date);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, [first, second, date]);

  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => {
      if (!alive) return;
      drawCard(texture.image as HTMLCanvasElement, first, second, date);
      texture.needsUpdate = true;
    });
    return () => {
      alive = false;
    };
  }, [texture, first, second, date]);

  return texture;
}

function Envelope({
  content,
  onOpenComplete,
}: {
  content: WeddingContent;
  onOpenComplete: () => void;
}) {
  const group = useRef<THREE.Group>(null!);
  const flap = useRef<THREE.Group>(null!);
  const seal = useRef<THREE.Group>(null!);
  const card = useRef<THREE.Mesh>(null!);
  const light = useRef<THREE.PointLight>(null!);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const phase = useRef({ opening: false, t: 0, done: false });

  // Keep the envelope inside the frame on narrow (phone) screens.
  const aspect = size.width / Math.max(1, size.height);
  const envelopeScale = Math.min(1, (5.0 * aspect) / 4.2);

  const date = useMemo(() => weddingDate(content), [content]);
  const cardTexture = useCardTexture(content.first, content.second, date);

  const start = () => {
    if (phase.current.opening) return;
    phase.current.opening = true;
    void enableGyroscope();
  };

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const p = phase.current;

    if (!p.opening) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
      const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 2.2) * 0.5;
      if (light.current) light.current.intensity = 1.1 + pulse * 1.5;
      if (seal.current) {
        seal.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.02);
      }
    }

    if (p.opening && !p.done) {
      p.t = Math.min(1, p.t + dt / 3.0);
      const t = p.t;

      flap.current.rotation.x = 2.3 * easeInOut(clamp01((t - 0.08) / 0.42));

      const sealU = 1 - clamp01(t / 0.25);
      seal.current.scale.setScalar(Math.max(0.001, sealU));
      seal.current.visible = sealU > 0.01;
      if (light.current) light.current.intensity = 1.1 * sealU;

      const cardU = easeInOut(clamp01((t - 0.35) / 0.45));
      card.current.position.y = -0.15 + cardU * 2.35;

      const camU = easeInOut(clamp01((t - 0.5) / 0.5));
      camera.position.z = 6.5 - camU * 1.6;
      camera.position.y = 0.4 - camU * 0.25;
      camera.lookAt(0, 0.2, 0);

      if (t >= 1) {
        p.done = true;
        onOpenComplete();
      }
    }
  });

  const flapShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.7, 0);
    s.lineTo(1.7, 0);
    s.lineTo(0, -1.32);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: false });
  }, []);

  const pocketShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.7, 1.15);
    s.lineTo(0.05, -0.05);
    s.lineTo(1.7, 1.15);
    s.lineTo(1.7, -1.15);
    s.lineTo(-1.7, -1.15);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: false });
  }, []);

  const heartShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.3);
    s.bezierCurveTo(0, 0.5, 0.45, 0.5, 0.45, 0.25);
    s.bezierCurveTo(0.45, 0.02, 0.2, -0.1, 0, -0.32);
    s.bezierCurveTo(-0.2, -0.1, -0.45, 0.02, -0.45, 0.25);
    s.bezierCurveTo(-0.45, 0.5, 0, 0.5, 0, 0.3);
    return new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: false });
  }, []);

  return (
    <group
      ref={group}
      scale={envelopeScale}
      onPointerDown={start}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      {/* back panel */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[3.4, 2.3, 0.06]} />
        <meshStandardMaterial color="#f7ead9" roughness={0.7} />
      </mesh>

      {/* invitation card (slides up when opened) */}
      <mesh ref={card} position={[0, -0.15, 0.02]}>
        <boxGeometry args={[3.0, 1.85, 0.02]} />
        <meshStandardMaterial attach="material-0" color="#fffdf6" roughness={0.7} />
        <meshStandardMaterial attach="material-1" color="#fffdf6" roughness={0.7} />
        <meshStandardMaterial attach="material-2" color="#fffdf6" roughness={0.7} />
        <meshStandardMaterial attach="material-3" color="#fffdf6" roughness={0.7} />
        <meshStandardMaterial attach="material-4" map={cardTexture} roughness={0.7} />
        <meshStandardMaterial attach="material-5" color="#fffdf6" roughness={0.7} />
      </mesh>

      {/* front pocket */}
      <mesh geometry={pocketShape} position={[0, 0, 0.05]}>
        <meshStandardMaterial color="#f4e6d2" roughness={0.65} />
      </mesh>

      {/* flap with wax seal */}
      <group ref={flap} position={[0, 1.15, -0.03]}>
        <mesh geometry={flapShape}>
          <meshStandardMaterial color="#f2e2cc" roughness={0.65} />
        </mesh>
        <group ref={seal} position={[0, -0.95, 0.06]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.34, 0.36, 0.07, 32]} />
            <meshStandardMaterial
              color="#c9a24b"
              metalness={0.65}
              roughness={0.3}
              emissive="#8a6b1f"
              emissiveIntensity={0.35}
            />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <torusGeometry args={[0.26, 0.02, 12, 40]} />
            <meshStandardMaterial color="#b08d3e" metalness={0.7} roughness={0.28} />
          </mesh>
          <mesh geometry={heartShape} position={[0, 0.02, 0.07]} scale={0.42}>
            <meshStandardMaterial color="#a9822f" metalness={0.6} roughness={0.35} />
          </mesh>
          <pointLight
            ref={light}
            position={[0, 0, 0.7]}
            color="#e9c25a"
            intensity={1.4}
            distance={4.5}
          />
        </group>
      </group>
    </group>
  );
}

export default function IntroScene({ onOpenComplete }: { onOpenComplete: () => void }) {
  const { content } = useContent();

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.4, 6.5], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      performance={{ min: 0.5 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={0.8} color="#fff3e2" />
      <Environment resolution={64}>
        <Lightformer intensity={1.1} position={[0, 5, 0]} scale={[10, 10, 1]} color="#fff2df" />
        <Lightformer
          intensity={0.5}
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
        <Envelope content={content} onOpenComplete={onOpenComplete} />
        <PetalField
          count={36}
          bounds={{ minX: -7, maxX: 7, minY: -4.5, maxY: 5.5, minZ: -3, maxZ: 1.5 }}
        />
      </TiltGroup>
      <Sparkles
        count={40}
        scale={[10, 7, 5]}
        size={2}
        speed={0.25}
        color="#d4af6a"
        opacity={0.7}
      />
    </Canvas>
  );
}
