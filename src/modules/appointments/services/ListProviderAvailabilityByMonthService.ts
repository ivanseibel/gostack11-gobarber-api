import { injectable, inject } from 'tsyringe';
import { getDate, getDaysInMonth, isAfter } from 'date-fns';
import IFindByMonthDTO from '../dtos/IFindByMonthDTO';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderAvailabilityByMonthService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IFindByMonthDTO): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findByMonth({
      provider_id,
      month,
      year,
    });

    const numberOfDaysInMonth = getDaysInMonth(new Date(2020, month - 1));

    const eachDayInMonth = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const availability = eachDayInMonth.map(eachDay => {
      const compareDate = new Date(year, month - 1, eachDay, 23, 59, 59);

      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === eachDay;
      });

      return {
        day: eachDay,
        available:
          isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}
