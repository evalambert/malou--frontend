// Keep the preview image visible when the page is loaded
document.addEventListener('astro:before-preparation', (event) => {
    // Vérifier si l'élément cliqué est un descendant de .work-list
    const workList = document.querySelectorAll('.work-list');
    const clickedElement = event.sourceElement;
    for (const work of workList) {
        if (work.contains(clickedElement)) {
            const wrapperElement = document.querySelector(
                '.preview-image--wrapper'
            );
            if (wrapperElement) {
                wrapperElement.style.opacity = '1';
                wrapperElement.classList.add('preview-image--wrapper-visible');
                setTimeout(() => {
                    wrapperElement.style.opacity = '0';
                    wrapperElement.classList.remove('preview-image--wrapper-visible');
                }, 5000);
            }
            return;
        }
    }


});
// document.addEventListener('astro:after-swap', (event) => {
//     const wrapperElement = document.querySelector(
//         '.preview-image--wrapper'
//     );
//     const body = document.body;
//     if (wrapperElement &&  wrapperElement.classList.contains('preview-image--wrapper-visible') && !body.classList.contains('on-slug-page')) {
//         // wrapperElement.style.opacity = '0';
//         wrapperElement.classList.remove('preview-image--wrapper-visible');
//     }
// });