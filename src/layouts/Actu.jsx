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
    if (withYear) formatted += `.${d.getFullYear()}`;
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
  if (startDate && endDate)
    return `${formatDate(startDate)}–${formatDate(endDate, true)}`;

  return lang === "fr" ? "Date inconnue" : "Unknown date";
};

const Actu = ({ actus, lang }) => {
  const currentDate = new Date();

  const pastEvents = actus.filter((actu) => {
    const eventDate = actu.eventDate ? new Date(actu.eventDate) : null;
    const endDate = actu.endDate ? new Date(actu.endDate) : null;
    return (
      (eventDate && eventDate < currentDate) ||
      (endDate && endDate < currentDate)
    );
  });

  const inProgressEvents = actus.filter((actu) => {
    const eventDate = actu.eventDate ? new Date(actu.eventDate) : null;
    const startDate = actu.startDate ? new Date(actu.startDate) : null;
    const endDate = actu.endDate ? new Date(actu.endDate) : null;
    return (
      eventDate >= currentDate ||
      (startDate && startDate <= currentDate && endDate >= currentDate)
    );
  });

  return (
    <div className="wrapper-actus flex flex-col gap-10 text-center">
      <div className="actus-current flex gap-10 flex-col">
        <h2 className="inline-block -rotate-25 self-center">
          {lang === "fr" ? "actualités" : "news"}
        </h2>
        {inProgressEvents.length > 0 && (
          <ul className="actus-current-list flex flex-col gap-4">
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
      </div>
      <div className="actus-past flex flex-col gap-10">
        {pastEvents.length > 0 && (
          <h2 className="inline-block rotate-25 self-center">
            {lang === "fr" ? "passées" : "past"}
          </h2>
        )}
        {pastEvents.length > 0 ? (
          <ul className="actu-past-list flex flex-col gap-4">
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
      </div>
    </div>
  );
};

export default Actu;
