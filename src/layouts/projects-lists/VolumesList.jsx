import { useRef, useEffect, useState } from 'react';
import { navigate } from 'astro:transitions/client';
import VolumeTitle from '../../components/common/title/VolumeTitle.jsx';

const VolumesList = ({
    homepageVolumes,
    hiddenVolumes,
    targetHref,
    state,
    lang,
    className,
}) => {
    const [hiddenListHeightVolume, setHiddenListHeightVolume] = useState(0);
    const [accordionOffsetY, setAccordionOffsetY] = useState(0); // Décalage causé par l'accordéon
    const [isSlugPage, setIsSlugPage] = useState(false);
    const [firstRender, setFirstRender] = useState(false);

    const [activeVolumeSlug, setActiveVolumeSlug] = useState(null);

    const renderedCount = useRef(0); // compteur de composants montés
    const [allRendered, setAllRendered] = useState(false); // état déclencheur
    const previousHeightRef = useRef(null); // hauteur précédente

    const [tailwindSlideTrans, settailwindSlideTrans] = useState(true);

    const [translateYValue, settranslateYValue] = useState('-200vh');
    const [translateXValue, settranslateXValue] = useState('0px');
    const [maxWidthValue, setMaxWidthValue] = useState('initial');
    const [maxHeightValue, setMaxHeightValue] = useState('initial');
    const [isOnVolumePage, setIsOnVolumePage] = useState(false);
    const [isOnIndexPage, setIsOnIndexPage] = useState(false);

    // •••  Hidden title list onSlugPage •••
    // Extrait le slug d’un volume à partir de l’URL
    const extractSlugFromUrl = (url) => {
        const match = url.match(/\/volume\/([^/]+)/);
        return match ? match[1] : null;
    };

    // Met à jour le slug actif lorsque l'URL change
    useEffect(() => {
        const slug = extractSlugFromUrl(targetHref);
        setActiveVolumeSlug(slug);
    }, [targetHref]);




    // ••• Création du lien de superposition •••
    const createOverlayLinks = (title, lang) => {
        const finalCoordinates = title.parentElement.getBoundingClientRect();
        const container = document.getElementById('floating-title-container');
        if (container) {
            // Supprimer les anciens liens de superposition
            const existingOverlay =
                container.querySelector('#title-on-display');
            if (existingOverlay) {
                existingOverlay.remove();
            }

            const titleElement = document.createElement('a');
            titleElement.id = 'title-on-display';
            titleElement.href = `/${lang}/volume/`;
            titleElement.className = 'fixed bg-blue-800 opacity-50 z-[1000]';
            Object.assign(titleElement.style, {
                top: `${finalCoordinates.top + window.scrollY}px`,
                left: `${finalCoordinates.left + window.scrollX}px`,
                width: `${finalCoordinates.width}px`,
                height: `${finalCoordinates.height}px`,
                cursor: 'pointer',
            });
            container.appendChild(titleElement);
        }
    };

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

    // ••• Effet pour la hauteur de la liste cachée •••
    // 1. Met à jour la hauteur quand tout est rendu ou la langue change


    // Effet pour mettre à jour la hauteur
    useEffect(() => {
        if (allRendered) {
            const hiddenList = document.querySelector('.hidden-list-volume');
            if (hiddenList) {
                const height = hiddenList.getBoundingClientRect().height;
                setHiddenListHeightVolume(height);
            }
        }
    }, [allRendered, lang]);

    useEffect(() => {

        // Title animation
        const titleLayout = () => {
            const title = document.querySelectorAll('li.volume-title a');
            title.forEach((title) => {
                if (title.getAttribute('href') === targetHref) {
                    title.parentElement.classList.add('active');

                    const spans = title.querySelectorAll('span');
                    const lastSpan = spans[spans.length - 1];

                    lastSpan.addEventListener(
                        'transitionend',
                        () => {
                            createOverlayLinks(title, lang);
                        },
                        { once: true }
                    );
                } else {
                    title.parentElement.classList.remove('active');
                }
            });
        };

        titleLayout();
    }, [targetHref, lang]);

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


    const toggleListDisplay = (category, accordionY) => {
        if (state == category) {
            settailwindSlideTrans(true);
            setFirstRender(false);
            settranslateYValue(accordionY + 'px');
            if (document.getElementById('floating-title-container')) {
                document.getElementById('floating-title-container').style.transform = `translateY(${accordionY}px)`;
            }
            setIsOnVolumePage(true);
            setIsOnIndexPage(false);
            if (window.innerWidth < 768) {
                setMaxHeightValue('initial');
                setTimeout(() => {
                    settranslateXValue('0px');
                    setMaxWidthValue('100vw');
                }, 400);
            }
        } else if (state == 'home') {
            setFirstRender(true);
            setIsOnIndexPage(true);
            setIsOnVolumePage(false);
            if (window.innerWidth < 768) {
                settranslateYValue('0px');
                settranslateXValue('50vw');
                setMaxWidthValue('0px');
                setMaxHeightValue('0px');
            } else {
                const targetY = `-${hiddenListHeightVolume}px`;
                settranslateYValue(targetY);
            }
        } else {
            settailwindSlideTrans(true);
            setFirstRender(false);
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
        const isOnSlugPage = document
            .querySelector('body')
            .classList.contains('on-slug-page');
        setIsSlugPage(isOnSlugPage);
        toggleListDisplay('volume', accordionOffsetY);
    }, [targetHref, hiddenListHeightVolume, accordionOffsetY]);

    // Effet pour le redimensionnement
    useEffect(() => {
        const handleResize = () => {
            const titles = document.querySelectorAll('li.volume-title a');
            titles.forEach((title) => {
                if (title.getAttribute('href') === targetHref) {
                    createOverlayLinks(title, lang);
                }
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [lang, targetHref]);

    // Remove transition anim on langSwitch
    useEffect(() => {
        if (state == 'home' && firstRender) {
            settailwindSlideTrans(false);
        } else {
            settailwindSlideTrans(true);
        }
    }, [lang]);

    // Render
    return (
        <>
            <div
                className={`work-list volume-list-wrapper w-[700px] border ${tailwindSlideTrans ? 'transition-[transform] delay-[0.2s] duration-500 ease-in-out' : ''}  ${className} ${isOnIndexPage ? 'pointer-events-auto cursor-pointer' : 'w-full'} ${isSlugPage ? 'pointer-events-none' : ''} `}
                style={{
                    transform: `translate(${translateXValue}, ${translateYValue})`,
                }}
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
                    className={`max-md:transition-[max-width] max-md:duration-1000 max-md:ease-in-out ${isOnVolumePage ? '' : 'pointer-events-none'}`}
                    style={{
                        maxWidth: `${maxWidthValue}`,
                        maxHeight: `${maxHeightValue}`,
                    }}
                >
                    <div
                        className={`pt-body-p-y max-md:w-[calc(100vw-40px)]`}

                    >
                        <div
                            className={`hidden-list-volume transition-all delay-[0.2s] duration-500 ease-in-out`}
                        >
                            {/* Liste Hidden */}
                            <ul className='volume-list-compact flex flex-wrap justify-center md:gap-y-[25px] md:pb-[25px]'>

                                {hiddenVolumes.map((volume) => (
                                    <li
                                        className={`volume-title block w-fit transition-opacity duration-500 ease-in-out ${
                                            activeVolumeSlug &&
                                            volume.slug !== activeVolumeSlug
                                                ? 'pointer-events-none opacity-0'
                                                : 'opacity-100'
                                        }`}
                                    >
                                        <VolumeTitle
                                            volume={volume}
                                            lang={lang}
                                            onMount={() => {
                                                // console.log('VolumeTitle monté', volume.id);
                                                renderedCount.current += 1;
                                                if (renderedCount.current === hiddenVolumes.length) {
                                                    setAllRendered(true);
                                                    // console.log('allRendered ====', allRendered);
                                                }
                                            }}
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
                                    className={`volume-title block w-fit transition-opacity duration-500 ease-in-out ${
                                        activeVolumeSlug &&
                                        volume.slug !== activeVolumeSlug
                                            ? 'pointer-events-none opacity-0'
                                            : 'opacity-100'
                                    }`}
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
