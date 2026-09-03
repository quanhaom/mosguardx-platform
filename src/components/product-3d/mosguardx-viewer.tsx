"use client";

/*
 * Three.js objects are intentionally animated through mutable refs. React's
 * immutability rule cannot distinguish those scene-graph mutations from React
 * state mutation, so it is disabled only for this imperative 3D adapter.
 */
/* eslint-disable react-hooks/immutability, react-hooks/set-state-in-effect */

import { Bounds, Environment, Html, OrbitControls, useBounds, useGLTF } from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Box3,
  Color,
  Group,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector2,
  Vector3,
} from "three";

import MosquitoSwarm from "./mosquito-swarm";
import { PRODUCT_PARTS, ProductPart, ProductPartId } from "./product-catalog";

type MosguardXViewerProps = {
  shellOpacity: number;
  resetSignal: number;
  mosquitoActive: boolean;
  mosquitoWave: number;
  onPartHover: (part: ProductPart | null) => void;
  onReset: () => void;
  onReleaseMosquitoes: () => void;
  onMosquitoComplete: () => void;
};

type PreparedModel = {
  root: Group;
  parts: Map<ProductPartId, Object3D>;
  holders: Map<ProductPartId, Group>;
  lidHolder: Group | null;
  size: number;
  target: readonly [number, number, number];
};

const MODEL_URL = "/models/mosguardx/web.gltf";

function normalizeName(value: string) {
  return value.trim().toLowerCase().replace(/[\s.-]+/g, "_");
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

  const fan = parts.get("fan");
  const fanCenter = fan
    ? new Box3().setFromObject(fan).getCenter(new Vector3())
    : new Vector3(0, -modelSize * 0.04, 0);

  return {
    root,
    parts,
    holders,
    lidHolder,
    size: modelSize,
    target: [fanCenter.x, fanCenter.y, fanCenter.z],
  };
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

function InteractiveModel({
  shellOpacity,
  resetSignal,
  mosquitoActive,
  mosquitoWave,
  onPartHover,
  onReset,
  onReleaseMosquitoes,
  onMosquitoComplete,
}: MosguardXViewerProps) {
  const { scene } = useGLTF(MODEL_URL);
  const prepared = useMemo(() => prepareModel(scene), [scene]);
  const [hoveredId, setHoveredId] = useState<ProductPartId | null>(null);
  const exploded = useRef(new Map<ProductPartId, boolean>());
  const [lidOpen, setLidOpen] = useState(false);
  const { camera, gl, invalidate, pointer, raycaster } = useThree();
  const bounds = useBounds();

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
    exploded.current.clear();
    setLidOpen(false);
    setHoveredId(null);
    onPartHover(null);

    camera.position.set(0, 0, -5);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);

    const timer = window.setTimeout(() => {
      bounds.refresh(prepared.root).clip().fit();
      invalidate();
    }, 520);

    return () => window.clearTimeout(timer);
  }, [bounds, camera, invalidate, onPartHover, prepared.root, resetSignal]);

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
    const damping = 1 - Math.exp(-delta * 7.4);
    let animating = false;

    prepared.holders.forEach((holder, id) => {
      const part = PRODUCT_PARTS.find((entry) => entry.id === id);
      if (!part) return;
      const active = exploded.current.get(id) ?? false;
      const target = new Vector3(...part.explodedOffset).multiplyScalar(
        prepared.size * (active ? 1 : 0),
      );

      holder.position.lerp(target, damping);
      if (holder.position.distanceToSquared(target) > prepared.size * prepared.size * 0.0000001) {
        animating = true;
      }
    });

    if (prepared.lidHolder) {
      const target = new Vector3(0.72, 0.28, -0.32).multiplyScalar(
        prepared.size * (lidOpen ? 1 : 0),
      );

      prepared.lidHolder.position.lerp(target, damping);
      if (
        prepared.lidHolder.position.distanceToSquared(target) >
        prepared.size * prepared.size * 0.0000001
      ) {
        animating = true;
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

      <MosquitoSwarm
        active={mosquitoActive}
        wave={mosquitoWave}
        target={prepared.target}
        unit={prepared.size * 0.035}
        onComplete={onMosquitoComplete}
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
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      shadows={false}
    >
      <ambientLight intensity={0.72} />
      <directionalLight position={[5, 8, -7]} intensity={2.35} />
      <directionalLight position={[-4, 2, 5]} intensity={1.15} color="#9fffe1" />
      <pointLight position={[0, -4, -3]} intensity={0.45} color="#38bdf8" />

      <Suspense fallback={<LoadingModel />}>
        <Bounds margin={1.08}>
          <InteractiveModel {...props} />
        </Bounds>
        <Environment preset="city" environmentIntensity={0.35} />
      </Suspense>

      <OrbitControls
        makeDefault
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
