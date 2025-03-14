import { toggleToBlack, toggleToWhite } from "./store.js";

export function setupBlackTextPage() {
  // Exécuter au chargement initial
  document.addEventListener('DOMContentLoaded', () => {
    toggleToBlack();
  });
  
  // Exécuter à chaque navigation vers cette page
  document.addEventListener('astro:page-load', () => {
    toggleToBlack();
  });
}

export function setupWhiteTextPage() {
  // Exécuter au chargement initial
  document.addEventListener('DOMContentLoaded', () => {
    toggleToWhite();
  });
  
  // Exécuter à chaque navigation vers cette page
  document.addEventListener('astro:page-load', () => {
    toggleToWhite();
  });
} 