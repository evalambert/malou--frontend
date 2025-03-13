// Actu.jsx

import { useState } from "react";
import { useMemo } from "react";
import EventItem from "../components/EventItem";
import useEventManager from "../hooks/useEventManager";
import useDateFormatter from "../hooks/useDateFormatter";

const Actu = ({ actus, lang }) => {
  const { formatEventDate } = useDateFormatter();
  const { inProgressEvents, pastEvents } = useMemo(
    () => useEventManager(actus),
    [actus]
  );
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={`wrapper--actu w-full absolute right-0 transition-all duration-500 ease-in-out overflow-y-auto ${
          isOpen
            ? "h-full top-[calc(100vh-70vh)]"
            : "h-[80px] top-[calc(100vh-80px)]"
        } flex flex-col gap-10 text-center`}
      >
        <button
          className="rotate-[-25deg] p-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          {lang === "fr" ? "actualités" : "news"}
        </button>
        <div className="wrapper--events-list flex flex-col gap-10">
          <section className="current-events flex flex-col gap-10">
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
              <p>
                {lang === "fr" ? "aucune actualité passée" : "no past events"}
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Actu;
