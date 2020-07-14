import { injectable, inject } from 'tsyringe';
import IListProviderAppointmentsDTO from '../dtos/IListProviderAppointmentsDTO';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IListProviderAppointmentsDTO): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.findByDay({
      provider_id,
      day,
      month,
      year,
    });

    return appointments;
  }
}
