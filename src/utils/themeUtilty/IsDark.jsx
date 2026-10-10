import useTheme from "../../hooks/useTheme";
import { getSystemTheme } from "./themeUtilty";

const IsDark = () => {
  const { theme } = useTheme();

  const effectiveTheme = () => {
    const sysTheme = getSystemTheme();
    if (theme === "system") return sysTheme;
    return theme;
  };

  return effectiveTheme() === "dark";
};
export default IsDark;
