import { useEffect } from "react";
import { navigate } from "astro:transitions/client";

const VitrailList = ({ dataVitrails, isOnVitrailPage, targetHref, hidden, lang }) => {

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
            const title = document.querySelectorAll("li.vitrail-title a");

            title.forEach((title) => {
                if (title.getAttribute('href') === targetHref) {
                    title.parentElement.classList.add('active');
                    const wordWrappers = title.querySelectorAll('.volume-word-wrapper > div');
                    wordWrappers.forEach((wrapper, wrapperIndex) => {
                        const wordWrapperSpan = wrapper.querySelectorAll('span');
                        const wordWrapSpanLength = wordWrapperSpan.length;

                        wrapper.style.transition = 'height 0.5s ease-in-out';
                        wrapper.style.transitionDelay = `${wrapperIndex * 0.3}s`;
                        wrapper.style.height = `${wordWrapSpanLength * 25}px`;

                        const firstSpan = wordWrapperSpan[0];
                        const firstWidth = firstSpan.offsetWidth;

                        wrapper.parentElement.style.width = `${firstWidth * wordWrapSpanLength + 10}px`;

                        wordWrapperSpan.forEach((span, index) => {
                            span.style.width = `${firstWidth}px`;
                            span.style.transition = 'transform 0.5s ease-in-out';
                            span.style.transitionDelay = `${wrapperIndex * 0.3}s`;
                            span.style.transform = `translate(-${index * firstWidth}px, ${index * 25}px)`;
                        });
                    });
                } else {
                    title.parentElement.classList.remove('active');
                    const wordWrappers = title.querySelectorAll('.volume-word-wrapper > div');
                    wordWrappers.forEach((wrapper, wrapperIndex) => {
                        const wordWrapperSpan = wrapper.querySelectorAll('span');

                        // Animation inverse
                        wrapper.style.transition = 'height 0.5s ease-in-out';
                        wrapper.style.transitionDelay = `${wrapperIndex * 0.3}s`;
                        wrapper.style.height = '0px';

                        wordWrapperSpan.forEach((span) => {
                            span.style.transition = 'transform 0.5s ease-in-out';
                            span.style.transitionDelay = `${wrapperIndex * 0.3}s`;
                            span.style.transform = 'translate(0, 0)';
                        });

                        // Réinitialiser la largeur après l'animation
                        setTimeout(() => {
                            wrapper.parentElement.style.width = '';
                        }, (wrapperIndex * 300) + 500);
                    });
                }
            });
        }

        titleLayout();

        // Recalculer lors du redimensionnement
        window.addEventListener("resize", titleLayout);

        // Nettoyage
        return () => window.removeEventListener("resize", titleLayout);

    }, [dataVitrails]);


    // Render
    return (
        <>

            
            <div
                className={`pt-list-p-top flex flex-col items-end  ${!isOnVitrailPage ? "cursor-pointer" : ""
                    } `}
                onClick={
                    !isOnVitrailPage
                        ? () => navigate(`/${lang}${targetHref}`, { history: "push" })
                        : undefined
                }
            >
                <div
                    className={`flex flex-col items-end transition-all duration-1000 ease-in-out ${!isOnVitrailPage ? "pointer-events-none" : ""
                        } ${!hidden ? "" : "translate-y-[-50vh]"}`}
                >
                    <div
                        className={`max-h-0 overflow-hidden transition-all duration-1000 ease-in-out delay-[0.2s] ${isOnVitrailPage ? "max-h-[100vh]" : "max-h-0"
                            }`}
                    >
                        {/* Liste Hidden */}
                        {isOnVitrailPage && (
                            <ul className="vitrail-list-compact">
                                {dataVitrails.slice(2).map((vitrail) => (
                                    <li className="vitrail-title text-right w-fit block ml-auto transition-all duration-300" key={vitrail.id}>
                                        <a
                                            href={`/${lang}/vitrail/${vitrail.slug}/`}
                                            className="flex flex-col items-end"
                                            onMouseEnter={() => {
                                                const mediaUrl = vitrail.medias && vitrail.medias[0] && vitrail.medias[0].url;
                                                if (mediaUrl) {
                                                    handleMouseEnter(mediaUrl);
                                                }
                                            }}
                                            onMouseLeave={handleMouseLeave}
                                            data-image-preview={vitrail.medias && vitrail.medias[0] && vitrail.medias[0].url}
                                        >
                                            {vitrail.title.split(' ').map((word, i, words) => (
                                                <div key={i} className="volume-word-wrapper inline-block transition-all duration-300 ">
                                                    <div className="inline-block transition-all duration-300 h-[25px]">
                                                        {word.split('').map((letter, j) => (
                                                            <span key={j} className="">{letter}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {/* (END) Liste Hidden */}
                    </div>
                    {/* Liste Homepage */}
                    <ul className="vitrail-list-compact">
                        {
                            dataVitrails.slice(0, 2).map((vitrail) => (
                                <li className="vitrail-title  text-right w-fit block ml-auto transition-all duration-300" key={vitrail.id}>
                                    <a
                                        href={`/${lang}/vitrail/${vitrail.slug}/`}
                                        className="flex flex-col items-end"
                                        onMouseEnter={() => {
                                            const mediaUrl = vitrail.medias && vitrail.medias[0] && vitrail.medias[0].url;
                                            if (mediaUrl) {
                                                handleMouseEnter(mediaUrl);
                                            }
                                        }}
                                        onMouseLeave={handleMouseLeave}
                                        data-image-preview={vitrail.medias && vitrail.medias[0] && vitrail.medias[0].url}
                                    >
                                        {vitrail.title.split(' ').map((word, i, words) => (
                                            <div key={i} className="volume-word-wrapper inline-block transition-all duration-300">
                                                <div className="inline-block transition-all duration-300 h-[25px]">
                                                    {word.split('').map((letter, j) => (
                                                        <span key={j}>{letter}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                    {/* (END) Liste Homepage */}

                </div>
            </div>
            <div class="fixed top-0 left-0 h-screen w-screen z-[-1] flex justify-center items-center pointer-events-none">
                <div class="dynamic-image--wrapper w-[80vw] max-w-[350px] aspect-[350/300] transition-all opacity-0 duration-300 ease-in-out">
                    <img class="w-full h-full object-cover dynamic-image" src="https://res.cloudinary.com/dbfkv6zgf/image/upload/v1740733159/DSC_4802_068fca2c07.jpg" alt="preview image"></img>
                </div>
            </div>
        </>
    );
};

export default VitrailList;
