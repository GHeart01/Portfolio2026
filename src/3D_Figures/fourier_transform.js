// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// export class ParticlesSwarm {
//     constructor(container, count = 5000) {
//         this.count = count;
//         this.container = container;
//         this.speedMult = 0.2;
        
//         // SETUP
//         this.scene = new THREE.Scene();
//         this.scene.fog = new THREE.FogExp2(0x000000, 0.01);
//         this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
//         this.camera.position.set(0, 0, 100);
        
//         // this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
//         this.renderer.setSize(window.innerWidth, window.innerHeight);
//         // this.container.appendChild(this.renderer.domElement);

//         // POST PROCESSING
//         this.composer = new EffectComposer(this.renderer);
//         this.composer.addPass(new RenderPass(this.scene, this.camera));
//         const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
//         bloomPass.strength = 1.8; bloomPass.radius = 0.4; bloomPass.threshold = 0;
//         this.composer.addPass(bloomPass);

//         // OBJECTS
//         this.dummy = new THREE.Object3D();
//         this.color = new THREE.Color();
//         this.target = new THREE.Vector3();
//         this.pColor = new THREE.Color();
        
//         this.geometry = new THREE.TetrahedronGeometry(0.25);
//         this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
//         this.mesh = new THREE.InstancedMesh(this.geometry, this.material, this.count);
//         this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
//         this.scene.add(this.mesh);
        
//         this.positions = [];
//         for(let i=0; i<this.count; i++) {
//             this.positions.push(new THREE.Vector3((Math.random()-0.5)*100, (Math.random()-0.5)*100, (Math.random()-0.5)*100));
//             this.mesh.setColorAt(i, this.color.setHex(0x00ff88));
//         }
        
//         this.clock = new THREE.Clock();
//         this.animate = this.animate.bind(this);
//         this.animate();
//     }

//     animate() {
//         requestAnimationFrame(this.animate);
//         const time = this.clock.getElapsedTime() * this.speedMult;
        
//         if(this.material.uniforms && this.material.uniforms.uTime) {
//             this.material.uniforms.uTime.value = time;
//         }

//         // API Stubs
//         const PARAMS = {};
//         const addControl = (id, l, min, max, val) => {
//              return PARAMS[id] !== undefined ? PARAMS[id] : val;
//         };
//         const setInfo = () => {};
//         const annotate = () => {};
//         let THREE_LIB = THREE;
        
//         // let THREE_LIB = THREE;
//         const count = this.count; // Alias for user code
        
//         for(let i=0; i<this.count; i++) {
//             let target = this.target;
//             let color = this.pColor;
            
//             // INJECTED CODE
//             // --- FOURIER SERIES VISUALIZATION (SQUARE WAVE) ---
            
//             // 1. CONSTANTS & CONFIGURATION
//             const harmonics = 7; // Number of iterations (1, 3, 5, 7, 9, 11, 13)
//             const baseRadius = 25;
//             const speed = 2.0;
            
//             // Partition the particle count
//             // 20% dedicated to the rotating "Phasors" (The Circles)
//             // 80% dedicated to the "Waveform" (The Trail)
//             const phasorCount = Math.floor(count * 0.2);
//             const isPhasor = i < phasorCount;
            
//             // 2. EDUCATIONAL HUD
//             if (i === 0) {
//                 setInfo(
//                     "FOURIER SERIES DECOMPOSITION",
//                     "Visualizing a Square Wave constructed from pure Sine waves.\n\n" +
//                     "Math: f(t) = (4/π) * Σ [ sin(nωt) / n ]\n" +
//                     "Harmonics: Odd integers (n = 1, 3, 5...)\n" +
//                     "Concept: Any complex periodic wave can be constructed by adding simple sine waves."
//                 );
                
//                 annotate("generator", new THREE.Vector3(0, 15, 0), "Phasor Summation");
//                 annotate("wave", new THREE.Vector3(40, 0, 0), "Time Domain Output");
//             }
            
//             // 3. MATHEMATICAL SIMULATION
            
//             if (isPhasor) {
//                 // --- PART A: THE PHASOR MACHINE (Rotating Circles) ---
//                 // We split these particles to draw the circles for harmonic 1, 3, 5, etc.
                
//                 // Determine which harmonic circle this particle belongs to
//                 // We distribute particles evenly across the harmonic steps
//                 const particlesPerHarmonic = Math.floor(phasorCount / harmonics);
//                 const harmonicIndex = Math.floor(i / particlesPerHarmonic); 
//                 const n = 1 + (harmonicIndex * 2); // Odd numbers: 1, 3, 5...
                
//                 // Calculate the center position of THIS specific harmonic circle
//                 // The center of circle N is the tip of the vector of circle N-2
//                 let cx = 0, cy = 0;
                
//                 // Sum up vectors of previous harmonics to find current center
//                 for (let k = 1; k < n; k += 2) {
//                     let prevR = baseRadius * (4 / (k * Math.PI));
//                     let prevAng = (time * speed * k);
//                     cx += prevR * Math.cos(prevAng);
//                     cy += prevR * Math.sin(prevAng);
//                 }
            
//                 // Current Circle properties
//                 const r = baseRadius * (4 / (n * Math.PI));
//                 const angle = (time * speed * n);
                
//                 // Draw the Circle Perimeter OR the Vector Arm
//                 // We use modulo to decide if this particle is on the ring or the arm
//                 const pInGroup = i % particlesPerHarmonic;
                
//                 if (pInGroup < particlesPerHarmonic * 0.8) {
//                     // Ring: Distribute particles around 0 to 2PI
//                     const theta = (pInGroup / (particlesPerHarmonic * 0.8)) * Math.PI * 2;
//                     target.x = cx + r * Math.cos(theta);
//                     target.y = cy + r * Math.sin(theta);
//                     target.z = 0;
                    
//                     // Color: Distinct for each harmonic
//                     color.setHSL(0.1 + (harmonicIndex * 0.12), 1.0, 0.5);
//                 } else {
//                     // Arm: Line from center to tip
//                     const progress = (pInGroup - particlesPerHarmonic * 0.8) / (particlesPerHarmonic * 0.2);
//                     target.x = cx + (r * Math.cos(angle) * progress);
//                     target.y = cy + (r * Math.sin(angle) * progress);
//                     target.z = 0;
                    
//                     // Color: Bright White for the arms
//                     color.setHex(0xffffff);
//                 }
            
//             } else {
//                 // --- PART B: THE WAVEFORM (Time Domain Trail) ---
//                 // These particles represent the history of the values flowing along the X-axis
                
//                 // Normalized position in the trail (0.0 to 1.0)
//                 const trailIndex = i - phasorCount;
//                 const trailTotal = count - phasorCount;
//                 const pct = trailIndex / trailTotal;
                
//                 // X Position: Flowing to the right
//                 const xOffset = 30; // Gap between circle and wave
//                 const waveLength = 100;
//                 target.x = xOffset + (pct * waveLength);
                
//                 // Calculate Y Position: The Fourier Sum for a specific time in the past
//                 // t_delayed is the time represented by this specific point on the wave
//                 const t_delayed = time - (pct * 4.0); // 4.0 is the time width of the window
                
//                 let sumY = 0;
                
//                 // Perform the Fourier Summation Loop
//                 // Formula: (4/pi) * (sin(t) + sin(3t)/3 + sin(5t)/5 ...)
//                 for (let h = 0; h < harmonics; h++) {
//                     let n = 1 + (h * 2); // 1, 3, 5...
//                     let amp = baseRadius * (4 / (n * Math.PI));
//                     sumY += amp * Math.sin(n * t_delayed * speed);
//                 }
                
//                 target.y = sumY;
                
//                 // Z Position: Add a "Ribbon" effect for depth
//                 // Instead of a 2D line, we give it width based on the derivative or just a simple twist
//                 target.z = Math.sin(pct * 20 + time) * 3;
                
//                 // 4. COLORING (The Wave)
//                 // Gradient from "Hot" (New) to "Cold" (Old)
//                 // We visualize the value (Y) in the hue slightly to emphasize peaks
//                 const hue = 0.6 - (pct * 0.4); // Blue to Cyan/Green
//                 const light = 0.5 + (Math.abs(sumY) / baseRadius) * 0.2; // Brighter at peaks
                
//                 color.setHSL(hue, 0.9, light);
//             }
            
//             // UPDATE
//             this.positions[i].lerp(this.target, 0.1);
//             this.dummy.position.copy(this.positions[i]);
//             this.dummy.updateMatrix();
//             this.mesh.setMatrixAt(i, this.dummy.matrix);
//             this.mesh.setColorAt(i, this.pColor);
//         }
//         this.mesh.instanceMatrix.needsUpdate = true;
//         this.mesh.instanceColor.needsUpdate = true;
        
//         this.composer.render();
//     }
    
//     dispose() {
//         this.geometry.dispose();
//         this.material.dispose();
//         this.scene.remove(this.mesh);
//         this.renderer.dispose();
//     }
// }