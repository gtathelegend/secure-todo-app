const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '');

export const getStrapiApiBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    return normalizeBaseUrl(apiUrl);
  }

  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (strapiUrl) {
    return `${normalizeBaseUrl(strapiUrl)}/api`;
  }

  throw new Error(
    'Missing Strapi base URL: set NEXT_PUBLIC_API_URL or NEXT_PUBLIC_STRAPI_URL (Strapi base URL).'
  );
};
