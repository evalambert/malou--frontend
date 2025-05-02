import { useEffect, useState, useRef } from 'react';
import { navigate } from 'astro:transitions/client';

import WeavingTitle from '../../components/common/title/WeavingTitle.jsx';

const WeavingList = ({
    homepageWeavings,
    hiddenWeavings,
    targetHref,
    state,
    lang,
    className,
}) => {
    const [accordionOffsetY, setAccordionOffsetY] = useState(0); // Décalage causé par l'accordéon
    const [hiddenListHeightWeaving, setHiddenListHeightWeaving] = useState(0);
    const [isSlugPage, setIsSlugPage] = useState(false);
    const [firstRender, setFirstRender] = useState(false);

    const [tailwindSlideTrans, settailwindSlideTrans] = useState(true);

    // Ajout d'un state pour tracker le tissage actif
    const [activeWeavingSlug, setActiveWeavingSlug] = useState(null);

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

    const toggleListDisplay = (category, accordionY) => {
        if (state == category) {
            settailwindSlideTrans(true);
            setFirstRender(false);
            if (
                document
                    .querySelector('body')
                    .classList.contains('on-slug-page')
            ) {
                setTranslateYValue(accordionY + 'px');
            } else {
                setTranslateYValue(0 + 'px');
            }
            setTranslateXValue(0);
            setIsOnWeavingPage(true);
            setIsOnIndexPage(false);
            if (window.innerWidth < 768) {
                // MOBILE

                let weavingListHeight =
                    document.querySelector('.weaving-list').getBoundingClientRect().height;
                setmaxHeightValue(weavingListHeight + 'px');
                if (weavingListHeight < ((window.innerHeight / 2) - 130)) {
                    setMobileTopValue('calc(50vh - 130px)');
                    setmaxHeightValue('unset');
                } else {
                    let newMobileTopValue =
                        window.innerHeight - (weavingListHeight + 50);
                    setMobileTopValue(newMobileTopValue + 'px');
                    setmaxHeightValue('unset');
                }
            } else {
                setmaxHeightValue('100vh');
            }
        } else if (state == 'home') {
            setFirstRender(true);
            if (window.innerWidth < 768) {
                // MOBILE
                setTranslateYValue('0px');
                setTranslateXValue('0px');
                setmaxHeightValue('0px');
                setMobileTopValue('calc(100vh - 130px)');
            } else {
                setTranslateYValue(hiddenListHeightWeaving + 'px');
                setTranslateXValue('150px'); // 150 = padding-right de last li de la homepageList
                setmaxHeightValue('300vh');
            }
            setIsOnWeavingPage(false);
            setIsOnIndexPage(true);
        } else {
            settailwindSlideTrans(true);
            setFirstRender(false);
            // Réinitialiser accordionOffsetY quand on quitte une page de slug
            setAccordionOffsetY(0);
            if (window.innerWidth < 768) {
                // MOBILE
                setTranslateYValue('0px');
                setTranslateXValue('0px');
                setmaxHeightValue('0px');
                setMobileTopValue('calc(100vh - 130px)');
            } else {
                setmaxHeightValue('100vh');
                setTranslateYValue('100vh');
            }
            setIsOnWeavingPage(false);
            setIsOnIndexPage(false);
        }
    };

    // Mise en page homepageWeavingList and hiddenWeavingList
    useEffect(() => {
        const isOnSlugPage = document
            .querySelector('body')
            .classList.contains('on-slug-page');
        setIsSlugPage(isOnSlugPage);
        toggleListDisplay('weaving', accordionOffsetY);
    }, [targetHref, hiddenListHeightWeaving, accordionOffsetY]);

    const homepageWeavingPadding = {
        lotissement: 'md:pr-[442px]',
        'fenetres-avec-vues': 'pr-[px] md:pr-[329px] justify-center',
        'temps-libre': 'md:pr-[267px] justify-center',
        'memento-i': 'pr-[50px] md:pr-[303px] justify-end',
        'memento-ii': 'md:pr-[371px] justify-end',
        'loguivy-de-la-mer': 'md:pr-[347px] justify-center',
        'une-ville-ou-il-fait-chaud': 'md:pr-[313px]',
        'google-maps': 'pl-[30px] md:pr-[253px]',
        'chez-claude': 'md:pr-[191px] justify-center',
        volcan: 'pl-[60px] md:pr-[150px] justify-center',
    };
    const hiddenWeavingPadding = {
        'amphore-maison': 'md:pr-[164px] justify-end',
        'bouilloire-et-train-sifflant': 'md:pr-[192px] justify-start',
        'la-porte-de-mes-souvenirs': 'md:pr-[110px] justify-end',
        'salon-moderne': 'md:pr-[48px] justify-center',
        reverie: 'md:pr-[0px] justify-end',
    };

    // Order of hiddenWeavingList
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

    // 2. Trier selon l'ordre défini
    const manuallySorted = orderedSlugs
        .map((slug) => normalizedHidden.find((w) => w.slug === slug))
        .filter(Boolean); // retire les undefined au cas où un slug ne matche pas

    // 3. Le reste, hors de l'ordre manuel
    const remaining = normalizedHidden.filter(
        (w) => !orderedSlugs.includes(w.slug)
    );
    // 4. Fusionner
    const finalSortedHiddenWeavings = [...manuallySorted, ...remaining];

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // IMPLEMENTATION OF ACTIVE TITLE
    // Fonction pour extraire le slug de l'URL
    const extractSlugFromUrl = (url) => {
        const match = url.match(/\/weaving\/([^/]+)/);
        return match ? match[1] : null;
    };

    // Effet pour mettre à jour le tissage actif basé sur l'URL
    useEffect(() => {
        const slug = extractSlugFromUrl(targetHref);
        setActiveWeavingSlug(slug);
    }, [targetHref]);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Remove transition anim on langSwitch
    useEffect(() => {
        if (state == 'home' && firstRender) {
            settailwindSlideTrans(false);
        } else {
            settailwindSlideTrans(true);
        }
    }, [lang]);


    //  ••••••••••••  TEST ZONE CLICKABLE HOMEPAGE ••••••••••••
    const weavingListRef = useRef(null);
    const [dynamicHomepageWidth, setDynamicHomepageWidth] = useState(null);

    useEffect(() => {
        if (state === 'home') {
            const tryGetWidth = () => {
                if (weavingListRef.current) {
                    const width =
                        weavingListRef.current.getBoundingClientRect().width;
                    if (width > 0) {
                        setDynamicHomepageWidth(`${width}px`);
                        console.log(
                            '📏 Largeur WeavingList mesurée :',
                            width,
                            'px'
                        );
                    } else {
                        setTimeout(tryGetWidth, 100);
                    }
                } else {
                    setTimeout(tryGetWidth, 100);
                }
            };

            tryGetWidth();
        }
    }, [state, lang, homepageWeavings]);

    useEffect(() => {
        const handleResize = () => {
            if (state === 'home' && weavingListRef.current) {
                const width =
                    weavingListRef.current.getBoundingClientRect().width;
                setDynamicHomepageWidth(`${width}px`);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [state]);

    //  •••••••••••• (END) TEST ZONE CLICKABLE HOMEPAGE ••••••••••••

    // Render
    return (
        <>
            <div
                className={`work-list weaving-list-wrapper border relative right-0  pr-[6px]  md:fixed md:!top-[unset] md:bottom-[6px] ${className}  ${tailwindSlideTrans ? 'transition-all duration-1000 ease-in-out' : ''} ${isOnIndexPage ? 'pointer-events-auto cursor-pointer' : 'md:pt-[50px] w-full'} ${!isOnWeavingPage && !isOnIndexPage ? 'pointer-events-none' : ''} overflow-hidden md:overflow-visible ${isSlugPage ? 'pointer-events-none' : 'md:overflow-scroll '}`}
                style={{
                    maxHeight: `${maxHeightValue}`,
                    top: `${mobileTopValue}`,
                    transform: `translate(${translateXValue}, ${translateYValue})`,
                }}
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
                    className={`weaving-list flex flex-col items-end overflow-hidden transition-all duration-1000 ease-in-out ${!isOnWeavingPage ? 'pointer-events-none' : ''} `}
                >
                    {/* Liste Homepage */}
                    <ul className='flex w-[100%] max-w-[375px] flex-col items-end border md:w-fit md:max-w-[unset]'>
                        {homepageWeavings.map((weaving) => {
                            const slug = weaving.slug;
                            const paddingClass =
                                homepageWeavingPadding[slug] || 'pr-0';
                            const isActive = slug === activeWeavingSlug;

                            return (
                                <li
                                    key={weaving.id}
                                    className={`weaving-title flex w-[100%] md:block md:w-fit ${paddingClass} transition-opacity duration-500 ease-in-out ${isSlugPage && !isActive
                                            ? 'pointer-events-none opacity-0'
                                            : 'opacity-300'
                                        } ${isActive ? 'delay-100' : ''}`}
                                >
                                    <WeavingTitle
                                        weaving={weaving}
                                        lang={lang}
                                        isActive={isActive}
                                        accordionOffsetY={accordionOffsetY}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                    {/* (END) Liste Homepage */}

                    <div
                        className={`hidden-list-weaving w-[100%] overflow-hidden transition-all delay-[0.2s] duration-1000 ease-in-out md:w-fit`}
                    >
                        {/* Liste Hidden */}
                        {/* {isOnWeavingPage && ( */}
                        <ul className='flex w-[100%] flex-col items-end md:w-fit'>
                            {finalSortedHiddenWeavings.map((weaving) => {
                                const slug = weaving.slug;
                                const paddingClass =
                                    hiddenWeavingPadding[slug] || 'pr-0';
                                const isActive = slug === activeWeavingSlug;

                                return (
                                    <li
                                        className={`weaving-title flex w-[100%] max-w-[375px] justify-end md:block md:w-fit md:max-w-[unset] ${paddingClass} transition-opacity duration-500 ease-in-out ${isSlugPage && !isActive
                                                ? 'pointer-events-none opacity-0'
                                                : 'opacity-300'
                                            } ${isActive ? 'delay-100' : ''}`}
                                        key={weaving.id}
                                    >
                                        <WeavingTitle
                                            weaving={weaving}
                                            lang={lang}
                                            isActive={isActive}
                                            accordionOffsetY={accordionOffsetY}
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
