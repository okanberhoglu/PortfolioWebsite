import * as THREE from "three";
import { OrbitControls } from "./three/examples/jsm/controls/OrbitControls.js";

const width = document.getElementById("aboutThree").parentElement.clientWidth/2;
const height = document.getElementById("aboutThree").parentElement.clientHeight;

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x0f1729 );

const camera = new THREE.PerspectiveCamera(45, height / width, 0.1, 2000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.getElementById("aboutThree").appendChild(renderer.domElement);

const geometry = new THREE.TorusGeometry(20,4,16,100,10);
const material = new THREE.MeshPhongMaterial();
const model = new THREE.Mesh(geometry, material);
scene.add(model);

const light = new THREE.AmbientLight({color: "white"});
light.position.set(5, 20, 0);
scene.add(light);
camera.position.z = 50;
camera.position.y = 0;
camera.position.x = 50;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;


function animate() {
  requestAnimationFrame(animate);
  controls.update();
  model.rotateX(0.02);
  model.rotateY(-0.02);
  model.rotateZ(0.02);
  renderer.render(scene, camera);
}
animate();
