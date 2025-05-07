export const BASE_URL = 'https://ltu-i0015n-2024-web.azurewebsites.net';
export const IMAGE_API_URL = `${BASE_URL}/images`;
export const LOGIN_URL = `${BASE_URL}/login`;

interface Attribution {
    username: string;
    name: string;
    url: string;
}

interface Image {
    path: string;
    description: string;
    attrib: Attribution;
}

export interface ImageResponse {
    results: Image[];
}

