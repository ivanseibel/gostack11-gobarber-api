import { getRepository, Repository, Between } from 'typeorm';
import { startOfMonth, endOfMonth } from 'date-fns';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindByMonthDTO from '@modules/appointments/dtos/IFindByMonthDTO';
import Appointment from '../entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    return this.ormRepository.findOne({ where: { date } });
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, date });

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
      ? { id: provider_id, date: Between(firstDay, lastDay) }
      : { date: Between(firstDay, lastDay) };

    return this.ormRepository.find(where);
  }
}

export default AppointmentsRepository;
