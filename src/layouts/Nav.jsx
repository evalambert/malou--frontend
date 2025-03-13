const Nav = ({ lang, currentPath }) => {
  const isHome =
    currentPath === `/${lang}` ||
    currentPath === `/${lang}/` ||
    currentPath === `/${lang}/about/`;

  const getLinkClass = (path) => {
    if (isHome) return "nav-li nav-home";
    return `nav-li ${currentPath === path ? "nav-on" : "nav-off"}`;
  };

  // Render
  return (
    <>
      <div className="nav-wrapper flex gap-[10px] pt-[6px]">
        <h1>
          <a href={`/${lang}/about/`}>malou raulin</a>
        </h1>
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
