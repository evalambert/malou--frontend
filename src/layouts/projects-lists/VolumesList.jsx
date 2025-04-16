import { useEffect, useState } from 'react';
import { navigate } from 'astro:transitions/client';
import VolumeTitle from '../../components/common/title/VolumeTitle.jsx';

const VolumesList = ({
    homepageVolumes,
    hiddenVolumes,
    targetHref,
    lang,
    className,
}) => {
    const [hiddenListHeightVolume, setHiddenListHeightVolume] = useState(0);
    const [accordionOffsetY, setAccordionOffsetY] = useState(0); // Décalage causé par l'accordéon

    useEffect(() => {
        // Mobile Title Volume display
        if (window.innerWidth < 768) {
            const titleVolume = document.querySelectorAll('li.volume-title');
            let maxLenghtPhrase = 0;
            let windowWidth = window.innerWidth - 40;
            let isNextToPadding = false;
            let lastTitleWidth = 0;

            // Déplacer les éléments li de hidden-list-volume vers preview-list-volume
            const hiddenList = document.querySelector(
                '.hidden-list-volume .volume-list-compact'
            );
            const previewList = document.querySelector('.preview-list-volume');

            if (hiddenList && previewList) {
                const liElements = hiddenList.querySelectorAll('li');
                liElements.forEach((li) => {
                    previewList.appendChild(li);
                });
            }

            titleVolume.forEach((title) => {
                let titleWidth = title.offsetWidth;
                maxLenghtPhrase = maxLenghtPhrase + titleWidth;

                if (maxLenghtPhrase < windowWidth) {
                    if (isNextToPadding === false) {
                        title.classList.add('max-md:mt-[50px]');
                        isNextToPadding = true;
                        // title.style.border = `2px solid red`;
                    } else {
                        isNextToPadding = false;
                        // title.style.border = `2px solid blue`;
                        title.classList.add('max-md:mt-[25px]');
                    }
                } else {
                    maxLenghtPhrase = 0;
                    // title.style.border = `2px solid green`;
                    if (titleWidth > windowWidth / 2) {
                        title.classList.add('max-md:mt-[25px]');
                    } else {
                        title.classList.add('max-md:mt-[50px]');
                    }
                }

            });
        }
    });

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
                    
                    // Ajouter un écouteur d'événement pour détecter la fin de l'animation
                    const spans = title.querySelectorAll('span');
                    const lastSpan = spans[spans.length - 1];
                    
                    lastSpan.addEventListener('transitionend', () => {
                        const finalCoordinates = title.parentElement.getBoundingClientRect();
                        const titleOnDisplay = document.getElementById('title-on-display');
                        console.log('titlE HAHAHAHA');
                        if (titleOnDisplay) {
                            titleOnDisplay.style.position = 'fixed';
                            titleOnDisplay.style.top = `${finalCoordinates.top}px`;
                            titleOnDisplay.style.left = `${finalCoordinates.left}px`;
                            titleOnDisplay.style.width = `${finalCoordinates.width}px`;
                            titleOnDisplay.style.height = `${finalCoordinates.height}px`;
                            titleOnDisplay.style.display = 'block';
                        }
                    }, { once: true }); // L'événement ne sera déclenché qu'une seule fois
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

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Toogle hidden/compact/full
    const [translateYValue, settranslateYValue] = useState('-200vh');
    const [translateXValue, settranslateXValue] = useState('0px');
    const [maxWidthValue, setMaxWidthValue] = useState('initial');
    const [maxHeightValue, setMaxHeightValue] = useState('initial');
    const [isOnVolumePage, setIsOnVolumePage] = useState(false);
    const [isOnIndexPage, setIsOnIndexPage] = useState(false);

    const toggleListDisplay = (url, category, accordionY) => {
        if (url.includes(category)) {
            settranslateYValue('0px');
            setIsOnVolumePage(true);
            setIsOnIndexPage(false);
            if (window.innerWidth < 768) {
                setMaxHeightValue('initial');
                setTimeout(() => {
                    settranslateXValue('0px');
                    setMaxWidthValue('100vw');
                }, 400);
            }
        } else if (url == '/fr/' || url == '/en/') {
            setIsOnIndexPage(true);
            setIsOnVolumePage(false);
            if (window.innerWidth < 768) {
                settranslateYValue('0px');
                settranslateXValue('50vw');
                setMaxWidthValue('0px');
                setMaxHeightValue('0px');
            } else {
                settranslateYValue('-' + hiddenListHeightVolume + 'px');
            }
        } else {
            setIsOnVolumePage(false);
            setIsOnIndexPage(false);
            if (window.innerWidth < 768) {
                setMaxWidthValue('0px');
                setMaxHeightValue('0px');
                settranslateYValue('0px');
                settranslateXValue('50vw');
            } else {
                settranslateYValue('-200vh');
            }
        }
    };

    useEffect(() => {
        toggleListDisplay(targetHref, 'volume', accordionOffsetY);
    }, [targetHref, hiddenListHeightVolume, accordionOffsetY]);



    // Render
    return (
        <>
            
            <a id="title-on-display" href={`/${lang}/volume/`} className='bg-blue-800 opacity-[0.5]' style={{ position: 'fixed', top: '0', right: '0', zIndex: '1000' }}></a>
            <div
                className={`work-list max-md:relative max-md:top-[50vh] max-md:left-0 max-md:flex max-md:flex-col max-md:items-end max-md:overflow-hidden ${className} ${isOnIndexPage ? 'pointer-events-auto cursor-pointer' : ''} ${!isOnVolumePage && !isOnIndexPage ? 'pointer-events-none' : ''}`}
            >
                <div
                    className={`max-md:transition-[max-width] max-md:duration-1000 max-md:ease-in-out`}
                    onClick={
                        !isOnVolumePage
                            ? () =>
                                navigate(`/${lang}/volume/`, {
                                    history: 'push',
                                })
                            : undefined
                    }
                    style={{
                        maxWidth: `${maxWidthValue}`,
                        maxHeight: `${maxHeightValue}`,
                    }}
                >
                    <div
                        className={`pt-body-p-y transition-all duration-500 ease-in-out max-md:w-[calc(100vw-40px)] ${!isOnVolumePage ? 'pointer-events-none' : ''}`}
                        style={{
                            transform: `translate(${translateXValue}, ${translateYValue})`,
                        }}
                    >
                        <div
                            className={`hidden-list-volume overflow-hidden transition-all delay-[0.2s] duration-500 ease-in-out`}
                        >
                            {/* Liste Hidden */}
                            <ul className='volume-list-compact flex flex-wrap justify-center md:gap-y-[25px] md:pb-[25px]'>
                                {hiddenVolumes.map((volume) => (
                                    <li
                                        className='volume-title block w-fit'
                                        key={volume.id}
                                    >
                                        <VolumeTitle
                                            volume={volume}
                                            lang={lang}
                                        />
                                    </li>
                                ))}
                            </ul>
                            {/* (END) Liste Hidden */}
                        </div>

                        {/* Liste Homepage */}
                        <ul className='volume-list-compact preview-list-volume flex flex-wrap md:gap-y-[25px]'>
                            {homepageVolumes.map((volume) => (
                                <li
                                    className='volume-title w-fit'
                                    key={volume.id}
                                >
                                    <VolumeTitle volume={volume} lang={lang} />
                                </li>
                            ))}
                        </ul>

                        {/* (END) Liste Homepage */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default VolumesList;
