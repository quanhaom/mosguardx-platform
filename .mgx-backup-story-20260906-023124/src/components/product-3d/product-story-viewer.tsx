"use client";

/* eslint-disable react-hooks/immutability */

import { Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import {
  Box3,
  CatmullRomCurve3,
  Color,
  DoubleSide,
  Group,
  InstancedMesh,
  MathUtils,
  Mesh,
  Object3D,
  Vector3,
} from "three";

export type StoryPhase =
  | "idle"
  | "approach"
  | "inlet"
  | "imaging"
  | "ppf"
  | "fan"
  | "exit"
  | "outdoor"
  | "breeding"
  | "transfer"
  | "blocked"
  | "complete";

type Props = {
  runSignal: number;
  active: boolean;
  onPhaseChange?: (phase: StoryPhase) => void;
  onComplete?: () => void;
};

type PreparedDevice = {
  root: Group;
  size: number;
  spawn: Vector3;
  inlet: Vector3;
  camera: Vector3;
  bait: Vector3;
  fan: Vector3;
  exit: Vector3;
};

type FlightState = {
  focus: Vector3;
  progress: number;
  phase: StoryPhase;
  active: boolean;
};

const MODEL_URL = "/models/mosguardx/web.gltf";
const DEVICE_WORLD = new Vector3(-3.15, 1.16, 0);
const BREEDING_POINT = new Vector3(4.65, 0.34, 0.25);
const MOSQUITO_COUNT = 16;
const STORY_SECONDS = 26;
const BODY_BLACK = new Color("#111827");
const BODY_PURPLE = new Color("#7c3aed");
const WING_NORMAL = new Color("#cbd5e1");
const WING_PURPLE = new Color("#ddd6fe");
const LOCAL_FORWARD = new Vector3(0, 1, 0);

function seeded(index: number, salt: number) {
  const value = Math.sin(index * 9187.17 + salt * 191.31) * 43758.5453;
  return value - Math.floor(value);
}

function normalizeName(value: string) {
  return value.trim().toLowerCase().replace(/[\s.-]+/g, "_");
}

function findNamedObject(
  objects: Map<string, Object3D>,
  aliases: readonly string[],
) {
  return aliases
    .map((name) => objects.get(normalizeName(name)))
    .find((object): object is Object3D => Boolean(object));
}

function centerOf(object: Object3D | undefined, fallback: Vector3) {
  if (!object) return fallback.clone();
  return new Box3().setFromObject(object).getCenter(new Vector3());
}

function prepareDevice(source: Object3D): PreparedDevice {
  const root = source.clone(true) as Group;
  root.name = "MGX_Story_Root";
  root.rotateY(Math.PI);
  root.updateMatrixWorld(true);

  const initialBounds = new Box3().setFromObject(root);
  const center = initialBounds.getCenter(new Vector3());
  const sizeVector = initialBounds.getSize(new Vector3());
  const maxDimension = Math.max(sizeVector.x, sizeVector.y, sizeVector.z) || 1;

  root.position.sub(center);
  root.scale.setScalar(2.65 / maxDimension);
  root.updateMatrixWorld(true);

  root.traverse((object) => {
    if (object instanceof Mesh) {
      object.castShadow = false;
      object.receiveShadow = false;
    }
  });

  const objects = new Map<string, Object3D>();
  root.traverse((object) => {
    if (object.name) objects.set(normalizeName(object.name), object);
  });

  const bounds = new Box3().setFromObject(root);
  const modelCenter = bounds.getCenter(new Vector3());
  const modelSize = Math.max(...bounds.getSize(new Vector3()).toArray()) || 1;

  const inletObject = findNamedObject(objects, [
    "MGX_LED",
    "MGX_Inlet",
    "MGX_Grille",
    "Grille",
  ]);
  const cameraObject = findNamedObject(objects, [
    "MGX_CAMERA",
    "MGX_Camera",
    "Camera Module001",
    "Camer Module001",
    "Camera Module",
  ]);
  const baitObject = findNamedObject(objects, [
    "MGX_BOX",
    "MGX_BAIT",
    "MGX_Bait",
    "BaitBox",
    "Bait Box",
  ]);
  const fanObject = findNamedObject(objects, ["MGX_Fan", "MGX_fan", "Fan"]);

  const inlet = centerOf(
    inletObject,
    modelCenter.clone().add(new Vector3(-0.55, 0.15, 0)),
  );
  const camera = centerOf(
    cameraObject,
    inlet.clone().add(new Vector3(0.45, -0.05, 0)),
  );
  const bait = centerOf(
    baitObject,
    camera.clone().add(new Vector3(0.4, -0.12, 0)),
  );
  const fan = centerOf(
    fanObject,
    bait.clone().add(new Vector3(0.45, 0, 0)),
  );

  const spawn = inlet.clone().add(new Vector3(-1.2, 1.6, 0.4));
  const exit = fan.clone().add(new Vector3(modelSize * 1.15, 0.12, 0));

  return {
    root,
    size: modelSize,
    spawn,
    inlet,
    camera,
    bait,
    fan,
    exit,
  };
}

function toWorld(local: Vector3) {
  return local.clone().add(DEVICE_WORLD);
}

function phaseForProgress(progress: number): StoryPhase {
  if (progress <= 0) return "idle";
  if (progress < 0.15) return "approach";
  if (progress < 0.30) return "inlet";
  if (progress < 0.42) return "imaging";
  if (progress < 0.52) return "ppf";
  if (progress < 0.61) return "fan";
  if (progress < 0.69) return "exit";
  if (progress < 0.84) return "outdoor";
  if (progress < 0.91) return "breeding";
  if (progress < 0.965) return "transfer";
  if (progress < 0.995) return "blocked";
  return "complete";
}

function StoryEnvironment({ phase }: { phase: StoryPhase }) {
  const showBiology =
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
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.2, -0.04, 0]}>
        <planeGeometry args={[19, 11]} />
        <meshStandardMaterial color="#203a2a" roughness={1} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.15, -0.012, 1.15]}>
        <planeGeometry args={[7.5, 1.2]} />
        <meshStandardMaterial color="#5c665d" roughness={0.95} />
      </mesh>

      <group position={[2.7, 0, -2.45]}>
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[4.05, 2.5, 2.35]} />
          <meshStandardMaterial color="#d7ddd5" roughness={0.92} />
        </mesh>

        <mesh position={[0, 2.72, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[2.6, 1.28, 4]} />
          <meshStandardMaterial color="#5c4436" roughness={1} />
        </mesh>

        <mesh position={[-0.55, 0.92, 1.2]}>
          <boxGeometry args={[0.72, 1.7, 0.08]} />
          <meshStandardMaterial color="#735844" roughness={0.95} />
        </mesh>

        {[-1.25, 0.82].map((x) => (
          <mesh key={x} position={[x, 1.48, 1.2]}>
            <boxGeometry args={[0.74, 0.74, 0.06]} />
            <meshStandardMaterial
              color="#6caabd"
              emissive="#38bdf8"
              emissiveIntensity={0.06}
              roughness={0.35}
            />
          </mesh>
        ))}
      </group>

      <mesh position={[-3.15, 0.38, 0]}>
        <cylinderGeometry args={[0.38, 0.48, 0.76, 20]} />
        <meshStandardMaterial color="#3d4941" roughness={0.95} />
      </mesh>

      {Array.from({ length: 30 }).map((_, index) => {
        const x = -1.7 + (index % 15) * 0.58;
        const z =
          -1.55 +
          Math.floor(index / 15) * 3.6 +
          (seeded(index, 4) - 0.5) * 0.55;

        return (
          <group
            key={index}
            position={[x, 0.02, z]}
            rotation={[0, seeded(index, 5) * Math.PI, 0]}
          >
            <mesh position={[0, 0.2, 0]} rotation={[0, 0, -0.12]}>
              <coneGeometry args={[0.065, 0.43, 5]} />
              <meshStandardMaterial color="#426b40" roughness={1} />
            </mesh>
          </group>
        );
      })}

      <group position={[6.05, 0, -1.85]}>
        <mesh position={[0, 0.92, 0]}>
          <cylinderGeometry args={[0.16, 0.22, 1.84, 10]} />
          <meshStandardMaterial color="#614936" roughness={1} />
        </mesh>
        <mesh position={[0, 2.05, 0]}>
          <sphereGeometry args={[0.98, 14, 10]} />
          <meshStandardMaterial color="#315f38" roughness={1} />
        </mesh>
      </group>

      <group position={[4.65, 0, 0.25]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
          <circleGeometry args={[1.14, 48]} />
          <meshPhysicalMaterial
            color="#35b9d2"
            transparent
            opacity={0.66}
            roughness={0.18}
            transmission={0.08}
          />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
          <ringGeometry args={[1.08, 1.36, 48]} />
          <meshStandardMaterial color="#334b34" roughness={1} />
        </mesh>

        {showBiology &&
          Array.from({ length: 12 }).map((_, index) => {
            const angle = (index / 12) * Math.PI * 1.55 + 0.25;
            return (
              <mesh
                key={`egg-${index}`}
                position={[
                  Math.cos(angle) * 0.82,
                  0.085,
                  Math.sin(angle) * 0.5,
                ]}
                scale={[0.018, 0.05, 0.018]}
              >
                <sphereGeometry args={[1, 7, 5]} />
                <meshStandardMaterial color="#20242a" />
              </mesh>
            );
          })}

        {showLarvae &&
          Array.from({ length: 8 }).map((_, index) => (
            <mesh
              key={`larva-${index}`}
              position={[
                -0.56 + (index % 4) * 0.35,
                0.075,
                -0.23 + Math.floor(index / 4) * 0.43,
              ]}
              rotation={[Math.PI / 2, 0, index % 2 === 0 ? 0.22 : -0.26]}
            >
              <cylinderGeometry args={[0.018, 0.012, 0.18, 7]} />
              <meshStandardMaterial
                color={blocked ? "#8b5cf6" : "#775a38"}
                emissive={blocked ? "#6d28d9" : "#000000"}
                emissiveIntensity={blocked ? 0.5 : 0}
              />
            </mesh>
          ))}

        {blocked && (
          <group position={[0, 0.64, 0]}>
            <mesh>
              <torusGeometry args={[0.34, 0.035, 12, 48]} />
              <meshBasicMaterial color="#c084fc" toneMapped={false} />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]}>
              <boxGeometry args={[0.68, 0.055, 0.055]} />
              <meshBasicMaterial color="#c084fc" toneMapped={false} />
            </mesh>
            <Html center position={[0, 0.54, 0]}>
              <div className="whitespace-nowrap rounded-full border border-violet-300/25 bg-violet-950/90 px-3 py-1.5 text-[10px] font-black tracking-[0.1em] text-violet-100 shadow-xl backdrop-blur-xl">
                ADULT EMERGENCE BLOCKED
              </div>
            </Html>
          </group>
        )}
      </group>
    </>
  );
}

function PpfTransferParticles({ active }: { active: boolean }) {
  const refs = useRef<Array<Mesh | null>>([]);

  useFrame((state) => {
    if (!active) {
      refs.current.forEach((mesh) => {
        if (mesh) mesh.visible = false;
      });
      return;
    }

    const t = state.clock.elapsedTime;

    refs.current.forEach((mesh, index) => {
      if (!mesh) return;
      mesh.visible = true;

      const cycle = (t * 0.5 + seeded(index, 9)) % 1;
      mesh.position.set(
        BREEDING_POINT.x + (seeded(index, 2) - 0.5) * 0.82,
        MathUtils.lerp(0.72, 0.10, cycle),
        BREEDING_POINT.z + (seeded(index, 4) - 0.5) * 0.75,
      );
      mesh.scale.setScalar(0.55 + Math.sin(cycle * Math.PI) * 0.65);
    });
  });

  return (
    <>
      {Array.from({ length: 24 }).map((_, index) => (
        <mesh
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
        >
          <sphereGeometry args={[0.024, 7, 5]} />
          <meshBasicMaterial color="#a855f7" toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

function StorySwarm({
  active,
  runSignal,
  prepared,
  flightState,
}: {
  active: boolean;
  runSignal: number;
  prepared: PreparedDevice;
  flightState: MutableRefObject<FlightState>;
}) {
  const abdomenRef = useRef<InstancedMesh>(null);
  const thoraxRef = useRef<InstancedMesh>(null);
  const headRef = useRef<InstancedMesh>(null);
  const proboscisRef = useRef<InstancedMesh>(null);
  const leftAntennaRef = useRef<InstancedMesh>(null);
  const rightAntennaRef = useRef<InstancedMesh>(null);
  const leftWingRef = useRef<InstancedMesh>(null);
  const rightWingRef = useRef<InstancedMesh>(null);

  const upperLegRefs = useRef<Array<InstancedMesh | null>>([]);
  const lowerLegRefs = useRef<Array<InstancedMesh | null>>([]);
  const legBandRefs = useRef<Array<InstancedMesh | null>>([]);
  const abdomenBandRefs = useRef<Array<InstancedMesh | null>>([]);

  const elapsed = useRef(0);
  const ppfContacted = useRef<boolean[]>(
    Array.from({ length: MOSQUITO_COUNT }, () => false),
  );
  const dummy = useMemo(() => new Object3D(), []);
  const { invalidate } = useThree();

  const worldPoints = useMemo(() => {
    const spawn = toWorld(prepared.spawn);
    const inlet = toWorld(prepared.inlet);
    const camera = toWorld(prepared.camera);
    const bait = toWorld(prepared.bait);
    const fan = toWorld(prepared.fan);
    const exit = toWorld(prepared.exit);

    return {
      spawn,
      inlet,
      camera,
      bait,
      fan,
      exit,
      outdoor1: new Vector3(-0.8, 1.65, 0.2),
      outdoor2: new Vector3(1.1, 1.85, -0.45),
      outdoor3: new Vector3(2.9, 1.35, 0.15),
      breeding: BREEDING_POINT.clone().add(new Vector3(0, 0.45, 0)),
    };
  }, [prepared]);

  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        [
          worldPoints.spawn,
          worldPoints.inlet,
          worldPoints.camera,
          worldPoints.bait,
          worldPoints.fan,
          worldPoints.exit,
          worldPoints.outdoor1,
          worldPoints.outdoor2,
          worldPoints.outdoor3,
          worldPoints.breeding,
        ],
        false,
        "catmullrom",
        0.22,
      ),
    [worldPoints],
  );

  const allMeshes = () =>
    [
      abdomenRef.current,
      thoraxRef.current,
      headRef.current,
      proboscisRef.current,
      leftAntennaRef.current,
      rightAntennaRef.current,
      leftWingRef.current,
      rightWingRef.current,
      ...upperLegRefs.current,
      ...lowerLegRefs.current,
      ...legBandRefs.current,
      ...abdomenBandRefs.current,
    ].filter((mesh): mesh is InstancedMesh => Boolean(mesh));

  useEffect(() => {
    elapsed.current = 0;
    ppfContacted.current.fill(false);

    allMeshes().forEach((mesh) => {
      mesh.visible = active;
    });

    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, invalidate, runSignal]);

  const setBodyPart = (
    mesh: InstancedMesh,
    index: number,
    position: Vector3,
    tangent: Vector3,
    scale: readonly [number, number, number],
  ) => {
    dummy.position.copy(position);
    dummy.quaternion.setFromUnitVectors(LOCAL_FORWARD, tangent);
    dummy.scale.set(scale[0], scale[1], scale[2]);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  };

  const setCylinderBetween = (
    mesh: InstancedMesh,
    index: number,
    startPoint: Vector3,
    endPoint: Vector3,
    thickness: number,
  ) => {
    const direction = endPoint.clone().sub(startPoint);
    const length = direction.length();

    if (length < 0.000001) {
      dummy.position.copy(startPoint);
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      return;
    }

    direction.normalize();
    dummy.position.copy(startPoint).add(endPoint).multiplyScalar(0.5);
    dummy.quaternion.setFromUnitVectors(LOCAL_FORWARD, direction);
    dummy.scale.set(thickness, length, thickness);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
  };

  useFrame((_, delta) => {
    const abdomen = abdomenRef.current;
    const thorax = thoraxRef.current;
    const head = headRef.current;
    const proboscis = proboscisRef.current;
    const leftAntenna = leftAntennaRef.current;
    const rightAntenna = rightAntennaRef.current;
    const leftWing = leftWingRef.current;
    const rightWing = rightWingRef.current;

    if (
      !active ||
      !abdomen ||
      !thorax ||
      !head ||
      !proboscis ||
      !leftAntenna ||
      !rightAntenna ||
      !leftWing ||
      !rightWing ||
      upperLegRefs.current.length < 6 ||
      lowerLegRefs.current.length < 6 ||
      legBandRefs.current.length < 6 ||
      abdomenBandRefs.current.length < 3
    ) {
      return;
    }

    elapsed.current += Math.min(delta, 0.05);
    const overall = MathUtils.clamp(elapsed.current / STORY_SECONDS, 0, 1);
    const focus = new Vector3();
    let visible = 0;

    for (let index = 0; index < MOSQUITO_COUNT; index += 1) {
      const delay = (index / MOSQUITO_COUNT) * 0.045;
      const progress = MathUtils.clamp((overall - delay) / (1 - delay), 0, 1);

      const point = curve.getPoint(progress);
      const tangent = curve.getTangent(progress).normalize();

      const side = new Vector3().crossVectors(tangent, new Vector3(0, 0, 1));
      if (side.lengthSq() < 0.0001) side.set(1, 0, 0);
      side.normalize();
      const up = new Vector3().crossVectors(side, tangent).normalize();

      const wobble =
        elapsed.current * (2.55 + seeded(index, 2) * 0.7) +
        seeded(index, 3) * 8;

      let radius = progress < 0.54 ? 0.055 : 0.13;
      if (progress > 0.84) radius = 0.085;

      const ppfThreshold = 0.43 + seeded(index, 7) * 0.012;
      if (progress >= ppfThreshold) ppfContacted.current[index] = true;
      if (ppfContacted.current[index] && progress < 0.67) radius *= 0.20;

      point.x += Math.cos(wobble) * radius;
      point.y += Math.sin(wobble * 1.25) * radius * 0.55;
      point.z += Math.sin(wobble) * radius * 0.5;

      const visibleScale = progress > 0.001 && progress < 0.995 ? 1 : 0;
      const size =
        (0.052 + seeded(index, 8) * 0.010) *
        visibleScale;
      const carriesPpf = ppfContacted.current[index];

      if (visibleScale > 0) {
        focus.add(point);
        visible += 1;
      }

      const bodyColor = carriesPpf ? BODY_PURPLE : BODY_BLACK;
      const wingColor = carriesPpf ? WING_PURPLE : WING_NORMAL;
      const bandColor = carriesPpf
        ? new Color("#e9d5ff")
        : new Color("#f8fafc");

      for (const mesh of [
        abdomen,
        thorax,
        head,
        proboscis,
        leftAntenna,
        rightAntenna,
      ]) {
        mesh.setColorAt(index, bodyColor);
      }

      for (const mesh of upperLegRefs.current) {
        mesh?.setColorAt(index, bodyColor);
      }
      for (const mesh of lowerLegRefs.current) {
        mesh?.setColorAt(index, bodyColor);
      }

      for (const mesh of legBandRefs.current) {
        mesh?.setColorAt(index, bandColor);
      }
      for (const mesh of abdomenBandRefs.current) {
        mesh?.setColorAt(index, bandColor);
      }

      leftWing.setColorAt(index, wingColor);
      rightWing.setColorAt(index, wingColor);

      const thoraxPoint = point.clone();
      const abdomenPoint = point
        .clone()
        .addScaledVector(tangent, -size * 0.54);
      const headPoint = point
        .clone()
        .addScaledVector(tangent, size * 0.44);

      setBodyPart(
        abdomen,
        index,
        abdomenPoint,
        tangent,
        [size * 0.21, size * 0.76, size * 0.19],
      );

      setBodyPart(
        thorax,
        index,
        thoraxPoint,
        tangent,
        [size * 0.31, size * 0.34, size * 0.28],
      );

      setBodyPart(
        head,
        index,
        headPoint,
        tangent,
        [size * 0.20, size * 0.20, size * 0.20],
      );

      const proboscisStart = headPoint
        .clone()
        .addScaledVector(tangent, size * 0.13);
      const proboscisEnd = headPoint
        .clone()
        .addScaledVector(tangent, size * 0.86);

      setCylinderBetween(
        proboscis,
        index,
        proboscisStart,
        proboscisEnd,
        size * 0.023,
      );

      // Antennae diverge slightly from the proboscis, making the head silhouette
      // immediately read more like a mosquito when the camera comes close.
      const antennaBase = headPoint
        .clone()
        .addScaledVector(tangent, size * 0.12);

      const leftAntennaEnd = antennaBase
        .clone()
        .addScaledVector(tangent, size * 0.54)
        .addScaledVector(side, size * 0.16)
        .addScaledVector(up, size * 0.10);

      const rightAntennaEnd = antennaBase
        .clone()
        .addScaledVector(tangent, size * 0.54)
        .addScaledVector(side, -size * 0.16)
        .addScaledVector(up, size * 0.10);

      setCylinderBetween(
        leftAntenna,
        index,
        antennaBase,
        leftAntennaEnd,
        size * 0.014,
      );

      setCylinderBetween(
        rightAntenna,
        index,
        antennaBase,
        rightAntennaEnd,
        size * 0.014,
      );

      const flap =
        0.30 +
        Math.abs(Math.sin(elapsed.current * 40 + index * 0.61)) * 0.74;

      const leftWingPosition = thoraxPoint
        .clone()
        .addScaledVector(side, size * 0.35)
        .addScaledVector(tangent, -size * 0.08)
        .addScaledVector(up, size * 0.04);

      dummy.position.copy(leftWingPosition);
      dummy.quaternion.setFromUnitVectors(LOCAL_FORWARD, tangent);
      dummy.rotateZ(0.52 + flap);
      dummy.scale.set(size * 1.08, size * 0.40, 1);
      dummy.updateMatrix();
      leftWing.setMatrixAt(index, dummy.matrix);

      const rightWingPosition = thoraxPoint
        .clone()
        .addScaledVector(side, -size * 0.35)
        .addScaledVector(tangent, -size * 0.08)
        .addScaledVector(up, size * 0.04);

      dummy.position.copy(rightWingPosition);
      dummy.quaternion.setFromUnitVectors(LOCAL_FORWARD, tangent);
      dummy.rotateZ(-0.52 - flap);
      dummy.scale.set(size * 1.08, size * 0.40, 1);
      dummy.updateMatrix();
      rightWing.setMatrixAt(index, dummy.matrix);

      // Three thin abdominal bands inspired by the high-contrast Aedes
      // silhouette. They are visual identifiers, not a species classifier.
      const bandOffsets = [-0.24, -0.48, -0.70] as const;
      bandOffsets.forEach((offset, bandIndex) => {
        const bandMesh = abdomenBandRefs.current[bandIndex];
        if (!bandMesh) return;

        const bandPoint = thoraxPoint
          .clone()
          .addScaledVector(tangent, size * offset);

        setBodyPart(
          bandMesh,
          index,
          bandPoint,
          tangent,
          [size * 0.225, size * 0.045, size * 0.205],
        );
      });

      // Articulated six-leg silhouette:
      // thorax anchor -> knee -> distal foot.
      const legSpecs = [
        { sideSign: 1, along: 0.18, kneeOut: 0.58, kneeBack: 0.10, kneeDown: 0.30, footOut: 1.12, footBack: 0.25, footDown: 0.78 },
        { sideSign: -1, along: 0.18, kneeOut: 0.58, kneeBack: 0.10, kneeDown: 0.30, footOut: 1.12, footBack: 0.25, footDown: 0.78 },
        { sideSign: 1, along: 0.00, kneeOut: 0.66, kneeBack: -0.18, kneeDown: 0.36, footOut: 1.18, footBack: -0.12, footDown: 0.86 },
        { sideSign: -1, along: 0.00, kneeOut: 0.66, kneeBack: -0.18, kneeDown: 0.36, footOut: 1.18, footBack: -0.12, footDown: 0.86 },
        { sideSign: 1, along: -0.18, kneeOut: 0.58, kneeBack: -0.48, kneeDown: 0.28, footOut: 1.00, footBack: -0.82, footDown: 0.72 },
        { sideSign: -1, along: -0.18, kneeOut: 0.58, kneeBack: -0.48, kneeDown: 0.28, footOut: 1.00, footBack: -0.82, footDown: 0.72 },
      ] as const;

      legSpecs.forEach((leg, legIndex) => {
        const upperMesh = upperLegRefs.current[legIndex];
        const lowerMesh = lowerLegRefs.current[legIndex];
        const bandMesh = legBandRefs.current[legIndex];
        if (!upperMesh || !lowerMesh || !bandMesh) return;

        const anchor = thoraxPoint
          .clone()
          .addScaledVector(tangent, size * leg.along)
          .addScaledVector(side, size * 0.14 * leg.sideSign);

        const knee = thoraxPoint
          .clone()
          .addScaledVector(tangent, size * leg.kneeBack)
          .addScaledVector(side, size * leg.kneeOut * leg.sideSign)
          .addScaledVector(up, -size * leg.kneeDown);

        const foot = thoraxPoint
          .clone()
          .addScaledVector(tangent, size * leg.footBack)
          .addScaledVector(side, size * leg.footOut * leg.sideSign)
          .addScaledVector(up, -size * leg.footDown);

        setCylinderBetween(
          upperMesh,
          index,
          anchor,
          knee,
          size * 0.017,
        );

        setCylinderBetween(
          lowerMesh,
          index,
          knee,
          foot,
          size * 0.015,
        );

        // A short light band on the distal leg segment.
        const bandCenter = knee.clone().lerp(foot, 0.42);
        const bandHalfDirection = foot
          .clone()
          .sub(knee)
          .normalize()
          .multiplyScalar(size * 0.055);

        setCylinderBetween(
          bandMesh,
          index,
          bandCenter.clone().sub(bandHalfDirection),
          bandCenter.clone().add(bandHalfDirection),
          size * 0.021,
        );
      });
    }

    const bodyMeshes = [
      abdomen,
      thorax,
      head,
      proboscis,
      leftAntenna,
      rightAntenna,
    ];

    for (const mesh of bodyMeshes) {
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    leftWing.instanceMatrix.needsUpdate = true;
    rightWing.instanceMatrix.needsUpdate = true;
    if (leftWing.instanceColor) leftWing.instanceColor.needsUpdate = true;
    if (rightWing.instanceColor) rightWing.instanceColor.needsUpdate = true;

    [
      ...upperLegRefs.current,
      ...lowerLegRefs.current,
      ...legBandRefs.current,
      ...abdomenBandRefs.current,
    ].forEach((mesh) => {
      if (!mesh) return;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    });

    if (visible > 0) {
      flightState.current.focus.copy(focus.divideScalar(visible));
    }

    flightState.current.progress = overall;
    flightState.current.phase = phaseForProgress(overall);
    flightState.current.active = overall < 1;

    invalidate();
  });

  return (
    <group renderOrder={5}>
      <instancedMesh
        ref={abdomenRef}
        args={[undefined, undefined, MOSQUITO_COUNT]}
      >
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.68} />
      </instancedMesh>

      <instancedMesh
        ref={thoraxRef}
        args={[undefined, undefined, MOSQUITO_COUNT]}
      >
        <sphereGeometry args={[1, 9, 7]} />
        <meshStandardMaterial color="#ffffff" roughness={0.66} />
      </instancedMesh>

      <instancedMesh
        ref={headRef}
        args={[undefined, undefined, MOSQUITO_COUNT]}
      >
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.64} />
      </instancedMesh>

      <instancedMesh
        ref={proboscisRef}
        args={[undefined, undefined, MOSQUITO_COUNT]}
      >
        <cylinderGeometry args={[1, 0.7, 1, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.72} />
      </instancedMesh>

      <instancedMesh
        ref={leftAntennaRef}
        args={[undefined, undefined, MOSQUITO_COUNT]}
      >
        <cylinderGeometry args={[1, 0.75, 1, 5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.74} />
      </instancedMesh>

      <instancedMesh
        ref={rightAntennaRef}
        args={[undefined, undefined, MOSQUITO_COUNT]}
      >
        <cylinderGeometry args={[1, 0.75, 1, 5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.74} />
      </instancedMesh>

      <instancedMesh
        ref={leftWingRef}
        args={[undefined, undefined, MOSQUITO_COUNT]}
      >
        <planeGeometry args={[1, 0.36]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.40}
          side={DoubleSide}
          depthWrite={false}
          roughness={0.34}
        />
      </instancedMesh>

      <instancedMesh
        ref={rightWingRef}
        args={[undefined, undefined, MOSQUITO_COUNT]}
      >
        <planeGeometry args={[1, 0.36]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.40}
          side={DoubleSide}
          depthWrite={false}
          roughness={0.34}
        />
      </instancedMesh>

      {/* Aedes-like light bands on abdomen */}
      {Array.from({ length: 3 }).map((_, bandIndex) => (
        <instancedMesh
          key={`abdomen-band-${bandIndex}`}
          ref={(node) => {
            abdomenBandRefs.current[bandIndex] = node;
          }}
          args={[undefined, undefined, MOSQUITO_COUNT]}
        >
          <cylinderGeometry args={[1, 1, 1, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </instancedMesh>
      ))}

      {/* Six legs with two segments each */}
      {Array.from({ length: 6 }).map((_, legIndex) => (
        <instancedMesh
          key={`upper-leg-${legIndex}`}
          ref={(node) => {
            upperLegRefs.current[legIndex] = node;
          }}
          args={[undefined, undefined, MOSQUITO_COUNT]}
        >
          <cylinderGeometry args={[1, 0.78, 1, 5]} />
          <meshStandardMaterial color="#ffffff" roughness={0.76} />
        </instancedMesh>
      ))}

      {Array.from({ length: 6 }).map((_, legIndex) => (
        <instancedMesh
          key={`lower-leg-${legIndex}`}
          ref={(node) => {
            lowerLegRefs.current[legIndex] = node;
          }}
          args={[undefined, undefined, MOSQUITO_COUNT]}
        >
          <cylinderGeometry args={[1, 0.76, 1, 5]} />
          <meshStandardMaterial color="#ffffff" roughness={0.76} />
        </instancedMesh>
      ))}

      {/* Small white bands on distal leg segments */}
      {Array.from({ length: 6 }).map((_, legIndex) => (
        <instancedMesh
          key={`leg-band-${legIndex}`}
          ref={(node) => {
            legBandRefs.current[legIndex] = node;
          }}
          args={[undefined, undefined, MOSQUITO_COUNT]}
        >
          <cylinderGeometry args={[1, 1, 1, 6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.52} />
        </instancedMesh>
      ))}
    </group>
  );
}

function StoryScene({ active, runSignal, onPhaseChange, onComplete }: Props) {
  const { scene } = useGLTF(MODEL_URL);
  const prepared = useMemo(() => prepareDevice(scene), [scene]);
  const currentPhase = useRef<StoryPhase>("idle");
  const completed = useRef(false);
  const { camera } = useThree();
  const flightState = useRef<FlightState>({
    focus: toWorld(prepared.spawn),
    progress: 0,
    phase: "idle",
    active: false,
  });

  useEffect(() => {
    currentPhase.current = active ? "approach" : "idle";
    completed.current = false;
    flightState.current.progress = 0;
    flightState.current.phase = active ? "approach" : "idle";
    flightState.current.active = active;
    onPhaseChange?.(active ? "approach" : "idle");
  }, [active, onPhaseChange, runSignal]);

  useFrame((_, delta) => {
    if (!active) return;

    const progress = flightState.current.progress;
    const phase = phaseForProgress(progress);

    if (phase !== currentPhase.current) {
      currentPhase.current = phase;
      onPhaseChange?.(phase);
    }

    const focus = flightState.current.focus;
    const damping = 1 - Math.exp(-delta * 2.25);
    const desiredCamera = new Vector3();
    const desiredTarget = focus.clone();

    if (progress < 0.20) {
      desiredCamera.copy(focus).add(new Vector3(0.4, 0.28, 1.55));
    } else if (progress < 0.48) {
      desiredCamera.copy(focus).add(new Vector3(0.28, 0.20, 1.12));
    } else if (progress < 0.69) {
      desiredCamera.copy(focus).add(new Vector3(0.45, 0.34, 1.75));
    } else if (progress < 0.86) {
      const outdoorPull = MathUtils.smoothstep((progress - 0.69) / 0.17, 0, 1);
      desiredCamera.copy(focus).add(
        new Vector3(
          MathUtils.lerp(0.55, 0.9, outdoorPull),
          MathUtils.lerp(0.45, 0.68, outdoorPull),
          MathUtils.lerp(2.0, 3.0, outdoorPull),
        ),
      );
    } else {
      desiredTarget.lerp(BREEDING_POINT, 0.42);
      desiredCamera.set(4.05, 1.95, 3.15);
    }

    camera.position.lerp(desiredCamera, damping);
    camera.lookAt(desiredTarget);
    camera.updateMatrixWorld();

    if (phase === "complete" && !completed.current) {
      completed.current = true;
      onComplete?.();
    }
  });

  return (
    <>
      <color attach="background" args={["#06100d"]} />
      <fog attach="fog" args={["#07110e", 8, 18]} />

      <ambientLight intensity={0.76} />
      <directionalLight position={[5, 8, 4]} intensity={2.25} />
      <directionalLight position={[-4, 3, -5]} intensity={0.95} color="#a7f3d0" />
      <pointLight
        position={[-1.9, 1.4, 0]}
        intensity={6}
        distance={2.6}
        color="#8b5cf6"
      />
      <pointLight
        position={[4.6, 0.5, 0.2]}
        intensity={4.2}
        distance={3}
        color="#22d3ee"
      />

      <StoryEnvironment phase={flightState.current.phase} />

      <group position={DEVICE_WORLD}>
        <primitive object={prepared.root} />
      </group>

      <StorySwarm
        active={active}
        runSignal={runSignal}
        prepared={prepared}
        flightState={flightState}
      />

      <PpfTransferParticles
        active={
          flightState.current.phase === "transfer" ||
          flightState.current.phase === "blocked"
        }
      />

      <OrbitControls
        enabled={!active || flightState.current.phase === "complete"}
        enableDamping
        dampingFactor={0.06}
        minDistance={1.5}
        maxDistance={12}
      />
    </>
  );
}

function Loading() {
  return (
    <Html center>
      <div className="rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-emerald-200 backdrop-blur-xl">
        ĐANG TẢI MOSGUARDX STORY 3D
      </div>
    </Html>
  );
}

export default function ProductStoryViewer(props: Props) {
  return (
    <Canvas
      camera={{ position: [-1.7, 1.85, 3.4], fov: 36, near: 0.01, far: 120 }}
      dpr={1}
      frameloop="always"
      gl={{
        alpha: false,
        antialias: false,
        powerPreference: "high-performance",
      }}
    >
      <Suspense fallback={<Loading />}>
        <StoryScene {...props} />
        <Environment preset="city" environmentIntensity={0.25} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
