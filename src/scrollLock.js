import { content } from './sectionContent.js';
import gsap from 'gsap';

const sections = [
  { angle: 0,              y: 2  },
  { angle: Math.PI * 0.5,  y: 8  },
  { angle: Math.PI * 1.0,  y: 14 },
  { angle: Math.PI * 1.5,  y: 20 },
  { angle: Math.PI * 2.0,  y: 26 },
  { angle: Math.PI * 2.5,  y: 32 },
  { angle: Math.PI * 3.0,  y: 38 },
  { angle: Math.PI * 3.5,  y: 44 },
  { angle: Math.PI * 4.0,  y: 50 },
  // { angle: Math.PI * 4.5,  y: 56 },

  { angle: 0,              y: 2  },
  { angle: Math.PI * 0.5,  y: 8  },
  { angle: Math.PI * 1.0,  y: 14 },
  { angle: Math.PI * 1.5,  y: 20 },
  { angle: Math.PI * 2.0,  y: 26 },
  { angle: Math.PI * 2.5,  y: 32 },
  { angle: Math.PI * 3.0,  y: 38 },
  { angle: Math.PI * 3.5,  y: 44 },
  { angle: Math.PI * 4.0,  y: 50 },
  // { angle: Math.PI * 4.5,  y: 56 },

  { angle: 0,              y: 2  },
  { angle: Math.PI * 0.5,  y: 8  },
  { angle: Math.PI * 1.0,  y: 14 },
  { angle: Math.PI * 1.5,  y: 20 },
  { angle: Math.PI * 2.0,  y: 26 },
  { angle: Math.PI * 2.5,  y: 32 },
  { angle: Math.PI * 3.0,  y: 38 },
  { angle: Math.PI * 3.5,  y: 44 },
  { angle: Math.PI * 4.0,  y: 50 },
  // { angle: Math.PI * 4.5,  y: 56 },

  { angle: 0,              y: 2  },
  { angle: Math.PI * 0.5,  y: 8  },
  { angle: Math.PI * 1.0,  y: 14 },
  { angle: Math.PI * 1.5,  y: 20 },
  { angle: Math.PI * 2.0,  y: 26 },
  { angle: Math.PI * 2.5,  y: 32 },
  { angle: Math.PI * 3.0,  y: 38 },
  { angle: Math.PI * 3.5,  y: 44 },
  { angle: Math.PI * 4.0,  y: 50 },
  // { angle: Math.PI * 4.5,  y: 56 },
];

const ORBIT_RADIUS     = 10;
const PANEL_DISPLAY_MS = 4000; // ms before auto-dismiss
const FADE_MS          = 400;  // must match CSS transition durations

let current      = 0;
let locked       = false;
let dismissTimer = null;

// ─── Styles ───────────────────────────────────────────────────────────────────

const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:ital,wght@0,300;0,400;0,500&display=swap');

  #hud-panel {
    --green:  #00ffaa;
    --green2: #00cc88;

    position: fixed;
    top: 50%;
    left: clamp(16px, 5vw, 64px);
    width: min(420px, 88vw);

    background: rgba(4, 10, 18, 0.75);
    backdrop-filter: blur(20px) saturate(1.5);
    -webkit-backdrop-filter: blur(20px) saturate(1.5);

    border: 1px solid rgba(0, 255, 170, 0.2);
    border-left: 3px solid var(--green);
    border-radius: 4px 12px 12px 4px;

    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(13px, 1.4vw, 15px);
    line-height: 1.75;
    padding: clamp(20px, 3vw, 30px) clamp(20px, 3vw, 28px);

    z-index: 1000;
    box-shadow:
      0 0 40px rgba(0,255,170,0.06),
      0 12px 40px rgba(0,0,0,0.6);

    /* default: hidden, nudged left */
    opacity: 0;
    pointer-events: none;
    transform: translateY(-50%) translateX(-16px);
    transition:
      opacity    ${FADE_MS}ms cubic-bezier(0.16, 1, 0.3, 1),
      transform  ${FADE_MS}ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* corner bracket top-right */
  #hud-panel::before {
    content: '';
    position: absolute;
    top: 10px; right: 10px;
    width: 7px; height: 7px;
    border-top: 1.5px solid var(--green2);
    border-right: 1.5px solid var(--green2);
  }
  /* corner bracket bottom-right */
  #hud-panel::after {
    content: '';
    position: absolute;
    bottom: 10px; right: 10px;
    width: 7px; height: 7px;
    border-bottom: 1.5px solid var(--green2);
    border-right: 1.5px solid var(--green2);
  }

  /* visible — slides in */
  #hud-panel.visible {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(-50%) translateX(0);
  }

  /* hiding — slides out (faster, snappier ease) */
  #hud-panel.hiding {
    opacity: 0;
    pointer-events: none;
    transform: translateY(-50%) translateX(-16px);
    transition:
      opacity    ${FADE_MS}ms cubic-bezier(0.55, 0, 1, 0.45),
      transform  ${FADE_MS}ms cubic-bezier(0.55, 0, 1, 0.45);
  }

  /* ── inner elements ── */

  .hud-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    color: var(--green2);
    text-transform: uppercase;
    margin: 0 0 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .hud-eyebrow::before {
    content: '';
    display: inline-block;
    width: 16px; height: 1px;
    background: var(--green2);
    flex-shrink: 0;
  }

  .hud-title {
    font-family: 'Space Mono', monospace;
    font-size: clamp(17px, 2.2vw, 22px);
    font-weight: 700;
    color: var(--green);
    margin: 0 0 14px;
    line-height: 1.2;
  }

  .hud-body {
    color: rgba(255, 255, 255, 0.80);
    font-weight: 300;
    margin: 0 0 16px;
  }
  .hud-body:last-child { margin-bottom: 0; }

  .hud-image {
    width: 100%;
    border-radius: 6px;
    margin-bottom: 16px;
    border: 1px solid rgba(0,255,170,0.15);
    display: block;
    object-fit: cover;
    max-height: 180px;
  }

  .hud-links {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .hud-links a {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    background: rgba(0,255,170,0.06);
    border: 1px solid rgba(0,255,170,0.25);
    border-radius: 100px;
    color: var(--green);
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.04em;
    text-decoration: none;
    transition: background 0.18s, border-color 0.18s, color 0.18s;
  }
  .hud-links a:hover {
    background: rgba(0,255,170,0.18);
    border-color: var(--green);
    color: #fff;
  }
  .hud-links a::before {
    content: '↗';
    font-size: 10px;
    opacity: 0.65;
  }

//   /* timer bar — shrinks left to right */
//   .hud-progress {
//     position: absolute;
//     bottom: 0; left: 0;
//     height: 2px;
//     width: 100%;
//     background: var(--green);
//     border-radius: 0 0 0 4px;
//     transform-origin: left center;
//   }

  /* scanlines overlay */
  .hud-scanlines {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(0,0,0,0.07) 3px,
      rgba(0,0,0,0.07) 4px
    );
    z-index: 1;
  }

  /* content sits above scanlines */
  .hud-inner { position: relative; z-index: 2; }

  /* ── mobile: anchor to bottom ── */
  @media (max-width: 600px) {
    #hud-panel {
      top: auto;
      bottom: 16px;
      left: 50%;
      width: calc(100vw - 32px);
      transform: translateX(-50%) translateY(12px);
    }
    #hud-panel.visible {
      transform: translateX(-50%) translateY(0);
    }
    #hud-panel.hiding {
      transform: translateX(-50%) translateY(12px);
    }
  }
`;
document.head.appendChild(style);

// ─── DOM ──────────────────────────────────────────────────────────────────────

const panel = document.createElement('div');
panel.id = 'hud-panel';
document.body.appendChild(panel);

export let scrollLockEnabled = true;
export function setScrollLock(enabled) {
  scrollLockEnabled = enabled;
}

// ─── Render helpers ───────────────────────────────────────────────────────────

function renderPanel(index) {
  const c     = content[index % content.length];
  const total = content.length;
  const step  = (index % content.length) + 1;
  if (!c) return;

  const eyebrow = `Section ${String(step).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  const title   = c.title ? `<h2 class="hud-title">${c.title}</h2>` : '';
  const image   = c.image ? `<img class="hud-image" src="${c.image}" alt="${c.title || ''}" />` : '';
  const body    = c.body  ? `<p  class="hud-body">${c.body}</p>` : '';
  const links   = c.links
    ? `<ul class="hud-links">${
        c.links.map(l => `<li><a href="${l.url}" target="_blank" rel="noopener">${l.label}</a></li>`).join('')
      }</ul>`
    : '';

  panel.innerHTML = `
    <div class="hud-scanlines"></div>
    <div class="hud-inner">
      <p class="hud-eyebrow">${eyebrow}</p>
      ${title}
      ${image}
      ${body}
      ${links}
    </div>
    <div class="hud-progress"></div>
  `;
}

function showPanel(index) {
  renderPanel(index);

//   // restart the timer bar animation
//   const bar = panel.querySelector('.hud-progress');
//   if (bar) {
//     bar.style.transition = 'none';
//     bar.style.transform  = 'scaleX(1)';
//     requestAnimationFrame(() => requestAnimationFrame(() => {
//       bar.style.transition = `transform ${PANEL_DISPLAY_MS}ms linear`;
//       bar.style.transform  = 'scaleX(0)';
//     }));
//   }

  panel.classList.remove('hiding');
  panel.classList.add('visible');

//   clearTimeout(dismissTimer);
//   dismissTimer = setTimeout(hidePanel, PANEL_DISPLAY_MS);

}

function hidePanel() {
  clearTimeout(dismissTimer);
  panel.classList.remove('visible');
  panel.classList.add('hiding');
}

// Hide any panel by tapping it
panel.addEventListener('click', hidePanel);



// ─── Scroll-lock core ─────────────────────────────────────────────────────────

export function initScrollLock(camera, scene) {
  const proxy = {
    angle: sections[0].angle,
    y:     sections[0].y,
  };

  setTimeout(() => showPanel(0), 700);  // prevent overscrolling

  camera.position.set(
    Math.sin(proxy.angle) * ORBIT_RADIUS,
    proxy.y,
    Math.cos(proxy.angle) * ORBIT_RADIUS
  );
  camera.lookAt(0, proxy.y, 0);

  // show the first panel after the page loads
  setTimeout(() => showPanel(0), 700);

  function goTo(i) {
    if (!scrollLockEnabled) return;
    if (locked || i < 0 || i >= sections.length) return;
    locked  = true;
    current = i;

    // hide the panel immediately when the user scrolls
    hidePanel();

    gsap.to(proxy, {
      angle:    sections[i].angle,
      y:        sections[i].y,
      duration: 1.0,
      ease:     'expo.inOut',
      onUpdate: () => {
        camera.position.set(
          Math.sin(proxy.angle) * ORBIT_RADIUS,
          proxy.y,
          Math.cos(proxy.angle) * ORBIT_RADIUS
        );
        camera.lookAt(0, proxy.y, 0);
      },
      onComplete: () => {
        locked = false;
        // reveal new content once the camera has landed
        showPanel(i);
      },
    });
  }

  // ── Input listeners ─────────────────────────────────────────────────────────

  window.addEventListener('wheel', e => {
    e.preventDefault();
    goTo(e.deltaY > 0 ? current + 1 : current - 1);
  }, { passive: false });

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') goTo(current + 1);
    if (e.key === 'ArrowUp')   goTo(current - 1);
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