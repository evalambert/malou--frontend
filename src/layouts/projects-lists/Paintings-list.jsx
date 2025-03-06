import { useEffect, useState } from "react";
import PaintingsListCompact from "./Paintings-list-compact.jsx";

const PaintingsList = ({ dataPaintings, lang, isOnPaintingPage }) => {
  useEffect(() => {
    const calculateLayout = () => {
      const liTitle = document.querySelectorAll("li.painting-title");
      let previousLiWidth = 0;

      liTitle.forEach((li) => {
        const viewportWidth = window.innerWidth;
        if (previousLiWidth + li.offsetWidth > viewportWidth) {
          let maxMarginLeft = viewportWidth - li.offsetWidth;
          li.style.marginLeft = `${maxMarginLeft}px`;
        } else {
          li.style.marginLeft = `${previousLiWidth}px`;
          previousLiWidth = previousLiWidth + li.offsetWidth;
          return previousLiWidth;
        }
      });
    };

    // Initial calculation
    setTimeout(calculateLayout, 100);

    // Add resize event listener
    window.addEventListener("resize", calculateLayout);

    // Cleanup
    return () => window.removeEventListener("resize", calculateLayout);
  }, [dataPaintings]);

  // Render
  return (
    <>
      <div className="fixed left-[100px] bottom-0 border border-amber-400">
        <PaintingsListCompact dataPaintings={dataPaintings} />
        <div
          className={`max-h-0 overflow-hidden transition-all duration-300 ease-in-out delay-[0.3s] ${
            isOnPaintingPage ? "max-h-[100vh]" : "max-h-0"
          }`}
        >
          <ul>
            {dataPaintings.slice(4).map((painting) => (
              <li className="painting-title w-fit" key={painting.id}>
                <a
                  href={`/${lang}/painting/${painting.slug}`}
                  className="block whitespace-nowrap"
                >
                  {painting.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PaintingsList;
