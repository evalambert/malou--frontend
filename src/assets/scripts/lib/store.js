// src/lib/store.js
import { atom } from 'nanostores';

// ——————————————————————————————————————————————————————————————————
// Variables
// ——————————————————————————————————————————————————————————————————

// État actif ("about" ou "actu")
export const activeComponent = atom('about');

// Hauteurs des sections
export const heightAbout = atom(0);
export const heightActu = atom(0);

// ——————————————————————————————————————————————————————————————————
// Functions
// ——————————————————————————————————————————————————————————————————

// Actu/About basculer entre les deux états
export const toggleComponent = () => {
    activeComponent.set(activeComponent.get() === 'about' ? 'actu' : 'about');
};
