// Import Swiper React components
import React, { useRef, useState, useEffect } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Navigation, Pagination } from 'swiper/modules';
import ZoomModale from './ZoomModale';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Slider({ medias = [] }) {
    const swiperRef = useRef(null);
    const [imageDimensions, setImageDimensions] = useState({});
    const [isHidden, setIsHidden] = useState(true);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timeoutWhite = setTimeout(() => {
            document.body.classList.add('text-white');
        }, 700);
        const timeout = setTimeout(() => {
            setShow(true);
        }, 1000);

        return () => {
            clearTimeout(timeoutWhite);
            clearTimeout(timeout);
        };
    }, []);

    const handleSlideChange = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            const swiper = swiperRef.current.swiper;

            const isLastSlide = swiper.activeIndex === swiper.slides.length - 2;
            const wasLastSlide =
                swiper.previousIndex === swiper.slides.length - 2;

            if (isLastSlide || wasLastSlide) {
                document
                    .querySelector('.modaleToogle')
                    .classList.toggle('hidden');
                document
                    .querySelector('.modaleToogle')
                    .classList.toggle('pointer-events-none');
            }
        }
    };

    const handleClick = () => {
        document
            .querySelector('.modaleToogle')
            .classList.toggle('modaleToogle-active');
        document
            .querySelector('.swiper-pagination')
            .classList.toggle('pagination-hidden');
        if (document.body.classList.contains('text-white')) {
            document.body.classList.replace('text-white', 'text-black');
        } else {
            document.body.classList.replace('text-black', 'text-white');
        }
        setIsHidden((prevState) => !prevState);
    };

    useEffect(() => {
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
    }, []);

    // Dimensions
    const checkImageOrientation = (url, index) => {
        const img = new Image();
        img.onload = () => {
            const isLandscape = img.width > img.height;
            setImageDimensions((prev) => ({
                ...prev,
                [index]: { isLandscape },
            }));
        };
        img.src = url;
    };

    useEffect(() => {
        medias.forEach((media, index) => {
            checkImageOrientation(media.url, index);
        });
    }, [medias]);

    return (
        <>
            <style>
                {`
                .swiper{
                    height: 100vh;
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
                    pagination={{
                        type: 'fraction',
                    }}
                    navigation={true}
                    modules={[Keyboard, Navigation, Pagination]}
                    onSlideChange={handleSlideChange}
                >
                    {medias.map((media, index) =>
                        imageDimensions[index]?.isLandscape ? (
                            // Affiche 2 slides pour les images en paysage
                            <React.Fragment
                                key={`landscape-container-${index}`}
                            >
                                <SwiperSlide
                                    key={`landscape-${index}`}
                                    className='landscape !overflow-visible'
                                >
                                    <div className='h-full w-[200%]'>
                                        <img src={media.url} loading='lazy' />
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide
                                    key={`landscape-${index}-bis`}
                                    className='landscape'
                                ></SwiperSlide>
                            </React.Fragment>
                        ) : (
                            // Affiche 1 slide pour les images en portrait
                            <SwiperSlide
                                key={`portrait-${index}`}
                                className='portrait'
                            >
                                <img src={media.url} loading='lazy' />
                            </SwiperSlide>
                        )
                    )}
                </Swiper>
                <button className='modaleToogle pointer-events-none fixed top-0 right-0 z-10 hidden h-full w-full cursor-pointer mix-blend-difference md:w-[50%]'>
                    <span>close</span>
                </button>
                <ZoomModale medias={medias} hidden={isHidden} />
            </div>
        </>
    );
}
