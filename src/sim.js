import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";

export class KerrSimulation {
  constructor(canvas) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x03040a, 0.0014);

    this.camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 2200);
    this.camera.position.set(0, 5.5, 15);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.maxDistance = 38;
    this.controls.minDistance = 4.5;

    this.clock = new THREE.Clock();
    this.timeScale = 1.2;
    this.paused = false;
    this.phase = 0;

    this._buildScene();
    window.addEventListener("resize", () => this.onResize());
  }

  _buildScene() {
    this.scene.add(new THREE.AmbientLight(0x9cb4db, 0.35));
    const key = new THREE.PointLight(0x8bc2ff, 3.2, 180);
    key.position.set(8, 7, 10);
    this.scene.add(key);

    const rim = new THREE.PointLight(0xffb068, 1.8, 120);
    rim.position.set(-10, -2, -8);
    this.scene.add(rim);

    this.blackhole = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 80, 80),
      new THREE.MeshStandardMaterial({ color: 0x010101, roughness: 0.85, metalness: 0.0 })
    );
    this.scene.add(this.blackhole);

    this.photonRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.9, 0.08, 32, 140),
      new THREE.MeshBasicMaterial({ color: 0xffd18f, transparent: true, opacity: 0.8 })
    );
    this.photonRing.rotation.x = Math.PI / 2;
    this.scene.add(this.photonRing);

    this.disk = new THREE.Mesh(
      new THREE.TorusGeometry(4.4, 1.1, 64, 240),
      new THREE.MeshStandardMaterial({ color: 0xff8d4e, emissive: 0x2b1004, emissiveIntensity: 1.8, roughness: 0.65 })
    );
    this.disk.rotation.x = Math.PI / 2;
    this.scene.add(this.disk);

    this.diskInner = new THREE.Mesh(
      new THREE.TorusGeometry(3.1, 0.5, 64, 220),
      new THREE.MeshStandardMaterial({ color: 0xffc196, emissive: 0x5f2108, emissiveIntensity: 2.1, roughness: 0.45 })
    );
    this.diskInner.rotation.x = Math.PI / 2;
    this.scene.add(this.diskInner);

    this.ergosphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.25, 44, 44),
      new THREE.MeshBasicMaterial({ color: 0x57aeff, transparent: true, opacity: 0.12, wireframe: true })
    );
    this.scene.add(this.ergosphere);

    const starGeom = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < 3500; i += 1) {
      const r = 110 + Math.random() * 500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions.push(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
    }
    starGeom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    this.stars = new THREE.Points(starGeom, new THREE.PointsMaterial({ color: 0xb8d8ff, size: 0.85, sizeAttenuation: true }));
    this.scene.add(this.stars);
  }

  setTimeScale(v) { this.timeScale = v; }
  togglePaused() { this.paused = !this.paused; return this.paused; }

  applyPhysics({ spin, accretion, horizonRg, iscoRg }) {
    const color = new THREE.Color().setHSL(0.085 - Math.min(0.05, spin * 0.045), 0.85, 0.54 + Math.min(0.18, accretion * 0.12));
    this.disk.material.color.copy(color);
    this.disk.material.emissive.copy(color).multiplyScalar(0.45);
    this.diskInner.material.color.copy(color).offsetHSL(0.0, -0.15, 0.16);
    this.diskInner.material.emissive.copy(color).multiplyScalar(0.6);

    this.disk.scale.setScalar(Math.max(0.72, iscoRg / 4.8));
    this.diskInner.scale.setScalar(Math.max(0.7, iscoRg / 5.1));
    this.ergosphere.scale.setScalar(Math.max(0.62, horizonRg / 2.1));
    this.photonRing.scale.setScalar(Math.max(0.8, horizonRg / 1.95));
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
        this.disk.rotation.z = this.phase * 0.82;
        this.diskInner.rotation.z = -this.phase * 1.08;
        this.disk.rotation.y = Math.sin(this.phase * 0.18) * 0.1;
        this.photonRing.material.opacity = 0.55 + Math.sin(this.phase * 1.7) * 0.2;
        this.stars.rotation.y += dt * 0.008;
      }
      this.renderer.render(this.scene, this.camera);
    };
    tick();
  }
}
