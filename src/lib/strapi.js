/**
 * Fetches data from the Strapi API
 * @param {Object} options - The options object
 * @param {string} options.endpoint - The endpoint to fetch from
 * @param {Object} [options.query] - The query parameters to add to the url
 * @param {string} [options.wrappedByKey] - The key to unwrap the response from
 * @param {boolean} [options.wrappedByList] - If the response is a list, unwrap it
 * @returns {Promise}
 */

export default async function fetchApi({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}) {
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.slice(1);
  }

  const url = new URL(`${import.meta.env.STRAPI_URL}/api/${endpoint}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  const res = await fetch(url.toString());
  let data = await res.json();

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  if (wrappedByList) {
    data = data[0];
  }

  return data;
}