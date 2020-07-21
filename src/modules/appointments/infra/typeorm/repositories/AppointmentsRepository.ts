import { getRepository, Repository, Between } from 'typeorm';
import { startOfMonth, endOfMonth } from 'date-fns';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindByMonthDTO from '@modules/appointments/dtos/IFindByMonthDTO';
import IFindByDayDTO from '@modules/appointments/dtos/IFindByDayDTO';
import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    return this.ormRepository.findOne({ where: { date, provider_id } });
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });

    return this.ormRepository.save(appointment);
  }

  public async findByMonth({
    provider_id,
    month,
    year,
  }: IFindByMonthDTO): Promise<Appointment[]> {
    const firstDay = startOfMonth(new Date(year, month - 1, 1));
    const lastDay = endOfMonth(new Date(year, month - 1, 1));

    const where = provider_id
      ? { provider_id, date: Between(firstDay, lastDay) }
      : { date: Between(firstDay, lastDay) };

    return this.ormRepository.find(where);
  }

  public async findByDay({
    provider_id,
    day,
    month,
    year,
  }: IFindByDayDTO): Promise<Appointment[]> {
    const startDay = new Date(year, month - 1, day, 0, 0);
    const endDay = new Date(year, month - 1, day, 23, 59);

    const where = provider_id
      ? { provider_id, date: Between(startDay, endDay) }
      : { date: Between(startDay, endDay) };

    const appointments = await this.ormRepository.find({
      ...where,
      relations: ['user'],
    });

    return appointments;
  }
}

export default AppointmentsRepository;
