//src/layouts/About.jsx
import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import gsap from 'gsap';
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
    /*    const [show, setShow] = useState(false);
    const [fadeOut, setFadeOut] = useState(false); */

    /* ----- FadeIn animation onEnter AboutPage ---- */
    /*     useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []); */

    /* ------ Close ActuComponent onEnter AboutPage ------ */
    useEffect(() => {
        // On force la réinitialisation de activeComponent à 'about' à chaque fois que AboutPage est montée
        activeComponent.set('about');
    }, []); // Le tableau vide garantit que cet effet s'exécute seulement lors du montage de AboutPage

    /* ------actuHeight ------ */
    // Fonction pour recalculer la hauteur et vérifier la taille de l'écran
    const updateHeight = () => {
        if (aboutRef.current) {
            heightAbout.set(aboutRef.current.scrollHeight);
        }
    };

    // Mettre à jour la hauteur lors du montage et du resize
    useEffect(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

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
            ref={aboutRef}
            className={`section--about mix-blend-target absolute left-0 flex w-full flex-col gap-3 md:fixed md:right-0 ${
                active === 'about'
                    ? 'md:top-0 md:h-full'
                    : 'md:top-[calc(-100vh)] md:h-0'
            } ${show ? 'opacity-100' : 'opacity-0'} ${
                fadeOut ? 'opacity-0 transition-opacity duration-1000' : ''
            } overflow-hidden transition-all duration-500 ease-in-out`}
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
                {/*  <p>{about.studio}, {about.city}</p> */}
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
