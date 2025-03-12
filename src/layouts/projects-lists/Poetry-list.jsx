import { useEffect, useState } from "react";
import { navigate } from "astro:transitions/client";
import Matter from "matter-js";
import "../../assets/styles/matterPoems.css";
import 'pathseg';
import decomp from 'poly-decomp';

window.decomp = decomp;

const PoetryList = ({ dataPoetry, isOnPoetryPage, targetHref, hidden, lang }) => {

    const [letterPositions, setLetterPositions] = useState({});


    useEffect(() => {
        var matterContainer = document.getElementById('matter-container');
        var thiccness = 80;


        // Créer un tableau des titres avec leurs lettres
        const poetryTitlesLetters = dataPoetry.map(poetry => ({
            id: poetry.id,
            title: poetry.title,
            letters: poetry.title.split('')
        }));

        console.log(poetryTitlesLetters);

        // module aliases
        var Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Body = Matter.Body,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Composites = Matter.Composites,
            Constraint = Matter.Constraint,
            Bodies = Matter.Bodies,
            Svg = Matter.Svg,
            Vector = Matter.Vector,
            Vertices = Matter.Vertices;

        // create an engine
        var engine = Engine.create(),
            world = engine.world;


        // create a renderer
        var render = Render.create({
            element: matterContainer,
            engine: engine,
            options: {
                width: matterContainer.clientWidth,
                height: matterContainer.clientHeight,
                wireframes: false,
                // showAngleIndicator: true,
                // showCollisions: true,
                // showVelocity: true
            }
        });


        // Création des chaînes pour chaque titre
        const ropes = poetryTitlesLetters.map((poetry, index) => {
            const group = Body.nextGroup(true);

            // Créer une pile de cercles pour chaque lettre
            const rope = Composites.stack(
                30 + (index * 50), // Position X décalée pour chaque mot
                100 - (index * 50),
                poetry.letters.length, // Nombre de bodies basé sur le nombre de lettres
                1,
                10,
                10,
                function (x, y) {
                    return Bodies.circle(x, y, 12, {
                        // render: {
                        //     fillStyle: "transparent", // Remplit le cercle en blanc
                        //     strokeStyle: "transparent", // Supprime le contour
                        //     lineWidth: 0 // S'assure qu'il n'y a pas de contour
                        // },
                        collisionFilter: { group: group },
                        restitution: 0.5, // Ajoute du rebond
                        friction: 0.2,    // Réduit la friction
                        density: 0.02,    // Réduit la densité
                        frictionAir: 0.1 // Ajoute une légère résistance à l'air
                    });
                }
            );

            // Créer la chaîne entre les cercles
            Composites.chain(rope, 0.5, 0, -0.5, 0, {
                stiffness: 0.8,
                length: 0,
                render: { type: 'line' }
            });

            // Ajouter le point d'ancrage pour le premier cercle
            Composite.add(rope, Constraint.create({
                bodyB: rope.bodies[0],
                pointB: { x: 0, y: 0 },
                pointA: { x: rope.bodies[0].position.x, y: rope.bodies[0].position.y },
                stiffness: 0.8
            }));

            return rope;
        });


        // Wall and Ground Variables
        var ground = Bodies.rectangle(matterContainer.clientWidth / 2, matterContainer.clientHeight + thiccness / 2, matterContainer.clientWidth, thiccness, { isStatic: true });
        let leftWall = Bodies.rectangle(0 - thiccness / 2, matterContainer.clientHeight / 2, thiccness, matterContainer.clientHeight * 5, { isStatic: true });
        let rightWall = Bodies.rectangle(matterContainer.clientWidth + thiccness / 2, matterContainer.clientHeight / 2, thiccness, matterContainer.clientHeight * 5, { isStatic: true });

        // Ajouter toutes les chaînes au monde
        Composite.add(world, [
            ...ropes,
            ground,
            leftWall,
            // rightWall
        ]);


        // run the renderer
        Render.run(render);

        // create runner
        var runner = Runner.create();

        // run the engine
        Runner.run(runner, engine);


        // resize the canvas
        function handleResize(matterContainer) {
            render.canvas.width = matterContainer.clientWidth;
            render.canvas.height = matterContainer.clientHeight;

            Matter.Body.setPosition(
                ground,
                Matter.Vector.create(
                    matterContainer.clientWidth / 2,
                    matterContainer.clientHeight + thiccness / 2
                )
            );
            Matter.Body.setPosition(
                rightWall,
                Matter.Vector.create(
                    matterContainer.clientWidth + thiccness / 2,
                    matterContainer.clientHeight / 2
                )
            );

        }
        Matter.Events.on(engine, "afterUpdate", function () {
            const newPositions = {};

            poetryTitlesLetters.forEach((poetry, poetryIndex) => {
                poetry.letters.forEach((letter, letterIndex) => {
                    const body = ropes[poetryIndex].bodies[letterIndex];
                    if (body) {
                        newPositions[`${poetry.id}-${letterIndex}`] = {
                            x: body.position.x,
                            y: body.position.y,
                        };
                    }
                });
            });

            setLetterPositions(newPositions);
        });
        window.addEventListener('resize', () => {
            handleResize(matterContainer);
        });
    }, []);


    // Render
    return (
        <>


            <div
                className={`w-fit ${!isOnPoetryPage ? "cursor-pointer" : ""
                    }`}
                onClick={
                    !isOnPoetryPage
                        ? () => navigate(`/${lang}${targetHref}`, { history: "push" })
                        : undefined
                }
            >
                <div className="flex w-screen h-screen fixed top-0 left-0">
                    <div id="matter-container" className="h-screen w-[80vw]"></div>

                    <svg id="matterflor" width="1921" height="424" viewBox="0 0 1921 424" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_572_47)">
                            <path d="M0.5 1.95996V423.5H1920.5V28.79C1706 492 318 585 0.5 1.95996Z" fill="black" stroke="white" stroke-miterlimit="10" />
                        </g>
                        <defs>
                            <clipPath id="clip0_572_47">
                                <rect width="1921" height="424" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>

                    <div className="h-screen w-[20vw] bg-red-500">
                        {dataPoetry.map((poetry) => (
                            <div key={poetry.id}>
                                {poetry.title.split('').map((letter, index) => {
                                    const position = letterPositions[`${poetry.id}-${index}`] || { x: 0, y: 0 };
                                    return (
                                        <a
                                            href={`/${lang}/poetry/${poetry.slug}/`}
                                            className="pr-1 absolute"
                                            key={index}
                                            style={{
                                                left: `${position.x}px`,
                                                top: `${position.y}px`,
                                                transform: "translate(-50%, -50%)",
                                            }}
                                        >
                                            <span>{letter}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>


            </div>

        </>
    );
};

export default PoetryList;
