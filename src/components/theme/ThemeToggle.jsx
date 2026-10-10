import { Monitor, Moon, Sun } from "lucide-react";
import useTheme from "../../hooks/useTheme";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div
      className={styles.toggleGroup}
      role="group"
      aria-label="Theme selector"
    >
      {options.map(({ value, label, icon }) => {
        const isActive = theme === value;
        const Icon = icon;

        return (
          <button
            key={value}
            type="button"
            className={`${styles.option} ${isActive ? styles.active : ""}`.trim()}
            onClick={() => toggleTheme(value)}
            aria-pressed={isActive}
            aria-label={`Set theme to ${label}`}
            title={label}
          >
            <Icon className={styles.icon} strokeWidth={2} />
            <span className={styles.label}>{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
