import { startOfHour } from 'date-fns';

import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentRepository: AppointmentRepository;

  constructor(appointmentRepository: AppointmentRepository) {
    this.appointmentRepository = appointmentRepository;
  }

  execute({ provider, date }: Request): Appointment {
    const appointmentDate = startOfHour(date);

    const timeUnavailable = this.appointmentRepository.findByDate(
      appointmentDate,
    );

    if (timeUnavailable) {
      throw Error('Time is not available');
    }

    const appointment = this.appointmentRepository.create({
      provider,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
