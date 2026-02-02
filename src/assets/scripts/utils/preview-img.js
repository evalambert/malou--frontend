// src/assets/scripts/utils/preview-img.js
import { getCloudinaryUrl } from '../lib/cloudinary';  

export const handleMouseEnter = (imageUrl, objectFit) => {
    const imageElement = document.querySelector('.dynamic-image');
    const wrapperElement = document.querySelector('.preview-image--wrapper');

    if (!imageElement || !wrapperElement) return;

    if (
        !document.querySelector('body').classList.contains('on-slug-page') &&
        !wrapperElement.classList.contains('preview-image--wrapper-visible')
    ) {
        // ✅ Appel version allégée depuis Cloudinary
        const smallUrl = getCloudinaryUrl(imageUrl, { width: 800 });

        // 🧠 Image temporaire pour éviter le flash (ancienne image + nouveau fit)
        const tempImg = new Image();
        tempImg.src = smallUrl;

        tempImg.onload = () => {
            imageElement.src = smallUrl;
            imageElement.dataset.lastImage = smallUrl;

            // ✅ Le object-fit est appliqué uniquement une fois la nouvelle image réellement chargée
            if (objectFit === 'cover') {
                imageElement.style.objectFit = 'cover';
            } else if (objectFit === 'contain') {
                imageElement.style.objectFit = 'contain';
            }

            wrapperElement.style.opacity = '1';
        };

        // ✅ Préchargement propre sans DOM
        const mediumUrl = getCloudinaryUrl(imageUrl, { width: 2000 });
        const preloadImg = new Image();
        preloadImg.src = mediumUrl;
        // Le navigateur le mettra en cache automatiquement
    }
};

export const handleMouseClick = (imageUrl) => { 
    const imageElement = document.querySelector('.dynamic-image');
    const wrapperElement = document.querySelector('.preview-image--wrapper');

    if (!imageElement || !wrapperElement) return;

    if (
        !document.querySelector('body').classList.contains('on-slug-page') &&
        !wrapperElement.classList.contains('preview-image--wrapper-visible')
    ) {
        // ✅ Appel version allégée depuis Cloudinary
        const transitionUrl = getCloudinaryUrl(imageUrl, { width: 2000 });

        const tempImg = new Image();
        tempImg.src = transitionUrl;

        tempImg.onload = () => {
            imageElement.src = transitionUrl;
            imageElement.dataset.lastImage = transitionUrl;
            console.log('Image clicked:', transitionUrl);

            wrapperElement.style.opacity = '1';
            wrapperElement.classList.add('preview-image--wrapper-visible');
        };
    }
};

export const handleMouseLeave = () => {
    const imageElement = document.querySelector('.dynamic-image');
    const wrapperElement = document.querySelector('.preview-image--wrapper');

    if (!document.body.classList.contains('on-slug-page')) {
        if (
            wrapperElement &&
            !wrapperElement.classList.contains('preview-image--wrapper-visible')
        ) {
            wrapperElement.style.opacity = '0';
        }
        if (imageElement) {
            imageElement.style.objectFit = '';
            //imageElement.src = ''; 
        }
    }
};
