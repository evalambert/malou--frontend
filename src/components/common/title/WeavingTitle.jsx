import { useState, useEffect, useRef } from 'react';
import {
    handleMouseEnter,
    handleMouseLeave,
} from '../../../assets/scripts/utils/preview-img';

const WeavingTitle = ({ weaving, lang, isActive }) => {
    const [isOpen, setIsOpen] = useState(isActive);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [linkPosition, setLinkPosition] = useState(null);
    const linkRef = useRef(null);

    const createFloatingTitle = () => {
        if (!isActive || !linkPosition) return;

        const container = document.getElementById('floating-title-container');
        if (container) {
            const titleElement = document.createElement('a');
            titleElement.id = 'title-on-display';
            titleElement.href = `/${lang}/weaving/`;
            titleElement.className = 'fixed bg-blue-800 opacity-50 z-[1000]';
            Object.assign(titleElement.style, { 
                top: `${linkPosition.top + window.scrollY}px`,
                left: `${linkPosition.left + window.scrollX}px`,
                width: `${linkPosition.width}px`,
                height: `${linkPosition.height}px`,
                cursor: 'pointer'
            });
            container.appendChild(titleElement);

            return () => {
                titleElement.remove();
            };
        }
    };

    useEffect(() => {
        setIsOpen(isActive);

        if (isActive) {
            const timer = setTimeout(() => {
                setShouldAnimate(true);
                setTimeout(() => {
                    if (linkRef.current) {
                        const rect = linkRef.current.getBoundingClientRect();
                        setLinkPosition(rect);
                    }
                }, 500);
            }, 50);
            return () => clearTimeout(timer);
        } else {
            setShouldAnimate(false);
            setLinkPosition(null);
        }
    }, [isActive]);

    useEffect(() => {
        const cleanup = createFloatingTitle();

        const handleResize = () => {
            if (linkRef.current) {
                const rect = linkRef.current.getBoundingClientRect();
                setLinkPosition(rect);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cleanup && cleanup();
            window.removeEventListener('resize', handleResize);
        };
    }, [isActive, linkPosition, lang]);

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

    const mediaUrl = weaving.medias?.[0]?.url;

    return (
        <>
            <div>
                <a
                    ref={linkRef}
                    href={`/${lang}/weaving/${weaving.slug}/`}
                    onMouseEnter={() => mediaUrl && handleMouseEnter(mediaUrl)}
                    onMouseLeave={handleMouseLeave}
                    data-image-preview={mediaUrl}
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
                        <span className='inline-block'>{remainingFirstWord}</span>
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