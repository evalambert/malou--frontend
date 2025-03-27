import { handleMouseEnter, handleMouseLeave } from '../../../assets/scripts/utils/preview-img';

const PaintingTitle = ({ painting, lang }) => {
    

    // Render
    return (
        <div>
            <a href={`/${lang}/painting/${painting.slug}/`} className="block whitespace-nowrap" onMouseEnter={() => {
                const mediaUrl = painting.medias && painting.medias[0] && painting.medias[0].url;
                if (mediaUrl) {
                    handleMouseEnter(mediaUrl);
                }
            }}
                onMouseLeave={handleMouseLeave}
                data-image-preview={painting.medias && painting.medias[0] && painting.medias[0].url}>
                {painting.title.split('').map((letter, index) => (
                    <span className="inline-block" key={index}>{letter}</span>
                ))}
            </a>
        </div>
    );
};

export default PaintingTitle;