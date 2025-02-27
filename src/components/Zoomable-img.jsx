
const ZoomableImg = ({ url }) => {

    // Render
    return (
        <div className="swiper-zoom-container h-full w-full">
            <img src={url} className='w-full h-full object-cover'/>
        </div>
    );
};

export default ZoomableImg;
