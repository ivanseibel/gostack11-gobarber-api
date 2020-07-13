import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAvailabilityByMonth from './ListProviderAvailabilityByMonthService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;

let listProviderAvailabilityByMonth: ListProviderAvailabilityByMonth;

describe('ListProviderAvailabilityByMonthService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderAvailabilityByMonth = new ListProviderAvailabilityByMonth(
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
      date: new Date(2020, 5, 1, 8, 0, 0),
      provider_id: '1',
    });

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

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 1, 12, 0, 0),
      provider_id: '1',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 1, 13, 0, 0),
      provider_id: '1',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 1, 14, 0, 0),
      provider_id: '1',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 1, 15, 0, 0),
      provider_id: '1',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 1, 16, 0, 0),
      provider_id: '1',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 1, 17, 0, 0),
      provider_id: '1',
    });

    const availability = await listProviderAvailabilityByMonth.execute({
      provider_id: '1',
      month: 6,
      year: 2020,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        {
          day: 1,
          available: false,
        },
        {
          day: 2,
          available: true,
        },
      ]),
    );
  });
});
