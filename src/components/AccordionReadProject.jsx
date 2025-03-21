// src/components/AccordionReadProject.jsx

import { useState, useRef, useEffect } from 'react';
import '../assets/styles/triangleShapeText.css';

export default function AccordionReadProject({
    description,
    technique,
    materials,
    width,
    height,
    lang,
    year,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef(null);

    /**
     * Met à jour la hauteur du contenu de la description
     * Utilisé pour calculer la position de l'accordéon
     */
    const updateHeight = () => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    };

    // Surveillance des changements de hauteur pour le débogage
    useEffect(() => {
        console.log('Content height:', contentHeight);
    }, [contentHeight]);

    /**
     * Gestion du cycle de vie :
     * - Calcule la hauteur initiale au montage
     * - Recalcule la hauteur lors du redimensionnement de la fenêtre
     * - Nettoie l'event listener au démontage
     */
    useEffect(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    /**
     * Événement pour synchroniser l'ouverture/fermeture de l'accordéon
     * Déplacer le titre en fonction de l'ouverture/fermeture de l'accordéon
     */
    useEffect(() => {
        const accordionMovementEvent = new CustomEvent(
            'accordionDescriptionToggle',
            {
                detail: {
                    isAccordionOpen: isOpen,
                    accordionHeight: isOpen ? contentHeight : 0,
                },
            }
        );
        // Envoie l'event à la fenetre globale
        // --> Ecouter : window.addEventListener('accordionDescriptionToggle', callback)
        window.dispatchEvent(accordionMovementEvent);
    }, [isOpen, contentHeight]);

    /**
     * Calcule la position verticale de la description :
     * - Si ouvert et contenu < 50% de la fenêtre : place en bas
     * - Si ouvert et contenu > 50% de la fenêtre : centre verticalement
     * - Si fermé : place en bas de la fenêtre
     */
    const computedTop = isOpen
        ? contentHeight < window.innerHeight * 0.5
            ? `calc(100vh - ${contentHeight}px - 47px)`
            : '50vh'
        : 'calc(100vh - 47px)';

    return (
        <div className='wrapper-parent-position relative z-[999]'>
            <div
                className='wrapper-description absolute right-0 flex flex-col items-center justify-center transition-all duration-500 ease-in-out'
                style={{ top: computedTop }}
            >
                <button
                    className='button-description p-[11px] bg-pink-black '
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {lang === 'fr' ? 'Lire' : 'Read'}
                </button>

                <div className='container-description text-center overflow-hidden'>
                    <div ref={contentRef} className='text-description'>
                        <div className='triangle-left'></div>
                        <div className='triangle-right'></div>
                        <p>{description}</p>

                        <div className='py-[11px]'>
                            <p>
                                {technique}, {materials}
                            </p>
                            <p>
                                {width} x {height} cm
                            </p>
                            {/* <p>{year}</p> */}
                            <p>2022</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
