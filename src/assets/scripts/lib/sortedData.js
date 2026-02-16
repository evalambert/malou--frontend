// src/assets/scripts/lib/sortedData.js
import fetchApi from './strapi';

export async function fetchSortedCategory({ category, homepageKey, lang }) {
    const allItemsRaw = await fetchApi({
        endpoint: `${category}?populate=*`,
        wrappedByKey: 'data',
        locale: lang,
    });
    const allItems = Array.isArray(allItemsRaw) ? allItemsRaw : allItemsRaw?.data ?? [];

    const homepage = await fetchApi({
        endpoint: `homepage?populate=${homepageKey}`,
        wrappedByKey: 'data',
        locale: lang,
    });

    // Si l'API échoue (ex. pas de connexion) ou renvoie une structure inattendue, on évite le crash
    const rawList = homepage?.[homepageKey] ?? homepage?.attributes?.[homepageKey]?.data ?? [];
    const list = Array.isArray(rawList) ? rawList : rawList?.data ?? [];
    const homepageIds = list.map((item) => item.id).filter(Boolean);

    const homepageItems = homepageIds
        .map((id) => allItems.find((item) => item.id === id))
        .filter(Boolean);

    const hiddenItems = allItems.filter((item) => !homepageIds.includes(item.id));

    return { homepageItems, hiddenItems };
}
