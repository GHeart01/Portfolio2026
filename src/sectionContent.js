/**
 * sectionContent.js
 *
 * Edit this file to change what appears in the HUD panel on each scroll step.
 * Entries map 1-to-1 with the sections array in scrollLock.js (index 0 = first stop).
 *
 * Fields (all optional except you need at least one to show anything):
 *   title  {string}              — large green heading
 *   body   {string}              — paragraph text, HTML tags allowed
 *   image  {string}              — path or URL to an image
 *   links  {Array<{label, url}>} — clickable link pills
 */

export const content = [
  {
    title: "Welcome, I'm Geralt",
    body:  'Scroll down to explore the galaxy and learn more about me.',
  },
  {
    title: 'About Me',
    body:  `I'm Geralt — a CS grad student at CU Boulder specializing in
            machine learning and AI. I build things at the intersection of
            math, code, and visual systems.`,
    links: [
      { label: 'GitHub',   url: 'https://github.com/GHeart01' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/geraltheart001' },
    ],
  },
  {
    title: 'Experience',
    body:  'RLHF Engineer at Handshake. Applied ML research with a focus on ' +
           'human feedback pipelines and reward modeling.',
  },
  {
    title: 'Skills',
    body:  'Python · SQL · C++ · JavaScript · MATLAB' +
           'Numpy· Pandas · Scikit-learn · Keras · PyTorch' +
           'React, pytest, Three.JS, GSAP' + 
           'AWS Lightsail, Docker, Kubernetes'
  },
  {
    title: 'Projects',
    body:  'This portfolio is built with Three.js — particle simulations, ' +
           '3D text, Fourier transform visualizations, and a galaxy renderer.',
    links: [
      { label: 'View source', url: 'https://github.com/GHeart01' },
    ],
  },
  {
    title: 'Education',
    body:  'MS Computer Science — CU Boulder (GPA 3.9)<br>' +
           'Specialization: Machine Learning & AI',
  },
  {
    title: 'Research',
    body:  'Interested in reinforcement learning from human feedback, ' +
           'generative models, and the mathematics of neural networks.',
  },
  {
    title: 'Currently',
    body:  'Open to ML/AI Engineer and Data Science roles.<br>' +
           'Based in Austin, TX.',
    links: [
      { label: 'Email me', url: 'mailto:emailme@geraltheart.com' },
    ],
  },
  {
    title: 'The Galaxy',
    body:  'A barred spiral galaxy — 20,000 particles, exponential disk ' +
           'distribution, differential rotation, and stellar color grading ' +
           'from blue-white core to red-dwarf rim.',
  },
  {
    title: 'Contact',
    body:  "Thanks for visiting. Let's build something together.",
    links: [
      { label: 'emailme@geraltheart.com, url: 'mailto:emailme@geraltheart.com' },
      { label: 'GitHub',                  url: 'https://github.com/GHeart01' },
      { label: 'LinkedIn',                url: 'https://www.linkedin.com/in/geraltheart001' },
    ],
  },
];