import { useEffect, useState } from 'react';
import { navigate } from 'astro:transitions/client';

import PoetryTitle from '../../components/common/title/PoetryTitle';
import PoetryTitleHardLayout from './PoetryTitleHardLayout';

const PoetryList = ({
    dataPoetry,
    targetHref,
    lang,
    className,
}) => {

    // // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // // Toogle hidden/compact/full;
    const [translateXValue, setTranslateXValue] = useState('0px');
    const [opacityValue, setOpacityValue] = useState(0);
    const [isOnPoetryPage, setIsOnPoetryPage] = useState(false);
    const [isOnIndexPage, setIsOnIndexPage] = useState(false);

    // const hiddenListHeightPoetry = 100;


    const toggleListDisplay = (url, category) => {
        const hiddenListPoetry = document.querySelector('.poetry-wrapper');
        const hiddenListWidthPoetry = hiddenListPoetry.offsetWidth;
        const halfHiddenListWidthPoetry = 0; // /!\ Calcul n'est pas le même si elle as plus de livre -- a tester !
        // const paintingList = document.querySelector('.painting-list');
        // const halfHiddenListWidthPoetry = paintingList?.children.length > 0 ? hiddenListPoetry.offsetWidth - 160 : 0;


        if (url.includes(category)) {
            console.log('ON PAGE POETRY');
            setTranslateXValue(0 + 'px');
            setIsOnPoetryPage(true);
            
            // Création et dispatch de l'événement personnalisé
            const poetryPageEvent = new CustomEvent('poetryPageStateChange', {
                detail: {
                    isOnPoetryPage: true
                }
            });
            window.dispatchEvent(poetryPageEvent);
            
            setIsOnIndexPage(false);
        } else if (url == '/fr/' || url == '/en/') {
            setTranslateXValue('-' + hiddenListWidthPoetry + 'px');
            setTimeout(() => {
                setOpacityValue(1);
                setTranslateXValue('-' + halfHiddenListWidthPoetry + 'px');
                document.querySelector('.poetry-wrapper').classList.add('transition-transform', 'duration-1000', 'ease-in-out');
            }, 50);
            setIsOnPoetryPage(false);
            setIsOnIndexPage(true);
        } else {
            console.log('HIIIIIIDDDDEN');
            setTranslateXValue('-' + hiddenListWidthPoetry + 'px');
            setIsOnPoetryPage(false);
            setIsOnIndexPage(false);
        }
    };

    useEffect(() => {
        
        toggleListDisplay(targetHref, 'poetry');
    }, [targetHref, translateXValue]);

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Render
    return (
        <>

            <div
                className={`poetry-wrapper-wrap h-screen fixed top-0 z-[9] left-0 ${className} ${isOnIndexPage ? 'pointer-events-auto cursor-pointer w-[80px]' : ''} ${!isOnPoetryPage && !isOnIndexPage ? 'pointer-events-none w-fit' : ''}`}
                onClick={
                    !isOnPoetryPage
                        ? () =>
                              navigate(`/${lang}/poetry/`, {
                                  history: 'push',
                              })
                        : undefined
                }
            >
                <div className={`work-list flex ${isOnIndexPage ? 'pointer-events-none' : ''}`} >
                    <div className="poetry-wrapper flex fixed translate-y-[20px] top-0 left-0 opacity-0 px-body-p-x "
                        style={{ opacity: opacityValue, transform: `translateX(${translateXValue})` }}>
                        {/* {dataPoetry.slice(2).map((poetry) => (
                            <div key={poetry.id}>
                                <PoetryTitle
                                    className=''
                                    pathOpen={poetry.svgPath?.svgPathOpenData || ''}
                                    pathClose={poetry.svgPath?.svgPathCloseData || ''}
                                    title={poetry.title}
                                    targetHref={`/${lang}/poetry/${poetry.slug}/`}
                                    keyId={poetry.id}
                                    client:only='react'
                                    transition:name='poetrytitles' 
                                    transition:persist
                                />
                            </div>
                        ))} */}
                        <PoetryTitleHardLayout lang={lang} client:only='react' transition:name='poetryhardlayout' transition:persist/>
                    </div>
                </div>


            </div>
        </>
    );
};

export default PoetryList;
export const client = 'only';
