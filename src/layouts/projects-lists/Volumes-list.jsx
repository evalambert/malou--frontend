import { useEffect } from 'react';
import { navigate } from "astro:transitions/client";

const VolumesList = ({ dataVolumes, isOnVolumePage, targetHref, lang }) => {
    useEffect(() => {
        
    })

    // Render
    return (
        <>
            <div
                className={`border border-amber-400 ${!isOnVolumePage ? "cursor-pointer" : ""
                    }`}
                onClick={
                    !isOnVolumePage
                        ? () => navigate(`/${lang}${targetHref}`, { history: "push" })
                        : undefined
                }
            >
                <div
                    className={`border border-violet-400  ${!isOnVolumePage ? "pointer-events-none" : ""
                        }`}
                >
                    <div
                        className={`border border-green-400 max-h-0 overflow-hidden transition-all duration-500 ease-in-out delay-[0.2s] ${isOnVolumePage ? "max-h-[100vh]" : "max-h-0"
                            }`}
                    >
                        {/* Liste Hidden */}
                        <ul>
                            {dataVolumes.slice(3).map((volume) => (
                                <li
                                    className="border border-pink-400 volume-title w-fit block"
                                    key={volume.id}
                                >
                                    <a
                                        href={`/${lang}/volume/${volume.slug}`}
                                        className="block whitespace-nowrap"
                                    >
                                        {volume.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        {/* (END) Liste Hidden */}
                    </div>
                    {/* Liste Homepage */}
                    <ul className="volume-list-compact flex">
                        {dataVolumes.slice(0, 3).map((volume) => (
                            <li className="volume-title w-fit" key={volume.id}>
                                <a href={`${lang}/volume/${volume.slug}`} className="block whitespace-nowrap">{volume.title}</a>
                            </li>
                        ))}
                    </ul>
                    {/* (END) Liste Homepage */}
                    
                </div>
            </div>
        </>
    );
}

export default VolumesList;