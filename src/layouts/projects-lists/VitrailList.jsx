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

        const openAnimation = (targetTitle) => {
            console.log(':::: OPEN ANIMATION ::::');

            const wordWrappers = targetTitle.querySelectorAll(
                '.vitrail-word-wrapper > div'
            );

            wordWrappers.forEach((wrapper, wrapperIndex) => {
                const wordWrapperSpan = wrapper.querySelectorAll('span');
                const wordWrapSpanLength = wordWrapperSpan.length;

                wrapper.parentElement.classList.add('active');
                wrapper.style.transition = 'height 0.5s ease-in-out';
                wrapper.style.transitionDelay = `${wrapperIndex * 0.3}s`;
                wrapper.style.height = `${wordWrapSpanLength * 25}px`;

                const firstSpan = wordWrapperSpan[0];
                const firstWidth = firstSpan.offsetWidth;

                wrapper.parentElement.style.width = `${
                    firstWidth * wordWrapSpanLength + 10
                }px`;

                wordWrapperSpan.forEach((span, index) => {
                    span.style.width = `${firstWidth}px`;
                    span.style.transition = 'transform 0.5s ease-in-out';
                    span.style.transitionDelay = `${wrapperIndex * 0.3}s`;
                    span.style.transform = `translate(-${
                        index * firstWidth
                    }px, ${index * 25}px)`;
                });
            });
        };

        const closeAnimation = (targetTitle) => {
            console.log(':::: CLOSE ANIMATION ::::');
            const wordWrappers = targetTitle.querySelectorAll(
                '.vitrail-word-wrapper > div'
            );
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
                setTimeout(
                    () => {
                        wrapper.parentElement.style.width = '';
                        wrapper.parentElement.classList.remove('active');
                    },
                    wrapperIndex * 300 + 650
                );
            });
        };

        // Title animation
        const titleLayout = () => {
            const title = document.querySelectorAll('li.vitrail-title a');

            // Title animation
            title.forEach((title) => {
                if (
                    document
                        .querySelector('body')
                        .classList.contains('on-slug-page')
                ) {
                    if (title.getAttribute('href') === targetHref) {
                        console.log(':::: Enter slug page ::::');
                        openAnimation(title);
                    }
                } else {
                    console.log(':::: Leave slug page ::::');
                    if (title.children[0].classList.contains('active')) {
                        closeAnimation(title);
                    }
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
            setTranslateValue('0px');
            setIsOnVitrailPage(true);
            setIsOnIndexPage(false);
        } else if (url == '/fr/' || url == '/en/') {
            setTranslateValue('-' + hiddenListHeightVitrail + 'px');
            setIsOnVitrailPage(false);
            setIsOnIndexPage(true);
        } else {
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
