// src/lib/store.js
import { atom } from 'nanostores'

// Stocke l'état actif ("about" ou "actu")
export const activeComponent = atom('about')
export const textWhite = atom(false)
export const transitionP = atom(false)

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
  textWhite.set(false);
  console.log('textWhite value:', textWhite.get());
}
export const toggleToWhite = () => {
  textWhite.set(true)
}


// export const toggleTransitionPage = () => {
//   transitionP.set(transitionP.get() === true ? false : true)
//   const handleStart = () => {
//     transitionPage.set(transitionPage.get() === true ? false : true)
//     console.log('Transition starting...');
//   };
//   document.addEventListener('astro:before-preparation', handleStart);

//   // const handleEnd = () => {
//   //   transitionPage.set(transitionPage.get() === true ? false : true)
//   //   console.log('Transition ending...');
//   // };

//   // document.addEventListener('astro:before-preparation', handleStart);
//   // document.addEventListener('astro:after-preparation', handleEnd);


//   // return () => {
//   //   document.removeEventListener('astro:before-preparation', handleStart);
//   //   document.removeEventListener('astro:after-preparation', handleEnd);
//   // };
// }

