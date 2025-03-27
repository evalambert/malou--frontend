/**
 * Hook personnalisé pour le formatage des dates des événements
 * @returns {Object} Objet contenant la fonction formatEventDate
 */
const useDateFormatter = () => {
  /**
   * Formate une date au format JJ.MM ou JJ.MM.AA
   * @param {string} date - Date à formater
   * @param {boolean} withYear - Inclure l'année dans le format (default: false)
   * @returns {string|null} Date formatée ou null si pas de date
   */
  const formatDate = (date, withYear = false) => {
    if (!date) return null
    const d = new Date(date)
    let formatted = `${d.getDate().toString().padStart(2, '0')}.${(
      d.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}`
    if (withYear) formatted += `.${d.getFullYear().toString().slice(-2)}`
    return formatted
  }

  /**
   * Formate une date avec heure au format JJ.MM.AA à HH:MM
   * @param {string} date - Date à formater
   * @param {string} lang - Langue ('fr' ou 'en')
   * @returns {string|null} Date et heure formatées ou null si pas de date
   */
  const formatDateTime = (date, lang) => {
    if (!date) return null
    const d = new Date(date)
    return `${formatDate(date, true)} ${lang === 'fr' ? 'à' : 'at'} ${d
      .getHours()
      .toString()
      .padStart(2, '0')}h${d.getMinutes().toString().padStart(2, '0')}`
  }

  /**
   * Formate la date d'un événement selon son type
   * @param {string} startDate - Date de début pour un événement sur période
   * @param {string} endDate - Date de fin pour un événement sur période
   * @param {string} eventDate - Date pour un événement unique
   * @param {string} lang - Langue ('fr' ou 'en')
   * @returns {string} Date formatée selon le type d'événement :
   * - Événement unique : "15.09.23 à 18h30"
   * - Événement sur période même mois : "15.10–17.10.23"
   * - Événement sur période mois différents : "15.09–17.10.23"
   */
  const formatEventDate = (startDate, endDate, eventDate, lang) => {
    // Cas 1 : Événement unique avec eventDate
    if (eventDate) return formatDateTime(eventDate, lang)

    // Cas 2 : Événement sur période avec startDate et endDate
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)

      // Si même mois et même année
      if (
        start.getMonth() === end.getMonth() &&
        start.getFullYear() === end.getFullYear()
      ) {
        return `${start.getDate().toString().padStart(2, '0')}.${(
          start.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}–${end.getDate().toString().padStart(2, '0')}.${(
          end.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}.${end.getFullYear().toString().slice(-2)}`
      }
      // Si mois différents
      return `${formatDate(startDate)}–${formatDate(endDate, true)}`
    }

    // Cas 3 : Aucune date valide
    return lang === 'fr' ? 'Date inconnue' : 'Unknown date'
  }

  return { formatEventDate }
}

export default useDateFormatter
