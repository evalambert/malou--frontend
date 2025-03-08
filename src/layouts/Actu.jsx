// Actu.jsx
const formatEventDate = (startDate, endDate, eventDate, lang) => {
  const formatDate = (date, withYear = false) => {
    if (!date) return null;
    const d = new Date(date);
    let formatted = `${d.getDate().toString().padStart(2, "0")}.${(
      d.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;
    if (withYear) formatted += `.${d.getFullYear().toString().slice(-2)}`;
    return formatted;
  };

  const formatDateTime = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return `${formatDate(date, true)} ${lang === "fr" ? "à" : "at"} ${d
      .getHours()
      .toString()
      .padStart(2, "0")}h${d.getMinutes().toString().padStart(2, "0")}`;
  };

  if (eventDate) return formatDateTime(eventDate);

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Si même mois et même année
    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      return `${start.getDate().toString().padStart(2, "0")}.${(
        start.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}–${end.getDate().toString().padStart(2, "0")}.${(
        end.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}.${end.getFullYear().toString().slice(-2)}`;
    }
    // Si mois différents
    return `${formatDate(startDate)}–${formatDate(endDate, true)}`;
  }

  return lang === "fr" ? "Date inconnue" : "Unknown date";
};

const Actu = ({ actus, lang }) => {
  const currentDate = new Date();

  // Fonction pour déterminer si un événement est en cours
  const isEventInProgress = (actu) => {
    const eventDate = actu.eventDate ? new Date(actu.eventDate) : null;
    const startDate = actu.startDate ? new Date(actu.startDate) : null;
    const endDate = actu.endDate ? new Date(actu.endDate) : null;

    // Pour un événement unique (avec eventDate)
    if (eventDate) {
      const eventEndDate = new Date(eventDate);
      eventEndDate.setHours(23, 59, 59);
      return eventEndDate >= currentDate;
    }

    // Pour un événement sur période (avec startDate et endDate)
    if (startDate && endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59);
      return startDate <= currentDate && endOfDay >= currentDate;
    }

    return false;
  };

  // Trier les événements par date (du plus récent au plus ancien)
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

  return (
    <div className="wrapper-actu flex flex-col gap-10 text-center">
      <section className="current-envents flex gap-10 flex-col">
        <h2 className="inline-block -rotate-25 self-center">
          {lang === "fr" ? "actualités" : "news"}
        </h2>
        {inProgressEvents.length > 0 && (
          <ul className="current-events-list flex flex-col gap-4">
            {inProgressEvents.map((actu) => (
              <li key={actu.id}>
                {/*  {actu.image?.url && (
                  <img src={actu.image.url} alt={actu.title} />
                )} */}
                <p>
                  {formatEventDate(
                    actu.startDate,
                    actu.endDate,
                    actu.eventDate,
                    lang
                  )}
                </p>
                <h3>{actu.title}</h3>
                <p>{`${actu.structure} ${actu.city} (${actu.country})`}</p>
                <p>{actu.categories?.map((cat) => cat.title).join(", ")}</p>
                <a href={actu.link} target="_blank" rel="noopener noreferrer">
                  {lang === "fr" ? "lire plus…" : "read more…"}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="past-events flex flex-col gap-10">
        {inProgressEvents.length > 0 && (
          <h2 className="inline-block rotate-25 self-center">
            {lang === "fr" ? "passées" : "past"}
          </h2>
        )}
        {pastEvents.length > 0 ? (
          <ul className="past-events-list flex flex-col gap-4">
            {pastEvents.map((actu) => (
              <li key={actu.id}>
                {/* {actu.image?.url && (
                  <img src={actu.image.url} alt={actu.title} />
                )} */}
                <p>
                  {formatEventDate(
                    actu.startDate,
                    actu.endDate,
                    actu.eventDate,
                    lang
                  )}
                </p>
                <h3>{actu.title}</h3>
                <p>{`${actu.structure} ${actu.city} (${actu.country})`}</p>
                <p>{actu.categories?.map((cat) => cat.title).join(", ")}</p>
                <a href={actu.link} target="_blank" rel="noopener noreferrer">
                  {lang === "fr" ? "lire plus…" : "read more…"}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>{lang === "fr" ? "aucune actualité passée" : "no past events"}</p>
        )}
      </section>
    </div>
  );
};

export default Actu;
