import Image from "next/image";
import { ORG_LONG_NAME } from "@/constants";

// The supplied SVG already contains the wordmark, so it is never paired with
// a separate text label.
const Logo = ({ className = "h-8 w-auto" }) => (
  <Image
    src="/assets/gdg-logo.svg"
    alt={ORG_LONG_NAME}
    width={262}
    height={24}
    priority
    className={className}
  />
);

export default Logo;
