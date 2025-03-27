import {
    handleMouseEnter,
    handleMouseLeave,
} from '../../../assets/scripts/utils/preview-img';

const VitrailTitle = ({ vitrail, lang }) => {
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
                    if (mediaUrl) {
                        handleMouseEnter(mediaUrl);
                    }
                }}
                onMouseLeave={handleMouseLeave}
                data-image-preview={
                    vitrail.medias && vitrail.medias[0] && vitrail.medias[0].url
                }
            >
                {vitrail.title.split(' ').map((word, i, words) => (

                    <div key={i} className="vitrail-word-wrapper inline-block transition-all duration-300 ">
                        <div className="inline-block transition-all duration-300 h-[25px]">
                            {word.split('').map((letter, j) => (
                                <span key={j} className="transition-all duration-300">{letter}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </a>
        </div>
    );
};

export default VitrailTitle;
