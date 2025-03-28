import { useEffect, useState } from 'react';
import { navigate } from 'astro:transitions/client';

import PoetryTitle from '../../components/common/title/PoetryTitle';
import PoetryTitleHardLayout from './PoetryTitleHardLayout';

const PoetryList = ({
    dataPoetry,
    targetHref,
    isOnPoetryPage,
    lang,
    className,
}) => {

   

    // Render
    return (
        <>

            <div
                className={`w-fit h-screen fixed top-0 z-[9] left-0 ${className} ${!isOnPoetryPage ? "cursor-pointer" : ""
                    }`}
                onClick={
                    !isOnPoetryPage
                        ? () => navigate(`/${lang}/poetry/`, { history: "push" })
                        : undefined
                }
            >
                <div className={`work-list flex `}>
                    
                    <div className="poetry-wrapper flex fixed translate-y-[20px] top-0 left-0  px-body-p-x">
                        {dataPoetry.slice(2).map((poetry) => (
                            <div key={poetry.id}>
                                <PoetryTitle 
                                    className=''
                                    pathOpen={poetry.svgPath?.svgPathOpenData || ''} 
                                    pathClose={poetry.svgPath?.svgPathCloseData || ''} 
                                    title={poetry.title} 
                                    targetHref={`/${lang}/poetry/${poetry.slug}/`} 
                                    keyId={poetry.id}
                                />
                            </div>
                        ))}
                        <PoetryTitleHardLayout lang={lang} />
                    </div>
                </div>


            </div>
        </>
    );
};

export default PoetryList;
export const client = 'only';
