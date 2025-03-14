import { useEffect, useState } from "react";
import { navigate } from "astro:transitions/client";
import VitrailTitle from "../../components/title/VitrailTitle.jsx";
import PreviewImg from "../../components/PreviewImg.jsx";
const VitrailList = ({ dataVitrails, isOnVitrailPage, targetHref, hidden, lang }) => {

    const [hiddenListHeight, setHiddenListHeight] = useState(0);

    useEffect(() => {
        // Afficher la hauteur de la liste cachée
        const hiddenListHeightValue = document.querySelector('.hidden-list').clientHeight;
        setHiddenListHeight(hiddenListHeightValue);

        // Title animation  
        const titleLayout = () => {
            const title = document.querySelectorAll("li.vitrail-title a");

            // Title animation
            title.forEach((title) => {
                if (title.getAttribute('href') === targetHref) {
                    document.body.classList.add('on-slug-page');
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
                        } ${!hidden ? "" : "translate-y-[-50vh]"}`} style={isOnVitrailPage ? { transform: `translateY(0px)` } : { transform: `translateY(-${hiddenListHeight}px)` }}
                >
                    <div
                        className={`hidden-list transition-all duration-1000 ease-in-out delay-[0.2s]flex flex-col items-end ${isOnVitrailPage ? "opacity-100" : "opacity-0"} `}
                    >
                        {/* Liste Hidden */}

                        <ul className="vitrail-list-compact overflow-visible">
                            {dataVitrails.slice(2).map((vitrail) => (
                                <li className="vitrail-title !overflow-visible text-right w-fit block ml-auto transition-all duration-100" key={vitrail.id}>
                                    <VitrailTitle vitrail={vitrail} lang={lang} />
                                </li>
                            ))}
                        </ul>

                        {/* (END) Liste Hidden */}
                    </div>
                    {/* Liste Homepage */}
                    <ul className="vitrail-list-compact">
                        {
                            dataVitrails.slice(0, 2).map((vitrail) => (
                                <li className="vitrail-title !overflow-visible text-right w-fit block ml-auto transition-all duration-300" key={vitrail.id}>
                                    <VitrailTitle vitrail={vitrail} lang={lang} />
                                </li>
                            ))
                        }
                    </ul>
                    {/* (END) Liste Homepage */}

                </div>
            </div>
            <PreviewImg />
        </>
    );
};

export default VitrailList;

