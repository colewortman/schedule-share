import GroupRepository from "../../src/repository/GroupRepository";
import GroupService from "../../src/service/GroupService";

jest.mock("../../src/repository/GroupRepository");

describe('GroupService', () => {
    const TEST_GROUP_1 = {
        group_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        group_name: 'test1'
    };
    const TEST_GROUP_2 = {
        group_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        group_name: 'test2'
    };
    const TEST_GROUP_3 = {
        group_name: 'test3'
    };

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

    it('should return a single group', async () => {
        const expectedGroup = {
            group_id: TEST_GROUP_2.group_id,
            group_name: TEST_GROUP_2.group_name
        };

        jest.spyOn(GroupRepository, 'getGroupById').mockResolvedValue(expectedGroup);

        const result = await GroupService.getGroupById(TEST_GROUP_2.group_id);

        expect(result.group_id).toEqual(TEST_GROUP_2.group_id);
        expect(result.group_name).toEqual(TEST_GROUP_2.group_name);
        expect(GroupRepository.getGroupById).toHaveBeenCalledTimes(1);
    });

    it('should create a new group', async () => {
        const expectedGroup = {
            group_id: '...',
            group_name: TEST_GROUP_3.group_name
        };

        jest.spyOn(GroupRepository, 'createGroup').mockResolvedValue(expectedGroup);
        const newGroup = await GroupService.createGroup(TEST_GROUP_3.group_name);

        expect(newGroup).toBeDefined();
        expect(newGroup).toEqual(
            expect.objectContaining({
                group_id: newGroup.group_id,
                group_name: newGroup.group_name
            })
        );
        expect(GroupRepository.createGroup).toHaveBeenCalledTimes(1);
    });

    it('should update an existing group', async () => {
        const expectedGroup = {
            group_id: TEST_GROUP_1.group_id,
            group_name: TEST_GROUP_1.group_name
        };

        jest.spyOn(GroupRepository, 'updateGroup').mockResolvedValue(expectedGroup);
        const updatedGroup = await GroupRepository.updateGroup(TEST_GROUP_1.group_id, TEST_GROUP_1.group_name);

        expect(updatedGroup).toBeDefined();
        expect(updatedGroup).toEqual(
            expect.objectContaining({
                group_id: updatedGroup.group_id,
                group_name: updatedGroup.group_name
            })
        );
        expect(GroupRepository.updateGroup).toHaveBeenCalledTimes(1);
    });

    it('should delete an existing group', async () => {
        jest.spyOn(GroupRepository, 'deleteGroup').mockResolvedValue();
        const result = await GroupRepository.deleteGroup(TEST_GROUP_1.group_id);
        expect(result).toBeUndefined();
    });

    it('should handle errors when deleting groups', async () => {
        // Placeholder for future implementation
    });

    it('should handle errors', async () => {
        jest.spyOn(GroupRepository, 'getAllGroups').mockRejectedValue(new Error('Database error'));
        await expect(GroupService.getAllGroups()).rejects.toThrow('Database error');

        jest.spyOn(GroupRepository, 'getGroupById').mockRejectedValue(new Error('Database error'));
        await expect(GroupService.getGroupById(TEST_GROUP_1.group_id)).rejects.toThrow('Database error');

        jest.spyOn(GroupRepository, 'createGroup').mockRejectedValue(new Error('Database error'));
        await expect(GroupService.createGroup(TEST_GROUP_3.group_name)).rejects.toThrow('Database error');

        jest.spyOn(GroupRepository, 'updateGroup').mockRejectedValue(new Error('Database error'));
        await expect(GroupService.updateGroup(TEST_GROUP_1.group_id, TEST_GROUP_1.group_name)).rejects.toThrow('Database error');

        jest.spyOn(GroupRepository, 'deleteGroup').mockRejectedValue(new Error('Database error'));
        await expect(GroupService.deleteGroup(TEST_GROUP_1.group_id)).rejects.toThrow('Database error');
    });
});