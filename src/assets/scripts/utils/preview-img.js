export const handleMouseEnter = (imageUrl, objectFit) => {
    const imageElement = document.querySelector('.dynamic-image');
    const wrapperElement = document.querySelector('.preview-image--wrapper');



    if (
        !document.body.classList.contains('on-slug-page') &&
        !wrapperElement.classList.contains('preview-image--wrapper-visible')
    ) {
        if (imageElement) {
            imageElement.src = imageUrl;
            imageElement.dataset.lastImage = imageUrl;
        }
        if (wrapperElement) {
            wrapperElement.style.opacity = '1';
        }
        if (objectFit === 'cover') {
            imageElement.style.objectFit = 'cover';
        } else if (objectFit === 'contain') {
            imageElement.style.objectFit = 'contain';
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
        imageElement.style.objectFit = 'unset';
    }
};
