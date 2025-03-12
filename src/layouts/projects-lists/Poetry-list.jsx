import { useEffect } from "react";
import { navigate } from "astro:transitions/client";
import Matter from "matter-js";


const PoetryList = ({ dataPoetry, isOnPoetryPage, targetHref, hidden, lang }) => {


    // useEffect(() => {
    //     // module aliases
    //     var Engine = Matter.Engine,
    //         Render = Matter.Render,
    //         Runner = Matter.Runner,
    //         Bodies = Matter.Bodies,
    //         Composite = Matter.Composite;

    //     // create an engine
    //     var engine = Engine.create();

    //     // create a renderer
    //     var render = Render.create({
    //         element: document.body,
    //         engine: engine
    //     });

    //     // create two boxes and a ground
    //     var boxA = Bodies.rectangle(400, 200, 80, 80);
    //     var boxB = Bodies.rectangle(450, 50, 80, 80);
    //     var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    //     // add all of the bodies to the world
    //     Composite.add(engine.world, [boxA, boxB, ground]);

    //     // run the renderer
    //     Render.run(render);

    //     // create runner
    //     var runner = Runner.create();

    //     // run the engine
    //     Runner.run(runner, engine);
    // }, []);


    // Render
    return (
        <>

            <div className="hidden border border-blue-600 h-[95vh]">
                <svg width="145" height="100%" viewBox="0 0 145 1009" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" >
                    <path d="M0.5 1C10.8333 29.5 35.7 91.6 52.5 112C73.5 137.5 102 225 106.5 270.5C111 316 112.5 359.5 119.5 403.5C126.5 447.5 101.5 468 119.5 511.5C137.5 555 132.5 638.5 119.5 655.5C106.5 672.5 93.5 768 106.5 796C119.5 824 132.5 903 119.5 941.5C109.1 972.3 131.833 998.667 144.5 1008" stroke="black" />
                </svg>
            </div>

            <div
                className={`w-fit ${!isOnPoetryPage ? "cursor-pointer" : ""
                    }`}
                onClick={
                    !isOnPoetryPage
                        ? () => navigate(`/${lang}${targetHref}`, { history: "push" })
                        : undefined
                }
            >
                <div className={`flex gap-[20px] transition-all duration-1000 ease-in-out ${!isOnPoetryPage ? "pointer-events-none" : ""} ${!hidden ? "" : "translate-x-[-50vw] "}`}>
                    <div className={`max-w-0 overflow-hidden transition-all duration-500 ease-in-out delay-[0.2s] ${isOnPoetryPage ? "max-w-[100vw]" : "max-w-0"}`}>
                        {/* Liste Hidden */}
                        {/* {isOnPoetryPage && ( */}
                            <ul>
                                {dataPoetry.slice(1).map((poetry) => (
                                    <li className="poetry-title w-fit" key={poetry.id}>
                                        <a href={`/${lang}/poetry/${poetry.slug}/`} className="pr-1">
                                            <div className="flex flex-col gap-[3px]">
                                                {poetry.title.split('').map((letter, index) => (
                                                    <span key={index}>{letter}</span>
                                                ))}
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        {/* )} */}
                        {/* (END) Liste Hidden */}
                    </div>
                    {/* Liste Homepage */}
                    <ul>
                        {dataPoetry.slice(0, 1).map((poetry) => (
                            <li className="poetry-title w-fit" key={poetry.id}>
                                <a href={`/${lang}/poetry/${poetry.slug}/`} className="pr-1">
                                    <div className="flex flex-col gap-[3px]">
                                        {poetry.title.split('').map((letter, index) => (
                                            <span key={index}>{letter}</span>
                                        ))}
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                    {/* (END) Liste Homepage */}

                </div>
            </div>

        </>
    );
};

export default PoetryList;
