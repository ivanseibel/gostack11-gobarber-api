import { Router } from 'express';
import { parseISO } from 'date-fns';

import AppointmentRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();
const appointmentRepository = new AppointmentRepository();
const createAppointmentService = new CreateAppointmentService(
  appointmentRepository,
);

appointmentsRouter.post('/', (request, response) => {
  try {
    const { provider, date } = request.body;

    const parsedDate = parseISO(date);

    const appointment = createAppointmentService.execute({
      date: parsedDate,
      provider,
    });

    return response.json(appointment);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

appointmentsRouter.get('/', (request, response) => {
  return response.json(appointmentRepository.all());
});

export default appointmentsRouter;
