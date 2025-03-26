import { useState, useEffect } from 'react';

const WeavingTitle = ({ weaving, lang }) => {

    // Fonction pour gérer le survol et changer l'image
    const handleMouseEnter = (imageUrl) => {
        const imageElement = document.querySelector('.dynamic-image');
        const wrapperElement = document.querySelector('.preview-image--wrapper');
        if (imageElement) {
            imageElement.src = imageUrl;
        }
        if (wrapperElement) {
            wrapperElement.style.opacity = '1';
        }
    };

    const handleMouseLeave = () => {
        const wrapperElement = document.querySelector('.preview-image--wrapper');
        if (wrapperElement) {
            wrapperElement.style.opacity = '0';
        }
    };

    // Render
    return (
        <div>
            <a href={`/${lang}/weaving/${weaving.slug}/`} className="pr-1" onMouseEnter={() => {
                const mediaUrl = weaving.medias && weaving.medias[0] && weaving.medias[0].url;
                if (mediaUrl) {
                    handleMouseEnter(mediaUrl);
                }
            }}
                onMouseLeave={handleMouseLeave}
                data-image-preview={weaving.medias && weaving.medias[0] && weaving.medias[0].url}>
                {weaving.title}
            </a>
        </div>
    );
};

export default WeavingTitle;