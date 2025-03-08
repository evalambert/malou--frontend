// Actu.jsx
import EventItem from "../components/EventItem";
import useEventManager from "../hooks/useEventManager";
import useDateFormatter from "../hooks/useDateFormatter";

const Actu = ({ actus, lang }) => {
  const { formatEventDate } = useDateFormatter();
  const { inProgressEvents, pastEvents } = useEventManager(actus);

  return (
    <div className="wrapper-actu flex flex-col gap-10 text-center">
      <section className="current-envents flex gap-10 flex-col">
        <h2 className="inline-block -rotate-25 self-center">
          {lang === "fr" ? "actualités" : "news"}
        </h2>
        {inProgressEvents.length > 0 && (
          <ul className="current-events-list flex flex-col gap-4">
            {inProgressEvents.map((actu) => (
              <EventItem
                key={actu.id}
                actu={actu}
                lang={lang}
                formatEventDate={formatEventDate}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="past-events flex flex-col gap-10">
        {pastEvents.length > 0 && (
          <h2 className="inline-block rotate-25 self-center">
            {lang === "fr" ? "passées" : "past"}
          </h2>
        )}
        {pastEvents.length > 0 ? (
          <ul className="past-events-list flex flex-col gap-4">
            {pastEvents.map((actu) => (
              <EventItem
                key={actu.id}
                actu={actu}
                lang={lang}
                formatEventDate={formatEventDate}
              />
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
