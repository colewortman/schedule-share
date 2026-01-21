import { Router, Request, Response } from 'express';
import UserService from '../service/UserService';
import type { UserIdParams } from '../types/RouteParams';

const router = Router();

// Get all users
router.get('/users', async (_req: Request, res: Response) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get user by ID
router.get('/users/:id', async (req: Request<UserIdParams>, res: Response) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new user
router.post('/users', async (req: Request, res: Response) => {
    try {
        const { user_name, email, password } = req.body;
        const newUser = await UserService.createUser(user_name, email, password);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update an existing user
router.put('/users/:id', async (req: Request<UserIdParams>, res: Response) => {
    try {
        const { user_name, email } = req.body;
        const updatedUser = await UserService.updateUser(req.params.id, user_name, email);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a user
router.delete('/users/:id', async (req: Request<UserIdParams>, res: Response) => {
    try {
        await UserService.deleteUser(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;