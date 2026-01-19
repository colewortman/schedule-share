create schema if not exists schedule;

create extension if not exists btree_gist;

create table schedule.users (
    user_id uuid primary key,
    user_name text not null unique,
    email text not null unique,
    password_hash text not null
);

create table schedule.groups (
    group_id uuid primary key,
    group_name text not null
);

create table schedule.group_members (
    user_id uuid not null references schedule.users (user_id) on delete cascade,
    group_id uuid not null references schedule.groups (group_id) on delete cascade,
    role text default 'member',
    primary key (user_id, group_id)
);

create table schedule.schedules (
    schedule_id uuid primary key,
    user_id uuid references schedule.users (user_id) on delete cascade,
    group_id uuid references schedule.groups (group_id) on delete cascade,
    check (
        (
            user_id is not null
            and group_id is null
        )
        or (
            user_id is null
            and group_id is not null
        )
    )
);

create table schedule.activity_types (
    activity_type_id uuid primary key,
    activity_name text not null unique
);

create table schedule.entries (
    entry_id uuid primary key,
    schedule_id uuid not null references schedule.schedules (schedule_id) on delete cascade,
    entry_day smallint not null check (entry_day between 0 and 6),
    start_time int check (start_time between 0 and 1439),
    end_time int check (end_time between 1 and 1440),
    activity_type uuid references schedule.activity_types (activity_type_id) on delete cascade,
    created_by uuid references schedule.users (user_id) on delete cascade,
    check (start_time < end_time),
    exclude using gist (
        schedule_id
        with
            =,
            entry_day
        with
            =,
            int4range (start_time, end_time)
        with
            &&
    )
);