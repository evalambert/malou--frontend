import { useEffect } from 'react';
import { navigate } from "astro:transitions/client";

const PaintingsList = ({ dataPaintings, isOnPaintingPage, targetHref, hidden, lang }) => {
    // Fonction pour gérer le survol et changer l'image
    const handleMouseEnter = (imageUrl) => {
        const imageElement = document.querySelector('.dynamic-image');
        const wrapperElement = document.querySelector('.dynamic-image--wrapper');
        if (imageElement) {
            imageElement.src = imageUrl;
        }
        if (wrapperElement) {
            wrapperElement.style.opacity = '1';
        }
    };

    const handleMouseLeave = () => {
        const wrapperElement = document.querySelector('.dynamic-image--wrapper');
        if (wrapperElement) {
            wrapperElement.style.opacity = '0';
        }
    };

    useEffect(() => {
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
                className={`fixed md:left-[100px] bottom-0 transition-all duration-500 ease-in-out delay-[0.2s] ${!isOnPaintingPage ? "cursor-pointer" : ""
                    } ${!hidden ? "" : "bottom-[-50vh]"}`}
                onClick={
                    !isOnPaintingPage
                        ? () => navigate(`/${lang}${targetHref}`, { history: "push" })
                        : undefined
                }
            >

                <div
                    className={`${!isOnPaintingPage ? "pointer-events-none" : ""
                        }`}
                >

                    {/* Liste Homepage */}
                    <ul className="painting-list-compact transition-all duration-500 ease-in-out">
                        {dataPaintings.slice(0, 4).map((painting) => (
                            <li className="painting-title w-fit" key={painting.id}>
                                <a href={`/${lang}/painting/${painting.slug}/`} className="block whitespace-nowrap" onMouseEnter={() => {
                                    const mediaUrl = painting.medias && painting.medias[0] && painting.medias[0].url;
                                    if (mediaUrl) {
                                        handleMouseEnter(mediaUrl);
                                    }
                                }}
                                    onMouseLeave={handleMouseLeave}
                                    data-image-preview={painting.medias && painting.medias[0] && painting.medias[0].url}>
                                    {painting.title.split('').map((letter, index) => (
                                        <span className="inline-block" key={index}>{letter}</span>
                                    ))}
                                </a>
                            </li>
                        ))}
                    </ul>
                    {/* (END) Liste Homepage */}
                    <div
                        className={`max-h-0 overflow-hidden transition-all duration-500 ease-in-out delay-[0.2s] ${isOnPaintingPage ? "max-h-[100vh]" : "max-h-0"
                            }`}
                    >
                        {/* Liste Hidden */}
                        {/* {isOnPaintingPage && ( */}
                        <ul>
                            {dataPaintings.slice(4).map((painting) => (
                                <li
                                    className="painting-title w-fit block"
                                    key={painting.id}
                                >
                                    <a href={`/${lang}/painting/${painting.slug}/`} className="block whitespace-nowrap" onMouseEnter={() => {
                                        const mediaUrl = painting.medias && painting.medias[0] && painting.medias[0].url;
                                        if (mediaUrl) {
                                            handleMouseEnter(mediaUrl);
                                        }
                                    }}
                                        onMouseLeave={handleMouseLeave}
                                        data-image-preview={painting.medias && painting.medias[0] && painting.medias[0].url}>
                                        {painting.title.split('').map((letter, index) => (
                                            <span className="inline-block" key={index}>{letter}</span>
                                        ))}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        {/* )} */}
                        {/* (END) Liste Hidden */}
                    </div>
                </div>
                <div class="fixed top-0 left-0 h-screen w-screen z-[-1] flex justify-center items-center pointer-events-none">
                    <div class="dynamic-image--wrapper w-[80vw] max-w-[350px] aspect-[350/300] transition-all opacity-0 duration-300 ease-in-out">
                        <img class="w-full h-full object-cover dynamic-image" src="https://res.cloudinary.com/dbfkv6zgf/image/upload/v1740733159/DSC_4802_068fca2c07.jpg" alt="preview image"></img>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaintingsList;
