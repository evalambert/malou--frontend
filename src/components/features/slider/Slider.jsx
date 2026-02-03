// Import Swiper React components
import React, { useRef, useState, useEffect } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Navigation, Pagination } from 'swiper/modules';
import ZoomModale from './ZoomModale';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Slider({ medias = [], zoomImg = [], noTimeOut }) {
    const swiperRef = useRef(null);
    const [imageDimensions, setImageDimensions] = useState({});
    const [isHidden, setIsHidden] = useState(true);
    const [show, setShow] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const body = document.body;
        if (!noTimeOut) {
            body.classList.add('mix-blend-actif');
            if (window.innerWidth < 768) {
                setShow(true);
                const timeout = setTimeout(() => {
                    body.classList.remove('mix-blend-actif');
                }, 300);
                const wrapperElement = document.querySelector(
                    '.preview-image--wrapper'
                );
                wrapperElement.style.opacity = '0';
                wrapperElement.classList.remove(
                    'preview-image--wrapper-visible'
                );
                return () => {
                    clearTimeout(timeout);
                };
            } else {
                const timeoutWhite = setTimeout(() => {
                    body.classList.remove('mix-blend-actif');
                    // Code qui masque le reste des listes
                }, 700);
                const timeout = setTimeout(() => {
                    setShow(true);
                }, 900);
                const timeoutPreviewHide = setTimeout(() => {
                    // hide preview
                    const wrapperElement = document.querySelector(
                        '.preview-image--wrapper'
                    );
                    wrapperElement.style.opacity = '0';
                    wrapperElement.classList.remove(
                        'preview-image--wrapper-visible'
                    );
                }, 1000);

                return () => {
                    clearTimeout(timeoutWhite);
                    clearTimeout(timeout);
                    clearTimeout(timeoutPreviewHide);
                };
            }
        } else {
            body.classList.remove('mix-blend-actif');
            setShow(true);
        }
    }, []);

    useEffect(() => {
        const updateIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        updateIsMobile();
        window.addEventListener('resize', updateIsMobile);
        return () => {
            window.removeEventListener('resize', updateIsMobile);
        };
    }, []);

    const revealModaleToogle = () => {
        if (isMobile) {
            return;
        }
        const modaleToggleElement = document.querySelector('.modaleToogle');
        if (!modaleToggleElement) {
            return;
        }
        modaleToggleElement.classList.toggle('hidden');
        modaleToggleElement.classList.toggle('pointer-events-none');
        if (zoomImg && zoomImg.url) {
            const img = new window.Image();
            img.src = zoomImg.url;
        }
    };

    const handleSlideChange = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            const modaleToggleElement = document.querySelector('.modaleToogle');

            const swiper = swiperRef.current.swiper;

            const isLastSlide = swiper.activeIndex === swiper.slides.length - 2;
            const wasLastSlide =
                swiper.previousIndex === swiper.slides.length - 2;

            if (modaleToggleElement && (isLastSlide || wasLastSlide)) {
                revealModaleToogle();
            }
        }
    };

    const handleMobileTap = () => {
        if (!isMobile || !swiperRef.current?.swiper) {
            return;
        }
        const swiper = swiperRef.current.swiper;
        swiper.slideNext();
    };
    useEffect(() => {
        if (!isMobile && medias.length === 1 && zoomImg && zoomImg.url) {
            revealModaleToogle();
        }
    }, [isMobile, medias, zoomImg]);

    const handleClick = () => {
        document
            .querySelector('.modaleToogle')
            .classList.toggle('modaleToogle-active');
        document
            .querySelector('.swiper-pagination')
            .classList.toggle('pagination-hidden');
        setIsHidden((prevState) => !prevState);
    };

    useEffect(() => {
        if (isMobile) {
            return;
        }
        const button = document.querySelector('.modaleToogle');
        if (button) {
            button.addEventListener('click', handleClick);
        }

        // Nettoyage de l'écouteur d'événements
        return () => {
            if (button) {
                button.removeEventListener('click', handleClick);
            }
        };
    }, [isMobile]);
    // Dimensions
    const checkImageOrientation = (media, index) => {
        if (!media?.url) {
            return;
        }
        if (
            typeof media.width === 'number' &&
            typeof media.height === 'number'
        ) {
            const isLandscape = media.width > media.height;
            setImageDimensions((prev) => ({
                ...prev,
                [index]: { isLandscape },
            }));
            return;
        }
        const img = new Image();
        img.onload = () => {
            const isLandscape = img.width > img.height;
            setImageDimensions((prev) => ({
                ...prev,
                [index]: { isLandscape },
            }));
        };
        img.src = media.url;
    };

    useEffect(() => {
        setImageDimensions({});
        medias.forEach((media, index) => {
            checkImageOrientation(media, index);
        });
    }, [medias]);

    return (
        <>
            <style>
                {`
                .swiper{
                    height: 100vh;
                    height: 100dvh;
                    width: 100vw;
                    transition: opacity 0.3s ease-in-out;
                }
                .swiper-wrapper{
                    user-select: none !important;
                }
                .swiper-slide{
                    width: 50%;
                    overflow: hidden;
                }
                .swiper-slide.pending-orientation{
                    width: 100%;
                }
                .swiper-slide:focus-visible{
                    outline: none;
                }
                @media (max-width: 768px) {
                    .swiper-slide {
                        width: 100%;
                    }
                }
                .swiper-slide img{
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .swiper-slide.mobile-zoom-slide{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .swiper-slide .mobile-zoom-image{
                    height: auto;
                    width: 100%;
                    object-fit: contain;
                }
                .swiper-slide.mobile-single{
                    width: 100%;
                }
                .swiper-zoom-container{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                }
                .swiper-zoom-container img{
                    height: 100%;
                    width: 100%;
                    object-fit: cover;
                }


            `}
            </style>
            <div
                className={`${show ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            >
                <Swiper
                    ref={swiperRef}
                    slidesPerView={'auto'}
                    keyboard={{
                        enabled: true,
                    }}
                    allowTouchMove={!isMobile}
                    loop={isMobile}
                    pagination={{
                        type: 'fraction',
                    }}
                    navigation={true}
                    modules={[Keyboard, Navigation, Pagination]}
                    onSlideChange={handleSlideChange}
                    onClick={handleMobileTap}
                >
                    {medias.map((media, index) => {
                        if (isMobile) {
                            return (
                                <SwiperSlide
                                    key={`mobile-${index}`}
                                    className='mobile-single'
                                >
                                    <img src={media.url} loading='lazy' />
                                </SwiperSlide>
                            );
                        }

                        if (!imageDimensions[index]) {
                            return (
                                <SwiperSlide
                                    key={`pending-${index}`}
                                    className='pending-orientation'
                                >
                                    <img src={media.url} loading='lazy' />
                                </SwiperSlide>
                                
                            );
                        }

                        if (imageDimensions[index].isLandscape) {
                            // Affiche 2 slides pour les images en paysage
                            return (
                                <React.Fragment
                                    key={`landscape-container-${index}`}
                                >
                                    <SwiperSlide
                                        key={`landscape-${index}`}
                                        className='landscape !overflow-visible'
                                    >
                                        <div className='h-full w-[200%]'>
                                            <img
                                                src={media.url}
                                                loading='lazy'
                                            />
                                        </div>
                                    </SwiperSlide>
                                    <SwiperSlide
                                        key={`landscape-${index}-bis`}
                                        className='landscape'
                                    ></SwiperSlide>
                                </React.Fragment>
                            );
                        }

                        // Affiche 1 slide pour les images en portrait
                        return (
                            <SwiperSlide
                                key={`portrait-${index}`}
                                className='portrait'
                            >
                                <img src={media.url} loading='lazy' />
                            </SwiperSlide>
                        );
                    })}
                    {isMobile && zoomImg && zoomImg.url && (
                        <SwiperSlide
                            key='mobile-zoom-last'
                            className='mobile-single mobile-zoom-slide'
                        >
                            <img
                                className='mobile-zoom-image'
                                src={zoomImg.url}
                                loading='lazy'
                            />
                        </SwiperSlide>
                    )}
                </Swiper>

                {!isMobile && zoomImg && zoomImg.url && (
                    <>
                        <button className='modaleToogle pointer-events-none fixed top-0 right-0 z-10 hidden h-full w-full cursor-pointer mix-blend-difference md:w-[50%]'>
                            <span>close</span>
                        </button>
                        <ZoomModale
                            hidden={isHidden}
                            zoomImg={zoomImg}
                            insideSlider={true}
                        />
                    </>
                )}
            </div>
        </>
    );
}
