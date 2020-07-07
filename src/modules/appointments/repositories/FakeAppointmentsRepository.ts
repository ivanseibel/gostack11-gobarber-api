import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';
import Appointment from '../infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private Appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointment = this.Appointments.find(item =>
      isEqual(item.date, date),
    );

    return appointment;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, {
      id: uuid(),
      provider_id,
      date,
    });

    this.Appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
