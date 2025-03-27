const ZoomableImg = ({ url }) => {
    // Render
    return (
        <div className='swiper-zoom-container'>
            <img src={url} loading='lazy' />
        </div>
    );
};

export default ZoomableImg;
