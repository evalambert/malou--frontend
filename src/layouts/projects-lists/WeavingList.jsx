import { useEffect, useState } from 'react';
import { navigate } from 'astro:transitions/client';

import { useStore } from '@nanostores/react';

import WeavingTitle from '../../components/common/title/WeavingTitle.jsx';

const WeavingList = ({ dataWeaving, targetHref, lang, className }) => {
    const [accordionOffsetY, setAccordionOffsetY] = useState(0); // Décalage causé par l'accordéon

    const [hiddenListHeightWeaving, setHiddenListHeightWeaving] = useState(0);
    const [hiddenListWidthWeaving, setHiddenListWidthWeaving] = useState(0);

    useEffect(() => {
        // Attendre que le DOM soit prêt
        const hiddenList = document.querySelector('.hidden-list-weaving');
        if (!hiddenList) return; // Protection contre les éléments null

        const hiddenListHeightValue = hiddenList.clientHeight;
        const hiddenListWidthValue = hiddenList.clientWidth;

        setHiddenListHeightWeaving(hiddenListHeightValue);
        setHiddenListWidthWeaving(hiddenListWidthValue);

        const liTitle = document.querySelectorAll('li.weaving-title');
        liTitle.forEach((li) => {
            if (li && li.nextElementSibling) {
                const nextLiWidth = li.nextElementSibling.offsetWidth;
                li.style.marginRight = `${nextLiWidth}px`;
            }
        });
    }, [dataWeaving]);



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

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Toogle hidden/compact/full
    const [translateYValue, setTranslateYValue] = useState('100vh');
    const [translateXValue, setTranslateXValue] = useState('100vw');
    const [isOnWeavingPage, setIsOnWeavingPage] = useState(false);
    const [isOnIndexPage, setIsOnIndexPage] = useState(false);

    const toggleListDisplay = (url, category, accordionY) => {
        if (url.includes(category)) {
            setTranslateYValue(accordionY + 'px');
            setTranslateXValue(0);
            setIsOnWeavingPage(true);
            setIsOnIndexPage(false);
        } else if (url == '/fr/' || url == '/en/') {
            setTranslateYValue(hiddenListHeightWeaving + 'px');
            setTranslateXValue(hiddenListWidthWeaving + 'px');
            setIsOnWeavingPage(false);
            setIsOnIndexPage(true);
        } else {
            setTranslateYValue('100vh');
            setTranslateXValue('100vw');
            setIsOnWeavingPage(false);
            setIsOnIndexPage(false);
        }
    };

    useEffect(() => {
        toggleListDisplay(targetHref, 'weaving', accordionOffsetY);
    }, [targetHref, hiddenListHeightWeaving, accordionOffsetY]);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Render
    return (
        <>
            <div
                className={`work-list fixed right-0 bottom-0 transition-all duration-1000 ease-in-out  ${className} ${isOnIndexPage ? 'cursor-pointer pointer-events-auto' : ''} ${!isOnWeavingPage && !isOnIndexPage ? 'pointer-events-none' : ''} `}
                onClick={
                    !isOnWeavingPage
                        ? () =>
                              navigate(`/${lang}/weaving/`, {
                                  history: 'push',
                              })
                        : undefined
                }
            >
                <div
                    className={`grid transition-all auto-cols-auto auto-rows-min duration-1000 ease-in-out ${!isOnWeavingPage ? 'pointer-events-none' : ''}`}
                    style={{
                        transform: `translate(${translateXValue}, ${translateYValue})`,
                    }}
                >
                    {/* Liste Homepage */}
                    <ul className='flex w-fit flex-col items-end'>
                        {dataWeaving.slice(0, 5).map((weaving) => (
                            <li
                                className='weaving-title w-fit'
                                key={weaving.id}
                            >
                                <WeavingTitle weaving={weaving} lang={lang} />
                            </li>
                        ))}
                    </ul>
                    {/* (END) Liste Homepage */}
                    <div
                        className={`hidden-list-weaving col-start-2 row-start-2 overflow-hidden transition-all delay-[0.2s] duration-1000 ease-in-out`}
                    >
                        {/* Liste Hidden */}
                        {/* {isOnWeavingPage && ( */}
                        <ul className='flex w-fit flex-col items-end'>
                            {dataWeaving.slice(5).map((weaving) => (
                                <li
                                    className='weaving-title w-fit'
                                    key={weaving.id}
                                >
                                    <WeavingTitle
                                        weaving={weaving}
                                        lang={lang}
                                    />
                                </li>
                            ))}
                        </ul>
                        {/* )} */}
                        {/* (END) Liste Hidden */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default WeavingList;
