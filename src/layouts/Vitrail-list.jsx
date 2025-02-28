import { useEffect } from 'react';

const VitrailList = ({ dataVitrails }) => {


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
            <ul>
                {
                    dataVitrails.map((vitrail) => (
                        <li>
                            <a href={`/vitrail/${vitrail.slug}`}>{vitrail.title}</a>
                        </li>
                    ))
                }
            </ul>
        </>
    );
};

export default VitrailList;