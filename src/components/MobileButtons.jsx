import { useStore } from "@nanostores/react";
import { activeComponent, toggleComponent } from "../lib/store.js";

export default function MobileButtons({ lang }) {
  const active = useStore(activeComponent);

  const handleAboutClick = () => {
    if (active === "actu") {
      toggleComponent();
    } else if (active === "about") {
      toggleComponent();
    }
  };

  const handleActuClick = () => {
    if (active === "about") {
      toggleComponent();
    } else if (active === "actu") {
      toggleComponent();
    }
  };

  return (
    <div className="mobile-buttons md:hidden w-full h-[200px] flex gap-6">
      <button
        className={`button-about rotate-[18.74deg] py-[13px] ${
          active === "actu" ? "self-start" : "self-end"
        }`}
        onClick={handleAboutClick}
      >
        {lang === "fr" ? "à propos" : "about"}
      </button>
      <button
        className={`button-actu -rotate-45 py-[6px] ${
          active === "about" ? "self-start" : "self-end"
        }`}
        onClick={handleActuClick}
      >
        {lang === "fr" ? "actualités" : "news"}
      </button>
    </div>
  );
}
