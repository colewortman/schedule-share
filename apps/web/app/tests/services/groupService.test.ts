import { describe, it, expect, vi, beforeEach } from "vitest";
import { groupService } from "../../services/groupService";
import { fetchFromApi } from "../../services/api";
import { Group } from "../../types";

vi.mock("../../services/api", () => ({
    fetchFromApi: vi.fn(),
}));

const mockFetchFromApi = vi.mocked(fetchFromApi);

describe("groupService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should get all groups", async () => {
        const mockGroups: Group[] = [
            { group_id: "1", group_name: "Group 1" },
            { group_id: "2", group_name: "Group 2" },
        ];
        mockFetchFromApi.mockResolvedValue(mockGroups);

        const groups = await groupService.getAll();

        expect(groups).toEqual(mockGroups);
        expect(mockFetchFromApi).toHaveBeenCalledWith("/groups");
    });

    it("should get a group by id", async () => {
        const mockGroup: Group = { group_id: "1", group_name: "Group 1" };
        mockFetchFromApi.mockResolvedValue(mockGroup);

        const group = await groupService.getById("1");

        expect(group).toEqual(mockGroup);
        expect(mockFetchFromApi).toHaveBeenCalledWith("/groups/1");
    });
});
