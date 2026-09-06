"use client";

/*
 * Three.js objects are intentionally animated through mutable refs. React's
 * immutability rule cannot distinguish those scene-graph mutations from React
 * state mutation, so it is disabled only for this imperative 3D adapter.
 */
/* eslint-disable react-hooks/immutability, react-hooks/set-state-in-effect */

import {
  Bounds,
  Environment,
  Html,
  Line,
  OrbitControls,
  useBounds,
  useGLTF,
  useTexture,
  } from "@react-three/drei"; import { Canvas,
  ThreeEvent,
  useFrame,
  useThree,
  createPortal } from "@react-three/fiber"; import { Suspense,
  useEffect,
  useMemo,
  useRef,
  useState } from "react"; import {   Box3,
  Color,
  Group,
  Material,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PointLight,
  Vector2,
  Vector3,
  DoubleSide,
} from "three";

import MosquitoSwarm from "./mosquito-swarm";
import type { MosquitoFlightPhase, MosquitoFlightState } from "./mosquito-swarm";
import { PRODUCT_PARTS, ProductPart, ProductPartId } from "./product-catalog";

type MosguardXViewerProps = {
  shellOpacity: number;
  resetSignal: number;
  mosquitoActive: boolean;
  resetCameraSignal?: number;
  mosquitoWave: number;
  cameraHandoffSignal?: number;
  onCameraHandoffReady?: () => void;
  onPartHover: (part: ProductPart | null) => void;
  onReset: () => void;
  onReleaseMosquitoes: () => void;
  onMosquitoPhaseChange?: (phase: MosquitoFlightPhase) => void;
  onMosquitoCapture?: (capture: Product3DCapture) => void;
  onMosquitoComplete: () => void;
};

export type Product3DCapture = {
  id: string;
  imageUrl: string;
  capturedAt: string;
  sourceNode: "MGX_CAMERA";
  simulation: true;
};

type PreparedModel = {
  root: Group;
  parts: Map<ProductPartId, Object3D>;
  holders: Map<ProductPartId, Group>;
  lidHolder: Group | null;
  size: number;
  spawn: readonly [number, number, number];
  approach: readonly [number, number, number];
  target: readonly [number, number, number];
  capture: readonly [number, number, number];
  cameraFocus: readonly [number, number, number];
  cameraFront: readonly [number, number, number];
  bait: readonly [number, number, number];
  fan: readonly [number, number, number];
  exit: readonly [number, number, number];
  debugNodes: {
    inlet: string;
    camera: string;
    fan: string;
  };
};

const MODEL_URL = "/models/mosguardx/web.gltf";
const EXPLODED_SPREAD = 1.4;

// Camera tuning values are fractions of the complete CAD model size.
const CAMERA_VIEW = {
  resetRear: {
    x: 0,
    y: 0.18,
    z: 2.5,
    targetY: 0.025,
    speed: 1.25,
  },
  mosquitoFollow: {
    x: 0.16,
    y: 0.13,
    approachDistance: 0.95,
    inletDistance: 0.72,
    imagingDistance: 0.38,
    fanDistance: 0.52,
    exitDistance: 0.82,
    speed: 2.0,
  },
} as const;

function normalizeName(value: string) {
  return value.trim().toLowerCase().replace(/[\s.-]+/g, "_");
}

function nearestBoundsFaceDirection(point: Vector3, bounds: Box3) {
  const candidates = [
    { distance: Math.abs(point.x - bounds.min.x), direction: new Vector3(-1, 0, 0) },
    { distance: Math.abs(bounds.max.x - point.x), direction: new Vector3(1, 0, 0) },
    { distance: Math.abs(point.z - bounds.min.z), direction: new Vector3(0, 0, -1) },
    { distance: Math.abs(bounds.max.z - point.z), direction: new Vector3(0, 0, 1) },
  ];

  candidates.sort((a, b) => a.distance - b.distance);
  return candidates[0].direction;
}

function findNamedObject(
  objects: Map<string, Object3D>,
  aliases: readonly string[],
) {
  return aliases
    .map((name) => objects.get(normalizeName(name)))
    .find((object): object is Object3D => Boolean(object));
}

function cloneMaterial(material: Material | Material[]) {
  return Array.isArray(material)
    ? material.map((entry) => entry.clone())
    : material.clone();
}

function depthOf(object: Object3D) {
  let depth = 0;
  let current: Object3D | null = object;

  while (current.parent) {
    depth += 1;
    current = current.parent;
  }

  return depth;
}

function prepareModel(source: Object3D): PreparedModel {
  const root = source.clone(true) as Group;
  root.name = "MGX_Interactive_Root";
  root.rotateY(Math.PI);
  root.updateMatrixWorld(true);

  // The current CAD export contains the ESP32 assembly twice. The first copy
  // is displaced outside the enclosure, while the suffixed copy is the one
  // mounted inside. Hide only when both copies exist so future clean exports
  // that contain a single assembly continue to work.
  const cadObjects = new Map<string, Object3D>();
  root.traverse((object) => {
    if (object.name) cadObjects.set(normalizeName(object.name), object);
  });

  const displacedElectronics = cadObjects.get(normalizeName("01_ELECTRONICS"));
  const mountedElectronics = cadObjects.get(normalizeName("01_ELECTRONICS001"));
  const displacedProcessor = cadObjects.get(
    normalizeName("XIAO-ESP32S3-Sense v24"),
  );
  const mountedProcessor = cadObjects.get(
    normalizeName("XIAO-ESP32S3-Sense v001"),
  );

  if (displacedElectronics && mountedElectronics) {
    displacedElectronics.visible = false;
  }

  if (displacedProcessor && mountedProcessor) {
    displacedProcessor.visible = false;
  }

  root.updateMatrixWorld(true);

  const fullBounds = new Box3().setFromObject(root);
  const center = fullBounds.getCenter(new Vector3());
  const fullSize = fullBounds.getSize(new Vector3());
  const modelSize = Math.max(fullSize.x, fullSize.y, fullSize.z) || 1;
  root.position.sub(center);
  root.updateMatrixWorld(true);

  const namedObjects = new Map<string, Object3D>();
  root.traverse((object) => {
    if (object.name) namedObjects.set(normalizeName(object.name), object);

    if (object instanceof Mesh) {
      object.material = cloneMaterial(object.material);
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  const parts = new Map<ProductPartId, Object3D>();
  const holders = new Map<ProductPartId, Group>();

  for (const part of PRODUCT_PARTS) {
    const found = part.nodeNames
      .map((name) => namedObjects.get(normalizeName(name)))
      .find(Boolean);

    if (!found) continue;
    parts.set(part.id, found);
  }

  const missingParts = PRODUCT_PARTS.filter((part) => !parts.has(part.id));
  if (missingParts.length > 0) {
    console.warn(
      "[MosGuardX 3D] Các node CAD chưa được tìm thấy:",
      missingParts.map((part) => ({
        part: part.label,
        expectedNames: part.nodeNames,
      })),
    );
  }

  let lidHolder: Group | null = null;
  const lid = parts.get("lid");

  if (lid) {
    lidHolder = new Group();
    lidHolder.name = "MGX_Removable_Lid";
    root.add(lidHolder);
    lidHolder.attach(lid);
  }

  for (const part of PRODUCT_PARTS) {
    if (part.interaction !== "explode") continue;
    const object = parts.get(part.id);
    if (!object) continue;

    const holder = new Group();
    holder.name = `MGX_Explode_${part.id}`;
    root.add(holder);
    holder.attach(object);
    holders.set(part.id, holder);
  }

  // Flight markers are resolved directly from CAD aliases instead of relying
  // only on the product catalog. This keeps the route working across exports
  // that use either MGX_* names or Fusion's original component names.
  const fan =
    findNamedObject(namedObjects, ["MGX_Fan", "MGX_fan", "Fan"]) ??
    parts.get("fan");
  const grille =
    findNamedObject(namedObjects, ["MGX_Grille", "MGX_Inlet", "Grille"]) ??
    parts.get("grille");
  const attractLed =
    findNamedObject(namedObjects, [
      "MGX_LED",
      "led",
      "MGX_LED_Attract",
      "MGX_LED_UV",
      "LED_Attract",
    ]) ?? parts.get("attractLed");
  const cameraModule =
    findNamedObject(namedObjects, [
      "MGX_CAMERA",
      "MGX_Camera",
      "Camer Module001",
      "Camera Module001",
      "Camer Module",
      "Camera Module",
      "MGX_ESP32_CAM",
      "ESP32_CAM",
    ]) ?? parts.get("camera");

  // MGX_BOX is the removable bait module in the current CAD export.
  // For the MVP animation it is also the visual PPF-contact waypoint:
  // each mosquito changes to purple only after physically reaching this point.
  const baitBox =
    findNamedObject(namedObjects, [
      "MGX_BOX",
      "MGX_BAIT",
      "MGX_Bait",
      "BaitBox",
      "Bait Box",
    ]) ?? parts.get("baitBox");

  const inlet = attractLed ?? grille ?? fan;
  const inletCenter = inlet
    ? new Box3().setFromObject(inlet).getCenter(new Vector3())
    : new Vector3(0, -modelSize * 0.04, 0);
  const fanCenter = fan
    ? new Box3().setFromObject(fan).getCenter(new Vector3())
    : inletCenter.clone();
  const centeredBounds = new Box3().setFromObject(root);
  const inletOutward = nearestBoundsFaceDirection(inletCenter, centeredBounds);
  const approachCenter = inletCenter
    .clone()
    .addScaledVector(inletOutward, modelSize * 0.22)
    .add(new Vector3(0, modelSize * 0.12, 0));
  const spawnCenter = approachCenter
    .clone()
    .addScaledVector(inletOutward, modelSize * 0.1)
    .add(new Vector3(0, modelSize * 0.48, 0));

  // Resolve the outside direction from the enclosure face nearest MGX_LED.
  // This remains correct when a new CAD export rotates or mirrors the model:
  // mosquitoes start above/outside, approach the face, then cross the LED.

  // Keep the physical camera center separate from the mosquito imaging zone.
  // Handoff must zoom to the real MGX_CAMERA, not to the shifted capture zone.
  const cameraFocusCenter = cameraModule
    ? new Box3().setFromObject(cameraModule).getCenter(new Vector3())
    : fanCenter.clone().add(new Vector3(0, modelSize * 0.16, 0));

  const captureCenter = cameraFocusCenter.clone();

  const baitCenter = baitBox
    ? new Box3().setFromObject(baitBox).getCenter(new Vector3())
    : captureCenter.clone().lerp(fanCenter, 0.62);

    // Dịch vùng muỗi được chụp sang bên phải camera.
  captureCenter.add(
    new Vector3(
      modelSize * 0.05, // sang phải
      modelSize * 0.0, // lên/xuống
      modelSize * 0.0, // gần/xa camera
    ),
  );

  // Front/lens direction of MGX_CAMERA.
  // The capture zone sits in front of the lens, so cameraFocus -> captureCenter
  // gives a stable frontal viewing axis.
  const cameraFrontDirection = captureCenter
    .clone()
    .sub(cameraFocusCenter);

  if (cameraFrontDirection.lengthSq() < 0.000001) {
    cameraFrontDirection.set(1, 0, 0);
  }

  cameraFrontDirection.normalize();

// Bay thẳng từ tâm quạt qua lỗ thoát phía bên phải.
  const exitCenter = fanCenter
    .clone()
    .add(
      new Vector3(
        modelSize * 3.6, // khoảng cách sang phải
        modelSize * 0.5,  // điều chỉnh độ cao lỗ thoát
        modelSize * 0.0,  // điều chỉnh trước/sau
      ),
    );

  return {
    root,
    parts,
    holders,
    lidHolder,
    size: modelSize,
    spawn: [spawnCenter.x, spawnCenter.y, spawnCenter.z],
    approach: [approachCenter.x, approachCenter.y, approachCenter.z],
    target: [inletCenter.x, inletCenter.y, inletCenter.z],
    capture: [captureCenter.x, captureCenter.y, captureCenter.z],
    cameraFocus: [cameraFocusCenter.x, cameraFocusCenter.y, cameraFocusCenter.z],
    cameraFront: [
      cameraFrontDirection.x,
      cameraFrontDirection.y,
      cameraFrontDirection.z,
    ],
    bait: [baitCenter.x, baitCenter.y, baitCenter.z],
    fan: [fanCenter.x, fanCenter.y, fanCenter.z],
    exit: [exitCenter.x, exitCenter.y, exitCenter.z],
    debugNodes: {
      inlet: attractLed?.name || "fallback: grille/fan",
      camera: cameraModule?.name || "fallback: fan offset",
      fan: fan?.name || "fallback: inlet",
    },
  };
}

const DEBUG_POINT_STYLES = [
  ["SPAWN", "#f97316"],
  ["APPROACH", "#facc15"],
  ["MGX_LED", "#c084fc"],
  ["MGX_CAMERA", "#38bdf8"],
  ["MGX_BOX / PPF", "#a855f7"],
  ["FAN", "#22c55e"],
  ["EXIT", "#ef4444"],
] as const;

function FlightDebugPath({ prepared }: { prepared: PreparedModel }) {
  const points = [
    prepared.spawn,
    prepared.approach,
    prepared.target,
    prepared.capture,
    prepared.bait,
    prepared.fan,
    prepared.exit,
  ];

  return (
    <group renderOrder={1000}>
      <Line
        points={points}
        color="#f8fafc"
        lineWidth={1.5}
        dashed
        dashSize={prepared.size * 0.025}
        gapSize={prepared.size * 0.015}
        depthTest={false}
      />

      {points.map((point, index) => (
        <group key={DEBUG_POINT_STYLES[index][0]} position={point}>
          <mesh>
            <sphereGeometry args={[prepared.size * 0.014, 12, 8]} />
            <meshBasicMaterial
              color={DEBUG_POINT_STYLES[index][1]}
              depthTest={false}
              toneMapped={false}
            />
          </mesh>
          <Html center position={[0, prepared.size * 0.04, 0]} zIndexRange={[80, 0]}>
            <span
              style={{ borderColor: DEBUG_POINT_STYLES[index][1] }}
              className="whitespace-nowrap rounded border bg-black/85 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-white"
            >
              {index + 1}. {DEBUG_POINT_STYLES[index][0]}
            </span>
          </Html>
        </group>
      ))}
    </group>
  );
}

function objectBelongsTo(candidate: Object3D, root: Object3D) {
  let current: Object3D | null = candidate;

  while (current) {
    if (current === root) return true;
    current = current.parent;
  }

  return false;
}

function applyHighlight(object: Object3D, highlighted: boolean, accent: string) {
  object.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];

    materials.forEach((material) => {
      const standard = material as MeshStandardMaterial;
      if (!standard.emissive) return;

      if (!standard.userData.mgxOriginalEmissive) {
        standard.userData.mgxOriginalEmissive = standard.emissive.getHex();
        standard.userData.mgxOriginalEmissiveIntensity = standard.emissiveIntensity;
      }

      if (highlighted) {
        standard.emissive.copy(new Color(accent));
        standard.emissiveIntensity = 0.23;
      } else {
        standard.emissive.setHex(standard.userData.mgxOriginalEmissive as number);
        standard.emissiveIntensity = standard.userData.mgxOriginalEmissiveIntensity as number;
      }

      standard.needsUpdate = true;
    });
  });
}

function LoadingModel() {
  return (
    <Html center>
      <div className="whitespace-nowrap rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-emerald-300 backdrop-blur-xl">
        ĐANG TẢI MÔ HÌNH 3D
      </div>
    </Html>
  );
}

function CameraCaptureEffect({
  point,
  size,
  signal,
}: {
  point: readonly [number, number, number];
  size: number;
  signal: number;
}) {
  const ringRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);
  const elapsed = useRef(-1);
  const { invalidate } = useThree();

  useEffect(() => {
    if (signal === 0) return;
    elapsed.current = 0;
    if (ringRef.current) ringRef.current.visible = true;
    invalidate();
  }, [invalidate, signal]);

  useFrame((_, delta) => {
    if (elapsed.current < 0) return;

    elapsed.current += Math.min(delta, 0.05);
    const progress = MathUtils.clamp(elapsed.current / 0.72, 0, 1);
    const flash = Math.sin(progress * Math.PI);

    if (lightRef.current) lightRef.current.intensity = flash * 18;

    if (ringRef.current) {
      const ringScale = MathUtils.lerp(0.4, 3.2, progress);
      ringRef.current.scale.setScalar(ringScale);
      (ringRef.current.material as MeshBasicMaterial).opacity =
        (1 - progress) * 0.82;
    }

    if (progress >= 1) {
      elapsed.current = -1;
      if (lightRef.current) lightRef.current.intensity = 0;
      if (ringRef.current) ringRef.current.visible = false;
      return;
    }

    invalidate();
  });

  const position: [number, number, number] = [point[0], point[1], point[2]];

  return (
    <>
      <pointLight
        ref={lightRef}
        position={position}
        color="#d9fff4"
        intensity={0}
        distance={size * 1.4}
        decay={2}
      />
      <mesh ref={ringRef} position={position} renderOrder={80} visible={false}>
        <sphereGeometry args={[size * 0.055, 18, 12]} />
        <meshBasicMaterial
          color="#ecfeff"
          transparent
          opacity={0}
          depthTest={false}
          wireframe
          toneMapped={false}
        />
      </mesh>
    </>
  );
}



function MgxLogoOnLid({ prepared }: { prepared: PreparedModel }) {
  const logoTexture = useTexture("/branding/mgx-logo.png");

  const placement = useMemo(() => {
    const lid = prepared.parts.get("lid");
    const holder = prepared.lidHolder;

    if (!lid || !holder) return null;

    prepared.root.updateMatrixWorld(true);

    const worldBounds = new Box3().setFromObject(lid);
    const worldCenter = worldBounds.getCenter(new Vector3());
    const worldSize = worldBounds.getSize(new Vector3());

    const frontWorld = new Vector3(
      worldCenter.x,
      worldCenter.y,
      worldBounds.max.z,
    );

    const frontLocal = holder.worldToLocal(frontWorld.clone());

    const width = Math.min(
      Math.max(worldSize.x, worldSize.y) * 0.33,
      prepared.size * 0.40,
    );
    const height = width / 1.8;

    return {
      position: [
        frontLocal.x,
        frontLocal.y,
        frontLocal.z - prepared.size * 0.006,
      ] as [number, number, number],
      width,
      height,
    };
  }, [prepared]);

  if (!placement || !prepared.lidHolder) return null;

  return createPortal(
    <mesh
      position={placement.position}
      rotation={[0, Math.PI, 0]}
      renderOrder={30}
      userData={{ mgxBranding: "lid-logo-rear" }}
    >
      <planeGeometry args={[placement.width, placement.height]} />
      <meshBasicMaterial
        map={logoTexture}
        transparent
        alphaTest={0.02}
        side={DoubleSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>,
    prepared.lidHolder,
  );
}

function InteractiveModel({
  shellOpacity,
  resetSignal,
  mosquitoActive,
  mosquitoWave,
    cameraHandoffSignal = 0,
  onCameraHandoffReady,
onPartHover,
  onReset,
  onReleaseMosquitoes,
  onMosquitoPhaseChange,
  onMosquitoCapture,
  resetCameraSignal = 0,
  onMosquitoComplete,
}: MosguardXViewerProps) {
  const { scene } = useGLTF(MODEL_URL);
  const prepared = useMemo(() => prepareModel(scene), [scene]);
  const [hoveredId, setHoveredId] = useState<ProductPartId | null>(null);
  const exploded = useRef(new Map<ProductPartId, boolean>());
  const [lidOpen, setLidOpen] = useState(false);
  const [capturePulseSignal, setCapturePulseSignal] = useState(0);
  const initialized = useRef(false);
  const resetting = useRef(false);
  const resetCameraActive = useRef(false);
  const cameraHandoffActive = useRef(false);
  const cameraHandoffReadySent = useRef(false);
  const cameraHandoffLastSignal = useRef(0);
  const cameraHandoffHoldStarted = useRef<number | null>(null);
  const cameraHandoffStartedAt = useRef(0);
  const { camera, gl, invalidate, pointer, raycaster } = useThree();
  const controls = useThree((state) => state.controls) as unknown as
    | { target: Vector3; update: () => void }
    | undefined;
  const bounds = useBounds();
  const flightState = useRef<MosquitoFlightState>({
    active: false,
    progress: 0,
    focus: new Vector3(),
    phase: "opening",
  });
  const captureSent = useRef(false);
  const debugFocusRef = useRef<Mesh>(null);
  const debugLogged = useRef(false);
  const debugFlight =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("debugFlight") === "1";

  useEffect(() => {
    if (!debugFlight || debugLogged.current) return;
    debugLogged.current = true;

    console.info("[MosGuardX flight debug] CAD nodes", prepared.debugNodes);
    console.table([
      { point: "SPAWN", xyz: prepared.spawn.join(", ") },
      { point: "APPROACH", xyz: prepared.approach.join(", ") },
      { point: "MGX_LED", xyz: prepared.target.join(", ") },
      { point: "MGX_CAMERA", xyz: prepared.capture.join(", ") },
      { point: "MGX_BOX / PPF", xyz: prepared.bait.join(", ") },
      { point: "FAN", xyz: prepared.fan.join(", ") },
      { point: "EXIT", xyz: prepared.exit.join(", ") },
    ]);
  }, [debugFlight, prepared]);

  const hitParts = useMemo(
    () =>
      PRODUCT_PARTS.map((part) => ({ part, object: prepared.parts.get(part.id) }))
        .filter((entry): entry is { part: ProductPart; object: Object3D } => Boolean(entry.object))
        .sort((a, b) => depthOf(b.object) - depthOf(a.object)),
    [prepared.parts],
  );

  const findPart = (object: Object3D) =>
    hitParts.find((entry) => objectBelongsTo(object, entry.object))?.part ?? null;

  useEffect(() => {
    const shellParts = [prepared.parts.get("shellBody"), prepared.parts.get("lid")].filter(
      Boolean,
    ) as Object3D[];

    shellParts.forEach((part) => {
      part.visible = true;
      part.traverse((child) => {
        if (!(child instanceof Mesh)) return;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          material.transparent = shellOpacity < 1;
          material.opacity = shellOpacity;
          material.depthWrite = shellOpacity >= 1;
          material.needsUpdate = true;
        });
      });
    });

    invalidate();
  }, [invalidate, prepared.parts, shellOpacity]);

  useEffect(() => {
    hitParts.forEach(({ part, object }) => {
      applyHighlight(object, part.id === hoveredId, part.accent);
    });
    invalidate();
  }, [hitParts, hoveredId, invalidate]);

  useEffect(() => {
    const initialLoad = !initialized.current;
    const hadExplodedParts = Array.from(exploded.current.values()).some(Boolean);
    initialized.current = true;

    exploded.current.clear();
    setHoveredId(null);
    onPartHover(null);

    if (initialLoad) {
      camera.position.set(0, 0, -5);
      camera.up.set(0, 1, 0);
      camera.lookAt(0, 0, 0);
    }

    resetting.current = !initialLoad;
    resetCameraActive.current = false;

    // Use a deliberately slower return. The lid begins closing only after the
    // exploded component holders have nearly reached their assembled poses.
    const lidDelay = initialLoad || !hadExplodedParts ? 0 : 1600;
    const lidTimer = window.setTimeout(() => {
      setLidOpen(false);
      invalidate();
    }, lidDelay);

    // Initial load needs one fit because CAD units vary. Subsequent resets keep
    // the user's exact orbit and zoom position.
    const initialFitTimer = window.setTimeout(() => {
      if (initialLoad) bounds.refresh(prepared.root).clip().fit();
      invalidate();
    }, 120);

    const resetDoneTimer = window.setTimeout(() => {
      resetting.current = false;
      // Camera returns only after every component has finished moving home and
      // the lid has closed, never during the component reset animation.
      if (!initialLoad) resetCameraActive.current = true;
      invalidate();
    }, initialLoad ? 0 : lidDelay + 1400);

    return () => {
      window.clearTimeout(lidTimer);
      window.clearTimeout(initialFitTimer);
      window.clearTimeout(resetDoneTimer);
    };
  }, [bounds, camera, invalidate, onPartHover, prepared.root, resetSignal]);

  useEffect(() => {
    captureSent.current = false;
    flightState.current.active = false;

    // Every simulation begins assembled. Once the release phase starts, slide
    // the lid completely away and let the swarm wait for that motion to finish.
    if (mosquitoActive) {
      resetCameraActive.current = false;
      setLidOpen(true);
    }
    invalidate();
  }, [invalidate, mosquitoActive, mosquitoWave]);

  useEffect(() => {
    if (cameraHandoffSignal === 0) return;

    // React Strict Mode may execute effects more than once in development.
    // The same signal must never restart the cinematic handoff.
    if (cameraHandoffLastSignal.current === cameraHandoffSignal) return;
    cameraHandoffLastSignal.current = cameraHandoffSignal;

    cameraHandoffReadySent.current = false;
    cameraHandoffHoldStarted.current = null;
    cameraHandoffActive.current = true;
    cameraHandoffStartedAt.current = performance.now();
    resetCameraActive.current = false;
    setLidOpen(true);
    invalidate();
  }, [cameraHandoffSignal, invalidate]);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer as Vector2, camera);
      const hitDevice = raycaster.intersectObject(prepared.root, true).length > 0;

      if (hitDevice) onReset();
      else onReleaseMosquitoes();
    };

    canvas.addEventListener("contextmenu", handleContextMenu);
    return () => canvas.removeEventListener("contextmenu", handleContextMenu);
  }, [camera, gl, onReleaseMosquitoes, onReset, pointer, prepared.root, raycaster]);

  useFrame((_, delta) => {
    const dampingRate = resetting.current ? 2.6 : 7.4;
    const damping = 1 - Math.exp(-delta * dampingRate);
    let animating = false;

    prepared.holders.forEach((holder, id) => {
      const part = PRODUCT_PARTS.find((entry) => entry.id === id);
      if (!part) return;
      const active = exploded.current.get(id) ?? false;
      const target = new Vector3(...part.explodedOffset).multiplyScalar(
        prepared.size * (active ? EXPLODED_SPREAD : 0),
      );

      holder.position.lerp(target, damping);
      if (holder.position.distanceToSquared(target) > prepared.size * prepared.size * 0.0000001) {
        animating = true;
      }
    });

    if (prepared.lidHolder) {
      // mosquitoActive guarantees that the removable lid stays fully open for
      // the complete internal airflow demo. Reset still closes it normally.
      const shouldOpenLid = lidOpen || mosquitoActive;
      const target = new Vector3(-1.05, 0.42, -0.5).multiplyScalar(
        prepared.size * (shouldOpenLid ? 1 : 0),
      );

      prepared.lidHolder.position.lerp(target, damping);
      if (
        prepared.lidHolder.position.distanceToSquared(target) >
        prepared.size * prepared.size * 0.0000001
      ) {
        animating = true;
      }
    }

    // Reliable close-up handoff to the PHYSICAL MGX_CAMERA.
    // It is time-driven rather than waiting forever for an epsilon threshold.
    if (cameraHandoffActive.current && !mosquitoActive) {
      const cameraTarget = new Vector3(
        prepared.cameraFocus[0],
        prepared.cameraFocus[1],
        prepared.cameraFocus[2],
      );

      // Approach the lens head-on instead of using the previous viewer angle.
      const cameraFront = new Vector3(
        prepared.cameraFront[0],
        prepared.cameraFront[1],
        prepared.cameraFront[2],
      ).normalize();

      const closePosition = cameraTarget
        .clone()
        .addScaledVector(cameraFront, prepared.size * 0.20)
        .add(new Vector3(0, prepared.size * 0.010, 0));

      const elapsedMs = performance.now() - cameraHandoffStartedAt.current;
      const zoomDamping = 1 - Math.exp(-delta * 2.05);

      camera.position.lerp(closePosition, zoomDamping);

      if (controls) {
        controls.target.lerp(cameraTarget, zoomDamping);
        controls.update();
      } else {
        camera.lookAt(cameraTarget);
      }

      camera.updateMatrixWorld();

      // At 1.25s, snap and lock exactly on the camera.
      if (elapsedMs >= 1250) {
        camera.position.copy(closePosition);

        if (controls) {
          controls.target.copy(cameraTarget);
          controls.update();
        } else {
          camera.lookAt(cameraTarget);
        }

        camera.updateMatrixWorld();
      }

      // Hold camera in frame, then guarantee shutter/callback.
      if (elapsedMs >= 1950 && !cameraHandoffReadySent.current) {
        cameraHandoffReadySent.current = true;
        setCapturePulseSignal((value) => value + 1);

        window.setTimeout(() => {
          onCameraHandoffReady?.();
        }, 260);

        cameraHandoffActive.current = false;
      } else {
        animating = true;
      }
    }

    if (resetCameraActive.current && !mosquitoActive) {
      const rearTarget = new Vector3(
        0,
        prepared.size * CAMERA_VIEW.resetRear.targetY,
        0,
      );
      const rearPosition = new Vector3(
        prepared.size * CAMERA_VIEW.resetRear.x,
        prepared.size * CAMERA_VIEW.resetRear.y,
        prepared.size * CAMERA_VIEW.resetRear.z,
      );
      const cameraDamping =
        1 - Math.exp(-delta * CAMERA_VIEW.resetRear.speed);

      camera.position.lerp(rearPosition, cameraDamping);
      if (controls) {
        controls.target.lerp(rearTarget, cameraDamping);
        controls.update();
      } else {
        camera.lookAt(rearTarget);
      }
      camera.updateMatrixWorld();

      const cameraSettled =
        camera.position.distanceToSquared(rearPosition) <
        prepared.size * prepared.size * 0.000002;
      const targetSettled =
        !controls ||
        controls.target.distanceToSquared(rearTarget) <
          prepared.size * prepared.size * 0.000002;

      if (cameraSettled && targetSettled) {
        camera.position.copy(rearPosition);
        if (controls) {
          controls.target.copy(rearTarget);
          controls.update();
        } else {
          camera.lookAt(rearTarget);
        }
        resetCameraActive.current = false;
      } else {
        animating = true;
      }
    }

    if (mosquitoActive && flightState.current.active) {
      const progress = flightState.current.progress;
      const focus = flightState.current.focus;
      const followDamping =
        1 - Math.exp(-delta * CAMERA_VIEW.mosquitoFollow.speed);
      let distance =
        prepared.size * CAMERA_VIEW.mosquitoFollow.approachDistance;

      if (progress < 0.3) {
        const descendProgress = MathUtils.smoothstep(progress / 0.3, 0, 1);
        distance = MathUtils.lerp(
          prepared.size * CAMERA_VIEW.mosquitoFollow.approachDistance,
          prepared.size * CAMERA_VIEW.mosquitoFollow.inletDistance,
          descendProgress,
        );
      } else if (progress < 0.62) {
        const ppfApproach = MathUtils.smoothstep((progress - 0.3) / 0.32, 0, 1);
        distance = MathUtils.lerp(
          prepared.size * CAMERA_VIEW.mosquitoFollow.inletDistance,
          prepared.size * CAMERA_VIEW.mosquitoFollow.imagingDistance,
          ppfApproach,
        );
      } else if (progress < 0.8) {
        // Keep a close framing from PPF contact through the imaging chamber.
        distance =
          prepared.size * CAMERA_VIEW.mosquitoFollow.imagingDistance;
      } else if (progress < 0.9) {
        const fanProgress = MathUtils.smoothstep((progress - 0.8) / 0.1, 0, 1);
        distance = MathUtils.lerp(
          prepared.size * CAMERA_VIEW.mosquitoFollow.imagingDistance,
          prepared.size * CAMERA_VIEW.mosquitoFollow.fanDistance,
          fanProgress,
        );
      } else {
        const exitProgress = MathUtils.smoothstep((progress - 0.9) / 0.1, 0, 1);
        distance = MathUtils.lerp(
          prepared.size * CAMERA_VIEW.mosquitoFollow.fanDistance,
          prepared.size * CAMERA_VIEW.mosquitoFollow.exitDistance,
          exitProgress,
        );
      }

      const desiredCameraPosition = focus
        .clone()
        .add(
          new Vector3(
            prepared.size * CAMERA_VIEW.mosquitoFollow.x,
            prepared.size * CAMERA_VIEW.mosquitoFollow.y,
            distance,
          ),
        );

      camera.position.lerp(desiredCameraPosition, followDamping);
      if (controls) {
        controls.target.lerp(focus, followDamping);
        controls.update();
      } else {
        camera.lookAt(focus);
      }
      camera.updateMatrixWorld();
      animating = true;
    }

    if (debugFocusRef.current) {
      debugFocusRef.current.visible = debugFlight && flightState.current.active;
      if (flightState.current.active) {
        debugFocusRef.current.position.copy(flightState.current.focus);
      }
    }

    if (animating) invalidate();
  });

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const part = findPart(event.object);
    const nextId = part?.id ?? null;

    if (nextId === hoveredId) return;
    setHoveredId(nextId);
    onPartHover(part);
    gl.domElement.style.cursor = part ? "pointer" : "grab";
  };

  const clearHover = () => {
    setHoveredId(null);
    onPartHover(null);
    gl.domElement.style.cursor = "grab";
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    const part = findPart(event.object);
    if (!part) return;

    if (part.interaction === "lid") {
      setLidOpen((current) => !current);
    } else if (part.interaction === "explode") {
      exploded.current.set(part.id, !(exploded.current.get(part.id) ?? false));
    }

    invalidate();
  };

  return (
    <>
      <primitive
        object={prepared.root}
        onPointerMove={handlePointerMove}
        onPointerOut={clearHover}
        onClick={handleClick}
      />
<MgxLogoOnLid prepared={prepared} />

      {debugFlight && <FlightDebugPath prepared={prepared} />}

      {debugFlight && (
        <mesh ref={debugFocusRef} renderOrder={1001} visible={false}>
          <sphereGeometry args={[prepared.size * 0.021, 14, 10]} />
          <meshBasicMaterial color="#ffffff" depthTest={false} toneMapped={false} />
        </mesh>
      )}

      <CameraCaptureEffect
        point={cameraHandoffSignal > 0 ? prepared.cameraFocus : prepared.capture}
        size={prepared.size}
        signal={capturePulseSignal}
      />

      <MosquitoSwarm
        active={mosquitoActive}
        wave={mosquitoWave}
        debug={debugFlight}
        spawn={prepared.spawn}
        approach={prepared.approach}
        target={prepared.target}
        capture={prepared.capture}
        bait={prepared.bait}
        fan={prepared.fan}
        exit={prepared.exit}
        unit={prepared.size * 0.035}
        flightState={flightState}
        onPhaseChange={onMosquitoPhaseChange}
        onCapture={() => {
          if (captureSent.current) return;
          captureSent.current = true;
          setCapturePulseSignal((value) => value + 1);

          // Wait until the current Three.js frame has been painted. Reading the
          // canvas directly inside useFrame would capture the previous frame.
          window.requestAnimationFrame(() => {
            const imageUrl = gl.domElement.toDataURL("image/jpeg", 0.86);
            if (!imageUrl || imageUrl === "data:,") return;

            onMosquitoCapture?.({
              id: `product-3d-demo-${Date.now()}`,
              imageUrl,
              capturedAt: new Date().toISOString(),
              sourceNode: "MGX_CAMERA",
              simulation: true,
            });
          });
        }}
        onComplete={() => {
          // The complete flight is the second valid camera-reset boundary.
          resetCameraActive.current = true;
          invalidate();
          onMosquitoComplete();
        }}
      />
    </>
  );
}

export default function MosguardXViewer(props: MosguardXViewerProps) {
  return (
    <Canvas
      className="mgx-product-canvas"
      camera={{ position: [0, 0, -5], fov: 34, near: 0.01, far: 2000 }}
      dpr={1}
      frameloop="demand"
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
      }}
      shadows={false}
    >
      <ambientLight intensity={0.72} />
      <directionalLight position={[5, 8, -7]} intensity={2.35} />
      <directionalLight position={[-4, 2, 5]} intensity={1.15} color="#9fffe1" />
      <pointLight position={[0, -4, -3]} intensity={0.45} color="#38bdf8" />

      <Suspense fallback={<LoadingModel />}>
        <Bounds margin={1.4}>
          <InteractiveModel {...props} />
        </Bounds>
        <Environment preset="city" environmentIntensity={0.35} />
      </Suspense>

      <OrbitControls
        makeDefault
        enabled={!props.mosquitoActive && !props.cameraHandoffSignal}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.4}
        zoomSpeed={0.75}
        panSpeed={0.35}
        minDistance={0.008}
        maxDistance={6}
      />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
