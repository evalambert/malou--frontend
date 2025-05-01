// src/lib/store.js
import { atom } from 'nanostores';

// ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
// Page About/Actu
// ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

// État actif ("about" ou "actu")
export const activeComponent = atom('about');

// Hauteurs des sections
export const heightAbout = atom(0);
export const heightActu = atom(0);

// Fonctions pour basculer entre les sections
export const toggleComponent = () => {
    activeComponent.set(activeComponent.get() === 'about' ? 'actu' : 'about');
};

// ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
// List States
// ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

// Fonction utilitaire pour extraire la catégorie depuis l'URL
function getPageState(pathname) {
    const match = pathname.match(/^\/[a-z]{2}\/?$/);
    if (match) return 'home';

    // Ajout pour détecter /about ou /about/
    const aboutMatch = pathname.match(/^\/about\/?$/);
    if (aboutMatch) return 'about';

    const catMatch = pathname.match(/^\/[a-z]{2}\/([^\/]+)(?:\/|$)/);
    if (catMatch) return catMatch[1];
    return null;
}

// Initialisation du store : on vérifie si window existe
let initialPathname = '';
if (typeof window !== 'undefined') {
    initialPathname = window.location.pathname;
}
export const pageState = atom(getPageState(initialPathname));
export const previousPageState = atom(null);

// Fonction pour mettre à jour le store lors d'un changement d'URL
export function updatePageState() {
    if (typeof window !== 'undefined') {
        
        pageState.set(getPageState(window.location.pathname));
    }
}


