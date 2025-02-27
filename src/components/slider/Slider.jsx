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
                    if (x < viewportMiddle ){
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
                // .swiper-zoom-container img{
                //     max-width: 100%;
                //     max-height: 100%;
                // }
            `}
            </style>
            <Swiper
                ref={swiperRef}
                zoom={{
                    maxRatio: 3,
                    panOnMouseMove : true,
                    limitToOriginalSize: true
                }}
                loop={true}
                keyboard={{
                    enabled: true,
                }}
                modules={[Zoom, Keyboard]}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            >
                {medias.map((media, index) => (
                    <SwiperSlide
                        key={index}
                        className="bg-blue-500"
                    >
                        <ZoomableImg url={media.url} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>

    );
};