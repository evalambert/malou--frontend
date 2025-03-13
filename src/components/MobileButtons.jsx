import { useStore } from "@nanostores/react";
import { activeComponent, toggleComponent } from "../lib/store.js";

export default function MobileButtons({ lang }) {
  const active = useStore(activeComponent);

  const handleAboutClick = () => {
    if (active === "actu") {
      toggleComponent();
    }
  };

  const handleActuClick = () => {
    if (active === "about") {
      toggleComponent();
    }
  };

  return (
    <div className="mobile-buttons md:hidden w-full h-[200px] flex justify-between bg-white">
      <button
        className={`button-about transition-opacity duration-300
          ${active === "actu" ? "self-start" : "self-end"}`}
        onClick={handleAboutClick}
      >
        {lang === "fr" ? "à propos" : "about"}
      </button>
      <button
        className={`button-actu transition-opacity duration-300
          ${active === "about" ? "self-start" : "self-end"}`}
        onClick={handleActuClick}
      >
        {lang === "fr" ? "actualités" : "news"}
      </button>
    </div>
  );
}
