# KerrBlackhole（重构版）

这是一个可在本地运行的 Kerr 黑洞交互式科普项目，包含：

- 实时 3D 可视化（黑洞、吸积盘、星空背景）
- 核心参数交互：质量、自旋、吸积率、时间流速
- 实时状态计算：事件视界、ISCO、辐射效率、光度
- 学习提示区：给出关键公式与物理含义

## 本地运行

```bash
python3 -m http.server 8000
```

打开 <http://localhost:8000>。

## 项目结构

- `index.html`：主界面
- `styles.css`：样式
- `src/astro.js`：天体物理计算函数
- `src/sim.js`：Three.js 可视化引擎
- `src/main.js`：交互与状态联动

## 备注

旧版单文件脚本保留在 `Initial.html`，便于对照。
