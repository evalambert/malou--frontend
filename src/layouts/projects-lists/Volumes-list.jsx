import { useEffect, useState } from 'react';
import { navigate } from "astro:transitions/client";
import PreviewImg from "../../components/PreviewImg.jsx";
import VolumeTitle from "../../components/title/VolumeTitle.jsx";

const VolumesList = ({ dataVolumes, isOnVolumePage, targetHref, hidden, lang, className }) => {

    const [hiddenListHeightVolume, setHiddenListHeightVolume] = useState(0);

    useEffect(() => {
        // Afficher la hauteur de la liste cachée
        const hiddenListHeightVolumeValue = document.querySelector('.hidden-list-volume').clientHeight;
        setHiddenListHeightVolume(hiddenListHeightVolumeValue);

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
                className={`work-list pt-list-p-top transition-all duration-1000 ease-in-out mix-blend-difference ${className} ${!isOnVolumePage ? "cursor-pointer" : ""
                    } ${!hidden ? "" : "translate-y-[-50vh]"}`}
                onClick={
                    !isOnVolumePage
                        ? () => navigate(`/${lang}${targetHref}`, { history: "push" })
                        : undefined
                }
            >
                <div
                    className={`transition-all duration-500 ease-in-out ${!isOnVolumePage ? "pointer-events-none" : ""
                        }`}
                        style={isOnVolumePage ? { transform: `translateY(0px)` } : { transform: `translateY(-${hiddenListHeightVolume}px)` }}
                >
                    <div
                        className={`hidden-list-volume overflow-hidden transition-all duration-500 ease-in-out delay-[0.2s]`}
                    >
                        {/* Liste Hidden */}
                        <ul className="volume-list-compact ml-[50px] flex flex-wrap gap-y-[25px] pb-[25px]">
                            {dataVolumes.slice(3).map((volume) => (
                                <li
                                    className="volume-title w-fit block"
                                    key={volume.id}
                                >
                                    <VolumeTitle volume={volume} lang={lang} />
                                </li>
                            ))}
                        </ul>
                        {/* (END) Liste Hidden */}
                    </div>
                    {/* Liste Homepage */}

                    <ul className="volume-list-compact flex flex-wrap gap-y-[25px]">
                        {dataVolumes.slice(0, 3).map((volume) => (
                            <li className="volume-title w-fit" key={volume.id}>
                                <VolumeTitle volume={volume} lang={lang} />
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