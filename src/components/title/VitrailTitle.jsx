import { useState, useEffect } from 'react';



const VitrailTitle = ({ vitrail, lang }) => {

    // Fonction pour gérer le survol et changer l'image
    const handleMouseEnter = (imageUrl) => {
        const imageElement = document.querySelector('.dynamic-image');
        const wrapperElement = document.querySelector('.dynamic-image--wrapper');
        if (imageElement) {
            imageElement.src = imageUrl;
        }
        if (wrapperElement) {
            wrapperElement.style.opacity = '1';
        }
    };

    const handleMouseLeave = () => {
        const wrapperElement = document.querySelector('.dynamic-image--wrapper');
        if (wrapperElement) {
            wrapperElement.style.opacity = '0';
        }
    };

    // Render
    return (
        <div>
            <a
                href={`/${lang}/vitrail/${vitrail.slug}/`}
                className={`flex flex-col items-end`}
                onMouseEnter={() => {
                    const mediaUrl = vitrail.medias && vitrail.medias[0] && vitrail.medias[0].url;
                    if (mediaUrl) {
                        handleMouseEnter(mediaUrl);
                    }
                }}
                onMouseLeave={handleMouseLeave}
                data-image-preview={vitrail.medias && vitrail.medias[0] && vitrail.medias[0].url}
            >
                {vitrail.title.split(' ').map((word, i, words) => (
                    <div key={i} className="volume-word-wrapper inline-block transition-all duration-300 ">
                        <div className="inline-block transition-all duration-300 h-[25px]">
                            {word.split('').map((letter, j) => (
                                <span key={j} className="">{letter}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </a>
        </div>
    );
};

export default VitrailTitle;