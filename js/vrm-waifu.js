(function(){

if(window.__vrm_loaded) return
window.__vrm_loaded = true

const canvas = document.getElementById("vrm-waifu")
if(!canvas) return

const renderer = new THREE.WebGLRenderer({
canvas:canvas,
alpha:true,
antialias:true
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(canvas.width,canvas.height)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
30,
canvas.width/canvas.height,
0.1,
20
)

camera.position.set(0,1.4,2)

const light = new THREE.DirectionalLight(0xffffff,1)
light.position.set(1,1,1)
scene.add(light)

const loader = new THREE.GLTFLoader()

let vrm = null
let clock = new THREE.Clock()

loader.load("/model/prdx.vrm",

function(gltf){

if(!gltf.userData || !gltf.userData.gltfExtensions){
console.warn("Not a VRM file")
return
}

THREE.VRM.from(gltf).then(function(v){

vrm = v

scene.add(vrm.scene)

vrm.scene.rotation.y = Math.PI
vrm.scene.scale.set(1.2,1.2,1.2)

animate()

})

},

undefined,

function(e){

console.error("VRM load error",e)

})

let mouseX = 0
let mouseY = 0

window.addEventListener("mousemove",function(e){

mouseX = e.clientX
mouseY = e.clientY

})

let blinkTimer = 0
let breathTimer = 0

function animate(){

requestAnimationFrame(animate)

if(!vrm) return

const delta = clock.getDelta()

vrm.update(delta)

const head = vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.Head)

if(head){

const x = (mouseX/window.innerWidth)-0.5
const y = (mouseY/window.innerHeight)-0.5

head.rotation.y = -x*0.5
head.rotation.x = -y*0.3

}

breathTimer += delta
vrm.scene.position.y = Math.sin(breathTimer*2)*0.02

blinkTimer += delta

if(blinkTimer>3){

if(vrm.blendShapeProxy){

vrm.blendShapeProxy.setValue(
THREE.VRMSchema.BlendShapePresetName.Blink,
1
)

setTimeout(function(){

vrm.blendShapeProxy.setValue(
THREE.VRMSchema.BlendShapePresetName.Blink,
0
)

},120)

}

blinkTimer = 0

}

renderer.render(scene,camera)

}

})();