function onMouseEnter(event) {
    const data = getData(); // Supposons que getData() est la fonction qui retourne le tableau
    if (data && data.length > 0) {
        const firstElement = data[0];
        // ... utilisez firstElement ici ...
    } else {
        console.error("Le tableau est vide ou non défini");
    }
} 