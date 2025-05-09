// src/layouts/projects-lists/PoetryList.jsx

import { useEffect, useState, useRef } from 'react';
import { navigate } from 'astro:transitions/client';
import gsap from 'gsap';
import PoetryTitle from '../../components/common/title/PoetryTitle';
import PoetryTitleHardLayout from './PoetryTitleHardLayout';

const PoetryList = ({ dataPoetry, targetHref, state, lang, className }) => {

    // const poetryWrapperInner = document.querySelector('.poetry-wrapper-inner');


    // const showPoetryWrapperInner = () => {
    //     poetryWrapperInner.style.opacity = 1;
    //     // poetryWrapperInner.style.transform = 'translateX(0vw)';
    //     poetryWrapperInner.style.transform = 'translateX(-100vw)';
    //     setTimeout(() => {
    //         poetryWrapperInner.style.transform = 'translateX(0vw)';
    //     }, 200);
    // }



    // // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // // Toogle hidden/compact/full;
    const [translateXValue, setTranslateXValue] = useState('-200vw');
    const [opacityValue, setOpacityValue] = useState(1);
    const [isOnPoetryPage, setIsOnPoetryPage] = useState(false);
    const [isOnIndexPage, setIsOnIndexPage] = useState(false);
    const [isOnSlugPage, setIsOnSlugPage] = useState(false);

    const [accordionOffsetY, setAccordionOffsetY] = useState(0);
    const poetryWrapperRef = useRef(null);
    /**
 * Gestion du décalage vertical du titre en fonction de l'accordéon
 */
    useEffect(() => {
        // Écoute l'événement personnalisé émis par l'accordéon
        const handleAccordionMovement = (event) => {
            // Récupère l'état de l'accordéon et sa hauteur depuis l'événement
            const { isAccordionOpen, accordionHeight } = event.detail;
            // Applique un décalage négatif égal à la hauteur de l'accordéon si ouvert, sinon revient à 0
            setAccordionOffsetY(isAccordionOpen ? -accordionHeight : 0);
        };

        // Ajout de l'écouteur d'événement
        window.addEventListener(
            'accordionDescriptionToggle',
            handleAccordionMovement
        );

        // Nettoyage de l'écouteur lors du démontage du composant
        return () => {
            window.removeEventListener(
                'accordionDescriptionToggle',
                handleAccordionMovement
            );
        };
    }, []);
    useEffect(() => {
        console.log('accordionOffsetY', accordionOffsetY);
        if (window.innerWidth < 768) {
            if (accordionOffsetY < 0) {
                let newAccordionOffsetY = accordionOffsetY;
                console.log('newAccordionOffsetY', newAccordionOffsetY);
                poetryWrapperRef.current.style.transform = `translateY(${newAccordionOffsetY}px)`;
            }else{
                poetryWrapperRef.current.style.transform = `translateY(0px)`;
            }
        }
    }, [accordionOffsetY]);

    // const hiddenListHeightPoetry = 100;

    const toggleListDisplay = (category) => {
        const hiddenListPoetry = document.querySelector('.poetry-wrapper-inner');
        const hiddenListWidthPoetry = hiddenListPoetry.getBoundingClientRect().width;
        const halfHiddenListWidthPoetry = 0; // /!\ Calcul n'est pas le même si elle as plus de livre -- a tester !
        // const paintingList = document.querySelector('.painting-list');
        // const halfHiddenListWidthPoetry = paintingList?.children.length > 0 ? hiddenListPoetry.offsetWidth - 160 : 0;

        if (state == category) {
            // ON PAGE POETRY ************************************************************************************************
            setTranslateXValue(0 + 'px');
            setIsOnPoetryPage(true);
            setIsOnIndexPage(false);
            if (!document
                .querySelector('body')
                .classList.contains('on-slug-page')) {
                setIsOnSlugPage(false);
                gsap.fromTo(hiddenListPoetry, {
                    x: "-100vw",
                }, {
                    x: 0,
                    duration: 1,
                });
            } else {
                setIsOnSlugPage(true);
            }
            // showPoetryWrapperInner();

            // Création et dispatch de l'événement personnalisé
            const poetryPageEvent = new CustomEvent('poetryPageStateChange', {
                detail: {
                    isOnPoetryPage: true,
                },
            });
            window.dispatchEvent(poetryPageEvent);

        } else if (state == 'home') {
            // ON PAGE INDEX ************************************************************************************************
            if (window.innerWidth < 768) {

            } else {
                setTimeout(() => {

                    setTranslateXValue('0px')
                    // setTranslateXValue('-' + hiddenListWidthPoetry + 'px');
                    setOpacityValue(1);
                    // setTranslateXValue('-' + halfHiddenListWidthPoetry + 'px');
                    document
                        .querySelector('.poetry-wrapper')
                        .classList.add(
                            'transition-transform',
                            'duration-1000',
                            'ease-in-out'
                        );
                }, 50);
            }
            setIsOnPoetryPage(false);
            setIsOnIndexPage(true);

        } else {
            // ON HIDDDEN ************************************************************************************************
            setTranslateXValue('-200vw');
            setIsOnPoetryPage(false);
            setIsOnIndexPage(false);
        }
    };

    useEffect(() => {
        toggleListDisplay('poetry');

        // // ANIMATION ON DIRECT ENTERING POETRY PAGE
        // if (targetHref.endsWith(`/${lang}/poetry/`) ) {
        //     document.querySelector('.poetry-wrapper').style.transition =
        //     'opacity 1000ms';
        // document.querySelector('.poetry-wrapper').style.opacity = 1;
        // }
    }, [targetHref, translateXValue]);

    // Calculer et transmettre la largeur de .poetry-wrapper via CustomEvent
    useEffect(() => {
        const handleResize = () => {
            const poetryWrapper = document.querySelector('.poetry-wrapper');
            if (poetryWrapper) {
                const width = poetryWrapper.getBoundingClientRect().width;


                // Émission d'un événement personnalisé pour informer les autres composants
                // de la nouvelle largeur de poetry-wrapper
                const event = new CustomEvent('poetryWrapperWidthChange', {
                    detail: { width },
                });
                window.dispatchEvent(event);
            }
        };

        // Écouter la demande initiale de largeur
        const handleInitialRequest = () => {
            handleResize();
        };
        window.addEventListener(
            'requestPoetryWrapperWidth',
            handleInitialRequest
        );
        // Écoute des changements de taille de la fenêtre
        window.addEventListener('resize', handleResize);

        // Calcul initial de la largeur au montage du composant
        handleResize();

        // Nettoyage des écouteurs d'événements au démontage
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener(
                'requestPoetryWrapperWidth',
                handleInitialRequest
            );
        };
    }, []);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Render
    return (
        <>
            <div
                className={`poetry-wrapper-wrap fixed top-0 left-0 z-[9] h-screen ${className} ${isOnIndexPage ? 'pointer-events-auto w-[80px] cursor-pointer' : ''} ${!isOnPoetryPage && !isOnIndexPage ? 'pointer-events-none w-fit' : ''}`}
                onClick={
                    !isOnPoetryPage
                        ? () =>
                            navigate(`/${lang}/poetry/`, {
                                history: 'push',
                            })
                        : undefined
                }
            >
                <div
                    className={`work-list flex ${isOnIndexPage ? 'pointer-events-none' : ''} `}
                >
                    <div
                        className='poetry-wrapper px-body-p-x fixed top-0 left-0 flex translate-y-[20px] max-md:transition-transform max-md:duration-1000 max-md:ease-in-out '
                        ref={poetryWrapperRef}
                        style={{
                            opacity: opacityValue,
                            transform: `translateX(${translateXValue})`,
                        }}
                    >

                        {/* // Piste de recherche : mémoriser certains états après executions des animations pour les réinjecter à d'autres moments
                        // Voir exemples — suivre les *(0__0)* dans PoetryTitleHardLayout.jsx */}
                        <div className={`poetry-wrapper-inner flex pt-[30px] transition-[width] duration-1000 ${isOnIndexPage ? 'opacity-0 pointer-events-none w-0' : 'pointer-events-auto opacity-100 w-fit'}`}>
                            {dataPoetry
                                .filter(
                                    (poetry) =>
                                        poetry.slug !==
                                        'comme-un-serpent-dans-une-flute' &&
                                        poetry.slug !==
                                        'des-coquilles-et-des-pepins'
                                )
                                .map((poetry) => (
                                    <div key={poetry.id}>
                                        <PoetryTitle
                                            className=''
                                            pathOpen={
                                                poetry.svgPath?.svgPathOpenData ||
                                                ''
                                            }
                                            pathClose={
                                                poetry.svgPath?.svgPathCloseData ||
                                                ''
                                            }
                                            lang={lang}
                                            title={poetry.title}
                                            targetHref={targetHref}
                                            isOnSlugPage={isOnSlugPage}
                                            keyId={poetry.id}
                                            client:only='react'
                                            transition:name='poetrytitles'
                                            transition:persist
                                            slug={poetry.slug}
                                        />
                                    </div>
                                ))}
                        </div>
                        <PoetryTitleHardLayout
                            lang={lang}
                            targetHref={targetHref}
                            isOnSlugPage={isOnSlugPage}
                            client:only='react'
                            state={state}
                            transition:name='poetryhardlayout'
                            transition:persist
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PoetryList;
export const client = 'only';
