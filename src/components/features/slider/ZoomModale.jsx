// Import Swiper React components
import React, { useRef, useState, useEffect } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Zoom, Keyboard } from 'swiper/modules';
import ZoomableImg from './ZoomableImg.jsx';

// Import Swiper styles
import 'swiper/css';

const ZoomModale = ({ zoomImg = [], hidden, insideSlider }) => {
    const swiperRef = useRef(null);
    const [show, setShow] = useState(false);


    useEffect(() => {
        if (insideSlider) {
            const body = document.body;
            if (!body.classList.contains('mix-blend-actif')) {
                body.classList.add('mix-blend-actif');
            } else {
                body.classList.remove('mix-blend-actif');
            }
        }
        const timeout = setTimeout(() => {
            setShow(true);
        }, 900);
        const timeoutPreviewHide = setTimeout(() => {
            // hide preview
            const wrapperElement = document.querySelector('.preview-image--wrapper');
            wrapperElement.style.opacity = '0';
            wrapperElement.classList.remove('preview-image--wrapper-visible');
        }, 1000);

        return () => {
            clearTimeout(timeout);
            clearTimeout(timeoutPreviewHide);
        };
    }, [hidden]);

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
            <div className={`zoom-modale ${show ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                <Swiper
                    ref={swiperRef}
                    slidesPerView={'auto'}
                    zoom={{
                        maxRatio: 3,
                        panOnMouseMove: true,
                        limitToOriginalSize: true,
                    }}
                    // loop={true}
                    keyboard={{
                        enabled: true,
                    }}
                    modules={[Zoom]}
                >
                    <SwiperSlide
                        // key={index}
                        className='zoom-modale-slide'
                        key={`100`}
                    >
                        <ZoomableImg url={zoomImg.url} />
                    </SwiperSlide>
                </Swiper>
            </div>
        </>
    );
};

export default ZoomModale;
