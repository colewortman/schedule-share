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

    it('should create a group', async () => {
        const mockGroup: Group = { group_id: "3", group_name: "Group 3" };
        mockFetchFromApi.mockResolvedValue(mockGroup);

        const newGroup = await groupService.create({ group_name: "Group 3" });

        expect(newGroup).toEqual(mockGroup);
        expect(mockFetchFromApi).toHaveBeenCalledWith("/groups", { method: "POST", body: JSON.stringify({ group_name: "Group 3" }) });
    
    });

    it('should update a group', async () => {
    
        const mockGroup: Group = { group_id: "3", group_name: "Group 3"};
        mockFetchFromApi.mockResolvedValue(mockGroup);

        const updatedGroup = await groupService.update("3", { group_name: "Updated Group"});

        expect(updatedGroup.group_id).toEqual(mockGroup.group_id)
        expect(mockFetchFromApi).toHaveBeenCalledWith("/groups/3", { method: "PUT", body: JSON.stringify({ group_name: "Updated Group"}) });
    
    });

    it('should delete a group', async () => {

        mockFetchFromApi.mockResolvedValue(undefined);
        await groupService.delete("1");
        expect(mockFetchFromApi).toHaveBeenCalledWith("/groups/1", { method: "DELETE" });

    });
});
