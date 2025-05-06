import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Load Inter font
const interFontLink = document.createElement("link");
interFontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
interFontLink.rel = "stylesheet";
document.head.appendChild(interFontLink);

// Add title and meta description
const title = document.createElement("title");
title.textContent = "BetTitan365 | Apuestas Deportivas Online";
document.head.appendChild(title);

const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "Las mejores apuestas deportivas online con las mejores cuotas. Registrate ahora y obtén un bono de bienvenida del 100% en tu primer depósito.";
document.head.appendChild(metaDescription);

// Load Remix icons
const remixIconsLink = document.createElement("link");
remixIconsLink.href = "https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css";
remixIconsLink.rel = "stylesheet";
document.head.appendChild(remixIconsLink);

createRoot(document.getElementById("root")!).render(<App />);
