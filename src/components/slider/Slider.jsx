// Import Swiper React components
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom, Keyboard } from 'swiper/modules';
import ZoomableImg from '../Zoomable-img';

// Import Swiper styles
import 'swiper/css';

export default function Slider({ medias = [] }) {

    const swiperRef = useRef(null);
    const [clickTimeout, setClickTimeout] = useState(null);
    const [mouseDownTime, setMouseDownTime] = useState(null);



    const handleMouseDown = () => {
        setMouseDownTime(Date.now());
    };

    const handleMouseUp = () => {
        if (mouseDownTime) {
            const duration = (Date.now() - mouseDownTime) / 1000;
            setMouseDownTime(null);

            if (duration < 0.15) {
                // Click simple
                if (clickTimeout === null) {
                    setClickTimeout(
                        setTimeout(() => {
                            handleSingleClick();
                            setClickTimeout(null);
                        }, 200)
                    );
                } else {
                    // Double clic
                    clearTimeout(clickTimeout);
                    setClickTimeout(null);
                }
            }
        }
    };

    // Gestion du clic simple : change de slide
    const handleSingleClick = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
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
                }
                .swiper-slide,
                .swiper-zoom-container{
                    height: 100vh;
                    width: 100vw;
                }
                .swiper-zoom-container{
                  display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .swiper-zoom-container img{
                    max-width: 100%;
                    max-height: 100%;
                }

            `}
            </style>
            <Swiper
                ref={swiperRef}
                loop={true}
                zoom={{
                    maxRatio: 3,
                    panOnMouseMove : true,
                    limitToOriginalSize: true
                }}
                keyboard={{
                    enabled: true,
                }}
                modules={[Zoom, Keyboard]}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
            >
                {medias.map((media, index) => (
                    <SwiperSlide
                        key={index}
                        className="bg-red-500"
                    >
                        <ZoomableImg url={media.url} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>

    );
};
