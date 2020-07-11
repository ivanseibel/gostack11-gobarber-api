import { injectable, inject } from 'tsyringe';
import { getDate, endOfMonth } from 'date-fns';
import IFindByMonthDTO from '../dtos/IFindByMonthDTO';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IFindByMonthDTO): Promise<IResponse> {
    const endDay = getDate(endOfMonth(new Date(2020, month - 1, 1)));

    const appointments = await this.appointmentsRepository.findByMonth({
      provider_id,
      month,
      year,
    });

    const daysOfMonth = [];

    for (let i = 1; i <= endDay; i += 1) {
      const available =
        appointments.findIndex(appointment => {
          return getDate(appointment.date) === i;
        }) === -1;
      const availability = {
        day: i,
        available,
      };

      daysOfMonth.push(availability);
    }

    return daysOfMonth;
  }
}
