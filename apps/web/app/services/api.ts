const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!res.ok) {
        throw new Error(await res.text());
    }
    return res.json() as Promise<T>;
}