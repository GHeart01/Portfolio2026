// === HUMAN HEART — 3D Particle Simulation ===
// Controls
const scale       = addControl("scale",     "Heart Size",       0.5,  3.0,  1.4);
const beatSpeed   = addControl("beatSpeed", "Heartbeat Speed",  0.2,  4.0,  1.2);
const beatAmp     = addControl("beatAmp",   "Beat Amplitude",   0.0,  0.5,  0.18);
const chaos       = addControl("chaos",     "Surface Noise",    0.0,  1.0,  0.22);
const colorShift  = addControl("colorShift","Color Shift",      0.0,  1.0,  0.0);
const vessels     = addControl("vessels",   "Vessel Density",   0.0,  1.0,  0.6);

// --- Partition particles into anatomical layers ---
// 0..60%  → main myocardium (heart muscle wall)
// 60..80% → left/right ventricles (interior cavity)
// 80..92% → aorta + pulmonary artery (great vessels)
// 92..100%→ coronary arteries surface tracery

const t = time;
const beat = 1.0 + beatAmp * (
  0.6 * Math.pow(Math.max(0.0, Math.sin(t * beatSpeed * Math.PI * 2.0)), 8.0) +
  0.4 * Math.pow(Math.max(0.0, Math.sin(t * beatSpeed * Math.PI * 2.0 + 0.6)), 3.0)
);

const frac = i / count;
const seed  = (i * 2654435761) >>> 0;          // integer hash, zero-GC
const seed2 = (seed  ^ (seed  >>> 16)) >>> 0;
const seed3 = (seed2 * 2246822519) >>> 0;
const rng1  = (seed3 >>> 0) / 4294967295.0;    // deterministic [0,1]
const rng2  = ((seed3 ^ (seed3 >>> 13)) >>> 0) / 4294967295.0;
const rng3  = ((seed2 ^ (seed2 >>> 7))  >>> 0) / 4294967295.0;

// ── Heart implicit surface (cardioid-of-revolution) ──────────────────────────
// Classic heart formula:  (x²+9/4·y²+z²−1)³ − x²z³ − 9/80·y²z³ = 0
// We parameterize a shell around it by sampling (u,v) angles and projecting
// onto the isosurface via Newton iteration (one step — cheap, good enough).

// u ∈ [0, 2π),  v ∈ [-π, π]
const u = rng1 * 6.28318530718;
const v = rng2 * 3.14159265359 - 1.5707963268;

// Starting guess on a unit sphere
let sx = Math.cos(v) * Math.cos(u);
let sy = Math.cos(v) * Math.sin(u);
let sz = Math.sin(v);

// One Newton step toward the heart isosurface
// f(r) = (r²x²+9/4·r²y²+r²z²−1)³ − r²x²·r³z³ − 9/80·r²y²·r³z³
// Solved numerically for r near 1 using a bisection-free scalar approach:
const A = sx*sx + 2.25*sy*sy + sz*sz;          // = r² coefficient of first term
const B = sx*sx * sz*sz*sz;                     // x²z³ coefficient
const C = 9.0/80.0 * sy*sy * sz*sz*sz;         // 9/80·y²z³ coefficient

// f(r) ≈ (A·r²−1)³ − r⁵·(B+C) ; solve by one Newton iteration from r=1
let r = 1.0;
{
  const Ar2 = A*r*r - 1.0;
  const f   = Ar2*Ar2*Ar2 - r*r*r*r*r*(B+C);
  const df  = 6.0*A*r*Ar2*Ar2 - 5.0*r*r*r*r*(B+C);
  r = r - f / (df + 1e-6);
  r = Math.max(0.3, Math.min(2.2, r));          // clamp for stability
}

// Surface position
let hx = r * sx;
let hy = r * sy;
let hz = r * sz;

// Remap axes so heart stands upright: anatomical Y→up, apex points down
// Raw formula has apex at −Z, so: finalX=hx, finalY=hz, finalZ=hy
let px = hx;
let py = hz;
let pz = hy;

// ── Anatomical layer logic (branchless-ish) ──────────────────────────────────
const isVentricle = frac > 0.60 && frac < 0.80 ? 1.0 : 0.0;
const isVessel    = frac > 0.80 && frac < 0.92 ? 1.0 : 0.0;
const isCoronary  = frac > 0.92              ? 1.0 : 0.0;
const isMyo       = 1.0 - isVentricle - isVessel - isCoronary;

// ── MYOCARDIUM shell with thickness ─────────────────────────────────────────
// add radial thickness noise so it looks like muscle, not a glass ball
const thetaPos = Math.atan2(py, px);
const phiPos   = Math.atan2(Math.sqrt(px*px+py*py), pz);
const muscleTex = 0.5
  + 0.25 * Math.sin(phiPos * 8.0 + t * 0.3)
  + 0.25 * Math.cos(thetaPos * 12.0 - t * 0.2);

const thickness = 0.04 + 0.06 * muscleTex;
const shellR    = 1.0 + rng3 * thickness * 2.0 - thickness;

px = px * (1.0 + isMyo * (shellR - 1.0) * 0.5);
py = py * (1.0 + isMyo * (shellR - 1.0) * 0.5);
pz = pz * (1.0 + isMyo * (shellR - 1.0) * 0.5);

// ── VENTRICLES — hollow interior chambers ───────────────────────────────────
// Left ventricle: slightly left and lower; right: upper right, thinner wall
const vFrac   = (frac - 0.60) / 0.20;               // 0..1 within ventricle band
const isLeft  = vFrac < 0.55 ? 1.0 : 0.0;
const isRight = 1.0 - isLeft;

const lvAngle = rng1 * 6.28318;
const lvR     = 0.22 + 0.13 * rng2;
const lvH     = -0.2 + 0.55 * rng3;

const rvAngle = rng1 * 5.5 + 0.4;
const rvR     = 0.15 + 0.10 * rng2;
const rvH     = 0.05 + 0.40 * rng3;

const vx = isLeft  * (Math.cos(lvAngle)*lvR - 0.18) +
           isRight * (Math.cos(rvAngle)*rvR + 0.22);
const vy = isLeft  * lvH  + isRight * (rvH + 0.10);
const vz = isLeft  * (Math.sin(lvAngle)*lvR - 0.05) +
           isRight * (Math.sin(rvAngle)*rvR + 0.05);

px = px * (1.0 - isVentricle) + vx * isVentricle;
py = py * (1.0 - isVentricle) + vy * isVentricle;
pz = pz * (1.0 - isVentricle) + vz * isVentricle;

// ── GREAT VESSELS — aorta & pulmonary artery rising from base ───────────────
const vsFrac = (frac - 0.80) / 0.12;               // 0..1
const isAorta = vsFrac < 0.55 ? 1.0 : 0.0;
const isPulm  = 1.0 - isAorta;

// Aorta: arches up and to the right from left ventricle outflow tract
const aHeight  = 0.55 + rng3 * 0.65;               // 0.55..1.2 above heart base
const aAngle   = rng1 * 6.28318;
const aRadius  = 0.07 + 0.035 * rng2;
// arch: bend rightward as it rises
const aArch    = aHeight * aHeight * 0.6;
const aox = Math.cos(aAngle) * aRadius - 0.12 + aArch;
const aoy = 0.55 + aHeight;
const aoz = Math.sin(aAngle) * aRadius;

// Pulmonary artery: rises, bends leftward, bifurcates
const pHeight  = 0.45 + rng3 * 0.55;
const pAngle   = rng1 * 6.28318;
const pRadius  = 0.06 + 0.03 * rng2;
const pArch    = pHeight * 0.5;
const pox = Math.cos(pAngle) * pRadius + 0.10 - pArch * 0.4;
const poy = 0.50 + pHeight;
const poz = Math.sin(pAngle) * pRadius - 0.05 + pArch * 0.3;

const vsX = isAorta * aox + isPulm * pox;
const vsY = isAorta * aoy + isPulm * poy;
const vsZ = isAorta * aoz + isPulm * poz;

px = px * (1.0 - isVessel) + vsX * isVessel;
py = py * (1.0 - isVessel) + vsY * isVessel;
pz = pz * (1.0 - isVessel) + vsZ * isVessel;

// ── CORONARY ARTERIES — branching tracery on myocardium surface ─────────────
// Parameterize as offset curves along the heart surface
const coFrac = (frac - 0.92) / 0.08;               // 0..1
// Three main branches: RCA, LAD, LCx
const branch  = Math.floor(coFrac * 3.0);           // 0,1,2
const bFrac   = (coFrac * 3.0) - branch;            // 0..1 along branch

// Each branch: arc along surface parameterized by bFrac + sub-branches
const b0 = branch === 0 ? 1.0 : 0.0;
const b1 = branch === 1 ? 1.0 : 0.0;
const b2 = branch === 2 ? 1.0 : 0.0;

// RCA: runs along right atrioventricular groove → inferior surface
const rcaTheta = -0.3 + bFrac * 2.8;
const rcaPhi   = 0.4  - bFrac * 0.6 + rng2 * 0.05;
const rcaR     = 1.02;

// LAD: descends along anterior interventricular groove
const ladTheta = 0.15 - bFrac * 0.1;
const ladPhi   = 0.9  - bFrac * 1.5 + rng2 * 0.04;
const ladR     = 1.02;

// LCx: circumflex, arcs posteriorly
const lcxTheta = 0.2 + bFrac * 2.2;
const lcxPhi   = 0.3 + bFrac * 0.3 + rng2 * 0.04;
const lcxR     = 1.02;

const cTheta = b0*rcaTheta + b1*ladTheta + b2*lcxTheta;
const cPhi   = b0*rcaPhi   + b1*ladPhi   + b2*lcxPhi;
const cR     = b0*rcaR     + b1*ladR     + b2*lcxR;

// Convert from angular to Cartesian on the heart surface (approximate sphere)
const cosx = Math.cos(cPhi) * Math.cos(cTheta);
const cosy = Math.sin(cPhi);
const cosz = Math.cos(cPhi) * Math.sin(cTheta);

// Tube cross-section
const tubeAngle = rng1 * 6.28318;
const tubeR     = (0.012 + 0.008 * rng3) * vessels;
// Normal ~= position on sphere; tangential = cross product; just jitter radially
const cox = cR * cosx + tubeR * Math.cos(tubeAngle) * (1.0-Math.abs(cosx)+0.3);
const coy = cR * cosy + tubeR * Math.sin(tubeAngle);
const coz = cR * cosz + tubeR * Math.cos(tubeAngle) * (1.0-Math.abs(cosz)+0.3);

px = px * (1.0 - isCoronary) + cox * isCoronary;
py = py * (1.0 - isCoronary) + coy * isCoronary;
pz = pz * (1.0 - isCoronary) + coz * isCoronary;

// ── Surface noise (muscle fiber texture) ────────────────────────────────────
const noiseT  = t * 0.15;
const nAmp    = chaos * 0.04;
const nx = nAmp * Math.sin(px * 9.7 + noiseT) * Math.cos(pz * 7.3);
const ny = nAmp * Math.cos(py * 8.1 - noiseT) * Math.sin(px * 6.2);
const nz = nAmp * Math.sin(pz * 11.3 + noiseT * 1.3);

px += nx * isMyo;
py += ny * isMyo;
pz += nz * isMyo;

// ── Heartbeat pulsation ──────────────────────────────────────────────────────
const pulseScale = scale * (1.0 + (beat - 1.0) * isMyo);

px *= pulseScale;
py *= pulseScale;
pz *= pulseScale;

target.set(px, py, pz);

// ── COLOR MAPPING ────────────────────────────────────────────────────────────
// Oxygenated blood red for ventricles, dark muscle red for myocardium,
// blue-gray for vessels, bright arterial red for coronaries.

const depthFade = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(py / scale * 1.8));
const pulseBright = 0.45 + 0.15 * (beat - 1.0) / (beatAmp + 0.001);

// Hue: myocardium ~0.0 (deep red), ventricle ~0.02 (bright oxygenated red),
// vessels ~0.60 (blue-gray), coronary ~0.01 (arterial)
const hMyo  = 0.0  + colorShift;
const hVent = 0.02 + colorShift;
const hVes  = 0.62 + colorShift;
const hCor  = 0.005 + colorShift;

const hue = (isMyo * hMyo + isVentricle * hVent + isVessel * hVes + isCoronary * hCor) % 1.0;

const satMyo  = 0.85;
const satVent = 0.95;
const satVes  = 0.45;
const satCor  = 0.95;
const sat = isMyo*satMyo + isVentricle*satVent + isVessel*satVes + isCoronary*satCor;

const litMyo  = pulseBright * depthFade;
const litVent = 0.55 + 0.15 * (beat - 1.0) / (beatAmp + 0.001);
const litVes  = 0.45;
const litCor  = 0.60 + 0.15 * Math.sin(t * beatSpeed * Math.PI * 2.0);
const lit = isMyo*litMyo + isVentricle*litVent + isVessel*litVes + isCoronary*litCor;

color.setHSL(hue, sat, Math.max(0.1, Math.min(0.9, lit)));

// ── HUD & Annotations ────────────────────────────────────────────────────────
if (i === 0) {
  setInfo(
    "❤ Human Heart — 3D Particle Anatomy",
    "20,000 particles sculpted into myocardium, ventricles, great vessels & coronary arteries. " +
    "Beat is physiologically modeled. Use sliders to control size, rate, amplitude, noise & vessel density."
  );
  annotate("apex",     new THREE.Vector3(0, -1.35 * scale, 0),         "Apex");
  annotate("base",     new THREE.Vector3(0,  0.7  * scale, 0),         "Base");
  annotate("aorta",    new THREE.Vector3(0.55 * scale, 1.5 * scale, 0),"Aorta");
  annotate("pulm",     new THREE.Vector3(-0.35* scale, 1.4 * scale, 0),"Pulmonary A.");
  annotate("lv",       new THREE.Vector3(-0.2 * scale, -0.1* scale, 0),"Left Ventricle");
  annotate("rv",       new THREE.Vector3( 0.3 * scale,  0.1* scale, 0),"Right Ventricle");
  annotate("lad",      new THREE.Vector3( 0.1 * scale, -0.2* scale, 0.9*scale), "LAD");
}