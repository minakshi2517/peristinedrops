import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

const BG = "#edf2f4";
const INK = "#0a1f2b";
const BOTTLE_SRC = "/images/bottle-cutout.webp";
const BOTTLE_ASPECT = 299 / 797;
const BOTTLE_H = 3.1;
const BOTTLE_W = BOTTLE_H * BOTTLE_ASPECT;
const CAM_Z = 10;
const FOV = 24;
const WORD_Z = -2.4;
const WORD = "Pristine";
const DROP = 0.16;
const TURN = 0.5;

type V3 = [number, number, number];
type Key = { at: number; d: V3; m: V3 };
type Spin = { angle: number; vel: number; dragging: boolean };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const quartOut = (t: number) => 1 - Math.pow(1 - t, 4);
const now = () => performance.now() / 1000;

function readKeys(): Key[] {
  const vh = window.innerHeight;
  return [...document.querySelectorAll<HTMLElement>("[data-bottle]")]
    .map((el) => {
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const at = el.dataset.at === "top" ? top : top + rect.height / 2 - vh / 2;
      const d = el.dataset.bottle!.split(",").map(Number) as V3;
      const m = (el.dataset.bottleM ?? el.dataset.bottle!).split(",").map(Number) as V3;
      return { at: Math.max(0, at), d, m };
    })
    .sort((a, b) => a.at - b.at);
}

function useKeys(page: string) {
  const keys = useRef<Key[]>([]);
  useEffect(() => {
    const update = () => {
      keys.current = readKeys();
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    window.addEventListener("resize", update);
    window.addEventListener("load", update);
    void document.fonts.ready.then(update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("load", update);
    };
  }, [page]);
  return keys;
}

function sample(keys: Key[], scroll: number, wide: boolean): V3 {
  if (!keys.length) return wide ? [0.5, 0.56, 0.62] : [0.5, 0.42, 0.42];
  const pick = (key: Key) => (wide ? key.d : key.m);
  if (scroll <= keys[0].at) return pick(keys[0]);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (scroll <= b.at) {
      const raw = (scroll - a.at) / Math.max(1, b.at - a.at);
      const t = smooth(clamp01((raw - 0.1) / 0.8));
      const pa = pick(a);
      const pb = pick(b);
      return [pa[0] + (pb[0] - pa[0]) * t, pa[1] + (pb[1] - pa[1]) * t, pa[2] + (pb[2] - pa[2]) * t];
    }
  }
  const last = keys[keys.length - 1];
  const [x, y, h] = pick(last);
  return [x, y - (scroll - last.at) / window.innerHeight, h];
}

function GiantWord({ intro, show }: { intro: MutableRefObject<number | null>; show: boolean }) {
  const { viewport, size } = useThree();
  const group = useRef<THREE.Group>(null);
  const letters = useRef<(THREE.Group | null)[]>([]);
  const clip = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const [glyphs, setGlyphs] = useState<{ tex: THREE.CanvasTexture; w: number; h: number; x: number; desc: number }[]>([]);
  const [metrics, setMetrics] = useState({ advance: 1, font: 1 });

  useEffect(() => {
    let alive = true;
    const made: THREE.CanvasTexture[] = [];
    void document.fonts.load(`400 360px "Instrument Serif"`).then(() => {
      if (!alive) return;
      const font = 360;
      const pad = 40;
      const probe = document.createElement("canvas").getContext("2d")!;
      probe.font = `400 ${font}px "Instrument Serif", Georgia, serif`;
      const canvasH = Math.round(font * 1.25);
      const baseline = font;
      const next = [...WORD].map((char, i) => {
        const w = Math.ceil(probe.measureText(char).width) + pad * 2;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = canvasH;
        const ctx = canvas.getContext("2d")!;
        ctx.font = probe.font;
        ctx.fillStyle = "#ffffff";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(char, pad, baseline);
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        made.push(tex);
        return { tex, w, h: canvasH, x: probe.measureText(WORD.slice(0, i)).width - pad, desc: canvasH - baseline };
      });
      setMetrics({ advance: probe.measureText(WORD).width, font });
      setGlyphs(next);
    });
    return () => {
      alive = false;
      made.forEach((tex) => tex.dispose());
    };
  }, []);

  const wide = size.width >= 980;
  const depth = (CAM_Z - WORD_Z) / CAM_Z;
  const span = viewport.width * depth * (wide ? 0.9 : 0.92);
  const k = span / metrics.advance;
  const upp = (viewport.height / size.height) * depth;

  const geos = useMemo(
    () =>
      glyphs.map((g) => {
        const geo = new THREE.PlaneGeometry(g.w * k, g.h * k);
        geo.translate((g.w * k) / 2, (g.h * k) / 2 - g.desc * k, 0);
        return geo;
      }),
    [glyphs, k],
  );
  useEffect(() => () => geos.forEach((geo) => geo.dispose()), [geos]);

  const mats = useMemo(
    () =>
      glyphs.map(
        (g) =>
          new THREE.MeshBasicMaterial({
            map: g.tex,
            color: INK,
            transparent: true,
            depthWrite: false,
            toneMapped: false,
            clippingPlanes: [clip],
          }),
      ),
    [glyphs, clip],
  );
  useEffect(() => () => mats.forEach((mat) => mat.dispose()), [mats]);

  useFrame(() => {
    if (!group.current) return;
    group.current.visible = show;
    if (!show) return;
    const centerY = (wide ? 0.06 : 0.1) * viewport.height * depth;
    const baseY = centerY - metrics.font * 0.34 * k + window.scrollY * upp * 0.85;
    group.current.position.y = baseY;
    clip.constant = -(baseY - metrics.font * 0.012 * k);
    const start = intro.current;
    const t = start === null ? 0 : now() - start;
    letters.current.forEach((node, i) => {
      if (!node) return;
      const e = expoOut(clamp01((t - 0.15 - i * 0.05) / 1.5));
      node.position.y = -(1 - e) * metrics.font * 0.95 * k;
    });
  });

  return (
    <group ref={group} position={[-span / 2, 0, WORD_Z]}>
      {glyphs.map((g, i) => (
        <group
          key={i}
          ref={(node) => {
            letters.current[i] = node;
          }}
          position={[g.x * k, 0, 0]}
        >
          <mesh geometry={geos[i]} material={mats[i]} />
        </group>
      ))}
    </group>
  );
}

function shadowMap(stops: [number, number][]) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    stops.forEach(([at, alpha]) => g.addColorStop(at, `rgba(10,31,43,${alpha})`));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Shadow({ land }: { land: MutableRefObject<number> }) {
  const contact = useRef<THREE.MeshBasicMaterial>(null);
  const soft = useRef<THREE.MeshBasicMaterial>(null);
  const maps = useMemo(
    () => [
      shadowMap([
        [0, 0.55],
        [0.45, 0.42],
        [0.7, 0.14],
        [0.88, 0.03],
        [1, 0],
      ]),
      shadowMap([
        [0, 0.16],
        [0.45, 0.07],
        [1, 0],
      ]),
    ],
    [],
  );
  useEffect(() => () => maps.forEach((map) => map.dispose()), [maps]);

  useFrame(() => {
    const l = land.current;
    if (contact.current) contact.current.opacity = l * l * l;
    if (soft.current) soft.current.opacity = l;
  });

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
      <mesh position={[0.08, 0.2, 0]} renderOrder={0}>
        <planeGeometry args={[BOTTLE_W * 2.3, 1.3]} />
        <meshBasicMaterial ref={soft} map={maps[1]} transparent depthWrite={false} opacity={0} toneMapped={false} />
      </mesh>
      <mesh position={[0.02, 0.02, 0]} renderOrder={0}>
        <planeGeometry args={[BOTTLE_W * 1.3, 0.62]} />
        <meshBasicMaterial ref={contact} map={maps[0]} transparent depthWrite={false} opacity={0} toneMapped={false} />
      </mesh>
    </group>
  );
}

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// photo of the bottle plus a soft moving sheen; clear plastic lets a little of the scene through
const FRAG = /* glsl */ `
  uniform sampler2D map;
  uniform float sheen;
  uniform float shift;
  uniform float opacity;
  uniform float mirror;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(map, vUv);
    if (c.a < 0.01) discard;
    float label = smoothstep(0.24, 0.27, vUv.y) * (1.0 - smoothstep(0.61, 0.64, vUv.y));
    float cap = smoothstep(0.86, 0.89, vUv.y);
    float sat = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));
    float clear = (1.0 - label) * (1.0 - cap) * (1.0 - smoothstep(0.08, 0.3, sat));
    float band = exp(-pow((vUv.x - shift) / 0.085, 2.0));
    c.rgb += band * sheen * (0.55 + 0.45 * clear);
    float a = c.a * (1.0 - clear * 0.12);
    if (mirror > 0.5) a *= (1.0 - smoothstep(0.0, 0.26, vUv.y)) * 0.2;
    gl_FragColor = vec4(c.rgb, a * opacity);
    #include <colorspace_fragment>
  }
`;

function useBottleTexture(onLoad: () => void) {
  const gl = useThree((state) => state.gl);
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const done = useRef(onLoad);
  done.current = onLoad;

  useEffect(() => {
    let alive = true;
    let made: THREE.Texture | null = null;
    new THREE.TextureLoader().load(
      BOTTLE_SRC,
      (t) => {
        if (!alive) return t.dispose();
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = gl.capabilities.getMaxAnisotropy();
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.generateMipmaps = true;
        made = t;
        setTex(t);
        done.current();
      },
      undefined,
      () => done.current(),
    );
    return () => {
      alive = false;
      made?.dispose();
    };
  }, [gl]);

  return tex;
}

function Bottle({
  spin,
  reduce,
  land,
  onLoad,
}: {
  spin: MutableRefObject<Spin>;
  reduce: boolean;
  land: MutableRefObject<number>;
  onLoad: () => void;
}) {
  const tex = useBottleTexture(onLoad);
  const turn = useRef<THREE.Group>(null);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(BOTTLE_W, BOTTLE_H);
    g.translate(0, BOTTLE_H / 2, 0);
    return g;
  }, []);

  const [front, back] = useMemo(() => {
    const make = (mirror: number) =>
      new THREE.ShaderMaterial({
        uniforms: {
          map: { value: null },
          sheen: { value: 0 },
          shift: { value: 0.3 },
          opacity: { value: 0 },
          mirror: { value: mirror },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        side: THREE.DoubleSide,
      });
    return [make(0), make(1)];
  }, []);

  useEffect(() => {
    front.uniforms.map.value = tex;
    back.uniforms.map.value = tex;
  }, [tex, front, back]);

  useEffect(
    () => () => {
      geo.dispose();
      front.dispose();
      back.dispose();
    },
    [geo, front, back],
  );

  const grab = (event: ThreeEvent<PointerEvent>) => {
    if (reduce || event.pointerType !== "mouse") return;
    event.stopPropagation();
    spin.current.dragging = true;
    document.documentElement.classList.add("is-dragging");
  };

  useFrame(({ clock }, delta) => {
    const s = spin.current;
    const dt = Math.min(delta, 0.05);
    if (!s.dragging) {
      const rest = reduce ? 0 : Math.sin(clock.elapsedTime * 0.45) * 0.1;
      s.vel += (rest - s.angle) * 26 * dt;
      s.vel *= Math.exp(-6.5 * dt);
      s.angle += s.vel * dt;
    }
    if (turn.current) turn.current.rotation.y = s.angle;

    const shown = tex ? 1 : 0;
    const k = 1 - Math.exp(-8 * dt);
    front.uniforms.opacity.value += (shown - front.uniforms.opacity.value) * k;
    back.uniforms.opacity.value = front.uniforms.opacity.value * land.current;
    const shift = 0.3 - s.angle * 0.9;
    const sheen = 0.05 + Math.min(0.12, Math.abs(s.angle) * 0.3);
    front.uniforms.shift.value = shift;
    front.uniforms.sheen.value = sheen;
    back.uniforms.shift.value = shift;
    back.uniforms.sheen.value = sheen * 0.5;
  });

  return (
    <group ref={turn}>
      <mesh geometry={geo} material={back} scale={[1, -1, 1]} renderOrder={1} />
      <mesh
        geometry={geo}
        material={front}
        renderOrder={2}
        onPointerDown={grab}
        onPointerOver={() => !reduce && document.documentElement.classList.add("over-bottle")}
        onPointerOut={() => document.documentElement.classList.remove("over-bottle")}
      />
    </group>
  );
}

function useDrag(spin: MutableRefObject<Spin>) {
  useEffect(() => {
    let lastX: number | null = null;
    const move = (event: PointerEvent) => {
      const s = spin.current;
      if (!s.dragging) {
        lastX = null;
        return;
      }
      if (lastX !== null) {
        const dx = event.clientX - lastX;
        const room = 1 - Math.min(1, Math.abs(s.angle) / TURN);
        const step = dx * 0.006 * (Math.sign(dx) === Math.sign(s.angle) ? room * room : 1);
        s.angle = THREE.MathUtils.clamp(s.angle + step, -TURN, TURN);
        s.vel = 0;
      }
      lastX = event.clientX;
    };
    const up = () => {
      spin.current.dragging = false;
      lastX = null;
      document.documentElement.classList.remove("is-dragging");
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      document.documentElement.classList.remove("is-dragging", "over-bottle");
    };
  }, [spin]);
}

function Rig({
  reduce,
  intro,
  page,
  onLoad,
}: {
  reduce: boolean;
  intro: MutableRefObject<number | null>;
  page: string;
  onLoad: () => void;
}) {
  const { viewport, size } = useThree();
  const spin = useRef<Spin>({ angle: reduce ? 0 : -0.35, vel: 0, dragging: false });
  const rig = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const pos = useRef<V3 | null>(null);
  const land = useRef(0);
  const keys = useKeys(page);
  useDrag(spin);

  useEffect(() => {
    pos.current = null;
    spin.current.angle = reduce ? 0 : -0.35;
    spin.current.vel = 0;
  }, [page, reduce]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const move = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((_, delta) => {
    if (!rig.current) return;
    const dt = Math.min(delta, 0.05);
    const wide = size.width >= 980;
    const goal = sample(keys.current, window.scrollY, wide);
    if (!pos.current) pos.current = [...goal];
    const p = pos.current;
    for (let i = 0; i < 3; i++) p[i] = THREE.MathUtils.damp(p[i], goal[i], 6, dt);

    const start = intro.current;
    const since = start === null ? 0 : now() - start;
    const settle = start === null ? 0 : quartOut(clamp01((since - 0.25) / 1.8));
    const drop = 1 - settle;
    land.current = settle;

    const fit = (p[2] * viewport.height) / BOTTLE_H;
    rig.current.position.set((p[0] - 0.5) * viewport.width, (0.5 - p[1]) * viewport.height + drop * DROP * viewport.height, 0);
    rig.current.scale.setScalar(fit);

    if (tilt.current && !reduce) {
      tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, pointer.current.y * 0.03, 2.5, dt);
      tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, pointer.current.x * 0.06, 2.5, dt);
      tilt.current.rotation.z = -drop * 0.06;
    }
  });

  return (
    <group ref={rig}>
      <group ref={tilt}>
        <group position={[0, -BOTTLE_H / 2, 0]}>
          <Shadow land={land} />
          <Bottle spin={spin} reduce={reduce} land={land} onLoad={onLoad} />
        </group>
      </group>
    </group>
  );
}

export function BottleStage({
  reduce,
  running,
  playing,
  page,
  word,
  onReady,
}: {
  reduce: boolean;
  running: boolean;
  playing: boolean;
  page: string;
  word: boolean;
  onReady?: () => void;
}) {
  const intro = useRef<number | null>(null);
  const ready = useRef(onReady);
  ready.current = onReady;
  useEffect(() => {
    if (playing) intro.current = now() - (reduce ? 10 : 0);
  }, [playing, reduce, page]);
  const coarse = useMemo(() => window.matchMedia("(pointer: coarse)").matches, []);
  const loaded = useMemo(() => {
    let count = 0;
    return () => {
      count += 1;
      if (count === 2) ready.current?.();
    };
  }, []);

  return (
    <Canvas
      dpr={[1, coarse ? 1.75 : 2]}
      frameloop={running ? "always" : "never"}
      camera={{ position: [0, 0, CAM_Z], fov: FOV, near: 0.1, far: 80 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping;
        gl.localClippingEnabled = true;
        void document.fonts.load(`400 200px "Instrument Serif"`).catch(() => null).then(loaded);
      }}
    >
      <color attach="background" args={[BG]} />
      <GiantWord intro={intro} show={word} />
      <Rig reduce={reduce} intro={intro} page={page} onLoad={loaded} />
    </Canvas>
  );
}
