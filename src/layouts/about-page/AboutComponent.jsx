import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { fadeState } from '../../assets/scripts/utils/fadeMemory.js';
import {
    activeComponent,
    toggleComponent,
    heightAbout,
    heightActu,
} from '../../assets/scripts/lib/store.js';

export default function AboutComponent({ about, lang }) {
    const active = useStore(activeComponent);
    const aboutRef = useRef(null);
    const actuHeight = useStore(heightActu);
    const [isMobile, setIsMobile] = useState(false);
    const [show, setShow] = useState(fadeState.about);

    /* ------ FadeIn animation onEnter on AboutPage ------ */
    useEffect(() => {
        // Si fadeState.about est false, on lance le fade-in
        if (!fadeState.about) {
            const timer = setTimeout(() => {
                setShow(true);
                fadeState.about = true;
            }, 500); // ou la durée que tu veux
            return () => clearTimeout(timer);
        } else {
            // Si fadeState.about est déjà true, on ne fait rien
            setShow(true);
        }
    }, []);

    /* ------ Reset fadeIn onLeave AboutPage ------ */
    useEffect(() => {
        return () => {
            const stillOnAbout = window.location.pathname.includes('/about');
            if (!stillOnAbout) {
                console.log('[AboutComponent] 👋 On quitte la page About');
                fadeState.about = false;
            } else {
                console.log(
                    '[AboutComponent] ⏹ Toujours sur About, pas de reset'
                );
            }
        };
    }, []);

    /* ------ Forcer "about" actif ------ */
    useEffect(() => {
        activeComponent.set('about');
    }, []);

    /* ------ Calcul hauteur ------ */
    useEffect(() => {
        const updateHeight = () => {
            if (aboutRef.current) {
                heightAbout.set(aboutRef.current.scrollHeight);
            }
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    /* ------ Détection mobile ------ */
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    return (
        <section
            ref={aboutRef}
            className={`section--about mix-blend-target absolute left-0 flex w-full flex-col gap-3 md:fixed md:right-0 ${
                active === 'about'
                    ? 'md:top-0 md:h-full'
                    : 'md:top-[calc(-100vh)] md:h-0'
            } ${show ? 'opacity-100' : 'opacity-0'} overflow-hidden transition-all duration-500 ease-in-out`}
            style={
                isMobile
                    ? { top: active === 'about' ? '0px' : `${actuHeight}px` }
                    : {}
            }
        >
            <button
                className={`button-about hidden rotate-[19deg] transition-opacity duration-300 md:fixed md:top-0 md:left-[270px] md:block md:rotate-[27.28deg] md:p-6 ${active === 'about' ? 'opacity-0' : 'opacity-100'}`}
                onClick={toggleComponent}
            >
                {lang === 'fr' ? 'à propos' : 'about'}
            </button>

            <div className='wrapper--bio flex md:order-2'>
                <div className='fake-nav hidden w-[170px] flex-none md:block'></div>
                <p className='bio'>{about.bio}</p>
            </div>

            <div className='wrapper--email flex md:order-1'>
                <div className='fake-nav hidden h-[131px] w-[270px] flex-none md:block'></div>
                <div className='email flex flex-1 items-center justify-center'>
                    <p className='rotate-[-16deg] px-4 py-9 md:rotate-[10.87deg] md:px-0 md:py-0'>
                        {about.email}
                    </p>
                </div>
            </div>

            <div className='wrappper--phone flex justify-end md:order-3 md:justify-start'>
                <p className='rotate-[15.72deg] pt-[8px] pb-[24px] md:rotate-45 md:ps-[47px] md:pt-[31px]'>
                    {about.phone}
                </p>
            </div>

            <div className='wrapper--credits flex flex-1 flex-col items-center justify-end text-center md:order-4 md:items-end md:pe-20'>
                <div className='flex h-fit rotate-[-16deg] flex-col items-center justify-center pt-[5px] pb-[50px] md:px-4 md:py-12'>
                    <p>©{about.update}</p>
                    <p>
                        {lang === 'fr' ? (
                            <>
                                Conception et <br />
                                développement <br />
                                <a href='https://greta-oto.xyz'>Greta oto</a>
                            </>
                        ) : (
                            <>
                                Design and <br />
                                development <br />
                                <a href='https://greta-oto.xyz'>Greta oto</a>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </section>
    );
}
