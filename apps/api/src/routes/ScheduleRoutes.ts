import { Router, Request, Response } from 'express'
import ScheduleService from '../service/SchedulesService'
import { IdParams } from '../types/RouteParams';

const router = Router();

router.get('/schedules', async (_req: Request, res: Response) => {
    try {
        const schedules = await ScheduleService.getAllSchedules();
        res.status(200).json(schedules);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/schedules/groups', async (_req: Request, res: Response) => {
    try {
        const schedules = await ScheduleService.getAllGroupSchedules();
        res.status(200).json(schedules);
    } catch (error) {
        console.error('Error fetching group schedules:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/schedules/:id', async (req: Request<IdParams>, res: Response) => {
    try {
        const schedule = await ScheduleService.getScheduleById(req.params.id);
        res.status(200).json(schedule);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/schedules', async (req: Request, res: Response) => {
    try {
        const { schedule_id, user_id, group_id } = req.body;
        const newSchedule = await ScheduleService.createSchedule(schedule_id, user_id, group_id);
        res.status(201).json(newSchedule);
    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/schedules/:id', async (req: Request<IdParams>, res: Response) => {
    try {
        await ScheduleService.deleteSchedule(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;