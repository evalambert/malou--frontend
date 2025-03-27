/**
 * Hook personnalisé pour la gestion et le tri des événements
 * @param {Array} actus - Liste des événements à gérer
 * @returns {Object} Objet contenant les événements triés par statut (en cours et passés)
 */
const useEventManager = (actus) => {
    const currentDate = new Date();

    /**
     * Détermine si un événement est en cours
     * @param {Object} actu - Événement à vérifier
     * @param {string} actu.eventDate - Date pour un événement unique
     * @param {string} actu.startDate - Date de début pour un événement sur période
     * @param {string} actu.endDate - Date de fin pour un événement sur période
     * @returns {boolean} true si l'événement est en cours, false sinon
     */
    const isEventInProgress = (actu) => {
        const eventDate = actu.eventDate ? new Date(actu.eventDate) : null;
        const startDate = actu.startDate ? new Date(actu.startDate) : null;
        const endDate = actu.endDate ? new Date(actu.endDate) : null;

        // Pour un événement unique (avec eventDate)
        if (eventDate) {
            const eventEndDate = new Date(eventDate);
            eventEndDate.setHours(23, 59, 59); // L'événement est considéré en cours jusqu'à la fin de la journée
            return eventEndDate >= currentDate;
        }

        // Pour un événement sur période (avec startDate et endDate)
        if (startDate && endDate) {
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59); // L'événement est considéré en cours jusqu'à la fin du dernier jour
            return startDate <= currentDate && endOfDay >= currentDate;
        }

        return false;
    };

    /**
     * Trie les événements du plus récent au plus ancien
     * @param {Array} events - Liste des événements à trier
     * @returns {Array} Liste des événements triés par date (du plus récent au plus ancien)
     * Ordre de priorité pour le tri :
     * 1. eventDate pour les événements uniques
     * 2. endDate pour les événements sur période
     * 3. startDate comme fallback
     */
    const sortEvents = (events) => {
        return events.sort((a, b) => {
            const dateA = a.eventDate
                ? new Date(a.eventDate)
                : a.endDate
                  ? new Date(a.endDate)
                  : new Date(a.startDate);
            const dateB = b.eventDate
                ? new Date(b.eventDate)
                : b.endDate
                  ? new Date(b.endDate)
                  : new Date(b.startDate);
            return dateB - dateA;
        });
    };

    // Filtrer et trier les événements
    const inProgressEvents = sortEvents(actus.filter(isEventInProgress));
    const pastEvents = sortEvents(
        actus.filter((actu) => !isEventInProgress(actu))
    );

    return { inProgressEvents, pastEvents };
};

export default useEventManager;
