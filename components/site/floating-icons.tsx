/**
 * Floating tech icons — decorative layer scattered across the full
 * page height. Density tuned for visibility but kept subtle enough
 * not to fight with content. Pure server-renderable, animations are
 * CSS keyframes defined in app/globals.css.
 *
 * Position: absolute inset-0 — wrapped in a `relative` parent that
 * spans the full page height (see ConditionalShell).
 */

import {
  Code,
  Code2,
  Terminal,
  Cpu,
  Database,
  Cloud,
  Globe,
  GitBranch,
  GitMerge,
  GitCommit,
  Layers,
  Boxes,
  Server,
  Zap,
  Workflow,
  Braces,
  Network,
  Webhook,
  Bot,
  Container,
  Hexagon,
  Smartphone,
  Wifi,
  Monitor,
  Laptop,
  HardDrive,
  KeyRound,
  Lock,
  Lightbulb,
  Rocket,
  Sparkles,
  Hash,
  type LucideIcon,
} from "lucide-react";

type Slot = {
  Icon: LucideIcon;
  top: string;
  left: string;
  size: number;
  rotate: number;
  anim: "iconFloatA" | "iconFloatB" | "iconFloatC";
  duration: number;
  delay: number;
  opacity: number;
};

// 35 icons distributed across the full page height (top 2% → 98%).
// Sizes 26-44px, opacities 0.18-0.28. Mix of left/right/center slots.
const SLOTS: Slot[] = [
  { Icon: Code,       top: "2%",  left: "8%",  size: 32, rotate: -8,  anim: "iconFloatA", duration: 9,  delay: 0,    opacity: 0.22 },
  { Icon: Terminal,   top: "4%",  left: "82%", size: 38, rotate: 6,   anim: "iconFloatB", duration: 11, delay: -2,   opacity: 0.24 },
  { Icon: Cpu,        top: "7%",  left: "48%", size: 30, rotate: 12,  anim: "iconFloatC", duration: 10, delay: -4,   opacity: 0.20 },
  { Icon: Sparkles,   top: "10%", left: "26%", size: 28, rotate: -16, anim: "iconFloatA", duration: 8,  delay: -3,   opacity: 0.20 },
  { Icon: Database,   top: "13%", left: "62%", size: 34, rotate: -4,  anim: "iconFloatB", duration: 12, delay: -1,   opacity: 0.22 },
  { Icon: Cloud,      top: "17%", left: "92%", size: 42, rotate: -10, anim: "iconFloatA", duration: 13, delay: -5,   opacity: 0.26 },
  { Icon: Lightbulb,  top: "20%", left: "12%", size: 30, rotate: 6,   anim: "iconFloatC", duration: 9,  delay: -2,   opacity: 0.22 },
  { Icon: GitBranch,  top: "24%", left: "44%", size: 32, rotate: 8,   anim: "iconFloatC", duration: 9,  delay: -3,   opacity: 0.22 },
  { Icon: Hexagon,    top: "27%", left: "76%", size: 36, rotate: 20,  anim: "iconFloatA", duration: 14, delay: -6,   opacity: 0.20 },
  { Icon: Layers,     top: "30%", left: "6%",  size: 38, rotate: 14,  anim: "iconFloatA", duration: 14, delay: -7,   opacity: 0.24 },
  { Icon: Boxes,      top: "34%", left: "60%", size: 34, rotate: -12, anim: "iconFloatB", duration: 10, delay: -2,   opacity: 0.22 },
  { Icon: Container,  top: "37%", left: "28%", size: 30, rotate: 4,   anim: "iconFloatC", duration: 11, delay: -5,   opacity: 0.20 },
  { Icon: Server,     top: "40%", left: "84%", size: 32, rotate: 4,   anim: "iconFloatC", duration: 11, delay: -6,   opacity: 0.24 },
  { Icon: Wifi,       top: "43%", left: "14%", size: 30, rotate: -6,  anim: "iconFloatB", duration: 9,  delay: -3,   opacity: 0.22 },
  { Icon: Zap,        top: "47%", left: "52%", size: 28, rotate: -6,  anim: "iconFloatA", duration: 8,  delay: -4,   opacity: 0.22 },
  { Icon: GitMerge,   top: "50%", left: "78%", size: 32, rotate: 10,  anim: "iconFloatB", duration: 12, delay: -7,   opacity: 0.22 },
  { Icon: Code2,      top: "54%", left: "22%", size: 36, rotate: -10, anim: "iconFloatC", duration: 10, delay: -4,   opacity: 0.24 },
  { Icon: Globe,      top: "57%", left: "92%", size: 42, rotate: 10,  anim: "iconFloatB", duration: 13, delay: -8,   opacity: 0.26 },
  { Icon: Smartphone, top: "60%", left: "44%", size: 30, rotate: 14,  anim: "iconFloatA", duration: 10, delay: -2,   opacity: 0.20 },
  { Icon: KeyRound,   top: "63%", left: "8%",  size: 28, rotate: -8,  anim: "iconFloatC", duration: 9,  delay: -5,   opacity: 0.22 },
  { Icon: Workflow,   top: "66%", left: "66%", size: 34, rotate: -3,  anim: "iconFloatC", duration: 12, delay: -1,   opacity: 0.22 },
  { Icon: Braces,     top: "69%", left: "32%", size: 30, rotate: 16,  anim: "iconFloatA", duration: 10, delay: -5,   opacity: 0.24 },
  { Icon: Monitor,    top: "72%", left: "82%", size: 36, rotate: -14, anim: "iconFloatB", duration: 11, delay: -3,   opacity: 0.22 },
  { Icon: Network,    top: "75%", left: "18%", size: 38, rotate: -14, anim: "iconFloatB", duration: 11, delay: -3,   opacity: 0.22 },
  { Icon: Hash,       top: "78%", left: "56%", size: 28, rotate: 8,   anim: "iconFloatC", duration: 9,  delay: -2,   opacity: 0.20 },
  { Icon: Webhook,    top: "81%", left: "88%", size: 32, rotate: 2,   anim: "iconFloatC", duration: 9,  delay: -6,   opacity: 0.20 },
  { Icon: Laptop,     top: "84%", left: "10%", size: 38, rotate: -6,  anim: "iconFloatA", duration: 12, delay: -4,   opacity: 0.24 },
  { Icon: GitCommit,  top: "87%", left: "48%", size: 30, rotate: 10,  anim: "iconFloatB", duration: 10, delay: -7,   opacity: 0.22 },
  { Icon: Bot,        top: "90%", left: "74%", size: 40, rotate: -8,  anim: "iconFloatA", duration: 12, delay: -2,   opacity: 0.24 },
  { Icon: HardDrive,  top: "92%", left: "30%", size: 32, rotate: 14,  anim: "iconFloatC", duration: 11, delay: -3,   opacity: 0.22 },
  { Icon: Lock,       top: "94%", left: "92%", size: 28, rotate: -10, anim: "iconFloatB", duration: 9,  delay: -5,   opacity: 0.20 },
  { Icon: Rocket,     top: "96%", left: "16%", size: 36, rotate: 22,  anim: "iconFloatA", duration: 10, delay: -1,   opacity: 0.24 },
  { Icon: Cpu,        top: "97%", left: "62%", size: 30, rotate: -4,  anim: "iconFloatC", duration: 11, delay: -8,   opacity: 0.20 },
  { Icon: Code,       top: "44%", left: "70%", size: 26, rotate: 14,  anim: "iconFloatA", duration: 9,  delay: -3,   opacity: 0.20 },
  { Icon: Terminal,   top: "78%", left: "8%",  size: 30, rotate: -6,  anim: "iconFloatB", duration: 10, delay: -6,   opacity: 0.22 },
];

export function FloatingIcons() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {SLOTS.map(({ Icon, top, left, size, rotate, anim, duration, delay, opacity }, i) => (
        <span
          key={i}
          className="text-teranga-primary absolute"
          style={{
            top,
            left,
            opacity,
            transform: `rotate(${rotate}deg)`,
            animation: `${anim} ${duration}s ease-in-out ${delay}s infinite`,
            willChange: "transform",
          }}
        >
          <Icon size={size} strokeWidth={1.5} />
        </span>
      ))}
    </div>
  );
}
