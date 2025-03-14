import { useStore } from "@nanostores/react";
import { textWhite } from "../lib/store.js";

const Nav = ({ lang, currentPath, className }) => {
  const isTextWhite = useStore(textWhite);

  // Assurez-vous que la valeur par défaut est définie de manière cohérente

  const isHome =
    currentPath === `/${lang}` ||
    currentPath === `/${lang}/` ||
    currentPath === `/${lang}/about/`;

  const getLinkClass = (path) => {
    if (isHome) return "nav-li nav-home";
    return `nav-li ${currentPath.startsWith(path) ? "nav-on" : "nav-off"}`;
  };




  const isAboutPage = currentPath === `/${lang}/about/`;

  // Render
  return (
    <>
      <div className={`nav-wrapper ${className} flex gap-[10px] pt-[6px] ${isTextWhite ? '' : 'mix-blend-difference '}`}>

        <a href={isAboutPage ? `/${lang}/` : `/${lang}/about/`}>
          malou raulin
        </a>

        <nav>
          <ul className="flex flex-col">
            <li className={getLinkClass(`/${lang}/weaving/`)}>
              <a href={`/${lang}/weaving/`}>
                {lang === "fr" ? "tisse," : "weaving,"}
              </a>
            </li>
            <li className={getLinkClass(`/${lang}/volume/`)}>
              <a href={`/${lang}/volume/`}>
                {lang === "fr" ? "noue," : "volume,"}
              </a>
            </li>
            <li className={getLinkClass(`/${lang}/painting/`)}>
              <a href={`/${lang}/painting/`}>
                {lang === "fr" ? "peint," : "paint,"}
              </a>
            </li>
            <li className={getLinkClass(`/${lang}/poetry/`)}>
              <a href={`/${lang}/poetry/`}>
                {lang === "fr" ? "écrit," : "write,"}
              </a>
            </li>
            <li className={getLinkClass(`/${lang}/vitrail/`)}>
              <a href={`/${lang}/vitrail/`}>
                {lang === "fr" ? "cisèle," : "vitrail,"}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Nav;
