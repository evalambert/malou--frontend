//layout/Actu.jsx

/* const Actu = ({ actus }) => {
    return (
      <div>
        <button>Actualités :</button>
        <ul>
          {actus.map((actu) => (
            <li key={actu.id}>
              <a href={`/actu/${actu.slug}/`}>{actu.title}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
export default Actu;
  

 */

const Actu = ({ actus }) => {
  const currentDate = new Date(); // Récupérer la date actuelle

  // Filtrer les actualités passées (date < aujourd'hui)
  const pastEvents = actus.filter((actu) => {
    const eventDate = new Date(actu.eventDate); // Utiliser eventDate pour la comparaison
    return eventDate < currentDate;
  });

  // Filtrer les actualités en cours (date >= aujourd'hui)
  const inProgressEvents = actus.filter((actu) => {
    const eventDate = new Date(actu.eventDate); // Utiliser eventDate pour la comparaison
    return eventDate >= currentDate;
  });

  return (
    <div>
      <button>actualités :</button>
      <ul>
        {inProgressEvents.length > 0 ? (
          inProgressEvents.map((actu) => (
            <li key={actu.id}>
              <a href={`/actu/${actu.slug}/`}>{actu.title}</a>
            </li>
          ))
        ) : (
          <p>Aucune actualité en cours.</p>
        )}
      </ul>

      <h3>passées :</h3>
      <ul>
        {pastEvents.length > 0 ? (
          pastEvents.map((actu) => (
            <li key={actu.id}>
              <a href={`/actu/${actu.slug}/`}>{actu.title}</a>
            </li>
          ))
        ) : (
          <p>Aucune actualité passée.</p>
        )}
      </ul>
    </div>
  );
};

export default Actu;
