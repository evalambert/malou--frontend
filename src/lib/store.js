// src/lib/store.js
import { atom } from 'nanostores'

// Stocke l'état actif ("about" ou "actu")
export const activeComponent = atom('about')


// Stocke les hauteurs des sections
export const heightAbout = atom(0);
export const heightActu = atom(0);


// Fonction pour basculer entre les deux états
export const toggleComponent = () => {
  activeComponent.set(activeComponent.get() === 'about' ? 'actu' : 'about')
}

