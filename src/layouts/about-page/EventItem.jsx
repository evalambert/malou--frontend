const EventItem = ({ actu, lang, formatEventDate }) => (
    <li>
        {/*  {actu.image?.url && <img src={actu.image.url} alt={actu.title} />} */}
        <p>
            {formatEventDate(
                actu.startDate,
                actu.endDate,
                actu.eventDate,
                lang
            )}
        </p>
        {actu.categories?.length > 0 && (
            <p>({actu.categories.map((cat) => cat.title).join(', ')})</p>
        )}
        <h3>{actu.title}</h3>
        <p>{`${actu.structure} ${actu.city} (${actu.country})`}</p>
        <a href={actu.link} target='_blank' rel='noopener noreferrer'>
            {lang === 'fr' ? 'lire plus…' : 'read more…'}
        </a>
    </li>
);

export default EventItem;
