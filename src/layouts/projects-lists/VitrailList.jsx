import { useEffect, useRef, useState, useCallback } from 'react';
import { navigate } from 'astro:transitions/client';
import { gsap } from 'gsap';

import VitrailHiddenTitle from '../../components/common/title/VitrailHiddenTitle.jsx';
import VitrailHomepageTitle from '../../components/common/title/VitrailHomepageTitle.jsx';

const VitrailList = ({
    homepageVitraux,
    hiddenVitraux,
    state,
    targetHref,
    lang,
    className,
}) => {
    const [hiddenListHeightVitrail, setHiddenListHeightVitrail] = useState(0);
    const [accordionOffsetY, setAccordionOffsetY] = useState(0); // Décalage causé par l'accordéon
    const [activeHref, setActiveHref] = useState(null);
    const [isSlugPage, setIsSlugPage] = useState(false);
    const [firstRender, setFirstRender] = useState(false);

    const renderedCount = useRef(0); // compteur de composants montés
    const [allRendered, setAllRendered] = useState(false); // état déclencheur
    const previousHeightRef = useRef(null); // hauteur précédente

    const [translateYValue, settranslateYValue] = useState('-200vh');
    // const [translateYValue, settranslateYValue] = useState('-' + hiddenListHeightVitrail + 'px');
    const [translateXValue, settranslateXValue] = useState('0px');
    const [maxWidthValue, setMaxWidthValue] = useState('initial');
    const [maxHeightValue, setMaxHeightValue] = useState('initial');
    const [isOnVitrailPage, setIsOnVitrailPage] = useState(false);
    const [isOnIndexPage, setIsOnIndexPage] = useState(false);
    const [sortedHiddenVitraux, setSortedHiddenVitraux] = useState([]);

    const [tailwindSlideTrans, settailwindSlideTrans] = useState(true);

    const [activeVitrailSlug, setActiveVitrailSlug] = useState(null);

    // •••  Hidden title list onSlugPage •••
    // Extrait le slug d'un vitrial à partir de l'URL
    const extractSlugFromUrl = (url) => {
        const match = url.match(/\/vitrail\/([^/]+)/);
        return match ? match[1] : null;
    };
    // Met à jour le slug actif lorsque l'URL change
    useEffect(() => {
        const slug = extractSlugFromUrl(targetHref);
        setActiveVitrailSlug(slug);
    }, [targetHref]);

    // ••• Creation du liens de superposition •••
    const createOverlayLinks = (wordWrappers, lang) => {
        const container = document.getElementById('floating-title-container');
        if (container) {
            // Supprimer les anciens liens de superposition
            const existingOverlays =
                container.querySelectorAll('.title-on-display');
            existingOverlays.forEach((overlay) => overlay.remove());

            // Créer les nouveaux liens
            wordWrappers.forEach((wrapper) => {
                const wrapperRect = wrapper.getBoundingClientRect();
                const overlayLink = document.createElement('a');

                overlayLink.href = `/${lang}/vitrail/`;
                overlayLink.className =
                    'title-on-display bg-blue-800 opacity-[0.5]';
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
        const wordWrappers = targetTitle.querySelectorAll(
            '.vitrail-word-wrapper > div'
        );

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

                span.addEventListener(
                    'transitionend',
                    () => {
                        if (
                            index === wordWrapperSpan.length - 1 &&
                            wrapperIndex === wordWrappers.length - 1
                        ) {
                            setTimeout(() => {
                                createOverlayLinks(wordWrappers, lang);
                            }, 50);
                        }
                    },
                    { once: true }
                );
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
        const isOnSlugPage = document
            .querySelector('body')
            .classList.contains('on-slug-page');
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

    // ••• Effet pour la hauteur de la liste cachée •••
    // 1. Met à jour la hauteur quand tout est rendu ou la langue change
    useEffect(() => {
        renderedCount.current = 0;
        setAllRendered(false);
        // Garde la hauteur précédente pendant le re-rendu
        previousHeightRef.current = hiddenListHeightVitrail;
    }, [lang]);

    // Effet pour mettre à jour la hauteur
    useEffect(() => {
        if (allRendered) {
            const hiddenList = document.querySelector('.hidden-list-vitrail');
            if (hiddenList) {
                const height = hiddenList.getBoundingClientRect().height;
                setHiddenListHeightVitrail(height);
            }
        } else {
            // Utilise la hauteur précédente pendant le re-rendu
            if (previousHeightRef.current !== null) {
                setHiddenListHeightVitrail(previousHeightRef.current);
            }
        }
    }, [allRendered, lang]);

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
            // ••• CATEGORY •••

            setIsOnVitrailPage(true);
            setIsOnIndexPage(false);
            if (window.innerWidth < 768) {
                setMaxHeightValue('initial');
                setTimeout(() => {
                    // settranslateXValue('0px');
                    setMaxWidthValue('100vw');
                }, 400);
            } else {
                settranslateYValue(accordionY + 'px');
                if (document.getElementById('floating-title-container')) {
                    document.getElementById(
                        'floating-title-container'
                    ).style.transform = `translateY(${accordionY}px)`;
                }
            }
        } else if (state == 'home') {
            // ••• HOMEPAGE •••
            setIsOnVitrailPage(false);
            setIsOnIndexPage(true);
            setFirstRender(true);
            if (window.innerWidth < 768) {
                // mobile
                settranslateYValue('0px');
                setMaxWidthValue('100vw');
                setMaxHeightValue('100vh');
                //settranslateXValue('50vw');
                //setMaxWidthValue('0px');
                //setMaxHeightValue('0px');
            } else {
                const targetY = `-${hiddenListHeightVitrail || previousHeightRef.current}px`;
                settranslateYValue(targetY);
                // -> Le problème venait du fait que l'animation GSAP utilisait la valeur de translateYValue qui n'était pas encore mise à jour au moment de l'animation, à cause de la nature asynchrone des mises à jour d'état dans React.
                // -> En utilisant directement la valeur calculée (targetY), nous nous assurons que GSAP utilise la bonne valeur immédiatement, sans dépendre de la mise à jour d'état de React.
                // const targetY = `-${hiddenListHeightVitrail}px`;
                // gsap.fromTo('.vitrail-list--slide-wrapper',
                //     {
                //         y: '-200vh'
                //     },
                //     {
                //         y: targetY,
                //         duration: 0.8,
                //         ease: "power2.out",
                //     }
                // );
            }
        } else {
            // ••• HIDDEN •••
            setIsOnVitrailPage(false);
            setIsOnIndexPage(false);
            if (window.innerWidth < 768) {
                settranslateYValue('0px');
                setMaxWidthValue('0vw');
                setMaxHeightValue('100vh');
            } else {
                settranslateYValue('-200vh');
            }
        }
    };

    useEffect(() => {
        if (allRendered) {
            const isOnSlugPage = document
                .querySelector('body')
                .classList.contains('on-slug-page');
            setIsSlugPage(isOnSlugPage);
            toggleListDisplay('vitrail', accordionOffsetY);
        }
    }, [allRendered, targetHref, hiddenListHeightVitrail, accordionOffsetY]);

    useEffect(() => {
        if (state == 'home' && firstRender) {
            settailwindSlideTrans(false);
        }
    }, [lang]);
    // useEffect(() => {
    //     if (state == 'home' && firstRender){
    //         setTimeout(() => {
    //             settailwindSlideTrans(true);
    //             const targetY = `-${hiddenListHeightVitrail || previousHeightRef.current}px`;
    //             settranslateYValue(targetY);
    //             console.log('changement de laaannnnngue' + translateYValue);
    //         }, 1000);
    //     }
    // }, [translateYValue]);

    // // ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
    // console.log('hello <:-° status dans vitrail list', state);
    // // ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
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
            const activeTitle = document.querySelector(
                '.vitrail-word-wrapper.active'
            );
            if (activeTitle) {
                const wordWrappers = activeTitle.parentElement.querySelectorAll(
                    '.vitrail-word-wrapper > div'
                );
                createOverlayLinks(wordWrappers, lang);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [lang]);

    // •••••••••••••••••••• ZONE CLICKABLE ON HOMEPAGE ••••••••••••••••••••
    const homepageRef = useRef(null);
    const wrapperRef = useRef(null);

    const [wrapperWidth, setWrapperWidth] = useState(null);

    useEffect(() => {
        if (!isOnVitrailPage && homepageRef.current) {
            const el = homepageRef.current;

            const updateWidth = () => {
                const width = el.getBoundingClientRect().width;
                if (width > 0) {
                    setWrapperWidth(`${width}px`);
                }
            };

            document.fonts.ready.then(() => {
                requestAnimationFrame(updateWidth);
            });

            const observer = new ResizeObserver(updateWidth);
            observer.observe(el);

            return () => observer.disconnect();
        }
    }, [isOnVitrailPage, homepageVitraux]);

    // •••••••••••••••••••• (END) ZONE CLICKABLE ON HOMEPAGE ••••••••••••••••••••

    // Render
    return (
        <div
            ref={wrapperRef}
            className={`work-list vitrail-list-wrapper ${tailwindSlideTrans ? 'transition-[transform] delay-[0.2s] duration-1000 ease-in-out' : ''} ${className} ${isOnIndexPage ? 'pointer-events-auto cursor-pointer' : 'w-full'} border border-green-500`}
            onClick={
                !isOnVitrailPage
                    ? () =>
                          navigate(`/${lang}/vitrail/`, {
                              history: 'push',
                          })
                    : undefined
            }
            style={{
                width: !isOnVitrailPage ? wrapperWidth : undefined,
                maxWidth: `${maxWidthValue}`,
                maxHeight: `${maxHeightValue}`,
                transform: `translate(${translateXValue}, ${translateYValue})`,
            }}
        >
            <div
                className={`flex flex-col items-end max-md:overflow-hidden max-md:transition-[max-width] max-md:duration-1000 max-md:ease-in-out ${isOnIndexPage ? 'cursor-pointer' : ''}${isSlugPage ? 'pointer-events-none' : ''}`}
            >
                <div
                    className={`flex flex-col items-end max-md:overflow-hidden max-md:transition-[max-width] max-md:duration-1000 max-md:ease-in-out ${
                        !isOnVitrailPage ? 'cursor-pointer' : ''
                    } `}
                    style={{
                        maxWidth: `${maxWidthValue}`,
                        maxHeight: `${maxHeightValue}`,
                    }}
                >
                    <div
                        className={`pt-body-p-y flex flex-col items-end transition-all duration-1000 ease-in-out ${!isOnVitrailPage ? 'pointer-events-none' : ''}`}
                    >
                        <div
                            className={`hidden-list-vitrail flex flex-col items-end transition-all delay-[0.2s] duration-1000 ease-in-out max-md:order-2 ${
                                isOnVitrailPage ? 'opacity-100' : 'md:opacity-0'
                            } `}
                        >
                            {/* Liste Hidden */}
                            <ul className='vitrail-list-compact overflow-visible'>
                                {sortedHiddenVitraux.map((vitrail) => {
                                    const isActive =
                                        vitrail.slug === activeVitrailSlug;

                                    return (
                                        <li
                                            className={`vitrail-title ml-auto block w-fit !overflow-visible text-right transition-all duration-300 ${
                                                activeVitrailSlug && !isActive
                                                    ? 'pointer-events-none opacity-0'
                                                    : 'opacity-100'
                                            }`}
                                            key={vitrail.id}
                                        >
                                            <VitrailHiddenTitle
                                                vitrail={vitrail}
                                                lang={lang}
                                                isActive={isActive}
                                                onMount={() => {
                                                    renderedCount.current += 1;
                                                    if (
                                                        renderedCount.current ===
                                                        sortedHiddenVitraux.length
                                                    ) {
                                                        setAllRendered(true);
                                                    }
                                                }}
                                            />
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* (END) Liste Hidden */}
                        </div>

                        {/* Liste Homepage */}
                        <ul
                            ref={homepageRef}
                            className='vitrail-list-compact border border-amber-500 max-md:order-1'
                        >
                            {homepageVitraux.map((vitrail) => {
                                const isActive =
                                    vitrail.slug === activeVitrailSlug;

                                return (
                                    <li
                                        className={`vitrail-title ml-auto block w-fit !overflow-visible text-right transition-all duration-300 ${
                                            activeVitrailSlug && !isActive
                                                ? 'pointer-events-none opacity-0'
                                                : 'opacity-100'
                                        }`}
                                        key={vitrail.id}
                                    >
                                        <VitrailHomepageTitle
                                            vitrail={vitrail}
                                            lang={lang}
                                            isActive={isActive}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                        {/* (END) Liste Homepage */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VitrailList;
