import AppError from '@shared/errors/AppError';
import { addHours, addMinutes } from 'date-fns';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const appointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      appointmentRepository,
    );

    const appointment = await createAppointment.execute({
      user_id: 'user-id',
      provider_id: 'provider-id',
      date: addHours(new Date(), 1),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-id');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      appointmentRepository,
    );

    const appointmentDate = addHours(new Date(), 1);

    await createAppointment.execute({
      user_id: 'user-id',
      provider_id: 'provider-id',
      date: appointmentDate,
    });

    await expect(
      createAppointment.execute({
        user_id: 'user-id',
        provider_id: 'provider-id',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointments on the past', async () => {
    const appointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      appointmentRepository,
    );

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 1, 11, 0).getTime();
    });

    await expect(
      createAppointment.execute({
        user_id: 'user-id',
        provider_id: 'provider-id',
        date: new Date(2020, 5, 1, 8, 0),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointments to the logged user', async () => {
    const appointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      appointmentRepository,
    );

    await expect(
      createAppointment.execute({
        user_id: 'user-id',
        provider_id: 'user-id',
        date: addMinutes(new Date(), 30),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
