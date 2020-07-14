import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';
import IFindByDayDTO from '../dtos/IFindByDayDTO';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderAvailabilityByDayService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IFindByDayDTO): Promise<IResponse> {
    const firstTime = 8;
    const eachHourOfDay = Array.from(
      { length: 10 },
      (_, index) => index + firstTime,
    );

    const appointments = await this.appointmentsRepository.findByDay({
      provider_id,
      day,
      month,
      year,
    });

    const actualTime = Date.now();

    const availability = eachHourOfDay.map(eachHour => {
      const available = appointments.find(appointment => {
        return getHours(appointment.date) === eachHour;
      });

      const compareTime = new Date(year, month - 1, day, eachHour);

      return {
        hour: eachHour,
        available: !available && isAfter(compareTime, actualTime),
      };
    });

    return availability;
  }
}
