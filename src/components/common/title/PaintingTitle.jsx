import { useState, useEffect, useRef } from 'react';
import {
    handleMouseEnter,
    handleMouseClick,
    handleMouseLeave,
} from '../../../assets/scripts/utils/preview-img';

const PaintingTitle = ({ painting, lang, isActive, accordionOffsetY = 0 }) => {
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
            // Supprimer les anciens liens s'ils existent
            const existingLinks = container.querySelectorAll('.letter-link');
            existingLinks.forEach((link) => link.remove());

            // Créer un lien pour chaque lettre
            const letters = linkRef.current.querySelectorAll('.paint--letter');
            letters.forEach((letter) => {
                const letterRect = letter.getBoundingClientRect();
                const overlayLink = document.createElement('a');
                overlayLink.href = `/${lang}/painting/`;
                overlayLink.className =
                    'letter-link fixed bg-blue-800 opacity-50 z-[1000] transition-transform duration-1000';
                overlayLink.style.top = `${letterRect.top + window.scrollY}px`;
                overlayLink.style.left = `${letterRect.left + window.scrollX}px`;
                overlayLink.style.width = `${letterRect.width}px`;
                overlayLink.style.height = `${letterRect.height}px`;
                overlayLink.style.cursor = 'pointer';

                // Ajouter les événements de survol pour l'aperçu
                overlayLink.onmouseenter = () => {
                    const mediaUrl = painting.medias?.[0]?.url;
                    if (mediaUrl) {
                        handleMouseEnter(mediaUrl);
                    }
                };
                overlayLink.onmouseleave = handleMouseLeave;

                container.appendChild(overlayLink);
            });
        }
    };

    // Effet pour gérer l'état active et l'animation
    useEffect(() => {
        setIsOpen(isActive);
        if (isActive) {
            setShouldAnimate(true);
            const title = linkRef.current;
            if (title) {
                const spansLength = title.querySelectorAll('span').length;
                const firstSpanTranslateY = (spansLength - 1) * 15;
                const newTitleHeight = firstSpanTranslateY + 32;
                title.style.height = `${newTitleHeight}px`;

                // On met à jour la position immédiatement

                requestAnimationFrame(() => {
                    const spans = title.querySelectorAll('span');
                    const lastSpan = spans[spans.length - 1];

                    // On applique les transformations avec un délai
                    setTimeout(() => {
                        spans.forEach((span, index) => {
                            const translateY = (spansLength - 1 - index) * 15;
                            span.style.transform = `translateY(-${translateY}px)`;
                            if (index === spans.length - 1) {
                                setTimeout(() => {
                                    createFloatingTitle();
                                }, 1000);
                            }
                        });
                    }, 50); // Réduit à 50ms pour être plus réactif
                });
            }
        } else {
            setShouldAnimate(false);
            const title = linkRef.current;
            if (title) {
                title.style.height = '32px';
                title.querySelectorAll('span').forEach((span) => {
                    span.style.transform = 'translateY(0)';
                });
            }
        }
    }, [isActive]);

    // Effet pour gérer accordionOffsetY
    useEffect(() => {
        const titleElements = document.querySelectorAll('.letter-link');
        titleElements.forEach((titleElement) => {
            titleElement.style.transform = `translateY(${accordionOffsetY}px)`;
        });
    }, [isActive, accordionOffsetY]);

    // Effet pour gérer le resize
    useEffect(() => {
        if (!isActive) return;

        const handleResize = () => {
            setTimeout(() => {
                updatePosition();
                const cleanup = createFloatingTitle();
                return () => cleanup && cleanup();
            }, 500);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isActive, lang]);

    return (
        <div className='!overflow-visible'>
            <a
                ref={linkRef}
                href={`/${lang}/painting/${painting.slug}/`}
                className={`block !overflow-visible whitespace-nowrap transition-all duration-500 ${isActive ? 'active' : ''}`}
                onMouseEnter={() => {
                    const mediaUrl =
                        painting.medias &&
                        painting.medias[0] &&
                        painting.medias[0].url;
                    const zoomUrl = painting.zoomImg && painting.zoomImg.url;
                    if (mediaUrl) {
                        handleMouseEnter(mediaUrl);
                    } else if (zoomUrl) {
                        handleMouseEnter(zoomUrl);
                    }
                }}
                onClick={() => {
                    const mediaUrl =
                        painting.medias &&
                        painting.medias[0] &&
                        painting.medias[0].url;
                    const zoomUrl = painting.zoomImg && painting.zoomImg.url;
                    if (mediaUrl) {
                        handleMouseClick(mediaUrl);
                    } else if (zoomUrl) {
                        handleMouseClick(zoomUrl);
                    }
                }}
                onMouseLeave={handleMouseLeave}
                data-image-preview={
                    painting.medias &&
                    painting.medias[0] &&
                    painting.medias[0].url
                        ? painting.medias[0].url
                        : painting.zoomImg && painting.zoomImg.url
                }
            >
                {painting.title.split('').map((letter, index) => (
                    <span
                        className={`paint--letter inline-block transition-all duration-500`}
                        key={index}
                    >
                        {letter}
                    </span>
                ))}
            </a>
        </div>
    );
};

export default PaintingTitle;
