import { Router, Request, Response } from 'express';
import GroupService from "../service/GroupService";
//import type { IdParams } from '../types/RouteParams';

const router = Router();

router.get('/groups', async (_req: Request, res: Response) => {
    try {
        const groups = await GroupService.getAllGroups();
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;