import { navigate } from "astro:transitions/client";

const LanguageSwitch = ({ currentLang, currentPath }) => {
  const handleLanguageChange = () => {
    const newLang = currentLang === "fr" ? "en" : "fr";
    const newPath = currentPath.replace(`/${currentLang}/`, `/${newLang}/`);
    navigate(newPath, { history: "push" });
  };

  return (
    <button
      onClick={handleLanguageChange}
      className="rotate-[35deg] hover:opacity-50 transition"
    >
      {currentLang === "fr" ? "fr," : "en,"}
    </button>
  );
};

export default LanguageSwitch;
