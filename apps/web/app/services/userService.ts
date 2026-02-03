import { fetchFromApi } from "./api";
import { User } from "../types";

export const userService = {
    getAll: () => fetchFromApi<User[]>("/users"),
    getById: (id: string) => fetchFromApi<User>(`/users/${id}`),
    create: (data: { user_name: string; email: string; password: string }) => fetchFromApi<User>("/users", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: { user_name?: string; email?: string }) => fetchFromApi<User>(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => fetchFromApi<void>(`/users/${id}`, { method: "DELETE" }),
};