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
        <div className='wrapper-accordion-read-project w-full fixed z-[999] bottom-0 left-0 right-0 flex flex-col justify-center items-center bg-black border-2 border-red-500'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='w-full p-4 text-white border-2 border-blue-600'
            >
                {lang === 'fr' ? 'Lire' : 'Read'}
            </button>

            <div
                className={`bloc-description w-full transition-[max-height] duration-500 ease-liear overflow-hidden text-center text-white 
                    ${isOpen ? 'max-h-[calc(100vh)]' : 'max-h-0'}`}
            >
                <div className='triangle-right'></div>
                <div className='triangle-left'></div>
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
