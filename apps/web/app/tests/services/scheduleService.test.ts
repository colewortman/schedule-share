import { describe, expect, it, vi, beforeEach } from 'vitest';
import { scheduleService } from "../../services/scheduleService";
import { fetchFromApi } from "../../services/api";
import { Schedule } from "../../types";

vi.mock("../../services/api", () => ({
    fetchFromApi: vi.fn(),
}));

const mockFetchFromApi = vi.mocked(fetchFromApi);

describe('scheduleService', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should get all schedules', async () => {
    
        const mockSchedules: Schedule[] = [
            {
                schedule_id: "1",
                user_id: "1",
                group_id: null
            },
            {
                schedule_id: "2",
                user_id: null,
                group_id: "1"
            },
        ];
        
        mockFetchFromApi.mockResolvedValue(mockSchedules);

        const schedules = await scheduleService.getAll();
        expect(schedules).toEqual(mockSchedules);
        expect(mockFetchFromApi).toHaveBeenCalledWith("/schedules");
    
    });

    it('should get a schedule by id', async () => {
    
        const mockSchedule: Schedule = {
            schedule_id: "1",
            user_id: "1",
            group_id: null
        };

        mockFetchFromApi.mockResolvedValue(mockSchedule);

        const schedule = await scheduleService.getById("1");
        expect(schedule).toEqual(mockSchedule);
        expect(mockFetchFromApi).toHaveBeenCalledWith("/schedules/1");
    
    });

    it('should create a new schedule', async () => {
    
        const mockSchedule: Schedule = {
            schedule_id: "1",
            user_id: "1",
            group_id: null
        };

        mockFetchFromApi.mockResolvedValue(mockSchedule);

        const newSchedule = await scheduleService.create({ user_id: "1", group_id: null });
        expect(newSchedule).toEqual(mockSchedule);
        expect(mockFetchFromApi).toHaveBeenCalledWith("/schedules", { method: "POST", body: JSON.stringify({ user_id: "1", group_id: null }) });
    
    });

    it('should delete a schedule', async () => {
    
        mockFetchFromApi.mockResolvedValue(undefined);
        await scheduleService.delete("1");
        expect(mockFetchFromApi).toHaveBeenCalledWith("/schedules/1", { method: "DELETE" });
    
    });

});