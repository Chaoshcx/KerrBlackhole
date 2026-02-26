# KerrBlackhole（重构版）

这是一个可在本地运行的 Kerr 黑洞交互式科普项目，包含：

- 实时 3D 可视化（黑洞、吸积盘、星空背景）
- 核心参数交互：质量、自旋、吸积率、时间流速
- 实时状态计算：事件视界、ISCO、辐射效率、光度
- 学习提示区：给出关键公式与物理含义

## 本地安装指南

本项目为纯前端静态项目，无需 `npm install`。

### 1) 克隆仓库

```bash
git clone <your-repo-url>
cd KerrBlackhole
```

### 2) 准备本地静态服务（任选其一）

- 方式 A：Python（推荐，通常系统自带）

```bash
python3 -m http.server 8000
```

- 方式 B：Node.js（若已安装 Node）

```bash
npx serve . -l 8000
```

### 3) 打开浏览器访问

- <http://localhost:8000>

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

## 常见问题

- 页面空白 / 模块加载失败：请确认不是直接双击 `index.html` 打开，而是通过本地 HTTP 服务访问。
- 如果网络受限导致 CDN 资源加载失败（Three.js），可在联网环境下运行，或后续改为本地依赖托管。

## 备注

旧版单文件脚本保留在 `Initial.html`，便于对照。
