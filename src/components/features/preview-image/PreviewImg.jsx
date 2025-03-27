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
            <div className='fixed top-0 left-0 !z-0 flex h-screen w-screen items-center justify-center'>
                <div className='preview-image--wrapper h-[300px] w-[350px] opacity-0 transition-all duration-350'>
                    <img
                        className='preview-img dynamic-image h-full w-full object-cover'
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
