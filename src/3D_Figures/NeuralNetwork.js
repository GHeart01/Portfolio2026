

// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// CONFIG
const COUNT = 20000;
const SPEED_MULT = 1;
const AUTO_SPIN = true;

// SETUP
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.01);
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 100);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = AUTO_SPIN;
controls.autoRotateSpeed = 2.0;

// POST PROCESSING
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.strength = 1.8; bloomPass.radius = 0.4; bloomPass.threshold = 0;
composer.addPass(bloomPass);

// SWARM OBJECTS
const dummy = new THREE.Object3D();
const color = new THREE.Color();
const target = new THREE.Vector3();
const pColor = new THREE.Color(); // Kept for safety, for potential references

// INSTANCED MESH
const geometry = new THREE.TetrahedronGeometry(0.25);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

const instancedMesh = new THREE.InstancedMesh(geometry, material, COUNT);
instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
scene.add(instancedMesh);

// DATA ARRAYS
const positions = [];
for(let i=0; i<COUNT; i++) {
    positions.push(new THREE.Vector3((Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100));
    instancedMesh.setColorAt(i, color.setHex(0x00ff88)); // Init Color
}

// CONTROL STUBS
const PARAMS = {"depth":60,"width":30,"speed":2,"synaptic":0.2};
const addControl = (id, label, min, max, val) => {
    return PARAMS[id] !== undefined ? PARAMS[id] : val;
};
const setInfo = () => {};
const annotate = () => {};

// ANIMATION LOOP
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const time = clock.getElapsedTime() * SPEED_MULT;
    
    // Shader Time Update
    if(material.uniforms && material.uniforms.uTime) {
        material.uniforms.uTime.value = time;
    }

    controls.update();

    // SWARM LOGIC
    const count = COUNT; // Alias for user code compatibility
    for(let i=0; i<COUNT; i++) {
            // USER CODE INJECTION START
            const depth = addControl("depth", "Layer Depth", 20, 100, 60);
            const width = addControl("width", "Layer Width", 10, 50, 30);
            const speed = addControl("speed", "Signal Velocity", 0.5, 5.0, 2.0);
            const synaptic = addControl("synaptic", "Synaptic Noise", 0.0, 1.0, 0.2);
            
            const layerCount = 5;
            const particlesPerLayer = Math.floor(count / (layerCount + (layerCount - 1)));
            const t = time * speed;
            
            let x, y, z, h, s, l;
            
            if (i < count * 0.4) {
            const layerIdx = Math.floor((i / (count * 0.4)) * layerCount);
            const pInLayer = i % Math.floor((count * 0.4) / layerCount);
            
            const gridSide = Math.sqrt((count * 0.4) / layerCount);
            const gx = (pInLayer % gridSide) - gridSide * 0.5;
            const gy = Math.floor(pInLayer / gridSide) - gridSide * 0.5;
            
            const pulse = Math.sin(t + layerIdx - Math.sqrt(gx * gx + gy * gy) * 0.5);
            
            x = (layerIdx - (layerCount - 1) * 0.5) * (depth / layerCount);
            y = gx * (width / gridSide);
            z = gy * (width / gridSide);
            
            h = 0.6 - (layerIdx * 0.05);
            s = 0.8;
            l = 0.2 + (pulse * 0.15 + 0.15);
            
            const excitation = Math.max(0, pulse);
            y += (Math.random() - 0.5) * synaptic * excitation;
            z += (Math.random() - 0.5) * synaptic * excitation;
            } else {
            const segment = (i - count * 0.4) % (layerCount - 1);
            const pInFlow = (i - count * 0.4);
            const progress = ((pInFlow + t * 50) % 1000) / 1000;
            
            const startLayer = segment;
            const endLayer = segment + 1;
            
            const xStart = (startLayer - (layerCount - 1) * 0.5) * (depth / layerCount);
            const xEnd = (endLayer - (layerCount - 1) * 0.5) * (depth / layerCount);
            
            const seed = (pInFlow % 100);
            const yOffset = Math.sin(seed) * (width * 0.4);
            const zOffset = Math.cos(seed) * (width * 0.4);
            
            x = xStart + (xEnd - xStart) * progress;
            y = yOffset + (Math.random() - 0.5) * synaptic;
            z = zOffset + (Math.random() - 0.5) * synaptic;
            
            h = 0.1;
            s = 1.0;
            l = Math.pow(1.0 - Math.abs(progress - 0.5) * 2.0, 2.0) * 0.8;
            }
            
            target.set(x, y, z);
            color.setHSL(h, s, l);
            
            if (i === 0) {
            setInfo("Neural Architecture", "A feed-forward topology visualizing weight activation and signal propagation.");
            annotate("input", new THREE.Vector3(-depth * 0.5, 0, 0), "Input Vector");
            annotate("output", new THREE.Vector3(depth * 0.5, 0, 0), "Prediction");
            }
            // USER CODE INJECTION END

            // LERP & UPDATE
            positions[i].lerp(target, 0.1);
            dummy.position.copy(positions[i]);
            dummy.updateMatrix();
            instancedMesh.setMatrixAt(i, dummy.matrix);
            instancedMesh.setColorAt(i, color); // Fix: Use 'color' which user modifies
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    instancedMesh.instanceColor.needsUpdate = true;

    composer.render();
}
animate();


