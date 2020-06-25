import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';

import AppointmentRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = startOfHour(parseISO(date));

  const timeUnavailable = AppointmentRepository.findByDate(parsedDate);

  if (timeUnavailable) {
    return response.status(400).json({ message: 'Time is not available' });
  }

  const appointment = AppointmentRepository.create(provider, parsedDate);

  return response.json(appointment);
});

appointmentsRouter.get('/', (request, response) => {
  return response.json(AppointmentRepository.all());
});

export default appointmentsRouter;
