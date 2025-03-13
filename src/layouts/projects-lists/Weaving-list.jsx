import { useEffect } from "react";
import { navigate } from "astro:transitions/client";

const WeavingList = ({ dataWeaving, isOnWeavingPage, targetHref, hidden, lang }) => {
  // Fonction pour gérer le survol et changer l'image
  const handleMouseEnter = (imageUrl) => {
    const imageElement = document.querySelector('.dynamic-image');
    const wrapperElement = document.querySelector('.dynamic-image--wrapper');
    if (imageElement) {
      imageElement.src = imageUrl;
    }
    if (wrapperElement) {
      wrapperElement.style.opacity = '1';
    }
  };

  const handleMouseLeave = () => {
    const wrapperElement = document.querySelector('.dynamic-image--wrapper');
    if (wrapperElement) {
      wrapperElement.style.opacity = '0';
    }
  };

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
                <a href={`/${lang}/weaving/${weaving.slug}/`} className="pr-1" onMouseEnter={() => {
                  const mediaUrl = weaving.medias && weaving.medias[0] && weaving.medias[0].url;
                  if (mediaUrl) {
                    handleMouseEnter(mediaUrl);
                  }
                }}
                  onMouseLeave={handleMouseLeave}
                  data-image-preview={weaving.medias && weaving.medias[0] && weaving.medias[0].url}>
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
                  <a href={`/${lang}/weaving/${weaving.slug}/`} className="pr-1" onMouseEnter={() => {
                    const mediaUrl = weaving.medias && weaving.medias[0] && weaving.medias[0].url;
                    if (mediaUrl) {
                      handleMouseEnter(mediaUrl);
                    }
                  }}
                    onMouseLeave={handleMouseLeave}
                    data-image-preview={weaving.medias && weaving.medias[0] && weaving.medias[0].url}>
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
      <div class="fixed top-0 left-0 h-screen w-screen z-[-1] flex justify-center items-center pointer-events-none">
        <div class="dynamic-image--wrapper w-[80vw] max-w-[350px] aspect-[350/300] transition-all opacity-0 duration-300 ease-in-out">
          <img class="w-full h-full object-cover dynamic-image" src="https://res.cloudinary.com/dbfkv6zgf/image/upload/v1740733159/DSC_4802_068fca2c07.jpg" alt="preview image"></img>
        </div>
      </div>
    </>
  );
};

export default WeavingList;
