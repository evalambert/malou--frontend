//src/layouts/About.jsx
import { useStore } from "@nanostores/react";
import { activeComponent, toggleComponent } from "../lib/store.js";

export default function AboutComponent({ about, lang }) {
  const active = useStore(activeComponent);

  return (
    <section
      className={`wrapper-about md:fixed right-0 flex flex-col gap-3 w-full 
        ${
        active === "actu"
        ? "h-0 top-[calc(-100vh)]"
        : "h-full top-0"
        } transition-all duration-500 ease-in-out overflow-hidden `}
    >
      <div className="wrapper--bio md:order-2 flex">
        <div className="fake-nav hidden md:block flex-none w-[170px]"></div>
        <p className="bio">{about.bio}</p>
      </div>
      <div className="wrapper--email md:order-1 flex">
        <div className="fake-nav hidden md:block flex-none w-[270px] h-[131px] "></div>
        <button
          className={`fixed top-0 left-[270px] p-6 rotate-[27.28deg] transition-opacity duration-300 
          ${
            active === "about"
              ? "opacity-0 pointer-events-none"
              : "opacity-100 pointer-events-auto"
          }`}
          onClick={toggleComponent}
        >
          {lang === "fr" ? "à propos" : "about"}
        </button>
        <div className="email flex flex-1 justify-center items-center">
          <p className="h-fit rotate-[-16deg] md:rotate-[10.87deg] py-7 px-4 md:px-0">
            {about.email}
          </p>
        </div>
      </div>
      <div className="wrappper--phone flex md:order-3 justify-end md:justify-start ">
        {/*  <p>{about.studio}, {about.city}</p> */}
        <p className="pt-[31px] ps-[47px] rotate-[15.72deg] md:rotate-45">
          {about.phone}
        </p>
      </div>
      <div className="wrapper--credits md:order-4 flex flex-col flex-1 items-center md:items-end justify-end md:pe-20 text-center">
        <div className="flex flex-col justify-center items-center h-fit rotate-[-16deg] md:py-12 md:px-4">
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
