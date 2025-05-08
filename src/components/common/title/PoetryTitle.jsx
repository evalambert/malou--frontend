import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';


const PoetryTitle = ({
    pathOpen,
    pathClose,
    title,
    targetHref,
    keyId,
    className,
    slug,
    lang
}) => {
    // Refs pour les éléments du DOM
    const pathRef = useRef(null);
    const textOverlayRef = useRef(null);
    const svgRef = useRef(null);

    // Calcul de 'phrase' (peut être fait en dehors des effets car dépend seulement de 'title')
    const phrase = title.split('').filter((c) => c !== ' ');


    // Extrait les points (x, y) d'une chaîne de commande SVG (attribut "d")
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

    // Convertit des coordonnées SVG en pixels à l'écran
    // Note: 'svg' doit être l'élément SVG
    // function svgPointToScreen(svg, x, y) {
    //     if (!svg) return { x: 0, y: 0 }; // Sécurité si svg n'est pas encore prêt
    //     const pt = svg.createSVGPoint();
    //     pt.x = x;
    //     pt.y = y;
    //     return pt.matrixTransform(svg.getScreenCTM());
    // }

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

    // État pour suivre si l'effet a déjà été exécuté
    const [hasLoaded, setHasLoaded] = useState(false);

    // --- Fonction pour placer les lettres, mémorisée avec useCallback ---
    const placeLettersOnPoints = useCallback(() => {
        // Utilise les refs pour accéder aux éléments du DOM
        const path = pathRef.current;
        const textOverlay = textOverlayRef.current;
        const svg = svgRef.current;



        // Vérifie si les éléments sont bien présents
        if (!path || !textOverlay || !svg) {
            return;
        }

        const d = path.getAttribute('d');
        const points = extractPointsFromD(d || ''); // Assurer que d n'est pas null
        textOverlay.innerHTML = ''; // vide le conteneur

        const count = Math.min(phrase.length, points.length);

        for (let i = 0; i < count; i++) {
            const { x, y } = svgPointToScreen(
                svg,
                points[i].x,
                points[i].y
            );
            const span = document.createElement('span');
            span.textContent = phrase[i];
            span.style.left = `${x}px`;
            span.style.top = `${y}px`;
            textOverlay.appendChild(span);
        }
    }, [phrase]); // Dépendance: 'phrase' (qui dépend de 'title')


    // --- Premier Effet: Initialisation, Resize, Accordéon ---
    useEffect(() => {
        // Récupération des éléments et stockage dans les refs
        pathRef.current = document.getElementById('myPath' + keyId);
        textOverlayRef.current = document.getElementById('textOverlay' + keyId);
        svgRef.current = document.getElementById('svg' + keyId);

        const path = pathRef.current;
        const svg = svgRef.current;

        // Vérification si les éléments ont été trouvés
        if (!path || !svg) {
            return;
        }

        // Configuration initiale du SVG (viewBox)
        const setupViewBox = () => {
            if (path.getBBox) {
                path.classList.add('b-box-setup');
                try {
                    const bbox = path.getBBox();
                    const widthBbox = bbox.width * 1.8;
                    // Ajout de vérifications pour éviter NaN ou Infinity
                    if (isFinite(widthBbox) && widthBbox > 0) {
                        svg.setAttribute('viewBox', `0 -20 ${widthBbox} 1050`);
                    } else {
                        // Fallback ou valeur par défaut si bbox n'est pas calculable
                        svg.setAttribute('viewBox', `0 -20 160 1050`); // Ou une autre valeur sûre
                    }
                } catch (e) {
                    svg.setAttribute('viewBox', `0 -20 160 1050`); // Fallback en cas d'erreur
                }
            }
        };

        // Appeler setupViewBox une seule fois lors du chargement
        if (!path.classList.contains('b-box-setup')) {
            setupViewBox();
        }


        // Variable locale pour l'état de l'accordéon dans cet effet
        let isOpen = false;

        // Gestionnaires d'événements utilisant la fonction mémorisée
        const handleResize = () => {
            //  setupViewBox(); // Recalculer viewBox si la taille change
            placeLettersOnPoints();
        };

        const handleAccordionChange = (event) => {
            const pathElement = pathRef.current; // Utiliser la ref
            if (!pathElement) return;
            pathElement.classList.toggle('accordion-open');
            const { isAccordionOpen } = event.detail;
            const to = isAccordionOpen ? pathOpen : pathClose;
            isOpen = isAccordionOpen;
            gsap.to(pathElement, {
                duration: 0.5,
                attr: { d: to },
                onUpdate: placeLettersOnPoints, // Appelle la version mémorisée
            });
        };

        // Ajout des écouteurs
        window.addEventListener('resize', handleResize);
        window.addEventListener(
            'accordionDescriptionToggle',
            handleAccordionChange
        );

        // Logique conditionnelle
        if (targetHref.endsWith(`/${lang}/poetry/`) || targetHref == '/fr/' || targetHref == '/en/') {
            const pathElement = pathRef.current; // Utiliser la ref
            if (!pathElement) return;
            if (pathElement.classList.contains('accordion-open')) {
                pathElement.classList.remove('accordion-open');
                gsap.to(pathElement, {
                    duration: 0.5,
                    attr: { d: pathClose },
                    onUpdate: placeLettersOnPoints, // Appelle la version mémorisée
                });
                // placeLettersOnPoints;
                // Potentielle logique supplémentaire si nécessaire
            }
        }

        // Nettoyage
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener(
                'accordionDescriptionToggle',
                handleAccordionChange
            );
        };
        // Dépendances: props utilisées + la fonction mémorisée si elle change
    }, [keyId, pathOpen, pathClose, targetHref, lang, placeLettersOnPoints]);

    useEffect(() => {
        placeLettersOnPoints();
    }, [placeLettersOnPoints]);
    placeLettersOnPoints();

    // --- Second Effet: Écouteur 'load' ---
    useEffect(() => {
        // Ne s'exécute que si l'effet n'a pas encore été exécuté et que l'URL est '/fr/'
        if (!hasLoaded && window.location.pathname === '/fr/') {
            const handleLoad = () => {
                setTimeout(() => {
                    placeLettersOnPoints();
                }, 1500);

                setHasLoaded(true);
            };

            if (document.readyState === 'complete') {
                handleLoad();
            } else {
                window.addEventListener('load', handleLoad);
            }

            return () => {
                window.removeEventListener('load', handleLoad);
            };
        }
    }, [hasLoaded, placeLettersOnPoints]);



    // --- Render ---
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

                /* Bouton toggle (semble inutilisé ?) */
                #toggle {
                    margin-bottom: 1rem;
                    padding: 10px 20px;
                    font-size: 16px;
                    cursor: pointer;
                }
            `}
            </style>
            {/* Le JSX reste inchangé, s'assurant que les IDs correspondent ('myPath' + keyId, etc.) */}
            <div className={`poetry-title--wrapper relative ${className} `}>
                <svg
                    id={'svg' + keyId} // ID utilisé pour la ref svgRef
                    className='block h-auto w-full'
                    // viewBox est maintenant défini dynamiquement dans l'effet
                    preserveAspectRatio='none'
                    style={{ height: '95vh' }}
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <a
                        xlinkHref={targetHref}
                        className='project'
                        data-type={slug}
                    >
                        <path
                            id={'myPath' + keyId} // ID utilisé pour la ref pathRef
                            d={pathClose} // Chemin initial
                            stroke='transparent'
                            strokeWidth='30px'
                            fill='none'
                        />
                    </a>
                </svg>
                <div
                    id={'textOverlay' + keyId} // ID utilisé pour la ref textOverlayRef
                    className='textOverlay pointer-events-none absolute top-0 left-0 h-full w-full'
                ></div>
            </div>
        </>
    );
};

export default PoetryTitle;
