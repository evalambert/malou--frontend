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

    // Fonction pour mettre à jour la hauteur de la description
    const updateHeight = () => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    };

    // Debug: Log contentHeight when it changes
    useEffect(() => {
        console.log('Content height:', contentHeight);
    }, [contentHeight]);

    // Recalcul de la hauteur au montage et lors du redimensionnement de la fenêtre
    useEffect(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    const computedTop = isOpen
        ? contentHeight < window.innerHeight * 0.5
            ? `calc(100vh - ${contentHeight}px - 57px)`
            : '50vh'
        : 'calc(100vh - 57px)';

    return (
        <div className='wrapper-parent-position relative z-[999]'>
            <div
                className='wrapper-description absolute right-0 flex flex-col items-center justify-center transition-all duration-500 ease-in-out'
                style={{ top: computedTop }}
            >
                <button
                    className='button-description p-4 bg-pink-black '
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {lang === 'fr' ? 'Lire' : 'Read'}
                </button>

                <div className='container-description text-center overflow-hidden'>
                    <div ref={contentRef} className='text-description'>
                        <div className='triangle-left'></div>
                        <div className='triangle-right'></div>
                        <p>{description}</p>

                        <div className='pt-[11px]'>
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
