// Import Swiper React components
import React, { useRef, useState  } from "react";


import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom, Keyboard } from 'swiper/modules';
import ZoomableImg from '../ZoomableImg';

// Import Swiper styles
import 'swiper/css';


export default function Slider({ medias = [] }) {
    const swiperRef = useRef(null);
    const [clickTimeout, setClickTimeout] = useState(null);
    const [mouseDownTime, setMouseDownTime] = useState(null);






    const handleSlideChange = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            const swiper = swiperRef.current.swiper;
            const isLastSlide = swiper.activeIndex === swiper.slides.length - 1;
            const wasLastSlide = swiper.previousIndex === swiper.slides.length - 1;

        }
    };

    const handleMouseDown = (event) => {
        setMouseDownTime(Date.now());
    };

    const handleMouseUp = (event) => {
        if (mouseDownTime) {
            const duration = (Date.now() - mouseDownTime) / 1000;
            setMouseDownTime(null);

            if (duration < 0.15) {
                // Capture coordinates immediately
                const x = event.touches?.startX;
                const viewportMiddle = window.innerWidth / 2;

                // Click simple
                if (clickTimeout === null) {
                    if (x < viewportMiddle) {
                        setClickTimeout(
                            setTimeout(() => {
                                handleSingleClickLeft();
                                setClickTimeout(null);
                            }, 200)
                        );
                    } else {
                        setClickTimeout(
                            setTimeout(() => {
                                handleSingleClickRight();
                                setClickTimeout(null);
                            }, 200)
                        );
                    }

                } else {
                    // Double clic
                    clearTimeout(clickTimeout);
                    setClickTimeout(null);
                }
            }
        }
    };

    // Gestion du clic simple : change de slide 
    const handleSingleClickRight = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    };


    const handleSingleClickLeft = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slidePrev();
        }
    };





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
                .swiper-slide:last-child{
                    width: 100%;
                    background-color: #fcfcfc;
                }
                .swiper-slide:last-child img{
                    object-fit: initial;
                    height: initial;
                    width: initial;
                    max-height: 100%;
                    max-width: 100%;
                }
                // .swiper-slide,
                // .swiper-zoom-container{
                //     height: 100vh;
                //     width: 100vw;
                // }
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
                    zoom={{
                        maxRatio: 3,
                        panOnMouseMove: true,
                        limitToOriginalSize: true
                    }}
                    // loop={true}
                    keyboard={{
                        enabled: true,
                    }}
                    modules={[Zoom, Keyboard]}
                    onTouchStart={handleMouseDown}
                    onTouchEnd={handleMouseUp}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onSlideChange={handleSlideChange}
                >
                    {medias.map((media, index) => (
                        <SwiperSlide
                            key={index}
                        >
                            <ZoomableImg url={media.url} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>

    );
};