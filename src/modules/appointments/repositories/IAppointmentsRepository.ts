import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '../infra/typeorm/entities/Appointment';
import IFindByMonthDTO from '../dtos/IFindByMonthDTO';
import IFindByDayDTO from '../dtos/IFindByDayDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findByMonth({
    provider_id,
    month,
    year,
  }: IFindByMonthDTO): Promise<Appointment[]>;
  findByDay({
    provider_id,
    day,
    month,
    year,
  }: IFindByDayDTO): Promise<Appointment[]>;
}
