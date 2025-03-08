//layouts/About.jsx

const About = ({ about, lang }) => {
  return (
    <section className="wrapper-about fixed top-0 right-0 w-full h-full">
      <div className="wrapper-email flex">
        <div className="box-fake-nav w-[270px] h-[131px] flex-none"></div>
        <div className="box-email flex flex-1 justify-center items-center">
          <p className="h-fit rotate-[10.87deg]">{about.email}</p>
        </div>
      </div>

      <div className="wrapper-bio flex">
        <div className="box-fake-nav flex-none w-[170px]"></div>
        <p className="box-bio leading-base">{about.bio}</p>
      </div>

      <div className="flex wrappper-contac">
        {/* <p>{about.studio}, {about.city}</p> */}
        {/* <a href={about.network}>instagram</a> */}
        <p className="h-fit rotate-45 py-12 px-4">{about.phone}</p>
      </div>

      <div className="wrapper-credits flex flex-col items-end pe-10 text-center">
        <div className="flex flex-col justify-center items-center leading-base h-fit rotate-[13deg] py-12 px-4">
          <p>© {about.update}</p>
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
};

export default About;
