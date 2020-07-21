import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDay } from 'date-fns';
import IFindByDayDTO from '@modules/appointments/dtos/IFindByDayDTO';
import Appointment from '../../infra/typeorm/entities/Appointment';
import IFindByMonthDTO from '../../dtos/IFindByMonthDTO';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const appointment = this.appointments.find(
      item => isEqual(item.date, date) && item.provider_id === provider_id,
    );

    return appointment;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), provider_id, user_id, date });

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

  public async findByDay({
    provider_id,
    day,
    month,
    year,
  }: IFindByDayDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(appointment => {
      let match =
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year &&
        getDay(appointment.date) === day;
      if (provider_id) {
        match = match && appointment.provider_id === provider_id;
      }

      return match;
    });

    return appointments;
  }
}

export default AppointmentsRepository;
