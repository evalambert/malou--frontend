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
      className="rotate-30 font-bradford hover:opacity-50 transition"
    >
      {currentLang === "fr" ? "Fr," : "En,"}
    </button>
  );
};

export default LanguageSwitch;

