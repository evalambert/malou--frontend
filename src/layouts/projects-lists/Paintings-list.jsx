import { useEffect, useState } from 'react';
import { navigate } from "astro:transitions/client";

import { useStore } from "@nanostores/react";
import { textWhite } from "../../lib/store.js";

import PaintingTitle from "../../components/title/PaintingTitle.jsx";


const PaintingsList = ({ dataPaintings, isOnPaintingPage, targetHref, hidden, lang, className }) => {

    const [hiddenListHeightPainting, setHiddenListHeightPainting] = useState(0);
    const isTextWhite = useStore(textWhite);

    useEffect(() => {
        // Afficher la hauteur de la liste cachée
        const hiddenListHeightPaintingValue = document.querySelector('.hidden-list-painting').clientHeight;
        setHiddenListHeightPainting(hiddenListHeightPaintingValue);

        // Title animation
        const titleLayout = () => {
            const title = document.querySelectorAll("li.painting-title a");
            title.forEach((title) => {
                if (title.getAttribute('href') === targetHref) {
                    title.parentElement.classList.add('active');
                    const spansLenght = title.querySelectorAll('span').length;
                    const firstSpanTranslateY = (spansLenght - 1) * 10;
                    const newTitleHeight = firstSpanTranslateY + (spansLenght * 10);
                    title.style.height = `${newTitleHeight}px`;
                    title.querySelectorAll('span').forEach((span, index) => {
                        const translateY = (spansLenght - 1 - index) * 15;
                        span.style.transform = `translateY(-${translateY}px)`;
                    });
                } else {
                    title.parentElement.classList.remove('active');
                    title.style.height = '32px';
                    title.querySelectorAll('span').forEach(span => {
                        span.style.transform = 'translateY(0)';
                    });
                }
            });
            // Attendre que l'animation de transition soit terminée (500ms selon votre CSS)
            setTimeout(calculateLayout, 500);
        };

        // Layout 
        const calculateLayout = () => {
            const liTitle = document.querySelectorAll("li.painting-title");
            let previousLiWidth = 0;

            liTitle.forEach((li) => {
                const viewportWidth = window.matchMedia("(min-width: 48rem)").matches
                    ? window.innerWidth - 100 // 100px = md:left-[100px] on item bellow
                    : window.innerWidth - 30; // --spacing-main-x-mobile (x2)
                if (previousLiWidth + li.offsetWidth > viewportWidth) {
                    let maxMarginLeft = viewportWidth - li.offsetWidth;
                    li.style.marginLeft = `${maxMarginLeft}px`;
                } else {
                    li.style.marginLeft = `${previousLiWidth}px`;
                    previousLiWidth = previousLiWidth + li.offsetWidth;
                    return previousLiWidth;
                }
            });
        };

        // Initial calculation
        titleLayout();
        setTimeout(calculateLayout, 100);

        // Add resize event listener
        window.addEventListener("resize", calculateLayout);

        // Cleanup
        return () => window.removeEventListener("resize", calculateLayout);
    }, [dataPaintings]);

    // Render
    return (
        <>
            {/* ! md:left-[100px] modify, change value const viewportWidth above */}
            <div
                className={`work-list fixed left-[150px] bottom-0 transition-all duration-500 ease-in-out delay-[0.2s] ${isTextWhite ? 'text-white' : 'text-black '} ${className} ${!isOnPaintingPage ? "cursor-pointer" : ""
                    } ${!hidden ? "" : "translate-y-[100vh]"}`}
                onClick={
                    !isOnPaintingPage
                        ? () => navigate(`/${lang}${targetHref}`, { history: "push" })
                        : undefined
                }
            >

                <div
                    className={`transition-all duration-500 ease-in-out ${!isOnPaintingPage ? "pointer-events-none" : ""
                        }`}
                    style={isOnPaintingPage ? { transform: `translateY(0px)` } : { transform: `translateY(${hiddenListHeightPainting}px)` }}
                >

                    {/* Liste Homepage */}
                    <ul className="painting-list-compact transition-all duration-500 ease-in-out">
                        {dataPaintings.slice(0, 4).map((painting) => (
                            <li className="painting-title w-fit" key={painting.id}>
                                <PaintingTitle painting={painting} lang={lang} />
                            </li>
                        ))}
                    </ul>
                    {/* (END) Liste Homepage */}
                    <div
                        className={`hidden-list-painting overflow-hidden transition-all duration-500 ease-in-out delay-[0.2s] `}
                    >
                        {/* Liste Hidden */}

                        <ul>
                            {dataPaintings.slice(4).map((painting) => (
                                <li
                                    className="painting-title w-fit block"
                                    key={painting.id}
                                >
                                    <PaintingTitle painting={painting} lang={lang} />
                                </li>
                            ))}
                        </ul>

                        {/* (END) Liste Hidden */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaintingsList;
