import { useEffect } from 'react';

const PaintingsList = ({ dataPaintings }) => {


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

    console.log(dataPaintings);

    // Render
    return (
        <>
            <style>
                {`
                //
            `}
            </style>
            <ul>
                {dataPaintings.map((painting) => (
                    <li className="painting-title w-fit" key={painting.id}>
                        <a href={`/painting/${painting.slug}`} className="block whitespace-nowrap">{painting.title}</a>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default PaintingsList;