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

    // 🔄 Met à jour la hauteur du contenu
    const updateHeight = () => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    };

    // 🍄 Gestion fermeture via event global
    useEffect(() => {
        const handleClose = () => {
            setIsOpen(false);
        };
        window.addEventListener('closeAccordionDescription', handleClose);
        return () =>
            window.removeEventListener(
                'closeAccordionDescription',
                handleClose
            );
    }, []);

    // 🔁 Recalcule hauteur au montage et au resize
    useEffect(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, [description, technique, materials, lang]);

    // 📤 Notifie l'état de l'accordéon (ouvert/fermé)
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
        // Envoie  --> window.dispatchEvent(accordionMovementEvent);
        // Écouter <-- window.addEventListener('accordionDescriptionToggle', callback)
        window.dispatchEvent(accordionMovementEvent);
    }, [isOpen, contentHeight]);

    // 🎯 Calcule la position verticale de l'accordéon
    const computedTop = isOpen
        ? contentHeight < window.innerHeight * 0.5
            ? `calc(100vh - ${contentHeight}px - 57px)`
            : '50vh'
        : 'calc(100vh - 57px)';

    // 🔤 Décalage du bouton selon langue et état
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
                    <span>
                        {isOpen
                            ? lang === 'fr'
                                ? 'fermer'
                                : 'close'
                            : lang === 'fr'
                              ? 'lire'
                              : 'read'}
                    </span>
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
