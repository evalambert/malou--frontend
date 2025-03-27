import { handleMouseEnter, handleMouseLeave } from '../../../utils/preview-img';

const VolumeTitle = ({ volume, lang }) => {

    // Render
    return (
        <div>
            <a
                href={`/${lang}/volume/${volume.slug}/`}
                className="block whitespace-nowrap"
                onMouseEnter={() => {
                    const mediaUrl = volume.medias && volume.medias[0] && volume.medias[0].url;
                    if (mediaUrl) {
                        handleMouseEnter(mediaUrl);
                    }
                }}
                onMouseLeave={handleMouseLeave}
                data-image-preview={volume.medias && volume.medias[0] && volume.medias[0].url}
            >
                {volume.title.split('').map((letter, index) => (
                    <span className="inline-block" key={index}>{letter}</span>
                ))}
            </a>
        </div>
    );
};

export default VolumeTitle;