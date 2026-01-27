import { Router, Request, Response } from 'express'
import ScheduleService from '../service/SchedulesService'
//import type { IdParams } from '../types/RouteParams'

const router = Router();

router.get('/schedules', async (req: Request, res: Response) => {
    try {
        const schedules = await ScheduleService.getAllSchedules();
        res.status(200).json(schedules);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;