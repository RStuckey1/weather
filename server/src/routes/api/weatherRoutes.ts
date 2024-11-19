import { Router, type Request, type Response } from 'express';

const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

router.post('/', async (req: Request, res: Response) => {
  try {
    const weather = await WeatherService.getWeatherForCity(req.body.cityName);
    await HistoryService.addCity(req.body.cityName);
    return res.status(200).json(weather);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    return res.status(200).json(history);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.delete('/history/:id', async (req: Request, res: Response) => {
  const cityID = req.params.id;
  await HistoryService.removeCity(cityID);
  res.json('History updated.');
});

export default router;
