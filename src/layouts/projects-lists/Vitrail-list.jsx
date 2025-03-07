import { useEffect } from "react";
import { navigate } from "astro:transitions/client";

const VitrailList = ({ dataVitrails, isOnVitrailPage, targetHref, lang }) => {


    useEffect(() => {

    }, [dataVitrails]);


    // Render
    return (
        <>
            <div
                className={`pt-list-p-top flex flex-col items-end ${!isOnVitrailPage ? "cursor-pointer" : ""
                    }`}
                onClick={
                    !isOnVitrailPage
                        ? () => navigate(`/${lang}${targetHref}`, { history: "push" })
                        : undefined
                }
            >
                <div
                    className={`flex flex-col items-end  ${!isOnVitrailPage ? "pointer-events-none" : ""
                        }`}
                >
                    {/* Liste Homepage */}
                    <ul className="vitrail-list-compact">
                        {
                            dataVitrails.slice(0, 2).map((vitrail) => (
                                <li className="text-right" key={vitrail.id}>
                                    <a href={`/${lang}/vitrail/${vitrail.slug}`} className="flex flex-col">
                                        {vitrail.title.split(' ').map((word, i) => (
                                            <div key={i} className="inline-block">{word} </div>
                                        ))}
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                    {/* (END) Liste Homepage */}
                    <div
                        className={`max-w-0 overflow-hidden transition-all duration-500 ease-in-out delay-[0.2s] ${isOnVitrailPage ? "max-w-[100vw]" : "max-w-0"
                            }`}
                    >                        
                        {/* Liste Hidden */}
                        {isOnVitrailPage && (
                            <ul className="">
                                {dataVitrails.slice(2).map((vitrail) => (
                                    <li className="text-right w-fit block ml-auto" key={vitrail.id}>
                                        <a href={`/${lang}/vitrail/${vitrail.slug}`} className="flex flex-col">
                                            {vitrail.title.split(' ').map((word, i) => (
                                                <div key={i} className="inline-block">{word} </div>
                                            ))}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {/* (END) Liste Hidden */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default VitrailList;
