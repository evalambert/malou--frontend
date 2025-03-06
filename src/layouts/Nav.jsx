import { useEffect } from 'react';

const Nav = ({ lang }) => {


    // Render
    return (
        <>
            <div class="flex gap-[10px]">
                <h1>
                    <a
                        class="text-base leading-base"
                        href={`/${lang}/about`}
                    >malou raulin</a>
                </h1>
                <nav class="pt-[6px]">
                    <ul>
                        <li>
                            <a href={`/${lang}/weaving`}
                            >
                                {lang === "fr" ? "tisse," : "weaving,"}
                            </a>
                        </li>
                        <li>
                            <a href={`/${lang}/volume`}
                            >
                                {lang === "fr" ? "noue," : "volume,"}
                            </a>
                        </li>
                        <li>
                            <a href={`/${lang}/painting`}
                            >
                                {lang === "fr" ? "peint," : "paint,"}
                            </a>
                        </li>
                        <li>
                            <a href={`/${lang}/poetry`}
                            >
                                {lang === "fr" ? "écrit," : "write,"}
                            </a>
                        </li>
                        <li>
                            <a href={`/${lang}/vitrail`}
                            >
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