import {
    handleMouseEnter,
    handleMouseLeave,
} from '../../../assets/scripts/utils/preview-img';

const WeavingTitle = ({ weaving, lang }) => {
    // Render
    return (
        <div>
            <a
                href={`/${lang}/weaving/${weaving.slug}/`}
                className='pr-1'
                onMouseEnter={() => {
                    const mediaUrl =
                        weaving.medias &&
                        weaving.medias[0] &&
                        weaving.medias[0].url;
                    if (mediaUrl) {
                        handleMouseEnter(mediaUrl);
                    }
                }}
                onMouseLeave={handleMouseLeave}
                data-image-preview={
                    weaving.medias && weaving.medias[0] && weaving.medias[0].url
                }
            >
                {weaving.title}
            </a>
        </div>
    );
};

export default WeavingTitle;
