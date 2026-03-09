import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

// ─── Easter Egg ───────────────────────────────────────────────────────────────
const brand = `
██╗  ██╗███████╗ █████╗ ██████╗ ████████╗
██║  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝
███████║█████╗  ███████║██████╔╝   ██║   
██╔══██║██╔══╝  ██╔══██║██╔══██╗   ██║   
██║  ██║███████╗██║  ██║██║  ██║   ██║   
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
`;
console.log(`%c${brand}`, `color: #00ffcc; font-weight: bold; font-family: monospace; line-height: 1.2;`);
const socials = `
╔═ Socials ═══════════════╗
║ Mail           ⇒ geraltheart01@gmail.com
║ GitHub         ⇒ https://github.com/GHeart01
║ LinkedIn       ⇒ https://www.linkedin.com/in/geraltheart001
╚═══════════════════════╝
`;
console.log(`%c${socials}`, `color: #00ffcc; font-weight: bold; font-family: monospace; line-height: 1.2;`);
// console.log('Geralt');


// ─── About Me Panel ───────────────────────────────────────────────────────────
const aboutPanel = document.createElement('div');
aboutPanel.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) translateY(100%);
    width: min(600px, 90vw);
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 255, 136, 0.3);
    border-bottom: none;
    border-radius: 16px 16px 0 0;
    color: white;
    font-family: helvetica, arial, sans-serif;
    padding: 32px;
    z-index: 1000;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: default;
`;

aboutPanel.innerHTML = `
    <h2 style="margin: 0 0 12px; font-size: 1.4rem; color: #00ff88; letter-spacing: 0.1em;">ABOUT ME</h2>
    <p style="margin: 0 0 12px; line-height: 1.7; color: rgba(255,255,255,0.85);">
        Hi, I'm Geralt — a CS grad student at CU Boulder specializing in machine learning.
        I build things at the intersection of math, code, and visual systems. 
    </p>
    <p style="margin: 0 0 12px; line-height: 1.7; color: rgba(207, 221, 228, 0.85);">
    This page is still a work in progress, but please come by again to see my progress! 
    </p>
    <p style="margin: 0; line-height: 1.7; color: rgba(255,255,255,0.65); font-size: 0.9rem;">
        Python · TensorFlow · Three.js · RLHF · Applied Mathematics
    </p>

`;

document.body.appendChild(aboutPanel);

// Trigger slide-up after a short delay
setTimeout(() => {
    aboutPanel.style.transform = 'translateX(-50%) translateY(0%)';
}, 800);

// ─── Overlay ──────────────────────────────────────────────────────────────────
// const overlay = document.createElement('div');
// overlay.style.cssText = `
//     position: fixed; top: 16px; left: 16px; color: white;
//     font-family: helvetica, arial, sans-serif; font-size: 20px;
//     line-height: 1.5; pointer-events: none; z-index: 999;
//     text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
// `;
// overlay.innerHTML = 'This is a website in progress, please be patient<br>MAR 08 2026';
// document.body.appendChild(overlay);

// ─── Debug GUI ────────────────────────────────────────────────────────────────
const gui = new GUI({ width: 340, title: 'Press "h" to hide me', closeFolders: false });
gui.hide();
window.addEventListener('keydown', (event) => {
    if (event.key === 'h') gui.show(gui._hidden);
});
const debugObject = {};

// ─── Core Setup ───────────────────────────────────────────────────────────────
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.008);

const sizes = { width: window.innerWidth, height: window.innerHeight };

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    composer.setSize(sizes.width, sizes.height);
});

// ─── Camera ───────────────────────────────────────────────────────────────────
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0.5, 1, 1.5);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// ─── Renderer ─────────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ─── Post-Processing (Bloom) ──────────────────────────────────────────────────
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(sizes.width, sizes.height),
    1.5, 0.4, 0.85
);
bloomPass.strength = 1.8;
bloomPass.radius = 0.4;
bloomPass.threshold = 0;
composer.addPass(bloomPass);

// ─── Textures ─────────────────────────────────────────────────────────────────
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/11.jpg');
matcapTexture.colorSpace = THREE.SRGBColorSpace;
const heartmatcapTexture = textureLoader.load('/textures/matcaps/12.jpg');
heartmatcapTexture.colorSpace = THREE.SRGBColorSpace;

// ─── Light ────────────────────────────────────────────────────
const ambientLight = new THREE.AmbientLight()
scene.add(ambientLight)

// ─── Fonts + Text + Hearts ────────────────────────────────────────────────────
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry('Geralt \n Heart', {
        font,
        size: 0.5,
        depth: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 3
    });
    textGeometry.center();

    const material = new THREE.MeshMatcapMaterial({ 
    matcap: matcapTexture,
    color: 0x888888  // grey tint darkens it; lower hex = darker
})

//     const material = new THREE.MeshStandardMaterial({
//     color: 0xffffff,
//     roughness: 0.6,   // 0 = mirror, 1 = fully matte
//     metalness: 0.2    // 0 = plastic, 1 = full metal
// })
    const text = new THREE.Mesh(textGeometry, material);
    scene.add(text);

    // Heart shape
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, 0, -1, -1, -2, 0);
    heartShape.bezierCurveTo(-3, 1.5, -1.5, 3.5, 0, 4);
    heartShape.bezierCurveTo(1.5, 3.5, 3, 1.5, 2, 0);
    heartShape.bezierCurveTo(1, -1, 0, 0, 0, 0);

    const extrudeSettings = {
        depth: 0.1, bevelEnabled: true, bevelSegments: 10,
        steps: 3, bevelSize: 0.1, bevelThickness: 0.05
    };
    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    const heartMaterial = new THREE.MeshMatcapMaterial({ matcap: heartmatcapTexture });
    heartGeometry.center();

    const heart = new THREE.Mesh(heartGeometry, heartMaterial);
    heart.position.y = -1.5;
    
    heart.scale.set(0.1, 0.1, 0.1);
    scene.add(heart);

    for (let i = 0; i < 100; i++) {
        const h = new THREE.Mesh(heartGeometry, heartMaterial);
        h.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        h.rotation.x = Math.random() * Math.PI;
        h.rotation.y = Math.random() * Math.PI;
        const scaler = Math.random() * 0.1;
        h.position.z = -5 * Math.random()
        h.scale.set(scaler, scaler, scaler);
        scene.add(h);
    }
});

// ─── Fourier Particle Swarm ───────────────────────────────────────────────────
const PARTICLE_COUNT = 5000;
const SPEED_MULT = 0.2;

const fourierGeo = new THREE.TetrahedronGeometry(0.25);
const fourierMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const fourierMesh = new THREE.InstancedMesh(fourierGeo, fourierMat, PARTICLE_COUNT);
fourierMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

// Place the Fourier swarm slightly behind the main scene so it doesn't clash
fourierMesh.position.z = -5;

scene.add(fourierMesh);

// Pre-allocate per-particle state
const particlePositions = [];
const _dummy = new THREE.Object3D();
const _target = new THREE.Vector3();
const _color = new THREE.Color();

for (let i = 0; i < PARTICLE_COUNT; i++) {
    particlePositions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
    ));
    fourierMesh.setColorAt(i, _color.setHex(0x00ff88));
}

// ─── Axes Helper ──────────────────────────────────────────────────────────────
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);
axesHelper.visible = false

// ─── Tick / Animate ───────────────────────────────────────────────────────────
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const time = elapsedTime * SPEED_MULT;

    controls.update();

    // ── Fourier Particle Logic ──────────────────────────────────────────────
    const harmonics = 7;
    const baseRadius = 10;
    const speed = 2.0;
    const phasorCount = Math.floor(PARTICLE_COUNT * 0.2);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const isPhasor = i < phasorCount;

        if (isPhasor) {
            // --- Phasor Circles ---
            const particlesPerHarmonic = Math.floor(phasorCount / harmonics);
            const harmonicIndex = Math.floor(i / particlesPerHarmonic);
            const n = 1 + harmonicIndex * 2;

            let cx = 0, cy = 0;
            for (let k = 1; k < n; k += 2) {
                const prevR = baseRadius * (4 / (k * Math.PI));
                const prevAng = time * speed * k;
                cx += prevR * Math.cos(prevAng);
                cy += prevR * Math.sin(prevAng);
            }

            const r = baseRadius * (4 / (n * Math.PI));
            const angle = time * speed * n;
            const pInGroup = i % particlesPerHarmonic;

            if (pInGroup < particlesPerHarmonic * 0.8) {
                const theta = (pInGroup / (particlesPerHarmonic * 0.8)) * Math.PI * 2;
                _target.set(cx + r * Math.cos(theta), cy + r * Math.sin(theta), 0);
                _color.setHSL(0.1 + harmonicIndex * 0.12, 1.0, 0.5);
            } else {
                const progress = (pInGroup - particlesPerHarmonic * 0.8) / (particlesPerHarmonic * 0.2);
                _target.set(cx + r * Math.cos(angle) * progress, cy + r * Math.sin(angle) * progress, 0);
                _color.setHex(0xffffff);
            }

        } else {
            // --- Waveform Trail ---
            const trailIndex = i - phasorCount;
            const trailTotal = PARTICLE_COUNT - phasorCount;
            const pct = trailIndex / trailTotal;

            const xOffset = 10;
            const waveLength = 100;
            const t_delayed = time - pct * 4.0;

            let sumY = 0;
            for (let h = 0; h < harmonics; h++) {
                const nh = 1 + h * 2;
                const amp = baseRadius * (4 / (nh * Math.PI));
                sumY += amp * Math.sin(nh * t_delayed * speed);
            }

            _target.set(
                xOffset + pct * waveLength,
                sumY,
                Math.sin(pct * 20 + time) * 3
            );

            const hue = 0.6 - pct * 0.4;
            const light = 0.5 + (Math.abs(sumY) / baseRadius) * 0.2;
            _color.setHSL(hue, 0.9, light);
        }

        // Lerp position and update instanced mesh
        particlePositions[i].lerp(_target, 0.1);
        _dummy.position.copy(particlePositions[i]);
        _dummy.updateMatrix();
        fourierMesh.setMatrixAt(i, _dummy.matrix);
        fourierMesh.setColorAt(i, _color);
    }

    fourierMesh.instanceMatrix.needsUpdate = true;
    fourierMesh.instanceColor.needsUpdate = true;

    // Use bloom composer instead of raw renderer.render()
    composer.render();

    window.requestAnimationFrame(tick);
};

tick();