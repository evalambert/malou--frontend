import PaintingsListCompact from "../layouts/projects-lists/Paintings-list-compact.jsx";
import VitrailListCompact from "../layouts/projects-lists/Vitrail-list-compact.jsx";
import { navigate } from 'astro:transitions/client';
import { useState } from "react";

const Homepage = ({ dataVitrails, dataPaintings }) => {

    const [clickedItem, setClickedItem] = useState(null);

    
    const handleClick = (event, path) => {
        event.preventDefault();
        setClickedItem(path);
        document.querySelector('body').classList.add('hide-lists');
        setTimeout(() => {
            navigate(path);
        }, 500);
        setTimeout(() => {
            setClickedItem(null);
        }, 2000);
    }

    return (
        <>
            <ul className="homepage-list">
                <li id="vitrail-compact-list" className="">
                    <a href="/vitrail" className={`compact-list fixed top-0 right-0 ${clickedItem === '/vitrail' ? 'clicked' : ''}`} onClick={(event) => handleClick(event, '/vitrail')}>
                        <VitrailListCompact dataVitrails={dataVitrails} client:only />
                    </a>
                </li>
                <li id="painting-compact-list" className="">
                    <a href="/painting" className={`compact-list fixed bottom-0 ${clickedItem === '/painting' ? 'clicked' : ''}`} onClick={(event) => handleClick(event, '/painting')}>
                        <PaintingsListCompact dataPaintings={dataPaintings} client:only />
                    </a>
                </li>
            </ul>
            
        </>
    );
};

export default Homepage;