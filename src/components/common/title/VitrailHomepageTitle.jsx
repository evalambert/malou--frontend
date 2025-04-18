import {
    handleMouseEnter,
    handleMouseClick,
    handleMouseLeave,
} from '../../../assets/scripts/utils/preview-img';

const VitrailHomepageTitle = ({ vitrail, lang }) => {
    // Render
    return (
        <div>
            <a
                href={`/${lang}/vitrail/${vitrail.slug}/`}
                className={`flex flex-col items-end`}
                onMouseEnter={() => {
                    const mediaUrl =
                        vitrail.medias &&
                        vitrail.medias[0] &&
                        vitrail.medias[0].url;
                    const zoomUrl = vitrail.zoomImg && vitrail.zoomImg.url;
                    if (mediaUrl) {
                        handleMouseEnter(mediaUrl);
                    } else if (zoomUrl) {
                        handleMouseEnter(zoomUrl);
                    }
                }}
                onClick={() => {
                    const mediaUrl =
                        vitrail.medias &&
                        vitrail.medias[0] &&
                        vitrail.medias[0].url;
                    const zoomUrl = vitrail.zoomImg && vitrail.zoomImg.url;
                    if (mediaUrl) {
                        handleMouseClick(mediaUrl);
                    } else if (zoomUrl) {
                        handleMouseClick(zoomUrl);
                    }
                }}
                onMouseLeave={handleMouseLeave}
                data-image-preview={
                    vitrail.medias && vitrail.medias[0] && vitrail.medias[0].url
                        ? vitrail.medias[0].url
                        : vitrail.zoomImg && vitrail.zoomImg.url
                }
            >
                {vitrail.title.split(' ').map((word, i, words) => (
                    <div
                        key={i}
                        className='vitrail-word-wrapper inline-block transition-all duration-300'
                    >
                        <div className='inline-block h-[25px] transition-all duration-300'>
                            {word.split('').map((letter, j) => (
                                <span
                                    key={j}
                                    className='transition-all duration-300'
                                >
                                    {letter}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </a>
        </div>
    );
};

export default VitrailHomepageTitle;
