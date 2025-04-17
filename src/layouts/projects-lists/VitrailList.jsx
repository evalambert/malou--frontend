import { useEffect, useState, useCallback } from 'react';
import { navigate } from 'astro:transitions/client';

import VitrailHiddenTitle from '../../components/common/title/VitrailHiddenTitle.jsx';
import VitrailHomepageTitle from '../../components/common/title/VitrailHomepageTitle.jsx';

const VitrailList = ({
    homepageVitraux,
    hiddenVitraux,
    targetHref,
    lang,
    className,
}) => {
    const [hiddenListHeightVitrail, setHiddenListHeightVitrail] = useState(0);
    const [activeHref, setActiveHref] = useState(null);
    const [isSlugPage, setIsSlugPage] = useState(false);

    // ••• Creation du liens de superposition •••
    const createOverlayLinks = (wordWrappers, lang) => {
        const container = document.getElementById('floating-title-container');
        if (container) {
            // Supprimer les anciens liens de superposition
            const existingOverlays = container.querySelectorAll('.title-on-display');
            existingOverlays.forEach(overlay => overlay.remove());

            // Créer les nouveaux liens
            wordWrappers.forEach((wrapper) => {
                const wrapperRect = wrapper.getBoundingClientRect();
                const overlayLink = document.createElement('a');
                
                overlayLink.href = `/${lang}/vitrail/`;
                overlayLink.className = 'title-on-display bg-blue-800 opacity-[0.5]';
                overlayLink.style.position = 'fixed';
                overlayLink.style.top = `${wrapperRect.top}px`;
                overlayLink.style.left = `${wrapperRect.left}px`;
                overlayLink.style.width = `16px`;
                overlayLink.style.height = `${wrapperRect.height}px`;
                overlayLink.style.zIndex = '1000';
                
                container.appendChild(overlayLink);
            });
        }
    };
    
    // ••• Animation d'ouverture du titre •••
    const openAnimation = (targetTitle) => {

        const wordWrappers = targetTitle.querySelectorAll('.vitrail-word-wrapper > div');

        wordWrappers.forEach((wrapper, wrapperIndex) => {
            const wordWrapperSpan = wrapper.querySelectorAll('span');
            const wordWrapSpanLength = wordWrapperSpan.length;

            wrapper.parentElement.classList.add('active');
            wrapper.style.transition = 'all 0.5s ease-in-out';
            wrapper.style.transitionDelay = `${wrapperIndex * 0.3}s`;
            wrapper.style.height = `${wordWrapSpanLength * 25}px`;

            const firstSpan = wordWrapperSpan[0];
            const firstWidth = firstSpan.offsetWidth;

            wrapper.parentElement.style.width = `${firstWidth * wordWrapSpanLength + 10}px`;

            wordWrapperSpan.forEach((span, index) => {
                span.style.width = `${firstWidth}px`;
                span.style.transition = 'all 0.5s ease-in-out';
                span.style.transitionDelay = `${wrapperIndex * 0.3}s`;
                span.style.transform = `translate(-${index * firstWidth}px, ${index * 25}px)`;

                span.addEventListener('transitionend', () => {
                    if (index === wordWrapperSpan.length - 1 && wrapperIndex === wordWrappers.length - 1) {
                        setTimeout(() => {
                            createOverlayLinks(wordWrappers, lang);
                        }, 50);
                    }
                }, { once: true });
            });
        });
    };

    // ••• Animation de fermeture du titre •••
    const closeAnimation = (targetTitle) => {
        const wordWrappers = targetTitle.querySelectorAll(
            '.vitrail-word-wrapper > div'
        );

        wordWrappers.forEach((wrapper, wrapperIndex) => {
            const wordWrapperSpan = wrapper.querySelectorAll('span');

            // Animation inverse
            wrapper.style.transition = 'all 0.5s ease-in-out';
            wrapper.style.transitionDelay = `${wrapperIndex * 0.3}s`;
            wrapper.style.height = '0px';

            wrapper.parentElement.style.width = `fit-content`;

            wordWrapperSpan.forEach((span, index) => {
                span.style.transition = 'all 0.5s ease-in-out';
                span.style.width = `fit-content`;
                span.style.transitionDelay = `${wrapperIndex * 0.3}s`;
                span.style.transform = 'translate(0, 0)';
            });
        });
    };

    // ••• Fonction titleLayout mémorisée •••
    const titleLayout = useCallback(() => {
        const isOnSlugPage = document.querySelector('body').classList.contains('on-slug-page');
        setIsSlugPage(isOnSlugPage);

        if (isOnSlugPage) {
            setActiveHref(targetHref);
        } else {
            setActiveHref(null);
        }
    }, [targetHref]);

    // Effet pour les animations basées sur les états
    useEffect(() => {
        const title = document.querySelectorAll('li.vitrail-title a');

        title.forEach((titleElement) => {
            const titleHref = titleElement.getAttribute('href');

            if (isSlugPage && titleHref === activeHref) {
                openAnimation(titleElement);
            } else {
                if (titleElement.children[0].classList.contains('active')) {
                    closeAnimation(titleElement);
                }
            }
        });

    }, [isSlugPage, activeHref]);

    // Effet pour les event listeners
    useEffect(() => {
        titleLayout();

        window.addEventListener('resize', titleLayout);
        document.addEventListener('astro:after-swap', titleLayout);

        return () => {
            window.removeEventListener('resize', titleLayout);
            document.removeEventListener('astro:after-swap', titleLayout);
        };
    }, [titleLayout]);

    // Effet pour la hauteur de la liste cachée
    useEffect(() => {
        const timer = setTimeout(() => {
            const hiddenList = document.querySelector('.hidden-list-vitrail');
            if (hiddenList) {
                const height = hiddenList.clientHeight;
                setHiddenListHeightVitrail(height);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [homepageVitraux, hiddenVitraux]);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Toogle hidden/compact/full
    const [translateYValue, settranslateYValue] = useState('-200vh');
    const [translateXValue, settranslateXValue] = useState('0px');
    const [maxWidthValue, setMaxWidthValue] = useState('initial');
    const [maxHeightValue, setMaxHeightValue] = useState('initial');
    const [isOnVitrailPage, setIsOnVitrailPage] = useState(false);
    const [isOnIndexPage, setIsOnIndexPage] = useState(false);
    const [sortedHiddenVitraux, setSortedHiddenVitraux] = useState([]);

    const toggleListDisplay = (url, category) => {
        if (url.includes(category)) {
            settranslateYValue('0px');
            setIsOnVitrailPage(true);
            setIsOnIndexPage(false);
            if (window.innerWidth < 768) {
                setMaxHeightValue('initial');
                setTimeout(() => {
                    settranslateXValue('0px');
                    setMaxWidthValue('100vw');
                }, 400);
            }
        } else if (url == '/fr/' || url == '/en/') {
            setIsOnVitrailPage(false);
            setIsOnIndexPage(true);
            if (window.innerWidth < 768) {
                settranslateYValue('0px');
                settranslateXValue('50vw');
                setMaxWidthValue('0px');
                setMaxHeightValue('0px');
            } else {
                settranslateYValue('-' + hiddenListHeightVitrail + 'px');
            }
        } else {
            setIsOnVitrailPage(false);
            setIsOnIndexPage(false);
            if (window.innerWidth < 768) {
                setMaxWidthValue('0px');
                setMaxHeightValue('0px');
                settranslateXValue('50vw');
            } else {
                settranslateYValue('-200vh');
            }
        }
    };

    useEffect(() => {
        toggleListDisplay(targetHref, 'vitrail');
    }, [targetHref, hiddenListHeightVitrail]);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // * END * Toogle hidden/compact/full

    /* --- Sort hiddenVitraux by visual width  --- */
    useEffect(() => {
        // Crée un container invisible
        const container = document.createElement('div');
        container.style.visibility = 'hidden';
        container.style.position = 'absolute';
        container.style.whiteSpace = 'nowrap';
        document.body.appendChild(container);

        // Calcule la largeur réelle de chaque titre
        const sorted = [...hiddenVitraux]
            .map((v) => {
                const span = document.createElement('span');
                span.textContent = v.title;
                container.appendChild(span);
                const width = span.getBoundingClientRect().width;
                container.removeChild(span);
                return { ...v, visualWidth: width };
            })
            .sort((a, b) => b.visualWidth - a.visualWidth);

        // Nettoie le container temporaire
        document.body.removeChild(container);

        // Stocke la liste triée
        setSortedHiddenVitraux(sorted);
    }, [hiddenVitraux]);

    // Ajouter un gestionnaire de redimensionnement
    useEffect(() => {
        const handleResize = () => {
            const activeTitle = document.querySelector('.vitrail-word-wrapper.active');
            if (activeTitle) {
                const wordWrappers = activeTitle.parentElement.querySelectorAll('.vitrail-word-wrapper > div');
                createOverlayLinks(wordWrappers, lang);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [lang]);

    // Render
    return (
        <>
            <div
                className={`work-list vitrail-list-wrapper max-md:relative max-md:top-[70vh] max-md:flex max-md:flex-col max-md:items-end ${className} ${isOnIndexPage ? 'pointer-events-auto cursor-pointer' : ''} ${!isOnVitrailPage && !isOnIndexPage ? 'pointer-events-none' : ''} ${isSlugPage ? 'pointer-events-none' : ''}`}
            >
                <div
                    className={`flex flex-col items-end max-md:overflow-hidden max-md:transition-[max-width] max-md:duration-1000 max-md:ease-in-out ${!isOnVitrailPage ? 'cursor-pointer' : ''
                        } `}
                    onClick={
                        !isOnVitrailPage
                            ? () =>
                                navigate(`/${lang}/vitrail/`, {
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
                        className={`pt-body-p-y flex flex-col items-end transition-all duration-1000 ease-in-out ${!isOnVitrailPage ? 'pointer-events-none' : ''}`}
                        style={{
                            transform: `translate(${translateXValue}, ${translateYValue})`,
                        }}
                    >
                        <div
                            className={`hidden-list-vitrail flex flex-col items-end transition-all delay-[0.2s] duration-1000 ease-in-out max-md:order-2 ${isOnVitrailPage ? 'opacity-100' : 'md:opacity-0'
                                } `}
                        >
                            {/* Liste Hidden */}
                            <ul className='vitrail-list-compact overflow-visible'>
                                {sortedHiddenVitraux.map((vitrail) => (
                                    <li
                                        className='vitrail-title ml-auto block w-fit !overflow-visible text-right transition-all duration-100'
                                        key={vitrail.id}
                                    >
                                        <VitrailHiddenTitle
                                            vitrail={vitrail}
                                            lang={lang}
                                        />
                                    </li>
                                ))}
                            </ul>
                            {/* (END) Liste Hidden */}
                        </div>

                        {/* Liste Homepage */}
                        <ul className='vitrail-list-compact max-md:order-1'>
                            {homepageVitraux.map((vitrail) => (
                                <li
                                    className='vitrail-title ml-auto block w-fit !overflow-visible text-right transition-all duration-300'
                                    key={vitrail.id}
                                >
                                    <VitrailHomepageTitle
                                        vitrail={vitrail}
                                        lang={lang}
                                    />
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

export default VitrailList;
