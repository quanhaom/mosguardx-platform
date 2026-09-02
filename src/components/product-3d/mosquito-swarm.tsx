"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  DoubleSide,
  InstancedMesh,
  MathUtils,
  Object3D,
  Vector3,
} from "three";

type MosquitoSwarmProps = {
  active: boolean;
  wave: number;
  target: readonly [number, number, number];
  unit: number;
  onComplete: () => void;
};

const MOSQUITO_COUNT = 18;
const FLIGHT_SECONDS = 7.2;

function seeded(index: number, salt: number) {
  const value = Math.sin(index * 9283.17 + salt * 197.31) * 43758.5453;
  return value - Math.floor(value);
}

export default function MosquitoSwarm({
  active,
  wave,
  target,
  unit,
  onComplete,
}: MosquitoSwarmProps) {
  const bodyRef = useRef<InstancedMesh>(null);
  const leftWingRef = useRef<InstancedMesh>(null);
  const rightWingRef = useRef<InstancedMesh>(null);
  const elapsed = useRef(0);
  const completed = useRef(false);
  const dummy = useMemo(() => new Object3D(), []);
  const { invalidate } = useThree();

  const agents = useMemo(
    () =>
      Array.from({ length: MOSQUITO_COUNT }, (_, index) => ({
        phase: seeded(index, 1) * Math.PI * 2,
        delay: seeded(index, 2) * 1.8,
        start: new Vector3(
          (seeded(index, 3) - 0.5) * 5.4,
          (seeded(index, 4) - 0.35) * 3.8,
          -2.4 - seeded(index, 5) * 2.6,
        ),
      })),
    [],
  );

  useEffect(() => {
    elapsed.current = 0;
    completed.current = false;

    for (const mesh of [bodyRef.current, leftWingRef.current, rightWingRef.current]) {
      if (mesh) mesh.visible = active;
    }

    invalidate();
  }, [active, invalidate, wave]);

  useFrame((_, delta) => {
    if (!active || !bodyRef.current || !leftWingRef.current || !rightWingRef.current) {
      return;
    }

    elapsed.current += Math.min(delta, 0.05);
    const destination = new Vector3(...target);
    let flying = 0;

    agents.forEach((agent, index) => {
      const localTime = elapsed.current - agent.delay;
      const progress = MathUtils.clamp(localTime / FLIGHT_SECONDS, 0, 1);
      const eased = progress * progress * (3 - 2 * progress);

      if (localTime >= 0 && progress < 1) flying += 1;

      const radius = (1 - eased) * unit * (4.4 + seeded(index, 7) * 2.3);
      const angle = agent.phase + localTime * (1.7 + seeded(index, 8));
      const position = agent.start
        .clone()
        .multiplyScalar(unit)
        .lerp(destination, eased);

      position.x += Math.cos(angle) * radius;
      position.y += Math.sin(angle * 1.3) * radius * 0.55;
      position.z += Math.sin(angle) * radius * 0.36;

      const visibleScale = localTime < 0 || progress >= 1 ? 0 : 1;
      const mosquitoSize = unit * (0.42 + seeded(index, 9) * 0.18) * visibleScale;

      dummy.position.copy(position);
      dummy.rotation.set(0.25 * Math.sin(angle), angle + Math.PI / 2, 0);
      dummy.scale.set(mosquitoSize * 0.34, mosquitoSize, mosquitoSize * 0.34);
      dummy.updateMatrix();
      bodyRef.current!.setMatrixAt(index, dummy.matrix);

      const flap = 0.42 + Math.abs(Math.sin(localTime * 34 + agent.phase)) * 0.7;

      dummy.position.copy(position);
      dummy.rotation.set(0.55, angle, flap);
      dummy.scale.set(mosquitoSize * 0.82, mosquitoSize * 0.08, mosquitoSize * 0.38);
      dummy.updateMatrix();
      leftWingRef.current!.setMatrixAt(index, dummy.matrix);

      dummy.rotation.set(-0.55, angle, -flap);
      dummy.updateMatrix();
      rightWingRef.current!.setMatrixAt(index, dummy.matrix);
    });

    bodyRef.current.instanceMatrix.needsUpdate = true;
    leftWingRef.current.instanceMatrix.needsUpdate = true;
    rightWingRef.current.instanceMatrix.needsUpdate = true;

    const finished = elapsed.current > FLIGHT_SECONDS + 1.8 && flying === 0;

    if (finished && !completed.current) {
      completed.current = true;
      bodyRef.current.visible = false;
      leftWingRef.current.visible = false;
      rightWingRef.current.visible = false;
      onComplete();
      return;
    }

    invalidate();
  });

  return (
    <group renderOrder={5}>
      <instancedMesh ref={bodyRef} args={[undefined, undefined, MOSQUITO_COUNT]}>
        <sphereGeometry args={[0.32, 7, 5]} />
        <meshStandardMaterial color="#111827" roughness={0.74} />
      </instancedMesh>

      <instancedMesh ref={leftWingRef} args={[undefined, undefined, MOSQUITO_COUNT]}>
        <planeGeometry args={[0.9, 0.42]} />
        <meshStandardMaterial
          color="#cbd5e1"
          transparent
          opacity={0.55}
          side={DoubleSide}
          depthWrite={false}
        />
      </instancedMesh>

      <instancedMesh ref={rightWingRef} args={[undefined, undefined, MOSQUITO_COUNT]}>
        <planeGeometry args={[0.9, 0.42]} />
        <meshStandardMaterial
          color="#cbd5e1"
          transparent
          opacity={0.55}
          side={DoubleSide}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}
