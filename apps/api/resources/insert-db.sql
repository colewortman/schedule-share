-- Users
INSERT INTO
    schedule.users (
        user_id,
        user_name,
        email,
        password_hash
    )
VALUES (
        '11111111-1111-1111-1111-111111111111',
        'alice',
        'alice@example.com',
        'hash1'
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'bob',
        'bob@example.com',
        'hash2'
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'carol',
        'carol@example.com',
        'hash3'
    );

-- Groups
INSERT INTO
    schedule.groups (group_id, group_name)
VALUES (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'Engineering Team'
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'Marketing Team'
    );

-- Group members
INSERT INTO
    schedule.group_members (user_id, group_id, role)
VALUES (
        '11111111-1111-1111-1111-111111111111',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'admin'
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'member'
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'admin'
    );

-- Schedules
-- User schedules (group_id NULL)
INSERT INTO
    schedule.schedules (
        schedule_id,
        user_id,
        group_id
    )
VALUES (
        'aaaaaaaa-1111-1111-1111-aaaaaaaa1111',
        '11111111-1111-1111-1111-111111111111',
        NULL
    ),
    (
        'bbbbbbbb-2222-2222-2222-bbbbbbbb2222',
        '22222222-2222-2222-2222-222222222222',
        NULL
    );

-- Group schedules (user_id NULL)
INSERT INTO
    schedule.schedules (
        schedule_id,
        user_id,
        group_id
    )
VALUES (
        'cccccccc-aaaa-aaaa-aaaa-ccccccccaaaa',
        NULL,
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    ),
    (
        'dddddddd-bbbb-bbbb-bbbb-ddddddddbbbb',
        NULL,
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
    );

-- Activity types
INSERT INTO
    schedule.activity_types (
        activity_type_id,
        activity_name
    )
VALUES (
        'aaaa1111-aaaa-1111-aaaa-1111aaaa1111',
        'Meeting'
    ),
    (
        'bbbb2222-bbbb-2222-bbbb-2222bbbb2222',
        'Coding'
    ),
    (
        'cccc3333-cccc-3333-cccc-3333cccc3333',
        'Lunch'
    );

-- Entries
-- User schedule entries
INSERT INTO
    schedule.entries (
        entry_id,
        schedule_id,
        entry_day,
        start_time,
        end_time,
        activity_type,
        created_by
    )
VALUES (
        'eeeeeeee-1111-1111-1111-eeeeeeee1111',
        'aaaaaaaa-1111-1111-1111-aaaaaaaa1111',
        1,
        540,
        600,
        'aaaa1111-aaaa-1111-aaaa-1111aaaa1111',
        '11111111-1111-1111-1111-111111111111'
    ),
    (
        'ffffffff-2222-2222-2222-ffffffff2222',
        'bbbbbbbb-2222-2222-2222-bbbbbbbb2222',
        2,
        600,
        720,
        'bbbb2222-bbbb-2222-bbbb-2222bbbb2222',
        '22222222-2222-2222-2222-222222222222'
    );

-- Group schedule entries
INSERT INTO
    schedule.entries (
        entry_id,
        schedule_id,
        entry_day,
        start_time,
        end_time,
        activity_type,
        created_by
    )
VALUES (
        '11111111-aaaa-aaaa-aaaa-111111111111',
        'cccccccc-aaaa-aaaa-aaaa-ccccccccaaaa',
        0,
        480,
        540,
        'aaaa1111-aaaa-1111-aaaa-1111aaaa1111',
        '11111111-1111-1111-1111-111111111111'
    ),
    (
        '22222222-bbbb-bbbb-bbbb-222222222222',
        'dddddddd-bbbb-bbbb-bbbb-ddddddddbbbb',
        3,
        720,
        780,
        'cccc3333-cccc-3333-cccc-3333cccc3333',
        '33333333-3333-3333-3333-333333333333'
    );