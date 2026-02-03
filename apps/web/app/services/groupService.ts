import { fetchFromApi } from "./api";
import { Group } from "../types";

export const groupService = {
    getAll: () => fetchFromApi<Group[]>("/groups"),
    getById: (id: string) => fetchFromApi<Group>(`/groups/${id}`),
    create: (data: { group_name: string }) => fetchFromApi<Group>("/groups", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: { group_name?: string }) => fetchFromApi<Group>(`/groups/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => fetchFromApi<void>(`/groups/${id}`, { method: "DELETE" }),
};