import { useEffect } from 'react';
import VitrailListCompact from "./Vitrail-list-compact.jsx";

const VitrailList = ({ dataVitrails, lang, isOnVitrailPage }) => {

    useEffect(() => {

    }, [dataVitrails]);

    console.log(dataVitrails);

    // Render
    return (
        <>
            <div className="fixed top-0 right-0 flex flex-col items-end">
                <VitrailListCompact dataVitrails={dataVitrails} client:load />
                <div className={`w-[0px] overflow-hidden transition-all duration-300 delay-[0.3s] border border-blue-500 ${isOnVitrailPage ? 'w-[300px]' : 'w-[0px]'}`}>
                    {isOnVitrailPage && (
                        <ul className='w-[300px] border border-amber-600'>
                            {
                                dataVitrails.slice(2).map((vitrail) => (
                                    <li className="text-right" key={vitrail.id}>
                                        <a href={`/${lang}/vitrail/${vitrail.slug}`}>{vitrail.title}</a>
                                    </li>
                                ))
                            }
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default VitrailList;