import { useEffect, useState } from "react";
import { navigate } from "astro:transitions/client";
import PreviewImg from "../../components/PreviewImg.jsx";
import WeavingTitle from "../../components/title/WeavingTitle.jsx";

const WeavingList = ({ dataWeaving, isOnWeavingPage, targetHref, hidden, lang }) => {

  const [hiddenListHeightWeaving, setHiddenListHeightWeaving] = useState(0);
  const [hiddenListWidthWeaving, setHiddenListWidthWeaving] = useState(0);

  useEffect(() => {
    // Afficher la hauteur et largeur de la liste cachée
    const hiddenListHeightValue = document.querySelector('.hidden-list-weaving').clientHeight;
    const hiddenListWidthValue = document.querySelector('.hidden-list-weaving').clientWidth;

    setHiddenListHeightWeaving(hiddenListHeightValue);
    setHiddenListWidthWeaving(hiddenListWidthValue);

    const liTitle = document.querySelectorAll("li.weaving-title");
    let nextLiWidth = 0;

    liTitle.forEach((li) => {
      nextLiWidth = li.nextElementSibling ? li.nextElementSibling.offsetWidth : 0;
      li.style.marginRight = `${nextLiWidth}px`;
      return nextLiWidth;
    });

  }, [dataWeaving]);

  console.log(dataWeaving);

  // Render
  return (
    <>
      <div className={`fixed right-0 bottom-0 transition-all duration-1000 ease-in-out mix-blend-difference ${!isOnWeavingPage ? "cursor-pointer" : ""
        } ${!hidden ? "" : "translate-y-full translate-x-full"}`}
        onClick={
          !isOnWeavingPage
            ? () => navigate(`/${lang}${targetHref}`, { history: "push" })
            : undefined
        }>
        <div
          className={`grid auto-cols-auto auto-rows-min transition-all duration-1000 ease-in-out ${!isOnWeavingPage ? "pointer-events-none" : ""
            }`}
          style={isOnWeavingPage ? { transform: `translate(0px,0px)` } : { transform: `translate(${hiddenListWidthWeaving}px,${hiddenListHeightWeaving}px)` }}
        >
          {/* Liste Homepage */}
          <ul className="w-fit flex flex-col items-end">
            {dataWeaving.slice(0, 5).map((weaving) => (
              <li className="weaving-title w-fit" key={weaving.id}>
                <WeavingTitle weaving={weaving} lang={lang} />
              </li>
            ))}
          </ul>
          {/* (END) Liste Homepage */}
          <div className={`hidden-list-weaving overflow-hidden col-start-2 row-start-2 transition-all duration-1000 ease-in-out delay-[0.2s]`}
          >
            {/* Liste Hidden */}
            {/* {isOnWeavingPage && ( */}
            <ul className="w-fit flex flex-col items-end">
              {dataWeaving.slice(5).map((weaving) => (
                <li className="weaving-title w-fit" key={weaving.id}>
                  <WeavingTitle weaving={weaving} lang={lang} />
                </li>
              ))}
            </ul>
            {/* )} */}
            {/* (END) Liste Hidden */}
          </div>
        </div>
      </div >
      <PreviewImg />
    </>
  );
};

export default WeavingList;
