//src/layouts/About.jsx
import { useStore } from "@nanostores/react";
import { activeComponent, toggleComponent } from "../lib/store.js";

export default function AboutComponent({ about, lang }) {
  const active = useStore(activeComponent);

  return (
    <section
      className={`section--about absolute left-0 md:fixed md:right-0 w-full flex flex-col gap-3 
        ${
          active === "actu"
            ? "md:h-0 md:top-[calc(-100vh)] top-[100vh] h-0"
            : "md:h-full md:top-0 top-[333px] h-auto"
        } transition-all duration-500 ease-in-out overflow-hidden bg-white`}
    >
      <button
        className={`button-about md:fixed md:top-0 md:left-[270px] md:p-6 md:rotate-[27.28deg] rotate-[19deg] transition-opacity duration-300 hidden md:block
          ${active === "about" ? "opacity-0" : "opacity-100"}`}
        onClick={toggleComponent}
      >
        {lang === "fr" ? "à propos" : "about"}
      </button>
      <div className="wrapper--bio md:order-2 flex">
        <div className="fake-nav hidden md:block flex-none w-[170px]"></div>
        <p className="bio">{about.bio}</p>
      </div>
      <div className="wrapper--email md:order-1 flex">
        <div className="fake-nav hidden md:block flex-none w-[270px] h-[131px] "></div>
        <div className="email flex flex-1 justify-center items-center">
          <p className="rotate-[-16deg] md:rotate-[10.87deg] py-9 px-4 md:py-0 md:px-0">
            {about.email}
          </p>
        </div>
      </div>
      <div className="wrappper--phone flex md:order-3 justify-end md:justify-start ">
        {/*  <p>{about.studio}, {about.city}</p> */}
        <p className="md:pt-[31px] md:ps-[47px] pb-[24px] pt-[8px] rotate-[15.72deg] md:rotate-45">
          {about.phone}
        </p>
      </div>
      <div className="wrapper--credits md:order-4 flex flex-col flex-1 items-center md:items-end justify-end md:pe-20 text-center">
        <div className="flex flex-col justify-center items-center h-fit rotate-[-16deg] md:py-12 md:px-4 pb-[50px] pt-[5px]">
          <p>©{about.update}</p>
          <p>
            {lang === "fr" ? (
              <>
                Conception et <br />
                développement <br />
                <a href="https://greta-oto.xyz">Greta oto</a>
              </>
            ) : (
              <>
                Design and <br />
                development <br />
                <a href="https://greta-oto.xyz">Greta oto</a>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
