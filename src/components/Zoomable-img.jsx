
const ZoomableImg = ({ url }) => {

    // Render
    return (
        <div className="swiper-zoom-container">
            <img src={url} className=''/>
        </div>
    );
};

export default ZoomableImg;
