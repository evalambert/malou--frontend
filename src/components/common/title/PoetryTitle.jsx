import { useEffect } from 'react';
import { gsap } from 'gsap';

const PoetryTitle = ({
    pathOpen,
    pathClose,
    title,
    targetHref,
    keyId,
    className,
    slug,
}) => {
    // Effects
    useEffect(() => {
        // Récupération des éléments du DOM
        const path = document.getElementById('myPath' + keyId);
        const textOverlay = document.getElementById('textOverlay' + keyId);
        const svg = document.getElementById('svg' + keyId);

        const bbox = path.getBBox();
        const widthBbox = bbox.width * 2;
        svg.setAttribute('viewBox', `0 -20 ${widthBbox} 1050`);

        // Phrase à afficher (chaque lettre séparée, sans les espaces)
        const phrase = title.split('').filter((c) => c !== ' ');

        // État courant (tracé ouvert ou fermé)
        let isOpen = true;

        // Version fermée du tracé SVG
        const closedPath = pathOpen;

        // Version ouverte du tracé SVG
        const openPath = pathClose;

        // Fonction : extrait les points (x, y) d'une chaîne de commande SVG (attribut "d")
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
        function svgPointToScreen(svg, x, y) {
            const pt = svg.createSVGPoint();
            pt.x = x;
            pt.y = y;
            return pt.matrixTransform(svg.getScreenCTM());
        }

        // Place les lettres sur les points du tracé actuel
        function placeLettersOnPoints() {
            const d = path.getAttribute('d'); // récupère l'attribut "d" du path actuel
            const points = extractPointsFromD(d); // extrait les points
            textOverlay.innerHTML = ''; // vide le conteneur HTML des lettres

            const count = Math.min(phrase.length, points.length); // on limite au nombre de points disponibles
            const svg = path.ownerSVGElement; // référence au SVG parent

            for (let i = 0; i < count; i++) {
                const { x, y } = svgPointToScreen(
                    svg,
                    points[i].x,
                    points[i].y
                );
                const span = document.createElement('span');
                span.textContent = phrase[i]; // ajoute la lettre
                span.style.left = `${x}px`;
                span.style.top = `${y}px`;
                textOverlay.appendChild(span); // ajoute le span dans le DOM
            }
        }

        // Place les lettres au chargement initial et quand on redimensionne la fenêtre
        placeLettersOnPoints();
        window.addEventListener('load', placeLettersOnPoints);
        window.addEventListener('resize', placeLettersOnPoints);

        // Fonction pour gérer l'animation
        const handleAccordionChange = (event) => {
            const { isAccordionOpen } = event.detail;
            const to = isAccordionOpen ? closedPath : openPath;
            isOpen = isAccordionOpen;

            gsap.to(path, {
                duration: 0.5,
                attr: { d: to },
                onUpdate: placeLettersOnPoints,
            });
        };

        // Écouter l'événement de l'accordéon
        window.addEventListener(
            'accordionDescriptionToggle',
            handleAccordionChange
        );

        // Nettoyage
        return () => {
            window.removeEventListener(
                'accordionDescriptionToggle',
                handleAccordionChange
            );
        };
    }, []);

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

                /* Bouton toggle */
                #toggle {
                margin - bottom: 1rem;
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
            }
            `}
            </style>
            <div className={`poetry-title--wrapper ${className}`}>
                <svg
                    id={'svg' + keyId}
                    className='block h-auto w-full'
                    viewBox='0 -20 160 1050'
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
                            id={'myPath' + keyId}
                            d={pathClose}
                            stroke='transparent'
                            strokeWidth='30px'
                            fill='none'
                        />
                    </a>
                </svg>
                <div
                    id={'textOverlay' + keyId}
                    className='textOverlay pointer-events-none absolute top-0 left-0 h-full w-full'
                ></div>
            </div>
        </>
    );
};

export default PoetryTitle;
