// src/layouts/projects-lists/PoetryList.jsx

import { useEffect, useState } from 'react';
import { navigate } from 'astro:transitions/client';

import PoetryTitle from '../../components/common/title/PoetryTitle';
import PoetryTitleHardLayout from './PoetryTitleHardLayout';

const PoetryList = ({ dataPoetry, targetHref, lang, className }) => {
    // // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // // Toogle hidden/compact/full;
    const [translateXValue, setTranslateXValue] = useState('0px');
    const [opacityValue, setOpacityValue] = useState(0);
    const [isOnPoetryPage, setIsOnPoetryPage] = useState(false);
    const [isOnIndexPage, setIsOnIndexPage] = useState(false);

    // const hiddenListHeightPoetry = 100;

    const toggleListDisplay = (url, category) => {
        const hiddenListPoetry = document.querySelector('.poetry-wrapper');
        const hiddenListWidthPoetry = hiddenListPoetry.offsetWidth;
        const halfHiddenListWidthPoetry = 0; // /!\ Calcul n'est pas le même si elle as plus de livre -- a tester !
        // const paintingList = document.querySelector('.painting-list');
        // const halfHiddenListWidthPoetry = paintingList?.children.length > 0 ? hiddenListPoetry.offsetWidth - 160 : 0;

        if (url.includes(category)) {
            // ON PAGE POETRY ************************************************************************************************
            setTranslateXValue(0 + 'px');
            setIsOnPoetryPage(true);
            setIsOnIndexPage(false);
            // console.log('On page poetry');
            // console.log('TranslateXValue', translateXValue);

            // Création et dispatch de l'événement personnalisé
            const poetryPageEvent = new CustomEvent('poetryPageStateChange', {
                detail: {
                    isOnPoetryPage: true,
                },
            });
            window.dispatchEvent(poetryPageEvent);

        } else if (url == '/fr/' || url == '/en/') {
            // ON PAGE INDEX ************************************************************************************************
            setTranslateXValue('-' + hiddenListWidthPoetry + 'px');
            setTimeout(() => {
                setOpacityValue(1);
                setTranslateXValue('-' + halfHiddenListWidthPoetry + 'px');
                document
                    .querySelector('.poetry-wrapper')
                    .classList.add(
                        'transition-transform',
                        'duration-1000',
                        'ease-in-out'
                    );
            }, 50);
            setIsOnPoetryPage(false);
            setIsOnIndexPage(true);
            // console.log('On page (index)');
            // console.log('TranslateXValue', translateXValue);

        } else {
            // ON HIDDDEN ************************************************************************************************
            // console.log('HIIIIIIDDDDEN');
            setTranslateXValue('-' + hiddenListWidthPoetry + 'px');
            setIsOnPoetryPage(false);
            setIsOnIndexPage(false);
        }
    };

    useEffect(() => {
        toggleListDisplay(targetHref, 'poetry');

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
                const width = poetryWrapper.offsetWidth;
                // console.log('Largeur de poetry-wrapper:', width);

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
                        className='poetry-wrapper px-body-p-x fixed top-0 left-0 flex translate-y-[20px] opacity-0 border border-amber-500'
                        style={{
                            opacity: opacityValue,
                            transform: `translateX(${translateXValue})`,
                        }}
                    >
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
                                        keyId={poetry.id}
                                        client:only='react'
                                        transition:name='poetrytitles'
                                        transition:persist
                                        slug={poetry.slug}
                                    />
                                </div>
                            ))} 

                        <PoetryTitleHardLayout
                            lang={lang}
                            targetHref={targetHref}
                            client:only='react'
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
