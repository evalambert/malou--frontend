// pulic/scripts/preview-slider-transition-anim.js

// Keep the preview image visible when the page is loaded
document.addEventListener('astro:before-preparation', (event) => {
    // Vérifier si l'élément cliqué est un descendant de .work-list avant de fixer l'image poru la transition

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
                    wrapperElement.classList.remove(
                        'preview-image--wrapper-visible'
                    );
                }, 5000);
            }
            return;
        }
    }
    if (document.body.classList.contains('on-slug-page')) {
        // Fermer l'accordéon avant de quitter la page
        window.dispatchEvent(new CustomEvent('closeAccordionDescription'));
        // Scroller en haut de la page de catégorie après retour
        //window.scrollTo({ top: 0, behavior: 'smooth' });
    }


});
