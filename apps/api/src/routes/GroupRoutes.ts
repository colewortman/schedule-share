import { Router, Request, Response } from 'express';
import GroupService from "../service/GroupService";
import { IdParams } from '../types/RouteParams';
//import type { IdParams } from '../types/RouteParams';

const router = Router();

router.get('/groups', async (_req: Request, res: Response) => {
    try {
        const groups = await GroupService.getAllGroups();
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/groups/:id', async (req: Request<IdParams>, res: Response) => {
    try {
        const group = await GroupService.getGroupByID(req.params.id)
        res.status(200).json(group);
    } catch (error) {
        console.error('Error getting group:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/groups', async (req: Request, res: Response) => {
    try {
        const newGroup = await GroupService.createGroup(req.body)
        res.status(201).json(newGroup);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/groups/:id', async (req: Request<IdParams>, res: Response) => {
    try {
        const updatedGroup = await GroupService.updateGroup(req.params.id, req.body);
        if (!updatedGroup) {
            return res.status(404).json({ error: 'Group not found'});
        }
        res.status(200).json(updatedGroup);
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;