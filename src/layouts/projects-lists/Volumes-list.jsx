import { useEffect } from 'react';
import { navigate } from "astro:transitions/client";
import PreviewImg from "../../components/PreviewImg.jsx";

const VolumesList = ({ dataVolumes, isOnVolumePage, targetHref, hidden, lang }) => {

    // Fonction pour gérer le survol et changer l'image
    const handleMouseEnter = (imageUrl) => {
        const imageElement = document.querySelector('.dynamic-image');
        const wrapperElement = document.querySelector('.dynamic-image--wrapper');
        if (imageElement) {
            imageElement.src = imageUrl;
        }
        if (wrapperElement) {
            wrapperElement.style.opacity = '1';
        }
    };

    const handleMouseLeave = () => {
        const wrapperElement = document.querySelector('.dynamic-image--wrapper');
        if (wrapperElement) {
            wrapperElement.style.opacity = '0';
        }
    };


    useEffect(() => {
        // Title animation  
        const titleLayout = () => {
            const title = document.querySelectorAll("li.volume-title a");
            title.forEach((title) => {
                if (title.getAttribute('href') === targetHref) {
                    title.parentElement.classList.add('active');
                } else {
                    title.parentElement.classList.remove('active');
                }
            });

        }
        titleLayout();
    })

    // Render
    return (
        <>
            <div
                className={`pt-list-p-top transition-all duration-1000 ease-in-out ${!isOnVolumePage ? "cursor-pointer" : ""
                    } ${!hidden ? "" : "translate-y-[-50vh]"}`}
                onClick={
                    !isOnVolumePage
                        ? () => navigate(`/${lang}${targetHref}`, { history: "push" })
                        : undefined
                }
            >
                <div
                    className={`${!isOnVolumePage ? "pointer-events-none" : ""
                        }`}
                >
                    <div
                        className={`max-h-0 overflow-hidden transition-all duration-500 ease-in-out delay-[0.2s] ${isOnVolumePage ? "max-h-[100vh]" : "max-h-0"
                            }`}
                    >
                        {/* Liste Hidden */}
                        <ul className="volume-list-compact flex flex-wrap gap-y-[25px] pb-[25px]">
                            {dataVolumes.slice(3).map((volume) => (
                                <li
                                    className="volume-title w-fit block"
                                    key={volume.id}
                                >
                                    <a
                                        href={`/${lang}/volume/${volume.slug}/`}
                                        className="block whitespace-nowrap"
                                        onMouseEnter={() => {
                                            const mediaUrl = volume.medias && volume.medias[0] && volume.medias[0].url;
                                            if (mediaUrl) {
                                                handleMouseEnter(mediaUrl);
                                            }
                                        }}
                                        onMouseLeave={handleMouseLeave}
                                        data-image-preview={volume.medias && volume.medias[0] && volume.medias[0].url}
                                    >
                                        {volume.title.split('').map((letter, index) => (
                                            <span className="inline-block" key={index}>{letter}</span>
                                        ))}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        {/* (END) Liste Hidden */}
                    </div>
                    {/* Liste Homepage */}

                    <ul className="volume-list-compact flex flex-wrap gap-y-[25px]">
                        {dataVolumes.slice(0, 3).map((volume) => (
                            <li className="volume-title w-fit" key={volume.id}>
                                <a
                                    href={`/${lang}/volume/${volume.slug}/`}
                                    className="block whitespace-nowrap"
                                    onMouseEnter={() => {
                                        const mediaUrl = volume.medias && volume.medias[0] && volume.medias[0].url;
                                        if (mediaUrl) {
                                            handleMouseEnter(mediaUrl);
                                        }
                                    }}
                                    onMouseLeave={handleMouseLeave}
                                    data-image-preview={volume.medias && volume.medias[0] && volume.medias[0].url}
                                >
                                    {volume.title.split('').map((letter, index) => (
                                        <span className="inline-block" key={index}>{letter}</span>
                                    ))}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* (END) Liste Homepage */}

                </div>
            </div>
            <PreviewImg />
        </>
    );
}

export default VolumesList;