import { useEffect, useState } from 'react';
import { navigate } from 'astro:transitions/client';

import VitrailTitle from '../../components/common/title/VitrailTitle.jsx';

const VitrailList = ({
    homepageVitraux,
    hiddenVitraux,
    targetHref,
    lang,
    className,
}) => {
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
    }, [homepageVitraux, hiddenVitraux]);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Toogle hidden/compact/full
    const [translateYValue, settranslateYValue] = useState('-200vh');
    const [translateXValue, settranslateXValue] = useState('0px');
    const [maxWidthValue, setMaxWidthValue] = useState('initial');
    const [maxHeightValue, setMaxHeightValue] = useState('initial');
    const [isOnVitrailPage, setIsOnVitrailPage] = useState(false);
    const [isOnIndexPage, setIsOnIndexPage] = useState(false);

    const toggleListDisplay = (url, category) => {
        if (url.includes(category)) {
            settranslateYValue('0px');
            setIsOnVitrailPage(true);
            setIsOnIndexPage(false);
            if (window.innerWidth < 768) {
                setMaxHeightValue('initial');
                setTimeout(() => {
                    settranslateXValue('0px');
                    setMaxWidthValue('100vw');
                }, 400);
            }
        } else if (url == '/fr/' || url == '/en/') {
            setIsOnVitrailPage(false);
            setIsOnIndexPage(true);
            if (window.innerWidth < 768) {
                settranslateYValue('0px');
                settranslateXValue('50vw');
                setMaxWidthValue('0px');
                setMaxHeightValue('0px');
            } else {
                settranslateYValue('-' + hiddenListHeightVitrail + 'px');
            }
        } else {
            setIsOnVitrailPage(false);
            setIsOnIndexPage(false);
            if (window.innerWidth < 768) {
                setMaxWidthValue('0px');
                setMaxHeightValue('0px');
                settranslateYValue('0px');
                settranslateXValue('50vw');
            } else {
                settranslateYValue('-200vh');
            }
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
                className={`work-list vitrail-list-wrapper max-md:relative max-md:top-[70vh] max-md:flex max-md:flex-col max-md:items-end ${className} ${isOnIndexPage ? 'pointer-events-auto cursor-pointer' : ''} ${!isOnVitrailPage && !isOnIndexPage ? 'pointer-events-none' : ''}`}
            >
                <div
                    className={`flex flex-col items-end max-md:overflow-hidden max-md:transition-[max-width] max-md:duration-1000 max-md:ease-in-out ${
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
                    style={{
                        maxWidth: `${maxWidthValue}`,
                        maxHeight: `${maxHeightValue}`,
                    }}
                >
                    <div
                        className={`pt-body-p-y flex flex-col items-end transition-all duration-1000 ease-in-out ${!isOnVitrailPage ? 'pointer-events-none' : ''}`}
                        style={{
                            transform: `translate(${translateXValue}, ${translateYValue})`,
                        }}
                    >
                        <div
                            className={`hidden-list-vitrail flex flex-col items-end transition-all delay-[0.2s] duration-1000 ease-in-out max-md:order-2 ${
                                isOnVitrailPage ? 'opacity-100' : 'md:opacity-0'
                            } `}
                        >
                            {/* Liste Hidden */}
                            <ul className='vitrail-list-compact overflow-visible'>
                                {hiddenVitraux.map((vitrail) => (
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
                        <ul className='vitrail-list-compact max-md:order-1'>
                            {homepageVitraux.map((vitrail) => (
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
