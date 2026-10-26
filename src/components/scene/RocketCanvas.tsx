'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Group, Mesh, MeshStandardMaterial, Color, type Object3D } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { sceneMotion } from '@/lib/motion/scene-state';
type Theme = {
  light: boolean;
  hull: string;
  ink: string;
  graphite: string;
  ember: string;
  cream: string;
};
function readTheme(): Theme {
  const css = getComputedStyle(document.documentElement);
  const token = (name: string) => css.getPropertyValue(name).trim();
  return {
    light: document.documentElement.dataset.theme === 'light',
    hull: token('--cream'),
    ink: token('--ink'),
    graphite: token('--graphite'),
    ember: token('--ember'),
    cream: token('--cream'),
  };
}
function dispose(object: Object3D) {
  const geometries = new Set<Mesh['geometry']>();
  const materials = new Set<MeshStandardMaterial>();
  object.traverse((o) => {
    if (o instanceof Mesh) {
      geometries.add(o.geometry);
      for (const m of Array.isArray(o.material) ? o.material : [o.material])
        materials.add(m);
    }
  });
  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => m.dispose());
}
function Rocket({
  object,
  variant,
  theme,
}: {
  object: Group;
  variant: 'hero' | 'engine';
  theme: Theme;
}) {
  const group = useRef<Group>(null);
  const elapsed = useRef(0);
  useEffect(() => {
    object.traverse((o) => {
      if (o instanceof Mesh) {
        const m = o.material as MeshStandardMaterial;
        const value =
          m.name === 'ember'
            ? theme.ember
            : m.name === 'hull'
              ? theme.hull
              : m.name === 'glass'
                ? theme.ink
                : theme.graphite;
        m.color.set(value);
        m.emissive.set(m.name === 'ember' ? theme.ember : theme.ink);
        m.emissiveIntensity =
          m.name === 'ember' ? (theme.light ? 0.12 : 0.45) : 0;
      }
    });
  }, [object, theme]);
  useFrame((_, dt) => {
    elapsed.current += Math.min(dt, 0.05);
    const t = elapsed.current,
      p = sceneMotion[variant];
    if (!group.current) return;
    group.current.rotation.set(
      0.1 + sceneMotion.pointerY * 0.07,
      -0.25 + p * Math.PI * 0.85 + Math.sin(t * 0.25) * 0.08,
      -0.16 + p * 0.25 + sceneMotion.pointerX * 0.07,
    );
    group.current.position.y = Math.sin(t * 0.75) * 0.065 + p * 0.22;
    group.current.scale.setScalar(1 + p * 0.08);
  });
  return (
    <group ref={group}>
      <primitive object={object} dispose={null} />
    </group>
  );
}
export default function RocketCanvas({
  variant,
  active,
  onReady,
  onFailure,
}: {
  variant: 'hero' | 'engine';
  active: boolean;
  onReady: () => void;
  onFailure: () => void;
}) {
  const [object, setObject] = useState<Group | null>(null);
  const [theme, setTheme] = useState<Theme>(readTheme);
  const callbacks = useRef({ onReady, onFailure });
  useEffect(() => {
    callbacks.current = { onReady, onFailure };
  });
  useEffect(() => {
    let cancelled = false;
    let loaded: Group | undefined;
    new GLTFLoader()
      .setMeshoptDecoder(MeshoptDecoder)
      .loadAsync('/assets/models/ignitra-rocket.glb')
      .then((gltf) => {
        loaded = gltf.scene;
        if (cancelled) dispose(loaded);
        else setObject(loaded);
      })
      .catch(() => {
        if (!cancelled) callbacks.current.onFailure();
      });
    const change = () => setTheme(readTheme());
    window.addEventListener('ignitra-theme-change', change);
    return () => {
      cancelled = true;
      if (loaded) dispose(loaded);
      window.removeEventListener('ignitra-theme-change', change);
    };
  }, []);
  const canvasReady = useCallback(
    ({
      gl,
    }: {
      gl: {
        domElement: HTMLCanvasElement;
        setClearColor: (color: Color, alpha: number) => void;
      };
    }) => {
      gl.setClearColor(new Color(readTheme().ink), 0);
      callbacks.current.onReady();
    },
    [],
  );
  useEffect(() => {
    const canvas = document.querySelector<HTMLCanvasElement>(
      '[data-scene="' + variant + '"] canvas',
    );
    if (!canvas) return;
    const lost = (event: Event) => {
      event.preventDefault();
      callbacks.current.onFailure();
    };
    const restored = () => callbacks.current.onReady();
    canvas.addEventListener('webglcontextlost', lost);
    canvas.addEventListener('webglcontextrestored', restored);
    return () => {
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.removeEventListener('webglcontextrestored', restored);
    };
  }, [object, variant]);
  if (!object) return null;
  return (
    <div className="rocket-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [0, 0.1, 5.5], fov: 38 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        onCreated={canvasReady}
        fallback={null}
      >
        <ambientLight color={theme.cream} intensity={theme.light ? 1.6 : 0.8} />
        <directionalLight
          position={[3, 4, 4]}
          color={theme.cream}
          intensity={theme.light ? 3 : 4}
        />
        <directionalLight
          position={[-3, 0, -2]}
          color={theme.ember}
          intensity={theme.light ? 1.2 : 3.6}
        />
        <pointLight
          position={[0, -2, 1]}
          color={theme.ember}
          intensity={theme.light ? 2 : 5}
        />
        <Rocket object={object} variant={variant} theme={theme} />
      </Canvas>
    </div>
  );
}
