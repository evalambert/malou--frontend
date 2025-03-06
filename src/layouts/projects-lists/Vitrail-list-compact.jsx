import { useEffect } from 'react';

const VitrailListCompact = ({ dataVitrails }) => {


    useEffect(() => {
        
    }, [dataVitrails]);

    console.log(dataVitrails);

    // Render
    return (
        <>
            <style>
                {`
                //
            `}
            </style>
            <ul className="vitrail-list-compact">
                {
                    dataVitrails.slice(0, 2).map((vitrail) => (
                        <li className="text-right" key={vitrail.id}>
                            <a href={`/vitrail/${vitrail.slug}`}>{vitrail.title}</a>
                        </li>
                    ))
                }
            </ul>
        </>
    );
};

export default VitrailListCompact;