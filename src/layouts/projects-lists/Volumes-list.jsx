import { useEffect, useState } from 'react';

import { navigate } from 'astro:transitions/client';
import VolumeTitle from '../../components/title/VolumeTitle.jsx';

const VolumesList = ({
    dataVolumes,
    isOnVolumePage,
    targetHref,
    hidden,
    lang,
    className,
}) => {
    const [hiddenListHeightVolume, setHiddenListHeightVolume] = useState(0);
    const [accordionOffsetY, setAccordionOffsetY] = useState(0); // Décalage causé par l'accordéon

    useEffect(() => {
        // Afficher la hauteur de la liste cachée
        const hiddenListHeightVolumeValue = document.querySelector(
            '.hidden-list-volume'
        ).clientHeight;
        setHiddenListHeightVolume(hiddenListHeightVolumeValue);

        // Title animation
        const titleLayout = () => {
            const title = document.querySelectorAll('li.volume-title a');
            title.forEach((title) => {
                if (title.getAttribute('href') === targetHref) {
                    title.parentElement.classList.add('active');
                } else {
                    title.parentElement.classList.remove('active');
                }
            });
        };
        titleLayout();
    });

    /**
     * Gestion du décalage vertical du titre en fonction de l'accordéon
     */
    useEffect(() => {
        // Écoute l'événement personnalisé émis par l'accordéon
        const handleAccordionMovement = (event) => {
            // Récupère l'état de l'accordéon et sa hauteur depuis l'événement
            const { isAccordionOpen, accordionHeight } = event.detail;
            // Applique un décalage négatif égal à la hauteur de l'accordéon si ouvert, sinon revient à 0
            setAccordionOffsetY(isAccordionOpen ? -accordionHeight : 0);
        };

        // Ajout de l'écouteur d'événement
        window.addEventListener(
            'accordionDescriptionToggle',
            handleAccordionMovement
        );

        // Nettoyage de l'écouteur lors du démontage du composant
        return () => {
            window.removeEventListener(
                'accordionDescriptionToggle',
                handleAccordionMovement
            );
        };
    }, []);

    const translateY = isOnVolumePage
        ? accordionOffsetY
        : -hiddenListHeightVolume;

    // Render
    return (
        <>
            <div
                className={`work-list pt-list-p-top transition-all duration-1000 ease-in-out ${className} ${
                    !isOnVolumePage ? 'cursor-pointer' : ''
                } ${!hidden ? '' : 'translate-y-[-50vh]'}`}
                onClick={
                    !isOnVolumePage
                        ? () =>
                                navigate(`/${lang}/volume/`, {
                                  history: 'push',
                              })
                        : undefined
                }
            >
                <div
                    className={`transition-all duration-500 ease-in-out ${
                        !isOnVolumePage ? 'pointer-events-none' : ''
                    }`}
                    style={{ transform: `translateY(${translateY}px)` }}
                >
                    <div
                        className={`hidden-list-volume overflow-hidden transition-all duration-500 ease-in-out delay-[0.2s]`}
                    >
                        {/* Liste Hidden */}
                        <ul className='volume-list-compact ml-[50px] flex flex-wrap gap-y-[25px] pb-[25px]'>
                            {dataVolumes.slice(3).map((volume) => (
                                <li
                                    className='volume-title w-fit block'
                                    key={volume.id}
                                >
                                    <VolumeTitle volume={volume} lang={lang} />
                                </li>
                            ))}
                        </ul>
                        {/* (END) Liste Hidden */}
                    </div>
                    {/* Liste Homepage */}

                    <ul className='volume-list-compact flex flex-wrap gap-y-[25px]'>
                        {dataVolumes.slice(0, 3).map((volume) => (
                            <li className='volume-title w-fit' key={volume.id}>
                                <VolumeTitle volume={volume} lang={lang} />
                            </li>
                        ))}
                    </ul>

                    {/* (END) Liste Homepage */}
                </div>
            </div>
        </>
    );
};

export default VolumesList;
