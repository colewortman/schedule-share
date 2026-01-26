import GroupRepository from "../../src/repository/GroupRepository";
import dbClient from "../../src/dbconfig";
import { resetCounter } from "../__mocks__/uuid";

describe('Group repository', () => {

    const TEST_GROUP_1 = {
        group_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        group_name: 'test1',
    };
    const TEST_GROUP_2 = {
        group_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        group_name: 'test2',
    };
    const TEST_GROUP_3 = {
        group_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        group_name: 'test3'
    }

    beforeAll(async () => {
        await dbClient.connect();
    });
    
    beforeEach(async () => {
    
        resetCounter();

        await dbClient.query('delete from schedule.groups')

        await dbClient.query(`
            insert into schedule.groups (group_id, group_name)
            values 
                ($1, $2),
                ($3, $4)
        `, [
            TEST_GROUP_1.group_id, TEST_GROUP_1.group_name,
            TEST_GROUP_2.group_id, TEST_GROUP_2.group_name
        ]);
    });

    afterAll(async () => {
        await dbClient.query('delete from schedule.groups');
        await dbClient.end();
    });

    it('should get all groups from the database', async () => {
    
        const groups = await GroupRepository.getAllGroups();

        expect(groups.length).toBeGreaterThan(0);
        expect(groups).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    group_id: TEST_GROUP_1.group_id,
                    group_name: TEST_GROUP_1.group_name
                }),
                expect.objectContaining({
                    group_id: TEST_GROUP_2.group_id,
                    group_name: TEST_GROUP_2.group_name
                })
            ])
        );
    });

    it('should get one group from the database', async () => {
    
        const group = await GroupRepository.getGroupById(TEST_GROUP_1.group_id);

        expect(group).toBeDefined();
        expect(group).toEqual(
            expect.objectContaining({
                group_id: TEST_GROUP_1.group_id,
                group_name: TEST_GROUP_1.group_name,
            }),
        );
    });

    it('should create a new group in the database', async () => {
    
        const newGroup = await GroupRepository.createGroup(TEST_GROUP_3.group_id, TEST_GROUP_3.group_name);

        expect(newGroup).toBeDefined();
        expect(newGroup).toEqual(
            expect.objectContaining({
                group_id: newGroup.group_id,
                group_name: newGroup.group_name
            }),
        );
    });

    it('should update an existing group in the database', async () => {
    
        const updatedGroup = await GroupRepository.updateGroup(TEST_GROUP_2.group_id, 'updatedGroup');

        expect(updatedGroup).toBeDefined();
        expect(updatedGroup).toEqual(
            expect.objectContaining({
                group_id: TEST_GROUP_2.group_id,
                group_name: 'updatedGroup'
            }),
        );
    });

    it('should delete an existing group in the database', async () => {
    
        await GroupRepository.deleteGroup(TEST_GROUP_2.group_id);
        const group = await GroupRepository.getGroupById(TEST_GROUP_2.group_id);

        expect(group).toBeUndefined();
    });
});