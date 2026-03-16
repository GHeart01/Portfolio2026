// ── F1 Car v5 — Connected Rear Wing, Proper Cockpit Seat ─────────────────────

const spd   = addControl("spd",   "Car Speed",      0,  5,  1.5);
const chaos = addControl("chaos", "Turbulence",     0,  2,  0.2);
const sc    = addControl("sc",    "Scale",          6, 18, 11);
const hue   = addControl("hue",   "Livery Hue",     0,  1,  0.0);
const exLen = addControl("exLen", "Exhaust Length", 0,  5,  2.0);

if (i === 0) {
  setInfo("F1 Car v5",
    "Connected rear wing with struts, cockpit seat + headrest surround, cylinder wheels, axles.");
  annotate("n",  new THREE.Vector3( 11,  0,  0), "Nose");
  annotate("rw", new THREE.Vector3( -9,  5,  0), "Rear Wing");
  annotate("ck", new THREE.Vector3(  1,  2,  0), "Cockpit");
  annotate("ex", new THREE.Vector3(-13,  2,  0), "Exhaust");
  annotate("fl", new THREE.Vector3(  6, -1,  4.8), "Front Tyre");
  annotate("rl", new THREE.Vector3( -6, -1,  4.8), "Rear Tyre");
}

const T  = time * spd;
const nr = i / count;

const frc = (v) => v - Math.floor(v);
const h1  = (v) => frc(Math.sin(v * 127.1) * 43758.5453);
const h2  = (v) => frc(Math.sin(v * 311.7) * 19731.843);
const lrp = (n, a, b) => (n - a) / (b - a);

let px = 0, py = 0, pz = 0, ch = 0, cs = 1, cl = 0.5;

// ── Solid cylinder tyre
const cylinder = (p, R, halfW, axX, axY, sideZ, spinT) => {
  const slices  = 64;
  const slice   = Math.floor(p * slices);
  const theta   = (slice / slices) * Math.PI * 2 + spinT;
  const section = h1(i * 3.71 + 0.1);
  if (section < 0.42) {
    const r  = R * (0.55 + 0.45 * Math.sqrt(frc(p * slices)));
    const zO = (h1(i * 5.31) - 0.5) * 2.0 * halfW;
    px = axX + Math.cos(theta) * r;
    py = axY + Math.sin(theta) * r;
    pz = sideZ + zO;
  } else if (section < 0.71) {
    const r = R * Math.sqrt(h1(i * 2.19 + 0.3));
    const a = h1(i * 6.77) * Math.PI * 2 + spinT;
    px = axX + Math.cos(a) * r;
    py = axY + Math.sin(a) * r;
    pz = sideZ + halfW;
  } else {
    const r = R * Math.sqrt(h1(i * 4.77 + 0.7));
    const a = h1(i * 8.13) * Math.PI * 2 + spinT;
    px = axX + Math.cos(a) * r;
    py = axY + Math.sin(a) * r;
    pz = sideZ - halfW;
  }
};

// ── Axle rod
const axle = (p, axX, axY, z0, z1) => {
  const theta = h1(i * 9.33) * Math.PI * 2;
  const r     = 0.12 * h1(i * 3.11);
  px = axX + Math.cos(theta) * r;
  py = axY + Math.sin(theta) * r;
  pz = z0 + p * (z1 - z0);
};

// ── Thin strut: straight rod from (x0,y0,z0) to (x1,y1,z1) with radius r
const strut = (p, x0, y0, z0, x1, y1, z1, r) => {
  const theta = h1(i * 7.41) * Math.PI * 2;
  const rad   = r * Math.sqrt(h1(i * 2.83));
  px = x0 + (x1 - x0) * p + Math.cos(theta) * rad;
  py = y0 + (y1 - y0) * p + Math.sin(theta) * rad;
  pz = z0 + (z1 - z0) * p;
};

// ─────────────────────────────────────────────────────────────────────────────
// BUDGET
// 0.00 – 0.21  monocoque
// 0.21 – 0.27  sidepods
// 0.27 – 0.34  nose cone
// 0.34 – 0.42  front wing (white)
// 0.42 – 0.48  rear wing planes
// 0.48 – 0.52  rear wing endplates
// 0.52 – 0.55  rear wing struts (connect to body)
// 0.55 – 0.60  cockpit tub / seat base
// 0.60 – 0.65  headrest surround
// 0.65 – 0.71  front-left  tyre
// 0.71 – 0.77  front-right tyre
// 0.77 – 0.84  rear-left   tyre
// 0.84 – 0.91  rear-right  tyre
// 0.91 – 0.93  front axle
// 0.93 – 0.95  rear axle
// 0.95 – 1.00  exhaust
// ─────────────────────────────────────────────────────────────────────────────

if (nr < 0.21) {
  // ── Monocoque
  const p    = lrp(nr, 0, 0.21);
  const cx   = (p - 0.5) * 16;
  const wPro = 0.75 + 1.3  * Math.exp(-cx * cx * 0.03)
             - 0.25 * Math.exp(-(cx - 7) * (cx - 7) * 0.4);
  const hPro = 0.50 + 0.85 * Math.exp(-cx * cx * 0.025)
             - 0.18 * Math.exp(-(cx + 7) * (cx + 7) * 0.3);
  const sp   = Math.exp(-(cx + 3) * (cx + 3) * 0.06);
  const phi  = h1(i * 4.13) * Math.PI * 2;
  const rad  = Math.sqrt(h1(i * 1.57));
  px = cx;
  py = Math.sin(phi) * hPro * rad - 0.1;
  pz = Math.cos(phi) * (wPro + sp * 0.8) * rad;
  ch = hue; cs = 0.92;
  cl = 0.38 + 0.14 * sp + 0.06 * rad;

} else if (nr < 0.27) {
  // ── Sidepods
  const p    = lrp(nr, 0.21, 0.27);
  const side = p < 0.5 ? 1 : -1;
  const lp   = frc(p * 2);
  const cx   = (lp - 0.5) * 8 - 1.5;
  px = cx;
  py = h1(i * 2.17) * 0.9 - 0.8;
  pz = side * (1.1 + h1(i * 3.41) * 0.55);
  ch = hue; cs = 0.88; cl = 0.35;

} else if (nr < 0.34) {
  // ── Nose cone
  const p  = lrp(nr, 0.27, 0.34);
  px = 8 + p * 5;
  const nR  = (1 - p * p) * 0.52;
  const phi = h1(i * 3.3) * Math.PI * 2;
  const rad = Math.sqrt(h1(i * 0.9));
  py = Math.sin(phi) * nR * rad - 0.2;
  pz = Math.cos(phi) * nR * rad;
  ch = hue; cs = 1.0; cl = 0.46;

} else if (nr < 0.42) {
  // ── Front wing — WHITE
  const p    = lrp(nr, 0.34, 0.42);
  const elem = Math.floor(p * 3);
  const span = (h1(i * 1.3) - 0.5) * 10;
  const chord= h1(i * 2.7) * 2.2;
  px = 10.5 + chord - elem * 0.55;
  py = -1.6 - elem * 0.18;
  pz = span;
  const ep = Math.abs(span) > 4.0 ? 1 : 0;
  py += ep * (h1(i * 6.1) * 2.5 - 0.5);
  pz  = ep ? (span > 0 ? 4.4 : -4.4) + h2(i * 1.1) * 0.25 : pz;
  ch = 0.0; cs = 0.0; cl = 0.90;

} else if (nr < 0.48) {
  // ── Rear wing planes (2 elements)
  const p    = lrp(nr, 0.42, 0.48);
  const elem = Math.floor(p * 2);
  const span = (h1(i * 2.1) - 0.5) * 6.0;   // ±3 units wide
  const chord= h1(i * 3.9) * 1.8;
  px = -8.2 - chord * 0.5;
  py = 4.0  + elem * 0.7;                     // stacked elements
  pz = span;
  ch = hue; cs = 1.0; cl = 0.40;

} else if (nr < 0.52) {
  // ── Rear wing endplates — vertical slabs at ±3 connecting wing to struts
  const p    = lrp(nr, 0.48, 0.52);
  const side = p < 0.5 ? 1 : -1;
  const lp   = frc(p * 2);
  px = -8.2 - h1(i * 1.7) * 1.8;             // chord extent
  py = 2.5  + lp * 2.8;                       // from strut top to wing top
  pz = side * 3.0 + h1(i * 4.4) * 0.18;
  ch = hue; cs = 0.9; cl = 0.38;

} else if (nr < 0.55) {
  // ── Rear wing struts — two rods from body (py≈0.8) up to wing base (py≈2.5)
  const p    = lrp(nr, 0.52, 0.55);
  const side = p < 0.5 ? 1 : -1;
  const lp   = frc(p * 2);
  strut(lp, -8.0, 0.8, side * 1.2, -8.2, 2.5, side * 2.8, 0.14);
  ch = hue; cs = 0.7; cl = 0.42;

} else if (nr < 0.60) {
  // ── Cockpit tub / seat base — a shallow curved trough
  const p   = lrp(nr, 0.55, 0.60);
  // Seat base: flat floor + low side walls forming a bucket
  const cx  = (p - 0.5) * 3.5 + 0.5;         // x: -1.25 → 2.25
  const phi = h1(i * 5.1) * Math.PI;          // half-circle (open top)
  const rS  = 0.55 + 0.15 * Math.abs(cx);     // slightly wider at back
  px = cx;
  py = 0.4 + Math.sin(phi) * rS * 0.5;        // seat bowl ~y 0.4 → 0.9
  pz = Math.cos(phi) * rS * 0.7;              // ±0.38 wide
  ch = hue; cs = 0.6; cl = 0.32;

} else if (nr < 0.65) {
  // ── Headrest surround — tall U-shaped panel behind cockpit
  const p   = lrp(nr, 0.60, 0.65);
  // Three faces: left wall, back wall, right wall
  const face = Math.floor(p * 3);
  const lp   = frc(p * 3);
  if (face === 0) {
    // Left wall: x fixed ~0.5, z -0.6→-0.2, y 0.8→2.4
    px = 0.3 + h1(i * 2.1) * 0.25;
    py = 0.8 + lp * 1.6;
    pz = -0.55 + h1(i * 3.7) * 0.2;
  } else if (face === 1) {
    // Back wall: x ~0.3→1.0, z -0.6→0.6, y near top
    px = 0.3 + h1(i * 1.5) * 0.7;
    py = 2.2 + h1(i * 4.3) * 0.35;
    pz = (h1(i * 6.1) - 0.5) * 1.1;
  } else {
    // Right wall: mirror of left
    px = 0.3 + h1(i * 2.1) * 0.25;
    py = 0.8 + lp * 1.6;
    pz =  0.55 - h1(i * 3.7) * 0.2;
  }
  ch = hue; cs = 0.7; cl = 0.50;

} else if (nr < 0.71) {
  cylinder(lrp(nr, 0.65, 0.71), 1.3, 0.58,  6.5, -1.2,  4.6, T * 9);
  ch = 0.07; cs = 0.25; cl = 0.26;

} else if (nr < 0.77) {
  cylinder(lrp(nr, 0.71, 0.77), 1.3, 0.58,  6.5, -1.2, -4.6, T * 9);
  ch = 0.07; cs = 0.25; cl = 0.26;

} else if (nr < 0.84) {
  cylinder(lrp(nr, 0.77, 0.84), 1.55, 0.72, -6.2, -0.9,  4.9, T * 9);
  ch = 0.07; cs = 0.25; cl = 0.26;

} else if (nr < 0.91) {
  cylinder(lrp(nr, 0.84, 0.91), 1.55, 0.72, -6.2, -0.9, -4.9, T * 9);
  ch = 0.07; cs = 0.25; cl = 0.26;

} else if (nr < 0.93) {
  axle(lrp(nr, 0.91, 0.93),  6.5, -1.2, -4.0,  4.0);
  ch = 0.0; cs = 0.0; cl = 0.55;

} else if (nr < 0.95) {
  axle(lrp(nr, 0.93, 0.95), -6.2, -0.9, -4.2,  4.2);
  ch = 0.0; cs = 0.0; cl = 0.55;

} else {
  // ── Exhaust plume
  const p     = lrp(nr, 0.95, 1.0);
  const age   = frc(p + T * 0.85);
  const spread= age * age * 1.8;
  const drift = age * exLen * 3;
  px = -9.8 - drift + Math.sin(h1(i * 9.1 + T) * 6.28) * chaos * spread;
  py =  1.2         + Math.cos(h1(i * 5.7 + T) * 6.28) * chaos * spread;
  pz =               (h1(i * 3.1) - 0.5) * spread * 0.7;
  ch = 0.07 - age * 0.04;
  cs = 1.0  - age * 0.92;
  cl = 0.72 - age * 0.32;
}

const jit = chaos * 0.025;
target.set(
  px * sc * 0.1 + Math.sin(T * 0.27 + i * 0.01) * jit,
  py * sc * 0.1 + Math.cos(T * 0.43 + i * 0.01) * jit,
  pz * sc * 0.1
);
color.setHSL((ch + hue) % 1.0, cs, cl);