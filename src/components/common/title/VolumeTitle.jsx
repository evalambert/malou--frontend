import {
    handleMouseEnter,
    handleMouseClick,
    handleMouseLeave,
} from '../../../assets/scripts/utils/preview-img';

const VolumeTitle = ({ volume, lang }) => {
    // Render
    return (
        <div>
            <a
                href={`/${lang}/volume/${volume.slug}/`}
                className='block whitespace-nowrap'
                onMouseEnter={() => {
                    const mediaUrl =
                        volume.medias &&
                        volume.medias[0] &&
                        volume.medias[0].url;
                    const zoomUrl = volume.zoomImg && volume.zoomImg.url;
                    if (mediaUrl) {
                        handleMouseEnter(mediaUrl);
                    } else if (zoomUrl) {
                        handleMouseEnter(zoomUrl);
                    }
                }}
                onClick={() => {
                    const mediaUrl =
                        volume.medias &&
                        volume.medias[0] &&
                        volume.medias[0].url;
                    const zoomUrl = volume.zoomImg && volume.zoomImg.url;
                    if (mediaUrl) {
                        handleMouseClick(mediaUrl);
                    } else if (zoomUrl) {
                        handleMouseClick(zoomUrl);
                    }
                }}
                onMouseLeave={handleMouseLeave}
                data-image-preview={
                    volume.medias && volume.medias[0] && volume.medias[0].url
                        ? volume.medias[0].url
                        : volume.zoomImg && volume.zoomImg.url
                }
            >
                {volume.title.split('').map((letter, index) => (
                    <span className='inline-block' key={index}>
                        {letter}
                    </span>
                ))}
            </a>
        </div>
    );
};

export default VolumeTitle;
