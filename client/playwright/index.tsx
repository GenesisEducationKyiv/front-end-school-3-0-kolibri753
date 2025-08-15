import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { ThemeProvider } from "../src/context/ThemeContext";
import "../src/index.css";

let root: Root | undefined;

/**
 * Playwright CT entry – wraps every tested component
 * with <ThemeProvider> and global styles.
 */
export default function render(component: React.ReactNode) {
  const container = document.getElementById("root");
  if (!container) throw new Error("#root element not found");

  // Initialise React root only once per page
  root ??= createRoot(container);

  root.render(
    <StrictMode>
      <ThemeProvider>{component}</ThemeProvider>
    </StrictMode>
  );
}
