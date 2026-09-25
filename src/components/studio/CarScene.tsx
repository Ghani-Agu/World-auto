"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { CategoryKey, Model } from "@/lib/catalog";
import { BODIES, pinPositions, type BodySpec, type V2, type V3 } from "./carGeometry";
import type { CarModelAsset } from "./carModels";

type Props = {
  body: Model["body"];
  paint: string;
  active: CategoryKey | null;
  filled: Partial<Record<CategoryKey, number>>;
  labels: Record<CategoryKey, string>;
  onPick: (k: CategoryKey) => void;
  /** Realistic GLB for this exact vehicle, when available */
  asset?: CarModelAsset;
  /** Photos of the parts selected in each slot */
  photos?: Partial<Record<CategoryKey, string[]>>;
};

const SIGNAL = "#ff5a1f";
const JADE = "#2fd6a6";

function extrudeProfile(points: V2[], depth: number, bevel = 0.06) {
  const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: depth - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 8,
  });
  geo.translate(0, 0, -(depth - bevel * 2) / 2);
  geo.computeVertexNormals();
  return geo;
}

/** Thin slab lying along a 2D segment of the profile (windshield, hood…) */
function Slab({ a, b, width, thickness = 0.02, lift = 0.012, children, ...rest }: { a: V2; b: V2; width: number; thickness?: number; lift?: number; children?: React.ReactNode } & Omit<React.ComponentProps<"mesh">, "position" | "rotation">) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  // outward normal (profile is counter-clockwise from rear → front on top edge)
  const nx = -Math.sin(angle);
  const ny = Math.cos(angle);
  return (
    <mesh position={[(a[0] + b[0]) / 2 + nx * lift, (a[1] + b[1]) / 2 + ny * lift, 0]} rotation={[0, 0, angle]} {...rest}>
      <boxGeometry args={[len, thickness, width]} />
      {children}
    </mesh>
  );
}

/** x of the B-pillar: middle of the side glass */
function pillarX(spec: BodySpec) {
  const xs = spec.sideGlass.map((p) => p[0]);
  return (Math.min(...xs) + Math.max(...xs)) / 2 - 0.1;
}

function Zone({ k, active, filled, hovered, children }: { k: CategoryKey; active: CategoryKey | null; filled: Props["filled"]; hovered: CategoryKey | null; children?: React.ReactNode }) {
  const on = active === k || hovered === k;
  const done = (filled[k] ?? 0) > 0;
  const color = on ? SIGNAL : done ? JADE : "#000000";
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={on ? 0.9 : done ? 0.5 : 0}
      transparent
      opacity={on ? 0.55 : done ? 0.35 : 0}
      depthWrite={false}
    >
      {children}
    </meshStandardMaterial>
  );
}

function Wheel({ x, z, r, highlight }: { x: number; z: number; r: number; highlight: "on" | "done" | null }) {
  const side = z > 0 ? 1 : -1;
  return (
    <group position={[x, r, z]}>
      {/* tyre */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[r, r, 0.26, 40]} />
        <meshStandardMaterial color="#111317" roughness={0.9} />
      </mesh>
      {/* rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, side * 0.131]}>
        <cylinderGeometry args={[r * 0.66, r * 0.66, 0.01, 32]} />
        <meshStandardMaterial color="#aab2bd" metalness={0.9} roughness={0.25} />
      </mesh>
      {/* spokes */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0, 0, side * 0.138]} rotation={[0, 0, (i * Math.PI * 2) / 5]}>
          <boxGeometry args={[r * 1.2, 0.05, 0.012]} />
          <meshStandardMaterial color="#d5dae1" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      {/* brake disc + caliper */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, side * 0.1]}>
        <cylinderGeometry args={[r * 0.52, r * 0.52, 0.02, 32]} />
        <meshStandardMaterial
          color={highlight === "on" ? SIGNAL : highlight === "done" ? JADE : "#6b7380"}
          emissive={highlight === "on" ? SIGNAL : highlight === "done" ? JADE : "#000"}
          emissiveIntensity={highlight ? 0.8 : 0}
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[r * 0.3, r * 0.3, side * 0.115]}>
        <boxGeometry args={[0.1, 0.14, 0.05]} />
        <meshStandardMaterial color={highlight ? (highlight === "on" ? SIGNAL : JADE) : "#c2372b"} />
      </mesh>
    </group>
  );
}

function Car({ spec, paint, active, filled, onPick }: { spec: BodySpec } & Omit<Props, "body" | "labels">) {
  const [hovered, setHovered] = useState<CategoryKey | null>(null);
  const bodyGeo = useMemo(() => extrudeProfile(spec.profile, spec.width), [spec]);
  const glassGeo = useMemo(() => extrudeProfile(spec.sideGlass, spec.width + 0.03, 0.01), [spec]);
  const hw = spec.width / 2;

  const handlers = (k: CategoryKey) => ({
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(k);
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      setHovered(null);
      document.body.style.cursor = "";
    },
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onPick(k);
    },
  });

  const hl = (k: CategoryKey): "on" | "done" | null => (active === k || hovered === k ? "on" : (filled[k] ?? 0) > 0 ? "done" : null);
  const lightHL = hl("lighting");

  return (
    <group>
      {/* Body shell */}
      <mesh geometry={bodyGeo} castShadow receiveShadow {...handlers("body")}>
        <meshPhysicalMaterial color={paint} metalness={0.55} roughness={0.28} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      <mesh geometry={bodyGeo} scale={[1.002, 1.002, 1.002]} raycast={() => null}>
        <Zone k="body" active={active} filled={filled} hovered={hovered} />
      </mesh>

      {/* Side glass → interior */}
      <mesh geometry={glassGeo} {...handlers("interior")}>
        <meshPhysicalMaterial color={hl("interior") === "on" ? SIGNAL : "#0d1116"} emissive={hl("interior") ? (hl("interior") === "on" ? SIGNAL : JADE) : "#000"} emissiveIntensity={hl("interior") ? 0.35 : 0} metalness={0.2} roughness={0.05} />
      </mesh>
      {/* B-pillar splits the side glass */}
      {!spec.bed && (
        <mesh position={[pillarX(spec), (spec.sideGlass[0][1] + spec.roofY) / 2, 0]} raycast={() => null}>
          <boxGeometry args={[0.09, spec.roofY - spec.sideGlass[0][1] - 0.04, spec.width + 0.05]} />
          <meshPhysicalMaterial color={paint} metalness={0.55} roughness={0.28} clearcoat={1} />
        </mesh>
      )}
      {/* Wheel-arch trims */}
      {spec.wheels.flatMap((x) =>
        [-1, 1].map((s) => (
          <mesh key={`a${x}${s}`} position={[x, spec.wheelR, s * (hw + 0.005)]} raycast={() => null}>
            <torusGeometry args={[spec.wheelR + 0.07, 0.045, 8, 32, Math.PI]} />
            <meshStandardMaterial color="#15181d" roughness={0.8} />
          </mesh>
        ))
      )}
      <Slab a={spec.windshield[0]} b={spec.windshield[1]} width={spec.width - 0.22} {...handlers("interior")}>
        <meshPhysicalMaterial color="#0d1116" metalness={0.2} roughness={0.05} />
      </Slab>
      {spec.rearGlass && (
        <Slab a={spec.rearGlass[0]} b={spec.rearGlass[1]} width={spec.width - 0.26}>
          <meshPhysicalMaterial color="#0d1116" metalness={0.2} roughness={0.05} />
        </Slab>
      )}

      {/* Hood → engine / filters / electrical share the bay */}
      <Slab a={spec.hood[0]} b={spec.hood[1]} width={spec.width - 0.2} thickness={0.01} lift={0.03} {...handlers("engine")}>
        <Zone k="engine" active={active} filled={filled} hovered={hovered} />
      </Slab>

      {/* Grille → cooling */}
      <mesh position={[spec.front + 0.005, 0.62, 0]} {...handlers("cooling")}>
        <boxGeometry args={[0.04, 0.26, spec.width * 0.5]} />
        <meshStandardMaterial color={hl("cooling") === "on" ? SIGNAL : hl("cooling") === "done" ? JADE : "#15181d"} emissive={hl("cooling") ? (hl("cooling") === "on" ? SIGNAL : JADE) : "#000"} emissiveIntensity={hl("cooling") ? 0.6 : 0} metalness={0.8} roughness={0.3} />
      </mesh>
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i} position={[spec.front + 0.03, 0.53 + i * 0.06, 0]} raycast={() => null}>
          <boxGeometry args={[0.01, 0.012, spec.width * 0.48]} />
          <meshStandardMaterial color="#9aa3ad" metalness={1} roughness={0.2} />
        </mesh>
      ))}

      {/* Headlights / tail lights → lighting */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[spec.front - 0.02, 0.8, s * (hw - 0.22)]} {...handlers("lighting")}>
            <boxGeometry args={[0.08, 0.1, 0.34]} />
            <meshStandardMaterial color={lightHL === "on" ? SIGNAL : "#fff7e0"} emissive={lightHL === "on" ? SIGNAL : lightHL === "done" ? JADE : "#fff2c4"} emissiveIntensity={lightHL ? 1.4 : 0.9} />
          </mesh>
          <mesh position={[spec.rear + 0.01, (spec.bed ? 0.92 : 0.82), s * (hw - 0.18)]} {...handlers("lighting")}>
            <boxGeometry args={[0.06, 0.12, 0.3]} />
            <meshStandardMaterial color="#ff2d3d" emissive={lightHL === "on" ? SIGNAL : lightHL === "done" ? JADE : "#ff1f33"} emissiveIntensity={lightHL ? 1.4 : 0.7} />
          </mesh>
        </group>
      ))}

      {/* Pickup bed */}
      {spec.bed && (
        <mesh position={[(spec.bed.x0 + spec.bed.x1) / 2, spec.bed.y + 0.005, 0]} raycast={() => null}>
          <boxGeometry args={[spec.bed.x1 - spec.bed.x0, 0.01, spec.width - 0.24]} />
          <meshStandardMaterial color="#1a1d22" roughness={0.9} />
        </mesh>
      )}

      {/* Under-body → transmission, springs → suspension */}
      <mesh position={[0, spec.wheelR * 0.75, 0]} {...handlers("transmission")}>
        <boxGeometry args={[Math.abs(spec.wheels[0] - spec.wheels[1]) - 0.4, 0.08, 0.3]} />
        <meshStandardMaterial color={hl("transmission") === "on" ? SIGNAL : hl("transmission") === "done" ? JADE : "#2a2f37"} emissive={hl("transmission") ? (hl("transmission") === "on" ? SIGNAL : JADE) : "#000"} emissiveIntensity={hl("transmission") ? 0.7 : 0} />
      </mesh>
      {spec.wheels.flatMap((x) =>
        [-1, 1].map((s) => (
          <mesh key={`${x}${s}`} position={[x, spec.wheelR + 0.2, s * (hw - 0.3)]} {...handlers("suspension")}>
            <cylinderGeometry args={[0.07, 0.07, 0.36, 12]} />
            <meshStandardMaterial color={hl("suspension") === "on" ? SIGNAL : hl("suspension") === "done" ? JADE : "#c79a2a"} emissive={hl("suspension") ? (hl("suspension") === "on" ? SIGNAL : JADE) : "#000"} emissiveIntensity={hl("suspension") ? 0.8 : 0} metalness={0.6} roughness={0.4} />
          </mesh>
        ))
      )}

      {/* Wheels → brakes */}
      {spec.wheels.flatMap((x) =>
        [-1, 1].map((s) => (
          <group key={`w${x}${s}`} {...handlers("brakes")}>
            <Wheel x={x} z={s * (hw - 0.06)} r={spec.wheelR} highlight={hl("brakes")} />
          </group>
        ))
      )}
    </group>
  );
}

function Pins({ spec, scale = [1, 1, 1], active, filled, labels, onPick, photos = {} }: { spec: BodySpec; scale?: V3 } & Omit<Props, "body" | "paint" | "asset">) {
  const pos = useMemo(() => {
    const raw = pinPositions(spec);
    return Object.fromEntries(Object.entries(raw).map(([k, [x, y, z]]) => [k, [x * scale[0], y * scale[1], z * scale[2]]])) as Record<CategoryKey, V3>;
  }, [spec, scale]);
  return (
    <>
      {(Object.keys(pos) as CategoryKey[]).map((k) => {
        const done = (filled[k] ?? 0) > 0;
        const on = active === k;
        const imgs = photos[k] ?? [];
        return (
          <Html key={k} position={pos[k]} center zIndexRange={[20, 0]}>
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={() => onPick(k)}
                className={`group relative flex items-center gap-1.5 whitespace-nowrap rounded-full border py-1 pe-2.5 ps-1 text-[11px] font-semibold shadow-lg backdrop-blur transition ${
                  on ? "border-signal bg-signal text-white" : done ? "border-jade/60 bg-ink/80 text-jade" : "border-white/15 bg-ink/70 text-paper hover:border-signal"
                }`}
              >
                {done && imgs[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imgs[0]} alt="" referrerPolicy="no-referrer" className="h-6 w-6 rounded-full bg-white object-contain" />
                ) : (
                  <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${on ? "bg-white text-signal" : done ? "bg-jade text-ink" : "bg-signal text-white"}`}>
                    {done ? filled[k] : "+"}
                  </span>
                )}
                <span className={on || done ? "" : "hidden group-hover:inline"}>{labels[k]}{done && filled[k]! > 1 ? ` ·${filled[k]}` : ""}</span>
              </button>
              {on && imgs.length > 0 && (
                <div className="flex gap-1 rounded-xl border border-white/10 bg-ink/80 p-1 backdrop-blur">
                  {imgs.slice(0, 3).map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={src} src={src} alt="" referrerPolicy="no-referrer" className="h-16 w-16 rounded-lg bg-white object-contain p-1" />
                  ))}
                </div>
              )}
            </div>
          </Html>
        );
      })}
    </>
  );
}

/* ───────────── Realistic GLB car ───────────── */

const DEFAULT_PAINT = /paint|carpaint|car_paint|body|exterior|coat|lack/i;

function RealCar({ asset, spec, paint, onDims }: { asset: CarModelAsset; spec: BodySpec; paint: string; onDims: (d: V3) => void }) {
  const gltf = useGLTF(asset.file, "/draco/");

  const { object, dims, paintMats } = useMemo(() => {
    const root = gltf.scene.clone(true);
    root.rotation.y = asset.yaw ?? 0;
    const wrap = new THREE.Group();
    wrap.add(root);
    wrap.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(wrap);
    let size = box.getSize(new THREE.Vector3());
    if (asset.yaw === undefined && size.z > size.x) {
      root.rotation.y += Math.PI / 2;
      wrap.updateMatrixWorld(true);
      box.setFromObject(wrap);
      size = box.getSize(new THREE.Vector3());
    }
    wrap.scale.setScalar((spec.front - spec.rear) / size.x);
    wrap.updateMatrixWorld(true);
    box.setFromObject(wrap);
    const c = box.getCenter(new THREE.Vector3());
    wrap.position.set(-c.x, -box.min.y, -c.z);
    wrap.updateMatrixWorld(true);
    box.setFromObject(wrap);
    const s = box.getSize(new THREE.Vector3());

    const paintMats: THREE.MeshStandardMaterial[] = [];
    const re = asset.paint ?? DEFAULT_PAINT;
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const cloned = mats.map((m) => {
        const mm = m.clone() as THREE.MeshStandardMaterial;
        if (asset.paint && re.test(m.name) && "color" in mm) paintMats.push(mm);
        return mm;
      });
      mesh.material = Array.isArray(mesh.material) ? cloned : cloned[0];
    });
    return { object: wrap, dims: [s.x, s.y, s.z] as V3, paintMats };
  }, [gltf, asset, spec]);

  useEffect(() => onDims(dims), [dims, onDims]);
  useEffect(() => {
    paintMats.forEach((m) => m.color.set(paint));
  }, [paint, paintMats]);

  return <primitive object={object} />;
}

class ModelBoundary extends Component<{ fallback: React.ReactNode; children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Turntable({ children, spin }: { children: React.ReactNode; spin: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (spin && ref.current) ref.current.rotation.y += dt * 0.15;
  });
  return <group ref={ref}>{children}</group>;
}

/** Pull the camera back on narrow (portrait) viewports so the whole car fits */
function CameraFit() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    const k = aspect < 1 ? Math.min(1.05 / Math.max(aspect, 0.5), 1.8) : aspect < 1.3 ? 1.2 : 1;
    camera.position.set(6.6 * k, 3.1 * k, 6.9 * k);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

export default function CarScene(props: Props) {
  const spec = BODIES[props.body];
  const [interacted, setInteracted] = useState(false);
  const [dims, setDims] = useState<V3 | null>(null);
  const { asset } = props;

  useEffect(() => setDims(null), [asset]);

  // Scale the body-type pin layout onto the real model's bounding box
  const pinScale: V3 = dims
    ? [dims[0] / (spec.front - spec.rear), dims[1] / spec.roofY, dims[2] / spec.width]
    : [1, 1, 1];
  const procedural = <Car spec={spec} {...props} />;

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [6.6, 3.1, 6.9], fov: 36 }} onPointerDown={() => setInteracted(true)}>
      <CameraFit />
      <color attach="background" args={["#0a0c0f"]} />
      <fog attach="fog" args={["#0a0c0f", 12, 24]} />
      <hemisphereLight args={["#dfe7f5", "#1a1410", 0.7]} />
      <directionalLight position={[5, 8, 4]} intensity={2.2} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-6, 3, -4]} intensity={0.8} color="#7fb8ff" />

      <Turntable spin={!interacted && !props.active}>
        <group position={[0, 0.02, 0]}>
          {asset ? (
            <ModelBoundary key={asset.file} fallback={procedural}>
              <Suspense fallback={procedural}>
                <RealCar asset={asset} spec={spec} paint={props.paint} onDims={setDims} />
              </Suspense>
            </ModelBoundary>
          ) : (
            procedural
          )}
          <Pins spec={spec} scale={asset ? pinScale : undefined} {...props} />
        </group>
      </Turntable>

      {/* Platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4.2, 96]} />
        <meshStandardMaterial color="#12161b" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[4.12, 4.2, 128]} />
        <meshBasicMaterial color={SIGNAL} />
      </mesh>
      <gridHelper args={[8, 16, "#2a313b", "#1c2129"]} position={[0, 0.004, 0]} />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.7} scale={10} blur={2.2} far={3} />

      <OrbitControls enablePan={false} minDistance={4.5} maxDistance={22} maxPolarAngle={Math.PI / 2.1} target={[0, 0.7, 0]} />
    </Canvas>
  );
}
