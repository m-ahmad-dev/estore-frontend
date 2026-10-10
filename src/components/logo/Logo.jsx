import { Link } from "react-router-dom";
import IsDark from "../../utils/themeUtility/isDark";

const Logo = () => {
  const isDark = IsDark();

  const iconColor = isDark ? "#FAFAFA" : "#18181B"; // zinc-50 / zinc-900
  const primaryText = isDark ? "#FAFAFA" : "#18181B"; // main text
  const secondaryText = isDark ? "#A1A1AA" : "#52525B"; // lighter contrast text

  return (
    <Link path="/" aria-label="Go to homepage">
      <span className="inline-block select-none cursor-pointer">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 180 41"
          preserveAspectRatio="xMidYMid meet"
          className="w-30 xs:w-40 sm:w-30 lg:w-45 h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Original Icon (UNCHANGED SHAPE) */}
          <path
            d="M16.7362 0L0 9.91829V22.1254L16.7362 32.0437L30.1619 24.4143V28.0383L16.7362 36.0492L0 25.9402V30.3271L16.7362 40.0546L33.4724 30.3271V18.12L20.0466 25.9402V22.1254L33.4724 14.1145V9.91829L16.7362 0Z"
            fill={iconColor}
          />

          {/* Brand Name */}
          <text
            x={45}
            y={28}
            fontFamily="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, sans-serif"
            fontSize={24}
            fontWeight={600}
            fill={primaryText}
          >
            Shop
          </text>

          <text
            x={100}
            y={28}
            fontFamily="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, sans-serif"
            fontSize={24}
            fontWeight={300}
            fill={secondaryText}
          >
            Lite
          </text>
        </svg>
      </span>
    </Link>
  );
};

export default Logo;
