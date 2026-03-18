import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { Timer } from 'three/addons/misc/Timer.js' 
import { easterEgg } from './easterEgg.js'
// ─── Node Figure ───────────────────────────────────────────────────────────────
import { createGalaxy } from './3D_Figures/Galaxy.js';

// ─── Camera lock ───────────────────────────────────────────────────────────────
import { initScrollLock, setScrollLock } from './scrollLock.js';

easterEgg();
// console.log('Geralt');


// // ─── About Me Panel ───────────────────────────────────────────────────────────
const aboutPanel = document.createElement('div');


document.body.appendChild(aboutPanel);

// Trigger slide-up after a short delay
setTimeout(() => {
    aboutPanel.style.transform = 'translateX(-50%) translateY(0%)';
}, 500);



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
controls.enableZoom = false;
controls.minPolarAngle = Math.PI * 0.25;
controls.maxPolarAngle = Math.PI * 0.25;

const controlsFolder = gui.addFolder('Camera Constraints');

const controlSettings = {
    damping: true,
    pan: false,
    zoom: false,
    minAngle: 45,
    maxAngle: 45
};

// Toggle Damping
controlsFolder.add(controlSettings, 'damping').name('Enable Damping').onChange((value) => {
    controls.enableDamping = value;
});

// Toggle Pan
controlsFolder.add(controlSettings, 'pan').name('Enable Pan (right click and drag)').onChange((value) => {
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
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, 
    powerPreference: 'high-performance',
    // preserveDrawingBuffer: true
 });
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
// preview image gen
// setTimeout(() => {
//     renderer.setSize(1200, 630);
//     camera.aspect = 1200 / 630;
//     camera.updateProjectionMatrix();
//     composer.setSize(1200, 630);

//     composer.render();

//     const link = document.createElement('a');
//     link.download = 'preview.png';
//     link.href = renderer.domElement.toDataURL('image/png');
//     link.click();

//     renderer.setSize(sizes.width, sizes.height);
//     camera.aspect = sizes.width / sizes.height;
//     camera.updateProjectionMatrix();
//     composer.setSize(sizes.width, sizes.height);
// }, 2000);
