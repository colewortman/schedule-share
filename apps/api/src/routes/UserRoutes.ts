import { Router, Request, Response } from 'express';
import UserService from '../service/UserService';

const router = Router();

// Example route: Get all users
router.get('/users', async (_req: Request, res: Response) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;