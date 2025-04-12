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

import { useState } from 'react';
import {
    handleMouseEnter,
    handleMouseLeave,
} from '../../../assets/scripts/utils/preview-img';

const WeavingTitle = ({ weaving, lang }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!weaving.title) return null;

    const paddings = [
        'pr-[11px] pb-[11px]',
        'pr-[2px] pb-[11px]',
        'pr-[9px] pt-[11px]',
        'pr-[9px] pt-[11px]',
        'pr-[29px] pb-[11px]',
        'pr-[26px] pt-[11px]',
    ];

    const words = weaving.title.trim().split(' ');
    const firstWord = words[0] || '';
    const animatedLetters = firstWord.slice(0, 6).split('');
    const remainingFirstWord = firstWord.length > 6 ? firstWord.slice(6) : '';
    const restOfWords = words.slice(1).join(' ');

    const startIndex = 6 - animatedLetters.length;

    const mediaUrl = weaving.medias?.[0]?.url;

    const toggle = (e) => {
        // Pour ne pas suivre le lien immédiatement
        /* e.preventDefault(); */
        setIsOpen((prev) => !prev);
    };

    return (
        <div>
            <a
                href={`/${lang}/weaving/${weaving.slug}/`}
                onClick={toggle}
                onMouseEnter={() => mediaUrl && handleMouseEnter(mediaUrl)}
                onMouseLeave={handleMouseLeave}
                data-image-preview={mediaUrl}
                className='inline-flex flex-wrap transition-all duration-500'
            >
                {animatedLetters.map((char, i) => {
                    const paddingClass = paddings[startIndex + i];
                    return (
                        <span
                            key={i}
                            className={`inline-block transition-all duration-500 ${
                                isOpen ? paddingClass : ''
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
    );
};

export default WeavingTitle;

