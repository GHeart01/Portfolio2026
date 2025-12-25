import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene  = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); 

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 10 );
const material = new THREE.MeshToonMaterial( { color: 0x00e1ff, wireframe: true } );
const torusKnot = new THREE.Mesh( geometry, material );
scene.add( torusKnot );


// lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper)
// scene.add(lightHelper, gridHelper);

// allow user to move around the scene

const controls = new OrbitControls(camera, renderer.domElement);

// add stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  // const [x, y, z] = Array(3).fill().map(() => THREE.random() * 100 - 50);
  star.position.set(x, y, z);
  scene.add(star);
}

Array(100).fill().forEach(addStar);

// manage scrolling

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  torusKnot.rotation.x += 0.05;
  torusKnot.rotation.y += 0.075;
  torusKnot.rotation.z += 0.05;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;



// animation loop for torus

function animate() {
  requestAnimationFrame(animate);
  
  torusKnot.rotation.x += 0.001; // Rotate the torus knot on the x-axis in radians
  torusKnot.rotation.y += 0.001; // Rotate the torus knot on the y-axis 
  torusKnot.rotation.z += 0.001; // Rotate the torus knot on the z-axis
  renderer.render(scene, camera);

  controls.update();
}

animate()