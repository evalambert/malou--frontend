const PreviewImg = () => {
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
                body.on-slug-page .preview-image--wrapper {
                    animation: preview-img-animation 1s ease forwards;
                }
            `}
            </style>
            <div className='fixed top-0 left-0 !z-0 flex h-screen w-screen items-center justify-center max-md:hidden'>
                <div className='preview-image--wrapper relative h-[300px] w-[350px] opacity-0 transition-all duration-350'>
                    <img
                        className='preview-img dynamic-image dynamic-image-cover absolute inset-0 h-full w-full object-cover opacity-1 transition-opacity duration-150'
                        src='/'
                        alt='preview image'
                        data-persist
                    ></img>
                    <img
                        className='preview-img dynamic-image dynamic-image-contain absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-150'
                        src='/'
                        alt='preview image'
                        data-persist
                    ></img>
                </div>
            </div>
        </>
    );
};

export default PreviewImg;
