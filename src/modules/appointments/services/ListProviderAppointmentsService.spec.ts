import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list appointments from a provider within a day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 1, 10),
      user_id: 'user-id',
      provider_id: 'provider-id',
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 1, 11),
      user_id: 'user-id',
      provider_id: 'provider-id',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 1, 7).getTime();
    });

    const availability = await listProviderAppointments.execute({
      provider_id: 'provider-id',
      day: 1,
      month: 6,
      year: 2020,
    });

    expect(availability).toEqual([appointment1, appointment2]);
  });

  it('should be able to list appointments from a provider within a day using cache', async () => {
    await fakeAppointmentsRepository.create({
      date: new Date(2020, 5, 1, 10),
      user_id: 'user-id',
      provider_id: 'provider-id',
    });

    const key = `provider-appointments:provider-id:2020-6-1`;

    const appointment = await listProviderAppointments.execute({
      provider_id: 'provider-id',
      day: 1,
      month: 6,
      year: 2020,
    });

    appointment[0].user_id = 'cached';

    await fakeCacheProvider.invalidate(key);
    await fakeCacheProvider.save(key, appointment);

    const cachedAppointment = await listProviderAppointments.execute({
      provider_id: 'provider-id',
      day: 1,
      month: 6,
      year: 2020,
    });

    expect(cachedAppointment[0].user_id).toBe('cached');
  });
});
