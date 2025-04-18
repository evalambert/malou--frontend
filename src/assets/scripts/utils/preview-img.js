// src/assets/scripts/utils/preview-img.js
import { getCloudinaryUrl } from '../lib/cloudinary';

export const handleMouseEnter = (imageUrl, objectFit) => {
    const imageElement = document.querySelector('.dynamic-image');
    const wrapperElement = document.querySelector('.preview-image--wrapper');

    if (
        !document.querySelector('body').classList.contains('on-slug-page') &&
        !wrapperElement.classList.contains('preview-image--wrapper-visible')
    ) {
        if (imageElement) {
            // ✅ Appel version allégée depuis Cloudinary
            const smallUrl = getCloudinaryUrl(imageUrl, { width: 800 });
            imageElement.src = smallUrl;
            imageElement.dataset.lastImage = smallUrl;
        }
        if (wrapperElement) {
            wrapperElement.style.opacity = '1';
        }
        // if (objectFit === 'cover') {
        //     imageElement.style.objectFit = 'cover';
        // } else if (objectFit === 'contain') {
        //     imageElement.style.objectFit = 'contain';
        // }
    }
};

export const handleMouseClick = (imageUrl) => { 
    const imageElement = document.querySelector('.dynamic-image');
    const wrapperElement = document.querySelector('.preview-image--wrapper');

    if (
        !document.querySelector('body').classList.contains('on-slug-page') &&
        !wrapperElement.classList.contains('preview-image--wrapper-visible')
    ) {
        if (imageElement) {
            // ✅ Appel version allégée depuis Cloudinary
            const transitionUrl = getCloudinaryUrl(imageUrl, { width: 2000 });
            imageElement.src = transitionUrl;
            imageElement.dataset.lastImage = transitionUrl;
            console.log('Image clicked:', transitionUrl);
        }
        if (wrapperElement) {
            wrapperElement.style.opacity = '1';
        }
    }
};

export const handleMouseLeave = () => {
    const wrapperElement = document.querySelector('.preview-image--wrapper');
    if (!document.body.classList.contains('on-slug-page')) {
        if (
            wrapperElement &&
            !wrapperElement.classList.contains('preview-image--wrapper-visible')
        ) {
            wrapperElement.style.opacity = '0';
        }
    }
};
