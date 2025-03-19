// src/components/AccordionReadProject.jsx

import { useState } from 'react';
import '../assets/styles/triangleShapeText.css';

export default function AccordionReadProject({
    description,
    technique,
    materials,
    width,
    height,
    lang,
    year,
}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
            <div
                className={`wrapper-accordion-read-project w-full absolute z-[999] left-0 bg-black border-2 border-white 
                    ${
                        isOpen
                            ? 'h-full top-[calc(50%)]'
                            : 'h-[61px] top-[calc(100%-61px)] overflow-hidden'
                    } transition-all duration-500 ease-in-out`}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className='w-full p-4 text-white border-2 border-red-500'
                >
                    {lang === 'fr' ? 'Lire' : 'Read'}
                </button>

                <div className='bloc-description text-center text-white border-2 border-green-500'>
                    {/* <div className='triangle-right'></div>
                <div className='triangle-left'></div> */}
                    <div className='description-project'>
                        <p>{description}</p>
                        <p>
                            {technique}, {materials}
                        </p>
                        <p>
                            {width} x {height} cm
                        </p>
                        <p>{year}</p>
                    </div>
                </div>
            </div>
    );
}
