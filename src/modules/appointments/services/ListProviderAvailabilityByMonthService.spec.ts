import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProvidersService from './ListProvidersService';
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
    // Should not be returned
    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 1, 10, 30, 0),
      provider_id: '10',
    });
    // Should not be returned
    await fakeAppointmentsRepository.create({
      date: new Date(2020, 6, 1, 10, 30, 0),
      provider_id: '1',
    });
    // Should be returned
    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 1, 10, 30, 0),
      provider_id: '1',
    });
    // Should be returned
    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 27, 10, 30, 0),
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
        {
          day: 27,
          available: false,
        },
      ]),
    );
  });
});
