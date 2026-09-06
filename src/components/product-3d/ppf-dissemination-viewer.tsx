"use client";

/* eslint-disable react-hooks/immutability */

import { Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Box3,
  CatmullRomCurve3,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  Object3D,
  Vector3,
} from "three";

export type PpfDemoPhase =
  | "handoff"
  | "dispersal"
  | "breeding"
  | "transfer"
  | "blocked"
  | "complete";

type Props = {
  runSignal: number;
  onPhaseChange?: (phase: PpfDemoPhase) => void;
  onComplete?: () => void;
};

const MODEL_URL = "/models/mosguardx/web.gltf";
const DEVICE_POSITION = new Vector3(-3.3, 1.15, 0);
const TOTAL_SECONDS = 22;
const MOSQUITO_COUNT = 12;

function seeded(index: number, salt: number) {
  const value = Math.sin(index * 9127.17 + salt * 173.31) * 43758.5453;
  return value - Math.floor(value);
}

function prepareDevice(source: Object3D) {
  const root = source.clone(true) as Group;
  root.name = "MGX_PPF_Handoff_Device";
  root.rotateY(Math.PI);
  root.updateMatrixWorld(true);

  const initialBounds = new Box3().setFromObject(root);
  const center = initialBounds.getCenter(new Vector3());
  root.position.sub(center);
  root.updateMatrixWorld(true);

  const centeredBounds = new Box3().setFromObject(root);
  const dimensions = centeredBounds.getSize(new Vector3());
  const maxDimension = Math.max(dimensions.x, dimensions.y, dimensions.z) || 1;
  const scale = 2.7 / maxDimension;

  root.scale.setScalar(scale);
  root.updateMatrixWorld(true);

  const scaledBounds = new Box3().setFromObject(root);
  const localExit = new Vector3(
    scaledBounds.max.x + 0.1,
    scaledBounds.getCenter(new Vector3()).y + 0.13,
    0,
  );

  root.traverse((object) => {
    if (object instanceof Mesh) {
      object.castShadow = false;
      object.receiveShadow = false;
    }
  });

  return { root, localExit };
}

function MosquitoModel({ glow = true }: { glow?: boolean }) {
  return (
    <group>
      <mesh scale={[0.05, 0.15, 0.05]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial
          color={glow ? "#7c3aed" : "#111827"}
          emissive={glow ? "#6d28d9" : "#000000"}
          emissiveIntensity={glow ? 1.1 : 0}
          roughness={0.6}
        />
      </mesh>

      <mesh position={[-0.07, 0.01, 0]} rotation={[0, 0.15, 0.45]}>
        <planeGeometry args={[0.16, 0.08]} />
        <meshStandardMaterial
          color="#ddd6fe"
          transparent
          opacity={0.62}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0.07, 0.01, 0]} rotation={[0, -0.15, -0.45]}>
        <planeGeometry args={[0.16, 0.08]} />
        <meshStandardMaterial
          color="#ddd6fe"
          transparent
          opacity={0.62}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Swarm({
  progress,
  visible,
}: {
  progress: number;
  visible: boolean;
}) {
  const groupRefs = useRef<Array<Group | null>>([]);

  const path = useMemo(
    () =>
      new CatmullRomCurve3([
        // Start with a clean one-way handoff from the device exit.
        new Vector3(-1.9, 1.35, 0),
        new Vector3(-0.55, 1.34, 0.04),
        new Vector3(0.8, 1.30, 0.10),
        // Only after clearing the device does the swarm disperse naturally.
        new Vector3(2.4, 1.38, -0.28),
        new Vector3(3.8, 0.95, 0.15),
        new Vector3(4.75, 0.52, 0.15),
      ]),
    [],
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    groupRefs.current.forEach((group, index) => {
      if (!group) return;

      const delayedProgress = MathUtils.clamp(
        progress - (index / MOSQUITO_COUNT) * 0.055,
        0,
        1,
      );

      const point = path.getPoint(delayedProgress);
      const tangent = path.getTangent(delayedProgress).normalize();

      const orbit = time * (3.2 + seeded(index, 1) * 1.7) + index;
      point.x += Math.cos(orbit) * (0.08 + seeded(index, 2) * 0.1);
      point.y += Math.sin(orbit * 1.3) * (0.06 + seeded(index, 3) * 0.07);
      point.z += Math.sin(orbit) * (0.08 + seeded(index, 4) * 0.12);

      group.position.copy(point);
      group.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), tangent);
      group.rotation.z += Math.sin(orbit) * 0.015;
      group.visible = visible && delayedProgress > 0.002 && delayedProgress < 0.995;
    });
  });

  return (
    <group>
      {Array.from({ length: MOSQUITO_COUNT }).map((_, index) => (
        <group
          key={index}
          ref={(node) => {
            groupRefs.current[index] = node;
          }}
          scale={0.9 + seeded(index, 6) * 0.35}
        >
          <MosquitoModel />
        </group>
      ))}
    </group>
  );
}

function PpfParticles({ active }: { active: boolean }) {
  const refs = useRef<Array<Mesh | null>>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    refs.current.forEach((mesh, index) => {
      if (!mesh) return;
      mesh.visible = active;
      if (!active) return;

      const cycle = (t * 0.42 + seeded(index, 7)) % 1;
      mesh.position.set(
        4.35 + (seeded(index, 1) - 0.5) * 0.9,
        MathUtils.lerp(0.75, 0.08, cycle),
        0.1 + (seeded(index, 3) - 0.5) * 0.9,
      );
      const scale = 0.45 + Math.sin(cycle * Math.PI) * 0.6;
      mesh.scale.setScalar(scale);
    });
  });

  return (
    <group>
      {Array.from({ length: 26 }).map((_, index) => (
        <mesh
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
        >
          <sphereGeometry args={[0.025, 7, 5]} />
          <meshBasicMaterial color="#a855f7" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function BreedingSite({
  phase,
}: {
  phase: PpfDemoPhase;
}) {
  const showEggs =
    phase === "breeding" ||
    phase === "transfer" ||
    phase === "blocked" ||
    phase === "complete";
  const showLarvae =
    phase === "transfer" ||
    phase === "blocked" ||
    phase === "complete";
  const blocked = phase === "blocked" || phase === "complete";

  return (
    <group position={[4.55, 0, 0.12]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <circleGeometry args={[1.22, 48]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transparent
          opacity={0.64}
          roughness={0.18}
          metalness={0}
          transmission={0.12}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[1.15, 1.42, 48]} />
        <meshStandardMaterial color="#334c32" roughness={1} />
      </mesh>

      {showEggs &&
        Array.from({ length: 13 }).map((_, index) => {
          const angle = (index / 13) * Math.PI * 1.45 + 0.3;
          return (
            <mesh
              key={`egg-${index}`}
              position={[
                Math.cos(angle) * 0.87,
                0.08,
                Math.sin(angle) * 0.54,
              ]}
              rotation={[0, 0, angle]}
              scale={[0.018, 0.05, 0.018]}
            >
              <sphereGeometry args={[1, 7, 5]} />
              <meshStandardMaterial color="#1f2937" />
            </mesh>
          );
        })}

      {showLarvae &&
        Array.from({ length: 8 }).map((_, index) => (
          <mesh
            key={`larva-${index}`}
            position={[
              -0.58 + (index % 4) * 0.36,
              0.075,
              -0.24 + Math.floor(index / 4) * 0.45,
            ]}
            rotation={[
              Math.PI / 2,
              0,
              index % 2 === 0 ? 0.25 : -0.3,
            ]}
          >
            <cylinderGeometry args={[0.018, 0.012, 0.19, 7]} />
            <meshStandardMaterial
              color={blocked ? "#8b5cf6" : "#7c5c36"}
              emissive={blocked ? "#6d28d9" : "#000000"}
              emissiveIntensity={blocked ? 0.5 : 0}
            />
          </mesh>
        ))}

      {blocked && (
        <group position={[0, 0.62, 0]}>
          <mesh>
            <torusGeometry args={[0.36, 0.035, 12, 48]} />
            <meshBasicMaterial color="#c084fc" toneMapped={false} />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.7, 0.06, 0.06]} />
            <meshBasicMaterial color="#c084fc" toneMapped={false} />
          </mesh>
          <Html center position={[0, 0.58, 0]}>
            <div className="whitespace-nowrap rounded-full border border-violet-300/30 bg-violet-950/90 px-3 py-1.5 text-[10px] font-black tracking-[0.11em] text-violet-100 shadow-xl backdrop-blur-xl">
              ADULT EMERGENCE BLOCKED
            </div>
          </Html>
        </group>
      )}

      <Html center position={[0, 0.18, -1.42]}>
        <div className="whitespace-nowrap rounded-full border border-cyan-200/30 bg-[#07110e]/85 px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] text-cyan-100 shadow-xl backdrop-blur-xl">
          BREEDING WATER SITE
        </div>
      </Html>
    </group>
  );
}

function EnvironmentScene() {
  return (
    <>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.4, -0.035, 0]}>
        <planeGeometry args={[18, 10]} />
        <meshStandardMaterial color="#213b2b" roughness={1} />
      </mesh>

      {/* Yard path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.9, -0.012, 1.15]}>
        <planeGeometry args={[7.2, 1.25]} />
        <meshStandardMaterial color="#59645a" roughness={0.95} />
      </mesh>

      {/* House body */}
      <group position={[2.65, 0, -2.35]}>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[3.9, 2.4, 2.3]} />
          <meshStandardMaterial color="#d7ddd5" roughness={0.9} />
        </mesh>

        {/* roof */}
        <mesh position={[0, 2.63, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[2.55, 1.25, 4]} />
          <meshStandardMaterial color="#5f4637" roughness={0.95} />
        </mesh>

        {/* door */}
        <mesh position={[-0.55, 0.95, 1.17]}>
          <boxGeometry args={[0.72, 1.65, 0.08]} />
          <meshStandardMaterial color="#755b45" roughness={0.9} />
        </mesh>

        {/* windows */}
        {[-1.25, 0.8].map((x) => (
          <mesh key={x} position={[x, 1.45, 1.18]}>
            <boxGeometry args={[0.72, 0.72, 0.06]} />
            <meshStandardMaterial
              color="#6fb5c9"
              emissive="#0ea5e9"
              emissiveIntensity={0.08}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* MosGuardX pedestal */}
      <mesh position={[-3.3, 0.38, 0]}>
        <cylinderGeometry args={[0.38, 0.48, 0.76, 20]} />
        <meshStandardMaterial color="#3f4b43" roughness={0.95} />
      </mesh>

      {/* Shrubs / grass clumps */}
      {Array.from({ length: 26 }).map((_, index) => {
        const x = -1.4 + (index % 13) * 0.62;
        const z = -1.45 + Math.floor(index / 13) * 3.45 + (seeded(index, 4) - 0.5) * 0.55;

        return (
          <group
            key={index}
            position={[x, 0.02, z]}
            rotation={[0, seeded(index, 5) * Math.PI, 0]}
          >
            <mesh position={[0, 0.22, 0]} rotation={[0, 0, -0.12]}>
              <coneGeometry args={[0.07, 0.46, 5]} />
              <meshStandardMaterial color="#426b40" roughness={1} />
            </mesh>
            <mesh position={[0.10, 0.16, 0.02]} rotation={[0, 0, 0.18]}>
              <coneGeometry args={[0.05, 0.34, 5]} />
              <meshStandardMaterial color="#355a36" roughness={1} />
            </mesh>
          </group>
        );
      })}

      {/* Tree */}
      <group position={[6.0, 0, -1.75]}>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.16, 0.22, 1.8, 10]} />
          <meshStandardMaterial color="#634b35" roughness={1} />
        </mesh>
        <mesh position={[0, 2.0, 0]}>
          <sphereGeometry args={[0.95, 14, 10]} />
          <meshStandardMaterial color="#315f38" roughness={1} />
        </mesh>
      </group>

      {/* Low ambient yard lamps */}
      <group position={[0.5, 0, 1.55]}>
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.025, 0.035, 0.52, 8]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <pointLight position={[0, 0.62, 0]} intensity={1.8} distance={2.4} color="#d9f99d" />
      </group>

      <group position={[3.8, 0, 1.55]}>
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.025, 0.035, 0.52, 8]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <pointLight position={[0, 0.62, 0]} intensity={1.6} distance={2.2} color="#d9f99d" />
      </group>
    </>
  );
}

function Scene({
  runSignal,
  onPhaseChange,
  onComplete,
}: Props) {
  const { scene } = useGLTF(MODEL_URL);
  const prepared = useMemo(() => prepareDevice(scene), [scene]);
  const elapsed = useRef(0);
  const completed = useRef(false);
  const currentPhase = useRef<PpfDemoPhase>("handoff");
  const [renderPhase, setRenderPhase] = useState<PpfDemoPhase>("handoff");
  const [flightProgress, setFlightProgress] = useState(0);
  const { camera } = useThree();

  useEffect(() => {
    elapsed.current = 0;
    completed.current = false;
    currentPhase.current = "handoff";
    setRenderPhase("handoff");
    setFlightProgress(0);
    onPhaseChange?.("handoff");
  }, [onPhaseChange, runSignal]);

  useFrame((_, delta) => {
    elapsed.current += Math.min(delta, 0.05);
    const t = elapsed.current;

    let phase: PpfDemoPhase;
    if (t < 3) phase = "handoff";
    else if (t < 10) phase = "dispersal";
    else if (t < 13) phase = "breeding";
    else if (t < 17) phase = "transfer";
    else if (t < 21) phase = "blocked";
    else phase = "complete";

    if (phase !== currentPhase.current) {
      currentPhase.current = phase;
      setRenderPhase(phase);
      onPhaseChange?.(phase);
    }

    const swarmProgress = MathUtils.clamp((t - 1.2) / 11.8, 0, 1);
    if (Math.abs(swarmProgress - flightProgress) > 0.006) {
      setFlightProgress(swarmProgress);
    }

    let desiredCamera = new Vector3();
    let desiredTarget = new Vector3();

    if (t < 3) {
      // Start already looking at the same EXIT side as Demo 1, then pull out
      // into the yard instead of cutting to an unrelated camera angle.
      const p = MathUtils.smoothstep(t / 3, 0, 1);
      desiredTarget.set(
        MathUtils.lerp(-1.95, -0.95, p),
        MathUtils.lerp(1.30, 1.48, p),
        MathUtils.lerp(0.0, -0.08, p),
      );
      desiredCamera.set(
        MathUtils.lerp(-0.15, 0.35, p),
        MathUtils.lerp(1.58, 1.92, p),
        MathUtils.lerp(2.9, 3.35, p),
      );
    } else if (t < 10) {
      const p = MathUtils.clamp((t - 3) / 7, 0, 1);
      desiredTarget.set(
        MathUtils.lerp(-0.7, 3.2, p),
        MathUtils.lerp(1.45, 1.0, p),
        MathUtils.lerp(0, -0.1, p),
      );
      desiredCamera.copy(desiredTarget).add(new Vector3(0.7, 0.55, 3.2));
    } else {
      const p = MathUtils.smoothstep((t - 10) / 3, 0, 1);
      desiredTarget.set(4.55, MathUtils.lerp(0.65, 0.22, p), 0.1);
      desiredCamera.set(
        MathUtils.lerp(4.0, 4.45, p),
        MathUtils.lerp(2.15, 1.75, p),
        MathUtils.lerp(3.5, 2.9, p),
      );
    }

    const damping = 1 - Math.exp(-delta * 2.2);
    camera.position.lerp(desiredCamera, damping);
    camera.lookAt(desiredTarget);
    camera.updateMatrixWorld();

    if (t >= TOTAL_SECONDS && !completed.current) {
      completed.current = true;
      onComplete?.();
    }
  });

  return (
    <>
      <fog attach="fog" args={["#07110e", 8, 18]} />
      <color attach="background" args={["#06100d"]} />
      <ambientLight intensity={0.78} />
      <directionalLight position={[5, 8, 4]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[-4, 3, -5]} intensity={0.9} color="#a7f3d0" />
      <pointLight position={[-1.8, 1.4, 0]} intensity={10} distance={2.4} color="#8b5cf6" />
      <pointLight position={[4.5, 0.5, 0]} intensity={5} distance={3} color="#22d3ee" />

      <EnvironmentScene />

      <group position={DEVICE_POSITION}>
        <primitive object={prepared.root} />
      </group>

      <group position={[-1.88, 1.34, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.21, 0.018, 10, 32]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.85} toneMapped={false} />
        </mesh>
        <Html center position={[0, 0.42, 0]}>
          <div className="whitespace-nowrap rounded-full border border-violet-300/30 bg-violet-950/90 px-3 py-1.5 text-[10px] font-black tracking-[0.12em] text-violet-100 backdrop-blur-xl">
            PPF CONTACT → EXIT
          </div>
        </Html>
      </group>

      <Swarm
        progress={flightProgress}
        visible={
          renderPhase === "handoff" ||
          renderPhase === "dispersal" ||
          renderPhase === "breeding"
        }
      />

      <PpfParticles active={renderPhase === "transfer" || renderPhase === "blocked"} />
      <BreedingSite phase={renderPhase} />

      {renderPhase === "handoff" && (
        <Html center position={[-0.5, 2.55, 0]}>
          <div className="w-[270px] rounded-2xl border border-violet-300/20 bg-[#07110e]/90 p-3 text-center text-xs leading-5 text-violet-100 shadow-2xl backdrop-blur-xl">
            Muỗi rời hệ thống sau vùng tiếp xúc PPF.
            <div className="mt-1 font-bold text-violet-300">Màu tím = cá thể mang PPF</div>
          </div>
        </Html>
      )}

      {renderPhase === "transfer" && (
        <Html center position={[4.55, 1.55, 0]}>
          <div className="w-[290px] rounded-2xl border border-violet-300/20 bg-[#07110e]/90 p-3 text-center text-xs leading-5 text-violet-100 shadow-2xl backdrop-blur-xl">
            PPF được mô phỏng truyền từ muỗi mang chất tới điểm nước sinh sản.
          </div>
        </Html>
      )}

      <OrbitControls
        enabled={renderPhase === "complete"}
        enableDamping
        dampingFactor={0.06}
        minDistance={1.6}
        maxDistance={12}
      />
    </>
  );
}

function LoadingScene() {
  return (
    <Html center>
      <div className="rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-violet-200 backdrop-blur-xl">
        ĐANG TẢI DEMO PPF 3D
      </div>
    </Html>
  );
}

export default function PpfDisseminationViewer(props: Props) {
  return (
    <Canvas
      camera={{ position: [-0.2, 1.55, 3.1], fov: 36, near: 0.01, far: 120 }}
      dpr={1}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      }}
    >
      <Suspense fallback={<LoadingScene />}>
        <Scene {...props} />
        <Environment preset="city" environmentIntensity={0.28} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
