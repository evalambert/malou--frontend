export const handleMouseEnter = (imageUrl) => {    
    const imageElement = document.querySelector('.dynamic-image');
    const wrapperElement = document.querySelector('.preview-image--wrapper');
    if (!document.body.classList.contains('on-slug-page') && !wrapperElement.classList.contains('preview-image--wrapper-visible')) {
        if (imageElement) {
            imageElement.src = imageUrl;
            imageElement.dataset.lastImage = imageUrl;
        }
        if (wrapperElement) {
            wrapperElement.style.opacity = '1';
        }
    }
};

export const handleMouseLeave = () => {
    const wrapperElement = document.querySelector('.preview-image--wrapper');
    if (!document.body.classList.contains('on-slug-page')) {
        if (wrapperElement && !wrapperElement.classList.contains('preview-image--wrapper-visible')) {
            wrapperElement.style.opacity = '0';
        }
    }
};

