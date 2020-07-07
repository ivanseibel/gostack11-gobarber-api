import AppError from '@shared/errors/AppError';
import FakeAppointmentRepository from '../repositories/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const appointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      appointmentRepository,
    );

    const appointment = await createAppointment.execute({
      provider_id: '123456',
      date: new Date(),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456');
  });

  it('should not be able to create a new appointment', async () => {
    const appointmentRepository = new FakeAppointmentRepository();
    const createAppointment = new CreateAppointmentService(
      appointmentRepository,
    );

    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      provider_id: '123456',
      date: appointmentDate,
    });

    expect(
      createAppointment.execute({
        provider_id: '123456',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
