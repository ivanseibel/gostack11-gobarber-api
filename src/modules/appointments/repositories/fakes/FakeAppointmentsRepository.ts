import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import { uuid } from 'uuidv4';
import { isEqual, startOfMonth, endOfMonth, getMonth, getYear } from 'date-fns';
import Appointment from '../../infra/typeorm/entities/Appointment';
import IFindByMonthDTO from '../../dtos/IFindByMonthDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointment = this.appointments.find(item =>
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

    this.appointments.push(appointment);

    return appointment;
  }

  public async findByMonth({
    provider_id,
    month,
    year,
  }: IFindByMonthDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      let match =
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year;
      if (provider_id) {
        match = match && appointment.provider_id === provider_id;
      }

      return match;
    });

    return appointments;
  }
}

export default AppointmentsRepository;
