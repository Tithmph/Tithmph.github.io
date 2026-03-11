
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<style>

html,body{
margin:0;
padding:0;
overflow:hidden;
background:transparent !important;
}

canvas{
display:block;
background:transparent !important;
}

</style>

</head>

<body>

<script type="importmap">
{
"imports": {
"three": "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js",
"three/addons/": "https://cdn.jsdelivr.net/npm/three@0.176.0/examples/jsm/",
"@pixiv/three-vrm": "https://cdn.jsdelivr.net/npm/@pixiv/three-vrm@3/lib/three-vrm.module.min.js"
}
}
</script>

<script type="module">

import * as THREE from "three"
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js"
import {VRMLoaderPlugin, VRMUtils} from "@pixiv/three-vrm"

const renderer = new THREE.WebGLRenderer({
alpha:true,
antialias:true
})

renderer.setClearColor(0x000000,0)
renderer.setSize(window.innerWidth,window.innerHeight)

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
30,
window.innerWidth/window.innerHeight,
0.1,
20
)

camera.position.set(0,1.3,2.8)

scene.add(new THREE.DirectionalLight(0xffffff,2))
scene.add(new THREE.AmbientLight(0xffffff,0.9))

let currentVrm

const loader = new GLTFLoader()

loader.register(parser=>{
return new VRMLoaderPlugin(parser)
})

loader.load(

"./VRM/prdx.vrm",

(gltf)=>{

const vrm = gltf.userData.vrm

VRMUtils.removeUnnecessaryVertices(gltf.scene)
VRMUtils.combineSkeletons(gltf.scene)

vrm.scene.traverse(obj=>{
obj.frustumCulled=false
})

scene.add(vrm.scene)

vrm.scene.rotation.y = 0

currentVrm = vrm

/* 关键：重置为自然站姿 */
currentVrm.humanoid.resetNormalizedPose()

}

)

/* ---------- 动画系统 ---------- */

const clock = new THREE.Clock()

let blinkTimer = 0
let idleTime = 0
let breathTime = 0

let mouseX = 0
let mouseY = 0

function animate(){

requestAnimationFrame(animate)

const delta = clock.getDelta()

if(currentVrm){

currentVrm.update(delta)

breathing()

autoBlink(delta)

idleMotion(delta)

lookAtMouse()

}

renderer.render(scene,camera)

}

animate()

/* ---------- 呼吸 ---------- */

function breathing(){

breathTime += 0.03

const chest = currentVrm.humanoid.getNormalizedBoneNode("chest")

if(chest){

chest.position.y = Math.sin(breathTime)*0.01

}

}

/* ---------- 自动眨眼 ---------- */

function autoBlink(delta){

blinkTimer += delta

if(blinkTimer > 3){

currentVrm.expressionManager.setValue("blink",1)

setTimeout(()=>{

currentVrm.expressionManager.setValue("blink",0)

},120)

blinkTimer = 0

}

}

/* ---------- 监听父窗口鼠标（修复iframe问题） ---------- */

window.addEventListener("message",(event)=>{

if(event.data.type==="mouseMove"){

mouseX = event.data.x
mouseY = event.data.y

}

})

/* ---------- 头部+眼睛追踪 ---------- */

function lookAtMouse(){

if(!currentVrm) return

const neck = currentVrm.humanoid.getNormalizedBoneNode("neck")

if(neck){

neck.rotation.y += (mouseX*0.6 - neck.rotation.y)*0.1
neck.rotation.x += (-mouseY*0.4 - neck.rotation.x)*0.1

}

const look = currentVrm.lookAt

if(look){

look.applier.lookAt(
new THREE.Vector3(mouseX,1.3-mouseY,1)
)

}

}

/* ---------- idle ---------- */

function idleMotion(delta){

idleTime += delta

const hips = currentVrm.humanoid.getNormalizedBoneNode("hips")

if(hips){

hips.rotation.y = Math.sin(idleTime*0.4)*0.04

}

}

/* ---------- 点击互动 ---------- */

window.addEventListener("click",()=>{

if(!currentVrm) return

currentVrm.expressionManager.setValue("happy",1)

setTimeout(()=>{

currentVrm.expressionManager.setValue("happy",0)

},1000)

})

/* ---------- resize ---------- */

window.addEventListener("resize",()=>{

camera.aspect=window.innerWidth/window.innerHeight
camera.updateProjectionMatrix()

renderer.setSize(window.innerWidth,window.innerHeight)

})

</script>

</body>
</html>