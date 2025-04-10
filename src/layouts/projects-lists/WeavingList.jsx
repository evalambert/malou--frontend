import { useEffect, useState } from 'react';
import { navigate } from 'astro:transitions/client';

import WeavingTitle from '../../components/common/title/WeavingTitle.jsx';

const WeavingList = ({
    homepageWeavings,
    hiddenWeavings,
    targetHref,
    lang,
    className,
}) => {
    const [accordionOffsetY, setAccordionOffsetY] = useState(0); // Décalage causé par l'accordéon
    const [hiddenListHeightWeaving, setHiddenListHeightWeaving] = useState(0);

    useEffect(() => {
        // Attendre que le DOM soit prêt
        const hiddenList = document.querySelector('.hidden-list-weaving');
        if (!hiddenList) return; // Protection contre les éléments null

        const hiddenListHeightValue = hiddenList.clientHeight;

        setHiddenListHeightWeaving(hiddenListHeightValue);
    }, [homepageWeavings, hiddenWeavings]);

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
    const [translateXValue, setTranslateXValue] = useState(
        window.innerWidth < 768 ? '0px' : '100vw'
    );
    const [maxHeightValue, setmaxHeightValue] = useState('0px');
    const [mobileTopValue, setMobileTopValue] = useState('unset');
    const [isOnWeavingPage, setIsOnWeavingPage] = useState(false);
    const [isOnIndexPage, setIsOnIndexPage] = useState(false);

    const toggleListDisplay = (url, category, accordionY) => {
        if (url.includes(category)) {
            setTranslateYValue(accordionY + 'px');
            setTranslateXValue(0);
            setIsOnWeavingPage(true);
            setIsOnIndexPage(false);
            if (window.innerWidth < 768) {
                let weavingListHeight =
                    document.querySelector('.weaving-list').clientHeight;
                setmaxHeightValue(weavingListHeight + 'px');
                setTranslateXValue('0px');
                if (weavingListHeight > window.innerHeight / 2) {
                    setMobileTopValue('50vh');
                } else {
                    let newMobileTopValue =
                        window.innerHeight - (weavingListHeight + 50);
                    setMobileTopValue(newMobileTopValue + 'px');
                }
            }
        } else if (url == '/fr/' || url == '/en/') {
            if (window.innerWidth < 768) {
                setTranslateYValue('100vh');
                setTranslateXValue('0px');
                setmaxHeightValue('0px');
            } else {
                setTranslateYValue(hiddenListHeightWeaving + 'px');
                setTranslateXValue('150px'); // 150 = padding-right de last li de la homepageList
                setmaxHeightValue('300vh');
            }
            setIsOnWeavingPage(false);
            setIsOnIndexPage(true);
        } else {
            setTranslateYValue('100vh');
            if (window.innerWidth < 768) {
                setTranslateXValue('0px');
                setmaxHeightValue('0px');
            } else {
                setmaxHeightValue('unset');
            }
            setIsOnWeavingPage(false);
            setIsOnIndexPage(false);
        }
    };

    useEffect(() => {
        toggleListDisplay(targetHref, 'weaving', accordionOffsetY);
    }, [targetHref, hiddenListHeightWeaving, accordionOffsetY]);

    const homepageWeavingPadding = {
        lotissement: 'pr-[442px]',
        'fenetres-avec-vues': 'pr-[329px]',
        'temps-libre': 'pr-[267px]',
        'memento-i': 'pr-[303px]',
        'memento-ii': 'pr-[371px]',
        'loguivy-de-la-mer': 'pr-[347px]',
        'une-ville-ou-il-fait-chaud': 'pr-[313px]',
        'google-maps': 'pr-[253px]',
        'chez-claude': 'pr-[191px]',
        volcan: 'pr-[150px]',
    };
    const hiddenWeavingPadding = {
        'amphore-maison': 'pr-[164px]',
        'bouilloire-et-train-sifflant': 'pr-[192px]',
        'la-porte-de-mes-souvenirs': 'pr-[110px]',
        'salon-moderne': 'pr-[48px]',
        reverie: 'pr-[0px]',
    };

    const orderedSlugs = [
        'amphore-maison',
        'bouilloire-et-train-sifflant',
        'la-porte-de-mes-souvenirs',
        'salon-moderne',
        'reverie',
    ];

    // 1. Extraire slug + title
    const normalizedHidden = hiddenWeavings.map((weaving) => ({
        ...weaving,
        slug: weaving.slug || weaving.attributes?.slug,
        title: weaving.title || weaving.attributes?.title,
    }));

    // 2. Trier selon l’ordre défini
    const manuallySorted = orderedSlugs
        .map((slug) => normalizedHidden.find((w) => w.slug === slug))
        .filter(Boolean); // retire les undefined au cas où un slug ne matche pas

    // 3. Le reste, hors de l’ordre manuel
    const remaining = normalizedHidden.filter(
        (w) => !orderedSlugs.includes(w.slug)
    );

    // 4. Trier les restants par longueur de titre décroissante
    /*     const remainingSorted = remaining.sort(
        (a, b) => a.title.length - b.title.length
    );
    const finalSortedHiddenWeavings = [...manuallySorted, ...remainingSorted]; */

    // 5. Fusionner
    const finalSortedHiddenWeavings = [...manuallySorted, ...remaining];

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Render
    return (
        <>
            <div
                className={`work-list weaving-list-wrapper relative right-0 overflow-hidden transition-all duration-1000 ease-in-out md:fixed md:!top-[unset] md:bottom-0 ${className} ${isOnIndexPage ? 'pointer-events-auto cursor-pointer' : ''} ${!isOnWeavingPage && !isOnIndexPage ? 'pointer-events-none' : ''} `}
                onClick={
                    !isOnWeavingPage
                        ? () =>
                              navigate(`/${lang}/weaving/`, {
                                  history: 'push',
                              })
                        : undefined
                }
                style={{
                    maxHeight: `${maxHeightValue}`,
                    top: `${mobileTopValue}`,
                }}
            >
                <div
                    className={`weaving-list flex flex-col items-end overflow-hidden transition-all duration-1000 ease-in-out ${!isOnWeavingPage ? 'pointer-events-none' : ''} `}
                    style={{
                        transform: `translate(${translateXValue}, ${translateYValue})`,
                    }}
                >
                    {/* Liste Homepage */}
                    <ul className='flex w-fit flex-col items-end'>
                        {homepageWeavings.map((weaving) => {
                            const slug = weaving.slug; // ou .slug directement selon ta structure
                            const paddingClass =
                                homepageWeavingPadding[slug] || 'pr-0'; // fallback si non trouvé

                            return (
                                <li
                                    key={weaving.id}
                                    className={`weaving-title w-fit ${paddingClass}`}
                                >
                                    <WeavingTitle
                                        weaving={weaving}
                                        lang={lang}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                    {/* (END) Liste Homepage */}

                    <div
                        className={`hidden-list-weaving overflow-hidden transition-all delay-[0.2s] duration-1000 ease-in-out`}
                    >
                        {/* Liste Hidden */}
                        {/* {isOnWeavingPage && ( */}
                        <ul className='flex w-fit flex-col items-end'>
                            {finalSortedHiddenWeavings.map((weaving) => {
                                const slug = weaving.slug;
                                hiddenWeavingPadding[slug] || 'pr-0';
                                const paddingClass =
                                    hiddenWeavingPadding[weaving.slug] ||
                                    'pr-0';

                                return (
                                    <li
                                        className={`weaving-title w-fit ${paddingClass}`}
                                        key={weaving.id}
                                    >
                                        <WeavingTitle
                                            weaving={weaving}
                                            lang={lang}
                                        />
                                    </li>
                                );
                            })}
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
