
const Nav = ({ lang, currentPath }) => {


    // Render
    return (
        <>
            <div className="flex gap-[10px]">
                <h1>
                    <a
                        className="text-base leading-base"
                        href={`/${lang}/about`}
                    >malou raulin</a>
                </h1>
                <nav className="pt-[6px]">
                    <ul className="flex flex-col">
                        <li className={`overflow-hidden transition-all duration-500 ${currentPath === `/${lang}/weaving` || currentPath === "/" ? "max-h-[30px] opacity-100" : "max-h-0 opaci"}`}>
                            <a href={`/${lang}/weaving`}>
                                {lang === "fr" ? "tisse," : "weaving,"}
                            </a>
                        </li>
                        <li className={`overflow-hidden transition-all duration-500 ${currentPath === `/${lang}/volume`|| currentPath === "/" ? "max-h-[30px] opacity-100" : "max-h-0 opacity-0"}`}>
                            <a href={`/${lang}/volume`}>
                                {lang === "fr" ? "noue," : "volume,"}
                            </a>
                        </li>
                        <li className={`overflow-hidden transition-all duration-500 ${currentPath === `/${lang}/painting` || currentPath === "/" ? "max-h-[30px] opacity-100" : "max-h-0 opacity-0"}`}>
                            <a href={`/${lang}/painting`}>
                                {lang === "fr" ? "peint," : "paint,"}
                            </a>
                        </li>
                        <li className={`overflow-hidden transition-all duration-500 ${currentPath === `/${lang}/poetry` || currentPath === "/" ? "max-h-[30px] opacity-100" : "max-h-0 opacity-0"}`}>
                            <a href={`/${lang}/poetry`}>
                                {lang === "fr" ? "écrit," : "write,"}
                            </a>
                        </li>
                        <li className={`overflow-hidden transition-all duration-500 ${currentPath === `/${lang}/vitrail` || currentPath === "/" ? "max-h-[30px] opacity-100" : "max-h-[0px] opacity-0"}`}>
                            <a href={`/${lang}/vitrail`}>
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