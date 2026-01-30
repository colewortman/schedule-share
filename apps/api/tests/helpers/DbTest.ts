import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
    TestUser,
    TestGroup,
    TestGroupMember,
    TestSchedule,
    TestActivityType,
    TestEntry
} from '../types/testData.types';

export class DbTest {
    constructor(private db: Pool) {}

    private tableNames = [
        'entries', 
        'schedules', 
        'group_members', 
        'activity_types', 
        'groups', 
        'users'
    ];

    async cleanDatabase(): Promise<void> {
        for (const name of this.tableNames) {
            await this.db.query(`DELETE FROM schedule.${name}`);
        }
    }

    async setupDatabase(): Promise<void> {
        const sqlFilePath = join(__dirname, '../../resources/create-db.sql');
        const sql = readFileSync(sqlFilePath, 'utf-8');
        await this.db.query(sql);
    }

    async insertTestData(data: {
        users?: TestUser[];
        groups?: TestGroup[];
        groupMembers?: TestGroupMember[];
        schedules?: TestSchedule[];
        activityTypes?: TestActivityType[];
        entries?: TestEntry[];
    }): Promise<void> {
        if (data.users) {
            for (const user of data.users) {
                await this.db.query(
                    'INSERT INTO schedule.users (user_id, user_name, email, password_hash) VALUES ($1, $2, $3, $4)',
                    [user.user_id, user.user_name, user.email, user.password_hash]
                );
            }
        }

        if (data.groups) {
            for (const group of data.groups) {
                await this.db.query(
                    'INSERT INTO schedule.groups (group_id, group_name) VALUES ($1, $2)',
                    [group.group_id, group.group_name]
                );
            }
        }

        if (data.schedules) {
            for (const schedule of data.schedules) {
                await this.db.query(
                    'INSERT INTO schedule.schedules (schedule_id, user_id, group_id) VALUES ($1, $2, $3)',
                    [schedule.schedule_id, schedule.user_id, schedule.group_id]
                );
            }
        }
    }
}