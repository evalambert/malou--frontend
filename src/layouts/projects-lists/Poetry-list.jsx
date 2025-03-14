import { useEffect, useState } from "react";
import { navigate } from "astro:transitions/client";
import Matter from "matter-js";
import "../../assets/styles/matterPoems.css";
import 'pathseg';
import decomp from 'poly-decomp';

const PoetryList = ({ dataPoetry, isOnPoetryPage, targetHref, hidden, lang }) => {

    const [letterPositions, setLetterPositions] = useState({});
    const [letterOffsets, setLetterOffsets] = useState({});

    useEffect(() => {
        window.decomp = decomp;
        var matterContainer = document.getElementById('matter-container');
        var thiccness = 80;

        // Générer les offsets une seule fois au chargement
        const initialOffsets = {};
        dataPoetry.forEach(poetry => {
            poetry.title.split('').forEach((_, index) => {
                initialOffsets[`${poetry.id}-${index}`] = Math.random() * 20 - 10;
            });
        });
        setLetterOffsets(initialOffsets);

        // Créer un tableau des titres avec leurs lettres
        const poetryTitlesLetters = dataPoetry.map(poetry => ({
            id: poetry.id,
            title: poetry.title,
            letters: poetry.title.split('')
        }));

        // console.log(poetryTitlesLetters); 

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
                // showAxes: true,
                // showPositions: true,
                // showAngleIndicator: true,
                // showCollisions: true,
                // showVelocity: true
            }
        });


        // Création des chaînes pour chaque titre
        const ropes = poetryTitlesLetters.map((poetry, index) => {
            const group = Body.nextGroup(true);

            const rope = Composites.stack(
                30 + (index * 80),
                100 - (index * 80),
                poetry.letters.length,
                1,
                10,
                10,
                function (x, y) {
                    const body = Bodies.rectangle(x - 20, y, 40, 50, {
                        collisionFilter: { group: group },
                        chamfer: 5,
                        render: {
                            fillStyle: 'transparent',
                            strokeStyle: 'transparent',
                            lineWidth: 1,
                            visualCenterOfMass: true
                        },
                        density: 1,
                        frictionAir: 0.02
                    });
                    // console.log('Rectangle body:', body); // Ajout du console.log
                    return body;
                }
            );

            // Modifier les contraintes de la chaîne pour correspondre à ropeC
            Composites.chain(rope, 0.3, 0, -0.3, 0, {
                stiffness: 1,  // Augmenté de 0.8 à 1
                length: 0,     // Réduit à 0 pour des connexions plus serrées
                render: { type: 'line' }
            });

            // Modifier le point d'ancrage comme dans ropeC
            Composite.add(rope, Constraint.create({
                bodyB: rope.bodies[0],
                pointB: { x: -20, y: 0 },
                pointA: { x: rope.bodies[0].position.x, y: rope.bodies[0].position.y },
                stiffness: 1  // Réduit à 0.5 comme dans l'exemple
            }));

            return rope;
        });

        // Sélectionne l'élément SVG avec l'ID 'matterflor'
        const path = document.getElementById('matterflor');
        // Convertit le chemin SVG en vertices (points) pour Matter.js
        // Le paramètre 30 définit la précision de la conversion
        const vertices = Svg.pathToVertices(path, 30);
        // Obtient les dimensions du path SVG


        // Crée une forme physique à partir des vertices
        // La position est calculée pour centrer la forme horizontalement
        // et la placer en bas du conteneur
        const groundShape = Bodies.fromVertices(
            matterContainer.clientWidth / 2,
            matterContainer.clientHeight - 424 / 5,
            vertices,
            {
                isStatic: true,
                render: {
                    fillStyle: 'transparent',
                    strokeStyle: 'transparent',
                    visible: true
                },
                // Ajout des propriétés de collision
                friction: 0.1,
                restitution: 0.5,
                slop: 0.5,
                chamfer: { radius: 5 },
                collisionFilter: {
                    category: 0x0001,
                    mask: 0xFFFFFFFF
                }
            }
        );


        // Wall and Ground Variables
        let leftWall = Bodies.rectangle(0 - thiccness / 2, matterContainer.clientHeight / 2, thiccness, matterContainer.clientHeight * 5, { isStatic: true });
        let rightWall = Bodies.rectangle(matterContainer.clientWidth + thiccness / 2, matterContainer.clientHeight / 2, thiccness, matterContainer.clientHeight * 5, { isStatic: true });

        // Ajouter toutes les chaînes au monde
        Composite.add(world, [
            ...ropes,
            leftWall,
            // rightWall,
            groundShape,
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

            // Recalculer l'échelle des vertices
            const scaleX = matterContainer.clientWidth / 1921;
            const scaleY = matterContainer.clientHeight / 424;

            const scaledVertices = vertices.map(vertex => ({
                x: vertex.x * scaleX,
                y: vertex.y * scaleY
            }));

            // Appliquer les nouvelles vertices et repositionner le groundShape
            Matter.Body.setVertices(groundShape, scaledVertices);
            Matter.Body.setPosition(groundShape, {
                x: matterContainer.clientWidth / 2,
                y: matterContainer.clientHeight - 424 / 5
            });

            // Repositionner les murs
            Matter.Body.setPosition(rightWall, {
                x: matterContainer.clientWidth + thiccness / 2,
                y: matterContainer.clientHeight / 2
            });

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
            <div className="hidden">
                <svg
                    id="matterflor-svg"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 1921 424"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto"
                >
                    <g clipPath="url(#clip0_572_47)">
                        <path
                            id="matterflor"
                            d="M0.5 1.95996V423.5H1920.5V28.79C1706 492 318 585 0.5 1.95996Z"
                            fill="black"
                            stroke="white"
                            strokeMiterlimit="10"
                        />
                    </g>
                    <defs>
                        <clipPath id="clip0_572_47">
                            <rect width="1921" height="424" fill="white" />
                        </clipPath>
                    </defs>
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
                <div className={`flex w-screen h-screen fixed top-[20h] left-0 ${!hidden ? "" : "left-[-50vh]"}`}>
                    <div id="matter-container" className="h-[80vh] w-[20vw]"></div>



                    <div className="bg-red-500">
                        {dataPoetry.map((poetry) => (
                            <div key={poetry.id}>
                                {poetry.title.split('').map((letter, index) => {
                                    const position = letterPositions[`${poetry.id}-${index}`] || { x: 0, y: 0 };
                                    const offset = letterOffsets[`${poetry.id}-${index}`] || 0;

                                    return (
                                        <a
                                            href={`/${lang}/poetry/${poetry.slug}/`}
                                            className="pr-1 absolute"
                                            key={index}
                                            style={{
                                                left: `${position.x + offset}px`,
                                                top: `${position.y}px`,
                                                transform: "translate(-50%, -50%)",
                                            }}
                                        >
                                            <div className="p-5px">{letter}</div>
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
export const client = 'only';
