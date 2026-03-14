/**
 * 3D_Figures/Galaxy.js
 *
 * Creates a barred spiral galaxy as a Three.js Points object and adds it to
 * the provided scene. THREE is passed in — never imported here — so there is
 * only ever one Three.js instance in the bundle.
 *
 * Usage in script.js:
 *
 *   import { createGalaxy } from './3D_Figures/Galaxy.js';
 *
 *   const galaxyUpdate = createGalaxy(scene, THREE);
 *
 *   // inside tick():
 *   galaxyUpdate(elapsedTime);
 */

export function createGalaxy(scene, THREE) {

  // ── Parameters ────────────────────────────────────────────────────────────
  const COUNT      = 20000;
  const ARM_COUNT  = 2;
  const SPREAD     = 0.9;
  const RADIUS     = 60;
  const TILT       = 0.08;
  const ROT_SPEED  = 0.18;
  const HALO_FRAC  = 0.12;

  // ── Geometry buffers ──────────────────────────────────────────────────────
  const positions = new Float32Array(COUNT * 3);
  const colors    = new Float32Array(COUNT * 3);

  // Reusable objects — allocated once, never inside the loop
  const _target = new THREE.Vector3();
  const _color  = new THREE.Color();

  // ── Build static positions & colors ──────────────────────────────────────
  // (rotation is applied at runtime via the Points mesh, not per-particle)
  for (let i = 0; i < COUNT; i++) {

    const seed1 = (i * 127  + 31) % COUNT / COUNT;
    const seed2 = (i * 7919 + 97) % COUNT / COUNT;
    const seed3 = (i * 1009 + 53) % COUNT / COUNT;

    const haloMask = seed3 < HALO_FRAC ? 1.0 : 0.0;
    const diskMask = 1.0 - haloMask;

    // Disk — exponential radial distribution
    const rawR  = -Math.log(1.0 - seed1 * 0.9999);
    const diskR = rawR * (RADIUS / 4.5);

    // Spiral arm placement
    const arm         = Math.floor(seed2 * ARM_COUNT);
    const armOffset   = (arm / ARM_COUNT) * Math.PI * 2.0;
    const spiralTwist = diskR * 0.55;
    const scatter     = (seed2 * 2.0 - 1.0) * SPREAD * (diskR / RADIUS) * 8.0;
    const armAngle    = armOffset + spiralTwist + scatter;

    const diskX = Math.cos(armAngle) * diskR;
    const diskZ = Math.sin(armAngle) * diskR;
    const diskY = (seed1 - 0.5) * 1.8 * (diskR / RADIUS + 0.05);

    // Halo — spherical shell
    const hTheta = seed1 * Math.PI * 2.0;
    const hPhi   = Math.acos(2.0 * seed2 - 1.0);
    const hR     = RADIUS * (0.4 + seed3 * 1.4);

    const haloX = Math.sin(hPhi) * Math.cos(hTheta) * hR;
    const haloY = Math.cos(hPhi) * hR;
    const haloZ = Math.sin(hPhi) * Math.sin(hTheta) * hR;

    const finalX = diskX * diskMask + haloX * haloMask;
    const finalY = diskY * diskMask + haloY * haloMask + finalX * TILT;
    const finalZ = diskZ * diskMask + haloZ * haloMask;

    positions[i * 3]     = finalX;
    positions[i * 3 + 1] = finalY;
    positions[i * 3 + 2] = finalZ;

    // Color — stellar temperature by radius / zone
    const normR    = diskR / RADIUS;
    const coreGlow = Math.exp(-normR * 3.5);

    const diskHue = 0.58 - normR * 0.48 + (seed1 - 0.5) * 0.04;
    const diskSat = 0.55 + coreGlow * 0.35;
    const diskLit = 0.35 + coreGlow * 0.5 + seed1 * 0.12;

    const haloHue = 0.07 + seed2 * 0.06;
    const haloLit = 0.22 + seed1 * 0.2;

    const finalHue = diskHue * diskMask + haloHue * haloMask;
    const finalSat = diskSat * diskMask + 0.5     * haloMask;
    const finalLit = diskLit * diskMask + haloLit * haloMask;

    _color.setHSL(finalHue, finalSat, finalLit);
    colors[i * 3]     = _color.r;
    colors[i * 3 + 1] = _color.g;
    colors[i * 3 + 2] = _color.b;
  }

  // ── Geometry ──────────────────────────────────────────────────────────────
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

  // ── Material ──────────────────────────────────────────────────────────────
  const material = new THREE.PointsMaterial({
    size:         0.15,
    sizeAttenuation: true,
    vertexColors: true,
    depthWrite:   false,
    blending:     THREE.AdditiveBlending,
  });

  // ── Mesh ──────────────────────────────────────────────────────────────────
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // ── Update function (call inside tick) ────────────────────────────────────
  // Differential rotation: the disk spins faster than the outer halo.
  // We approximate this cheaply by rotating the whole Points object.
  return function update(elapsedTime) {
    points.rotation.y = elapsedTime * ROT_SPEED * 0.15;
  };
}