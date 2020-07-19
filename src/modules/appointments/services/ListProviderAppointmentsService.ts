import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IListProviderAppointmentsDTO from '../dtos/IListProviderAppointmentsDTO';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IListProviderAppointmentsDTO): Promise<Appointment[]> {
    const key = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.recover<Appointment[]>(key);

    if (!appointments) {
      appointments = await this.appointmentsRepository.findByDay({
        provider_id,
        day,
        month,
        year,
      });

      await this.cacheProvider.save(key, appointments);
    }

    return appointments;
  }
}
