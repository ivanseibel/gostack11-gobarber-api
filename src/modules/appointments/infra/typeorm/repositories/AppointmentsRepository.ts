import { EntityRepository, Repository } from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

@EntityRepository(Appointment)
class AppointmentRepository extends Repository<IAppointmentsRepository> {
  public async findByDate(
    date: Date,
  ): Promise<IAppointmentsRepository | undefined> {
    const appointment = await this.findOne({
      where: { date },
    });

    return appointment;
  }
}

export default AppointmentRepository;
