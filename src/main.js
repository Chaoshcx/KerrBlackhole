import { summarizeKerrState } from "./astro.js";
import { KerrSimulation } from "./sim.js";

const inputs = {
  mass: document.getElementById("mass"),
  spin: document.getElementById("spin"),
  accretion: document.getElementById("accretion"),
  timeScale: document.getElementById("time-scale"),
};

const output = {
  mass: document.getElementById("mass-value"),
  spin: document.getElementById("spin-value"),
  accretion: document.getElementById("accretion-value"),
  timeScale: document.getElementById("time-scale-value"),
  status: document.getElementById("status"),
  learn: document.getElementById("learn"),
};

const simulation = new KerrSimulation(document.getElementById("scene"));
const toggleBtn = document.getElementById("toggle");

toggleBtn.addEventListener("click", () => {
  const paused = simulation.togglePaused();
  toggleBtn.textContent = paused ? "继续" : "暂停";
});

function renderUI() {
  const mass = Number(inputs.mass.value);
  const spin = Number(inputs.spin.value);
  const accretion = Number(inputs.accretion.value);
  const timeScale = Number(inputs.timeScale.value);

  output.mass.textContent = `${mass.toFixed(1)} M☉`;
  output.spin.textContent = spin.toFixed(3);
  output.accretion.textContent = `${accretion.toFixed(2)} Edd`;
  output.timeScale.textContent = `${timeScale.toFixed(2)}x`;

  const state = summarizeKerrState({ mass, spin, accretion });
  simulation.setTimeScale(timeScale);
  simulation.applyPhysics({ spin, accretion, horizonRg: state.horizonRg, iscoRg: state.iscoRg });

  output.status.innerHTML = `
    <ul>
      <li>史瓦西半径 R<sub>s</sub>: <strong>${state.rsKm.toFixed(1)} km</strong></li>
      <li>事件视界 r<sub>+</sub>: <strong>${state.horizonRg.toFixed(3)} r<sub>g</sub></strong></li>
      <li>顺行 ISCO: <strong>${state.iscoRg.toFixed(3)} r<sub>g</sub></strong></li>
      <li>辐射效率 η: <strong>${(state.efficiency * 100).toFixed(2)}%</strong></li>
      <li>光度 L: <strong>${state.luminosityW.toExponential(3)} W</strong></li>
    </ul>
  `;

  output.learn.innerHTML = `
    <h2>学习提示</h2>
    <p>黑洞自旋越高，ISCO 越靠近视界，盘内物质能量释放效率通常更高。</p>
    <p class="formula">r₊ = 1 + √(1-a*²), &nbsp; r<sub>ISCO</sub>=f(a*)</p>
    <p>当前 L/L<sub>Edd</sub> = ${(state.luminosityW / state.lEddW).toFixed(2)}，可用于理解吸积态的“亮/暗”变化。</p>
  `;
}

Object.values(inputs).forEach((el) => el.addEventListener("input", renderUI));
renderUI();
simulation.animate();
