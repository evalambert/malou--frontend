import { useEffect } from 'react';

const WeavingList = ({ dataWeaving }) => {


    useEffect(() => {

        const liTitle = document.querySelectorAll('li.weaving-title');
        let previousLiWidth = 0;

        liTitle.forEach(li => {
            li.style.marginLeft = `${previousLiWidth}px`;
            previousLiWidth = li.offsetWidth;
            return previousLiWidth;
        });

        console.log(`Largeur maximale: ${previousLiWidth}px`);

    }, [dataWeaving]);

    console.log(dataWeaving);

    // Render
    return (
        <ul className="w-fit">
            {dataWeaving.map((weaving) => (
                <li className="weaving-title w-fit" key={weaving.id}>
                    <a href={`/weaving/${weaving.slug}`} className="pr-1">{weaving.title}</a>
                </li>
            ))}
        </ul>
    );
};

export default WeavingList;