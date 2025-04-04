import fetchApi from './strapi';

export async function fetchSortedCategory({ category, homepageKey, lang }) {
    const allItems = await fetchApi({
        endpoint: `${category}?populate=*`,
        wrappedByKey: 'data',
        locale: lang,
    });

    const homepage = await fetchApi({
        endpoint: `homepage?populate=${homepageKey}`,
        wrappedByKey: 'data',
        locale: lang,
    });

    const homepageIds = homepage[homepageKey]?.map((item) => item.id) || [];

    const homepageItems = homepageIds
        .map((id) => allItems.find((item) => item.id === id))
        .filter(Boolean);

    const hiddenItems = allItems.filter((item) => !homepageIds.includes(item.id));

    return { homepageItems, hiddenItems };
}
