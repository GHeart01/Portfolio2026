import { content } from './sectionContent.js';
import gsap from 'gsap';
import * as THREE from 'three';

const sections = [
  { angle: 0,              y: 2  }, // 1
  { angle: Math.PI * 0.5,  y: 8  }, // 2
  { angle: Math.PI * 1.0,  y: 14 }, // 3
  { angle: Math.PI * 1.5,  y: 20 }, // 4
  { angle: Math.PI * 2.0,  y: 26 }, // 5
  { angle: Math.PI * 2.5,  y: 32 }, // 6
  { angle: Math.PI * 3.0,  y: 38 }, // 7
  { angle: Math.PI * 3.5,  y: 44 }, // 8 
  { angle: Math.PI * 4.0,  y: 50 }, // 9 
  { angle: Math.PI * 4.5,  y: 56 }, // 10

  { angle: 0,              y: 2  }, // 1
  { angle: Math.PI * 0.5,  y: 8  }, // 2
  { angle: Math.PI * 1.0,  y: 14 }, // 3
  { angle: Math.PI * 1.5,  y: 20 }, // 4
  { angle: Math.PI * 2.0,  y: 26 }, // 5
  { angle: Math.PI * 2.5,  y: 32 }, // 6
  { angle: Math.PI * 3.0,  y: 38 }, // 7
  { angle: Math.PI * 3.5,  y: 44 }, // 8 
  { angle: Math.PI * 4.0,  y: 50 }, // 9 
  { angle: Math.PI * 4.5,  y: 56 }, // 10

  { angle: 0,              y: 2  }, // 1
  { angle: Math.PI * 0.5,  y: 8  }, // 2
  { angle: Math.PI * 1.0,  y: 14 }, // 3
  { angle: Math.PI * 1.5,  y: 20 }, // 4
  { angle: Math.PI * 2.0,  y: 26 }, // 5
  { angle: Math.PI * 2.5,  y: 32 }, // 6
  { angle: Math.PI * 3.0,  y: 38 }, // 7
  { angle: Math.PI * 3.5,  y: 44 }, // 8 
  { angle: Math.PI * 4.0,  y: 50 }, // 9 
  { angle: Math.PI * 4.5,  y: 56 }, // 10

  { angle: 0,              y: 2  }, // 1
  { angle: Math.PI * 0.5,  y: 8  }, // 2
  { angle: Math.PI * 1.0,  y: 14 }, // 3
  { angle: Math.PI * 1.5,  y: 20 }, // 4
  { angle: Math.PI * 2.0,  y: 26 }, // 5
  { angle: Math.PI * 2.5,  y: 32 }, // 6
  { angle: Math.PI * 3.0,  y: 38 }, // 7
  { angle: Math.PI * 3.5,  y: 44 }, // 8 
  { angle: Math.PI * 4.0,  y: 50 }, // 9 
  { angle: Math.PI * 4.5,  y: 56 }, // 10
];




const ORBIT_RADIUS = 10; // distance from center of scene

let current = 0;
let locked = false;

export function initScrollLock(camera, scene) {
  // proxy object to tween angle and height
  const proxy = {
    angle: sections[0].angle,
    y: sections[0].y,
  };

  // set initial camera position
  camera.position.set(
    Math.sin(proxy.angle) * ORBIT_RADIUS,
    proxy.y,
    Math.cos(proxy.angle) * ORBIT_RADIUS
  );
  camera.lookAt(0, proxy.y, 0); // look at center of scene

  function goTo(i) {
    if (locked || i < 0 || i >= sections.length) return;
    locked = true;
    current = i;

    gsap.to(proxy, {
      angle: sections[i].angle,
      y: sections[i].y,
      duration: 1.0,
      ease: 'expo.inOut',
      onUpdate: () => {
        // update camera position every frame of the tween
        camera.position.set(
          Math.sin(proxy.angle) * ORBIT_RADIUS,
          proxy.y,
          Math.cos(proxy.angle) * ORBIT_RADIUS
        );
        camera.lookAt(0, proxy.y, 0);
      },
      onComplete: () => locked = false
    });
  }

  window.addEventListener('wheel', e => {
    e.preventDefault();
    goTo(e.deltaY > 0 ? current + 1 : current - 1);
  }, { passive: false });

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') goTo(current + 1);
    if (e.key === 'ArrowUp') goTo(current - 1);
  });

  let touchStartY = 0;
  window.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
  });
  window.addEventListener('touchmove', e => {
    e.preventDefault();
    const delta = touchStartY - e.touches[0].clientY;
    if (Math.abs(delta) > 50) {
      goTo(delta > 0 ? current + 1 : current - 1);
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: false });
}