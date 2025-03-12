import { useEffect } from "react";
import { navigate } from "astro:transitions/client";

const WeavingList = ({ dataWeaving, isOnWeavingPage, targetHref, hidden, lang }) => {
  useEffect(() => {
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
      <div className={`fixed right-0 bottom-0 transition-all duration-1000 ease-in-out ${!isOnWeavingPage ? "cursor-pointer" : ""
        } ${!hidden ? "" : "translate-y-full translate-x-full"}`}
        onClick={
          !isOnWeavingPage
            ? () => navigate(`/${lang}${targetHref}`, { history: "push" })
            : undefined
        }>
        <div
          className={`grid auto-cols-auto auto-rows-min ${!isOnWeavingPage ? "pointer-events-none" : ""
            }`}
        >
          {/* Liste Homepage */}
          <ul className="w-fit flex flex-col items-end">
            {dataWeaving.slice(0, 5).map((weaving) => (
              <li className="weaving-title w-fit" key={weaving.id}>
                <a href={`/${lang}/weaving/${weaving.slug}/`} className="pr-1">
                  {weaving.title}
                </a>
              </li>
            ))}
          </ul>
          {/* (END) Liste Homepage */}
          <div className={`max-w-0 max-h-0 overflow-hidden col-start-2 row-start-2 transition-all duration-1000 ease-in-out delay-[0.2s] ${isOnWeavingPage ? "max-w-[100vw] max-h-[100vh]" : ""}`}>
            {/* Liste Hidden */}
            {/* {isOnWeavingPage && ( */}
              <ul className="w-fit flex flex-col items-end">
                {dataWeaving.slice(5).map((weaving) => (
                  <li className="weaving-title w-fit" key={weaving.id}>
                    <a href={`/${lang}/weaving/${weaving.slug}/`} className="pr-1">
                      {weaving.title}
                    </a>
                  </li>
                ))}
              </ul>
            {/* )} */}
            {/* (END) Liste Hidden */}
          </div>
        </div>
      </div >
    </>
  );
};

export default WeavingList;
