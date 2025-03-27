
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
            <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center !z-0">
                <div className="preview-image--wrapper opacity-0 transition-all duration-350 w-[350px] h-[300px]">

                    <img className="preview-img w-full h-full object-cover dynamic-image " src="/" alt="preview image" data-persist></img>
                </div>
            </div>
        </>
    );
};

export default PreviewImg; 
