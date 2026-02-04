const Nav = ({ lang, currentPath, className }) => {
    const isHomePage =
        currentPath === `/${lang}` || currentPath === `/${lang}/`;

    const isAboutPage = currentPath === `/${lang}/about/`;

    const getLinkClass = (path) => {
        if (isHomePage || isAboutPage) return 'nav-li nav-home';
        return `nav-li ${currentPath.startsWith(path) ? 'nav-on' : 'nav-off'}`;
    };

    // Redirection malou raulin nav link
    let destination = `/${lang}/`;
    if (isHomePage) {
        destination = `/${lang}/about/`;
    } else if (isAboutPage) {
        destination = `/${lang}/`;
    }

    // Render
    return (
        <>
            <div
                className={`nav-wrapper ${className} pt-body-p-y } flex gap-[10px] border border-red-500`}
            >
                <a href={destination} className='whitespace-nowrap'>
                    malou raulin
                </a>
                <nav>
                    <ul className='nav-list flex flex-col border border-blue-500'>
                        <li className={getLinkClass(`/${lang}/weaving/`)}>
                            <a href={`/${lang}/weaving/`}>
                                {lang === 'fr' ? 'tisse,' : 'weaving,'}
                            </a>
                        </li>
                        <li className={getLinkClass(`/${lang}/volume/`)}>
                            <a href={`/${lang}/volume/`}>
                                {lang === 'fr' ? 'noue,' : 'volume,'}
                            </a>
                        </li>
                        <li className={getLinkClass(`/${lang}/painting/`)}>
                            <a href={`/${lang}/painting/`}>
                                {lang === 'fr' ? 'peint,' : 'paint,'}
                            </a>
                        </li>
                        <li className={getLinkClass(`/${lang}/poetry/`)}>
                            <a href={`/${lang}/poetry/`}>
                                {lang === 'fr' ? 'écrit,' : 'write,'}
                            </a>
                        </li>
                        <li className={getLinkClass(`/${lang}/vitrail/`)}>
                            <a href={`/${lang}/vitrail/`}>
                                {lang === 'fr' ? 'cisèle,' : 'vitrail,'}
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Nav;
