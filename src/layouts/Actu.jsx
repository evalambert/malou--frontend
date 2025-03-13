//src/layouts/Actu.jsx
import { useStore } from "@nanostores/react";
import { useMemo } from "react";

import { activeComponent, toggleComponent } from "../lib/store.js";
import EventItem from "../components/EventItem";
import useEventManager from "../hooks/useEventManager";
import useDateFormatter from "../hooks/useDateFormatter";

export default function Actu({ actus, lang }) {
  const { formatEventDate } = useDateFormatter();
  const { inProgressEvents, pastEvents } = useMemo(
    () => useEventManager(actus),
    [actus]
  );

  const active = useStore(activeComponent); // On récupère l'état global

  return (
    <section
      className={`section--actu w-full absolute right-0 transition-all duration-500 ease-in-out overflow-y-auto
       ${
         active === "actu"
           ? "h-full top-[calc(100vh-70vh)]"
           : "h-[80px] top-[calc(100vh-80px)]"
       } flex flex-col gap-10 text-center`}
    >
      <button className="rotate-[-25deg] p-4" onClick={toggleComponent}>
        {lang === "fr" ? "actualités" : "news"}
      </button>

      <div className="events-wrapper flex flex-col gap-10">
        <div className="current-events flex flex-col gap-10">
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
        </div>

        <div className="past-events flex flex-col gap-10">
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
            <p>
              {lang === "fr" ? "aucune actualité passée" : "no past events"}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
