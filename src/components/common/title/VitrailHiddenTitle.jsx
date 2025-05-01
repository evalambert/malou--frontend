import { useEffect } from 'react';
import {
    handleMouseEnter,
    handleMouseClick,
    handleMouseLeave,
} from '../../../assets/scripts/utils/preview-img';

const VitrailHiddenTitle = ({ vitrail, lang, onMount }) => {
    useEffect(() => {
        onMount?.(); // Appelle la fonction si elle est définie
      }, []);
    // Render
    return (
        <div>
            <a
                href={`/${lang}/vitrail/${vitrail.slug}/`}
                className={`flex items-start gap-[6px]`}
                onMouseEnter={() => {
                    const mediaUrl =
                        vitrail.medias &&
                        vitrail.medias[0] &&
                        vitrail.medias[0].url;
                    const zoomUrl = vitrail.zoomImg && vitrail.zoomImg.url;
                    if (mediaUrl) {
                        handleMouseEnter(mediaUrl, 'cover');
                    } else if (zoomUrl) {
                        handleMouseEnter(zoomUrl, 'contain');
                    }
                }}
                onClick={() => {
                    const mediaUrl =
                        vitrail.medias &&
                        vitrail.medias[0] &&
                        vitrail.medias[0].url;
                    const zoomUrl = vitrail.zoomImg && vitrail.zoomImg.url;
                    if (mediaUrl) {
                        handleMouseClick(mediaUrl, 'cover');
                    } else if (zoomUrl) {
                        handleMouseClick(zoomUrl, 'contain');
                    }
                }}
                onMouseLeave={handleMouseLeave}
                data-image-preview={
                    vitrail.medias && vitrail.medias[0] && vitrail.medias[0].url
                        ? vitrail.medias[0].url
                        : vitrail.zoomImg && vitrail.zoomImg.url
                }
            >
                {vitrail.title.split(' ').map((word, i, words) => (
                    <div
                        key={i}
                        className='vitrail-word-wrapper inline-block transition-all duration-300'
                    >
                        <div className='inline-block h-[25px] transition-all duration-300'>
                            {word.split('').map((letter, j) => (
                                <span
                                    key={j}
                                    className='transition-all duration-300'
                                >
                                    {letter}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </a>
        </div>
    );
};  

export default VitrailHiddenTitle;
