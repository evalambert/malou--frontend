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
    credit,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const contentRef = useRef(null);

    // 🔄 Met à jour la hauteur du contenu
    const updateHeight = () => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    };

    // 📏 Met à jour la largeur de la fenêtre
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            updateHeight();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    // ✅ Confirme que l'accordéon est bien fermé
    useEffect(() => {
        if (!isOpen) {
            const confirmClose = new CustomEvent('accordionClosedConfirmed');
            window.dispatchEvent(confirmClose);
        }
    }, [isOpen]);
    // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

    // 🎯 Calcule la position verticale de l'accordéon
    const computedTop = isOpen
        ? windowWidth >= 768 // Desktop open
            ? `calc(100dvh - ${contentHeight}px - 47px)`
            : contentHeight < window.innerHeight * 0.5 // Mobile open
              ? `calc(100dvh - ${contentHeight}px - 78px)`
              : '50vh'
        : windowWidth >= 768 // Desktop close
          ? 'calc(100dvh - 47px)'
          : 'calc(100dvh - 78px)'; // Mobile close

    // 🔤 Décalage du bouton selon langue et état
    const getTranslateY = () => {
        if (isOpen) {
            return lang === 'fr'
                ? 'translate-x-[-15px]' // fermer
                : 'translate-x-[-14px]'; // close
        } else {
            return lang === 'fr'
                ? 'translate-x-[-13px]' // lire
                : 'translate-x-[-14px]'; // read
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
                <div className=''>
                    <button
                        className={`button-description origin-bottom-right rotate-[24deg] cursor-pointer p-[11px] ${getTranslateY()}`}
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
                </div>

                <div
                    className={`container-description overflow-hidden text-center transition-all duration-500 ease-in-out max-w-[1400px]`}
                    style={{ maxHeight: isOpen ? `${contentHeight}px` : '0px' }}
                >
                    <div ref={contentRef} className='text-description'>
                        <div className='triangle-left'></div>
                        <div className='triangle-right'></div>
                        <p>{description}</p>
                        <p className=''>
                            {lang === 'fr'
                                ? ' Crédit photo '
                                : ' Photo credit '}
                            ©{credit}
                        </p>
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
