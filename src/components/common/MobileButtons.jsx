import { useStore } from "@nanostores/react";
import { activeComponent, toggleComponent } from "../../lib/store.js";

export default function MobileButtons({ lang }) {
  const active = useStore(activeComponent);

  const handleAboutClick = () => {
    toggleComponent();
  };

  const handleActuClick = () => {
    toggleComponent();
  };

  return (
    <div className="mobile-buttons md:hidden w-full h-[200px] flex gap-6">
      <button
        className={`button-about h-fit rotate-[18.74deg] py-[13px] transition-all duration-500 ease-in-out
         ${active === "actu" ? "-translate-y-0" : "translate-y-33"}`}
        onClick={handleAboutClick}
      >
        {lang === "fr" ? "à propos" : "about"}
      </button>
      <button
        className={`button-actu h-fit -rotate-45 py-[6px] px-[20px]  transition-all duration-500 ease-in-out
          ${active === "about" ? "translate-y-7" : "translate-y-25"}`}
        onClick={handleActuClick}
      >
        {lang === "fr" ? "actualités" : "news"}
        
      </button>
    </div>
  );
}
