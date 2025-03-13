//
import { atom } from 'nanostores'

// Stocke l'état actif ("about" ou "actu")
export const activeComponent = atom('about')

// Fonction pour basculer entre les deux états
export const toggleComponent = () => {
  activeComponent.set(activeComponent.get() === 'about' ? 'actu' : 'about')
}
