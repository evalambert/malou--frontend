import { useEffect, useState } from 'react';

const Nav = ({ lang, currentPath, className }) => {
    const isHomePage =
        currentPath === `/${lang}` || currentPath === `/${lang}/`;

    const isAboutPage = currentPath === `/${lang}/about/`;

    const isSlugPage = currentPath.includes('/painting/') || currentPath.includes('/volume/') || currentPath.includes('/poetry/') || currentPath.includes('/vitrail/') || currentPath.includes('/weaving/');

    const [isMobile, setIsMobile] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const isNavOn = (path) => {
        if (isHomePage || isAboutPage) return false;
        return currentPath.startsWith(path);
    };
    const hasNavOn = isSlugPage;

    const getLinkClass = (path) => {
        if (isHomePage || isAboutPage) return 'nav-li nav-home';
        return `nav-li ${isNavOn(path) ? 'nav-on' : 'nav-off'}`;
    };

    useEffect(() => {
        if (!isMobile || !hasNavOn) {
            setIsMobileNavOpen(false);
            console.log('hellow ')
        } else {
            console.log('world');
        }
    }, [isMobile, hasNavOn]);

    useEffect(() => {
        if (!isMobile || !hasNavOn || !isMobileNavOpen) return;
        const handleScroll = () => {
            setIsMobileNavOpen(false);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile, hasNavOn, isMobileNavOpen]);

    const openMobileNav = (event) => {
        if (!isMobile || !hasNavOn) return;
        if (event?.preventDefault) {
            event.preventDefault();
        }
        setIsMobileNavOpen((value) => !value);
    };

    const closeMobileNav = () => {
        if (!isMobile || !hasNavOn) return;
        setIsMobileNavOpen(false);
    };

    // Redirection malou raulin nav link
    let destination = `/${lang}/`;
    if (isMobile) {
        if (isSlugPage || isHomePage) {
            destination = `/${lang}/about/`;
        } else if (isAboutPage) {
            destination = `/${lang}/`;
        }
    } else {
        if (isHomePage) {
            destination = `/${lang}/about/`;
        } else if (isAboutPage) {
            destination = `/${lang}/`;
        }
    }



    // Render
    return (
        <>
            <div
                className={`nav-wrapper ${className} pt-body-p-y flex gap-[10px] ${isMobileNavOpen ? 'nav-open' : ''}`}
            >
                <a href={destination} className='whitespace-nowrap'>
                    malou raulin
                </a>
                <nav>
                    <ul className='nav-list flex flex-col'>
                        <li
                            className={getLinkClass(`/${lang}/weaving/`)}
                            onClick={isNavOn(`/${lang}/weaving/`) ? openMobileNav : closeMobileNav}
                        >
                            <a href={`/${lang}/weaving/`}>
                                {lang === 'fr' ? 'tisse,' : 'weaving,'}
                            </a>
                        </li>
                        <li
                            className={getLinkClass(`/${lang}/volume/`)}
                            onClick={isNavOn(`/${lang}/volume/`) ? openMobileNav : closeMobileNav}
                        >
                            <a href={`/${lang}/volume/`}>
                                {lang === 'fr' ? 'noue,' : 'volume,'}
                            </a>
                        </li>
                        <li
                            className={getLinkClass(`/${lang}/painting/`)}
                            onClick={isNavOn(`/${lang}/painting/`) ? openMobileNav : closeMobileNav}
                        >
                            <a href={`/${lang}/painting/`}>
                                {lang === 'fr' ? 'peint,' : 'paint,'}
                            </a>
                        </li>
                        <li
                            className={getLinkClass(`/${lang}/poetry/`)}
                            onClick={isNavOn(`/${lang}/poetry/`) ? openMobileNav : closeMobileNav}
                        >
                            <a href={`/${lang}/poetry/`}>
                                {lang === 'fr' ? 'écrit,' : 'write,'}
                            </a>
                        </li>
                        <li
                            className={getLinkClass(`/${lang}/vitrail/`)}
                            onClick={isNavOn(`/${lang}/vitrail/`) ? openMobileNav : closeMobileNav}
                        >
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
