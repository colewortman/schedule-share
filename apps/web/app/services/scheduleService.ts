import { fetchFromApi } from "./api";
import { Schedule } from "../types";

export const scheduleService = {
    getAll: () => fetchFromApi<Schedule[]>("/schedules"),
    getById: (id: string) => fetchFromApi<Schedule>(`/schedules/${id}`),
    create: (data: { user_id: string | null; group_id: string | null }) => fetchFromApi<Schedule>("/schedules", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: string) => fetchFromApi<void>(`/schedules/${id}`, { method: "DELETE" }),
};