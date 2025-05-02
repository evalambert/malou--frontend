//src/layouts/Actu.jsx
import { useStore } from '@nanostores/react';
import { useMemo, useRef, useEffect, useState } from 'react';
import {
    activeComponent,
    toggleComponent,
    heightActu,
    heightAbout,
} from '../../assets/scripts/lib/store.js';
import EventItem from './EventItem.jsx';
import useEventManager from '../../assets/scripts/hooks/useEventManager.js';
import useDateFormatter from '../../assets/scripts/hooks/useDateFormatter.js';

export default function ActuComponent({ actus, lang }) {
    const active = useStore(activeComponent); // On récupère l'état global
    const actuRef = useRef(null);
    const aboutHeight = useStore(heightAbout);
    const [isMobile, setIsMobile] = useState(false);
    //const [show, setShow] = useState(false);

    /* ----- FadeIn animation onEnter AboutPage ---- */
    /* useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []); */

    /* ------ aboutHeight ------ */
    // Fonction pour recalculer la hauteur
    const updateHeight = () => {
        if (actuRef.current) {
            heightActu.set(actuRef.current.scrollHeight);
        }
    };

    // Mettre à jour la hauteur lors du montage et du resize
    useEffect(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    const { formatEventDate } = useDateFormatter();
    const { inProgressEvents, pastEvents } = useMemo(
        () => useEventManager(actus),
        [actus]
    );

    /* ------ isMobile ------ */
    useEffect(() => {
        // Vérifie si window est accessible et met à jour isMobile
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile(); // Exécute au montage
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    return (
        <section
            ref={actuRef}
            className={`section--actu mix-blend-target absolute right-0 flex w-full flex-col gap-10 text-center ${
                active === 'actu'
                    ? 'overflow-y-auto md:top-[30vh] md:h-full'
                    : 'overflow-hidden md:top-[calc(100vh-70px)] md:h-[70px]'
            } transition-all duration-500 ease-in-out`} /* ${show ? 'opacity-100' : 'opacity-0'} */
            style={
                isMobile
                    ? { top: active === 'actu' ? '0px' : `${aboutHeight}px` }
                    : {}
            }
        >
            <button
                className='button-actu--desktop hidden md:block md:rotate-[-25deg] md:p-4'
                onClick={toggleComponent}
            >
                {lang === 'fr' ? 'actualités' : 'news'}
            </button>

            <div className='events-wrapper flex flex-col gap-10'>
                <div className='current-events flex flex-col gap-10'>
                    <ul className='current-events-list flex flex-col gap-4'>
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

                <div className='past-events flex flex-col gap-10'>
                    {pastEvents.length > 0 && (
                        <h2 className='inline-block rotate-25 self-center'>
                            {lang === 'fr' ? 'passées' : 'past'}
                        </h2>
                    )}
                    {pastEvents.length > 0 ? (
                        <ul className='past-events-list flex flex-col gap-4'>
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
                            {lang === 'fr'
                                ? 'aucune actualité passée'
                                : 'no past events'}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
