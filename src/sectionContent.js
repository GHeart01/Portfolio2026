/**
 * sectionContent.js
 *
 * {
 *   title  {string}             
 *   body   {string}              
 *   image  {string}             
 *   links  {Array<{label, url}>} 
 * },
 */

export const content = [
  {
    title: "Welcome, I'm Geralt",
    body:  'Scroll down to explore the galaxy and learn more about me.',
    body: 'Scroll down to contine <br> Click here to hide',


  },
  {
    title: 'About Me',
    body:  `I'm Geralt — CS grad student at CU Boulder specializing in
            machine learning and AI. I build things at the intersection of
            math, code, and visual systems.`,
    links: [
      { label: 'GitHub',   url: 'https://github.com/GHeart01' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/geraltheart001' },
    ],
  },
  {
    title: 'Experience',
    body:  'Software Engineer Intern - Athena Manufacturing - May 2026' + 
           '<br>' +
           'Devops, Database Management, Web Development' +
           'Building webapps for montioring tool performance and worker execution\n' +
           '<br>' +

           'AI Trainer - Handshake - Feb 2026' + 
           '<br>' +
           'Applied ML research with a focus on ' +
           'human feedback pipelines and reward modeling.\n' +
           '<br>' +
           'Teaching 2018 - 2026'
  },
  {
    title: 'Skills',
    body: '',
    body:  'Python · SQL · C++ · JavaScript · MATLAB' +
           '<br>' +
           'Numpy · Pandas · pytest · Scikit-learn · Keras · TensorFlow' +
           '<br>' +
           'React · Three.JS · GSAP' +
           '<br>' + 
           'AWS Lightsail · Docker · Kubernetes'
  },
  {
    title: 'Projects',
    body:  'Web Scraper - ' +
          '<br>' +
           'Python JSON SQL BeautifulSoup' +
           '<br>' +

           'MIMO - Fourier Series Radar System Study' +
            '<br>' +
           ' MATLAB' +
           '<br>' +
    
           'This Portfolio - '  + 
            '<br>' +
            'ThreeJS, Vite, React, and GSAP',
    links: [
      { label: 'Web Scraper', url: 'https://github.com/GHeart01/Web-Scraper-Clothing' },
      { label: 'MIMO', url: 'https://github.com/GHeart01/Multi-Input-Multi-Output-Radar-System-Study' },
      { label: 'View source', url: 'https://github.com/GHeart01/Portfolio2026' },

    ],
  },
  {
    title: 'Education',
    body:  '&nbsp&nbsp&nbsp&nbspMS Computer Science — CU Boulder | GPA 3.9<br>' +
           'Specialization: Machine Learning & AI, ' + 
           'Data mining, Network Systems<br>'+
           '&nbsp&nbsp&nbsp&nbspBS Applied Mathematics — UT Rio Grande Valley | GPA 3.5<br>' +
           'Specialization: Fourier Series, Number Theory, Statistics',
  },
  {
    title: 'Research',
    body:  'Interested in reinforcement learning from human feedback, ' +
           'generative models, and the mathematics of neural networks.',
  },
  // {
  //   title: 'Currently',
  //   body:  'AI Trainer for Handshake' + 
  //          '<br>' +
  //          'Open to ML/AI Engineer and Data Science roles.<br>' +
  //          'Based in Austin, TX.',
  //   links: [
  //     { label: 'Email me', url: 'mailto:emailme@geraltheart.com' },
  //   ],
  // },
  {
    title: 'The Galaxy',
    body:  'A barred spiral galaxy — 20,000 particles, exponential disk ' +
           'distribution, differential rotation, and stellar color grading. <br> ' +
           'Utilized buffer geometry to reduce vertices',
  },
  {
    title: 'Contact',
    body:  "Thanks for visiting. Let's build something together." + 
           '<br>' +
           'Check out the console in the developer tools for an easter egg!🥚',
    links: [
      { label: 'emailme@geraltheart.com', url: 'mailto: emailme@geraltheart.com' },
      { label: 'GitHub',                  url: 'https://github.com/GHeart01' },
      { label: 'LinkedIn',                url: 'https://www.linkedin.com/in/geraltheart001' },
    ],
  },
];