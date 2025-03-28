// src/components/AccordionReadProject.jsx

import { useState, useRef, useEffect } from 'react';
import '../../../assets/styles/triangleShapeText.css';

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
    // useEffect(() => {
    //     console.log('Content height:', contentHeight);
    // }, [contentHeight]);

    /**
     * Gestion du cycle de vie :
     * - Calcule la hauteur initiale au montage
     * - Recalcule la hauteur lors du redimensionnement de la fenêtre
     * - Nettoie l'event listener au démontage
     * - Ajout d'un useEffect pour recalculer la hauteur quand le contenu change
     */
    useEffect(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);

        // Ajouter un écouteur pour fermer l'accordéon
        const handlePageExit = () => {
            setIsOpen(false);
        };
        window.addEventListener('closeAccordion', handlePageExit);

        return () => {
            window.removeEventListener('resize', updateHeight);
            window.removeEventListener('closeAccordion', handlePageExit);
        };
    }, [description, technique, materials, width, height, year, lang]);

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
            ? `calc(100vh - ${contentHeight}px - 57px)`
            : '50vh'
        : 'calc(100vh - 57px)';

    const getTranslateY = () => {
        if (isOpen) {
            return lang === 'fr' ? 'translate-y-[-11px]' : 'translate-y-[-6px]';
        } else {
            return lang === 'fr' ? 'translate-y-[-6px]' : 'translate-y-[-8px]';
        }
    };

    return (
        <div
            className={`accordion-wrapper-position mix-blend-target relative z-[999]`}
        >
            <div
                className='wrapper-description absolute right-0 flex w-full flex-col items-center justify-center transition-all duration-500 ease-in-out md:fixed md:z-[999]'
                style={{ top: computedTop }}
            >
                <button
                    className={`button-description rotate-[24deg] cursor-pointer p-4 ${getTranslateY()}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? (
                        <span className='text-description'>
                            {lang === 'fr' ? 'fermer' : 'close'}
                        </span>
                    ) : (
                        <span className='text-description'>
                            {lang === 'fr' ? 'lire' : 'read'}
                        </span>
                    )}
                </button>

                <div
                    className={`container-description overflow-hidden text-center transition-all duration-500 ease-in-out`}
                    style={{ maxHeight: isOpen ? `${contentHeight}px` : '0px' }}
                >
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
                            <p>{year}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
