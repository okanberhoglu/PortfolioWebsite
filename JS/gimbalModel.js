import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("gimbalCanvas");
  if (!container) return;

  let W = container.clientWidth;
  let H = container.clientHeight;
  if (W === 0 || H === 0) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 1000);
  camera.position.set(27, 24, 40);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 1.8));

  const keyLight = new THREE.DirectionalLight(0xfff6e8, 3.2);
  keyLight.position.set(-40, 60, 30);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 1.4);
  fillLight.position.set(40, 20, -30);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffe8cc, 0.9);
  rimLight.position.set(0, -20, -50);
  scene.add(rimLight);

  const assembly = new THREE.Group();
  scene.add(assembly);

  let ready = false;
  const parts = {};
  let loadedCount = 0;
  const loader = new GLTFLoader();

  const partDefs = [
    { key: "one",   path: "../assets/3D_models/Gimbal/SolidPartOne.gltf" },
    { key: "two",   path: "../assets/3D_models/Gimbal/SolidPartTwo.gltf" },
    { key: "three", path: "../assets/3D_models/Gimbal/SolidPartThree.gltf" },
  ];

  partDefs.forEach(({ key, path }) => {
    loader.load(
      path,
      (gltf) => {
        parts[key] = gltf.scene;
        loadedCount++;
        if (loadedCount === partDefs.length) buildAssembly();
      },
      undefined,
      (err) => console.error(`Gimbal ${key} load error:`, err),
    );
  });

  function buildAssembly() {
    const p1 = parts.one;
    const p2 = parts.two;
    const p3 = parts.three;

    /* ── PartThree: child of PartTwo ── */
    p3.position.set(-0.06, 0, 0.083);
    p3.rotation.set(0, 0, 0);          /* roll offset in radians */

    /* ── PartTwo: child of PartOne ── */
    p2.position.set(0, 0.113, -0.08);
    p2.rotation.set(0, 0, 0);         /* pitch offset in radians */
    p2.add(p3);

    /* ── PartOne: root of assembly ── */
    p1.position.set(0, -0.02, 0);
    p1.rotation.set(0, 0, 0);
    p1.add(p2);

    assembly.add(p1);

    /* centre and normalise to ~22 world-units */
    const box = new THREE.Box3().setFromObject(assembly);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const scale = 22 / Math.max(size.x, size.y, size.z);
    assembly.scale.setScalar(scale);
    assembly.position.copy(center).multiplyScalar(-scale);

    ready = true;
  }

  /* ── MOUSE TRACKING ── */
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let isHovered = false;

  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    target.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    target.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    isHovered = true;
  });

  container.addEventListener("mouseleave", () => {
    target.x = 0;
    target.y = 0;
    isHovered = false;
  });

  /* ── RESIZE ── */
  window.addEventListener("resize", () => {
    W = container.clientWidth;
    H = container.clientHeight;
    if (W === 0 || H === 0) return;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  });

  /* ── SCROLL TRACKING ── */
  let scrollRot = 0;
  let scrollRotTarget = 0;

  function updateScrollTarget() {
    const rect = container.getBoundingClientRect();
    const vh = window.innerHeight;
    scrollRotTarget = ((rect.top + rect.height / 2) - vh / 2) / vh * 1.0;
  }

  window.addEventListener("scroll", updateScrollTarget, { passive: true });
  updateScrollTarget();

  const RANGE_Y = 0.45;
  const RANGE_X = 0.22;
  const LERP = 0.06;

  function animate() {
    requestAnimationFrame(animate);
    current.x += (target.x - current.x) * LERP;
    current.y += (target.y - current.y) * LERP;
    scrollRot += (scrollRotTarget - scrollRot) * LERP;

    if (ready) {
      assembly.rotation.y = scrollRot + current.x * RANGE_Y;
      assembly.rotation.x = -current.y * RANGE_X;
    }

    renderer.render(scene, camera);
  }
  animate();
});
