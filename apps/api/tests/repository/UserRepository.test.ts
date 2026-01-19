import UserRepository from "../../src/repository/UserRepository";
import dbClient from "../../src/dbconfig";

describe('UserRepository', () => {
    beforeAll(async () => {
        await dbClient.connect();

        await dbClient.query(`
      insert into schedule.users (user_id, user_name, email, password_hash)
      values (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'testuser',
        'test@example.com',
        'hash'
      )
      on conflict do nothing;
    `);
    });

    afterAll(async () => {
        await dbClient.query(`delete from schedule.users`);
        await dbClient.end();
        // testing CI
    });

    it('should retrieve all users from the database', async () => {
        const users = await UserRepository.getAllUsers();
        expect(users.length).toBeGreaterThan(0);
        expect(users).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    user_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
                    user_name: 'testuser',
                    email: 'test@example.com',
                }),
            ])
        );
    });
});