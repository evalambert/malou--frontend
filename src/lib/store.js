// src/lib/store.js
import { atom } from 'nanostores'

// Stocke l'état actif ("about" ou "actu")
export const activeComponent = atom('about')
export const textWhite = atom(false)

// Stocke les hauteurs des sections
export const heightAbout = atom(0);
export const heightActu = atom(0);


// Fonction pour basculer entre les deux états
export const toggleComponent = () => {
  activeComponent.set(activeComponent.get() === 'about' ? 'actu' : 'about')
}

export const toggleTextColor = () => {
  textWhite.set(textWhite.get() === true ? false : true)
}
export const toggleToBlack = () => {
  //console.log('toggleToBlack called');
  textWhite.set(false);
  //console.log('textWhite value:', textWhite.get());
}
export const toggleToWhite = () => {
  textWhite.set(true)
}
