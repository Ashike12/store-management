import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type ClickAnchor = {
  x: number;
  y: number;
  life: number;
};

const MAX_DPR = 2;

const toCanvasColor = (color: string, fallback: string) => {
  if (!color) return fallback;
  return color;
};

type SpiderPalette = {
  lineColor: string;
  nodeColor: string;
  highlightColor: string;
  minLineAlpha: number;
  lineAlphaScale: number;
  anchorLineAlphaScale: number;
  nodeAlpha: number;
  nodeRadius: number;
  lineWidth: number;
};

export default function SpiderNetBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colorScheme = document.documentElement.getAttribute("data-mui-color-scheme");
    const isDark = colorScheme === "dark";
    const isPro = colorScheme === "pro";

    const palette: SpiderPalette = isDark
      ? {
          lineColor: "#38BDF8",
          nodeColor: "#BAE6FD",
          highlightColor: "#22D3EE",
          minLineAlpha: 0.2,
          lineAlphaScale: 0.55,
          anchorLineAlphaScale: 0.42,
          nodeAlpha: 1,
          nodeRadius: 2.1,
          lineWidth: 1.15,
        }
      : isPro
        ? {
            lineColor: "#1F3B57",
            nodeColor: "#334E68",
            highlightColor: "#D4AF37",
            minLineAlpha: 0.12,
            lineAlphaScale: 0.38,
            anchorLineAlphaScale: 0.3,
            nodeAlpha: 0.92,
            nodeRadius: 2,
            lineWidth: 1.05,
          }
        : {
            lineColor: toCanvasColor(theme.vars?.palette.divider ?? theme.palette.divider, "rgba(148,163,184,0.45)"),
            nodeColor: toCanvasColor(theme.vars?.palette.text.secondary ?? theme.palette.text.secondary, "rgba(148,163,184,0.85)"),
            highlightColor: toCanvasColor(theme.vars?.palette.primary.main ?? theme.palette.primary.main, "rgba(37,99,235,0.9)"),
            minLineAlpha: 0.08,
            lineAlphaScale: 0.32,
            anchorLineAlphaScale: 0.25,
            nodeAlpha: 0.95,
            nodeRadius: 1.9,
            lineWidth: 1,
          };

    let width = 0;
    let height = 0;
    let rafId = 0;
    let nodes: Node[] = [];
    let anchors: ClickAnchor[] = [];

    const getNodeCount = (w: number, h: number) => {
      const area = w * h;
      return Math.max(40, Math.min(115, Math.floor(area / 17000)));
    };

    const randomSpeed = () => (Math.random() - 0.5) * 0.55;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const nextCount = getNodeCount(width, height);
      nodes = Array.from({ length: nextCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: randomSpeed(),
        vy: randomSpeed(),
      }));
    };

    const updateNodes = () => {
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) {
          node.vx *= -1;
          node.x = Math.max(0, Math.min(width, node.x));
        }
        if (node.y < 0 || node.y > height) {
          node.vy *= -1;
          node.y = Math.max(0, Math.min(height, node.y));
        }
      });
    };

    const applyAnchorForces = () => {
      anchors = anchors
        .map((anchor) => ({ ...anchor, life: anchor.life - 1 }))
        .filter((anchor) => anchor.life > 0);

      anchors.forEach((anchor) => {
        const radius = 210;
        nodes.forEach((node) => {
          const dx = anchor.x - node.x;
          const dy = anchor.y - node.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist > radius) return;

          const force = ((radius - dist) / radius) * 0.03;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
          node.vx *= 0.985;
          node.vy *= 0.985;
        });
      });
    };

    const drawSpiderNet = () => {
      ctx.clearRect(0, 0, width, height);

      const connectDistance = 160;
      ctx.lineWidth = palette.lineWidth;
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist > connectDistance) continue;
          const alpha = 1 - dist / connectDistance;
          ctx.globalAlpha = Math.max(palette.minLineAlpha, alpha * palette.lineAlphaScale);
          ctx.strokeStyle = palette.lineColor;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      anchors.forEach((anchor) => {
        const nearest = [...nodes]
          .sort((a, b) => {
            const da = (a.x - anchor.x) ** 2 + (a.y - anchor.y) ** 2;
            const db = (b.x - anchor.x) ** 2 + (b.y - anchor.y) ** 2;
            return da - db;
          })
          .slice(0, 6);

        const alpha = Math.min(1, anchor.life / 130);
        nearest.forEach((node) => {
          ctx.globalAlpha = palette.anchorLineAlphaScale * alpha;
          ctx.strokeStyle = palette.highlightColor;
          ctx.beginPath();
          ctx.moveTo(anchor.x, anchor.y);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();
        });

        ctx.globalAlpha = 0.75 * alpha;
        ctx.fillStyle = palette.highlightColor;
        ctx.beginPath();
        ctx.arc(anchor.x, anchor.y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = palette.nodeAlpha;
      ctx.fillStyle = palette.nodeColor;
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, palette.nodeRadius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      updateNodes();
      applyAnchorForces();
      drawSpiderNet();
      rafId = window.requestAnimationFrame(loop);
    };

    const onClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      anchors.push({ x, y, life: 140 });
      if (anchors.length > 5) {
        anchors.shift();
      }
    };

    resize();
    loop();
    canvas.addEventListener("click", onClick);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(rafId);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      sx={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        cursor: "crosshair",
      }}
    />
  );
}
