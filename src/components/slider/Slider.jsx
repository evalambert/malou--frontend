// Import Swiper React components
import React, { useRef, useState, useEffect } from "react";

import { useStore } from "@nanostores/react";
import { textWhite, toggleTextColor, toggleToWhite } from "../../lib/store.js";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Navigation, Pagination } from 'swiper/modules';
import ZoomableImg from '../Zoomable-img';
import ZoomModale from './ZoomModale';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Slider({ medias = [] }) {
    const swiperRef = useRef(null);
    const [imageDimensions, setImageDimensions] = useState({});
    const [isHidden, setIsHidden] = useState(true);

    // Colors
    const isTextWhite = useStore(textWhite);

    useEffect(() => {
        toggleToWhite();
    }, []);

    const handleSlideChange = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            const swiper = swiperRef.current.swiper;

            const isLastSlide = swiper.activeIndex === swiper.slides.length - 2;
            const wasLastSlide = swiper.previousIndex === swiper.slides.length - 2;

            if (isLastSlide || wasLastSlide) {
                document.querySelector('.modaleToogle').classList.toggle('hidden');
                document.querySelector('.modaleToogle').classList.toggle('pointer-events-none');

            }
        }
    };

    const handleClick = () => {
        toggleTextColor();
        document.querySelector('.modaleToogle').classList.toggle('modaleToogle-active');
        document.querySelector('.swiper-pagination').classList.toggle('pagination-hidden');
        setIsHidden(prevState => !prevState);
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
            setImageDimensions(prev => ({
                ...prev,
                [index]: { isLandscape }
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
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    width: 100vw;
                    z-index: 1;
                }
                .swiper-slide{
                    width: 50%;
                    overflow: hidden;
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
            <div>
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
                    {medias.map((media, index) => (
                        imageDimensions[index]?.isLandscape ? (
                            // Affiche 2 slides pour les images en paysage
                            <>
                                <SwiperSlide
                                    key={`landscape-${index}`}
                                    className="landscape !overflow-visible"
                                >
                                    <div className={`${isTextWhite ? 'text-white' : 'text-black'}`}></div>
                                    <div className="h-full w-[200%]">
                                        <ZoomableImg url={media.url} />
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide
                                    key={`landscape-${index}-bis`}
                                    className="landscape"
                                >
                                    <div className={`${isTextWhite ? 'text-white' : 'text-black'}`}></div>
                                </SwiperSlide>
                            </>
                        ) : (
                            // Affiche 1 slide pour les images en portrait
                            <SwiperSlide
                                key={`portrait-${index}`}
                                className="portrait"
                            >
                                <div className={`${isTextWhite ? 'text-white' : 'text-black'}`}></div>
                                <img src={media.url} loading="lazy"/>
                            </SwiperSlide>
                        )
                    ))}
                </Swiper>
                <button className="modaleToogle h-full w-full md:w-[50%] fixed top-0 right-0 z-10 hidden pointer-events-none">
                    <span>close</span>
                </button>
                <ZoomModale medias={medias} hidden={isHidden} />
            </div>
        </>

    );
};