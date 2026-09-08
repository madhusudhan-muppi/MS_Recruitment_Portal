import {
  Users,
  Megaphone,
  Handshake,
  PenTool,
  Palette,
  Code2,
  Smartphone,
  Gamepad2,
  LineChart,
  Blocks,
  GitBranch,
  Trophy,
  Sparkles,
} from "lucide-react";

// Keyed by reviews[].iconKey (Step 34). lucide-react renders crisply at any
// size in the department's own colour — the project's own icons.svg files
// turned out to be unusable (near-invisible on dark cards, clipped viewBoxes,
// one with an embedded raster pattern), so this replaces them entirely.
const ICONS_BY_KEY = {
  management: Users,
  marketing: Megaphone,
  outreach: Handshake,
  "ui-ux": PenTool,
  design: Palette,
  "web-dev": Code2,
  "app-dev": Smartphone,
  "game-dev": Gamepad2,
  "data-science": LineChart,
  blockchain: Blocks,
  "open-source": GitBranch,
  cp: Trophy,
};

const DeptIcon = ({ iconKey, className, ...props }) => {
  const Icon = ICONS_BY_KEY[iconKey] || Sparkles;
  return <Icon className={className} {...props} />;
};

export default DeptIcon;
