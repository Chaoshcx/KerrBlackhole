import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";

export class KerrSimulation {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.set(0, 6, 18);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.maxDistance = 55;
    this.controls.minDistance = 6;

    this.clock = new THREE.Clock();
    this.timeScale = 1.2;
    this.paused = false;
    this.phase = 0;

    this._buildScene();
    window.addEventListener("resize", () => this.onResize());
  }

  _buildScene() {
    this.scene.add(new THREE.AmbientLight(0x7c93c4, 0.2));
    const key = new THREE.PointLight(0x86b6ff, 2.4, 220);
    key.position.set(10, 12, 10);
    this.scene.add(key);

    const blackhole = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 64, 64),
      new THREE.MeshPhysicalMaterial({ color: 0x000000, metalness: 0.2, roughness: 0.6 })
    );
    this.scene.add(blackhole);

    this.disk = new THREE.Mesh(
      new THREE.TorusGeometry(4.8, 1.55, 80, 220),
      new THREE.MeshStandardMaterial({ color: 0xff8844, emissive: 0x3f1808, emissiveIntensity: 1.2, roughness: 0.7 })
    );
    this.disk.rotation.x = Math.PI / 2;
    this.scene.add(this.disk);

    this.ergosphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.35, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x4ba3ff, transparent: true, opacity: 0.14, wireframe: true })
    );
    this.scene.add(this.ergosphere);

    const starGeom = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < 2800; i += 1) {
      const r = 180 + Math.random() * 420;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions.push(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
    }
    starGeom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const stars = new THREE.Points(starGeom, new THREE.PointsMaterial({ color: 0xa8d0ff, size: 1.2, sizeAttenuation: true }));
    this.scene.add(stars);
  }

  setTimeScale(v) { this.timeScale = v; }
  togglePaused() { this.paused = !this.paused; return this.paused; }

  applyPhysics({ spin, accretion, horizonRg, iscoRg }) {
    const color = new THREE.Color().setHSL(0.08 - Math.min(0.06, (spin - 0.2) * 0.07), 0.8, 0.5 + Math.min(0.25, accretion * 0.15));
    this.disk.material.color.copy(color);
    this.disk.material.emissive.copy(color).multiplyScalar(0.35);
    this.disk.scale.setScalar(Math.max(0.55, iscoRg / 5));
    this.ergosphere.scale.setScalar(Math.max(0.65, horizonRg / 2));
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    const tick = () => {
      requestAnimationFrame(tick);
      this.controls.update();
      const dt = this.clock.getDelta();
      if (!this.paused) {
        this.phase += dt * this.timeScale;
        this.disk.rotation.z = this.phase * 0.7;
        this.disk.rotation.y = Math.sin(this.phase * 0.3) * 0.15;
      }
      this.renderer.render(this.scene, this.camera);
    };
    tick();
  }
}
