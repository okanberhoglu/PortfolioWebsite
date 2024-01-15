import * as THREE from "three";
import { OrbitControls } from "./three/examples/jsm/controls/OrbitControls.js";

const width = document.getElementById("contactCard").clientWidth;
const height = document.getElementById("contactCard").clientHeight; 

const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(35, height / width, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
renderer.setSize(width, height);
renderer.setClearColor( 0x000000, 0 );
document.getElementById("contactCard").appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(13, 10, 0.5);

const texture = new THREE.TextureLoader().load("../assets/card.jpg");

const material = [
    new THREE.MeshLambertMaterial( {color: 0x365486 }),
    new THREE.MeshLambertMaterial( {color: 0x596FB7 }),
    new THREE.MeshLambertMaterial( {color: 0x596FB7 }),
    new THREE.MeshLambertMaterial( {color: 0x365486 }),
    new THREE.MeshLambertMaterial( {color: 0x11235A }),
    new THREE.MeshBasicMaterial( {map: texture, transparent: true }),
]
const card = new THREE.Mesh(geometry, material);
card.rotateY(4)
scene.add(card)

const light = new THREE.AmbientLight({color: 'white'});
light.position.set(1, 1, 1);
scene.add(light);

camera.position.z = 0;
camera.position.y = 3;
camera.position.x = 27;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    card.rotateY(0.01);
    renderer.render(scene, camera);
  }
  animate();