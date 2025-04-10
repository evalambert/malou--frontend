//src/layouts/projects-lists/PaintingsList.jsx

import { useEffect, useState } from 'react';
import { navigate } from 'astro:transitions/client';

import PaintingTitle from '../../components/common/title/PaintingTitle.jsx';

const PaintingsList = ({
    homepagePaintings,
    hiddenPaintings,
    targetHref,
    lang,
    className,
}) => {
    const [hiddenListHeightPainting, setHiddenListHeightPainting] = useState(0);
    const [accordionOffsetY, setAccordionOffsetY] = useState(0); // Décalage causé par l'accordéon

    useEffect(() => {


        // Title animation
        const titleLayout = () => {
            const title = document.querySelectorAll('li.painting-title a');
            title.forEach((title) => {
                if (title.getAttribute('href') === targetHref) {
                    title.parentElement.classList.add('active');
                    const spansLenght = title.querySelectorAll('span').length;
                    const firstSpanTranslateY = (spansLenght - 1) * 10;
                    const newTitleHeight =
                        firstSpanTranslateY + spansLenght * 10;
                    title.style.height = `${newTitleHeight}px`;
                    title.querySelectorAll('span').forEach((span, index) => {
                        const translateY = (spansLenght - 1 - index) * 15;
                        span.style.transform = `translateY(-${translateY}px)`;
                    });
                } else {
                    title.parentElement.classList.remove('active');
                    title.style.height = '32px';
                    title.querySelectorAll('span').forEach((span) => {
                        span.style.transform = 'translateY(0)';
                    });
                }
            });
            // Attendre que l'animation de transition soit terminée (500ms selon votre CSS)
            setTimeout(calculateLayout, 500);
        };

        // Layout
        const calculateLayout = () => {
            const liTitle = document.querySelectorAll('li.painting-title');
            let previousLiWidth = 0;


            liTitle.forEach((li) => {
                const viewportWidth = window.matchMedia('(min-width: 48rem)')
                    .matches
                    ? window.innerWidth - 180 // 150px = md:left-[150px] on item bellow
                    : window.innerWidth - 30; // --spacing-main-x-mobile (x2)
                if (previousLiWidth + li.offsetWidth > viewportWidth) {
                    let maxMarginLeft = viewportWidth - li.offsetWidth;
                    li.style.marginLeft = `${maxMarginLeft}px`;
                } else {
                    li.style.marginLeft = `${previousLiWidth}px`;
                    previousLiWidth = previousLiWidth + li.offsetWidth;
                    return previousLiWidth;
                }
            });

            // Afficher la hauteur de la liste cachée
            const hiddenListHeightPaintingValue = document.querySelector(
                '.hidden-list-painting'
            ).clientHeight;

            setHiddenListHeightPainting(hiddenListHeightPaintingValue);
        };

        // Initial calculation
        titleLayout();
        setTimeout(calculateLayout, 100);

        // Add resize event listener
        window.addEventListener('resize', calculateLayout);

        // Cleanup
        return () => window.removeEventListener('resize', calculateLayout);
    }, [homepagePaintings, hiddenPaintings]);

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
    const [translateValue, setTranslateValue] = useState('100vh');
    const [maxHeightValue, setmaxHeightValue] = useState('0px');
    const [isOnPaintingPage, setIsOnPaintingPage] = useState(false);
    const [isOnIndexPage, setIsOnIndexPage] = useState(false);

    const toggleListDisplay = (url, category, accordionY) => {
        if (url.includes(category)) {
            setTranslateValue(accordionY + 'px');
            setIsOnPaintingPage(true);
            setIsOnIndexPage(false);
            if (window.innerWidth < 768) {
                setmaxHeightValue('300vh');
            }
        } else if (url == '/fr/' || url == '/en/') {
            if (window.innerWidth < 768) {
                setTranslateValue('100vh');
                setmaxHeightValue('0px');
            } else {
                setTranslateValue(hiddenListHeightPainting + 'px');
                setmaxHeightValue('300vh');
            }
            setIsOnIndexPage(true);
            setIsOnPaintingPage(false);
        } else {
            setTranslateValue('100vh');
            setIsOnPaintingPage(false);
            setIsOnIndexPage(false);
        }
    };

    useEffect(() => {
        toggleListDisplay(targetHref, 'painting', accordionOffsetY);
    }, [targetHref, hiddenListHeightPainting, accordionOffsetY]);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Render
    return (
        <>
            {/* ! md:left-[100px] modify, change value const viewportWidth above */}
            <div
                className={`work-list painting-list-wrapper pb-body-p-y fixed bottom-0 transition-all delay-[0.2s] duration-500 ease-in-out ${className} ${isOnIndexPage ? 'pointer-events-auto cursor-pointer' : ''} ${!isOnPaintingPage && !isOnIndexPage ? 'pointer-events-none' : ''} `}
                onClick={
                    !isOnPaintingPage
                        ? () =>
                            navigate(`/${lang}/painting/`, {
                                history: 'push',
                            })
                        : undefined
                }
            >
                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${!isOnPaintingPage ? 'pointer-events-none' : ''}`}
                    style={{
                        transform: `translateY(${translateValue})`,
                        maxHeight: `${maxHeightValue}`,
                    }}
                >
                    {/* Liste Homepage */}
                    <ul className='painting-list-compact transition-all duration-500 ease-in-out'>
                        {homepagePaintings.map((painting) => (
                            <li
                                className='painting-title w-fit'
                                key={painting.id}
                            >
                                <PaintingTitle
                                    painting={painting}
                                    lang={lang}
                                />
                            </li>
                        ))}
                    </ul>
                    {/* (END) Liste Homepage */}

                    <div
                        className={`hidden-list-painting overflow-hidden transition-all delay-[0.2s] duration-500 ease-in-out`}
                    >
                        {/* Liste Hidden */}
                        <ul>
                            {hiddenPaintings.map((painting) => (
                                <li
                                    className='painting-title block w-fit'
                                    key={painting.id}
                                >
                                    <PaintingTitle
                                        painting={painting}
                                        lang={lang}
                                    />
                                </li>
                            ))}
                        </ul>
                        {/* (END) Liste Hidden */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaintingsList;
