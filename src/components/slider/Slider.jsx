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
        <Swiper
            ref={swiperRef}
            zoom={{
                maxRatio : 2,
                panOnMouseMove : true,
                limitToOriginalSize : true
            }}
            loop={true}
            keyboard={{
                enabled: true,
            }}
            modules={[Zoom, Keyboard]}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className='w-screen h-screen'
        >
            {medias.map((media, index) => (
                <SwiperSlide
                    key={index}
                    style={{ cursor: 'pointer' }}
                    className="h-screen w-screen"
                >
                    <ZoomableImg url={media.url} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};
