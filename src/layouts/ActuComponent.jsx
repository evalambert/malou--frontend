//src/layouts/Actu.jsx
import { useStore } from "@nanostores/react";
import { useMemo } from "react";

import { activeComponent, toggleComponent } from "../lib/store.js";
import EventItem from "../components/EventItem.jsx";
import useEventManager from "../hooks/useEventManager.js";
import useDateFormatter from "../hooks/useDateFormatter.js";

export default function ActuComponent({ actus, lang }) {
  const { formatEventDate } = useDateFormatter();
  const { inProgressEvents, pastEvents } = useMemo(
    () => useEventManager(actus),
    [actus]
  );

  const active = useStore(activeComponent); // On récupère l'état global

  return (
    <section
      className={`section--actu absolute right-0 flex flex-col gap-10 w-full bg-white md:bg-transparent
       ${
         active === "actu"
           ? "h-full top-[333px] md:top-[30vh] overflow-y-auto"
           : "h-0 top-[100vh] md:h-[70px] md:top-[calc(100vh-70px)] overflow-hidden"
       } text-center transition-all duration-500 ease-in-out`}
    >
      <button
        className="button-actu--desktop hidden md:block md:rotate-[-25deg] md:p-4"
        onClick={toggleComponent}
      >
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
