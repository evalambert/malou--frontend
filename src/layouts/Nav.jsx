import { useStore } from '@nanostores/react';
import { textWhite } from '../lib/store.js';

const Nav = ({ lang, currentPath, className }) => {
     const isTextWhite = useStore(textWhite);

    const isHomePage =
        currentPath === `/${lang}` || currentPath === `/${lang}/`;

    const isAboutPage = currentPath === `/${lang}/about/`;

    const getLinkClass = (path) => {
        if (isHomePage) return 'nav-li nav-home';
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
                className={`nav-wrapper ${className} flex gap-[10px] pt-body-p-y }`}
            // className={`nav-wrapper ${className} flex gap-[10px] pt-body-p-y ${
            //     isTextWhite ? 'text-white' : 'text-black'
            // }`}
            >
                <a href={destination} className="whitespace-nowrap">malou raulin</a>
                <nav>
                    <ul className='flex flex-col'>
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
