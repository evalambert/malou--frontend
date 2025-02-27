import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ZoomableImgOsd from '../Zoomable-img-osd.jsx';
import { Keyboard } from 'swiper/modules';

import "swiper/css";



export default function Slider({ medias = [] }) {
    const swiperRef = useRef(null);
    const [clickTimeout, setClickTimeout] = useState(null);
    const [mouseDownTime, setMouseDownTime] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);

    // :::::::::::: Swiper disable/enable (permet de désactiver/activer temporairement un Swiper) ::::::::::::

    function toggleSwiper(swiper, disable) {
        if (!swiper) return;
    
        if (disable) {
            swiper.allowSlideNext = false;
            swiper.allowSlidePrev = false;
            swiper.allowTouchMove = false;
            swiper.params.touchRatio = 0; // Désactive le glissement
        } else {
            setTimeout(() => {
                swiper.allowSlideNext = true;
                swiper.allowSlidePrev = true;
                swiper.allowTouchMove = true;
                swiper.params.touchRatio = 1;
            }, 500);
        }
    }
    // ::::::::::::END Swiper disable/enable  ::::::::::::

    const handleMouseDown = () => {
        setMouseDownTime(Date.now());
    };

    const handleMouseUp = () => {

        if (mouseDownTime) {
            const duration = (Date.now() - mouseDownTime) / 1000;

            setMouseDownTime(null);

            if (duration < 0.15) {
                if (clickTimeout === null) {
                    // Click simple
                    handleSlideClick();
                } else {
                    // Double click : toggle swiper et zoom
                    setIsDisabled(!isDisabled);
                    toggleSwiper(swiperRef.current.swiper, !isDisabled);

                }
            } else {
                // console.log('Pas de clic valide');
            }
        }
    };

    // :::::::::::: Fonction SingleClick : change slide au click ::::::::::::
    const handleSlideClick = (event) => {
        console.log('Click');
        if (clickTimeout === null) {
            setClickTimeout(
                setTimeout(() => {
                    if (swiperRef.current && swiperRef.current.swiper) {
                        swiperRef.current.swiper.slideNext();
                    }
                    setClickTimeout(null);
                }, 200)
            );
        } else {
            clearTimeout(clickTimeout);
            setClickTimeout(null);
        }
    };
    // ::::::::::::END Fonction SingleClick ::::::::::::



    return (
        <>
            <Swiper
                className="mySwiper h-screen w-screen fixed top-0 left-0"
                allowTouchMove={false}
                loop={true}
                ref={swiperRef}
                keyboard={{
                    enabled: true,
                }}
                modules={[Keyboard]}
                touchStartPreventDefault={false}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
            >
                {medias.map((media, index) => (
                    <SwiperSlide
                        key={index}
                        style={{ cursor: 'pointer' }}
                        className="h-screen w-screen"

                    >
                        <ZoomableImgOsd url={media.url} disabled={isDisabled}/>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}
