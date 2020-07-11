import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '../infra/typeorm/entities/Appointment';
import IFindByMonthDTO from '../dtos/IFindByMonthDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findByMonth({
    provider_id,
    month,
    year,
  }: IFindByMonthDTO): Promise<Appointment[]>;
}
