/// <reference types="vite/client" />
export const getAssetPath = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('blob:')) return path;

    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const baseUrl = import.meta.env.BASE_URL || '/';

    // Ensure baseUrl ends with a slash and combine
    const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${base}${cleanPath}`;
};
