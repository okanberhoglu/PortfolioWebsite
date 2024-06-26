import * as THREE from "three";
import { OrbitControls } from "./three/examples/jsm/controls/OrbitControls.js";

const width = document.getElementById("aboutThree").parentElement.clientWidth/2;
const height = document.getElementById("aboutThree").parentElement.clientHeight;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, height / width, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({alpha: true });
renderer.setSize(width, height);
renderer.setClearColor( 0x000000, 0 );
document.getElementById("aboutThree").appendChild(renderer.domElement);

const geometry = new THREE.TorusGeometry(20,4,16,100,10);
const material = new THREE.MeshPhysicalMaterial();
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
controls.autoRotate = true;
controls.autoRotateSpeed = 15;
controls.enableRotate = false;


function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
