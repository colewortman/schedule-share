import GroupRepository from "../repository/GroupRepository";
//import { v4 as uuidv4 } from 'uuid';

class GroupService {

    static async getAllGroups() {
        const groups = await GroupRepository.getAllGroups();
        return groups
    }

}

export default GroupService;