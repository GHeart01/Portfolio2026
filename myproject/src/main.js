import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// bloom effect
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// scene camera renderer setup
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); 
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

// --- Bloom composer (single renderer) ---
const bloomParams = {
  exposure: 1,
  bloomStrength: 1.2,
  bloomThreshold: 0.0,
  bloomRadius: 0.5,
};

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), bloomParams.bloomStrength, bloomParams.bloomRadius, bloomParams.bloomThreshold);
const bloomComposer = new EffectComposer(renderer);
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

// selective bloom helper: hide non-bloom meshes by swapping materials
const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
const materials = {};

function renderBloom() {
  scene.traverse(function (obj) {
    if (obj.isMesh) {
      if (obj.userData && obj.userData.bloom) return; // keep bloom-marked meshes
      materials[obj.uuid] = obj.material;
      obj.material = darkMaterial;
    }
  });

  bloomComposer.render();

  scene.traverse(function (obj) {
    if (obj.isMesh && materials[obj.uuid]) {
      obj.material = materials[obj.uuid];
      delete materials[obj.uuid];
    }
  });
}

const geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 10 );
const material = new THREE.MeshToonMaterial( { color: 0x00e1ff, wireframe: true } );
const torusKnot = new THREE.Mesh( geometry, material );
// scene.add( torusKnot );

// allow user to move around the scene
const controls = new OrbitControls(camera, renderer.domElement);

// lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper)
// scene.add(lightHelper, gridHelper);



// add stars (collected, emissive, marked for bloom)
const stars = [];
function addStar() {
  const geometry = new THREE.SphereGeometry(0.12, 12, 12);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.6 });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  star.userData.bloom = true;
  scene.add(star);
  stars.push(star);
}

Array(200).fill().forEach(addStar);

// manage scrolling

function moveCamera() {
  const scroll = window.scrollY || window.pageYOffset || 0;
  torusKnot.rotation.x += 0.05;
  torusKnot.rotation.y += 0.075;
  torusKnot.rotation.z += 0.05;

  camera.position.z = -scroll * 0.01;
  camera.position.x = -scroll * 0.0002;
  camera.position.y = -scroll * 0.0002;

  // parallax title effect: scale and push into background on scroll
  const title = document.getElementById('landing-title');
  if (title) {
    const factor = Math.min(1, scroll / (window.innerHeight * 0.8));
    const scale = 1 - factor * 1; // shrink up to 60%
    const translateY = factor * 60; // move slightly downward
    const opacity = 1 - factor * 0.6;
    title.style.transform = `translate(-50%, -50%) translateY(${translateY}px) scale(${scale})`;
    title.style.opacity = `${opacity}`;
  }
}

window.addEventListener('scroll', moveCamera);
// initialize title state
moveCamera();

// reveal-on-scroll using IntersectionObserver
function initRevealObserver() {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    // fallback: make everything visible
    reveals.forEach(r => r.classList.add('visible'));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // optionally unobserve to keep it visible
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(r => obs.observe(r));
}

initRevealObserver();



// animation loop for torus

function animate() {
  requestAnimationFrame(animate);
  
  torusKnot.rotation.x += 0.001; // Rotate the torus knot on the x-axis in radians
  torusKnot.rotation.y += 0.001; // Rotate the torus knot on the y-axis 
  torusKnot.rotation.z += 0.001; // Rotate the torus knot on the z-axis
  // update star positions
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    s.position.z += 0.1;
    if (s.position.z > 60) s.position.z = -50;
  }

  // render bloom pass (only bloom-marked objects) then normal render
  renderBloom();
  renderer.render(scene, camera);

  controls.update();
}

animate()

// keep composer size up to date
window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  bloomComposer.setSize(w, h);
});