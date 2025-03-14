
const PreviewImg = () => {

    // Render
    return (
        <div class="fixed top-0 left-0 h-screen w-screen z-[-1] flex justify-center items-center pointer-events-none">
            <div class="dynamic-image--wrapper w-[80vw] max-w-[350px] aspect-[350/300] transition-all opacity-0 duration-300 ease-in-out">
                <img class="w-full h-full object-cover dynamic-image" src="" alt="preview image"></img>
            </div>
        </div>
    );
};

export default PreviewImg;