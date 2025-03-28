import { navigate } from 'astro:transitions/client';
import { useState } from 'react';

const LanguageSwitch = ({ currentLang, currentPath }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleLanguageChange = () => {
        const newLang = currentLang === 'fr' ? 'en' : 'fr';
        const newPath = currentPath.replace(`/${currentLang}/`, `/${newLang}/`);
        navigate(newPath, { history: 'push' });
    };

    return (
        <button
            onClick={handleLanguageChange}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className='w-8 rotate-[35deg] text-center'
        >
            {isHovered
                ? currentLang === 'fr'
                    ? 'en,'
                    : 'fr,'
                : `${currentLang},`}
        </button>
    );
};

export default LanguageSwitch;
