import { useEffect } from "react";
import { navigate } from "astro:transitions/client";

const PoetryList = ({ dataPoetry, isOnPoetryPage, targetHref, lang }) => {
    useEffect(() => {
    }, [dataPoetry]);


    // Render
    return (
        <>
            <div
                className={`border border-green-400 w-fit ${!isOnPoetryPage ? "cursor-pointer" : ""
                    }`}
                onClick={
                    !isOnPoetryPage
                        ? () => navigate(`/${lang}${targetHref}`, { history: "push" })
                        : undefined
                }
            >
                <div className={`flex gap-[20px] ${!isOnPoetryPage ? "pointer-events-none" : ""}`}>
                    <div className={`max-w-0 overflow-hidden transition-all duration-500 ease-in-out delay-[0.2s] ${isOnPoetryPage ? "max-w-[100vw]" : "max-w-0"}`}>
                        {/* Liste Hidden */}
                        {isOnPoetryPage && (
                            <ul>
                                {dataPoetry.slice(1).map((poetry) => (
                                    <li className="poetry-title w-fit" key={poetry.id}>
                                        <a href={`/${lang}/poetry/${poetry.slug}`} className="pr-1">
                                            <div className="flex flex-col">
                                                {poetry.title.split('').map((letter, index) => (
                                                    <span key={index}>{letter}</span>
                                                ))}
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {/* (END) Liste Hidden */}
                    </div>
                    {/* Liste Homepage */}
                    <ul>
                        {dataPoetry.slice(0, 1).map((poetry) => (
                            <li className="poetry-title w-fit" key={poetry.id}>
                                <a href={`/${lang}/poetry/${poetry.slug}`} className="pr-1">
                                    <div className="flex flex-col">
                                        {poetry.title.split('').map((letter, index) => (
                                            <span key={index}>{letter}</span>
                                        ))}
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                    {/* (END) Liste Homepage */}

                </div>
            </div>

        </>
    );
};

export default PoetryList;
