import React, { useEffect } from 'react';
import {
    handleMouseEnter,
    handleMouseClick,
    handleMouseLeave,
} from '../../../assets/scripts/utils/preview-img';

const VolumeTitle = ({ volume, lang, onMount }) => {
    useEffect(() => {
        if (onMount) onMount();
    }, []);
    // Render
    return (
        <div>
            <a
                href={`/${lang}/volume/${volume.slug}/`}
                className='block whitespace-nowrap'
                onMouseEnter={() => {
                    const mediaUrl =
                        volume.medias &&
                        volume.medias[0] &&
                        volume.medias[0].url;
                    const zoomUrl = volume.zoomImg && volume.zoomImg.url;
                    if (mediaUrl) {
                        handleMouseEnter(mediaUrl, 'cover');
                    } else if (zoomUrl) {
                        handleMouseEnter(zoomUrl, 'contain');
                    }
                }}
                onClick={() => {
                    const mediaUrl =
                        volume.medias &&
                        volume.medias[0] &&
                        volume.medias[0].url;
                    const zoomUrl = volume.zoomImg && volume.zoomImg.url;
                    if (mediaUrl) {
                        handleMouseClick(mediaUrl, 'cover');
                    } else if (zoomUrl) {
                        handleMouseClick(zoomUrl, 'contain');
                    }
                }}
                onMouseLeave={handleMouseLeave}
                data-image-preview={
                    volume.medias && volume.medias[0] && volume.medias[0].url
                        ? volume.medias[0].url
                        : volume.zoomImg && volume.zoomImg.url
                }
            >
                {volume.title.split('').map((letter, index) => (
                    <span className='inline-block' key={index}>
                        {letter}
                    </span>
                ))}
            </a>
        </div>
    );
};

export default VolumeTitle;
