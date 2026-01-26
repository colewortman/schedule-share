import GroupRepository from "../repository/GroupRepository";
import { v4 as uuidv4 } from 'uuid';

class GroupService {

    static async getAllGroups() {
        const groups = await GroupRepository.getAllGroups();
        return groups;
    }

    static async getGroupById(group_id: string) {
        const group = await GroupRepository.getGroupById(group_id);
        return group;
    }

    static async createGroup(group_name: string) {
        const group_id = uuidv4();
        const group = await GroupRepository.createGroup(group_id, group_name);
        return group;
    }

    static async updateGroup(group_id: string, group_name: string) {
        const group = await GroupRepository.updateGroup(group_id, group_name);
        return group;
    }

    static async deleteGroup(group_id: string) {
        await GroupRepository.deleteGroup(group_id);
    }

}

export default GroupService;