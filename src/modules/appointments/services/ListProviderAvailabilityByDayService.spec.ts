import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAvailabilityByDay from './ListProviderAvailabilityByDayService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;

let listProviderAvailabilityByDay: ListProviderAvailabilityByDay;

describe('ListProviderAvailabilityByMonthService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderAvailabilityByDay = new ListProviderAvailabilityByDay(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to show profile', async () => {
    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 1, 10, 30, 0),
      provider_id: '10',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 2, 10, 30, 0),
      provider_id: '1',
    });

    // Following appointments are to fill all the available day
    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 1, 9, 0, 0),
      provider_id: '1',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 1, 10, 0, 0),
      provider_id: '1',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 1, 11, 0, 0),
      provider_id: '1',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 1, 10, 30).getTime();
    });

    const availability = await listProviderAvailabilityByDay.execute({
      provider_id: '1',
      day: 1,
      month: 6,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        {
          hour: 8,
          available: false,
        },
        {
          hour: 9,
          available: false,
        },
        {
          hour: 10,
          available: false,
        },
        {
          hour: 11,
          available: false,
        },
        {
          hour: 12,
          available: true,
        },
        {
          hour: 13,
          available: true,
        },
      ]),
    );
  });
});
