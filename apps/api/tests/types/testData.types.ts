
export interface TestUser {
    user_id: string;
    user_name: string;
    email: string;
    password_hash: string;
}

export interface TestGroup {
    group_id: string;
    group_name: string;
}

export interface TestGroupMember {
    user_id: string;
    group_id: string;
    role?: string;
}

export interface TestSchedule {
    schedule_id: string;
    user_id: string | null;
    group_id: string | null;
}

export interface TestActivityType {
    activity_type_id: string;
    activity_name: string;
}

export interface TestEntry {
    entry_id: string;
    schedule_id: string;
    entry_day: number;
    start_time: number;
    end_time: number;
    activity_type: string | null;
    created_by: string | null;
}