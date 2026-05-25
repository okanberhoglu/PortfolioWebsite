import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("macbookCanvas");
  if (!container) return;

  const modelPath = container.dataset.model;
  if (!modelPath) return;

  let W = container.clientWidth;
  let H = container.clientHeight;
  if (W === 0 || H === 0) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 1000);
  camera.position.set(-45, 12, 30);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 1.8));

  const keyLight = new THREE.DirectionalLight(0xfff6e8, 3.0);
  keyLight.position.set(-40, 60, 30);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
  fillLight.position.set(40, 20, -30);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffe8cc, 0.8);
  rimLight.position.set(0, -20, -50);
  scene.add(rimLight);

  let macbook = null;

  new GLTFLoader().load(
    modelPath,
    (gltf) => {
      macbook = gltf.scene;

      const box = new THREE.Box3().setFromObject(macbook);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const scale = 22 / Math.max(size.x, size.y, size.z);

      macbook.scale.setScalar(scale);
      macbook.position.copy(center).multiplyScalar(-scale);

      scene.add(macbook);
    },
    undefined,
    (err) => console.error("MacBook model load error:", err),
  );

  /* ── MOUSE TRACKING (container only) ── */
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let isHovered = false;

  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    /* normalise to -1 … +1 within the canvas */
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

  /* ── RENDER LOOP ── */
  const RANGE_Y = 0.35;
  const RANGE_X = 0.18;
  const LERP    = 0.06;

  function animate() {
    requestAnimationFrame(animate);

    current.x += (target.x - current.x) * LERP;
    current.y += (target.y - current.y) * LERP;
    scrollRot += (scrollRotTarget - scrollRot) * LERP;

    if (macbook) {
      macbook.rotation.y = scrollRot + current.x * RANGE_Y;
      macbook.rotation.x = -current.y * RANGE_X;
    }

    renderer.render(scene, camera);
  }
  animate();
});
