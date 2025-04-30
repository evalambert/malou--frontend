// pulic/scripts/preview-slider-transition-anim.js

// --- Gestion état global Accordéon ---
let isAccordionDescriptionOpen = false;

// Met à jour l'état global lorsque l'accordéon notifie son changement
window.addEventListener('accordionDescriptionToggle', (event) => {
  if (event.detail && typeof event.detail.isAccordionOpen !== 'undefined') {
    isAccordionDescriptionOpen = event.detail.isAccordionOpen;
    // console.log('Accordion state updated:', isAccordionDescriptionOpen);
  }
});
// --- Fin Gestion état global Accordéon ---

// Keep the preview image visible when the page is loaded
document.addEventListener('astro:before-preparation', (event) => {
    const clickedElement = event.sourceElement; // Élément qui a déclenché la navigation
    const link = clickedElement?.closest('a'); // Trouve le lien parent si clic sur un élément dans <a>

    // --- 1. Gestion spécifique au clic sur .work-list ---
    // const workList = document.querySelectorAll('.work-list');
    // let isWorkListClick = false;
    // for (const work of workList) {
    //     if (work.contains(clickedElement)) {
    //         isWorkListClick = true;
    //         // Garde l'image de prévisualisation visible (logique existante)
    //         const wrapperElement = document.querySelector(
    //             '.preview-image--wrapper'
    //         );
    //         if (wrapperElement) {
    //             console.log('Work list item clicked, handling preview image.');
    //             console.log('hello preview');
    //             wrapperElement.style.opacity = '1';
    //             wrapperElement.classList.add('preview-image--wrapper-visible');
    //             // Note: Le timeout original était de 5000ms ici
    //             setTimeout(() => {
    //                 wrapperElement.style.opacity = '0';
    //                 console.log('byebye preview');
    //                 wrapperElement.classList.remove(
    //                     'preview-image--wrapper-visible'
    //                 );
    //             }, 5000);
    //         }
    //         // Important: Décidez si un clic sur work-list doit aussi être intercepté par l'accordéon.
    //         // Si oui, ne pas 'return' ici. Si non, vous pourriez 'return' ici.
    //         // Pour l'instant, on continue pour potentiellement appliquer la logique accordéon aussi.
    //         break;
    //     }
    // }

    // --- 2. Interception de navigation sur slug page si accordéon ouvert ---
    if (document.body.classList.contains('on-slug-page') && link) {
        // Vérifier si le lien mène réellement hors de la page actuelle
        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(link.href, window.location.href); // Résout les URLs relatives

        // Est-ce une navigation vers une page *différente* ?
        // (Ignore les changements de hash sur la même page, ou les liens identiques)
        const isNavigatingAway = !(
          targetUrl.origin === currentUrl.origin &&
          targetUrl.pathname === currentUrl.pathname &&
          targetUrl.search === currentUrl.search // On ignore le hash pour cette comparaison
        );

        // Si on navigue ailleurs ET que l'accordéon est ouvert...
        if (isNavigatingAway && isAccordionDescriptionOpen) {
            // console.log('Accordion open, intercepting navigation to:', targetUrl.href);
            event.preventDefault(); // Empêche Astro de naviguer immédiatement

            const navigateToUrl = targetUrl.href;
            let navigationTimeout = null;

            const handleConfirm = () => {
                // console.log('Accordion closed confirmed, navigating to:', navigateToUrl);
                window.removeEventListener('accordionClosedConfirmed', handleConfirm);
                clearTimeout(navigationTimeout); // Annule le timeout de sécurité

                // Utilise Astro.navigate si disponible (mieux pour View Transitions)
                if (typeof Astro !== 'undefined' && Astro.navigate) {
                    console.log('8i8 -> Astro.navigate');
                    Astro.navigate(navigateToUrl);
                } else {
                    console.log('8i8 -> window.location.href');
                    window.location.href = navigateToUrl; // Fallback uniquement si Astro.navigate n'est pas disponible
                }
            };

            // Écoute la confirmation de fermeture
            window.addEventListener('accordionClosedConfirmed', handleConfirm);

            // Demande la fermeture de l'accordéon
            // console.log('Dispatching closeAccordionDescription');
            window.dispatchEvent(new CustomEvent('closeAccordionDescription'));

            // Sécurité : si la confirmation ne vient pas dans les 800ms
            navigationTimeout = setTimeout(() => {
                // console.warn('Accordion close confirmation timeout. Navigating anyway to:', navigateToUrl);
                window.removeEventListener('accordionClosedConfirmed', handleConfirm);
                 if (typeof Astro !== 'undefined' && Astro.navigate) {
                    Astro.navigate(navigateToUrl);
                    console.log('8i8 -> Astro.navigate');
                } else {
                    console.log('8i8 -> window.location.href');
                    window.location.href = navigateToUrl; // Fallback uniquement si Astro.navigate n'est pas disponible
                }
            }, 800); // Timeout (ajuster si besoin)

        } else if (isNavigatingAway) {
            // console.log('Accordion closed or N/A, proceeding navigation to:', targetUrl.href);
            // Si on navigue ailleurs mais l'accordéon est fermé, on laisse faire Astro
            // La logique existante dans votre fichier original qui dispatchait 'closeAccordionDescription'
            // ici est retirée car redondante si l'accordéon est déjà fermé.
        } else {
             console.log('Link click is not navigating away (e.g., anchor), allowing default.');
             // Si ce n'est pas une navigation (ex: ancre #), on laisse le comportement par défaut.
        }
    }
});
