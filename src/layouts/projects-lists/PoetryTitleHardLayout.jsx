import { useState, useEffect } from 'react';
import { gsap } from "gsap";

const PoetryTitleHardLayout = ({ lang }) => {

    const [isOnPoetryPage, setIsOnPoetryPage] = useState(false);

    // Définition des constantes
    const pathSerpentIndex = "M1.5 0.5L17.5 38L22.5 71L17.5 103L8 134.5L4 197L11.5 231L13.5 294L15.5 325.5L8 357L1 391.5L10 421L13.5 455.5L23 484.5L16.5 547.5L10 582.5L16.5 614.5L32 646.5L46 707L58 741.5L46 772L16.5 833L3 867.5L18.5 900L34.5 932L58 965.5";
    const pathSerpentClose = "M1 1 L20.5 37.5 L38.5 69.0 L61 101.5 L79 136.5 L97 195.5 L106 229.5 L116 294.5 L110.5 325.0 L122.5 354.5 L122.5 391.0 L110.5 422.0 L116 453.5 L128 480.0 L131.5 551.5 L131.5 583.0 L128 614.5 L116 645.0 L110.5 708.5 L101.5 742.5 L110.5 770.0 L110.5 829.0 L128 864.0 L122 900.5 L116 931.5 L131.5 964.0";
    const pathSerpentOpen = "M1 1 L13 42 L39.5 64.5 L62 97 L80 132 L101 191.5 L107 225 L117 290 L111.5 320.5 L123.5 350 L123.5 386.5 L111.5 417.5 L117 449 L129 475.5 L129 547 L129 589.5 L147.5 619.5 L174 647 L235.5 662 L269 669 L299.5 666.5 L362 649.5 L396 619.5 L425 601.5 L450.5 577.5 L489.5 585";
    const pathCoquilleClose = "M1 1L9 35L15.5 66L13 132L5.5 163.5L5.5 197L15.5 226.5L26.5 257.5L18.5 288L9 320.5L21.5 355L15.5 389L6.5 451L15.5 482.5L30 547.5L40.5 581L40.5 613L26.5 677L9.5 708.5L12 742L21.5 770L32 804L42.5 835.5";
    const pathCoquilleOpen = "M1 1L9 35L15.5 66L13 132L5.5 163.5L5.5 197L15.5 226.5L26.5 257.5L18.5 288L9 320.5L21.5 355L15.5 389L13.5 453L32 478L52 536L70.5 564.5L95 579L156.5 579L187.5 572L217.5 564.5L238.5 536L254.5 497L284 487.5";
    const pathSerpentTitle = "Comme un serpent dans une flûte";
    const pathCoquilleTitle = "Des coquilles et des pépins";

    useEffect(() => {
        // Récupération des éléments du DOM
        const pathSerpent = document.getElementById('myPath-hard-layout-serpent')
        const pathCoquille = document.getElementById('myPath-hard-layout-coquille')
        const textOverlaySerpent = document.getElementById('textOverlay-hard-layout-serpent')
        const textOverlayCoquille = document.getElementById('textOverlay-hard-layout-coquille')
        const svg = document.getElementById('svg-hard-layout');

        // Calcul du viewBox basé sur les deux chemins
        const bboxSerpent = pathSerpent.getBBox();
        const bboxCoquille = pathCoquille.getBBox();
        const maxWidth = Math.max(bboxSerpent.width, bboxCoquille.width) * 3;
        svg.setAttribute("viewBox", `0 -20 ${maxWidth} 1050`);

        // État initial fermé au lieu de ouvert
        let isOpen = false;

        // Fonction : extrait les points (x, y) d'une chaîne de commande SVG
        function extractPointsFromD(d) {
            const points = []
            const regex = /[ML]\s*([0-9.]+)[ ,]([0-9.]+)/g
            let match
            while ((match = regex.exec(d)) !== null) {
                points.push({ x: parseFloat(match[1]), y: parseFloat(match[2]) })
            }
            return points
        }

        // Convertit des coordonnées SVG en pixels
        function svgPointToScreen(svg, x, y) {
            const pt = svg.createSVGPoint()
            pt.x = x
            pt.y = y
            return pt.matrixTransform(svg.getScreenCTM())
        }

        // Fonction pour placer les lettres sur un chemin spécifique
        function placeLettersOnPath(path, textOverlay, title) {
            const phrase = title.split('').filter(c => c !== ' ');
            const d = path.getAttribute('d');
            const points = extractPointsFromD(d);
            
            // Créer les spans une seule fois si ils n'existent pas
            if (textOverlay.children.length === 0) {
                phrase.forEach((letter, i) => {
                    const span = document.createElement('span');
                    span.textContent = letter;
                    textOverlay.appendChild(span);
                });
            }

            // Mettre à jour les positions des spans existants
            const count = Math.min(phrase.length, points.length);
            const svg = path.ownerSVGElement;

            for (let i = 0; i < count; i++) {
                const { x, y } = svgPointToScreen(svg, points[i].x, points[i].y);
                const span = textOverlay.children[i];
                
                // Utiliser GSAP pour animer la position des spans
                gsap.to(span, {
                    duration: 0.5,
                    left: `${x}px`,
                    top: `${y}px`,
                    ease: "none"
                });
            }
        }

        // Mise à jour des deux chemins
        function updatePaths() {
            if (window.location.pathname.includes('poetry')) {
                setIsOnPoetryPage(true);
            }
            placeLettersOnPath(pathSerpent, textOverlaySerpent, pathSerpentTitle)
            placeLettersOnPath(pathCoquille, textOverlayCoquille, pathCoquilleTitle)
        }

        // Gestion de l'animation
        const handleAccordionChange = (event) => {
            const { isAccordionOpen } = event.detail;
            isOpen = isAccordionOpen;

            gsap.to(pathSerpent, {
                duration: 0.5,
                attr: { d: isAccordionOpen ? pathSerpentOpen : pathSerpentClose },
                onUpdate: updatePaths
            });

            gsap.to(pathCoquille, {
                duration: 0.5,
                attr: { d: isAccordionOpen ? pathCoquilleOpen : pathCoquilleClose },
                onUpdate: updatePaths
            });
        };
        const handlePoetryPageStateChange = (event) => {
            console.log('handlePoetryPageStateChange');
            setTimeout(() => {
                const textOverlayCoquille = document.getElementById('textOverlay-hard-layout-coquille');
                if (textOverlayCoquille) {
                    
                    setTimeout(() => {
                        textOverlayCoquille.style.opacity = 1;
                    }, 1000);
                }
                
                gsap.to(pathSerpent, {
                    duration: 1,
                    attr: { d: isOnPoetryPage ? pathSerpentIndex : pathSerpentClose },
                    onUpdate: updatePaths,
                    ease: "none" // Utiliser une interpolation linéaire
                });
            }, 400);
        }

        // Initialisation avec les chemins fermés
        pathSerpent.setAttribute('d', pathSerpentIndex);
        pathCoquille.setAttribute('d', pathCoquilleClose);
        updatePaths();



        // Initialisation
        window.addEventListener('load', updatePaths)
        window.addEventListener('resize', updatePaths)
        window.addEventListener('accordionDescriptionToggle', handleAccordionChange);
        window.addEventListener('poetryPageStateChange', handlePoetryPageStateChange);

        // Nettoyage
        return () => {
            window.removeEventListener('load', updatePaths)
            window.removeEventListener('resize', updatePaths)
            window.removeEventListener('accordionDescriptionToggle', handleAccordionChange);
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

 
                // #textOverlay-hard-layout-serpent span{
                // border: 2px solid yellow;
                // }
            }
            `}
            </style>
            
            <div className={`poetry-title--wrapper`}>
                <svg
                    id="svg-hard-layout"
                    className="w-full h-auto block"
                    viewBox="0 -20 300 1050"
                    preserveAspectRatio="none"
                    style={{ height: "95vh" }}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <a xlinkHref={`/${lang}/poetry/comme-un-serpent-dans-une-flute/`}>
                        <path id="myPath-hard-layout-serpent"
                            d={pathSerpentIndex}
                            stroke="transparent" strokeWidth="20px" fill="none" />
                    </a>
                    <a xlinkHref={`/${lang}/poetry/des-coquilles-et-des-pepins/`} className='translate-y-[150px]'>
                        <path id="myPath-hard-layout-coquille"
                            d={pathCoquilleClose}
                            stroke="transparent" strokeWidth="20px" fill="none" />
                    </a>

                </svg>
                <div id={"textOverlay-hard-layout-serpent"} className="textOverlay absolute top-0 left-0 w-full h-full pointer-events-none">
                </div>
                <div id={"textOverlay-hard-layout-coquille"} className="textOverlay absolute top-0 left-0 w-full h-full pointer-events-none translate-y-[80px]" style={{ opacity: 0 }}>
                </div>
            </div>
        </>
    );
};

export default PoetryTitleHardLayout;