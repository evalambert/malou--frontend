//src/layouts/projects-lists/PaintingsList.jsx

import { useEffect, useState } from 'react';
import { navigate } from 'astro:transitions/client';

import PaintingTitle from '../../components/common/title/PaintingTitle.jsx';

const PaintingsList = ({
    homepagePaintings,
    hiddenPaintings,
    targetHref,
    state,
    lang,
    className,
}) => {
    const [hiddenListHeightPainting, setHiddenListHeightPainting] = useState(0);
    const [accordionOffsetY, setAccordionOffsetY] = useState(0); // Décalage causé par l'accordéon
    const [activePaintingSlug, setActivePaintingSlug] = useState(null);
    const [isSlugPage, setIsSlugPage] = useState(false);

    // Fonction pour extraire le slug de l'URL
    const extractSlugFromUrl = (url) => {
        const match = url.match(/\/painting\/([^/]+)/);
        return match ? match[1] : null;
    };

    // Title animation
    const titleLayout = () => {
        const title = document.querySelectorAll('li.painting-title a');
        title.forEach((title) => {
            if (title.getAttribute('href') === targetHref) {
                title.parentElement.classList.add('active');
                const spansLenght = title.querySelectorAll('span').length;
                const firstSpanTranslateY = (spansLenght - 1) * 10;
                const newTitleHeight = firstSpanTranslateY + spansLenght * 10;
                title.style.height = `${newTitleHeight}px`;
                setTimeout(() => {
                    const titleSpan = title.querySelectorAll('span');
                    titleSpan.forEach((span, index) => {
                        const translateY = (spansLenght - 1 - index) * 15;
                        span.style.transform = `translateY(-${translateY}px)`;
                    });
                }, 300);
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

    // Effet pour mettre à jour la peinture active basée sur l'URL
    useEffect(() => {
        const slug = extractSlugFromUrl(targetHref);
        setActivePaintingSlug(slug);
    }, [targetHref]);

    useEffect(() => {
        const calculateLayout = () => {
            const liTitle = document.querySelectorAll('li.painting-title');
            let previousLiWidth = 150;
            let reverse = false;

            liTitle.forEach((li) => {
                const viewportWidth = window.matchMedia('(min-width: 48rem)')
                    .matches
                    ? window.innerWidth - 30
                    : window.innerWidth - 30;

                if (
                    previousLiWidth + li.offsetWidth > viewportWidth &&
                    !reverse
                ) {
                    let maxMarginLeft = viewportWidth - li.offsetWidth;
                    li.style.marginLeft = `${maxMarginLeft}px`;
                    previousLiWidth = viewportWidth - li.offsetWidth;
                    reverse = true;
                    return previousLiWidth;

                    // DESCEND VERS LA GAUCHE
                } else if (previousLiWidth < 200 && reverse) {
                    li.style.marginLeft = `0px`;
                    previousLiWidth = li.offsetWidth;
                    reverse = false;
                } else if (reverse) {
                    previousLiWidth = previousLiWidth - li.offsetWidth;
                    li.style.marginLeft = `${previousLiWidth}px`;
                    return previousLiWidth;

                    // DESCEND VERS LA DROITE
                } else {
                    li.style.marginLeft = `${previousLiWidth}px`;
                    previousLiWidth = previousLiWidth + li.offsetWidth;
                    return previousLiWidth;
                }
            });

            const hiddenListHeightPaintingValue = document.querySelector(
                '.hidden-list-painting'
            ).clientHeight;

            setHiddenListHeightPainting(hiddenListHeightPaintingValue);
        };

        // Initial calculation
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
    const [sortedHiddenPaintings, setSortedHiddenPaintings] = useState([]);

    const toggleListDisplay = (category, accordionY) => {
        if (state == category) {
            setTranslateValue(accordionY + 'px');
            setIsOnPaintingPage(true);
            setIsOnIndexPage(false);
            setmaxHeightValue('100vh');
            if (window.innerWidth < 768) {
                setmaxHeightValue('300vh');
            }
        } else if (state == 'home') {
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
        const isOnSlugPage = document.querySelector('body').classList.contains('on-slug-page');
        setIsSlugPage(isOnSlugPage);
        toggleListDisplay('painting', accordionOffsetY);
    }, [targetHref, hiddenListHeightPainting, accordionOffsetY]);



    // sort hidden paintings by visual width
    useEffect(() => {
        const container = document.createElement('div');
        container.style.visibility = 'hidden';
        container.style.position = 'absolute';
        container.style.whiteSpace = 'nowrap';
        document.body.appendChild(container);

        const sorted = [...hiddenPaintings]
            .map((p) => {
                const span = document.createElement('span');
                span.textContent = p.title;
                container.appendChild(span);
                const width = span.getBoundingClientRect().width;
                container.removeChild(span);
                return { ...p, visualWidth: width };
            })
            .sort((a, b) => a.visualWidth - b.visualWidth); // ordre croissant

        document.body.removeChild(container);

        setSortedHiddenPaintings(sorted);
    }, [hiddenPaintings]);


    // ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
    // console.log('hello <:-° status dans painting list', state);
    // ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Render
    return (
        <>
            {/* ! md:left-[100px] modify, change value const viewportWidth above */}
            <div
                className={`work-list painting-list-wrapper ${className} ${isOnIndexPage ? 'pointer-events-auto cursor-pointer' : ''} overflow-visible ${isSlugPage ? 'pointer-events-none' : 'md:overflow-scroll'}`}
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
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${!isOnPaintingPage ? 'pointer-events-none' : ''} overflow-scroll`}
                    style={{
                        transform: `translateY(${translateValue})`,
                        maxHeight: `${maxHeightValue}`,
                    }}
                >
                    {/* Liste Homepage */}
                    <ul className='painting-list-compact transition-all duration-500 ease-in-out'>
                        {homepagePaintings.map((painting) => {
                            const slug = painting.slug;
                            const isActive = slug === activePaintingSlug;

                            return (
                                <li
                                    className='painting-title w-fit !overflow-visible'
                                    key={painting.id}
                                >
                                    <PaintingTitle
                                        painting={painting}
                                        lang={lang}
                                        isActive={isActive}
                                        accordionOffsetY={accordionOffsetY}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                    {/* (END) Liste Homepage */}

                    <div
                        className={`hidden-list-painting overflow-hidden transition-all delay-[0.2s] duration-500 ease-in-out`}
                    >
                        {/* Liste Hidden */}
                        <ul>
                            {sortedHiddenPaintings.map((painting) => {
                                const slug = painting.slug;
                                const isActive = slug === activePaintingSlug;

                                return (
                                    <li
                                        className='painting-title block w-fit'
                                        key={painting.id}
                                    >
                                        <PaintingTitle
                                            painting={painting}
                                            lang={lang}
                                            isActive={isActive}
                                            accordionOffsetY={accordionOffsetY}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                        {/* (END) Liste Hidden */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaintingsList;
