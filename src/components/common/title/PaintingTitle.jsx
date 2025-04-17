import { useState, useEffect, useRef } from 'react';
import {
    handleMouseEnter,
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
            let titleElement = document.getElementById('title-on-display');
            
            if (!titleElement) {
                titleElement = document.createElement('a');
                titleElement.id = 'title-on-display';
                titleElement.href = `/${lang}/painting/`;
                titleElement.className = 'fixed bg-blue-800 opacity-50 z-[1000] transition-transform duration-1000';
                container.appendChild(titleElement);
            }
            
            Object.assign(titleElement.style, {
                top: `${positionRef.current.top + window.scrollY}px`,
                left: `${positionRef.current.left + window.scrollX}px`,
                width: `${positionRef.current.width}px`,
                height: `${positionRef.current.height}px`,
                cursor: 'pointer'
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
            const title = linkRef.current;
            if (title) {
                const spansLength = title.querySelectorAll('span').length;
                const firstSpanTranslateY = (spansLength - 1) * 15;
                const newTitleHeight = firstSpanTranslateY + 32;
                title.style.height = `${newTitleHeight}px`;
                
                setTimeout(() => {
                    updatePosition();
                    const cleanup = createFloatingTitle();
                    title.querySelectorAll('span').forEach((span, index) => {
                        const translateY = (spansLength - 1 - index) * 15;
                        span.style.transform = `translateY(-${translateY}px)`;
                    });
                    return () => cleanup && cleanup();
                }, 500);
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
        const titleElement = document.getElementById('title-on-display');
        if (titleElement) {
            titleElement.style.transform = `translateY(${accordionOffsetY}px)`;
        }
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
                className={`block whitespace-nowrap transition-all duration-500 !overflow-visible ${isActive ? 'active' : ''}`}
                onMouseEnter={() => {
                    const mediaUrl = painting.medias?.[0]?.url;
                    if (mediaUrl) {
                        handleMouseEnter(mediaUrl);
                    }
                }}
                onMouseLeave={handleMouseLeave}
                data-image-preview={painting.medias?.[0]?.url}
            >
                {painting.title.split('').map((letter, index) => (
                    <span
                        className={`inline-block transition-all duration-500`}
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
