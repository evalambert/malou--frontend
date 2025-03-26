import { useState, useEffect } from 'react';

const PaintingTitle = ({ painting, lang }) => {
    
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
            <a href={`/${lang}/painting/${painting.slug}/`} className="block whitespace-nowrap" onMouseEnter={() => {
                const mediaUrl = painting.medias && painting.medias[0] && painting.medias[0].url;
                if (mediaUrl) {
                    handleMouseEnter(mediaUrl);
                }
            }}
                onMouseLeave={handleMouseLeave}
                data-image-preview={painting.medias && painting.medias[0] && painting.medias[0].url}>
                {painting.title.split('').map((letter, index) => (
                    <span className="inline-block" key={index}>{letter}</span>
                ))}
            </a>
        </div>
    );
};

export default PaintingTitle;