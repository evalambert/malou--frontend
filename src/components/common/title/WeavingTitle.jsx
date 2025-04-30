import { useState, useEffect, useRef, useCallback } from 'react';
import {
    handleMouseEnter,
    handleMouseClick,
    handleMouseLeave,
} from '../../../assets/scripts/utils/preview-img';

const WeavingTitle = ({ weaving, lang, isActive, accordionOffsetY = 0 }) => {
    const [isOpen, setIsOpen] = useState(isActive);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const linkRef = useRef(null);
    const positionRef = useRef(null);

    const updatePosition = () => {
        if (linkRef.current) {
            const rect = linkRef.current.getBoundingClientRect();
            positionRef.current = rect;
            return rect;
        }
        return null;
    };

    const createFloatingTitle = () => {
        if (!isActive || !positionRef.current) return;

        const container = document.getElementById('floating-title-container');
        if (container) {
            // Vérifier si le titre existe déjà
            let titleElement = document.getElementById('title-on-display');

            if (!titleElement) {
                // Créer un nouveau titre s'il n'existe pas
                titleElement = document.createElement('a');
                titleElement.id = 'title-on-display';
                titleElement.href = `/${lang}/weaving/`;
                titleElement.className =
                    'fixed bg-blue-800 opacity-50 z-[1000] transition-transform duration-1000';
                container.appendChild(titleElement);
            }

            // Mettre à jour les propriétés de style (que le titre soit nouveau ou existant)
            Object.assign(titleElement.style, {
                top: `${positionRef.current.top + window.scrollY}px`,
                left: `${positionRef.current.left + window.scrollX}px`,
                width: `${positionRef.current.width}px`,
                height: `${positionRef.current.height}px`,
                cursor: 'pointer',
            });

            return () => {
                titleElement.remove();
            };
        }
    };

    // Effet pour gérer l'état active et l'animation
    useEffect(() => {
        setIsOpen(isActive);
        if (isActive) {
            setShouldAnimate(true);

            // Attendre la fin de l'animation avant de créer le titre flottant
            const animationTimeout = setTimeout(() => {
                updatePosition(); // Mettre à jour la position APRÈS l'animation
                const cleanup = createFloatingTitle();
                return () => cleanup && cleanup();
            }, 500); // 500ms correspond à la durée de l'animation (duration-500)

            return () => clearTimeout(animationTimeout);
        } else {
            setShouldAnimate(false);
        }
    }, [isActive]);

    // Modifier l'effet existant pour ne gérer que le resize
    // Effet pour gérer accordionOffsetY
    useEffect(() => {
        // Mettre à jour la position Y du titre flottant en fonction de accordionOffsetY
        const titleElement = document.getElementById('title-on-display');
        if (titleElement) {
            titleElement.style.transform = `translateY(${accordionOffsetY}px)`;
        }
    }, [isActive, accordionOffsetY]);

    // Effet séparé pour gérer le resize
    useEffect(() => {
        if (!isActive) return;

        const handleResize = () => {
            updatePosition();
            const cleanup = createFloatingTitle();
            return () => cleanup && cleanup();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isActive, lang]);

    if (!weaving.title) return null;

    const paddings = [
        'pr-[26px] pt-[13px]',
        'pr-[29px] pt-[37px]',
        'pr-[9px] pt-[28px]',
        'pr-[9px] pt-[14px]',
        'pr-[2px] pb-[9px]',
        'pr-[11px] pb-[9px]',
    ];

    const words = weaving.title.trim().split(' ');
    const firstWord = words[0] || '';
    const animatedLetters = firstWord.slice(0, 6).split('');
    const remainingFirstWord = firstWord.length > 6 ? firstWord.slice(6) : '';
    const restOfWords = words.slice(1).join(' ');

    const startIndex = 6 - animatedLetters.length;

    return (
        <>
            <div>
                <a
                    ref={linkRef}
                    href={`/${lang}/weaving/${weaving.slug}/`}
                    onMouseEnter={() => {
                        const mediaUrl =
                            weaving.medias &&
                            weaving.medias[0] &&
                            weaving.medias[0].url;
                        const zoomUrl = weaving.zoomImg && weaving.zoomImg.url;
                        if (mediaUrl) {
                            handleMouseEnter(mediaUrl, 'cover');
                        } else if (zoomUrl) {
                            handleMouseEnter(zoomUrl, 'contain');
                        }
                    }}
                    onClick={() => {
                        const mediaUrl =
                            weaving.medias &&
                            weaving.medias[0] &&
                            weaving.medias[0].url;
                        const zoomUrl = weaving.zoomImg && weaving.zoomImg.url;
                        if (mediaUrl) {
                            handleMouseEnter(mediaUrl, 'cover');
                        } else if (zoomUrl) {
                            handleMouseEnter(zoomUrl, 'contain');
                        }
                    }}
                    onMouseLeave={handleMouseLeave}
                    data-image-preview={
                        weaving.medias &&
                        weaving.medias[0] &&
                        weaving.medias[0].url
                            ? weaving.medias[0].url
                            : weaving.zoomImg && weaving.zoomImg.url
                    }
                    className={`inline-flex flex-wrap items-center transition-all duration-500 ${isActive ? 'active' : ''}`}
                >
                    {animatedLetters.map((char, i) => {
                        const paddingClass = paddings[startIndex + i];
                        return (
                            <span
                                key={i}
                                className={`inline-block transition-all duration-500 ${isOpen && shouldAnimate ? paddingClass : ''}`}
                            >
                                {char}
                            </span>
                        );
                    })}
                    {remainingFirstWord && (
                        <span className='inline-block'>
                            {remainingFirstWord}
                        </span>
                    )}
                    {restOfWords && (
                        <span className='ml-2 inline-block'>
                            {' ' + restOfWords}
                        </span>
                    )}
                </a>
            </div>
        </>
    );
};

export default WeavingTitle;
