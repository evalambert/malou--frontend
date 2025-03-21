import { createContext, useContext, useState, useEffect } from "react";

// Créer le contexte avec une valeur par défaut
const TransitionContext = createContext({
  isExiting: false,
  setIsExiting: () => { }
});

export const TransitionProvider = ({ children }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setIsExiting(true);
      console.log('Transition starting...');
    };

    const handleEnd = () => {
      setIsExiting(false);
      console.log('Transition ending...');
    };

    document.addEventListener('astro:before-preparation', handleStart);
    document.addEventListener('astro:after-preparation', handleEnd);

    // Assurez-vous que les événements sont bien supprimés pour éviter les fuites de mémoire
    return () => {
      document.removeEventListener('astro:before-preparation', handleStart);
      document.removeEventListener('astro:after-preparation', handleEnd);
    };
  }, []); // L'effet est exécuté une seule fois au montage du composant

  // useEffect(() => {
  //   console.log('État de transition actuel:', isExiting);
  // }, [isExiting]);

  return (
    <TransitionContext.Provider value={{ isExiting, setIsExiting }}>
      <div className="transition-manager">
        {children}
      </div>
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    console.warn('useTransition doit être utilisé à l\'intérieur d\'un TransitionProvider');
    return { isExiting: false, setIsExiting: () => { } };
  }
  return context;
};