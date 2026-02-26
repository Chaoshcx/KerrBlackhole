import { summarizeKerrState } from "./astro.js";
import { KerrSimulation } from "./sim.js";

const hotspotData = [
  {
    id: "horizon",
    label: "事件视界",
    x: 18,
    y: 30,
    explanation: "事件视界是‘只能进不能出’的边界，连光也无法逃逸。",
    inspectorTitle: "事件视界与自旋",
    inspectorDesc: "调高自旋 a*，会让事件视界与附近结构发生变化。",
  },
  {
    id: "isco",
    label: "ISCO",
    x: 69,
    y: 38,
    explanation: "ISCO 是稳定圆轨道的最内边界，越靠近黑洞，释放能量通常越高。",
    inspectorTitle: "ISCO 与吸积盘内缘",
    inspectorDesc: "改变自旋和吸积率，观察盘内缘与亮度变化。",
  },
  {
    id: "luminosity",
    label: "Eddington 光度",
    x: 58,
    y: 72,
    explanation: "Eddington 光度是辐射压与引力平衡尺度，用于描述吸积盘亮度状态。",
    inspectorTitle: "光度与吸积态",
    inspectorDesc: "通过吸积率查看 L/Ledd 的变化，理解亮态与暗态。",
  },
];

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
};

const tooltip = document.getElementById("tooltip");
const hotspots = document.getElementById("hotspots");
const inspector = document.getElementById("inspector");
const inspectorTitle = document.getElementById("inspector-title");
const inspectorDesc = document.getElementById("inspector-desc");
const closeBtn = document.getElementById("close-inspector");
const toggleBtn = document.getElementById("toggle");

const simulation = new KerrSimulation(document.getElementById("scene"));

function setInspector(topic) {
  inspectorTitle.textContent = topic.inspectorTitle;
  inspectorDesc.textContent = topic.inspectorDesc;
  inspector.classList.add("open");
  inspector.setAttribute("aria-hidden", "false");
}

function hideTooltip() {
  tooltip.classList.remove("show");
  tooltip.setAttribute("aria-hidden", "true");
}

function buildHotspots() {
  hotspotData.forEach((item) => {
    const node = document.createElement("button");
    node.className = "hotspot";
    node.type = "button";
    node.textContent = item.label;
    node.style.left = `${item.x}%`;
    node.style.top = `${item.y}%`;

    node.addEventListener("mousemove", (event) => {
      tooltip.innerHTML = `<b>${item.label}</b><br>${item.explanation}<br><small>点击可进入交互模式</small>`;
      tooltip.style.left = `${event.clientX}px`;
      tooltip.style.top = `${event.clientY}px`;
      tooltip.classList.add("show");
      tooltip.setAttribute("aria-hidden", "false");
    });

    node.addEventListener("mouseleave", hideTooltip);
    node.addEventListener("click", () => setInspector(item));
    hotspots.appendChild(node);
  });
}

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
      <li>史瓦西半径: <strong>${state.rsKm.toFixed(1)} km</strong></li>
      <li>事件视界 r<sub>+</sub>: <strong>${state.horizonRg.toFixed(3)} r<sub>g</sub></strong></li>
      <li>顺行 ISCO: <strong>${state.iscoRg.toFixed(3)} r<sub>g</sub></strong></li>
      <li>辐射效率 η: <strong>${(state.efficiency * 100).toFixed(2)}%</strong></li>
      <li>L/L<sub>Edd</sub>: <strong>${(state.luminosityW / state.lEddW).toFixed(2)}</strong></li>
    </ul>
  `;
}

closeBtn.addEventListener("click", () => {
  inspector.classList.remove("open");
  inspector.setAttribute("aria-hidden", "true");
});

toggleBtn.addEventListener("click", () => {
  const paused = simulation.togglePaused();
  toggleBtn.textContent = paused ? "继续" : "暂停";
});

Object.values(inputs).forEach((el) => el.addEventListener("input", renderUI));
buildHotspots();
renderUI();
simulation.animate();
