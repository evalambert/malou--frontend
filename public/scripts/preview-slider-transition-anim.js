// Keep the preview image visible when the page is loaded
document.addEventListener('astro:before-preparation', (event) => {
    console.log('ALICE ALICE ALICE astro:before-preparation <:-)');
    const wrapperElement = document.querySelector(
        '.preview-image--wrapper'
    );
    if (wrapperElement) {
        wrapperElement.style.opacity = '1';
        wrapperElement.classList.add('preview-image--wrapper-visible');
    }
});
// Goback prevew image animation
document.addEventListener('astro:after-swap', (event) => {
    console.log('ALICE  astro:after-swap <:-)');
    const wrapperElement = document.querySelector(
        '.preview-image--wrapper'
    );
    const body = document.body;
    if (
        wrapperElement.classList.contains(
            'preview-image--wrapper-visible'
        ) &&
        !body.classList.contains('on-slug-page')
    ) {
        wrapperElement.style.animation =
            'preview-img-animation 1s ease reverse';
        wrapperElement.classList.remove('preview-image--wrapper-visible');
        wrapperElement.addEventListener('animationend', () => {
            wrapperElement.style.removeProperty('animation');
            wrapperElement.style.removeProperty('opacity');
        });
    }
});