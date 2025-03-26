import { useState, useEffect } from 'react';

const PreviewImgAnimation = ({ medias = [] }) => {

    const [showPreview, setShowPreview] = useState(false);
    const [hidePreview, setHidePreview] = useState(false);

    useEffect(() => {
        setShowPreview(true);
    }, []);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setHidePreview(true);
        }, 1200); // Délai de 0,5s avant d'afficher Swiper

        return () => clearTimeout(timeout);
    }, []);

    // Render
    return (
        <>
            <style>
                {`
                   @keyframes preview-img-animation {
                    0% {
                        width: 350px;
                        height: 300px;
                    }
                    100% {
                        width: 100vw;
                        height: 100vh;
                    }
                }
                `}
            </style>
            
            <div className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center ${hidePreview ? 'hidden' : ''}`}>
                <div className={` opacity-100 transition-all duration-300 w-[350px] h-[300px]`} style={{ animation: showPreview ? 'preview-img-animation 1s ease' : 'none' }}>
                    <img key={medias[0]?.url} src={medias[0]?.url} alt={medias[0]?.title} class="w-full h-full object-cover" />
                </div>
            </div>
        </>
    );
};

export default PreviewImgAnimation; 