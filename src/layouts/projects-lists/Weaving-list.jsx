import { useEffect, useState } from 'react';
import { navigate } from 'astro:transitions/client';

import { useStore } from '@nanostores/react';
import { textWhite } from '../../lib/store.js';

import WeavingTitle from "../../components/title/WeavingTitle.jsx";

const WeavingList = ({
    dataWeaving,
    isOnWeavingPage,
    targetHref,
    hidden,
    lang,
    className,
}) => {
    const [accordionOffsetY, setAccordionOffsetY] = useState(0); // Décalage causé par l'accordéon
    const isTextWhite = useStore(textWhite);

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

    const liTitle = document.querySelectorAll("li.weaving-title");
    liTitle.forEach((li) => {
      if (li && li.nextElementSibling) {
        const nextLiWidth = li.nextElementSibling.offsetWidth;
        li.style.marginRight = `${nextLiWidth}px`;
      }
    });
  }, [dataWeaving]);


    /*   console.log(dataWeaving);
     */

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

    const translateX = isOnWeavingPage ? 0 : hiddenListWidthWeaving;
    const translateY = isOnWeavingPage
        ? accordionOffsetY
        : hiddenListHeightWeaving;

    // Render
    return (
        <>
            <div
                className={`work-list fixed right-0 bottom-0 transition-all duration-1000 ease-in-out  ${
                    isTextWhite ? 'text-white' : 'text-black '
                } ${className} ${!isOnWeavingPage ? 'cursor-pointer' : ''} ${
                    !hidden ? '' : 'translate-y-full translate-x-full'
                }`}
                onClick={
                    !isOnWeavingPage
                        ? () =>
                              navigate(`/${lang}${targetHref}`, {
                                  history: 'push',
                              })
                        : undefined
                }
            >
                <div
                    className={`grid auto-cols-auto auto-rows-min transition-all duration-1000 ease-in-out ${
                        !isOnWeavingPage ? 'pointer-events-none' : ''
                    }`}
                    style={{
                        transform: `translate(${translateX}px, ${translateY}px)`,
                    }}
                >
                    {/* Liste Homepage */}
                    <ul className='w-fit flex flex-col items-end'>
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
                        className={`hidden-list-weaving overflow-hidden col-start-2 row-start-2 transition-all duration-1000 ease-in-out delay-[0.2s]`}
                    >
                        {/* Liste Hidden */}
                        {/* {isOnWeavingPage && ( */}
                        <ul className='w-fit flex flex-col items-end'>
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
            <PreviewImg />
        </>
    );
};

export default WeavingList;
