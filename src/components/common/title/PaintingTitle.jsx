import { useState, useEffect, useRef } from 'react';
import {
    handleMouseEnter,
    handleMouseLeave,
} from '../../../assets/scripts/utils/preview-img';

const PaintingTitle = ({ painting, lang, isActive, accordionOffsetY = 0 }) => {
    const [isOpen, setIsOpen] = useState(isActive);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const linkRef = useRef(null);

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
                    title.querySelectorAll('span').forEach((span, index) => {
                        const translateY = (spansLength - 1 - index) * 15;
                        span.style.transform = `translateY(-${translateY}px)`;
                    });
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
