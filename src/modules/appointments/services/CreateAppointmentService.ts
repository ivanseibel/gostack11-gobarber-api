import { startOfHour } from 'date-fns';
import { getCustomRepository, getRepository } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

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

    return appointment;
  }
}

export default CreateAppointmentService;
