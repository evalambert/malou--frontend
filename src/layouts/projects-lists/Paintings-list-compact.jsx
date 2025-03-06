import { useEffect } from 'react';

const PaintingsListCompact = ({ dataPaintings, lang }) => {


    useEffect(() => {
        const calculateLayout = () => {
            const liTitle = document.querySelectorAll('li.painting-title');
            let previousLiWidth = 0;

            liTitle.forEach(li => {
                const viewportWidth = window.innerWidth;
                if (previousLiWidth + li.offsetWidth > viewportWidth) {
                    let maxMarginLeft = viewportWidth - li.offsetWidth;
                    li.style.marginLeft = `${maxMarginLeft}px`;
                } else {
                    li.style.marginLeft = `${previousLiWidth}px`;
                    previousLiWidth = previousLiWidth + li.offsetWidth;
                    return previousLiWidth;
                }
            });
        };

        // Initial calculation
        setTimeout(calculateLayout, 100);

        // Add resize event listener
        window.addEventListener('resize', calculateLayout);

        // Cleanup
        return () => window.removeEventListener('resize', calculateLayout);
    }, [dataPaintings]);

    

    // Render
    return (
        <>
            <ul className="painting-list-compact">
                {dataPaintings.slice(0, 4).map((painting) => (
                    <li className="painting-title w-fit" key={painting.id}>
                        <a href={`/${lang}/painting/${painting.slug}`} className="block whitespace-nowrap">{painting.title}</a>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default PaintingsListCompact;