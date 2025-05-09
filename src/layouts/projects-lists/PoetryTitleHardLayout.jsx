// src/layouts/projects-lists/PoetryTitleHardLayout.jsx
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const PoetryTitleHardLayout = ({ lang, targetHref, state, isOnSlugPage }) => {
    // const [isOnPoetryPage, setIsOnPoetryPage] = useState(false);

    // •••••• Hidden (START) title onSlugPage ••••••
    const [activePoetrySlug, setActivePoetrySlug] = useState(null);
    // Extrait le slug d'un volume à partir de l'URL
    const extractSlugFromUrl = (url) => {
        const match = url.match(/\/poetry\/([^/]+)/);
        return match ? match[1] : null;
    };
    // Met à jour le slug actif lorsque l'URL change
    useEffect(() => {
        const slug = extractSlugFromUrl(targetHref);
        setActivePoetrySlug(slug);
    }, [targetHref]);

    useEffect(() => {
        console.log('[DEBUG] Slug actif poetry:', activePoetrySlug);
    }, [activePoetrySlug]);

    // •••••• (END) Hidden title onSlugPage ••••••

    // *(0__0)* useRef pour mémoriser les états
    const initialTextOverlaySerpent = useRef(null);
    const initialTextOverlayCoquille = useRef(null);
    const onCatTextOverlaySerpent = useRef(null);
    const onCatTextOverlayCoquille = useRef(null);

    // // Définition des constantes
    const pathSerpentIndex =
        'M1.5 0.5L17.5 38L22.5 71L17.5 103L8 134.5L4 197L11.5 231L13.5 294L15.5 325.5L8 357L1 391.5L10 421L13.5 455.5L23 484.5L16.5 547.5L10 582.5L16.5 614.5L32 646.5L46 707L58 741.5L46 772L16.5 833L3 867.5L18.5 900L34.5 932L58 965.5';
    const pathSerpentClose =
        'M1 1 L20.5 37.5 L38.5 69.0 L61 101.5 L79 136.5 L97 195.5 L106 229.5 L116 294.5 L110.5 325.0 L122.5 354.5 L122.5 391.0 L110.5 422.0 L116 453.5 L128 480.0 L131.5 551.5 L131.5 583.0 L128 614.5 L116 645.0 L110.5 708.5 L101.5 742.5 L110.5 770.0 L110.5 829.0 L128 864.0 L122 900.5 L116 931.5 L131.5 964.0';
    const pathSerpentOpen =
        'M1 1 L13 42 L39.5 64.5 L62 97 L80 132 L101 191.5 L107 225 L117 290 L111.5 320.5 L123.5 350 L123.5 386.5 L111.5 417.5 L117 449 L129 475.5 L129 547 L129 589.5 L147.5 619.5 L174 647 L235.5 662 L269 669 L299.5 666.5 L362 649.5 L396 619.5 L425 601.5 L450.5 577.5 L489.5 585';
    const pathCoquilleClose =
        'M1 1L9 35L15.5 66L13 132L5.5 163.5L5.5 197L15.5 226.5L26.5 257.5L18.5 288L9 320.5L21.5 355L15.5 389L6.5 451L15.5 482.5L30 547.5L40.5 581L40.5 613L26.5 677L9.5 708.5L12 742L21.5 770L32 804L42.5 835.5';
    const pathCoquilleOpen =
        'M1 1L9 35L15.5 66L13 132L5.5 163.5L5.5 197L15.5 226.5L26.5 257.5L18.5 288L9 320.5L21.5 355L15.5 389L13.5 453L32 478L52 536L70.5 564.5L95 579L156.5 579L187.5 572L217.5 564.5L238.5 536L254.5 497L284 487.5';

    useEffect(() => {
        const hardWrapper = document.querySelector('.hard-layout--wrapper');
        const pathSerpent = document.getElementById(
            'myPath-hard-layout-serpent'
        );
        const pathCoquille = document.getElementById(
            'myPath-hard-layout-coquille'
        );
        const textOverlaySerpent = document.getElementById(
            'textOverlay-hard-layout-serpent'
        );
        const textOverlayCoquille = document.getElementById(
            'textOverlay-hard-layout-coquille'
        );

        let isOpen = false;

        // *(0__0)* mémorise l'état de la hoempage
        if (textOverlaySerpent && initialTextOverlaySerpent.current === null) {
            initialTextOverlaySerpent.current = textOverlaySerpent.innerHTML;
            initialTextOverlayCoquille.current = textOverlayCoquille.innerHTML;
        }
        // *(0__0)* fonction pour réinjecter les états de la homepage
        const resetTextOverlay = () => {
            textOverlaySerpent.innerHTML = initialTextOverlaySerpent.current;
            textOverlayCoquille.innerHTML = initialTextOverlayCoquille.current;
            // console.log('^_^ RESET to first svg/spans');
        };
        // *(0__0)* fonction pour réinjecter les états de la catégorie (récupérés plus bas)
        const resetTextOverlayCategory = () => {
            textOverlaySerpent.innerHTML = onCatTextOverlaySerpent.current;
            textOverlayCoquille.innerHTML = onCatTextOverlayCoquille.current;
            // console.log('^_^ RESET to category svg/spans');
        };

        // SPANS
        // ————————————————————————————————————————————————————————————————————————————————————————————————————
        ///////// Update Letters Position
        function updateLettersPosition(path, textOverlay, durationDuration) {
            // Fonction pour extraire les points du chemin SVG
            function extractPointsFromD(d) {
                const points = [];
                const regex = /[ML]\s*([0-9.]+)[ ,]([0-9.]+)/g;
                let match;
                while ((match = regex.exec(d)) !== null) {
                    points.push({
                        x: parseFloat(match[1]),
                        y: parseFloat(match[2]),
                    });
                }
                return points;
            }

            // Fonction pour convertir les coordonnées SVG en coordonnées écran
            function svgPointToScreen(svg, x, y) {
                if (!svg) return { x: 0, y: 0 }; // Sécurité si svg n'est pas encore prêt
                
                const pt = svg.createSVGPoint();
                pt.x = x;
                pt.y = y;
                
                // Obtenir la matrice de transformation du SVG
                const svgMatrix = svg.getCTM();
                // Appliquer la transformation
                const transformedPoint = pt.matrixTransform(svgMatrix);
                
                // Obtenir le wrapper parent
                const wrapper = svg.closest('.poetry-title--wrapper');
                if (!wrapper) return transformedPoint;
                
                // Obtenir la position du wrapper
                const wrapperRect = wrapper.getBoundingClientRect();
                
                // Retourner les coordonnées relatives au wrapper
                return {
                    x: transformedPoint.x ,
                    y: transformedPoint.y
                };
            }

            // Récupération des points du chemin SVG
            const d = path.getAttribute('d');
            const points = extractPointsFromD(d);
            const svg = path.ownerSVGElement;

            // Mise à jour des positions des spans
            const spans = textOverlay.children;
            const count = Math.min(spans.length, points.length);

            for (let i = 0; i < count; i++) {
                const { x, y } = svgPointToScreen(
                    svg,
                    points[i].x,
                    points[i].y
                );
                const span = spans[i];

                // Utilisation de GSAP pour une animation fluide
                gsap.to(span, {
                    duration: durationDuration,
                    left: `${x}px`,
                    top: `${y}px`,
                    ease: 'none',
                });
            }
            // console.log('/*-*/ Update Letters Position');
        }
        ///////// END Update Letters Position /////////

        // Fonction pour mettre à jour les deux chemins
        function updateBothPaths(duration) {
            // console.log('(8> <8) Both Paths Letter Updates');
            updateLettersPosition(pathSerpent, textOverlaySerpent, duration);
            updateLettersPosition(pathCoquille, textOverlayCoquille, duration);
        }
        // ————————————————————————————————————————————————————————————————————————————————————————————————————

        // ————————————————————————————————————————————————————————————————————————————————————————————————————
        // FUNCTIONS PATH AND SHAPES

        const hideCoquille = () => {
            // console.log('//-_-/// Hide Coquille');
            textOverlayCoquille.style.transform = 'translateX(-100vw)';
            setTimeout(() => {
                textOverlayCoquille.style.opacity = 0;
            }, 500);
        };

        const showCoquille = () => {
            // console.log('**0_0***** Show Coquille');
            textOverlayCoquille.style.opacity = 1;
            textOverlayCoquille.style.transform = 'translateX(0vw)';
        };

        // Open and close Snake
        const openSerpentCategoryPoetry = () => {
            hardWrapper.classList.add('animate-open-serpent');
            gsap.to(pathSerpent, {
                duration: 0.4,
                attr: {
                    d: pathSerpentClose,
                },
                onUpdate: () => updateBothPaths(0),
            });
            // console.log('*****0_0** Open Snake');
            showCoquille();
        };
        const closeSerpentForIndex = () => {
            // if (hardWrapper.classList.contains('animate-open-serpent')) {
            hardWrapper.classList.remove('animate-open-serpent');
            gsap.to(pathSerpent, {
                duration: 0.4,
                attr: {
                    d: pathSerpentIndex,
                },
                onUpdate: () => updateBothPaths(0),
            });
            // console.log('///-_-// Close Snake');
            hideCoquille();
            //
        };

        // Gestion de l'animation Accordion
        const handleAccordionChange = (event) => {
            const { isAccordionOpen } = event.detail;
            isOpen = isAccordionOpen;

            if (hardWrapper.classList.contains('accordion-open')) {
                hardWrapper.classList.remove('accordion-open');
            } else {
                hardWrapper.classList.add('accordion-open');
            }
            gsap.to(pathSerpent, {
                duration: 0.4,
                attr: {
                    d: isAccordionOpen ? pathSerpentOpen : pathSerpentClose,
                },
                onUpdate: () => updateBothPaths(0),
            });

            gsap.to(pathCoquille, {
                duration: 0.4,
                attr: {
                    d: isAccordionOpen ? pathCoquilleOpen : pathCoquilleClose,
                },
                onUpdate: () => updateBothPaths(0),
            });

            // console.log('/~\/~\/~\ Accordion Change');
        };
        const closeAccordion = () => {
            if (hardWrapper.classList.contains('accordion-open')) {
                hardWrapper.classList.remove('accordion-open');
                isOpen = false;
                gsap.to(pathCoquille, {
                    duration: 0.4,
                    attr: {
                        d: pathCoquilleClose,
                    },
                    onUpdate: () => updateBothPaths(0),
                });
                // console.log('//~~~~~~|| Close Accordion');
            }
        };

        // ————————————————————————————————————————————————————————————————————————————————————————————————————
        // TRIGER INITIALISATION
        if (state == 'poetry') {
            // Reset text overlay TO OPEN CATEGORY STYLE if was previously HIDDEN
            if (hardWrapper.classList.contains('hard-layout--hidden')) {
                // *(0__0)* Si masqué, on réinjecte les états de la catégorie
                resetTextOverlayCategory();
                showCoquille();
                hardWrapper.classList.remove('hard-layout--hidden');
            } else {
                openSerpentCategoryPoetry();
                closeAccordion();
                setTimeout(() => {
                    updateBothPaths(0.3);
                    // *(0__0)* Récupération des états de la catégorie après animation
                    if (
                        onCatTextOverlaySerpent &&
                        onCatTextOverlaySerpent.current === null
                    ) {
                        onCatTextOverlaySerpent.current =
                            textOverlaySerpent.innerHTML;
                        onCatTextOverlayCoquille.current =
                            textOverlayCoquille.innerHTML;
                    }
                }, 900);
            }
        } else if (state == 'home') {
            // updateBothPaths(0);
            // closeSerpentForIndex();
            // Reset text overlay TO FIRST INDEX STYLE if was previously HIDDEN
            if (hardWrapper.classList.contains('hard-layout--hidden')) {
                resetTextOverlay();
                hideCoquille();
                hardWrapper.classList.remove('hard-layout--hidden');
            } else if (hardWrapper.classList.contains('animate-open-serpent')) {
                closeSerpentForIndex();
            }
        } else {
            hardWrapper.classList.remove('animate-open-serpent');
            hardWrapper.classList.add('hard-layout--hidden');
        }

        // Initialisation
        // window.addEventListener('load', updatePaths);
        window.addEventListener('resize', () => updateBothPaths(0));
        window.addEventListener(
            'accordionDescriptionToggle',
            handleAccordionChange
        );

        return () => {
            // window.removeEventListener('load', updatePaths);
            window.removeEventListener('resize', () => updateBothPaths(0));
            window.removeEventListener(
                'accordionDescriptionToggle',
                handleAccordionChange
            );
        };
    }, [targetHref]);

    // Render
    return (
        <>
            <style>
                {`

                /* Style de chaque lettre */
                .textOverlay span {
                    position: absolute;
                    transform: translate(-50%, -50%); /* centre la lettre sur le point */
                    font-size: 24px;
                    white-space: pre;
                }

 
                // #textOverlay-hard-layout-serpent span{
                // border: 2px solid yellow;
                // }
            }
            `}
            </style>

            <div className={`poetry-title--wrapper hard-layout--wrapper relative`}>
                <svg
                    id='svg-hard-layout'
                    className='block h-[95vh] w-full'
                    viewBox='0 -20 150 1050'
                    preserveAspectRatio='none'
                    // style={{ height: '95vh' }}
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <a
                        xlinkHref={
                            isOnSlugPage
                                ? `/${lang}/poetry/`
                                : `/${lang}/poetry/comme-un-serpent-dans-une-flute/`
                        }
                        className={`project ${
                            activePoetrySlug &&
                            activePoetrySlug !==
                                'comme-un-serpent-dans-une-flute'
                                ? 'pointer-events-none invisible'
                                : 'visible'
                        }`}
                        data-type='comme-un-serpent-dans-une-flute'
                    >
                        <path
                            id='myPath-hard-layout-serpent'
                            d={pathSerpentIndex}
                            stroke='transparent'
                            strokeWidth='30px'
                            fill='none'
                        />
                    </a>
                    <a
                        xlinkHref={
                            isOnSlugPage
                                ? `/${lang}/poetry/`
                                : `/${lang}/poetry/des-coquilles-et-des-pepins/`
                        }
                        className={`project translate-y-[150px] ${
                            activePoetrySlug &&
                            activePoetrySlug !== 'des-coquilles-et-des-pepins'
                                ? 'pointer-events-none invisible'
                                : 'visible'
                        }`}
                        data-type='des-coquilles-et-des-pepins'
                    >
                        <path
                            id='myPath-hard-layout-coquille'
                            d={pathCoquilleClose}
                            stroke='transparent'
                            strokeWidth='30px'
                            fill='none'
                        />
                    </a>
                </svg>

                <div
                    id='textOverlay-hard-layout-serpent'
                    className='textOverlay pointer-events-none absolute top-0 left-0 h-full w-full transition-opacity duration-500 ease-in-out'
                    style={{
                        opacity:
                            activePoetrySlug &&
                            activePoetrySlug !==
                                'comme-un-serpent-dans-une-flute'
                                ? 0
                                : 1,
                    }}
                >
                   <span style={{ top: '16px', left: '1px' }}>c</span>
                    <span style={{ top: '47px', left: '14px' }}>o</span>
                    <span style={{ top: '73px', left: '18px' }}>m</span>
                    <span style={{ top: '99px', left: '14px' }}>m</span>
                    <span style={{ top: '124px', left: '6px' }}>e</span>
                    <span style={{ top: '175px', left: '3px' }}>u</span>
                    <span style={{ top: '202px', left: '9px' }}>n</span>
                    <span style={{ top: '253px', left: '11px' }}>s</span>
                    <span style={{ top: '278px', left: '12px' }}>e</span>
                    <span style={{ top: '303px', left: '6px' }}>r</span>
                    <span style={{ top: '331px', left: '1px' }}>p</span>
                    <span style={{ top: '355px', left: '8px' }}>e</span>
                    <span style={{ top: '382px', left: '11px' }}>n</span>
                    <span style={{ top: '406px', left: '18px' }}>t</span>
                    <span style={{ top: '456px', left: '13px' }}>d</span>
                    <span style={{ top: '485px', left: '8px' }}>a</span>
                    <span style={{ top: '510px', left: '13px' }}>n</span>
                    <span style={{ top: '536px', left: '26px' }}>s</span>
                    <span style={{ top: '585px', left: '37px' }}>u</span>
                    <span style={{ top: '612px', left: '47px' }}>n</span>
                    <span style={{ top: '637px', left: '37px' }}>e</span>
                    <span style={{ top: '686px', left: '13px' }}>f</span>
                    <span style={{ top: '714px', left: '2px' }}>l</span>
                    <span style={{ top: '740px', left: '15px' }}>û</span>
                    <span style={{ top: '766px', left: '28px' }}>t</span>
                    <span style={{ top: '793px', left: '47px' }}>e</span>
                </div>
                <div
                    id='textOverlay-hard-layout-coquille'
                    className={`textOverlay pointer-events-none absolute top-0 left-0 h-full w-full translate-y-[80px] transition-[transform,opacity] duration-500`}
                    style={{
                        transform: 'translateX(-100vw)',
                        opacity:
                            activePoetrySlug &&
                            activePoetrySlug !== 'des-coquilles-et-des-pepins'
                                ? 0
                                : 1,
                    }}
                >
                    <span style={{ top: '38px', left: '13px' }}>d</span>
                    <span style={{ top: '65px', left: '19px' }}>e</span>
                    <span style={{ top: '89px', left: '24px' }}>s</span>
                    <span style={{ top: '140px', left: '22px' }}>c</span>
                    <span style={{ top: '164px', left: '16px' }}>o</span>
                    <span style={{ top: '190px', left: '16px' }}>q</span>
                    <span style={{ top: '213px', left: '24px' }}>u</span>
                    <span style={{ top: '237px', left: '33px' }}>i</span>
                    <span style={{ top: '261px', left: '26px' }}>l</span>
                    <span style={{ top: '286px', left: '19px' }}>l</span>
                    <span style={{ top: '312px', left: '29px' }}>e</span>
                    <span style={{ top: '339px', left: '24px' }}>s</span>
                    <span style={{ top: '387px', left: '17px' }}>e</span>
                    <span style={{ top: '411px', left: '24px' }}>t</span>
                    <span style={{ top: '462px', left: '35px' }}>d</span>
                    <span style={{ top: '487px', left: '43px' }}>e</span>
                    <span style={{ top: '512px', left: '43px' }}>s</span>
                    <span style={{ top: '562px', left: '33px' }}>p</span>
                    <span style={{ top: '586px', left: '19px' }}>é</span>
                    <span style={{ top: '612px', left: '21px' }}>p</span>
                    <span style={{ top: '634px', left: '29px' }}>i</span>
                    <span style={{ top: '660px', left: '37px' }}>n</span>
                    <span style={{ top: '685px', left: '45px' }}>s</span>
                </div>
            </div>
        </>
    );
};

export default PoetryTitleHardLayout;

function updateLettersPosition(path, textOverlay) {
    // Fonction pour extraire les points du chemin SVG
    function extractPointsFromD(d) {
        const points = [];
        const regex = /[ML]\s*([0-9.]+)[ ,]([0-9.]+)/g;
        let match;
        while ((match = regex.exec(d)) !== null) {
            points.push({
                x: parseFloat(match[1]),
                y: parseFloat(match[2]),
            });
        }
        return points;
    }

    // Fonction pour convertir les coordonnées SVG en coordonnées écran
    function svgPointToScreen(svg, x, y) {
        if (!svg) return { x: 0, y: 0 }; // Sécurité si svg n'est pas encore prêt
        
        const pt = svg.createSVGPoint();
        pt.x = x;
        pt.y = y;
        
        // Obtenir la matrice de transformation du SVG
        const svgMatrix = svg.getCTM();
        // Appliquer la transformation
        const transformedPoint = pt.matrixTransform(svgMatrix);
        
        // Obtenir le wrapper parent
        const wrapper = svg.closest('.poetry-title--wrapper');
        if (!wrapper) return transformedPoint;
        
        // Obtenir la position du wrapper
        const wrapperRect = wrapper.getBoundingClientRect();
        
        // Retourner les coordonnées relatives au wrapper
        return {
            x: transformedPoint.x ,
            y: transformedPoint.y
        };
    }

    // Récupération des points du chemin SVG
    const d = path.getAttribute('d');
    const points = extractPointsFromD(d);
    const svg = path.ownerSVGElement;

    // Mise à jour des positions des spans
    const spans = textOverlay.children;
    const count = Math.min(spans.length, points.length);

    for (let i = 0; i < count; i++) {
        const { x, y } = svgPointToScreen(svg, points[i].x, points[i].y);
        const span = spans[i];

        // Utilisation de GSAP pour une animation fluide
        gsap.to(span, {
            duration: 0.4,
            left: `${x}px`,
            top: `${y}px`,
            ease: 'none',
        });
    }
}
