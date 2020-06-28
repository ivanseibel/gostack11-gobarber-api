import { startOfHour } from 'date-fns';
import { getCustomRepository, getRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import AppError from '../errors/AppError';
import User from '../models/User';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const usersRepository = getRepository(User);

    const provider = await usersRepository.findOne({
      where: { id: provider_id },
    });

    if (!provider) {
      throw new AppError('Provider not found', 404);
    }

    const appointmentDate = startOfHour(date);

    const timeUnavailable = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (timeUnavailable) {
      throw new AppError('Time is not available');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
