import GroupRepository from "../../src/repository/GroupRepository";
import GroupService from "../../src/service/GroupService";

jest.mock("../../src/repository/GroupRepository");

describe('GroupService', () => {
    const TEST_GROUP_1 = {
        group_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        group_name: 'test1'
    }
    const TEST_GROUP_2 = {
        group_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        group_name: 'test2'
    }

    it('should return a list of groups', async () => {
    
        const mockGroups = [
            TEST_GROUP_1,
            TEST_GROUP_2
        ];

        jest.spyOn(GroupRepository, 'getAllGroups').mockResolvedValue(mockGroups);

        const result = await GroupService.getAllGroups();

        expect(result.length).toBeGreaterThan(0);
        expect(GroupRepository.getAllGroups).toHaveBeenCalledTimes(1);
    
    });

    it('should handle errors', async () => {
    
        jest.spyOn(GroupRepository, 'getAllGroups').mockRejectedValue(new Error('Database error'));
        await expect(GroupService.getAllGroups()).rejects.toThrow('Database error');
    
    });
})