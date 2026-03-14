import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

import { Timer } from 'three/addons/misc/Timer.js' 

// ─── Node Figure ───────────────────────────────────────────────────────────────
import { createGalaxy } from './3D_Figures/Galaxy.js';


// ─── Camera lock ───────────────────────────────────────────────────────────────
import { initScrollLock } from './scrollLock.js';

// ─── Easter Egg ───────────────────────────────────────────────────────────────
const brand = `
  ██████╗ ███████╗ ██████╗   █████╗  ██╗ ████████╗  ██╗  ██╗███████╗ █████╗ ██████╗ ████████╗
██ ╔════╝ ██╔════╝ ██╔══██╗ ██╔══██╗ ██║ ╚══██╔══╝  ██║  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝
██ ║████╗ █████╗   ██████╔╝ ███████║ ██║    ██║     ███████║█████╗  ███████║██████╔╝   ██║   
██ ╚══██║ ██╔══╝   ██╔══██╗ ██╔══██║ ██╚══╗ ██║     ██╔══██║██╔══╝  ██╔══██║██╔══██╗   ██║   
╔███████║ ███████╗ ██║  ██║ ██║  ██║ █████║ ██║     ██║  ██║███████╗██║  ██║██║  ██║   ██║   
╚═══════╝ ╚══════╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚════╝ ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
`;
console.log(`%c${brand}`, `color: #00ffcc; font-weight: bold; font-family: monospace; line-height: 1.2;`);
const socials = `
╔═ Hello Developer :) ═══════════════╗
║ If you found this page send me a message at my email and I'll respond!
╚═══════════════════════╝

╔═ Socials ═══════════════╗
║ Mail           ⇒ geraltheart01@gmail.com
║ GitHub         ⇒ https://github.com/GHeart01
║ LinkedIn       ⇒ https://www.linkedin.com/in/geraltheart001
╚═══════════════════════╝

╔═ Debug ═══════════════╗
║ You can access the debug mode by pressing 'h'
╚═══════════════════════╝

╔═ Source code ═════════╗
║ The code for this portfolio is available on GitHub 
║ https://github.com/GHeart01/Portfolio2026
╚═══════════════════════╝
`;
console.log(`%c${socials}`, `color: #00ffcc; font-weight: bold; font-family: monospace; line-height: 1.2;`);
// console.log('Geralt');


// // ─── About Me Panel ───────────────────────────────────────────────────────────
const aboutPanel = document.createElement('div');
// aboutPanel.style.cssText = `
//     position: fixed;
//     bottom: 0;
//     left: 50%;
//     transform: translateX(-50%) translateY(100%);
//     width: min(600px, 90vw);
//     background: rgba(0, 0, 0, 0.75);
//     backdrop-filter: blur(12px);
//     border: 1px solid rgba(0, 255, 136, 0.3);
//     border-bottom: none;
//     border-radius: 16px 16px 0 0;
//     color: white;
//     font-family: helvetica, arial, sans-serif;
//     padding: 32px;
//     z-index: 1000;
//     transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);

//     cursor: default;
// `;

// aboutPanel.innerHTML = `
//     <h2 style="margin: 0 0 12px; font-size: 1.4rem; color: #00ff88; letter-spacing: 0.1em;">ABOUT ME</h2>
//     <p style="margin: 0 0 12px; line-height: 1.7; color: rgba(255,255,255,0.85);">
//         Hi, I'm Geralt — a CS grad student at CU Boulder specializing in machine learning.
//         I build things at the intersection of math, code, and visual systems. 
//     </p>
//     <p style="margin: 0 0 12px; line-height: 1.7; color: rgba(207, 221, 228, 0.85);">
//     This page is still a work in progress, but please come by again to see my progress! 
//     </p>
//     <p style="margin: 0; line-height: 1.7; color: rgba(255,255,255,0.65); font-size: 0.9rem;">
//         Python · TensorFlow · Three.js · RLHF · Applied Mathematics
//     </p>

// `;

document.body.appendChild(aboutPanel);

// Trigger slide-up after a short delay
setTimeout(() => {
    aboutPanel.style.transform = 'translateX(-50%) translateY(0%)';
}, 500);

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
camera.position.set(1, 0.5, 0);
// init scroll lock and pass in your camera
initScrollLock(camera, scene);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
controls.enablePan = false;
controls.enableZoom = true;
controls.minPolarAngle = Math.PI * 0.25;
controls.maxPolarAngle = Math.PI * 0.25;

const controlsFolder = gui.addFolder('Camera Constraints');

const controlSettings = {
    damping: true,
    pan: false,
    zoom: true,
    minAngle: 45,
    maxAngle: 45
};

// Toggle Damping
controlsFolder.add(controlSettings, 'damping').name('Enable Damping').onChange((value) => {
    controls.enableDamping = value;
});

// Toggle Pan
controlsFolder.add(controlSettings, 'pan').name('Enable Pan').onChange((value) => {
    controls.enablePan = value;
});

// Toggle Zoom
controlsFolder.add(controlSettings, 'zoom').name('Enable Zoom').onChange((value) => {
    controls.enableZoom = value;
});

// Min Angle Slider
controlsFolder.add(controlSettings, 'minAngle', 0, 180).name('Min Polar Angle').onChange((value) => {
    controls.minPolarAngle = (value * Math.PI) / 180;
});

// Max Angle Slider
controlsFolder.add(controlSettings, 'maxAngle', 0, 180).name('Max Polar Angle').onChange((value) => {
    controls.maxPolarAngle = (value * Math.PI) / 180;
});


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
bloomPass.strength = .4;
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

// ───  Ground Layer ────────────────────────────────────────────────────
// const ground = new THREE.Mesh(
//     new THREE.PlaneGeometry(1,1),
//     new THREE.MeshPhysicalMaterial({color: 0x888888})
// )
for (let i = -20; i < 20; i ++){
    for (let j = -20; j < 20; j++){

        const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1),
        new THREE.MeshPhysicalMaterial({color: 0x888888})
    )
        const spacing = 1.01
        ground.position.x = i *spacing
        ground.position.z = j * spacing +0.05

        ground.rotation.x = - Math.PI / 2
        // scene.add(ground)
    }
}

// Node module
const galaxyUpdate = createGalaxy(scene, THREE);


// ─── Axes Helper ──────────────────────────────────────────────────────────────
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);
axesHelper.visible = false

// ─── Tick / Animate ───────────────────────────────────────────────────────────
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed() // now must be updated manually
    // console.log(elapsedTime)

    controls.update();

    galaxyUpdate(elapsedTime); 
    
    // Use bloom composer instead of raw renderer.render()
    composer.render();

    window.requestAnimationFrame(tick);
};

tick();