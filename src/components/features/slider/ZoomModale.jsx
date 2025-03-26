// Import Swiper React components
import React, { useRef, useState, useEffect } from "react";


import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom, Keyboard } from 'swiper/modules';
import ZoomableImg from './ZoomableImg.jsx';

// Import Swiper styles
import 'swiper/css';

const ZoomModale = ({ medias = [], hidden }) => {
    const swiperRef = useRef(null);




    return (
        <>
            <style>
                {`
                .zoom-modale .swiper{
                    position: fixed;
                    top: 0;
                    left: ${hidden ? '100%' : '0'};
                    height: 100vh;
                    width: 100vw;
                    z-index: 1;
                    transition: all 0.5s ease-in-out;
                }
                .zoom-modale-slide{
                    width: 100%;
                    background-color: #fcfcfc;
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .swiper-zoom-container{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                }
                .swiper-zoom-container img{
                        object-fit: initial;
                    height: initial;
                    width: initial;
                    max-height: 100%;
                    max-width: 100%;
                }
            `}
            </style>
            <div className="zoom-modale">
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
                    modules={[Zoom]}
                >

                    <SwiperSlide
                        // key={index}
                        className="zoom-modale-slide"
                        key={`100`}
                    >
                        <ZoomableImg url="https://res.cloudinary.com/dbfkv6zgf/image/upload/v1740734269/Capture_d_ecran_2025_02_28_a_09_52_13_f84f659d56.png" />
                    </SwiperSlide>

                </Swiper>
            </div>
        </>

    );
};

export default ZoomModale;