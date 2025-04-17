/* import {
    handleMouseEnter,
    handleMouseLeave,
} from '../../../assets/scripts/utils/preview-img';

const WeavingTitle = ({ weaving, lang }) => {
    return (
        <div>
            <a
                href={`/${lang}/weaving/${weaving.slug}/`}
                onMouseEnter={() => {
                    const mediaUrl =
                        weaving.medias &&
                        weaving.medias[0] &&
                        weaving.medias[0].url;
                    if (mediaUrl) {
                        handleMouseEnter(mediaUrl);
                    }
                }}
                onMouseLeave={handleMouseLeave}
                data-image-preview={
                    weaving.medias && weaving.medias[0] && weaving.medias[0].url
                }
            >
                {weaving.title}
            </a>
        </div>
    );
};
export default WeavingTitle; */

import { useState, useEffect } from 'react';
import {
    handleMouseEnter,
    handleMouseLeave,
} from '../../../assets/scripts/utils/preview-img';

const WeavingTitle = ({ weaving, lang, isActive }) => {
    const [isOpen, setIsOpen] = useState(isActive);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        setIsOpen(isActive);

        if (isActive) {
            const timer = setTimeout(() => {
                setShouldAnimate(true);
            }, 50);
            return () => clearTimeout(timer);
        } else {
            setShouldAnimate(false);
        }
    }, [isActive]);

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
                    href={`/${lang}/weaving/${weaving.slug}/`}
                    onMouseEnter={() => mediaUrl && handleMouseEnter(mediaUrl)}
                    onMouseLeave={handleMouseLeave}
                    data-image-preview={mediaUrl}
                    className={`inline-flex flex-wrap items-center transition-all duration-500 ${isActive ? 'active' : ''
                        }`}
                >
                    {animatedLetters.map((char, i) => {
                        const paddingClass = paddings[startIndex + i];
                        return (
                            <span
                                key={i}
                                className={`inline-block transition-all duration-500 ${isOpen && shouldAnimate ? paddingClass : ''
                                    }`}
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
