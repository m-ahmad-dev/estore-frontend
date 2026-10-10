import React, { use } from "react";
import { ThemeContext } from "../contexts/contexts";

const useTheme = () => {
  const context = use(ThemeContext);

  if (!context) {
    throw Error("Must wrap with ThemeProvider");
  }
  return context;
};
export default useTheme;
