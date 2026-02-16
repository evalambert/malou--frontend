import { useEffect, useRef, useState } from 'react';

const Nav = ({ lang, currentPath, className }) => {
    const isHomePage =
        currentPath === `/${lang}` || currentPath === `/${lang}/`;

    const isAboutPage = currentPath === `/${lang}/about/`;

    const isSlugPage =
        currentPath.includes('/painting/') ||
        currentPath.includes('/volume/') ||
        currentPath.includes('/poetry/') ||
        currentPath.includes('/vitrail/') ||
        currentPath.includes('/weaving/');

    const [isMobile, setIsMobile] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    /** Fermer le nav au prochain astro:page-load (après mise à jour du .nav-on) */
    const closeNavOnNextPageLoad = useRef(false);

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

    // Fermer le nav une fois que la nouvelle page a mis à jour le .nav-on (ordre d'animation correct)
    useEffect(() => {
        const onPageLoad = () => {
            if (closeNavOnNextPageLoad.current) {
                closeNavOnNextPageLoad.current = false;
                setIsMobileNavOpen(false);
            }
        };
        document.addEventListener('astro:page-load', onPageLoad);
        return () =>
            document.removeEventListener('astro:page-load', onPageLoad);
    }, []);

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

    /** Clic sur un lien .nav-off : on ferme le nav après la navigation (astro:page-load) pour que l'animation se joue après la mise à jour du .nav-on */
    const scheduleCloseOnPageLoad = () => {
        if (!isMobile || !hasNavOn) return;
        closeNavOnNextPageLoad.current = true;
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
                className={`nav-wrapper ${className} pt-body-p-y flex w-fit gap-[10px] ${isMobileNavOpen ? 'nav-open' : ''} ${isMobile && isAboutPage ? 'pb-[30px]' : ''}`}
            >
                <a href={destination} className='whitespace-nowrap'>
                    malou raulin
                </a>
                <nav>
                    <ul className='nav-list flex flex-col'>
                        <li
                            className={getLinkClass(`/${lang}/weaving/`)}
                            onClick={
                                isNavOn(`/${lang}/weaving/`)
                                    ? openMobileNav
                                    : scheduleCloseOnPageLoad
                            }
                        >
                            <a href={`/${lang}/weaving/`}>
                                {lang === 'fr' ? 'tisse,' : 'weaving,'}
                            </a>
                        </li>
                        <li
                            className={getLinkClass(`/${lang}/volume/`)}
                            onClick={
                                isNavOn(`/${lang}/volume/`)
                                    ? openMobileNav
                                    : scheduleCloseOnPageLoad
                            }
                        >
                            <a href={`/${lang}/volume/`}>
                                {lang === 'fr' ? 'noue,' : 'volume,'}
                            </a>
                        </li>
                        <li
                            className={getLinkClass(`/${lang}/painting/`)}
                            onClick={
                                isNavOn(`/${lang}/painting/`)
                                    ? openMobileNav
                                    : scheduleCloseOnPageLoad
                            }
                        >
                            <a href={`/${lang}/painting/`}>
                                {lang === 'fr' ? 'peint,' : 'paint,'}
                            </a>
                        </li>
                        <li
                            className={getLinkClass(`/${lang}/poetry/`)}
                            onClick={
                                isNavOn(`/${lang}/poetry/`)
                                    ? openMobileNav
                                    : scheduleCloseOnPageLoad
                            }
                        >
                            <a href={`/${lang}/poetry/`}>
                                {lang === 'fr' ? 'écrit,' : 'write,'}
                            </a>
                        </li>
                        <li
                            className={getLinkClass(`/${lang}/vitrail/`)}
                            onClick={
                                isNavOn(`/${lang}/vitrail/`)
                                    ? openMobileNav
                                    : scheduleCloseOnPageLoad
                            }
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
