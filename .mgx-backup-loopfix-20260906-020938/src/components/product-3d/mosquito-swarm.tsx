"use client";

/*
 * Flight data and Three.js instances are updated imperatively on every frame.
 * They intentionally live outside React's render state to avoid 60 renders/s.
 */
/* eslint-disable react-hooks/immutability */

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import {
  Color,
  DoubleSide,
  InstancedMesh,
  MathUtils,
  Object3D,
  Vector3,
} from "three";

type MosquitoSwarmProps = {
  active: boolean;
  wave: number;
  debug?: boolean;
  spawn?: readonly [number, number, number];
  approach?: readonly [number, number, number];
  target?: readonly [number, number, number];
  capture?: readonly [number, number, number];
  bait?: readonly [number, number, number];
  fan?: readonly [number, number, number];
  exit?: readonly [number, number, number];
  unit: number;
  flightState?: MutableRefObject<MosquitoFlightState>;
  onPhaseChange?: (phase: MosquitoFlightPhase) => void;
  onCapture?: () => void;
  onComplete: () => void;
};

export type MosquitoFlightPhase =
  | "opening"
  | "approach"
  | "inlet"
  | "imaging"
  | "bait"
  | "fan"
  | "exit"
  | "complete";

export type MosquitoFlightState = {
  active: boolean;
  progress: number;
  focus: Vector3;
  phase: MosquitoFlightPhase;
};

const MOSQUITO_COUNT = 18;
const FLIGHT_SECONDS = 15;
const LID_OPEN_SECONDS = 1.5;
const LOCAL_FORWARD = new Vector3(0, 1, 0);

// Each mosquito changes colour independently when its own local flight
// reaches the physical MGX_BOX / PPF-contact waypoint.
const PPF_CONTACT_PROGRESS = 0.80;
const NORMAL_BODY_COLOR = new Color("#111827");
const PPF_BODY_COLOR = new Color("#7c3aed");
const NORMAL_WING_COLOR = new Color("#cbd5e1");
const PPF_WING_COLOR = new Color("#ddd6fe");

function seeded(index: number, salt: number) {
  const value = Math.sin(index * 9283.17 + salt * 197.31) * 43758.5453;
  return value - Math.floor(value);
}

function pointVector(
  point: readonly [number, number, number] | undefined,
  fallback = new Vector3(),
) {
  if (
    !point ||
    point.length !== 3 ||
    !point.every((coordinate) => Number.isFinite(coordinate))
  ) {
    return fallback.clone();
  }

  return new Vector3(point[0], point[1], point[2]);
}

export default function MosquitoSwarm({
  active,
  wave,
  debug = false,
  spawn,
  approach,
  target,
  capture,
  bait,
  fan,
  exit,
  unit,
  flightState,
  onPhaseChange,
  onCapture,
  onComplete,
}: MosquitoSwarmProps) {
  const bodyRef = useRef<InstancedMesh>(null);
  const leftWingRef = useRef<InstancedMesh>(null);
  const rightWingRef = useRef<InstancedMesh>(null);
  const elapsed = useRef(0);
  const completed = useRef(false);
  const captured = useRef(false);

  // Once a wave completes it may not restart itself. PPF contact is also
  // latched per individual mosquito.
  const completedWave = useRef<number | null>(null);
  const ppfContacted = useRef<boolean[]>(
    Array.from({ length: MOSQUITO_COUNT }, () => false),
  );
  const currentPhase = useRef<MosquitoFlightPhase>("opening");
  const localFlightState = useRef<MosquitoFlightState>({
    active: false,
    progress: 0,
    focus: new Vector3(),
    phase: "opening",
  });
  const sharedFlightState = flightState ?? localFlightState;
  const dummy = useMemo(() => new Object3D(), []);
  const { invalidate } = useThree();

  const agents = useMemo(
    () =>
      Array.from({ length: MOSQUITO_COUNT }, (_, index) => ({
        phase: seeded(index, 1) * Math.PI * 2,
        delay: seeded(index, 2) * 0.65,
        start: new Vector3(
          (seeded(index, 3) - 0.5) * 5.8,
          (seeded(index, 4) - 0.5) * 2.2,
          (seeded(index, 5) - 0.5) * 3.6,
        ),
      })),
    [],
  );

  useEffect(() => {
    // active=false only hides the finished wave. It must never reset the clock
    // or announce a new opening cycle.
    if (!active) {
      sharedFlightState.current.active = false;

      for (const mesh of [
        bodyRef.current,
        leftWingRef.current,
        rightWingRef.current,
      ]) {
        if (mesh) mesh.visible = false;
      }

      invalidate();
      return;
    }

    // Defensive guard: the same wave id can only run once.
    if (completedWave.current === wave) {
      return;
    }

    elapsed.current = 0;
    completed.current = false;
    captured.current = false;
    ppfContacted.current.fill(false);
    sharedFlightState.current.active = false;
    sharedFlightState.current.progress = 0;
    sharedFlightState.current.phase = "opening";
    currentPhase.current = "opening";
    onPhaseChange?.("opening");

    for (const mesh of [
      bodyRef.current,
      leftWingRef.current,
      rightWingRef.current,
    ]) {
      if (mesh) mesh.visible = true;
    }

    invalidate();
  }, [active, invalidate, onPhaseChange, sharedFlightState, wave]);

  useFrame((_, delta) => {
    if (!active || !bodyRef.current || !leftWingRef.current || !rightWingRef.current) {
      return;
    }

    elapsed.current += Math.min(delta, 0.05);
    // Every waypoint is validated independently. A mixed old/new component
    // version can no longer crash the animation with "is not iterable".
    const destination = pointVector(target);
    const inletApproach = pointVector(approach, destination);
    const spawnPoint = pointVector(spawn, inletApproach);
    const capturePoint = pointVector(capture, destination);
    const baitPoint = pointVector(bait, capturePoint);
    const fanPoint = pointVector(fan, baitPoint);
    const exitPoint = pointVector(exit, fanPoint);
    const swarmFocus = new Vector3();
    const sequenceProgress = MathUtils.clamp(
      (elapsed.current - LID_OPEN_SECONDS) / (FLIGHT_SECONDS + 0.65),
      0,
      1,
    );
    let flying = 0;
    let visibleCount = 0;
    let imagingCount = 0;

    agents.forEach((agent, index) => {
      const localTime = elapsed.current - LID_OPEN_SECONDS - agent.delay;
      const progress = MathUtils.clamp(localTime / FLIGHT_SECONDS, 0, 1);

      if (localTime >= 0 && progress < 1) flying += 1;

      const angle = agent.phase + localTime * (1.7 + seeded(index, 8));
      const position = new Vector3();
      const direction = new Vector3();
      let radius: number;

      if (progress < 0.3) {
        // Stage 1: descend from above the device towards the inlet approach.
        const stage = MathUtils.smoothstep(progress / 0.3, 0, 1);
        const agentSpawn = spawnPoint.clone().addScaledVector(agent.start, unit);
        position.copy(agentSpawn).lerp(inletApproach, stage);
        direction.copy(inletApproach).sub(agentSpawn);
        radius = MathUtils.lerp(
          unit * (4.8 + seeded(index, 7) * 1.8),
          unit * 1.15,
          stage,
        );
      } else if (progress < 0.52) {
        // Stage 2: enter through MGX_LED, the CAD inlet marker.
        const stage = MathUtils.smoothstep((progress - 0.3) / 0.22, 0, 1);
        position.copy(inletApproach).lerp(destination, stage);
        direction.copy(destination).sub(inletApproach);
        radius = MathUtils.lerp(unit * 1.15, unit * 0.06, stage);
      } else if (progress < 0.66) {
        // Stage 3: move into the controlled camera chamber.
        const stage = MathUtils.smoothstep((progress - 0.52) / 0.14, 0, 1);
        position.copy(destination).lerp(capturePoint, stage);
        direction.copy(capturePoint).sub(destination);
        radius = unit * 0.06;
      } else if (progress < 0.74) {
        // Stage 4: hold briefly in front of MGX_CAMERA for the capture effect.
        position.copy(capturePoint);
        direction.copy(baitPoint).sub(capturePoint);
        radius = unit * 0.06;
        imagingCount += 1;
      } else if (progress < 0.84) {
        // Stage 5: fly from the imaging zone to the physical MGX_BOX.
        const stage = MathUtils.smoothstep((progress - 0.74) / 0.10, 0, 1);
        position.copy(capturePoint).lerp(baitPoint, stage);
        direction.copy(baitPoint).sub(capturePoint);
        radius = MathUtils.lerp(unit * 0.06, unit * 0.045, stage);
      } else if (progress < 0.92) {
        // Stage 6: after PPF contact, continue through the fan.
        const stage = MathUtils.smoothstep((progress - 0.84) / 0.08, 0, 1);
        position.copy(baitPoint).lerp(fanPoint, stage);
        direction.copy(fanPoint).sub(baitPoint);
        radius = MathUtils.lerp(unit * 0.045, unit * 0.04, stage);
      } else {
        // Stage 7: leave through the device exit while retaining purple PPF state.
        const stage = MathUtils.smoothstep((progress - 0.92) / 0.08, 0, 1);
        position.copy(fanPoint).lerp(exitPoint, stage);
        direction.copy(exitPoint).sub(fanPoint);
        radius = MathUtils.lerp(unit * 0.04, unit * 0.02, stage);
      }

      if (direction.lengthSq() < 0.0000001) direction.set(1, 0, 0);
      direction.normalize();

      position.x += Math.cos(angle) * radius;
      position.y += Math.sin(angle * 1.3) * radius * 0.55;
      position.z += Math.sin(angle) * radius * 0.36;

      const visibleScale = localTime < 0 || progress >= 1 ? 0 : 1;
      const mosquitoSize = unit * (0.42 + seeded(index, 9) * 0.18) * visibleScale;

      // PPF contact is one-way. Once this mosquito reaches MGX_BOX it stays
      // purple for the rest of the flight.
      if (progress >= PPF_CONTACT_PROGRESS) {
        ppfContacted.current[index] = true;
      }
      const carriesPpf = ppfContacted.current[index];

      // Remove most orbital jitter after contact so the mosquito visibly leaves
      // MGX_BOX instead of looping around/re-entering the bait region.
      if (carriesPpf) {
        radius *= 0.18;
      }

      bodyRef.current!.setColorAt(
        index,
        carriesPpf ? PPF_BODY_COLOR : NORMAL_BODY_COLOR,
      );
      leftWingRef.current!.setColorAt(
        index,
        carriesPpf ? PPF_WING_COLOR : NORMAL_WING_COLOR,
      );
      rightWingRef.current!.setColorAt(
        index,
        carriesPpf ? PPF_WING_COLOR : NORMAL_WING_COLOR,
      );

      if (visibleScale > 0) {
        swarmFocus.add(position);
        visibleCount += 1;
      }

      dummy.position.copy(position);
      dummy.quaternion.setFromUnitVectors(LOCAL_FORWARD, direction);
      dummy.rotateY(0.12 * Math.sin(angle));
      dummy.scale.set(mosquitoSize * 0.34, mosquitoSize, mosquitoSize * 0.34);
      dummy.updateMatrix();
      bodyRef.current!.setMatrixAt(index, dummy.matrix);

      const flap = 0.42 + Math.abs(Math.sin(localTime * 34 + agent.phase)) * 0.7;

      dummy.position.copy(position);
      dummy.quaternion.setFromUnitVectors(LOCAL_FORWARD, direction);
      dummy.rotateZ(flap);
      dummy.scale.set(mosquitoSize * 0.82, mosquitoSize * 0.08, mosquitoSize * 0.38);
      dummy.updateMatrix();
      leftWingRef.current!.setMatrixAt(index, dummy.matrix);

      dummy.quaternion.setFromUnitVectors(LOCAL_FORWARD, direction);
      dummy.rotateZ(-flap);
      dummy.updateMatrix();
      rightWingRef.current!.setMatrixAt(index, dummy.matrix);
    });

    bodyRef.current.instanceMatrix.needsUpdate = true;
    leftWingRef.current.instanceMatrix.needsUpdate = true;
    rightWingRef.current.instanceMatrix.needsUpdate = true;

    if (bodyRef.current.instanceColor) {
      bodyRef.current.instanceColor.needsUpdate = true;
    }
    if (leftWingRef.current.instanceColor) {
      leftWingRef.current.instanceColor.needsUpdate = true;
    }
    if (rightWingRef.current.instanceColor) {
      rightWingRef.current.instanceColor.needsUpdate = true;
    }

    if (visibleCount > 0) {
      sharedFlightState.current.focus.copy(swarmFocus.divideScalar(visibleCount));
    }
    sharedFlightState.current.active = visibleCount > 0;
    sharedFlightState.current.progress = sequenceProgress;

    let nextPhase: MosquitoFlightPhase = "opening";
    if (sequenceProgress > 0 && sequenceProgress < 0.3) nextPhase = "approach";
    else if (sequenceProgress < 0.52 && sequenceProgress >= 0.3) nextPhase = "inlet";
    else if (sequenceProgress < 0.74 && sequenceProgress >= 0.52) nextPhase = "imaging";
    else if (sequenceProgress < 0.84 && sequenceProgress >= 0.74) nextPhase = "bait";
    else if (sequenceProgress < 0.92 && sequenceProgress >= 0.84) nextPhase = "fan";
    else if (sequenceProgress >= 0.92) nextPhase = "exit";

    sharedFlightState.current.phase = nextPhase;
    if (currentPhase.current !== nextPhase) {
      if (debug) {
        const focus = sharedFlightState.current.focus;
        console.info("[MosGuardX flight debug]", {
          phase: nextPhase,
          progress: Number(sequenceProgress.toFixed(3)),
          swarmCenter: {
            x: Number(focus.x.toFixed(4)),
            y: Number(focus.y.toFixed(4)),
            z: Number(focus.z.toFixed(4)),
          },
        });
      }

      currentPhase.current = nextPhase;
      onPhaseChange?.(nextPhase);
    }

    // Capture only after most of the swarm is physically inside the imaging
    // zone; this is intentionally independent from the animation clock.
    if (imagingCount >= Math.ceil(MOSQUITO_COUNT * 0.55) && !captured.current) {
      captured.current = true;
      onCapture?.();
    }

    const finished =
      elapsed.current > LID_OPEN_SECONDS + FLIGHT_SECONDS + 1.8 && flying === 0;

    if (finished && !completed.current) {
      completed.current = true;
      completedWave.current = wave;
      sharedFlightState.current.active = false;
      sharedFlightState.current.phase = "complete";
      currentPhase.current = "complete";
      bodyRef.current.visible = false;
      leftWingRef.current.visible = false;
      rightWingRef.current.visible = false;
      onPhaseChange?.("complete");
      onComplete();
      return;
    }

    invalidate();
  });

  return (
    <group renderOrder={5}>
      <instancedMesh ref={bodyRef} args={[undefined, undefined, MOSQUITO_COUNT]}>
        <sphereGeometry args={[0.32, 7, 5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.74} />
      </instancedMesh>

      <instancedMesh ref={leftWingRef} args={[undefined, undefined, MOSQUITO_COUNT]}>
        <planeGeometry args={[0.9, 0.42]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.55}
          side={DoubleSide}
          depthWrite={false}
        />
      </instancedMesh>

      <instancedMesh ref={rightWingRef} args={[undefined, undefined, MOSQUITO_COUNT]}>
        <planeGeometry args={[0.9, 0.42]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.55}
          side={DoubleSide}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}
