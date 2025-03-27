import { useEffect, useState } from 'react';
import { navigate } from 'astro:transitions/client';

import VitrailTitle from '../../components/common/title/VitrailTitle.jsx';

const VitrailList = ({ dataVitrails, targetHref, lang, className }) => {
    const [hiddenListHeightVitrail, setHiddenListHeightVitrail] = useState(0);

    useEffect(() => {
        // Afficher la hauteur de la liste cachée
        const hiddenListHeightVitrailValue = document.querySelector(
            '.hidden-list-vitrail'
        ).clientHeight;
        setHiddenListHeightVitrail(hiddenListHeightVitrailValue);

        // Title animation
        const titleLayout = () => {
            const title = document.querySelectorAll('li.vitrail-title a');

            // Title animation
            title.forEach((title) => {
                if (title.getAttribute('href') === targetHref) {
                    title.parentElement.classList.add('active');

                    const wordWrappers = title.querySelectorAll(
                        '.volume-word-wrapper > div'
                    );

                    wordWrappers.forEach((wrapper, wrapperIndex) => {
                        const wordWrapperSpan =
                            wrapper.querySelectorAll('span');
                        const wordWrapSpanLength = wordWrapperSpan.length;

                        wrapper.style.transition = 'height 0.5s ease-in-out';
                        wrapper.style.transitionDelay = `${
                            wrapperIndex * 0.3
                        }s`;
                        wrapper.style.height = `${wordWrapSpanLength * 25}px`;

                        const firstSpan = wordWrapperSpan[0];
                        const firstWidth = firstSpan.offsetWidth;

                        wrapper.parentElement.style.width = `${
                            firstWidth * wordWrapSpanLength + 10
                        }px`;

                        wordWrapperSpan.forEach((span, index) => {
                            span.style.width = `${firstWidth}px`;
                            span.style.transition =
                                'transform 0.5s ease-in-out';
                            span.style.transitionDelay = `${
                                wrapperIndex * 0.3
                            }s`;
                            span.style.transform = `translate(-${
                                index * firstWidth
                            }px, ${index * 25}px)`;
                        });
                    });
                } else {
                    title.parentElement.classList.remove('active');
                    const wordWrappers = title.querySelectorAll(
                        '.volume-word-wrapper > div'
                    );
                    wordWrappers.forEach((wrapper, wrapperIndex) => {
                        const wordWrapperSpan =
                            wrapper.querySelectorAll('span');

                        // Animation inverse
                        wrapper.style.transition = 'height 0.5s ease-in-out';
                        wrapper.style.transitionDelay = `${
                            wrapperIndex * 0.3
                        }s`;
                        wrapper.style.height = '0px';

                        wordWrapperSpan.forEach((span) => {
                            span.style.transition =
                                'transform 0.5s ease-in-out';
                            span.style.transitionDelay = `${
                                wrapperIndex * 0.3
                            }s`;
                            span.style.transform = 'translate(0, 0)';
                        });

                        // Réinitialiser la largeur après l'animation
                        setTimeout(
                            () => {
                                wrapper.parentElement.style.width = '';
                            },
                            wrapperIndex * 300 + 500
                        );
                    });
                }
            });
        };

        titleLayout();

        // Recalculer lors du redimensionnement
        window.addEventListener('resize', titleLayout);
        document.addEventListener('astro:after-swap', titleLayout);

        // Nettoyage
        return () => window.removeEventListener('resize', titleLayout);
    }, [dataVitrails]);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Toogle hidden/compact/full
    const [translateValue, setTranslateValue] = useState('-50vh');
    const [isOnVitrailPage, setIsOnVitrailPage] = useState(false);
    const [isOnIndexPage, setIsOnIndexPage] = useState(false);

    const toggleListDisplay = (url, category) => {
        if (url.includes(category)) {
            console.log(':::: ENTER VITRAIL PAGE ::::');
            setTranslateValue('0px');
            setIsOnVitrailPage(true);
            setIsOnIndexPage(false);
        } else if (url == '/fr/' || url == '/en/') {
            console.log(':::: ENTER HOMEPAGE ::::');
            setTranslateValue('-' + hiddenListHeightVitrail + 'px');
            setIsOnVitrailPage(false);
            setIsOnIndexPage(true);
        } else {
            console.log(':::: HIDE (not on vitrail page not on homepage) ::::');
            setTranslateValue('-50vh');
            setIsOnVitrailPage(false);
            setIsOnIndexPage(false);
        }
    };

    useEffect(() => {
        toggleListDisplay(targetHref, 'vitrail');
    }, [targetHref, hiddenListHeightVitrail]);
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // * END * Toogle hidden/compact/full

    // Render
    return (
        <>
            <div
                className={`work-list ${className} ${isOnIndexPage ? 'pointer-events-auto cursor-pointer' : ''} ${!isOnVitrailPage && !isOnIndexPage ? 'pointer-events-none' : ''}`}
            >
                <div
                    className={`pt-body-p-y flex flex-col items-end ${
                        !isOnVitrailPage ? 'cursor-pointer' : ''
                    } `}
                    onClick={
                        !isOnVitrailPage
                            ? () =>
                                  navigate(`/${lang}/vitrail/`, {
                                      history: 'push',
                                  })
                            : undefined
                    }
                >
                    <div
                        className={`flex flex-col items-end transition-all duration-1000 ease-in-out ${!isOnVitrailPage ? 'pointer-events-none' : ''}`}
                        style={{ transform: `translateY(${translateValue})` }}
                    >
                        <div
                            className={`hidden-list-vitrail delay-[0.2s]flex flex-col items-end transition-all duration-1000 ease-in-out ${
                                isOnVitrailPage ? 'opacity-100' : 'opacity-0'
                            } `}
                        >
                            {/* Liste Hidden */}

                            <ul className='vitrail-list-compact overflow-visible'>
                                {dataVitrails.slice(2).map((vitrail) => (
                                    <li
                                        className='vitrail-title ml-auto block w-fit !overflow-visible text-right transition-all duration-100'
                                        key={vitrail.id}
                                    >
                                        <VitrailTitle
                                            vitrail={vitrail}
                                            lang={lang}
                                        />
                                    </li>
                                ))}
                            </ul>

                            {/* (END) Liste Hidden */}
                        </div>
                        {/* Liste Homepage */}
                        <ul className='vitrail-list-compact'>
                            {dataVitrails.slice(0, 2).map((vitrail) => (
                                <li
                                    className='vitrail-title ml-auto block w-fit !overflow-visible text-right transition-all duration-300'
                                    key={vitrail.id}
                                >
                                    <VitrailTitle
                                        vitrail={vitrail}
                                        lang={lang}
                                    />
                                </li>
                            ))}
                        </ul>
                        {/* (END) Liste Homepage */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default VitrailList;
