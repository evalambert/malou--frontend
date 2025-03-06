import { useEffect, useState } from 'react';
import { navigate } from 'astro:transitions/client';
import PaintingsListCompact from "./Paintings-list-compact.jsx";

const PaintingsList = ({ dataPaintings, isOnPaintingPage, targetHref }) => {

    useEffect(() => {
        const calculateLayout = () => {
            const liTitle = document.querySelectorAll('li.painting-title');
            let previousLiWidth = 0;

            liTitle.forEach(li => {

                const viewportWidth = window.matchMedia('(min-width: 48rem)').matches 
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
        setTimeout(calculateLayout, 100);

        // Add resize event listener
        window.addEventListener('resize', calculateLayout);



        // Cleanup
        return () => window.removeEventListener('resize', calculateLayout);
    }, [dataPaintings]);




    // Render
    return (
        <>
            {/* ! md:left-[100px] modify, change value const viewportWidth above */} 
            <div 
                className={`fixed md:left-[100px] bottom-0 border border-amber-400 ${!isOnPaintingPage ? 'cursor-pointer' : ''}`} 
                onClick={!isOnPaintingPage ? () => navigate(targetHref, { history: 'push' }) : undefined}
            >
                <div className={`border border-violet-400  ${!isOnPaintingPage ? 'pointer-events-none' : ''}`}>
                    <PaintingsListCompact dataPaintings={dataPaintings} />
                    <div className={`border border-green-400 max-h-0 overflow-hidden transition-all duration-500 ease-in-out delay-[0.2s] ${
                        isOnPaintingPage ? 'max-h-[100vh]' : 'max-h-0'
                    }`}>
                        <ul>
                            {dataPaintings.slice(4).map((painting) => (
                                <li className="border border-pink-400 painting-title w-fit block" key={painting.id}>
                                    <a href={`/painting/${painting.slug}`} className="block whitespace-nowrap">{painting.title}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

        </>
    );
};

export default PaintingsList;