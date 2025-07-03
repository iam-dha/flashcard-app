import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/theme-provider";
import { useEffect, useState } from "react";

export function ThemeToggle({ variant }: { variant: "icon" | "compact" | "expanded" }) {
  const { theme, setTheme } = useTheme();
  const [currentIcon, setCurrentIcon] = useState<React.ReactNode>(null);
  const themeStyles = "transition-all ease-in-out duration-500";

  // update the icon based on current theme
  useEffect(() => {
    switch (theme) {
      case "light":
        setCurrentIcon(<Sun className={themeStyles} />);
        break;
      case "dark":
        setCurrentIcon(<Moon className={themeStyles} />);
        break;
      case "system":
      default:
        setCurrentIcon(<Monitor className={themeStyles} />);
        break;
    }
  }, [theme]);

  // function to cycle through themes
  const cycleTheme = () => {
    switch (theme) {
      case "light":
        setTheme("dark");
        break;
      case "dark":
        setTheme("system");
        break;
      case "system":
      default:
        setTheme("light");
        break;
    }
  };

  // render the button based on the variant
  if (variant === "icon") {
    return (
      <Button variant="outline" size="icon" onClick={cycleTheme} className="hover:bg-card/50">
        {currentIcon}
      </Button>
    );
  } else if (variant === "compact") {
    return (
      <Button variant="outline" onClick={cycleTheme} className="hover:bg-card/50">
        {currentIcon}
        <div className={`${themeStyles}`}>{theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System"}</div>
      </Button>
    );
  } else if (variant === "expanded") {
    return (
      <Button variant="outline" onClick={cycleTheme} className="hover:bg-card/50">
        <p className={themeStyles}>Appearance:</p>
        {currentIcon}
        <div className={`-ml-1 ${themeStyles}`}>{theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System"}</div>
      </Button>
    );
  }
}
