
const PreviewImg = () => {

    // Render
    return (
        <div className="preview-img--wrapper fixed top-0 left-0 h-screen w-screen z-[999] flex justify-center items-center pointer-events-none">
            <div className="dynamic-image--wrapper w-[80vw] max-w-[350px] aspect-[350/300] ease-in-out bg-blue-600">
                <img className="w-full h-full object-cover dynamic-image" src="/" alt="preview image"></img>
            </div>
        </div>
    );
};

export default PreviewImg;