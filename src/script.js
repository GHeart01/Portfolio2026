import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'

//easter egg
const brand = `
██╗  ██╗███████╗ █████╗ ██████╗ ████████╗
██║  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝
███████║█████╗  ███████║██████╔╝   ██║   
██╔══██║██╔══╝  ██╔══██║██╔══██╗   ██║   
██║  ██║███████╗██║  ██║██║  ██║   ██║   
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
`;

console.log(
  `%c${brand}`,
  `color: #00ffcc;
   font-weight: bold;
   font-family: monospace;
   line-height: 1.2;
  `
);

const socials = `
╔═ Socials ═══════════════╗
║ Mail           
⇒ geraltheart01@gmail.com
║ GitHub         ⇒ https://github.com/GHeart01
║ LinkedIn       ⇒ https://www.linkedin.com/in/geraltheart001
╚═══════════════════════╝
`;
console.log(
    `%c${socials}`,
    `color: #00ffcc;
    font-weight: bold;
    font-family: monospace;
    line-height: 1.2;
    `
)

console.log('Geralt Heart')

// Overlay text
const overlay = document.createElement('div')
overlay.style.cssText = `
    position: fixed;
    top: 16px;
    left: 16px;
    color: white;
    font-family: helvetica, arial, sans-serif;
    font-size: 20px;
    line-height: 1.5;
    pointer-events: none;
    z-index: 999;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
`
overlay.innerHTML = 'This is a website in progress, please be patient<br>FEB 28 2026'
document.body.appendChild(overlay)


/**
 * Base
 */
// Debug
const gui = new GUI({
    width: 340,
    title: 'Press "h" to hide me',
    closeFolders: false
}
)
// gui.close()
gui.hide()
window.addEventListener('keydown', () =>
{
    if(event.key == 'h')
        gui.show(gui._hidden)

})
const debugObject = {}


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace
// console.log(matcapTexture)

const heartmatcapTexture = textureLoader.load('/textures/matcaps/4.png')
heartmatcapTexture.colorSpace = THREE.SRGBColorSpace


/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        // console.log('font loaded')
        const textGeometry = new TextGeometry(
            'Geralt Heart',
            {
                font: font,// can also do: font
                size: 0.5,
                depth: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 3
            }
        )

        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     (textGeometry.boundingBox.max.x - 0.02) * -0.5,
        //     (textGeometry.boundingBox.max.y - 0.03) * -0.5,
        //     (textGeometry.boundingBox.max.z - 0.03) * -0.5

        // )
        // textGeometry.computeBoundingBox()
        // console.log(textGeometry.boundingBox)
        textGeometry.center()
        console.log(textGeometry.boundingBox)


        // const textMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
        const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture})

        // textMaterial.matcap = matcapTexture
        // textMaterial.wireframe = true
        const text = new THREE.Mesh(textGeometry, material) 
        scene.add(text)


        console.time('heart')
        // ❤️ Create shape
        const heartShape = new THREE.Shape()

        heartShape.moveTo(0, 0)
        heartShape.bezierCurveTo(0, 0, -1, -1, -2, 0)
        heartShape.bezierCurveTo(-3, 1.5, -1.5, 3.5, 0, 4)
        heartShape.bezierCurveTo(1.5, 3.5, 3, 1.5, 2, 0)
        heartShape.bezierCurveTo(1, -1, 0, 0, 0, 0)

        const extrudeSettings = {
            depth: 0.1,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 0.05,
            bevelThickness: 0.05
        }

        const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings)
        const heartMaterial = new THREE.MeshMatcapMaterial({
            matcap: heartmatcapTexture})
        heartGeometry.center()

        const heart = new THREE.Mesh(heartGeometry, heartMaterial)
        heart.position.y = -1.5
        heart.scale.set(.1,.1,.1)

        scene.add(heart)


        for(let i = 0; i < 100; i++)
        {
            
            const hearts = new THREE.Mesh(heartGeometry, heartMaterial)

            // Randomly Position all the torus around the scene
            hearts.position.x = (Math.random() - 0.5) * 10
            hearts.position.y = (Math.random() - 0.5) * 10
            hearts.position.z = (Math.random() - 0.5) * 10

            hearts.rotation.x = Math.random() * Math.PI
            hearts.rotation.y = Math.random() * Math.PI

            const scaler = Math.random() * .1
            // donut.scale.x = scaler
            // donut.scale.y = scaler
            // donut.scale.z = scaler
            hearts.scale.set(scaler,scaler,scaler)
            scene.add(hearts)
        }
        console.timeEnd('heart')




    //     console.time('donut')

    //     const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)



    //     // const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
    //     for(let i = 0; i < 100; i++)
    //     {
            
    //         const donut = new THREE.Mesh(donutGeometry, material)

    //         // Randomly Position all the torus around the scene
    //         donut.position.x = (Math.random() - 0.5) * 10
    //         donut.position.y = (Math.random() - 0.5) * 10
    //         donut.position.z = (Math.random() - 0.5) * 10

    //         donut.rotation.x = Math.random() * Math.PI
    //         donut.rotation.y = Math.random() * Math.PI

    //         const scaler = Math.random()
    //         // donut.scale.x = scaler
    //         // donut.scale.y = scaler
    //         // donut.scale.z = scaler
    //         donut.scale.set(scaler,scaler,scaler)
    //         scene.add(donut)
    //     }
    //     console.timeEnd('donut')
        
    }
)

/**
 * Axes Helper
 */

const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()