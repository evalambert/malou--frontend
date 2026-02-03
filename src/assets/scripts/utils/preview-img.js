// src/assets/scripts/utils/preview-img.js
import { getCloudinaryUrl } from '../lib/cloudinary';

const getPreviewElements = () => {
    return {
        wrapperElement: document.querySelector('.preview-image--wrapper'),
        coverImage: document.querySelector('.dynamic-image-cover'),
        containImage: document.querySelector('.dynamic-image-contain'),
    };
};

const showPreviewVariant = (objectFit) => {
    const { coverImage, containImage } = getPreviewElements();
    if (!coverImage || !containImage) return;

    const showCover = objectFit !== 'contain';
    coverImage.style.opacity = showCover ? '1' : '0';
    coverImage.style.visibility = showCover ? 'visible' : 'hidden';
    containImage.style.opacity = showCover ? '0' : '1';
    containImage.style.visibility = showCover ? 'hidden' : 'visible';
};

const setPreviewSrc = (imageUrl, objectFit, width) => {
    const { coverImage, containImage } = getPreviewElements();
    const targetImage = objectFit === 'contain' ? containImage : coverImage;
    if (!targetImage) return;

    const smallUrl = getCloudinaryUrl(imageUrl, { width });
    targetImage.src = smallUrl;
    targetImage.dataset.lastImage = smallUrl;
};

export const handleMouseEnter = (imageUrl, objectFit) => {
    const { wrapperElement } = getPreviewElements();

    if (
        !document.querySelector('body').classList.contains('on-slug-page') &&
        wrapperElement &&
        !wrapperElement.classList.contains('preview-image--wrapper-visible')
    ) {
        showPreviewVariant(objectFit);
        // ✅ Appel version allégée depuis Cloudinary
        setPreviewSrc(imageUrl, objectFit, 800);

        // ✅ Préchargement propre sans DOM
        const mediumUrl = getCloudinaryUrl(imageUrl, { width: 2000 });
        const preloadImg = new Image();
        preloadImg.src = mediumUrl;
        // Le navigateur le mettra en cache automatiquement
    }
    if (wrapperElement) {
        wrapperElement.style.opacity = '1';
    }
};

export const handleMouseClick = (imageUrl, objectFit = 'cover') => {
    const { wrapperElement } = getPreviewElements();

    if (
        !document.querySelector('body').classList.contains('on-slug-page') &&
        wrapperElement &&
        !wrapperElement.classList.contains('preview-image--wrapper-visible')
    ) {
        showPreviewVariant(objectFit);
        // ✅ Appel version allégée depuis Cloudinary
        setPreviewSrc(imageUrl, objectFit, 2000);
        if (wrapperElement) {
            wrapperElement.style.opacity = '1';
            wrapperElement.classList.add('preview-image--wrapper-visible');
        }
    }
};

export const handleMouseLeave = () => {
    const { wrapperElement } = getPreviewElements();

    if (!document.body.classList.contains('on-slug-page')) {
        if (
            wrapperElement &&
            !wrapperElement.classList.contains('preview-image--wrapper-visible')
        ) {
            wrapperElement.style.opacity = '0';
        }
    }
};
